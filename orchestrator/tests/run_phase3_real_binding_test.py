from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from orchestrator.tests.test_factory_real_binding import (
    test_dispatcher_and_runner_compatibility,
    test_relic_factory_real_binding,
    test_story_factory_real_binding,
    test_visual_factory_real_binding,
)


def main() -> int:
    test_relic_factory_real_binding()
    test_story_factory_real_binding()
    test_visual_factory_real_binding()
    test_dispatcher_and_runner_compatibility()
    print("FACTORY_REAL_BINDING_TESTS_PASSED")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
