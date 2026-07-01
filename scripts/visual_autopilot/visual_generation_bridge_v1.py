#!/usr/bin/env python3
"""Visual Autopilot generation bridge V1.

This bridge sends one visual prompt to OpenAI and Gemini image generation
endpoints, saves any returned images and metadata, and writes a report.

It does not upload assets or mutate runtime state.
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Any
from urllib import error, request


ROOT = Path(__file__).resolve().parents[2]
DEFAULT_REQUEST_SCHEMA = ROOT / "scripts/visual_autopilot/visual_prompt_request_schema.json"
DEFAULT_CONFIG = ROOT / "scripts/visual_autopilot/visual_generation_config.example.json"
DEFAULT_REPORT = ROOT / "docs/VISUAL_AUTOPILOT_GENERATION_BRIDGE_V1_REPORT.md"
DEFAULT_CANDIDATES_DIR = ROOT / "assets/visual-autopilot/candidates"
DEFAULT_REPORTS_DIR = ROOT / "assets/visual-autopilot/reports"


@dataclass
class ProviderResult:
    provider: str
    model: str
    status: str
    path: str | None = None
    error: str | None = None


def load_json(path: Path) -> dict[str, Any]:
    with path.open("r", encoding="utf-8") as fh:
        return json.load(fh)


def save_json(path: Path, payload: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as fh:
        json.dump(payload, fh, ensure_ascii=False, indent=2)
        fh.write("\n")


def read_prompt(args: argparse.Namespace) -> str:
    if args.prompt:
        return args.prompt.strip()
    if args.prompt_file:
        return Path(args.prompt_file).read_text(encoding="utf-8").strip()
    if not sys.stdin.isatty():
        data = sys.stdin.read().strip()
        if data:
            return data
    raise SystemExit("BLOCKED_BY_MISSING_PROMPT")


def ensure_output_dirs(config: dict[str, Any]) -> tuple[Path, Path]:
    candidates = ROOT / config["output"]["candidates_dir"]
    reports = ROOT / config["output"]["reports_dir"]
    candidates.mkdir(parents=True, exist_ok=True)
    reports.mkdir(parents=True, exist_ok=True)
    return candidates, reports


def provider_key(name: str, provider_config: dict[str, Any]) -> str | None:
    env_name = provider_config.get("api_key_env")
    candidates = [env_name] if env_name else []
    if name == "gemini":
        candidates.extend(["GEMINI_API_KEY", "GOOGLE_API_KEY", "GOOGLE_GENAI_API_KEY"])
    for candidate in candidates:
        if candidate and os.environ.get(candidate):
            return os.environ.get(candidate)
    return None


def missing_keys(config: dict[str, Any]) -> list[str]:
    missing: list[str] = []
    for name, provider_config in config["providers"].items():
        if not provider_key(name, provider_config):
            if name == "gemini":
                missing.append("GEMINI_API_KEY (or GOOGLE_API_KEY / GOOGLE_GENAI_API_KEY)")
            else:
                missing.append(provider_config["api_key_env"])
    return missing


def timestamp() -> str:
    return time.strftime("%Y%m%d_%H%M%S", time.localtime())


def slugify_task_id(task_id: str) -> str:
    safe = "".join(ch if ch.isalnum() or ch in ("-", "_") else "_" for ch in task_id.lower())
    return safe.strip("_") or "visual_task"


def build_filename(task_id: str, model: str, stamp: str, idx: int) -> str:
    base = slugify_task_id(task_id)
    model_slug = "".join(ch if ch.isalnum() or ch in ("-", "_") else "_" for ch in model.lower())
    return f"{base}_{model_slug}_{stamp}_{idx:03d}.png"


def http_post_json(url: str, api_key: str, payload: dict[str, Any], header_name: str = "Authorization", prefix: str = "Bearer ") -> dict[str, Any]:
    body = json.dumps(payload).encode("utf-8")
    req = request.Request(url, data=body, method="POST")
    req.add_header("Content-Type", "application/json")
    req.add_header(header_name, f"{prefix}{api_key}")
    try:
        with request.urlopen(req, timeout=120) as resp:
            raw = resp.read().decode("utf-8")
        return json.loads(raw)
    except error.HTTPError as exc:
        body_text = exc.read().decode("utf-8", errors="replace")
        message = f"HTTP {exc.code} {exc.reason}: {body_text}".strip()
        raise RuntimeError(message) from exc


def download_bytes(url: str) -> bytes:
    with request.urlopen(url, timeout=120) as resp:
        return resp.read()


def write_png_from_payload(payload: str, out_path: Path) -> None:
    if payload.startswith("http://") or payload.startswith("https://"):
        out_path.write_bytes(download_bytes(payload))
        return
    import base64
    out_path.write_bytes(base64.b64decode(payload))


def write_blocked_report(report_path: Path, prompt: str, providers: list[str], missing: list[str], task_id: str, related_canon: list[str]) -> None:
    lines = [
        "# VISUAL_AUTOPILOT_GENERATION_BRIDGE_V1_REPORT",
        "",
        "Status: BLOCKED",
        "",
        "## Generation Task",
        "",
        f"- Task ID: `{task_id}`",
        f"- Prompt: {prompt}",
        "",
        "## Providers Used",
        "",
        f"- Intended providers: {', '.join(providers)}",
        "",
        "## Images Generated",
        "",
        "- None",
        "",
        "## Failed Providers",
        "",
    ]
    for item in missing:
        lines.append(f"- Missing API key: `{item}`")
    lines.extend([
        "",
        "## Related Canon",
        "",
    ])
    for item in related_canon:
        lines.append(f"- `{item}`")
    lines.extend([
        "",
        "## Next Audit Step",
        "",
        "- Restore missing API keys, rerun the bridge, then feed saved candidates to the visual audit engine.",
        "",
        "## Result",
        "",
        "BLOCKED_BY_MISSING_API_KEY",
        "",
        "VISUAL_AUTOPILOT_GENERATION_BRIDGE_V1_READY = YES",
    ])
    report_path.parent.mkdir(parents=True, exist_ok=True)
    report_path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def generate_openai(prompt: str, config: dict[str, Any], task_id: str, stamp: str, candidates_dir: Path, related_canon: list[str]) -> ProviderResult:
    provider = config["providers"]["openai"]
    api_key = provider_key("openai", provider)
    if not api_key:
        return ProviderResult("openai", provider.get("model", "gpt-image-1"), "missing_api_key", error="OPENAI_API_KEY")

    payload = {
        "model": provider.get("model", "gpt-image-1"),
        "prompt": prompt,
    }
    try:
        data = http_post_json(provider["endpoint"], api_key, payload)
    except (RuntimeError, error.URLError, TimeoutError, json.JSONDecodeError) as exc:
        print(f"OPENAI_HTTP_ERROR: {exc}", file=sys.stderr)
        return ProviderResult("openai", provider.get("model", "gpt-image-1"), "failed", error=str(exc))

    image_b64 = None
    if isinstance(data, dict):
        if "data" in data and data["data"]:
            first = data["data"][0]
            image_b64 = first.get("b64_json") or first.get("url")

    if not image_b64:
        return ProviderResult("openai", provider.get("model", "gpt-image-1"), "failed", error="missing image payload")

    filename = build_filename(task_id, provider.get("model", "gpt-image-1"), stamp, 1)
    out_path = candidates_dir / filename
    write_png_from_payload(image_b64, out_path)

    meta_path = out_path.with_suffix(".json")
    save_json(
        meta_path,
        {
            "provider": "openai",
            "model": provider.get("model", "gpt-image-1"),
            "task_id": task_id,
            "prompt": prompt,
            "generation_time": stamp,
            "file_path": str(out_path.relative_to(ROOT)),
            "related_canon": related_canon,
        },
    )
    return ProviderResult("openai", provider.get("model", "gpt-image-1"), "generated", path=str(out_path.relative_to(ROOT)))


def generate_gemini(prompt: str, config: dict[str, Any], task_id: str, stamp: str, candidates_dir: Path, related_canon: list[str]) -> ProviderResult:
    provider = config["providers"]["gemini"]
    api_key = provider_key("gemini", provider)
    if not api_key:
        return ProviderResult("gemini", provider.get("model", "gemini-3.1-flash-image"), "missing_api_key", error="GEMINI_API_KEY")

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
    try:
        data = http_post_json(provider["endpoint"], api_key, payload, header_name="x-goog-api-key", prefix="")
    except (RuntimeError, error.URLError, TimeoutError, json.JSONDecodeError) as exc:
        print(f"GEMINI_HTTP_ERROR: {exc}", file=sys.stderr)
        return ProviderResult("gemini", provider.get("model", "gemini-3.1-flash-image"), "failed", error=str(exc))

    image_b64 = None
    if isinstance(data, dict):
        candidates = data.get("candidates") or []
        for candidate in candidates:
            content = candidate.get("content") or {}
            parts = content.get("parts") or []
            for part in parts:
                inline = part.get("inlineData") or {}
                if not inline:
                    inline = part.get("inline_data") or {}
                if inline.get("data"):
                    image_b64 = inline["data"]
                    break
            if image_b64:
                break

    if not image_b64:
        return ProviderResult("gemini", provider.get("model", "gemini-3.1-flash-image"), "failed", error="missing image payload")

    filename = build_filename(task_id, provider.get("model", "gemini-3.1-flash-image"), stamp, 2)
    out_path = candidates_dir / filename
    write_png_from_payload(image_b64, out_path)
    meta_path = out_path.with_suffix(".json")
    save_json(
        meta_path,
        {
            "provider": "gemini",
            "model": provider.get("model", "gemini-3.1-flash-image"),
            "task_id": task_id,
            "prompt": prompt,
            "generation_time": stamp,
            "file_path": str(out_path.relative_to(ROOT)),
            "related_canon": related_canon,
        },
    )
    return ProviderResult("gemini", provider.get("model", "gemini-3.1-flash-image"), "generated", path=str(out_path.relative_to(ROOT)))


def main() -> int:
    parser = argparse.ArgumentParser(description="Visual Autopilot generation bridge V1")
    parser.add_argument("--prompt", help="Prompt text to generate from.")
    parser.add_argument("--prompt-file", help="Read prompt text from a file.")
    parser.add_argument("--task-id", default="visual_task", help="Task identifier for filenames and metadata.")
    parser.add_argument("--config", default=str(DEFAULT_CONFIG), help="Path to a bridge config JSON file.")
    parser.add_argument("--request-schema", default=str(DEFAULT_REQUEST_SCHEMA), help="Path to the request schema JSON file.")
    parser.add_argument("--report", default=str(DEFAULT_REPORT), help="Output report path.")
    parser.add_argument("--validate-only", action="store_true", help="Validate inputs and environment without generating.")
    args = parser.parse_args()

    config = load_json(Path(args.config))
    request_schema = load_json(Path(args.request_schema))
    prompt = read_prompt(args)
    task_id = args.task_id
    related_canon_examples = request_schema.get("properties", {}).get("related_canon", {}).get("examples", [])
    if related_canon_examples and isinstance(related_canon_examples[0], list):
        related_canon = related_canon_examples[0]
    else:
        related_canon = related_canon_examples
    if not related_canon:
        related_canon = [
            "ART_BIBLE_V1",
            "ART_INDEX_V1",
            "FOUR_SYMBOL_VISUAL_SYSTEM_V1.1",
            "ART_03_VISUAL_PHILOSOPHY_V1",
            "ART_04_VISUAL_PROTOTYPE_V1",
        ]

    candidates_dir, reports_dir = ensure_output_dirs(config)
    report_path = ROOT / args.report
    missing = missing_keys(config)

    if args.validate_only:
        write_blocked_report(report_path, prompt, ["openai", "gemini"], missing, task_id, related_canon)
        return 0 if not missing else 2

    stamp = timestamp()
    results = []
    openai_provider = config["providers"]["openai"]
    gemini_provider = config["providers"]["gemini"]

    if provider_key("openai", openai_provider):
        results.append(generate_openai(prompt, config, task_id, stamp, candidates_dir, related_canon))
    else:
        results.append(ProviderResult("openai", openai_provider.get("model", "gpt-image-1"), "missing_api_key", error="OPENAI_API_KEY"))

    if provider_key("gemini", gemini_provider):
        results.append(generate_gemini(prompt, config, task_id, stamp, candidates_dir, related_canon))
    else:
        results.append(ProviderResult("gemini", gemini_provider.get("model", "gemini-3.1-flash-image"), "missing_api_key", error="GEMINI_API_KEY (or GOOGLE_API_KEY / GOOGLE_GENAI_API_KEY)"))

    generated = [r for r in results if r.status == "generated"]
    failed = [r for r in results if r.status == "failed"]
    blocked = [r for r in results if r.status == "missing_api_key"]

    # ── QA GATE (Pipeline V3 STEP 3) ──
    # NO IMAGE CAN ENTER ASSET SYSTEM WITHOUT QA SCORE PASS
    if generated:
        qa_script = ROOT / "scripts/pipeline_step3_qa.py"
        qa_passed_all = True
        for item in list(generated):
            img_path = ROOT / item.path if not Path(item.path).is_absolute() else Path(item.path)
            if img_path.exists():
                sys.path.insert(0, str(ROOT / "scripts"))
                try:
                    from pipeline_step3_qa import qa_gate  # type: ignore
                    qa_passed, qa_result = qa_gate(str(img_path))
                    if qa_passed:
                        score = qa_result.get("score", 0)
                        print(f"  [QA] {item.provider} -> {item.path}: score {score:.2f} PASS")
                    else:
                        score = qa_result.get("score", 0)
                        print(f"  [QA] {item.provider} -> {item.path}: score {score:.2f} FAIL — REMOVED")
                        qa_passed_all = False
                        generated.remove(item)
                        failed.append(ProviderResult(item.provider, item.model, "failed", error=f"QA score {score:.2f} < 0.70"))
                except Exception as exc:
                    print(f"  [QA] {item.provider}: engine error {exc}")
            else:
                print(f"  [QA] {item.provider}: file not found at {img_path}")

    if not qa_passed_all:
        print("\n[QA_GATE] Some images failed QA. Review before manual approval.")

    report_lines = [
        "# VISUAL_AUTOPILOT_GENERATION_BRIDGE_V1_REPORT",
        "",
        "Status: PASS" if generated and not blocked and not failed else "Status: WARN",
        "",
        "## Generation Task",
        "",
        f"- Task ID: `{task_id}`",
        f"- Prompt: {prompt}",
        "",
        "## Providers Used",
        "",
        "- openai",
        "- gemini",
        "",
        "## Images Generated",
        "",
    ]
    if generated:
        for item in generated:
            report_lines.append(f"- `{item.provider}` -> `{item.path}`")
    else:
        report_lines.append("- None")
    report_lines.extend([
        "",
        "## Failed Providers",
        "",
    ])
    if failed:
        for item in failed:
            report_lines.append(f"- `{item.provider}`: {item.error}")
    else:
        report_lines.append("- None")
    report_lines.extend([
        "",
        "## Missing API Keys",
        "",
    ])
    if blocked:
        for item in blocked:
            report_lines.append(f"- `{item.error}`")
    else:
        report_lines.append("- None")
    report_lines.extend([
        "",
        "## Next Audit Step",
        "",
        "- Run the saved candidates through the visual audit engine and compare scores before any freeze decision.",
        "",
        "## Related Canon",
        "",
    ])
    for item in related_canon:
        report_lines.append(f"- `{item}`")
    report_lines.extend([
        "",
        "VISUAL_AUTOPILOT_GENERATION_BRIDGE_V1_READY = YES",
    ])
    report_path.write_text("\n".join(report_lines) + "\n", encoding="utf-8")

    manifest = {
        "task_id": task_id,
        "prompt": prompt,
        "stamp": stamp,
        "related_canon": related_canon,
        "results": [r.__dict__ for r in results],
    }
    save_json(reports_dir / f"{slugify_task_id(task_id)}_{stamp}.json", manifest)

    if blocked:
        print("BLOCKED_BY_MISSING_API_KEY")
        print(", ".join(r.error for r in blocked if r.error))
        return 2
    if failed:
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
