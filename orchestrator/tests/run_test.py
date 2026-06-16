from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from orchestrator.engine.task_runner import run_task


TEST_PATH = ROOT / "orchestrator" / "tests" / "test_new_relic.json"


def main() -> int:
    task_input = json.loads(TEST_PATH.read_text(encoding="utf-8"))
    run_task(task_input)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
