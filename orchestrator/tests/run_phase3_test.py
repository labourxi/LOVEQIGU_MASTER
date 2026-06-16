from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from orchestrator.tests.test_factory_dispatcher import (
    test_dispatcher_routes_new_relic,
    test_dispatcher_routes_new_story,
    test_dispatcher_routes_new_visual,
    test_runner_connects_dispatcher,
)


def main() -> int:
    test_dispatcher_routes_new_relic()
    test_dispatcher_routes_new_visual()
    test_dispatcher_routes_new_story()
    test_runner_connects_dispatcher()
    print("FACTORY_DISPATCHER_TESTS_PASSED")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
