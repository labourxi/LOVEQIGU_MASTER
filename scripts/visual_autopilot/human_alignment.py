from __future__ import annotations

import json
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
ALIGNMENT_DIR = ROOT / "assets" / "visual-autopilot" / "alignment"
REVIEW_QUEUE_PATH = ALIGNMENT_DIR / "review_queue.json"
HISTORY_PATH = ALIGNMENT_DIR / "history.json"
PREFERENCES_PATH = ALIGNMENT_DIR / "preferences.json"


@dataclass
class AlignmentRecord:
    candidate: str
    gemini_score: int
    human_score: int
    delta: int
    review_note: str

    def to_dict(self) -> dict[str, Any]:
        return {
            "candidate": self.candidate,
            "gemini_score": self.gemini_score,
            "human_score": self.human_score,
            "delta": self.delta,
            "review_note": self.review_note,
        }


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


class HumanAlignment:
    def load_review_queue(self) -> list[dict[str, Any]]:
        data = _load_json(REVIEW_QUEUE_PATH, [])
        return data if isinstance(data, list) else []

    def write_review_queue(self, candidates: list[dict[str, Any]]) -> dict[str, Any]:
        queue = []
        for item in candidates[:3]:
            queue.append(
                {
                    "candidate": item.get("candidate", ""),
                    "gemini_score": int(item.get("total_score", 0)),
                    "human_score": None,
                    "note": "",
                    "status": "pending",
                }
            )
        payload = {
            "generated_at": _now_iso(),
            "queue": queue,
        }
        _write_json(REVIEW_QUEUE_PATH, payload)
        return payload

    def record_review(self, candidate: str, gemini_score: int, human_score: int, review_note: str) -> dict[str, Any]:
        delta = human_score - gemini_score
        record = AlignmentRecord(
            candidate=candidate,
            gemini_score=gemini_score,
            human_score=human_score,
            delta=delta,
            review_note=review_note,
        ).to_dict()
        history = _load_json(HISTORY_PATH, [])
        if not isinstance(history, list):
            history = []
        history.append({"timestamp": _now_iso(), **record})
        _write_json(HISTORY_PATH, history)
        return record

    def read_history(self) -> list[dict[str, Any]]:
        data = _load_json(HISTORY_PATH, [])
        return data if isinstance(data, list) else []
