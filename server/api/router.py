from __future__ import annotations

from dataclasses import dataclass
from typing import Callable, Any

from server.api.mock_loader import (
    load_merchant_event_mock,
    load_merchant_portal_mock,
    load_park_admin_mock,
    load_platform_admin_mock,
)


def ok(data: Any):
    return {
        "success": True,
        "message": "ok",
        "data": data,
    }


@dataclass(frozen=True)
class Route:
    method: str
    path: str
    handler: Callable[..., dict]


def _merchant_dashboard():
    return ok(load_merchant_portal_mock("merchant_profile.mock.json"))


def _merchant_coupons():
    return ok(load_merchant_portal_mock("merchant_coupon.mock.json"))


def _merchant_tickets():
    return ok(load_merchant_portal_mock("merchant_ticket.mock.json"))


def _park_dashboard():
    return ok(load_park_admin_mock("park_admin_dashboard_summary.mock.json"))


def _park_activities():
    return ok(load_park_admin_mock("park_activity.mock.json"))


def _platform_dashboard():
    return ok(load_platform_admin_mock("platform_dashboard_summary.mock.json"))


def _platform_reviews():
    return ok(load_platform_admin_mock("platform_activity_review.mock.json"))


def _event_list():
    return ok(load_merchant_event_mock("activity.mock.json"))


def _event_detail(activity_id: str):
    activities = load_merchant_event_mock("activity.mock.json")
    if isinstance(activities, list):
        for item in activities:
            if item.get("id") == activity_id:
                return ok(item)
        return ok(activities[0] if activities else {})
    if isinstance(activities, dict):
        return ok(activities)
    return ok({})


def _event_tasks():
    return ok(load_merchant_event_mock("activity_task.mock.json"))


def _event_assets():
    return ok(load_merchant_event_mock("activity_asset.mock.json"))


ROUTES = [
    Route("GET", "/api/merchant/dashboard", _merchant_dashboard),
    Route("GET", "/api/merchant/coupons", _merchant_coupons),
    Route("GET", "/api/merchant/tickets", _merchant_tickets),
    Route("GET", "/api/park/dashboard", _park_dashboard),
    Route("GET", "/api/park/activities", _park_activities),
    Route("GET", "/api/platform/dashboard", _platform_dashboard),
    Route("GET", "/api/platform/reviews", _platform_reviews),
    Route("GET", "/api/event/list", _event_list),
    Route("GET", "/api/event/detail/{id}", _event_detail),
    Route("GET", "/api/event/tasks", _event_tasks),
    Route("GET", "/api/event/assets", _event_assets),
]


def register_routes():
    return {f"{route.method} {route.path}": route.handler for route in ROUTES}


def dispatch(method: str, path: str, **params):
    registry = register_routes()
    key = f"{method.upper()} {path}"
    if key in registry:
        return registry[key](**params)
    if method.upper() == "GET" and path.startswith("/api/event/detail/"):
        activity_id = path.rsplit("/", 1)[-1]
        return _event_detail(activity_id)
    raise KeyError(f"route not found: {method} {path}")

