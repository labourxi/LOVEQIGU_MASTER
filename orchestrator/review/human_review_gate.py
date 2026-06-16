from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
JUDGE_DIR = ROOT / "assets" / "visual-autopilot" / "judge"
REVIEW_DIR = ROOT / "assets" / "visual-autopilot" / "review"
REVIEW_PACKAGE_PATH = REVIEW_DIR / "review_package.json"
REVIEW_STATUS_PATH = REVIEW_DIR / "review_status.json"
RANKING_PATH = JUDGE_DIR / "ranking.json"
JUDGE_REPORT_PATH = JUDGE_DIR / "judge_report.json"


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


def _normalize_candidate(value: str) -> str:
    return Path(str(value)).name.lower()


class HumanReviewGate:
    def __init__(
        self,
        ranking_path: Path | None = None,
        judge_report_path: Path | None = None,
        review_package_path: Path | None = None,
        review_status_path: Path | None = None,
    ):
        self.ranking_path = ranking_path or RANKING_PATH
        self.judge_report_path = judge_report_path or JUDGE_REPORT_PATH
        self.review_package_path = review_package_path or REVIEW_PACKAGE_PATH
        self.review_status_path = review_status_path or REVIEW_STATUS_PATH

    def _load_ranking(self) -> list[dict[str, Any]]:
        data = _load_json(self.ranking_path, [])
        return data if isinstance(data, list) else []

    def _load_judge_report(self) -> dict[str, Any]:
        data = _load_json(self.judge_report_path, {})
        return data if isinstance(data, dict) else {}

    def _candidate_lookup(self) -> dict[str, dict[str, Any]]:
        report = self._load_judge_report()
        lookup: dict[str, dict[str, Any]] = {}
        candidates = report.get("candidates", [])
        if not isinstance(candidates, list):
            return lookup
        for item in candidates:
            if not isinstance(item, dict):
                continue
            candidate = str(item.get("candidate", ""))
            if not candidate:
                continue
            lookup[_normalize_candidate(candidate)] = item
        return lookup

    def _build_review_item(self, ranking_item: dict[str, Any], winner_flag: bool) -> dict[str, Any]:
        candidate = str(ranking_item.get("candidate", ""))
        lookup = self._candidate_lookup()
        judge_item = lookup.get(_normalize_candidate(candidate), {})
        review_reason = judge_item.get("review_reason", {})
        if not isinstance(review_reason, dict):
            review_reason = {}
        scores = judge_item.get("scores", {})
        if not isinstance(scores, dict):
            scores = {}
        return {
            "candidate_path": candidate,
            "prompt_key": ranking_item.get("prompt_key", ""),
            "score": int(ranking_item.get("total_score", scores.get("total_score", 0) or 0)),
            "review_reason": review_reason,
            "winner_flag": bool(winner_flag),
            "judge_source": judge_item.get("judge_source", "LOCAL_FALLBACK"),
            "review_text": judge_item.get("review_text", ""),
            "candidate_details": {
                "key_found": judge_item.get("key_found"),
                "key_source": judge_item.get("key_source"),
                "scores": scores,
            },
        }

    def create_review_package(self) -> dict[str, Any]:
        ranking = self._load_ranking()
        top5 = ranking[:5]
        review_items = [self._build_review_item(item, index == 0) for index, item in enumerate(top5)]
        winner = review_items[0] if review_items else None
        package = {
            "generated_at": _now_iso(),
            "status": "PENDING_REVIEW",
            "approval_status": "PENDING_REVIEW",
            "runtime_publish_status": "BLOCKED",
            "runtime_publish_allowed": False,
            "blocked_reason": "REVIEW_NOT_APPROVED",
            "ranking_path": _relative(self.ranking_path),
            "judge_report_path": _relative(self.judge_report_path),
            "review_package_path": _relative(self.review_package_path),
            "review_status_path": _relative(self.review_status_path),
            "candidate_count": len(review_items),
            "winner": winner,
            "top5_candidates": review_items,
        }
        _write_json(self.review_package_path, package)
        _write_json(
            self.review_status_path,
            {
                "generated_at": package["generated_at"],
                "approval_status": package["approval_status"],
                "runtime_publish_status": package["runtime_publish_status"],
                "runtime_publish_allowed": package["runtime_publish_allowed"],
                "blocked_reason": package["blocked_reason"],
                "review_package_path": package["review_package_path"],
            },
        )
        return package

    def record_review_decision(self, status: str, reviewer: str = "", note: str = "") -> dict[str, Any]:
        current = self.create_review_package()
        normalized = status.upper()
        if normalized not in {"PENDING_REVIEW", "APPROVED", "REJECTED"}:
            normalized = "PENDING_REVIEW"
        current.update(
            {
                "status": normalized,
                "approval_status": normalized,
                "reviewer": reviewer,
                "review_note": note,
                "runtime_publish_status": "ALLOWED" if normalized == "APPROVED" else "BLOCKED",
                "runtime_publish_allowed": normalized == "APPROVED",
                "blocked_reason": "" if normalized == "APPROVED" else "REVIEW_NOT_APPROVED",
                "updated_at": _now_iso(),
            }
        )
        _write_json(self.review_package_path, current)
        _write_json(
            self.review_status_path,
            {
                "generated_at": current["generated_at"],
                "updated_at": current["updated_at"],
                "approval_status": current["approval_status"],
                "runtime_publish_status": current["runtime_publish_status"],
                "runtime_publish_allowed": current["runtime_publish_allowed"],
                "blocked_reason": current["blocked_reason"],
                "reviewer": reviewer,
                "review_note": note,
                "review_package_path": current["review_package_path"],
            },
        )
        return current

    def approve(self, reviewer: str, note: str = "") -> dict[str, Any]:
        return self.record_review_decision("APPROVED", reviewer=reviewer, note=note)

    def reject(self, reviewer: str, note: str = "") -> dict[str, Any]:
        return self.record_review_decision("REJECTED", reviewer=reviewer, note=note)

    def load_review_package(self) -> dict[str, Any]:
        data = _load_json(self.review_package_path, {})
        return data if isinstance(data, dict) else {}

    def can_publish(self) -> bool:
        package = self.load_review_package()
        return str(package.get("approval_status", package.get("status", ""))).upper() == "APPROVED"

    def attempt_runtime_publish(self) -> dict[str, Any]:
        package = self.load_review_package()
        approval_status = str(package.get("approval_status", package.get("status", ""))).upper()
        if approval_status != "APPROVED":
            result = {
                "status": "blocked",
                "runtime_publish_allowed": False,
                "approval_status": approval_status or "PENDING_REVIEW",
                "blocked_reason": "REVIEW_NOT_APPROVED",
                "review_package_path": _relative(self.review_package_path),
            }
        else:
            result = {
                "status": "allowed",
                "runtime_publish_allowed": True,
                "approval_status": "APPROVED",
                "blocked_reason": "",
                "review_package_path": _relative(self.review_package_path),
            }
        _write_json(self.review_status_path, {**result, "generated_at": _now_iso()})
        return result

