#!/usr/bin/env python3
"""VISUAL_LANDING_PRODUCTION_V1 / batch_001 — dual-engine UI mockup production.

Reuses existing Visual Factory provider calls (Gemini + Doubao/Seedream Ark).
No local fallback. No runtime mutation.
"""

from __future__ import annotations

import json
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[2]
if str(ROOT / "scripts" / "visual_autopilot") not in sys.path:
    sys.path.insert(0, str(ROOT / "scripts" / "visual_autopilot"))

from visual_factory_batch_exporter_v1 import (  # noqa: E402
    ensure_png_from_bytes,
    ensure_png_from_path,
    load_env_local,
    request_gemini_image,
)
from providers.seedream_ark import SeedreamArkProvider  # noqa: E402

BATCH_DIR = ROOT / "outputs" / "visual_production" / "VISUAL_LANDING_PRODUCTION_V1" / "batch_001"

STYLE = (
    "Unified visual style: Eastern minimalism, cinematic digital atmosphere, "
    "high-end mobile app UI mockup, deep dark ink-black to indigo background (#0B0F14), "
    "mist, soft particles, low saturation, high negative space, warm gold accents, "
    "poetic restrained, Chinese typography, no gamification, no commercial dashboard, "
    "no e-commerce, no reward UI, no SSR, no data tables, no icon grid clutter. "
)

BAN = (
    "Do NOT include: game UI, reward animations, lottery, KPI dashboard, "
    "bright saturated tech blue, multiple navigation entries, marketing banners."
)

LANDING_BASE = (
    "Full-screen mobile landing page UI for AR游伴. Centered brand title 'AR游伴'. "
    "Tagline '留在足迹里，收藏世界'. Single primary CTA button '进入探索'. "
    "No top navigation, no secondary buttons, no stats, no path links. "
    "Faint incomplete star chart or world outline in background mist. "
    "Quiet ritual world entrance, premium restrained design."
)

EXPLORE_BASE = (
    "Full-screen mobile Explore Home UI. Top bar: '上海 · 今日探索' with subtle search icon. "
    "Six immersive exploration cards in rhythmic 2-column layout. "
    "Card places: 外滩夜行, 武康路午后, 朵云书院, 苏州河微风, 豫园灯影, 徐汇书角. "
    "Each card: place name, one short poetic line, weak relic atmosphere hint, "
    "atmospheric blurred city photo background, soft fog overlay. "
    "Editorial exploration magazine feel, not tool list, not dashboard."
)

JOBS = [
    ("landing_page_final_v1", "gemini", "v1", "Landing", "方向1", f"{LANDING_BASE} Variant direction 1: more poetic, more eastern, more negative space and whitespace."),
    ("landing_page_final_v1", "gemini", "v2", "Landing", "方向2", f"{LANDING_BASE} Variant direction 2: more dreamy immersive subtle glowing star map layers."),
    ("landing_page_final_v1", "doubao", "v1", "Landing", "方向1", f"{LANDING_BASE} Variant direction 1: more poetic, more eastern, more negative space and whitespace."),
    ("landing_page_final_v1", "doubao", "v2", "Landing", "方向2", f"{LANDING_BASE} Variant direction 2: more dreamy immersive subtle glowing star map layers."),
    ("explore_home_final_v1", "gemini", "v1", "Explore Home", "方向1", f"{EXPLORE_BASE} Variant direction 1: eastern dream city atmosphere."),
    ("explore_home_final_v1", "gemini", "v2", "Explore Home", "方向2", f"{EXPLORE_BASE} Variant direction 2: magazine curatorial exploration homepage."),
    ("explore_home_final_v1", "doubao", "v1", "Explore Home", "方向1", f"{EXPLORE_BASE} Variant direction 1: eastern dream city atmosphere."),
    ("explore_home_final_v1", "doubao", "v2", "Explore Home", "方向2", f"{EXPLORE_BASE} Variant direction 2: magazine curatorial exploration homepage."),
]


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def build_prompt(body: str) -> str:
    return f"{STYLE}\n{body}\n{BAN}"


def generate_doubao(prompt: str, seed: int) -> tuple[Path | None, dict[str, Any]]:
    provider = SeedreamArkProvider()
    result = provider.generate(prompt, {"candidate_count": 1, "seed": seed})
    if not isinstance(result, dict) or result.get("status") != "success":
        return None, result if isinstance(result, dict) else {"status": "failed", "error": "invalid_result"}
    path_str = result.get("image_path")
    if not path_str:
        paths = result.get("image_paths") or []
        path_str = paths[0] if paths else None
    if not path_str:
        return None, {**result, "error": "missing image_path"}
    source = ROOT / path_str
    if not source.exists():
        return None, {**result, "error": f"missing_file:{path_str}"}
    return source, {"status": "success", "source": str(source.relative_to(ROOT)), "latency_ms": result.get("latency_ms", 0)}


