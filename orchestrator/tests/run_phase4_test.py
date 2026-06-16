from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from orchestrator.tests.test_human_review_gate import (
    test_human_review_approval_enables_publish,
    test_review_package_generated,
    test_runtime_publish_blocked_before_approval,
)


def main() -> int:
    test_review_package_generated()
    test_runtime_publish_blocked_before_approval()
    test_human_review_approval_enables_publish()
    print("HUMAN_REVIEW_GATE_TESTS_PASSED")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
