from __future__ import annotations

import json
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
ASSET_REGISTRY_PATH = ROOT / "runtime" / "registry" / "assets.json"
RELEASE_REGISTRY_PATH = ROOT / "runtime" / "registry" / "releases.json"
JUDGE_REPORT_PATH = ROOT / "assets" / "visual-autopilot" / "judge" / "judge_report.json"
RANKING_PATH = ROOT / "assets" / "visual-autopilot" / "judge" / "ranking.json"
RELEASE_HISTORY_PATH = ROOT / "runtime" / "releases" / "release_history.json"
DASHBOARD_PATH = ROOT / "runtime" / "dashboard" / "dashboard.json"


def _load_json(path: Path, default: Any):
    if not path.exists():
        return default
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return default


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


class DashboardStats:
    def __init__(
        self,
        asset_registry_path: Path | None = None,
        release_registry_path: Path | None = None,
        judge_report_path: Path | None = None,
        ranking_path: Path | None = None,
        release_history_path: Path | None = None,
        dashboard_path: Path | None = None,
    ):
        self.asset_registry_path = asset_registry_path or ASSET_REGISTRY_PATH
        self.release_registry_path = release_registry_path or RELEASE_REGISTRY_PATH
        self.judge_report_path = judge_report_path or JUDGE_REPORT_PATH
        self.ranking_path = ranking_path or RANKING_PATH
        self.release_history_path = release_history_path or RELEASE_HISTORY_PATH
        self.dashboard_path = dashboard_path or DASHBOARD_PATH

    def _asset_counts(self) -> dict[str, int]:
        data = _load_json(self.asset_registry_path, {})
        if not isinstance(data, dict):
            data = {}
        return {
            "visual": len(data.get("visual_assets", []) or []),
            "story": len(data.get("story_assets", []) or []),
            "relic": len(data.get("relic_assets", []) or []),
        }

    def _release_counts(self) -> dict[str, int]:
        data = _load_json(self.release_registry_path, {})
        releases = data.get("releases", []) if isinstance(data, dict) else []
        if not isinstance(releases, list):
            releases = []
        counter = Counter(str(item.get("review_status", "")).lower() for item in releases if isinstance(item, dict))
        return {
            "approved": int(counter.get("approved", 0)),
            "rejected": int(counter.get("rejected", 0)),
            "pending": int(counter.get("pending_review", 0) + counter.get("pending", 0)),
        }

    def _visual_summary(self) -> dict[str, Any]:
        judge_report = _load_json(self.judge_report_path, {})
        ranking = _load_json(self.ranking_path, [])
        if not isinstance(judge_report, dict):
            judge_report = {}
        candidates = judge_report.get("candidates", [])
        if not isinstance(candidates, list):
            candidates = []
        winner_count = 1 if judge_report.get("winner") else 0
        candidate_count = len(candidates)
        scores = []
        for item in candidates:
            if not isinstance(item, dict):
                continue
            score = item.get("scores", {})
            if isinstance(score, dict):
                scores.append(int(score.get("total_score", 0)))
        gemini_score_mean = round(sum(scores) / len(scores), 2) if scores else 0.0
        return {
            "winner_count": winner_count,
            "candidate_count": candidate_count,
            "gemini_score_mean": gemini_score_mean,
            "ranking_count": len(ranking) if isinstance(ranking, list) else 0,
        }

    def _factory_summary(self) -> dict[str, Any]:
        release_history = _load_json(self.release_history_path, {})
        history = release_history.get("history", []) if isinstance(release_history, dict) else []
        if not isinstance(history, list):
            history = []
        total_generated = len(history)
        today = datetime.now(timezone.utc).date().isoformat()
        daily_generated = 0
        for item in history:
            if not isinstance(item, dict):
                continue
            release_time = str(item.get("release_time", ""))
            if release_time.startswith(today):
                daily_generated += 1
        return {
            "daily_generated": daily_generated,
            "total_generated": total_generated,
        }

    def build_dashboard(self) -> dict[str, Any]:
        dashboard = {
            "generated_at": _now_iso(),
            "asset_summary": self._asset_counts(),
            "release_summary": self._release_counts(),
            "factory_summary": self._factory_summary(),
            "visual_summary": self._visual_summary(),
        }
        self.dashboard_path.parent.mkdir(parents=True, exist_ok=True)
        self.dashboard_path.write_text(json.dumps(dashboard, ensure_ascii=False, indent=2), encoding="utf-8")
        return dashboard

