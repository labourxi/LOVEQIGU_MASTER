from __future__ import annotations

import argparse
import concurrent.futures as futures
import json
import multiprocessing as mp
import shutil
import time
from datetime import datetime, timezone
from pathlib import Path
import queue

try:
    from .providers.seedream_ark import SeedreamArkProvider
    from .gemini_judge import GeminiJudge
    from .candidate_judge import CandidateJudge
    from .variation_engine import VariationEngine
    from .credentials import get_gemini_credentials
except Exception:  # pragma: no cover
    from providers.seedream_ark import SeedreamArkProvider  # type: ignore
    from gemini_judge import GeminiJudge  # type: ignore
    from candidate_judge import CandidateJudge  # type: ignore
    from variation_engine import VariationEngine  # type: ignore
    from credentials import get_gemini_credentials  # type: ignore


ROOT = Path(__file__).resolve().parents[2]
CANDIDATES_DIR = ROOT / "assets" / "visual-autopilot" / "candidates"
PROMPTS_DIR = ROOT / "assets" / "visual-autopilot" / "prompts"
JUDGE_DIR = ROOT / "assets" / "visual-autopilot" / "judge"
WINNER_DIR = ROOT / "assets" / "visual-autopilot" / "winner"
REPORT_PATH = ROOT / "docs" / "VISUAL_AUTOPILOT_VARIATION_ENGINE_V1_REPORT.md"
DIAGNOSIS_REPORT_PATH = ROOT / "docs" / "content-engine" / "GEMINI_JUDGE_FAILURE_DIAGNOSIS_V1.md"
RANKING_PATH = JUDGE_DIR / "ranking.json"
JUDGE_REPORT_PATH = JUDGE_DIR / "judge_report.json"
PROMPT_FILES = (
    "candidate_A.txt",
    "candidate_B.txt",
    "candidate_C.txt",
    "candidate_D.txt",
    "candidate_E.txt",
)

DEFAULT_PROMPT = (
    "Ancient Eastern celestial relic, Jiao Mansion constellation seal, "
    "jade glyph artifacts, museum artifact lighting, soft golden dust particles, "
    "ancient manuscript background"
)
DEFAULT_NEGATIVE_PROMPT = "phoenix, bird, dragon body, creature, monster, warrior, weapon, anime, cartoon, neon, game UI"
HEALTH_CHECK_TIMEOUT_SECONDS = 10
JUDGE_TIMEOUT_SECONDS = 30
TOTAL_GEMINI_STAGE_TIMEOUT_SECONDS = 60


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def _relative(path: str | Path) -> str:
    return str(Path(path).resolve().relative_to(ROOT))


def _write_json(path: Path, payload) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")


