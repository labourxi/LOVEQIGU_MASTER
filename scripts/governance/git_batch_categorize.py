#!/usr/bin/env python3
"""Categorize git status paths into stabilization batches."""
import subprocess
from collections import Counter
from pathlib import Path


def batch(path: str) -> str:
    p = path.replace("\\", "/").strip('"').lower()
    if p.startswith("docs/admin/") or p.startswith("apps/admin/"):
        return "admin"
    if p.startswith("docs/activity/"):
        return "activity"
    if p.startswith("docs/product/merchant") or p.startswith("docs/product/event"):
        return "activity"
    if p.startswith("docs/product/platform"):
        return "activity"
    if p.startswith("data/merchant") or p.startswith("data/event"):
        return "activity"
    if p.startswith("data/platform_admin") or p.startswith("data/park_admin"):
        return "activity"
    if any(x in p for x in ("merchant_event", "merchant_portal", "merchant-event", "campaign")):
        return "activity"
    if p.startswith("docs/product/ar/") or p.startswith("docs/tech/ar"):
        return "ar"
    if p.startswith("data/ar/") or p.startswith("runtime/"):
        return "ar"
    if "/ar-" in p or "/ar/" in p or "ar_factory" in p or "ar-service" in p:
        return "ar"
    if p.startswith("docs/art/") or p.startswith("assets/"):
        return "art"
    art_prefixes = (
        "docs/art_",
        "docs/star_",
        "docs/meridian",
        "docs/heaven",
        "docs/dual_home",
        "docs/four_symbol",
        "docs/lottie",
        "docs/visual_autopilot",
        "docs/seedream",
        "docs/artifact",
        "docs/art-",
    )
    if any(p.startswith(x) for x in art_prefixes):
        return "art"
    if p.startswith("docs/world/"):
        return "art"
    if any(
        x in p
        for x in (
            "star-map",
            "meridian-map",
            "heaven-human",
            "lottie",
            "star-ritual",
            "synthesis",
            "relic-archive",
            "digital-collectible",
            "celebration-modal",
            "star-activation",
        )
    ):
        return "art"
    if p.startswith("scripts/visual_autopilot"):
        return "art"
    return "governance"


def main() -> None:
    root = Path(__file__).resolve().parents[2]
    out = subprocess.check_output(
        ["git", "status", "--porcelain"],
        cwd=root,
        text=True,
        encoding="utf-8",
        errors="replace",
    )
    files = [line[3:] for line in out.splitlines() if line.strip()]
    counts = Counter(batch(f) for f in files)
    for name in ("governance", "admin", "activity", "ar", "art"):
        print(f"{name}: {counts.get(name, 0)}")
    print(f"total: {len(files)}")
    for name in ("governance", "admin", "activity", "ar", "art"):
        paths = [f for f in files if batch(f) == name]
        list_path = root / f".git_batch_{name}.txt"
        list_path.write_text("\n".join(paths), encoding="utf-8")


if __name__ == "__main__":
    main()
