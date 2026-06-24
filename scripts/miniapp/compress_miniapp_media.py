#!/usr/bin/env python3
"""DEPRECATED: PNG re-save can inflate indexed PNGs. Use convert_miniapp_media_to_webp.py."""
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
    MINIAPP / "assets/ar_factory/landmark_ar_poc_v1/alignment_overlay.png",
    MINIAPP / "assets/ar_factory/landmark_ar_poc_v1/position_guide.png",
]

MAX_SIDE = 960


def kb(path: Path) -> float:
    return round(path.stat().st_size / 1024, 2)


def compress_image(path: Path) -> dict:
    before = kb(path)
    img = Image.open(path)
    if img.mode not in ("RGB", "RGBA"):
        img = img.convert("RGBA")

    w, h = img.size
    if max(w, h) > MAX_SIDE:
        ratio = MAX_SIDE / max(w, h)
        img = img.resize((int(w * ratio), int(h * ratio)), Image.Resampling.LANCZOS)

    if img.mode == "RGBA":
        img.save(path, "PNG", optimize=True, compress_level=9)
    else:
        img.save(path, "PNG", optimize=True, compress_level=9)

    after = kb(path)
    return {
        "path": str(path.relative_to(ROOT)).replace("\\", "/"),
        "before_kb": before,
        "after_kb": after,
        "saved_kb": round(before - after, 2),
    }


def main() -> int:
    results = []
    for target in TARGETS:
        if not target.exists():
            print(f"SKIP missing {target}", file=sys.stderr)
            continue
        results.append(compress_image(target))

    out = ROOT / "scripts" / "audit" / "_compress_miniapp_media_result.json"
    out.write_text(json.dumps(results, indent=2), encoding="utf-8")
    print(json.dumps(results, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
