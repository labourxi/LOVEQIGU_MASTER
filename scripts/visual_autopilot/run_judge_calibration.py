from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path

try:
    from .gemini_judge import GeminiJudge
except Exception:  # pragma: no cover
    from gemini_judge import GeminiJudge  # type: ignore


ROOT = Path(__file__).resolve().parents[2]
CANDIDATES_DIR = ROOT / "assets" / "visual-autopilot" / "candidates"
JUDGE_DIR = ROOT / "assets" / "visual-autopilot" / "judge"
REPORT_PATH = ROOT / "docs" / "VISUAL_AUTOPILOT_JUDGE_CALIBRATION_V1_REPORT.md"
RANKING_PATH = JUDGE_DIR / "ranking_calibrated.json"
JUDGE_REPORT_PATH = JUDGE_DIR / "judge_report_calibrated.json"
ORIGINAL_RANKING_PATH = JUDGE_DIR / "ranking.json"

ORIGINAL_PROMPT = (
    "You are an Eastern cultural visual director.\n"
    "Score the image on five dimensions from 0 to 10:\n"
    "1. oriental_score\n"
    "2. ancient_score\n"
    "3. mystery_score\n"
    "4. whitespace_score\n"
    "5. relic_fit_score\n\n"
    "Return only strict JSON with the exact keys:\n"
    "oriental_score, ancient_score, mystery_score, whitespace_score, relic_fit_score, total_score, review_text.\n"
    "No markdown fences. No extra text.\n"
)

CALIBRATED_PROMPT = (
    "You are an Eastern cultural visual director.\n"
    "Calibrate the scoring so that images with different quality levels receive meaningfully different scores.\n"
    "From each dimension, provide a score and a short reason.\n\n"
    "Dimension definitions and scoring anchors:\n"
    "1. 东方感 (Oriental): Chinese classics, epigraphy, constellations, scrolls, whitespace.\n"
    "   - 0-2: no oriental cues\n"
    "   - 3-5: partial oriental cues\n"
    "   - 6-8: clear oriental visual language\n"
    "   - 9-10: fully realized oriental visual authority\n"
    "2. 古朴感 (Ancient):\n"
    "   - 0-2: modern-heavy\n"
    "   - 3-5: average\n"
    "   - 6-8: clear relic feel\n"
    "   - 9-10: museum-grade relic presence\n"
    "3. 神秘感 (Mystery):\n"
    "   - 0-2: none\n"
    "   - 3-5: mild\n"
    "   - 6-8: strong ritual atmosphere\n"
    "   - 9-10: ceremonial intensity\n"
    "4. 留白感 (Whitespace):\n"
    "   - 0-2: crowded\n"
    "   - 3-5: ordinary\n"
    "   - 6-8: good breathing room\n"
    "   - 9-10: high-level whitespace\n"
    "5. 信物契合度 (Relic Fit):\n"
    "   - 0-2: not a relic\n"
    "   - 3-5: partial fit\n"
    "   - 6-8: clearly fits relic system\n"
    "   - 9-10: fully matches LOVEQIGU relic system\n\n"
    "Disallow game UI, cyberpunk, anime, and western fantasy aesthetics.\n"
    "Return only strict JSON with exact keys:\n"
    "oriental_score, oriental_reason, ancient_score, ancient_reason, mystery_score, mystery_reason, whitespace_score, whitespace_reason, relic_fit_score, relic_fit_reason, total_score, review_text.\n"
    "No markdown fences. No extra text.\n"
)


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def _relative(path: str | Path) -> str:
    return str(Path(path).resolve().relative_to(ROOT))


def _write_json(path: Path, payload) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")


def _latest_candidates(limit: int = 5) -> list[Path]:
    if not CANDIDATES_DIR.exists():
        return []
    items = [
        item
        for item in CANDIDATES_DIR.iterdir()
        if item.is_file() and item.suffix.lower() in {".png", ".jpg", ".jpeg", ".webp"}
    ]
    items.sort(key=lambda item: item.stat().st_mtime, reverse=True)
    return items[:limit]


def _load_original_ranking() -> list[dict[str, object]]:
    if not ORIGINAL_RANKING_PATH.exists():
        return []
    try:
        data = json.loads(ORIGINAL_RANKING_PATH.read_text(encoding="utf-8"))
        if isinstance(data, list):
            return [item for item in data if isinstance(item, dict)]
    except Exception:
        return []
    return []


