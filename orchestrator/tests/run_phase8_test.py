from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from orchestrator.tests.test_content_factory_dashboard import test_dashboard_counts_and_output


def main() -> int:
    test_dashboard_counts_and_output()
    print("CONTENT_FACTORY_DASHBOARD_TESTS_PASSED")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

