from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from orchestrator.tests.test_content_factory_governance import (
    test_relic_registry_records_version,
    test_release_registry_records_release,
    test_story_registry_records_version,
    test_visual_asset_registry_records_current_winner,
)


def main() -> int:
    test_visual_asset_registry_records_current_winner()
    test_story_registry_records_version()
    test_relic_registry_records_version()
    test_release_registry_records_release()
    print("CONTENT_FACTORY_GOVERNANCE_TESTS_PASSED")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

