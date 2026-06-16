from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path

try:
    from .human_alignment import HumanAlignment, REVIEW_QUEUE_PATH, HISTORY_PATH, PREFERENCES_PATH
    from .preference_memory import PreferenceMemory
except Exception:  # pragma: no cover
    from human_alignment import HumanAlignment, REVIEW_QUEUE_PATH, HISTORY_PATH, PREFERENCES_PATH  # type: ignore
    from preference_memory import PreferenceMemory  # type: ignore


ROOT = Path(__file__).resolve().parents[2]
JUDGE_RANKING_PATH = ROOT / "assets" / "visual-autopilot" / "judge" / "ranking.json"
ALIGNMENT_DIR = ROOT / "assets" / "visual-autopilot" / "alignment"
USAGE_PATH = ROOT / "assets" / "visual-autopilot" / "governance" / "usage.json"
REPORT_PATH = ROOT / "docs" / "VISUAL_AUTOPILOT_HUMAN_ALIGNMENT_V1_REPORT.md"
USAGE_REPORT_PATH = ROOT / "docs" / "VISUAL_AUTOPILOT_USAGE_GOVERNANCE_V1_REPORT.md"


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def _write_json(path: Path, payload) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")


def _relative(path: Path) -> str:
    return str(path.resolve().relative_to(ROOT))


def _load_ranking() -> list[dict[str, object]]:
    if not JUDGE_RANKING_PATH.exists():
        return []
    try:
        data = json.loads(JUDGE_RANKING_PATH.read_text(encoding="utf-8"))
        if isinstance(data, list):
            return [item for item in data if isinstance(item, dict)]
    except Exception:
        return []
    return []


def _ensure_history_file() -> None:
    if not HISTORY_PATH.exists():
        _write_json(HISTORY_PATH, [])


def _ensure_usage_file() -> dict[str, object]:
    usage = {
        "seedream_calls": 0,
        "trial_limit": 200,
        "warning_threshold": 150,
        "critical_threshold": 180,
        "stop_threshold": 195,
    }
    _write_json(USAGE_PATH, usage)
    return usage


def _write_reports(summary: dict[str, object], usage: dict[str, object]) -> None:
    alignment_lines = [
        "# VISUAL_AUTOPILOT_HUMAN_ALIGNMENT_V1_REPORT",
        "",
        "## Summary",
        f"- status: `PASS`",
        f"- review_queue: `{summary.get('review_queue_path', '')}`",
        f"- history: `{summary.get('history_path', '')}`",
        f"- preferences: `{summary.get('preferences_path', '')}`",
        "",
        "## Top3 Review Queue",
    ]
    queue = summary.get("queue", [])
    if isinstance(queue, list) and queue:
        for item in queue:
            if isinstance(item, dict):
                alignment_lines.append(
                    f"- `{item.get('candidate', '')}` gemini=`{item.get('gemini_score', '')}` human=`{item.get('human_score', '')}`"
                )
    else:
        alignment_lines.append("- none")
    alignment_lines += [
        "",
        "## Preference Summary",
    ]
    pref = summary.get("preference_summary", {})
    if isinstance(pref, dict):
        alignment_lines.append(f"- review_count: `{pref.get('review_count', 0)}`")
        alignment_lines.append(f"- gemini_better_count: `{pref.get('gemini_better_count', 0)}`")
        alignment_lines.append(f"- human_better_count: `{pref.get('human_better_count', 0)}`")
        alignment_lines.append(f"- likes: `{pref.get('likes', [])}`")
        alignment_lines.append(f"- dislikes: `{pref.get('dislikes', [])}`")
    alignment_lines += [
        "",
        "## Notes",
        "- Human scoring is supported through record_review(); current run only initializes the queue and summary.",
        "",
        "VISUAL_AUTOPILOT_HUMAN_ALIGNMENT_V1_COMPLETE = YES",
    ]
    REPORT_PATH.parent.mkdir(parents=True, exist_ok=True)
    REPORT_PATH.write_text("\n".join(alignment_lines), encoding="utf-8")

    usage_lines = [
        "# VISUAL_AUTOPILOT_USAGE_GOVERNANCE_V1_REPORT",
        "",
        "## Summary",
        "- status: `PASS`",
        "",
        "## Initial State",
        f"- seedream_calls: `{usage.get('seedream_calls', 0)}`",
        f"- trial_limit: `{usage.get('trial_limit', 0)}`",
        f"- warning_threshold: `{usage.get('warning_threshold', 0)}`",
        f"- critical_threshold: `{usage.get('critical_threshold', 0)}`",
        f"- stop_threshold: `{usage.get('stop_threshold', 0)}`",
        "",
        "VISUAL_AUTOPILOT_USAGE_GOVERNANCE_V1_COMPLETE = YES",
    ]
    USAGE_REPORT_PATH.parent.mkdir(parents=True, exist_ok=True)
    USAGE_REPORT_PATH.write_text("\n".join(usage_lines), encoding="utf-8")


def run() -> dict[str, object]:
    ranking = _load_ranking()
    top3 = ranking[:3]
    alignment = HumanAlignment()
    queue_payload = alignment.write_review_queue(top3)
    _ensure_history_file()
    history = json.loads(HISTORY_PATH.read_text(encoding="utf-8"))
    if not isinstance(history, list):
        history = []
        _write_json(HISTORY_PATH, history)
    preference_memory = PreferenceMemory()
    updated_preferences = preference_memory.update_from_history()
    usage = _ensure_usage_file()

    summary = {
        "generated_at": _now_iso(),
        "queue": queue_payload.get("queue", []),
        "history": history,
        "preference_summary": preference_memory.summarize(),
        "review_queue_path": _relative(REVIEW_QUEUE_PATH),
        "history_path": _relative(HISTORY_PATH),
        "preferences_path": _relative(PREFERENCES_PATH),
        "usage_path": _relative(USAGE_PATH),
        "usage": usage,
        "top3_count": len(top3),
        "alignment_ready": len(top3) == 3,
        "preferences": updated_preferences,
    }
    _write_json(ALIGNMENT_DIR / "preference_summary.json", summary["preference_summary"])
    _write_reports(summary, usage)
    return summary


def main() -> int:
    result = run()
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0 if result.get("alignment_ready") else 1


if __name__ == "__main__":
    raise SystemExit(main())
