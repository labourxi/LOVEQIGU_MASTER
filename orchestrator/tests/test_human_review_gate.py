from __future__ import annotations

from pathlib import Path

from orchestrator.review.human_review_gate import HumanReviewGate


ROOT = Path(__file__).resolve().parents[2]
REVIEW_DIR = ROOT / "assets" / "visual-autopilot" / "review"


def test_review_package_generated():
    gate = HumanReviewGate()
    package = gate.create_review_package()
    assert package["status"] == "PENDING_REVIEW"
    assert package["approval_status"] == "PENDING_REVIEW"
    assert package["runtime_publish_allowed"] is False
    assert package["candidate_count"] >= 1
    assert (REVIEW_DIR / "review_package.json").exists()
    assert (REVIEW_DIR / "review_status.json").exists()
    assert package["top5_candidates"]
    assert package["top5_candidates"][0]["winner_flag"] is True


def test_runtime_publish_blocked_before_approval():
    gate = HumanReviewGate()
    gate.create_review_package()
    publish = gate.attempt_runtime_publish()
    assert publish["status"] == "blocked"
    assert publish["runtime_publish_allowed"] is False
    assert publish["blocked_reason"] == "REVIEW_NOT_APPROVED"


def test_human_review_approval_enables_publish():
    gate = HumanReviewGate()
    gate.create_review_package()
    approved = gate.approve("codex", "manual review pass")
    assert approved["approval_status"] == "APPROVED"
    assert approved["runtime_publish_allowed"] is True
    assert gate.can_publish() is True
    publish = gate.attempt_runtime_publish()
    assert publish["status"] == "allowed"
    assert publish["runtime_publish_allowed"] is True
    reset = gate.create_review_package()
    assert reset["approval_status"] == "PENDING_REVIEW"
    assert reset["runtime_publish_allowed"] is False
