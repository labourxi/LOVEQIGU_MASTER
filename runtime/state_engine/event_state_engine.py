from __future__ import annotations

import json
from copy import deepcopy
from datetime import datetime
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
DATA_DIR = ROOT / "data" / "merchant_event"
USER_MOCK_DIR = ROOT / "data" / "user_mock"
RUNTIME_PROGRESS_DIR = ROOT / "runtime" / "user_progress"
RUNTIME_PROGRESS_PATH = RUNTIME_PROGRESS_DIR / "user_progress.json"
USER_COUPON_PATH = USER_MOCK_DIR / "user_coupon.mock.json"
USER_COUPON_HISTORY_PATH = USER_MOCK_DIR / "user_coupon_claim_history.mock.json"

DEFAULT_PROGRESS = {
    "explored_points": [],
    "completed_tasks": [],
    "owned_relics": [],
    "unlocked_coupons": [],
    "claimed_coupons": [],
    "updated_at": "",
}


def _load_json(path: Path, default: Any):
    if not path.exists():
        return deepcopy(default)
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return deepcopy(default)


def _save_json(path: Path, payload: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")


def _now_iso() -> str:
    return datetime.now().astimezone().isoformat(timespec="seconds")


def load_progress() -> dict[str, Any]:
    progress = _load_json(RUNTIME_PROGRESS_PATH, DEFAULT_PROGRESS)
    if not isinstance(progress, dict):
        progress = deepcopy(DEFAULT_PROGRESS)
    for key, value in DEFAULT_PROGRESS.items():
        progress.setdefault(key, deepcopy(value))
    return progress


def save_progress(progress: dict[str, Any]) -> dict[str, Any]:
    progress = deepcopy(progress)
    progress["updated_at"] = _now_iso()
    _save_json(RUNTIME_PROGRESS_PATH, progress)
    return progress


def _load_bindings() -> dict[str, Any]:
    bindings = _load_json(DATA_DIR / "bindings.seed.json", {})
    return bindings if isinstance(bindings, dict) else {}


def _load_activity() -> dict[str, Any]:
    activity = _load_json(DATA_DIR / "activity.seed.json", {})
    return activity if isinstance(activity, dict) else {}


def _load_tasks() -> list[dict[str, Any]]:
    tasks = _load_json(DATA_DIR / "tasks.seed.json", [])
    return tasks if isinstance(tasks, list) else []


def _load_relics() -> list[dict[str, Any]]:
    relics = _load_json(DATA_DIR / "relics.seed.json", [])
    return relics if isinstance(relics, list) else []


def _load_coupons() -> list[dict[str, Any]]:
    coupons = _load_json(DATA_DIR / "coupon_templates.seed.json", [])
    return coupons if isinstance(coupons, list) else []


def _load_merchants() -> list[dict[str, Any]]:
    merchants = _load_json(DATA_DIR / "merchants.seed.json", [])
    return merchants if isinstance(merchants, list) else []


def _merchant_name_map() -> dict[str, str]:
    return {item.get("merchant_id"): item.get("merchant_name", "") for item in _load_merchants() if isinstance(item, dict)}


def _append_unique(values: list[Any], value: Any) -> bool:
    if value in values:
        return False
    values.append(value)
    return True


def _task_to_point(task_id: str) -> dict[str, Any] | None:
    bindings = _load_bindings().get("exploration_point_task_bindings", [])
    for item in bindings if isinstance(bindings, list) else []:
      if isinstance(item, dict) and item.get("task_id") == task_id:
        return item
    return None


def _task_to_relic(task_id: str) -> dict[str, Any] | None:
    bindings = _load_bindings().get("task_relic_bindings", [])
    for item in bindings if isinstance(bindings, list) else []:
      if isinstance(item, dict) and item.get("task_id") == task_id:
        return item
    return None


def _relic_to_task(relic_id: str) -> dict[str, Any] | None:
    bindings = _load_bindings().get("task_relic_bindings", [])
    for item in bindings if isinstance(bindings, list) else []:
      if isinstance(item, dict) and item.get("relic_id") == relic_id:
        return item
    return None


def _task_to_coupon(task_id: str) -> str | None:
    point_binding = _task_to_point(task_id)
    if not point_binding:
        return None
    point_id = point_binding.get("point_id")
    points = _load_json(DATA_DIR / "exploration_points.seed.json", [])
    merchant_id = None
    for item in points if isinstance(points, list) else []:
        if isinstance(item, dict) and item.get("point_id") == point_id:
            merchant_id = item.get("merchant_id")
            break
    if not merchant_id:
        return None
    merchant_coupon_bindings = _load_bindings().get("merchant_coupon_bindings", [])
    for item in merchant_coupon_bindings if isinstance(merchant_coupon_bindings, list) else []:
        if isinstance(item, dict) and item.get("merchant_id") == merchant_id:
            return item.get("coupon_id")
    return None


def _sync_user_coupon_state(coupon_id: str, status: str, claimed_at: str | None = None) -> dict[str, Any]:
    coupons = _load_json(USER_COUPON_PATH, [])
    if not isinstance(coupons, list):
        coupons = []

    merchant_names = _merchant_name_map()
    coupon_templates = {item.get("coupon_id"): item for item in _load_coupons() if isinstance(item, dict)}
    template = coupon_templates.get(coupon_id, {})

    existing = None
    for item in coupons:
        if isinstance(item, dict) and item.get("coupon_id") == coupon_id:
            existing = item
            break

    if existing is None:
        existing = {
            "coupon_id": coupon_id,
            "coupon_name": template.get("coupon_name", coupon_id),
            "coupon_type": template.get("coupon_type", "unknown"),
            "discount_value": template.get("discount_value"),
            "merchant_id": template.get("merchant_id"),
            "merchant_name": merchant_names.get(template.get("merchant_id"), template.get("merchant_id", "")),
            "status": status,
            "claimed_at": claimed_at,
            "used_at": None,
            "expired_at": None,
        }
        coupons.append(existing)
    else:
        existing["status"] = status
        if claimed_at:
            existing["claimed_at"] = claimed_at
        existing.setdefault("used_at", None)
        existing.setdefault("expired_at", None)

    _save_json(USER_COUPON_PATH, coupons)
    return existing


def _append_claim_history(coupon_id: str, coupon_name: str, action: str) -> None:
    history = _load_json(USER_COUPON_HISTORY_PATH, [])
    if not isinstance(history, list):
        history = []
    history.append(
        {
            "coupon_id": coupon_id,
            "coupon_name": coupon_name,
            "action": action,
            "timestamp": _now_iso(),
        }
    )
    _save_json(USER_COUPON_HISTORY_PATH, history)


def complete_task(task_id: str) -> dict[str, Any]:
    activity = _load_activity()
    tasks = {item.get("task_id"): item for item in _load_tasks() if isinstance(item, dict)}
    task = tasks.get(task_id)
    if task is None:
        return {
            "success": False,
            "stage": "task_complete",
            "task_id": task_id,
            "status": "FAILED",
            "message": "task not found",
        }

    progress = load_progress()
    _append_unique(progress["completed_tasks"], task_id)

    point_binding = _task_to_point(task_id)
    if point_binding:
        _append_unique(progress["explored_points"], point_binding.get("point_id"))

    save_progress(progress)

    relic_result = None
    relic_binding = _task_to_relic(task_id)
    if relic_binding:
        relic_result = grant_relic(relic_binding.get("relic_id"), source_task_id=task_id)
    return {
        "success": True,
        "stage": "task_complete",
        "task_id": task_id,
        "activity_code": activity.get("event_code"),
        "status": "COMPLETED",
        "explored_points": list(progress["explored_points"]),
        "completed_tasks": list(progress["completed_tasks"]),
        "relic_result": relic_result,
    }


def grant_relic(relic_id: str, source_task_id: str | None = None) -> dict[str, Any]:
    relics = {item.get("relic_id"): item for item in _load_relics() if isinstance(item, dict)}
    relic = relics.get(relic_id)
    if relic is None:
        return {
            "success": False,
            "stage": "relic_granted",
            "relic_id": relic_id,
            "status": "FAILED",
            "message": "relic not found",
        }

    progress = load_progress()
    _append_unique(progress["owned_relics"], relic_id)
    save_progress(progress)

    coupon_result = None
    if source_task_id is None:
        source_binding = _relic_to_task(relic_id)
        source_task_id = source_binding.get("task_id") if source_binding else None
    if source_task_id:
        coupon_id = _task_to_coupon(source_task_id)
        if coupon_id:
            coupon_result = unlock_coupon(coupon_id, source_task_id=source_task_id, source_relic_id=relic_id)
    return {
        "success": True,
        "stage": "relic_granted",
        "relic_id": relic_id,
        "status": "GRANTED",
        "owned_relics": list(progress["owned_relics"]),
        "coupon_result": coupon_result,
    }


def unlock_coupon(coupon_id: str, source_task_id: str | None = None, source_relic_id: str | None = None) -> dict[str, Any]:
    coupon_templates = {item.get("coupon_id"): item for item in _load_coupons() if isinstance(item, dict)}
    template = coupon_templates.get(coupon_id)
    if template is None:
        return {
            "success": False,
            "stage": "coupon_unlocked",
            "coupon_id": coupon_id,
            "status": "FAILED",
            "message": "coupon not found",
        }

    progress = load_progress()
    _append_unique(progress["unlocked_coupons"], coupon_id)
    save_progress(progress)

    record = _sync_user_coupon_state(coupon_id, "AVAILABLE")
    return {
        "success": True,
        "stage": "coupon_unlocked",
        "coupon_id": coupon_id,
        "status": "AVAILABLE",
        "source_task_id": source_task_id,
        "source_relic_id": source_relic_id,
        "record": record,
    }


def claim_coupon(coupon_id: str) -> dict[str, Any]:
    coupon_templates = {item.get("coupon_id"): item for item in _load_coupons() if isinstance(item, dict)}
    template = coupon_templates.get(coupon_id)
    if template is None:
        return {
            "success": False,
            "stage": "coupon_claimed",
            "coupon_id": coupon_id,
            "status": "FAILED",
            "message": "coupon not found",
        }

    progress = load_progress()
    _append_unique(progress["claimed_coupons"], coupon_id)
    save_progress(progress)

    claimed_at = _now_iso()
    record = _sync_user_coupon_state(coupon_id, "CLAIMED", claimed_at=claimed_at)
    _append_claim_history(coupon_id, template.get("coupon_name", coupon_id), "CLAIMED")
    return {
        "success": True,
        "stage": "coupon_claimed",
        "coupon_id": coupon_id,
        "status": "CLAIMED",
        "claimed_at": claimed_at,
        "record": record,
    }


def reset_progress() -> dict[str, Any]:
    progress = deepcopy(DEFAULT_PROGRESS)
    return save_progress(progress)
