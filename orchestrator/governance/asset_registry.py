from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
REGISTRY_DIR = ROOT / "runtime" / "registry"
ASSET_REGISTRY_PATH = REGISTRY_DIR / "assets.json"


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def _load_json(path: Path, default: Any):
    if not path.exists():
        return default
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return default


def _write_json(path: Path, payload: Any) -> Path:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    return path


class AssetRegistry:
    def __init__(self, registry_path: Path | None = None):
        self.registry_path = registry_path or ASSET_REGISTRY_PATH

    def load(self) -> dict[str, Any]:
        data = _load_json(
            self.registry_path,
            {
                "version": "1.0",
                "visual_assets": [],
                "story_assets": [],
                "relic_assets": [],
            },
        )
        if not isinstance(data, dict):
            data = {
                "version": "1.0",
                "visual_assets": [],
                "story_assets": [],
                "relic_assets": [],
            }
        data.setdefault("version", "1.0")
        data.setdefault("visual_assets", [])
        data.setdefault("story_assets", [])
        data.setdefault("relic_assets", [])
        return data

    def _save(self, payload: dict[str, Any]) -> Path:
        return _write_json(self.registry_path, payload)

    def register_visual_asset(
        self,
        asset_id: str,
        asset_type: str,
        prompt: str,
        winner_file: str,
        model: str,
        created_at: str | None = None,
    ) -> dict[str, Any]:
        registry = self.load()
        entry = {
            "asset_id": asset_id,
            "asset_type": asset_type,
            "prompt": prompt,
            "winner_file": winner_file,
            "model": model,
            "created_at": created_at or _now_iso(),
        }
        items = [item for item in registry["visual_assets"] if item.get("asset_id") != asset_id]
        items.append(entry)
        registry["visual_assets"] = items
        self._save(registry)
        return entry

    def register_story(
        self,
        story_id: str,
        chapter: str,
        version: str,
        source_task: str,
    ) -> dict[str, Any]:
        registry = self.load()
        entry = {
            "story_id": story_id,
            "chapter": chapter,
            "version": version,
            "source_task": source_task,
        }
        items = [item for item in registry["story_assets"] if item.get("story_id") != story_id]
        items.append(entry)
        registry["story_assets"] = items
        self._save(registry)
        return entry

    def register_relic(
        self,
        relic_id: str,
        relic_name: str,
        version: str,
    ) -> dict[str, Any]:
        registry = self.load()
        entry = {
            "relic_id": relic_id,
            "relic_name": relic_name,
            "version": version,
        }
        items = [item for item in registry["relic_assets"] if item.get("relic_id") != relic_id]
        items.append(entry)
        registry["relic_assets"] = items
        self._save(registry)
        return entry

