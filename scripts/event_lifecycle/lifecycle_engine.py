from __future__ import annotations


TRANSITIONS = {
    "DRAFT": ["SUBMITTED"],
    "SUBMITTED": ["PARK_REVIEW"],
    "PARK_REVIEW": ["PLATFORM_REVIEW"],
    "PLATFORM_REVIEW": ["APPROVED", "REJECTED"],
    "APPROVED": ["PUBLISHED"],
    "PUBLISHED": ["RUNNING"],
    "RUNNING": ["FINISHED"],
    "FINISHED": ["ARCHIVED"],
    "ARCHIVED": [],
    "REJECTED": [],
}


def get_allowed_next_status(current_status: str) -> list[str]:
    return list(TRANSITIONS.get(current_status, []))


def is_valid_status(status: str) -> bool:
    return status in TRANSITIONS

