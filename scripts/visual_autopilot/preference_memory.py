from __future__ import annotations

import json
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
ALIGNMENT_DIR = ROOT / "assets" / "visual-autopilot" / "alignment"
PREFERENCES_PATH = ALIGNMENT_DIR / "preferences.json"
HISTORY_PATH = ALIGNMENT_DIR / "history.json"


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def _load_json(path: Path, default):
    if not path.exists():
        return default
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return default


def _write_json(path: Path, payload) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")


class PreferenceMemory:
    def load_preferences(self) -> dict[str, Any]:
        data = _load_json(PREFERENCES_PATH, {"likes": [], "dislikes": [], "score_history": []})
        if not isinstance(data, dict):
            data = {"likes": [], "dislikes": [], "score_history": []}
        data.setdefault("likes", [])
        data.setdefault("dislikes", [])
        data.setdefault("score_history", [])
        return data

    def update_from_history(self) -> dict[str, Any]:
        history = _load_json(HISTORY_PATH, [])
        if not isinstance(history, list):
            history = []

        preferences = self.load_preferences()
        score_history = list(preferences.get("score_history", []))
        score_history.extend(history)

        dislike_counter = Counter()
        like_counter = Counter()
        for item in history:
            if not isinstance(item, dict):
                continue
            delta = int(item.get("delta", 0))
            note = str(item.get("review_note", "")).strip()
            if delta < 0 and note:
                dislike_counter[note] += 1
            elif delta > 0 and note:
                like_counter[note] += 1

        likes = sorted(set(preferences.get("likes", [])) | set(like_counter.keys()))
        dislikes = sorted(set(preferences.get("dislikes", [])) | set(dislike_counter.keys()))

        updated = {
            "generated_at": _now_iso(),
            "likes": likes,
            "dislikes": dislikes,
            "score_history": score_history,
            "summary": {
                "review_count": len(history),
                "positive_delta_count": sum(1 for item in history if isinstance(item, dict) and int(item.get("delta", 0)) > 0),
                "negative_delta_count": sum(1 for item in history if isinstance(item, dict) and int(item.get("delta", 0)) < 0),
            },
        }
        _write_json(PREFERENCES_PATH, updated)
        return updated

    def summarize(self) -> dict[str, Any]:
        preferences = self.load_preferences()
        history = _load_json(HISTORY_PATH, [])
        if not isinstance(history, list):
            history = []
        gemini_better = sum(1 for item in history if isinstance(item, dict) and int(item.get("delta", 0)) < 0)
        human_better = sum(1 for item in history if isinstance(item, dict) and int(item.get("delta", 0)) > 0)
        summary = {
            "generated_at": _now_iso(),
            "likes": preferences.get("likes", []),
            "dislikes": preferences.get("dislikes", []),
            "review_count": len(history),
            "gemini_better_count": gemini_better,
            "human_better_count": human_better,
        }
        return summary
