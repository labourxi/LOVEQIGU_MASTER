from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from orchestrator.tests.test_publish_runtime import (
    test_publish_blocked_for_pending,
    test_publish_blocked_for_rejected,
    test_publish_success_for_approved,
)


def main():
    test_publish_blocked_for_rejected()
    test_publish_blocked_for_pending()
    test_publish_success_for_approved()
    print("PUBLISH_RUNTIME_VALIDATION_PASS")


if __name__ == "__main__":
    main()
