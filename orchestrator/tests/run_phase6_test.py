from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from orchestrator.tests.test_release_manager import (
    test_release_blocked_for_pending,
    test_release_blocked_for_rejected,
    test_release_success_for_approved,
)


def main() -> int:
    test_release_blocked_for_rejected()
    test_release_blocked_for_pending()
    test_release_success_for_approved()
    print("RELEASE_MANAGER_TESTS_PASSED")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

