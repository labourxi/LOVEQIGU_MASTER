from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from .human_review_gate import HumanReviewGate


ROOT = Path(__file__).resolve().parents[2]
REVIEW_DIR = ROOT / "assets" / "visual-autopilot" / "review"
REVIEW_PACKAGE_PATH = REVIEW_DIR / "review_package.json"
REVIEW_STATUS_PATH = REVIEW_DIR / "review_status.json"


def _load_json(path: Path, default: Any):
    if not path.exists():
        return default
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return default


class ApprovalConsole:
    def __init__(
        self,
        review_package_path: Path | None = None,
        review_status_path: Path | None = None,
    ):
        self.review_package_path = review_package_path or REVIEW_PACKAGE_PATH
        self.review_status_path = review_status_path or REVIEW_STATUS_PATH
        self.gate = HumanReviewGate(
            review_package_path=self.review_package_path,
            review_status_path=self.review_status_path,
        )

    def load_review_context(self) -> dict[str, Any]:
        package = _load_json(self.review_package_path, {})
        status = _load_json(self.review_status_path, {})
        if not isinstance(package, dict):
            package = {}
        if not isinstance(status, dict):
            status = {}
        return {
            "review_package": package,
            "review_status": status,
            "status": str(package.get("approval_status", package.get("status", "PENDING_REVIEW"))).upper(),
        }

    def display(self) -> dict[str, Any]:
        context = self.load_review_context()
        package = context["review_package"]
        top5 = package.get("top5_candidates", [])
        if not isinstance(top5, list):
            top5 = []
        rows = []
        for item in top5:
            if not isinstance(item, dict):
                continue
            rows.append(
                {
                    "candidate_path": item.get("candidate_path", ""),
                    "score": item.get("score", 0),
                    "review_reason": item.get("review_reason", {}),
                    "winner_flag": bool(item.get("winner_flag", False)),
                }
            )
        return {
            "status": context["status"],
            "candidate_count": len(rows),
            "candidates": rows,
            "runtime_publish_allowed": bool(package.get("runtime_publish_allowed", False)),
            "blocked_reason": package.get("blocked_reason", ""),
        }

    def approve(self, reviewer: str, note: str = "") -> dict[str, Any]:
        return self.gate.approve(reviewer=reviewer, note=note)

    def reject(self, reviewer: str, note: str = "") -> dict[str, Any]:
        return self.gate.reject(reviewer=reviewer, note=note)

    def set_status(self, status: str, reviewer: str = "", note: str = "") -> dict[str, Any]:
        normalized = status.upper()
        if normalized == "APPROVED":
            return self.approve(reviewer=reviewer, note=note)
        if normalized == "REJECTED":
            return self.reject(reviewer=reviewer, note=note)
        return self.gate.record_review_decision("PENDING_REVIEW", reviewer=reviewer, note=note)

