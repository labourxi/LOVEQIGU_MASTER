from __future__ import annotations

from pathlib import Path

from orchestrator.release.release_manager import ReleaseManager
from orchestrator.review.approval_console import ApprovalConsole


ROOT = Path(__file__).resolve().parents[2]
RELEASE_MANIFEST_PATH = ROOT / "runtime" / "releases" / "release_manifest.json"
RELEASE_HISTORY_PATH = ROOT / "runtime" / "releases" / "release_history.json"


def test_release_blocked_for_rejected():
    ApprovalConsole().reject("codex", "reject for release test")
    manager = ReleaseManager()
    result = manager.attempt_release("assets/visual-autopilot/winner/winner.jpg", source_factory="VisualFactory")
    assert result["status"] == "blocked"
    assert result["reason"] == "REVIEW_NOT_APPROVED"
    assert not RELEASE_MANIFEST_PATH.exists() or RELEASE_MANIFEST_PATH.exists()


def test_release_blocked_for_pending():
    ApprovalConsole().set_status("PENDING_REVIEW", reviewer="codex", note="pending for release test")
    manager = ReleaseManager()
    result = manager.attempt_release("assets/visual-autopilot/winner/winner.jpg", source_factory="VisualFactory")
    assert result["status"] == "blocked"
    assert result["reason"] == "REVIEW_NOT_APPROVED"


def test_release_success_for_approved():
    ApprovalConsole().approve("codex", "approve for release test")
    manager = ReleaseManager()
    result = manager.attempt_release("assets/visual-autopilot/winner/winner.jpg", source_factory="VisualFactory")
    assert result["status"] == "success"
    assert Path(ROOT / result["release_manifest_path"]).exists()
    assert Path(ROOT / result["release_history_path"]).exists()

