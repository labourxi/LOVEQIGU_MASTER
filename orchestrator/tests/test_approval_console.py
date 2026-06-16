from __future__ import annotations

from orchestrator.review.approval_console import ApprovalConsole


def test_console_reads_review_package():
    console = ApprovalConsole()
    display = console.display()
    assert display["candidate_count"] >= 1
    assert display["candidates"][0]["winner_flag"] is True


def test_console_approve_changes_status():
    console = ApprovalConsole()
    result = console.approve("codex", "approved in console")
    assert result["approval_status"] == "APPROVED"
    assert result["runtime_publish_allowed"] is True
    assert result["runtime_publish_status"] == "ALLOWED"


def test_console_reject_changes_status():
    console = ApprovalConsole()
    result = console.reject("codex", "rejected in console")
    assert result["approval_status"] == "REJECTED"
    assert result["runtime_publish_allowed"] is False
    assert result["runtime_publish_status"] == "BLOCKED"


def test_console_status_json_updates():
    console = ApprovalConsole()
    approved = console.approve("codex", "approve")
    assert approved["approval_status"] == "APPROVED"
    rejected = console.reject("codex", "reject")
    assert rejected["approval_status"] == "REJECTED"

