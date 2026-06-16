from __future__ import annotations

from pathlib import Path

from orchestrator.governance.asset_registry import AssetRegistry
from orchestrator.governance.release_registry import ReleaseRegistry
from orchestrator.governance.version_registry import VersionRegistry
from orchestrator.release.release_manager import ReleaseManager
from orchestrator.review.approval_console import ApprovalConsole


ROOT = Path(__file__).resolve().parents[2]
ASSET_REGISTRY_PATH = ROOT / "runtime" / "registry" / "assets.json"
RELEASE_REGISTRY_PATH = ROOT / "runtime" / "registry" / "releases.json"


def test_visual_asset_registry_records_current_winner():
    registry = AssetRegistry()
    entry = registry.register_visual_asset(
        asset_id="visual_winner_bronze_relic",
        asset_type="visual",
        prompt="Ancient Eastern celestial relic, Jiao Mansion constellation seal, jade glyph artifacts, museum artifact lighting, soft golden dust particles, ancient manuscript background",
        winner_file="assets/visual-autopilot/winner/winner.jpg",
        model="doubao-seedream-5-0-260128",
    )
    assert entry["asset_id"] == "visual_winner_bronze_relic"
    assert ASSET_REGISTRY_PATH.exists()


def test_story_registry_records_version():
    version_registry = VersionRegistry()
    entry = version_registry.register_story_version(
        story_id="phase3_story_story",
        chapter="CH01",
        version="1.0",
        source_task="phase3_story",
    )
    assert entry["story_id"] == "phase3_story_story"
    assert entry["version"] == "1.0"


def test_relic_registry_records_version():
    version_registry = VersionRegistry()
    entry = version_registry.register_relic_version(
        relic_id="phase3_relic_relic",
        relic_name="unknown",
        version="1.0",
    )
    assert entry["relic_id"] == "phase3_relic_relic"
    assert entry["version"] == "1.0"


def test_release_registry_records_release():
    ApprovalConsole().approve("codex", "approve registry test")
    manager = ReleaseManager()
    result = manager.attempt_release("assets/visual-autopilot/winner/winner.jpg", source_factory="VisualFactory")
    assert result["status"] == "success"
    release_registry = ReleaseRegistry()
    data = release_registry.load()
    assert any(item.get("release_id") == result["release_id"] for item in data["releases"])
    assert RELEASE_REGISTRY_PATH.exists()

