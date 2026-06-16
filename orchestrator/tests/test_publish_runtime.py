from __future__ import annotations

from pathlib import Path

from orchestrator.publish.publish_runtime import publish_runtime
from orchestrator.review.approval_console import ApprovalConsole


ROOT = Path(__file__).resolve().parents[2]
PUBLISHED_PATH = ROOT / "runtime" / "events" / "published" / "LOVEQIGU_FIRST_EVENT_CASE_V1.json"
BLOCKED_PATH = ROOT / "runtime" / "events" / "blocked" / "LOVEQIGU_FIRST_EVENT_CASE_V1.json"
EVENT_INDEX_PATH = ROOT / "runtime" / "events" / "event_index.json"


def _clean_outputs():
    for path in [PUBLISHED_PATH, BLOCKED_PATH, EVENT_INDEX_PATH]:
        if path.exists():
            path.unlink()


def test_publish_blocked_for_rejected():
    _clean_outputs()
    ApprovalConsole().reject("codex", "reject for publish test")
    result = publish_runtime()
    assert result["status"] == "blocked"
    assert result["reason"] == "REVIEW_NOT_APPROVED"
    assert BLOCKED_PATH.exists()
    assert EVENT_INDEX_PATH.exists()


def test_publish_blocked_for_pending():
    _clean_outputs()
    ApprovalConsole().set_status("PENDING_REVIEW", reviewer="codex", note="pending for publish test")
    result = publish_runtime()
    assert result["status"] == "blocked"
    assert result["reason"] == "REVIEW_NOT_APPROVED"
    assert BLOCKED_PATH.exists()
    assert EVENT_INDEX_PATH.exists()


def test_publish_success_for_approved():
    _clean_outputs()
    ApprovalConsole().approve("codex", "approve for publish test")
    result = publish_runtime()
    assert result["status"] == "success"
    assert PUBLISHED_PATH.exists()
    assert EVENT_INDEX_PATH.exists()