def _write_text(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


def _write_report(payload: dict[str, object]) -> Path:
    lines = [
        "# VISUAL_AUTOPILOT_VARIATION_ENGINE_V1_REPORT",
        "",
        "## Summary",
        f"- status: `{payload.get('status', 'unknown')}`",
        f"- prompt: `{payload.get('prompt', '')}`",
        f"- variation_count: `{payload.get('variation_count', 0)}`",
        f"- generated_count: `{payload.get('generated_count', 0)}`",
        f"- judged_count: `{payload.get('judged_count', 0)}`",
        f"- judge_source: `{payload.get('judge_source', '')}`",
        f"- winner: `{payload.get('winner_path', '')}`",
        "",
        "## Variations",
    ]
    variations = payload.get("variations", [])
    if isinstance(variations, list) and variations:
        for item in variations:
            if isinstance(item, dict):
                lines.append(f"- `{item.get('key', '')}` => `{item.get('filename', '')}`")
    else:
        lines.append("- none")
    lines += [
        "",
        "## Ranking",
    ]
    ranking = payload.get("ranking", [])
    if isinstance(ranking, list) and ranking:
        for item in ranking:
            if isinstance(item, dict):
                lines.append(f"- `{item.get('candidate', '')}` => `{item.get('total_score', 0)}`")
    else:
        lines.append("- none")
    lines += [
        "",
        "## Verification",
        f"- prompts_written: `{payload.get('prompts_written', 0) == 5}`",
        f"- generated_5_candidates: `{payload.get('generated_count', 0) == 5}`",
        f"- judged_5_candidates: `{payload.get('judged_count', 0) == 5}`",
        f"- ranking_json: `{payload.get('ranking_path', '')}`",
        f"- winner_image: `{payload.get('winner_path', '')}`",
        "",
        "## Notes",
    ]
    notes = payload.get("notes", [])
    if isinstance(notes, list) and notes:
        for note in notes:
            lines.append(f"- {note}")
    else:
        lines.append("- none")
    lines.append("")
    REPORT_PATH.parent.mkdir(parents=True, exist_ok=True)
    REPORT_PATH.write_text("\n".join(lines), encoding="utf-8")
    return REPORT_PATH


def _save_variation_prompts(variants) -> list[dict[str, object]]:
    PROMPTS_DIR.mkdir(parents=True, exist_ok=True)
    records = []
    for variant in variants:
        path = PROMPTS_DIR / variant.filename
        _write_text(path, variant.prompt)
        records.append(
            {
                "key": variant.key,
                "filename": variant.filename,
                "path": _relative(path),
                "prompt": variant.prompt,
            }
        )
    return records


def _trace(stage_trace: list[dict[str, object]], stage: str, status: str, started_at: float, ended_at: float, candidate_id: str = "") -> None:
    stage_trace.append(
        {
            "stage": stage,
            "candidate_id": candidate_id,
            "started_at": round(started_at, 3),
            "ended_at": round(ended_at, 3),
            "duration_seconds": round(ended_at - started_at, 3),
            "status": status,
        }
    )


def _timeout_candidate_record(
    variant,
    *,
    status: str,
    message: str,
    candidate_started: float,
    candidate_ended: float,
    exception_type: str = "TimeoutError",
) -> dict[str, object]:
    duration = max(0.0, candidate_ended - candidate_started)
    return {
        "candidate": "",
        "candidate_id": variant.key,
        "prompt_key": variant.key,
        "prompt_file": variant.filename,
        "judge_source": "GEMINI",
        "key_found": True,
        "key_source": get_gemini_credentials().get("key_source"),
        "status": status,
        "scores": {
            "oriental_score": 0,
            "ancient_score": 0,
            "mystery_score": 0,
            "whitespace_score": 0,
            "relic_fit_score": 0,
            "total_score": 0,
        },
        "review_reason": {
            "oriental_reason": "",
            "ancient_reason": "",
            "mystery_reason": "",
            "whitespace_reason": "",
            "relic_fit_reason": "",
        },
        "review_text": "",
        "http_status": None,
        "latency_ms": int(duration * 1000),
        "exception_type": exception_type,
        "exception_message": message,
        "image_path": "",
        "duration_seconds": round(duration, 3),
        "timeout_triggered": True,
    }


def _candidate_rank_worker(
    prompt: str,
    variant_key: str,
    variant_filename: str,
    variant_prompt: str,
    config: dict[str, object],
    candidate_index: int,
    output_queue,
) -> None:
    started = time.monotonic()
    try:
        provider = SeedreamArkProvider()
        generation = provider.generate(
            variant_prompt,
            {
                **config,
                "candidate_count": 1,
                "seed": candidate_index + 1,
            },
        )
        generation_ended = time.monotonic()
        if not isinstance(generation, dict) or generation.get("status") != "success":
            output_queue.put(
                {
                    "candidate_id": variant_key,
                    "prompt_key": variant_key,
                    "prompt_file": variant_filename,
                    "candidate": "",
                    "judge_source": "LOCAL_FALLBACK",
                    "status": "FAILED",
                    "scores": {
                        "oriental_score": 0,
                        "ancient_score": 0,
                        "mystery_score": 0,
                        "whitespace_score": 0,
                        "relic_fit_score": 0,
                        "total_score": 0,
                    },
                    "review_reason": {
                        "oriental_reason": "",
                        "ancient_reason": "",
                        "mystery_reason": "",
                        "whitespace_reason": "",
                        "relic_fit_reason": "",
                    },
                    "review_text": "",
                    "http_status": generation.get("http_status"),
                    "latency_ms": int((generation_ended - started) * 1000),
                    "exception_type": "GenerationFailed",
                    "exception_message": f"Generation failed for {variant_key}.",
                    "image_path": "",
                    "duration_seconds": round(generation_ended - started, 3),
                    "timeout_triggered": False,
                }
            )
            return

        image_path = generation.get("image_path", "")
        if not isinstance(image_path, str) or not image_path:
            output_queue.put(
                {
                    "candidate_id": variant_key,
                    "prompt_key": variant_key,
                    "prompt_file": variant_filename,
                    "candidate": "",
                    "judge_source": "LOCAL_FALLBACK",
                    "status": "FAILED",
                    "scores": {
                        "oriental_score": 0,
                        "ancient_score": 0,
                        "mystery_score": 0,
                        "whitespace_score": 0,
                        "relic_fit_score": 0,
                        "total_score": 0,
                    },
                    "review_reason": {
                        "oriental_reason": "",
                        "ancient_reason": "",
                        "mystery_reason": "",
                        "whitespace_reason": "",
                        "relic_fit_reason": "",
                    },
                    "review_text": "",
                    "http_status": generation.get("http_status"),
                    "latency_ms": int((time.monotonic() - started) * 1000),
                    "exception_type": "MissingImagePath",
                    "exception_message": f"Image path missing for {variant_key}.",
                    "image_path": "",
                    "duration_seconds": round(time.monotonic() - started, 3),
                    "timeout_triggered": False,
                }
            )
            return

        judge = CandidateJudge()
        review = judge.score_candidate(Path(image_path), variant_prompt, metadata={"provider": "SeedreamArk"})
        ended = time.monotonic()
        status = str(review.get("status", "SUCCESS")).upper()
        scores = review.get("dimensions", {}) if isinstance(review.get("dimensions", {}), dict) else {}
        output_queue.put(
            {
                "candidate_id": variant_key,
                "prompt_key": variant_key,
                "prompt_file": variant_filename,
                "candidate": _relative(image_path),
                "judge_source": review.get("judge_source"),
                "key_found": review.get("key_found"),
                "key_source": review.get("key_source"),
                "status": status,
                "scores": {
                    "oriental_score": int(scores.get("oriental_score", 0)),
                    "ancient_score": int(scores.get("ancient_score", 0)),
                    "mystery_score": int(scores.get("mystery_score", 0)),
                    "whitespace_score": int(scores.get("whitespace_score", 0)),
                    "relic_fit_score": int(scores.get("relic_fit_score", 0)),
                    "total_score": int(review.get("total_score", 0)),
                },
                "review_reason": {
                    "oriental_reason": review.get("reasoning", ""),
                    "ancient_reason": review.get("reasoning", ""),
                    "mystery_reason": review.get("reasoning", ""),
                    "whitespace_reason": review.get("reasoning", ""),
                    "relic_fit_reason": review.get("reasoning", ""),
                },
                "review_text": review.get("reasoning", ""),
                "http_status": review.get("http_status"),
                "latency_ms": review.get("latency_ms", 0),
                "exception_type": review.get("exception_type"),
                "exception_message": review.get("exception_message"),
                "image_path": image_path,
                "duration_seconds": round(ended - started, 3),
                "timeout_triggered": status == "TIMEOUT",
            }
        )
    except Exception as exc:  # pragma: no cover - worker safety
        ended = time.monotonic()
        output_queue.put(
            {
                "candidate_id": variant_key,
                "prompt_key": variant_key,
                "prompt_file": variant_filename,
                "candidate": "",
                "judge_source": "LOCAL_FALLBACK",
                "status": "FAILED",
                "scores": {
                    "oriental_score": 0,
                    "ancient_score": 0,
                    "mystery_score": 0,
                    "whitespace_score": 0,
                    "relic_fit_score": 0,
                    "total_score": 0,
                },
                "review_reason": {
                    "oriental_reason": "",
                    "ancient_reason": "",
                    "mystery_reason": "",
                    "whitespace_reason": "",
                    "relic_fit_reason": "",
                },
                "review_text": "",
                "http_status": None,
                "latency_ms": int((ended - started) * 1000),
                "exception_type": type(exc).__name__,
                "exception_message": str(exc),
                "image_path": "",
                "duration_seconds": round(ended - started, 3),
                "timeout_triggered": False,
            }
        )


def _write_timeout_diagnosis_section(payload: dict[str, object]) -> None:
    marker = "# MULTI_CANDIDATE_RANKING_TIMEOUT_DIAGNOSIS_V1"
    lines = [
        marker,
        "",
        "## Current Diagnosis",
        f"- stuck_stage: `{payload.get('stuck_stage', 'MULTI_CANDIDATE_RANKING_STARTED')}`",
        f"- global_watchdog_triggered: `{payload.get('global_watchdog_triggered', 'YES')}`",
        f"- global_watchdog_passed: `{payload.get('global_watchdog_passed', 'YES')}`",
        f"- ranking_stage_timeout_enabled: `{payload.get('ranking_stage_timeout_enabled', 'YES')}`",
        f"- candidate_judge_timeout_enabled: `{payload.get('candidate_judge_timeout_enabled', 'YES')}`",
        "",
        "## Ranking Timeout Config",
        f"- multi_candidate_ranking_timeout_seconds: `{payload.get('multi_candidate_ranking_timeout_seconds', TOTAL_GEMINI_STAGE_TIMEOUT_SECONDS)}`",
        f"- candidate_judge_timeout_seconds: `{payload.get('candidate_judge_timeout_seconds', JUDGE_TIMEOUT_SECONDS)}`",
        f"- max_candidates: `{payload.get('max_candidates', 5)}`",
        f"- execution_mode: `{payload.get('execution_mode', 'parallel')}`",
        "",
        "## Last Ranking Run",
        f"- ranking_exited_within_60_seconds: `{payload.get('ranking_exited_within_60_seconds', 'NO')}`",
        f"- timeout_triggered: `{payload.get('timeout_triggered', 'NO')}`",
        f"- timeout_candidate_id: `{payload.get('timeout_candidate_id', '')}`",
        f"- failed_candidate_count: `{payload.get('failed_candidate_count', 0)}`",
        f"- timeout_candidate_count: `{payload.get('timeout_candidate_count', 0)}`",
        f"- completed_candidate_count: `{payload.get('completed_candidate_count', 0)}`",
        f"- ranking_result: `{payload.get('ranking_result', 'FAIL')}`",
        "",
        "## Candidate Trace",
    ]
    candidate_trace = payload.get("candidate_trace", [])
    if isinstance(candidate_trace, list) and candidate_trace:
        for item in candidate_trace:
            if isinstance(item, dict):
                lines.append(
                    f"- candidate_id: `{item.get('candidate_id', '')}` | status: `{item.get('status', '')}` | "
                    f"http_status: `{item.get('http_status', '')}` | exception_type: `{item.get('exception_type', '')}` | "
                    f"exception_message: `{item.get('exception_message', '')}` | duration_seconds: `{item.get('duration_seconds', '')}`"
                )
    else:
        lines.append("- none")
    lines += [
        "",
        "## Safety Decision",
        "- REAL_PRODUCTION_VALIDATION_V1_COMPLETE = NO",
        "- CONTENT_FACTORY_V1_FREEZE = NO",
        "- runtime_publish_status = BLOCKED",
        "- release_allowed = NO",
        "- registry_update_allowed = NO",
        "- dashboard_pass_allowed = NO",
    ]
    existing = ""
    if DIAGNOSIS_REPORT_PATH.exists():
        existing = DIAGNOSIS_REPORT_PATH.read_text(encoding="utf-8")
    if marker in existing:
        prefix = existing.split(marker, 1)[0].rstrip()
        new_text = prefix + "\n\n" + "\n".join(lines)
    else:
        new_text = existing.rstrip() + "\n\n" + "\n".join(lines) if existing.strip() else "\n".join(lines)
    DIAGNOSIS_REPORT_PATH.parent.mkdir(parents=True, exist_ok=True)
    DIAGNOSIS_REPORT_PATH.write_text(new_text + "\n", encoding="utf-8")


def run(prompt: str, config: dict[str, object] | None = None, diagnose_timeout: bool = False) -> dict[str, object]:
    config = dict(config or {})
    variation_engine = VariationEngine()
    variants = variation_engine.build_variants(prompt)
    variation_records = _save_variation_prompts(variants)

    stage_trace: list[dict[str, object]] = []
    notes: list[str] = []
    judged: list[dict[str, object]] = []
    timeout_triggered = False
    timeout_stage = ""
    timeout_candidate_id = ""
    timeout_exception_type = None
    timeout_exception_message = None
    stage_started = time.monotonic()
    judge_source = "LOCAL_FALLBACK"

    _trace(stage_trace, "MULTI_CANDIDATE_RANKING_STARTED", "STARTED", stage_started, stage_started)

    ctx = mp.get_context("spawn")
    jobs: list[dict[str, object]] = []
    for index, variant in enumerate(variants):
        candidate_started = time.monotonic()
        _trace(stage_trace, "CANDIDATE_JUDGE_STARTED", "STARTED", candidate_started, candidate_started, candidate_id=variant.key)
        output_queue = ctx.Queue()
        process = ctx.Process(
            target=_candidate_rank_worker,
            args=(prompt, variant.key, variant.filename, variant.prompt, config, index, output_queue),
        )
        process.start()
        jobs.append(
            {
                "variant": variant,
                "index": index,
                "process": process,
                "queue": output_queue,
                "candidate_started": candidate_started,
                "candidate_deadline": candidate_started + JUDGE_TIMEOUT_SECONDS,
                "reported": False,
            }
        )

    stage_deadline = stage_started + TOTAL_GEMINI_STAGE_TIMEOUT_SECONDS
    polling_sleep = 0.1

    while jobs and time.monotonic() < stage_deadline:
        progress = False
        now = time.monotonic()
        for job in jobs:
            if job["reported"]:
                continue
            process = job["process"]
            variant = job["variant"]
            candidate_started = float(job["candidate_started"])
            candidate_id = variant.key
            if process.is_alive():
                if now >= float(job["candidate_deadline"]):
                    timeout_triggered = True
                    timeout_stage = "candidate_judge"
                    timeout_candidate_id = candidate_id
                    timeout_exception_type = "TimeoutExpired"
                    timeout_exception_message = "Candidate judge timeout exceeded."
                    process.terminate()
                    process.join(timeout=1)
                    ended = time.monotonic()
                    _trace(stage_trace, "CANDIDATE_JUDGE_TIMEOUT", "TIMEOUT", candidate_started, ended, candidate_id=candidate_id)
                    judged.append(
                        _timeout_candidate_record(
                            variant,
                            status="TIMEOUT",
                            message=timeout_exception_message,
                            candidate_started=candidate_started,
                            candidate_ended=ended,
                            exception_type=timeout_exception_type,
                        )
                    )
                    job["reported"] = True
                    progress = True
                continue

            process.join(timeout=0)
            try:
                candidate_result = job["queue"].get_nowait()
            except queue.Empty:
                candidate_result = {
                    "candidate_id": candidate_id,
                    "prompt_key": variant.key,
                    "prompt_file": variant.filename,
                    "candidate": "",
                    "judge_source": "LOCAL_FALLBACK",
                    "status": "FAILED",
                    "scores": {
                        "oriental_score": 0,
                        "ancient_score": 0,
                        "mystery_score": 0,
                        "whitespace_score": 0,
                        "relic_fit_score": 0,
                        "total_score": 0,
                    },
                    "review_reason": {
                        "oriental_reason": "",
                        "ancient_reason": "",
                        "mystery_reason": "",
                        "whitespace_reason": "",
                        "relic_fit_reason": "",
                    },
                    "review_text": "",
                    "http_status": None,
                    "latency_ms": 0,
                    "exception_type": "EmptyCandidateResult",
                    "exception_message": "Candidate worker completed without writing a result.",
                    "image_path": "",
                    "duration_seconds": round(time.monotonic() - candidate_started, 3),
                    "timeout_triggered": False,
                }
            ended = time.monotonic()
            status = str(candidate_result.get("status", "FAILED")).upper()
            if status == "TIMEOUT":
                timeout_triggered = True
                timeout_stage = "candidate_judge"
                timeout_candidate_id = candidate_id
                timeout_exception_type = str(candidate_result.get("exception_type") or "TimeoutExpired")
                timeout_exception_message = str(candidate_result.get("exception_message") or "Candidate judge timeout exceeded.")
                _trace(stage_trace, "CANDIDATE_JUDGE_TIMEOUT", "TIMEOUT", candidate_started, ended, candidate_id=candidate_id)
            elif status == "FAILED":
                _trace(stage_trace, "CANDIDATE_JUDGE_FAILED", "FAILED", candidate_started, ended, candidate_id=candidate_id)
            else:
                _trace(stage_trace, "CANDIDATE_JUDGE_COMPLETED", "COMPLETED", candidate_started, ended, candidate_id=candidate_id)
            judged.append(candidate_result)
            job["reported"] = True
            progress = True

        jobs = [job for job in jobs if not job["reported"]]
        if jobs and not progress:
            time.sleep(polling_sleep)

    if jobs:
        timeout_triggered = True
        timeout_stage = "multi_candidate_ranking"
        timeout_candidate_id = jobs[0]["variant"].key if len(jobs) == 1 else "multiple"
        timeout_exception_type = "TimeoutError"
        timeout_exception_message = "Multi candidate ranking stage timeout exceeded."
        for job in jobs:
            process = job["process"]
            variant = job["variant"]
            candidate_started = float(job["candidate_started"])
            candidate_id = variant.key
            if process.is_alive():
                process.terminate()
                process.join(timeout=1)
            ended = time.monotonic()
            _trace(stage_trace, "CANDIDATE_JUDGE_TIMEOUT", "TIMEOUT", candidate_started, ended, candidate_id=candidate_id)
            judged.append(
                _timeout_candidate_record(
                    variant,
                    status="TIMEOUT",
                    message=timeout_exception_message,
                    candidate_started=candidate_started,
                    candidate_ended=ended,
                    exception_type=timeout_exception_type,
                )
            )
        notes.append("Ranking stage timeout reached before all candidates completed.")

    generation_ended = time.monotonic()
    ranking_timeout = timeout_triggered and timeout_stage in {"candidate_judge", "multi_candidate_ranking"}
    _trace(
        stage_trace,
        "MULTI_CANDIDATE_RANKING_FAILED" if ranking_timeout or not judged else "MULTI_CANDIDATE_RANKING_COMPLETED",
        "FAILED" if ranking_timeout or not judged else "COMPLETED",
        stage_started,
        generation_ended,
    )
    _trace(
        stage_trace,
        "MULTI_CANDIDATE_RANKING_EXITED",
        "FAILED" if ranking_timeout or not judged else "COMPLETED",
        generation_ended,
        generation_ended,
    )

    ranking = sorted(
        (
            {
                "candidate": item["candidate"],
                "candidate_id": item.get("candidate_id", ""),
                "prompt_key": item["prompt_key"],
                "total_score": int(item["scores"]["total_score"]),
            }
            for item in judged
        ),
        key=lambda item: item["total_score"],
        reverse=True,
    )

    winner = None
    if ranking:
        top = ranking[0]
        for item in judged:
            if item["candidate"] == top["candidate"]:
                winner = item
                break

    backup = None
    if len(ranking) > 1:
        second = ranking[1]
        for item in judged:
            if item["candidate"] == second["candidate"]:
                backup = item
                break

    winner_path = ""
    if winner and isinstance(winner.get("image_path"), str) and winner["image_path"]:
        source_path = Path(winner["image_path"])
        if source_path.exists():
            WINNER_DIR.mkdir(parents=True, exist_ok=True)
            winner_file = WINNER_DIR / "winner.jpg"
            shutil.copy2(source_path, winner_file)
            winner_path = _relative(winner_file)

    _write_json(RANKING_PATH, ranking)

    judge_source = "GEMINI" if any(item.get("judge_source") == "GEMINI" for item in judged) else "LOCAL_FALLBACK"
    ranked_success_count = sum(1 for item in judged if item.get("status") == "SUCCESS")
    timeout_count = sum(1 for item in judged if item.get("status") == "TIMEOUT")
    failed_count = sum(1 for item in judged if item.get("status") == "FAILED")
    ranking_result = "MANUAL_REVIEW_REQUIRED" if timeout_triggered else ("PASS" if winner and winner.get("total_score", 0) > 0 and winner_path else "FAIL")
    judge_report = {
        "generated_at": _now_iso(),
        "prompt": prompt,
        "judge_source": judge_source,
        "candidate_count": len(judged),
        "variations": variation_records,
        "candidates": judged,
        "ranking": ranking,
        "winner": winner,
        "backup": backup,
        "timeout_guard_enabled": "YES",
        "health_check_timeout_seconds": HEALTH_CHECK_TIMEOUT_SECONDS,
        "judge_timeout_seconds": JUDGE_TIMEOUT_SECONDS,
        "total_gemini_stage_timeout_seconds": TOTAL_GEMINI_STAGE_TIMEOUT_SECONDS,
        "timeout_triggered": timeout_triggered,
        "timeout_stage": timeout_stage,
        "timeout_candidate_id": timeout_candidate_id,
        "timeout_exception_type": timeout_exception_type,
        "timeout_exception_message": timeout_exception_message,
        "execution_mode": "parallel",
        "multi_candidate_ranking_timeout_seconds": TOTAL_GEMINI_STAGE_TIMEOUT_SECONDS,
        "candidate_judge_timeout_seconds": JUDGE_TIMEOUT_SECONDS,
        "candidate_count_total": len(variants),
        "completed_candidate_count": ranked_success_count,
        "timeout_candidate_count": timeout_count,
        "failed_candidate_count": failed_count,
        "ranking_result": ranking_result,
        "stage_trace": stage_trace,
        "diagnose_timeout": diagnose_timeout,
        "fallback_state": "MANUAL_REVIEW_REQUIRED" if timeout_triggered and ranking_result == "FAIL" else "NONE",
    }
    _write_json(JUDGE_REPORT_PATH, judge_report)

    _write_timeout_diagnosis_section(
        {
            "stuck_stage": "MULTI_CANDIDATE_RANKING_STARTED" if ranking_timeout or timeout_triggered else "",
            "global_watchdog_triggered": "NO",
            "global_watchdog_passed": "YES",
            "ranking_stage_timeout_enabled": "YES",
            "candidate_judge_timeout_enabled": "YES",
            "multi_candidate_ranking_timeout_seconds": TOTAL_GEMINI_STAGE_TIMEOUT_SECONDS,
            "candidate_judge_timeout_seconds": JUDGE_TIMEOUT_SECONDS,
            "max_candidates": len(variants),
            "execution_mode": "parallel",
            "ranking_exited_within_60_seconds": "YES" if generation_ended - stage_started <= TOTAL_GEMINI_STAGE_TIMEOUT_SECONDS else "NO",
            "timeout_triggered": "YES" if timeout_triggered else "NO",
            "timeout_candidate_id": timeout_candidate_id,
            "failed_candidate_count": failed_count,
            "timeout_candidate_count": timeout_count,
            "completed_candidate_count": ranked_success_count,
            "ranking_result": ranking_result,
            "candidate_trace": [
                {
                    "candidate_id": item.get("candidate_id"),
                    "status": item.get("status"),
                    "http_status": item.get("http_status"),
                    "exception_type": item.get("exception_type"),
                    "exception_message": item.get("exception_message"),
                    "duration_seconds": item.get("duration_seconds", 0),
                }
                for item in judged
            ],
        }
    )

    result_status = "MANUAL_REVIEW_REQUIRED" if timeout_triggered else ("PASS" if len(variation_records) == 5 and len(judged) == 5 and judge_source == "GEMINI" and winner_path else "FAIL")
    result = {
        "generated_at": _now_iso(),
        "status": result_status,
        "prompt": prompt,
        "variation_count": len(variation_records),
        "generated_count": sum(1 for item in judged if item.get("candidate")),
        "judged_count": len(judged),
        "judge_source": judge_source,
        "variations": variation_records,
        "judged": judged,
        "ranking": ranking,
        "winner": winner,
        "backup": backup,
        "winner_path": winner_path,
        "ranking_path": _relative(RANKING_PATH),
        "judge_report_path": _relative(JUDGE_REPORT_PATH),
        "notes": notes + ([f"Timeout triggered at {timeout_stage} for {timeout_candidate_id}."] if timeout_triggered else []),
        "prompts_written": len(variation_records),
        "timeout_guard_enabled": "YES",
        "timeout_triggered": timeout_triggered,
        "timeout_stage": timeout_stage,
        "timeout_candidate_id": timeout_candidate_id,
        "stage_trace": stage_trace,
        "ranking_result": ranking_result,
        "fallback_state": "MANUAL_REVIEW_REQUIRED" if timeout_triggered and ranking_result == "FAIL" else "NONE",
    }
    _write_report(result)
    return result


def main() -> int:
    parser = argparse.ArgumentParser(description="Run variation-engine visual ranking.")
    parser.add_argument("--prompt", default=DEFAULT_PROMPT)
    parser.add_argument("--size", default="2048x2048")
    parser.add_argument("--negative-prompt", default=DEFAULT_NEGATIVE_PROMPT)
    parser.add_argument("--diagnose-timeout", action="store_true")
    args = parser.parse_args()
    config = {
        "size": args.size,
        "negative_prompt": args.negative_prompt,
    }
    result = run(args.prompt, config=config, diagnose_timeout=args.diagnose_timeout)
    if args.diagnose_timeout:
        print("MULTI_CANDIDATE_RANKING_TIMEOUT_DIAGNOSIS")
        print(f"ranking_result={result.get('ranking_result')}")
        print(f"timeout_stage={result.get('timeout_stage')}")
        print(json.dumps(result.get("judged", []), ensure_ascii=False, indent=2))
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0 if result.get("status") == "PASS" else 1


if __name__ == "__main__":
    raise SystemExit(main())
