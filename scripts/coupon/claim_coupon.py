from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
COUPON_TEMPLATE_PATH = ROOT / "data" / "merchant_event" / "coupon_templates.seed.json"
USER_COUPON_PATH = ROOT / "data" / "user_mock" / "user_coupon.mock.json"
USER_COUPON_HISTORY_PATH = ROOT / "data" / "user_mock" / "user_coupon_claim_history.mock.json"


def _now_iso() -> str:
    return datetime.now(timezone.utc).astimezone().isoformat().replace("+00:00", "+08:00")


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


def _coupon_templates() -> list[dict[str, Any]]:
    data = _load_json(COUPON_TEMPLATE_PATH, [])
    return data if isinstance(data, list) else []


def _merchant_names() -> dict[str, str]:
    event_seed = _load_json(ROOT / "data" / "merchant_event" / "merchants.seed.json", [])
    if not isinstance(event_seed, list):
        return {}
    return {item.get("merchant_id"): item.get("merchant_name", "") for item in event_seed if isinstance(item, dict)}


def load_user_coupons() -> list[dict[str, Any]]:
    data = _load_json(USER_COUPON_PATH, [])
    return data if isinstance(data, list) else []


def save_user_coupons(coupons: list[dict[str, Any]]) -> Path:
    return _write_json(USER_COUPON_PATH, coupons)


def append_history(entry: dict[str, Any]) -> Path:
    history = _load_json(USER_COUPON_HISTORY_PATH, [])
    if not isinstance(history, list):
        history = []
    history.append(entry)
    return _write_json(USER_COUPON_HISTORY_PATH, history)


def claim_coupon(coupon_id: str) -> dict[str, Any]:
    templates = _coupon_templates()
    template = next((item for item in templates if item.get("coupon_id") == coupon_id), None)
    if not template:
        return {
            "success": False,
            "message": "coupon not found",
            "status": "ERROR",
        }

    merchant_names = _merchant_names()
    coupons = load_user_coupons()
    existing = next((item for item in coupons if item.get("coupon_id") == coupon_id), None)
    if existing:
        existing["status"] = "CLAIMED"
        existing["claimed_at"] = existing.get("claimed_at") or _now_iso()
    else:
        coupons.append(
            {
                "coupon_id": coupon_id,
                "coupon_name": template.get("coupon_name", ""),
                "coupon_type": template.get("coupon_type", ""),
                "discount_value": template.get("discount_value", 0),
                "merchant_id": template.get("merchant_id", ""),
                "merchant_name": merchant_names.get(template.get("merchant_id"), ""),
                "status": "CLAIMED",
                "claimed_at": _now_iso(),
                "used_at": None,
                "expired_at": "2026-07-20T21:00:00+08:00",
            }
        )

    save_user_coupons(coupons)
    append_history(
        {
            "coupon_id": coupon_id,
            "coupon_name": template.get("coupon_name", ""),
            "action": "CLAIMED",
            "timestamp": _now_iso(),
        }
    )
    return {
        "success": True,
        "message": "ok",
        "data": {
            "coupon_id": coupon_id,
            "status": "CLAIMED",
            "saved_to": str(USER_COUPON_PATH.relative_to(ROOT)),
        },
    }


def list_available_coupons() -> list[dict[str, Any]]:
    templates = _coupon_templates()
    merchant_names = _merchant_names()
    user_coupons = {item.get("coupon_id"): item for item in load_user_coupons()}
    available = []
    for item in templates:
        coupon_id = item.get("coupon_id")
        status = "AVAILABLE"
        if coupon_id in user_coupons and user_coupons[coupon_id].get("status") == "CLAIMED":
            status = "CLAIMED"
        available.append(
            {
                "coupon_id": coupon_id,
                "coupon_name": item.get("coupon_name", ""),
                "coupon_type": item.get("coupon_type", ""),
                "discount_value": item.get("discount_value", 0),
                "merchant_id": item.get("merchant_id", ""),
                "merchant_name": merchant_names.get(item.get("merchant_id"), ""),
                "status": status,
            }
        )
    return available


if __name__ == "__main__":
    import sys

    coupon_id = sys.argv[1] if len(sys.argv) > 1 else "coupon_loveqigu_cafe_01"
    result = claim_coupon(coupon_id)
    print(json.dumps(result, ensure_ascii=False, indent=2))

