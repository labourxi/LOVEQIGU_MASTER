from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
REVIEW_STATUS_PATH = ROOT / "assets" / "visual-autopilot" / "review" / "review_status.json"
EVENT_SEED_PATH = ROOT / "data" / "merchant_event" / "activity.seed.json"
BINDINGS_SEED_PATH = ROOT / "data" / "merchant_event" / "bindings.seed.json"

EVENTS_DIR = ROOT / "runtime" / "events"
PUBLISHED_DIR = EVENTS_DIR / "published"
BLOCKED_DIR = EVENTS_DIR / "blocked"
EVENT_INDEX_PATH = EVENTS_DIR / "event_index.json"


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


def _load_seed(path: Path) -> dict[str, Any]:
    data = _load_json(path, {})
    return data if isinstance(data, dict) else {}


def _load_bindings(path: Path) -> dict[str, Any]:
    data = _load_json(path, {})
    return data if isinstance(data, dict) else {}


def _ensure_directories():
    PUBLISHED_DIR.mkdir(parents=True, exist_ok=True)
    BLOCKED_DIR.mkdir(parents=True, exist_ok=True)


def load_review_status() -> dict[str, Any]:
    data = _load_json(REVIEW_STATUS_PATH, {})
    return data if isinstance(data, dict) else {}


def can_publish(review_status: dict[str, Any] | None = None) -> bool:
    status = review_status if review_status is not None else load_review_status()
    approval_status = str(status.get("approval_status", "")).upper()
    return approval_status == "APPROVED"


def build_qr_payload(event_code: str, entry_url: str) -> dict[str, Any]:
    return {
        "event_code": event_code,
        "entry_url": entry_url,
    }


def publish_runtime() -> dict[str, Any]:
    _ensure_directories()
    review_status = load_review_status()
    activity = _load_seed(EVENT_SEED_PATH)
    bindings = _load_bindings(BINDINGS_SEED_PATH)
    approval_status = str(review_status.get("approval_status", "")).upper()
    event_code = str(activity.get("event_code", "LOVEQIGU_FIRST_EVENT_CASE_V1"))
    event_id = str(activity.get("event_id", "event_loveqigu_first_event_v1"))
    event_name = str(activity.get("event_name", "爱企谷初见寻宝节"))
    entry_url = f"/event/{event_code}"
    publish_time = _now_iso()

    if approval_status != "APPROVED":
        blocked_payload = {
            "event_id": event_id,
            "event_name": event_name,
            "event_code": event_code,
            "status": "BLOCKED",
            "blocked_reason": "REVIEW_NOT_APPROVED",
            "approval_status": approval_status or "PENDING_REVIEW",
            "attempt_time": publish_time,
            "review_status_path": _relative(REVIEW_STATUS_PATH),
            "activity_seed_path": _relative(EVENT_SEED_PATH),
            "bindings_seed_path": _relative(BINDINGS_SEED_PATH),
        }
        blocked_path = BLOCKED_DIR / f"{event_code}.json"
        _write_json(blocked_path, blocked_payload)
        index = _load_json(EVENT_INDEX_PATH, {"version": "1.0", "events": []})
        if not isinstance(index, dict):
            index = {"version": "1.0", "events": []}
        events = index.get("events", [])
        if not isinstance(events, list):
            events = []
        events.append(blocked_payload)
        index["version"] = index.get("version", "1.0")
        index["events"] = events
        _write_json(EVENT_INDEX_PATH, index)
        return {
            "status": "blocked",
            "reason": "REVIEW_NOT_APPROVED",
            "approval_status": approval_status or "PENDING_REVIEW",
            "event_id": event_id,
            "event_name": event_name,
            "blocked_path": _relative(blocked_path),
            "event_index_path": _relative(EVENT_INDEX_PATH),
            "bindings_count": len(bindings.get("activity_to_merchants", [])) if isinstance(bindings.get("activity_to_merchants", []), list) else 0,
        }

    manifest = {
        "event_id": event_id,
        "event_name": event_name,
        "publish_time": publish_time,
        "entry_url": entry_url,
        "qr_payload": build_qr_payload(event_code=event_code, entry_url=entry_url),
        "status": "PUBLISHED",
    }
    published_path = PUBLISHED_DIR / f"{event_code}.json"
    _write_json(published_path, manifest)

    index = _load_json(EVENT_INDEX_PATH, {"version": "1.0", "events": []})
    if not isinstance(index, dict):
        index = {"version": "1.0", "events": []}
    events = index.get("events", [])
    if not isinstance(events, list):
        events = []
    events.append(
        {
            "event_id": event_id,
            "event_name": event_name,
            "event_code": event_code,
            "publish_time": publish_time,
            "status": "PUBLISHED",
            "published_path": _relative(published_path),
        }
    )
    index["version"] = index.get("version", "1.0")
    index["events"] = events
    _write_json(EVENT_INDEX_PATH, index)
    return {
        "status": "success",
        "event_id": event_id,
        "event_name": event_name,
        "published_path": _relative(published_path),
        "event_index_path": _relative(EVENT_INDEX_PATH),
        "manifest": manifest,
    }

