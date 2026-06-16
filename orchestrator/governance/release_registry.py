from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
REGISTRY_DIR = ROOT / "runtime" / "registry"
RELEASE_REGISTRY_PATH = REGISTRY_DIR / "releases.json"


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


class ReleaseRegistry:
    def __init__(self, registry_path: Path | None = None):
        self.registry_path = registry_path or RELEASE_REGISTRY_PATH

    def load(self) -> dict[str, Any]:
        data = _load_json(self.registry_path, {"version": "1.0", "releases": []})
        if not isinstance(data, dict):
            data = {"version": "1.0", "releases": []}
        data.setdefault("version", "1.0")
        data.setdefault("releases", [])
        return data

    def _save(self, payload: dict[str, Any]) -> Path:
        return _write_json(self.registry_path, payload)

    def register_release(
        self,
        release_id: str,
        asset_id: str,
        review_status: str,
        publish_time: str | None = None,
    ) -> dict[str, Any]:
        registry = self.load()
        entry = {
            "release_id": release_id,
            "asset_id": asset_id,
            "review_status": review_status,
            "publish_time": publish_time or _now_iso(),
        }
        items = [item for item in registry["releases"] if item.get("release_id") != release_id]
        items.append(entry)
        registry["releases"] = items
        self._save(registry)
        return entry

