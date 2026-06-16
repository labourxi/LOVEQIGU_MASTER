#!/usr/bin/env python3
"""Admin content gate for LOVEQIGU."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts" / "autopilot"))

from run_admin_content_model_v1 import DEFAULT_REPORT, evaluate_admin_gate, load_config  # noqa: E402


def main() -> int:
    parser = argparse.ArgumentParser(description="LOVEQIGU admin content gate")
    parser.add_argument("--checkpoint", default=None)
    parser.add_argument("--chapter", default=None)
    parser.add_argument("--mode", default="dry-run")
    parser.add_argument("--report", default=str(DEFAULT_REPORT))
    args = parser.parse_args()

    config = load_config()
    checkpoint_id = args.checkpoint or config["test_checkpoint_id"]
    chapter = args.chapter or config["default_chapter"]
    report_path = Path(args.report)
    gate = evaluate_admin_gate(config, checkpoint_id, chapter, report_path)

    print(gate["verdict"])
    print(json.dumps(gate, ensure_ascii=False, indent=2))
    return 0 if gate["verdict"] in {"PASS", "WARN"} else 1


if __name__ == "__main__":
    sys.exit(main())
