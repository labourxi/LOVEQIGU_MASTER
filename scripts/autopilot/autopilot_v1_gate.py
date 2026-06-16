#!/usr/bin/env python3
"""OMX/Governance gate for LOVEQIGU_AUTOPILOT_V1 operationalization."""

from __future__ import annotations

import argparse
import hashlib
import json
import subprocess
import sys
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[2]
CONFIG_PATH = ROOT / "autopilot" / "autopilot_v1.config.json"
DEFAULT_REPORT = ROOT / "docs" / "AUTOPILOT_V1_OPERATIONALIZATION_REPORT.md"


def load_config() -> dict[str, Any]:
    return json.loads(CONFIG_PATH.read_text(encoding="utf-8"))


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest().upper()


def current_hashes(paths: list[str]) -> dict[str, str]:
    out: dict[str, str] = {}
    for rel in paths:
        path = ROOT / rel
        if path.exists():
            out[rel] = sha256_file(path)
    return out


def run_command(args: list[str]) -> dict[str, Any]:
    proc = subprocess.run(args, cwd=ROOT, capture_output=True, text=True, encoding="utf-8")
    return {"cmd": args, "returncode": proc.returncode, "stdout": proc.stdout or "", "stderr": proc.stderr or ""}


def check_no_ch04_production() -> dict[str, Any]:
    blocked = []
    for pattern in [
        "data/story/ch04*",
        "data/relics/ch04*",
        "data/rights/ch04*",
        "data/ar/ch04*",
        "docs/content/CH04*",
        "automation/chapters/CH04*",
    ]:
        blocked.extend(str(path.relative_to(ROOT)) for path in ROOT.glob(pattern))
    return {"ok": not blocked, "blocked": blocked}


def main() -> int:
    parser = argparse.ArgumentParser(description="LOVEQIGU Autopilot V1 gate")
    parser.add_argument("--chapter", required=True)
    parser.add_argument("--mode", default="dry-run")
    parser.add_argument("--report", default=str(DEFAULT_REPORT))
    args = parser.parse_args()

    config = load_config()
    baseline = config["baseline_hashes"]
    current = current_hashes(list(baseline.keys()))
    integrity = {
        "ok": current == baseline,
        "changed": [rel for rel, hash_value in current.items() if baseline.get(rel) != hash_value],
        "missing": [rel for rel in baseline if rel not in current],
    }
    omx = run_command(["node", "scripts/omx/run_omx_checks.js"])
    gov = run_command(["node", "scripts/governance/check_content_engine.js"])
    gov_status = (gov["stdout"].splitlines()[0].strip() if gov["stdout"] else "UNKNOWN")
    report_exists = Path(args.report).exists()
    no_ch04 = check_no_ch04_production()

    # Governance may warn in this repo; treat WARN as acceptable, FAIL as blocking.
    gov_ok = gov_status in {"PASS", "WARN"}
    ok = integrity["ok"] and omx["returncode"] == 0 and gov_ok and report_exists and no_ch04["ok"]

    payload = {
        "chapter": args.chapter,
        "mode": args.mode,
        "integrity": integrity,
        "omx": {"returncode": omx["returncode"], "stdout": omx["stdout"]},
        "governance": {"status": gov_status, "returncode": gov["returncode"], "stdout": gov["stdout"]},
        "report_exists": report_exists,
        "no_ch04_production": no_ch04,
        "verdict": "PASS" if ok else "FAIL",
    }
    print(json.dumps(payload, ensure_ascii=False, indent=2))
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