def _render_report(payload: dict[str, object]) -> Path:
    lines = [
        "# VISUAL_AUTOPILOT_JUDGE_CALIBRATION_V1_REPORT",
        "",
        "## Summary",
        f"- status: `{payload.get('status', '')}`",
        f"- judge_source: `{payload.get('judge_source', '')}`",
        f"- candidate_count: `{payload.get('candidate_count', 0)}`",
        f"- winner_changed: `{payload.get('winner_changed', False)}`",
        "",
        "## Original Judge Prompt",
        "```text",
        ORIGINAL_PROMPT.strip(),
        "```",
        "",
        "## Calibrated Judge Prompt",
        "```text",
        CALIBRATED_PROMPT.strip(),
        "```",
        "",
        "## Original Ranking",
    ]
    original_ranking = payload.get("original_ranking", [])
    if isinstance(original_ranking, list) and original_ranking:
        for item in original_ranking:
            lines.append(f"- `{item.get('candidate', '')}` => `{item.get('total_score', 0)}`")
    else:
        lines.append("- none")

    lines += [
        "",
        "## Calibrated Ranking",
    ]
    calibrated_ranking = payload.get("calibrated_ranking", [])
    if isinstance(calibrated_ranking, list) and calibrated_ranking:
        for item in calibrated_ranking:
            lines.append(f"- `{item.get('candidate', '')}` => `{item.get('total_score', 0)}`")
    else:
        lines.append("- none")

    lines += [
        "",
        "## Winner Change",
        f"- original_winner: `{payload.get('original_winner', '')}`",
        f"- calibrated_winner: `{payload.get('calibrated_winner', '')}`",
        "",
        "## Verification",
        f"- rejudged_candidates: `{payload.get('judged_count', 0)}`",
        f"- ranking_calibrated_json: `{payload.get('ranking_path', '')}`",
        f"- judge_report_calibrated_json: `{payload.get('judge_report_path', '')}`",
        "",
        "## Notes",
    ]
    notes = payload.get("notes", [])
    if isinstance(notes, list) and notes:
        for note in notes:
            lines.append(f"- {note}")
    else:
        lines.append("- none")

    REPORT_PATH.parent.mkdir(parents=True, exist_ok=True)
    REPORT_PATH.write_text("\n".join(lines) + "\n", encoding="utf-8")
    return REPORT_PATH


def run(prompt: str, candidate_paths: list[Path] | None = None) -> dict[str, object]:
    judge = GeminiJudge()
    candidates = candidate_paths or _latest_candidates(5)
    judged = []
    for candidate in candidates:
        review = judge.judge_calibrated(candidate, prompt, timeout=30)
        judged.append(
            {
                "candidate": _relative(candidate),
                "judge_source": review.get("judge_source"),
                "key_found": review.get("key_found"),
                "key_source": review.get("key_source"),
                "scores": {
                    "oriental_score": int(review.get("oriental_score", 0)),
                    "ancient_score": int(review.get("ancient_score", 0)),
                    "mystery_score": int(review.get("mystery_score", 0)),
                    "whitespace_score": int(review.get("whitespace_score", 0)),
                    "relic_fit_score": int(review.get("relic_fit_score", 0)),
                    "total_score": int(review.get("total_score", 0)),
                },
                "review_reason": {
                    "oriental_reason": review.get("oriental_reason", ""),
                    "ancient_reason": review.get("ancient_reason", ""),
                    "mystery_reason": review.get("mystery_reason", ""),
                    "whitespace_reason": review.get("whitespace_reason", ""),
                    "relic_fit_reason": review.get("relic_fit_reason", ""),
                },
                "review_text": review.get("review_text", ""),
                "http_status": review.get("http_status"),
                "latency_ms": review.get("latency_ms"),
            }
        )

    ranked = sorted(
        (
            {
                "candidate": item["candidate"],
                "total_score": int(item["scores"]["total_score"]),
            }
            for item in judged
        ),
        key=lambda item: item["total_score"],
        reverse=True,
    )
    original_ranking = _load_original_ranking()
    original_winner = original_ranking[0]["candidate"] if original_ranking else ""
    calibrated_winner = ranked[0]["candidate"] if ranked else ""
    winner_changed = bool(original_winner and calibrated_winner and original_winner != calibrated_winner)

    _write_json(RANKING_PATH, ranked)
    judge_report = {
        "generated_at": _now_iso(),
        "prompt": prompt,
        "judge_source": "GEMINI" if all(item.get("judge_source") == "GEMINI" for item in judged) else "LOCAL_FALLBACK",
        "candidate_count": len(candidates),
        "judged_count": len(judged),
        "candidates": judged,
        "ranking": ranked,
        "original_ranking": original_ranking,
        "winner": judged[0] if judged else None,
    }
    _write_json(JUDGE_REPORT_PATH, judge_report)

    result = {
        "status": "PASS",
        "judge_source": judge_report["judge_source"],
        "candidate_count": len(candidates),
        "judged_count": len(judged),
        "original_ranking": original_ranking,
        "calibrated_ranking": ranked,
        "original_winner": original_winner,
        "calibrated_winner": calibrated_winner,
        "winner_changed": winner_changed,
        "ranking_path": _relative(RANKING_PATH),
        "judge_report_path": _relative(JUDGE_REPORT_PATH),
        "notes": [],
    }
    _render_report(result)
    return result


def main() -> int:
    prompt = (
        "You are an Eastern cultural visual director. "
        "Evaluate the candidate image with calibrated scoring."
    )
    result = run(prompt)
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