def run_job(page_slug: str, engine: str, variant: str, page_type: str, direction: str, body: str) -> dict[str, Any]:
    filename = f"{page_slug}__{engine}__{variant}.png"
    dest = BATCH_DIR / filename
    prompt = build_prompt(body)
    record: dict[str, Any] = {
        "filename": filename,
        "engine": engine,
        "page_type": page_type,
        "direction": direction,
        "variant": variant,
        "output_time": now_iso(),
        "review_status": "FAILED",
        "prompt": prompt,
        "error": None,
    }

    if engine == "gemini":
        image_bytes, meta = request_gemini_image(prompt)
        if image_bytes:
            ensure_png_from_bytes(image_bytes, dest)
            record["review_status"] = "READY"
            record["meta"] = meta
        else:
            record["error"] = meta.get("error", "gemini_failed")
            record["meta"] = meta
    elif engine == "doubao":
        seed = 101 if variant == "v1" else 202
        source, meta = generate_doubao(prompt, seed)
        if source:
            ensure_png_from_path(source, dest)
            record["review_status"] = "READY"
            record["meta"] = {"status": "success", "source": str(source.relative_to(ROOT))}
        else:
            err = meta.get("error", meta) if isinstance(meta, dict) else meta
            if isinstance(err, dict):
                record["error"] = err.get("error_message") or str(err)
            else:
                record["error"] = str(err)
            record["meta"] = {"status": "failed", "detail": str(err)[:500]}
    else:
        record["error"] = f"unknown_engine:{engine}"

    record["success"] = record["review_status"] == "READY" and dest.exists()
    return record


def engine_label(engine: str) -> str:
    return "Gemini" if engine == "gemini" else "豆包"


def write_review_index(records: list[dict[str, Any]]) -> None:
    lines = ["# review_index_v1", ""]
    for section in ("Landing Page", "Explore Home"):
        lines.append(f"## {section}")
        lines.append("")
        for rec in records:
            if rec["page_type"] != section:
                continue
            status = rec["review_status"]
            lines.append(
                f"- {rec['filename']} | {engine_label(rec['engine'])} | {rec['page_type']} | {rec['direction']} | {status}"
            )
        lines.append("")
    (BATCH_DIR / "review_index_v1.md").write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")


def write_receipt(records: list[dict[str, Any]]) -> None:
    landing_ok = sum(1 for r in records if r["page_type"] == "Landing Page" and r["success"])
    explore_ok = sum(1 for r in records if r["page_type"] == "Explore Home" and r["success"])
    total_ok = sum(1 for r in records if r["success"])
    total_fail = len(records) - total_ok
    gemini_called = any(r["engine"] == "gemini" for r in records)
    doubao_called = any(r["engine"] == "doubao" for r in records)
    gemini_ok = any(r["engine"] == "gemini" and r["success"] for r in records)
    doubao_ok = any(r["engine"] == "doubao" and r["success"] for r in records)
    min_ready = landing_ok >= 2 and explore_ok >= 2

    lines = [
        "# production_receipt_v1",
        "",
        "任务：",
        "VISUAL_LANDING_PRODUCTION_V1 / batch_001",
        "",
        "执行结果：",
        "- Prompt Pack 已写入：YES",
        "- 生产线已调用：YES",
        f"- Gemini 调用：{'YES' if gemini_called else 'NO'}",
        f"- 豆包调用：{'YES' if doubao_called else 'NO'}",
        f"- Gemini 成功：{'YES' if gemini_ok else 'NO'}",
        f"- 豆包成功：{'YES' if doubao_ok else 'NO'}",
        f"- Landing 成功产出数量：{landing_ok}",
        f"- Explore Home 成功产出数量：{explore_ok}",
        f"- 总成功数量：{total_ok}",
        f"- 总失败数量：{total_fail}",
        "",
        "## 失败明细",
        "",
    ]
    failures = [r for r in records if not r["success"]]
    if failures:
        for rec in failures:
            lines.append(f"- `{rec['filename']}`: {rec.get('error', 'unknown')}")
    else:
        lines.append("- 无")
    lines.extend(
        [
            "",
            "结论：",
            f"FIRST_BATCH_VISUAL_OUTPUT_READY_FOR_REVIEW = {'YES' if min_ready else 'NO'}",
            "",
        ]
    )
    (BATCH_DIR / "production_receipt_v1.md").write_text("\n".join(lines), encoding="utf-8")


def main() -> int:
    load_env_local()
    BATCH_DIR.mkdir(parents=True, exist_ok=True)
    records = []
    for job in JOBS:
        print(f"RUN {job[0]}__{job[1]}__{job[2]} ...", flush=True)
        rec = run_job(*job)
        records.append(rec)
        print(f"  -> {rec['review_status']}", flush=True)
    write_review_index(records)
    write_receipt(records)
    slim = [
        {
            "filename": rec["filename"],
            "engine": rec["engine"],
            "page_type": rec["page_type"],
            "direction": rec["direction"],
            "variant": rec["variant"],
            "output_time": rec["output_time"],
            "review_status": rec["review_status"],
            "success": rec["success"],
            "error": rec.get("error"),
        }
        for rec in records
    ]
    (BATCH_DIR / "batch_manifest.json").write_text(
        json.dumps({"generated_at": now_iso(), "records": slim}, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    landing_ok = sum(1 for r in records if r["page_type"] == "Landing Page" and r["success"])
    explore_ok = sum(1 for r in records if r["page_type"] == "Explore Home" and r["success"])
    return 0 if landing_ok >= 2 and explore_ok >= 2 else 1


if __name__ == "__main__":
    raise SystemExit(main())
