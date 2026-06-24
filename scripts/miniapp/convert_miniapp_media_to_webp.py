#!/usr/bin/env python3
"""Convert miniapp AR PNG assets to WebP for WeChat 200KB code-quality limits."""
from __future__ import annotations

import json
import os
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
MINIAPP = ROOT / "apps" / "miniapp"

TARGETS = [
    MINIAPP / "xr_demo/miniprogram/assets/ar_factory/landmark_tree_v1/alignment_overlay.png",
    MINIAPP / "xr_demo/miniprogram/assets/ar_factory/landmark_tree_v1/position_guide.png",
    MINIAPP / "xr_demo/miniprogram/assets/ar_factory/landmark_tree_v1_p0a/effect_preview/dragon_imprint_overlay.png",
    MINIAPP / "xr_demo/miniprogram/assets/ar_factory/landmark_tree_v1_p0a/effect_preview/dragon_energy_flow.png",
    MINIAPP / "xr_demo/miniprogram/assets/ar_factory/landmark_tree_v1_p0a/effect_preview/dragon_head_reveal.png",
    MINIAPP / "xr_demo/miniprogram/assets/ar_factory/landmark_tree_v1_p0a/effect_preview/azure_dragon_seal.png",
    MINIAPP / "xr_demo/miniprogram/assets/ar_factory/landmark_tree_v1_p0a/effect_preview/preview_sheet.png",
]

MAX_SIDE = 900
MAX_BYTES = 180 * 1024


def kb(num_bytes: int) -> float:
    return round(num_bytes / 1024, 2)


def convert_one(path: Path) -> dict:
    before = path.stat().st_size
    img = Image.open(path)
    if img.mode not in ("RGB", "RGBA"):
        img = img.convert("RGBA")

    w, h = img.size
    if max(w, h) > MAX_SIDE:
        ratio = MAX_SIDE / max(w, h)
        img = img.resize((int(w * ratio), int(h * ratio)), Image.Resampling.LANCZOS)

    webp_path = path.with_suffix(".webp")
    quality = 82
    while quality >= 55:
        img.save(webp_path, "WEBP", quality=quality, method=6)
        size = webp_path.stat().st_size
        if size <= MAX_BYTES:
            break
        quality -= 5

    path.unlink(missing_ok=True)
    after = webp_path.stat().st_size
    return {
        "from": str(path.relative_to(ROOT)).replace("\\", "/"),
        "to": str(webp_path.relative_to(ROOT)).replace("\\", "/"),
        "before_kb": kb(before),
        "after_kb": kb(after),
        "quality": quality,
    }


def main() -> int:
    results = []
    for target in TARGETS:
        if not target.exists():
            webp = target.with_suffix(".webp")
            if webp.exists():
                results.append({"skip_existing_webp": str(webp.relative_to(ROOT)).replace("\\", "/")})
            else:
                print(f"MISSING {target}", file=sys.stderr)
            continue
        results.append(convert_one(target))

    out = ROOT / "scripts" / "audit" / "_webp_miniapp_media_result.json"
    out.write_text(json.dumps(results, indent=2), encoding="utf-8")
    print(json.dumps(results, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
