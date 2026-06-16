from __future__ import annotations

from pathlib import Path
from typing import Any

from .asset_registry import AssetRegistry


class VersionRegistry:
    def __init__(self, asset_registry: AssetRegistry | None = None):
        self.asset_registry = asset_registry or AssetRegistry()

    def normalize_version(self, version: str | None) -> str:
        value = str(version or "").strip()
        return value if value else "1.0"

    def register_story_version(
        self,
        story_id: str,
        chapter: str,
        version: str,
        source_task: str,
    ) -> dict[str, Any]:
        return self.asset_registry.register_story(
            story_id=story_id,
            chapter=chapter,
            version=self.normalize_version(version),
            source_task=source_task,
        )

    def register_relic_version(
        self,
        relic_id: str,
        relic_name: str,
        version: str,
    ) -> dict[str, Any]:
        return self.asset_registry.register_relic(
            relic_id=relic_id,
            relic_name=relic_name,
            version=self.normalize_version(version),
        )

