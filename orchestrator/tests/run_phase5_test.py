from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from orchestrator.tests.test_approval_console import (
    test_console_approve_changes_status,
    test_console_reads_review_package,
    test_console_reject_changes_status,
    test_console_status_json_updates,
)


def main() -> int:
    test_console_reads_review_package()
    test_console_approve_changes_status()
    test_console_reject_changes_status()
    test_console_status_json_updates()
    print("APPROVAL_CONSOLE_TESTS_PASSED")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

