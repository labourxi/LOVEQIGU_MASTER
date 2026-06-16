from __future__ import annotations

import json
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

try:
    from orchestrator.governance.release_registry import ReleaseRegistry
except Exception:  # pragma: no cover
    from ..governance.release_registry import ReleaseRegistry  # type: ignore


ROOT = Path(__file__).resolve().parents[2]
REVIEW_STATUS_PATH = ROOT / "assets" / "visual-autopilot" / "review" / "review_status.json"
RELEASES_DIR = ROOT / "runtime" / "releases"
RELEASE_MANIFEST_PATH = RELEASES_DIR / "release_manifest.json"
RELEASE_HISTORY_PATH = RELEASES_DIR / "release_history.json"


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


def _relative(path: Path) -> str:
    try:
        return str(path.resolve().relative_to(ROOT))
    except Exception:
        return str(path)


class ReleaseManager:
    def __init__(
        self,
        review_status_path: Path | None = None,
        release_manifest_path: Path | None = None,
        release_history_path: Path | None = None,
        release_registry: ReleaseRegistry | None = None,
    ):
        self.review_status_path = review_status_path or REVIEW_STATUS_PATH
        self.release_manifest_path = release_manifest_path or RELEASE_MANIFEST_PATH
        self.release_history_path = release_history_path or RELEASE_HISTORY_PATH
        self.release_registry = release_registry or ReleaseRegistry()

    def load_review_status(self) -> dict[str, Any]:
        data = _load_json(self.review_status_path, {})
        return data if isinstance(data, dict) else {}

    def can_release(self) -> bool:
        status = str(self.load_review_status().get("approval_status", "")).upper()
        return status == "APPROVED"

    def _append_history(self, manifest: dict[str, Any]) -> dict[str, Any]:
        history = _load_json(self.release_history_path, {"version": "1.0", "history": []})
        if not isinstance(history, dict):
            history = {"version": "1.0", "history": []}
        entries = history.get("history", [])
        if not isinstance(entries, list):
            entries = []
        entries.append(manifest)
        history["version"] = history.get("version", "1.0")
        history["history"] = entries
        _write_json(self.release_history_path, history)
        return history

    def attempt_release(self, asset_path: str, source_factory: str = "", release_id: str | None = None) -> dict[str, Any]:
        review_status = self.load_review_status()
        approval_status = str(review_status.get("approval_status", "")).upper()
        release_id = release_id or str(uuid.uuid4())
        if approval_status != "APPROVED":
            result = {
                "status": "blocked",
                "reason": "REVIEW_NOT_APPROVED",
                "approval_status": approval_status or "PENDING_REVIEW",
                "release_id": release_id,
            }
            _write_json(
                self.release_history_path,
                {
                    "version": "1.0",
                    "history": _load_json(self.release_history_path, {}).get("history", [])
                    if isinstance(_load_json(self.release_history_path, {}), dict)
                    else [],
                },
            )
            return result

        manifest = {
            "release_id": release_id,
            "asset_path": asset_path,
            "release_time": _now_iso(),
            "review_status": approval_status,
            "source_factory": source_factory,
        }
        _write_json(self.release_manifest_path, manifest)
        self._append_history(manifest)
        self.release_registry.register_release(
            release_id=release_id,
            asset_id=asset_path,
            review_status=approval_status,
            publish_time=manifest["release_time"],
        )
        return {
            "status": "success",
            "release_id": release_id,
            "release_manifest_path": _relative(self.release_manifest_path),
            "release_history_path": _relative(self.release_history_path),
            "release_registry_path": _relative(self.release_registry.registry_path),
            "manifest": manifest,
        }
