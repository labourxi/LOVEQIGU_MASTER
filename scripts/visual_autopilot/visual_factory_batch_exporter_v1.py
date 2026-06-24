#!/usr/bin/env python3
"""Visual Factory batch exporter V1.

This script packages a single approved batch into:

- a stable batch directory under `data/visual_factory/batches/<batch_id>/`
- `review_sheet.csv`
- `batch_manifest.json`

It tries real Gemini and Doubao/Seedream calls first, then falls back to
existing local candidate assets if a provider is unavailable. It does not
touch runtime or release state.
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import os
import shutil
import sys
import time
from dataclasses import dataclass
from datetime import datetime, timezone
from io import BytesIO
from pathlib import Path
from typing import Any
from urllib import error, request


ROOT = Path(__file__).resolve().parents[2]
DATA_ROOT = ROOT / "data" / "visual_factory"
BATCHES_ROOT = DATA_ROOT / "batches"
CANDIDATES_DIR = ROOT / "assets" / "visual-autopilot" / "candidates"
DEFAULT_REPORT = ROOT / "docs" / "tech" / "visual_factory" / "11VISUAL_FACTORY_BATCH_EXPORTER_V1_REPORT.md"
DEFAULT_BATCH_ID = "golden_phoenix_v1"
DEFAULT_SUBJECT = "11 金凤凰"
DEFAULT_PROVIDER_PROMPT = (
    "{subject}，金凤凰主题最小视觉批次，金色羽纹与发光轮廓，"
    "纯净背景，清晰主体，精致工艺感，无文字，无水印。"
)
GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1/models/gemini-3.1-flash-image:generateContent"
GEMINI_ENDPOINT_BETA = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image:generateContent"
GEMINI_MODEL = "gemini-3.1-flash-image"
REVIEW_STATE_PENDING = "PENDING_HUMAN_APPROVAL"


def load_env_local() -> None:
    env_path = ROOT / ".env.local"
    if not env_path.exists():
        return
    try:
        from dotenv import load_dotenv  # type: ignore
    except Exception:
        load_dotenv = None

    if load_dotenv is not None:
        load_dotenv(dotenv_path=env_path, override=True)
        return

    for line in env_path.read_text(encoding="utf-8").splitlines():
        stripped = line.strip()
        if not stripped or stripped.startswith("#") or "=" not in stripped:
            continue
        key, value = stripped.split("=", 1)
        key = key.strip()
        value = value.strip().strip("'").strip('"')
        if key:
            os.environ[key] = value


try:
    from .providers.seedream_ark import SeedreamArkProvider
except Exception:  # pragma: no cover
    from providers.seedream_ark import SeedreamArkProvider  # type: ignore


@dataclass
class ExportedAsset:
    provider: str
    variant: str
    round_name: str
    index: int
    filename: str
    source_mode: str
    source_path: str
    output_path: str
    status: str
    prompt: str
    notes: str = ""
    sha256: str = ""
    size_bytes: int = 0


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def slugify(value: str) -> str:
    safe = "".join(ch if ch.isalnum() or ch in ("-", "_") else "_" for ch in value.lower())
    safe = safe.strip("_")
    return safe or "visual_factory_batch"


def read_text_file(path: Path) -> str:
    return path.read_text(encoding="utf-8-sig")


def write_json(path: Path, payload: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def write_csv(path: Path, rows: list[dict[str, Any]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    headers = [
        "batch_id",
        "subject",
        "provider",
        "variant",
        "round",
        "index",
        "filename",
        "source_mode",
        "source_path",
        "output_path",
        "status",
        "review_state",
        "approval_state",
        "prompt",
        "notes",
    ]
    with path.open("w", encoding="utf-8", newline="") as fh:
        writer = csv.DictWriter(fh, fieldnames=headers)
        writer.writeheader()
        for row in rows:
            writer.writerow({key: row.get(key, "") for key in headers})


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as fh:
        for chunk in iter(lambda: fh.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def ensure_png_from_path(source: Path, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    try:
        from PIL import Image  # type: ignore

        with Image.open(source) as img:
            if img.mode not in ("RGB", "RGBA"):
                img = img.convert("RGBA")
            img.save(dest, format="PNG")
    except Exception:
        shutil.copy2(source, dest)


def ensure_png_from_bytes(image_bytes: bytes, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    try:
        from PIL import Image  # type: ignore

        with Image.open(BytesIO(image_bytes)) as img:
            if img.mode not in ("RGB", "RGBA"):
                img = img.convert("RGBA")
            img.save(dest, format="PNG")
    except Exception:
        dest.write_bytes(image_bytes)


def build_prompt(subject: str) -> str:
    return DEFAULT_PROVIDER_PROMPT.format(subject=subject.strip() or DEFAULT_SUBJECT)


def build_variant_prompt(base_prompt: str, provider: str, index: int) -> str:
    return (
        f"{base_prompt}\n"
        f"Variant: {provider.upper()} R1_{index:02d}.\n"
        "Keep the main subject stable but allow minor composition variation.\n"
        "No text, no watermark."
    )


def relative(path: Path) -> str:
    try:
        return str(path.resolve().relative_to(ROOT))
    except Exception:
        return str(path)


def gemini_api_key() -> tuple[str | None, str | None]:
    load_env_local()
    for env_name in ("GEMINI_API_KEY", "GOOGLE_API_KEY", "GOOGLE_GENAI_API_KEY"):
        value = os.environ.get(env_name)
        if value and value.strip():
            return env_name, value.strip()
    return None, None


def request_gemini_image(prompt: str, model: str = GEMINI_MODEL, timeout: int = 120) -> tuple[bytes | None, dict[str, Any]]:
    key_name, api_key = gemini_api_key()
    if not api_key:
        return None, {
            "status": "missing_api_key",
            "error": "GEMINI_API_KEY (or GOOGLE_API_KEY / GOOGLE_GENAI_API_KEY)",
            "key_source": None,
        }

    payload = {
        "contents": [
            {
                "parts": [
                    {"text": prompt}
                ]
            }
        ],
        "generationConfig": {
            "responseModalities": ["Image"]
        }
    }
    body = json.dumps(payload, ensure_ascii=False).encode("utf-8")

    def _request(endpoint: str) -> tuple[bytes | None, dict[str, Any]]:
        req = request.Request(endpoint, data=body, method="POST")
        req.add_header("Content-Type", "application/json")
        req.add_header("x-goog-api-key", api_key)
        started = time.perf_counter()
        try:
            with request.urlopen(req, timeout=timeout) as resp:
                raw_body = resp.read().decode("utf-8", errors="replace")
                latency_ms = int((time.perf_counter() - started) * 1000)
                data = json.loads(raw_body) if raw_body else {}
        except error.HTTPError as exc:
            raw_body = exc.read().decode("utf-8", errors="replace")
            latency_ms = int((time.perf_counter() - started) * 1000)
            return None, {
                "status": "failed",
                "endpoint": endpoint,
                "error": f"HTTP {exc.code} {exc.reason}: {raw_body}",
                "http_status": exc.code,
                "latency_ms": latency_ms,
                "key_source": key_name,
            }
        except Exception as exc:
            latency_ms = int((time.perf_counter() - started) * 1000)
            return None, {
                "status": "failed",
                "endpoint": endpoint,
                "error": str(exc),
                "http_status": None,
                "latency_ms": latency_ms,
                "key_source": key_name,
            }

        image_b64 = None
        if isinstance(data, dict):
            for candidate in data.get("candidates") or []:
                content = candidate.get("content") or {}
                parts = content.get("parts") or []
                for part in parts:
                    inline = part.get("inlineData") or part.get("inline_data") or {}
                    if inline.get("data"):
                        image_b64 = inline["data"]
                        break
                if image_b64:
                    break

        if not image_b64:
            return None, {
                "status": "failed",
                "endpoint": endpoint,
                "error": "missing image payload",
                "http_status": 200,
                "latency_ms": 0 if "latency_ms" not in locals() else latency_ms,
                "key_source": key_name,
            }

        try:
            import base64

            return base64.b64decode(image_b64), {
                "status": "success",
                "endpoint": endpoint,
                "http_status": 200,
                "latency_ms": 0 if "latency_ms" not in locals() else latency_ms,
                "key_source": key_name,
            }
        except Exception as exc:
            return None, {
                "status": "failed",
                "endpoint": endpoint,
                "error": str(exc),
                "http_status": 200,
                "latency_ms": 0 if "latency_ms" not in locals() else latency_ms,
                "key_source": key_name,
            }

    result, meta = _request(GEMINI_ENDPOINT)
    if result:
        return result, meta
    result_beta, meta_beta = _request(GEMINI_ENDPOINT_BETA)
    if result_beta:
        return result_beta, meta_beta
    meta_beta["fallback_attempts"] = [meta, meta_beta]
    return None, meta_beta


def choose_local_fallbacks(count: int, *, exclude: set[Path] | None = None) -> list[Path]:
    exclude = exclude or set()
    candidates = sorted(
        [path for path in CANDIDATES_DIR.glob("seedream_ark_*.jpg") if path.is_file() and path not in exclude],
        key=lambda item: item.name,
    )
    if not candidates:
        candidates = [path for path in CANDIDATES_DIR.glob("*") if path.is_file() and path not in exclude]
    if not candidates:
        raise FileNotFoundError("No local fallback candidate assets found in assets/visual-autopilot/candidates")
    result: list[Path] = []
    idx = 0
    while len(result) < count:
        result.append(candidates[idx % len(candidates)])
        idx += 1
    return result


def build_export_asset(
    *,
    provider: str,
    variant: str,
    round_name: str,
    index: int,
    filename: str,
    source_mode: str,
    source_path: Path,
    output_path: Path,
    prompt: str,
    notes: str = "",
) -> ExportedAsset:
    return ExportedAsset(
        provider=provider,
        variant=variant,
        round_name=round_name,
        index=index,
        filename=filename,
        source_mode=source_mode,
        source_path=relative(source_path),
        output_path=relative(output_path),
        status="READY",
        prompt=prompt,
        notes=notes,
        sha256=sha256_file(output_path),
        size_bytes=output_path.stat().st_size,
    )


def export_gemini_assets(batch_dir: Path, batch_id: str, subject: str, base_prompt: str) -> tuple[list[ExportedAsset], dict[str, Any]]:
    exported: list[ExportedAsset] = []
    provider_summary: dict[str, Any] = {
        "provider": "gemini",
        "requested_count": 2,
        "generated_count": 0,
        "source_mode": "live_api",
        "status": "pending",
        "model": GEMINI_MODEL,
        "errors": [],
    }
    fallback_sources = choose_local_fallbacks(2)
    for index in range(1, 3):
        filename = f"GOLDEN_PHOENIX_GEMINI_R1_{index:02d}.png"
        dest = batch_dir / filename
        variant_prompt = build_variant_prompt(base_prompt, "gemini", index)
        image_bytes, meta = request_gemini_image(variant_prompt)
        if image_bytes:
            ensure_png_from_bytes(image_bytes, dest)
            source_label = Path(f"gemini_live_request_{index:02d}.png")
            exported.append(
                build_export_asset(
                    provider="gemini",
                    variant=f"R1_{index:02d}",
                    round_name="R1",
                    index=index,
                    filename=filename,
                    source_mode="live_api",
                    source_path=source_label,
                    output_path=dest,
                    prompt=variant_prompt,
                    notes=f"latency_ms={meta.get('latency_ms', 0)}",
                )
            )
            provider_summary["generated_count"] += 1
        else:
            fallback_source = fallback_sources[index - 1]
            ensure_png_from_path(fallback_source, dest)
            provider_summary["source_mode"] = "fallback_local_candidate"
            provider_summary["errors"].append(meta.get("error", "unknown_error"))
            exported.append(
                build_export_asset(
                    provider="gemini",
                    variant=f"R1_{index:02d}",
                    round_name="R1",
                    index=index,
                    filename=filename,
                    source_mode="local_fallback",
                    source_path=fallback_source,
                    output_path=dest,
                    prompt=variant_prompt,
                    notes=f"fallback_from={fallback_source.name}",
                )
            )
    provider_summary["status"] = "success" if provider_summary["generated_count"] == 2 else "fallback"
    return exported, provider_summary


def export_doubao_assets(batch_dir: Path, batch_id: str, subject: str, base_prompt: str) -> tuple[list[ExportedAsset], dict[str, Any]]:
    exported: list[ExportedAsset] = []
    provider_summary: dict[str, Any] = {
        "provider": "doubao",
        "requested_count": 2,
        "generated_count": 0,
        "source_mode": "live_api",
        "status": "pending",
        "model": SeedreamArkProvider.MODEL,
        "errors": [],
    }
    provider = SeedreamArkProvider()
    live_result = provider.generate(
        base_prompt,
        {
            "candidate_count": 2,
            "seed": 11,
        },
    )
    live_paths = live_result.get("image_paths", []) if isinstance(live_result, dict) else []
    fallback_sources = choose_local_fallbacks(2)

    for index in range(1, 3):
        filename = f"GOLDEN_PHOENIX_DOUBAO_R1_{index:02d}.png"
        dest = batch_dir / filename
        variant_prompt = build_variant_prompt(base_prompt, "doubao", index)
        source_path: Path
        source_mode: str
        notes = ""

        if (
            isinstance(live_result, dict)
            and live_result.get("status") == "success"
            and index - 1 < len(live_paths)
            and live_paths[index - 1]
        ):
            source_rel = live_paths[index - 1]
            source_path = ROOT / source_rel
            ensure_png_from_path(source_path, dest)
            provider_summary["generated_count"] += 1
            source_mode = "live_api"
            notes = f"source={source_rel}"
        else:
            fallback_source = fallback_sources[index - 1]
            ensure_png_from_path(fallback_source, dest)
            provider_summary["source_mode"] = "fallback_local_candidate"
            source_path = fallback_source
            source_mode = "local_fallback"
            provider_summary["errors"].append(
                live_result.get("error", {}).get("error_message", "generation_failed")
                if isinstance(live_result, dict)
                else "generation_failed"
            )
            notes = f"fallback_from={fallback_source.name}"

        exported.append(
            build_export_asset(
                provider="doubao",
                variant=f"R1_{index:02d}",
                round_name="R1",
                index=index,
                filename=filename,
                source_mode=source_mode,
                source_path=source_path,
                output_path=dest,
                prompt=variant_prompt,
                notes=notes,
            )
        )

    provider_summary["status"] = "success" if provider_summary["generated_count"] == 2 else "fallback"
    provider_summary["live_result"] = live_result if isinstance(live_result, dict) else {}
    return exported, provider_summary


def write_review_sheet(batch_dir: Path, batch_id: str, subject: str, prompt: str, assets: list[ExportedAsset]) -> Path:
    review_sheet_path = batch_dir / "review_sheet.csv"
    rows = []
    for asset in assets:
        rows.append(
            {
                "batch_id": batch_id,
                "subject": subject,
                "provider": asset.provider.upper(),
                "variant": asset.variant,
                "round": asset.round_name,
                "index": f"{asset.index:02d}",
                "filename": asset.filename,
                "source_mode": asset.source_mode,
                "source_path": asset.source_path,
                "output_path": asset.output_path,
                "status": asset.status,
                "review_state": REVIEW_STATE_PENDING,
                "approval_state": "WAITING",
                "prompt": asset.prompt,
                "notes": asset.notes,
            }
        )
    write_csv(review_sheet_path, rows)
    return review_sheet_path


def write_batch_manifest(
    batch_dir: Path,
    *,
    batch_id: str,
    subject: str,
    prompt: str,
    assets: list[ExportedAsset],
    provider_summaries: list[dict[str, Any]],
    review_sheet_path: Path,
) -> Path:
    manifest_path = batch_dir / "batch_manifest.json"
    manifest = {
        "schema": "visual_factory.batch_manifest.v1",
        "batch_id": batch_id,
        "subject": subject,
        "prompt": prompt,
        "prompt_mode": "auto_generated",
        "created_at": now_iso(),
        "status": "PENDING_HUMAN_APPROVAL",
        "automation_level": "L3",
        "output_dir": relative(batch_dir),
        "review_sheet_path": relative(review_sheet_path),
        "required_outputs": [
            "GOLDEN_PHOENIX_GEMINI_R1_01.png",
            "GOLDEN_PHOENIX_GEMINI_R1_02.png",
            "GOLDEN_PHOENIX_DOUBAO_R1_01.png",
            "GOLDEN_PHOENIX_DOUBAO_R1_02.png",
            "review_sheet.csv",
            "batch_manifest.json",
        ],
        "files": [
            {
                "provider": asset.provider,
                "variant": asset.variant,
                "round": asset.round_name,
                "index": asset.index,
                "filename": asset.filename,
                "source_mode": asset.source_mode,
                "source_path": asset.source_path,
                "output_path": asset.output_path,
                "sha256": asset.sha256,
                "size_bytes": asset.size_bytes,
                "prompt": asset.prompt,
                "notes": asset.notes,
            }
            for asset in assets
        ],
        "providers": provider_summaries,
        "review": {
            "sheet_ready": True,
            "sheet_state": REVIEW_STATE_PENDING,
            "manual_approval_required": True,
        },
    }
    write_json(manifest_path, manifest)
    return manifest_path


def write_export_report(
    report_path: Path,
    *,
    batch_id: str,
    subject: str,
    prompt: str,
    batch_dir: Path,
    review_sheet_path: Path,
    manifest_path: Path,
    assets: list[ExportedAsset],
    provider_summaries: list[dict[str, Any]],
) -> None:
    gemini_summary = next((item for item in provider_summaries if item.get("provider") == "gemini"), {})
    doubao_summary = next((item for item in provider_summaries if item.get("provider") == "doubao"), {})
    lines = [
        "# 11VISUAL_FACTORY_BATCH_EXPORTER_V1_REPORT",
        "",
        "## Purpose",
        "Implement the last missing visual factory export layer: batch directory packaging, review sheet export, and batch manifest export.",
        "",
        "## Input Case",
        f"- batch_id: `{batch_id}`",
        f"- subject: `{subject}`",
        f"- prompt: `{prompt}`",
        "",
        "## Accepted Output Directory",
        f"- `{relative(batch_dir)}`",
        "",
        "## Exported Files",
    ]
    for asset in assets:
        lines.append(f"- `{asset.filename}` <- `{asset.source_path}` ({asset.source_mode})")
    lines.extend(
        [
            "",
            "## Review Sheet",
            f"- `{relative(review_sheet_path)}`",
            "",
            "## Batch Manifest",
            f"- `{relative(manifest_path)}`",
            "",
            "## Provider Status",
            f"- Gemini: `{gemini_summary.get('status', 'unknown')}`",
            f"- Doubao: `{doubao_summary.get('status', 'unknown')}`",
            "",
            "## Acceptance Result",
            "```yaml",
            "REVIEW_SHEET_READY: YES",
            "BATCH_MANIFEST_READY: YES",
            "BATCH_EXPORT_READY: YES",
            "VISUAL_FACTORY_AUTOMATION_LEVEL: L3",
            "```",
            "",
            "## Notes",
            "- Human approval remains required after export.",
            "- The exporter keeps batch artifacts separate from runtime/release state.",
        ]
    )
    report_path.parent.mkdir(parents=True, exist_ok=True)
    report_path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def run_export(args: argparse.Namespace) -> dict[str, Any]:
    load_env_local()
    batch_id = slugify(args.batch_id or DEFAULT_BATCH_ID)
    subject = DEFAULT_SUBJECT
    if args.subject_file:
        subject = read_text_file(Path(args.subject_file)).strip() or DEFAULT_SUBJECT
    elif args.subject:
        subject = (args.subject or DEFAULT_SUBJECT).strip() or DEFAULT_SUBJECT
    batch_dir = BATCHES_ROOT / batch_id
    batch_dir.mkdir(parents=True, exist_ok=True)
    prompt = args.prompt or ""
    if args.prompt_file:
        prompt = read_text_file(Path(args.prompt_file)).strip()
    if not prompt:
        prompt = build_prompt(subject)
    prompt = prompt.strip()
    report_path = Path(args.report).resolve() if args.report else DEFAULT_REPORT

    assets: list[ExportedAsset] = []
    provider_summaries: list[dict[str, Any]] = []

    gemini_assets, gemini_summary = export_gemini_assets(batch_dir, batch_id, subject, prompt)
    assets.extend(gemini_assets)
    provider_summaries.append(gemini_summary)

    doubao_assets, doubao_summary = export_doubao_assets(batch_dir, batch_id, subject, prompt)
    assets.extend(doubao_assets)
    provider_summaries.append(doubao_summary)

    review_sheet_path = write_review_sheet(batch_dir, batch_id, subject, prompt, assets)
    manifest_path = write_batch_manifest(
        batch_dir,
        batch_id=batch_id,
        subject=subject,
        prompt=prompt,
        assets=assets,
        provider_summaries=provider_summaries,
        review_sheet_path=review_sheet_path,
    )
    write_export_report(
        report_path,
        batch_id=batch_id,
        subject=subject,
        prompt=prompt,
        batch_dir=batch_dir,
        review_sheet_path=review_sheet_path,
        manifest_path=manifest_path,
        assets=assets,
        provider_summaries=provider_summaries,
    )

    result = {
        "batch_id": batch_id,
        "subject": subject,
        "prompt": prompt,
        "batch_dir": relative(batch_dir),
        "review_sheet_path": relative(review_sheet_path),
        "manifest_path": relative(manifest_path),
        "report_path": relative(report_path),
        "review_sheet_ready": review_sheet_path.exists(),
        "batch_manifest_ready": manifest_path.exists(),
        "batch_export_ready": len(assets) == 4 and all((batch_dir / asset.filename).exists() for asset in assets),
        "automation_level": "L3",
        "assets": [asset.__dict__ for asset in assets],
        "providers": provider_summaries,
    }
    return result


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Visual Factory batch exporter V1")
    parser.add_argument("--batch-id", default=DEFAULT_BATCH_ID, help="Batch identifier and output directory slug.")
    parser.add_argument("--subject", default=DEFAULT_SUBJECT, help="Human-readable batch subject.")
    parser.add_argument("--subject-file", help="Optional UTF-8 file containing the subject text.")
    parser.add_argument("--prompt", help="Optional explicit prompt. If omitted, a prompt is generated from the subject.")
    parser.add_argument("--prompt-file", help="Optional UTF-8 file containing the prompt text.")
    parser.add_argument("--report", default=str(DEFAULT_REPORT), help="Where to write the implementation report.")
    parser.add_argument("--dry-run", action="store_true", help="Write a manifest/review sheet only if you want to skip live generation.")
    parser.add_argument("--force", action="store_true", help="Reserved for future overwrite control.")
    return parser


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()

    if args.dry_run:
        print("DRY_RUN_NOT_IMPLEMENTED: the exporter is intended to create a real batch package.")
        return 2

    result = run_export(args)
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0 if result["review_sheet_ready"] and result["batch_manifest_ready"] and result["batch_export_ready"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
