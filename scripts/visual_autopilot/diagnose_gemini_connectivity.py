from __future__ import annotations

import json
import os
import multiprocessing as mp
import queue
import time
from datetime import datetime, timezone
from pathlib import Path
import sys
from typing import Any

try:
    from .credentials import bootstrap_environment, get_gemini_credentials
    from .gemini_judge import GeminiJudge
except Exception:  # pragma: no cover
    CURRENT_DIR = Path(__file__).resolve().parent
    if str(CURRENT_DIR) not in sys.path:
        sys.path.insert(0, str(CURRENT_DIR))
    from credentials import bootstrap_environment, get_gemini_credentials  # type: ignore
    from gemini_judge import GeminiJudge  # type: ignore


ROOT = Path(__file__).resolve().parents[2]
REPORT_PATH = ROOT / "docs" / "content-engine" / "GEMINI_CONNECTIVITY_DIAGNOSIS_V1.md"
ENV_CANDIDATES = (
    "GEMINI_API_KEY",
    "GOOGLE_API_KEY",
    "GOOGLE_GENAI_API_KEY",
    "GOOGLE_GEMINI_API_KEY",
)
HEALTH_CHECK_TIMEOUT_SECONDS = 10
JUDGE_REQUEST_TIMEOUT_SECONDS = 30
SCRIPT_TIMEOUT_SECONDS = 45
MINIMAL_HEALTH_PROMPT = "health check"
MINIMAL_JUDGE_PROMPT = "OK"


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def _mask_api_key(value: str | None) -> str:
    if not value:
        return "MISSING"
    text = value.strip()
    if len(text) <= 8:
        return "*" * len(text)
    return f"{text[:4]}...{text[-4:]}"


def _write_text(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


def _summarize_response(body: object) -> dict[str, object]:
    if not isinstance(body, dict):
        return {"type": type(body).__name__, "summary": str(body)[:500]}
    summary: dict[str, object] = {"keys": sorted(list(body.keys()))}
    candidates = body.get("candidates", [])
    if isinstance(candidates, list):
        summary["candidate_count"] = len(candidates)
        if candidates and isinstance(candidates[0], dict):
            first = candidates[0]
            content = first.get("content", {})
            if isinstance(content, dict):
                parts = content.get("parts", [])
                if isinstance(parts, list):
                    summary["first_candidate_part_count"] = len(parts)
    return summary


def _detect_key_sources() -> list[dict[str, str]]:
    detected = []
    for env_name in ENV_CANDIDATES:
        value = os.environ.get(env_name)
        if value and value.strip():
            detected.append(
                {
                    "env_var_name": env_name,
                    "key_masked_preview": _mask_api_key(value),
                }
            )
    return detected


def _classify_root_cause(
    *,
    key_detected: bool,
    current_loader_detected: bool,
    health_result: dict[str, Any],
    judge_result: dict[str, Any],
) -> tuple[list[str], list[str]]:
    root_causes: list[str] = []
    recommendations: list[str] = []

    if not key_detected:
        root_causes.append("API_KEY_MISSING")
        recommendations.append("fix_api_key")
        recommendations.append("fix_env_var_name")
        return root_causes, recommendations

    if not current_loader_detected:
        root_causes.append("API_KEY_MISSING")
        recommendations.append("fix_env_var_name")

    health_http = health_result.get("http_status")
    judge_http = judge_result.get("http_status")
    health_exc = str(health_result.get("exception_type") or "")
    judge_exc = str(judge_result.get("exception_type") or "")
    judge_error = str(judge_result.get("response_error_message") or judge_result.get("exception_message") or "")
    health_error = str(health_result.get("response_error_message") or health_result.get("exception_message") or "")

    combined_error = " ".join([health_error, judge_error, health_exc, judge_exc]).lower()

    if health_http == 404 or "not found" in combined_error:
        root_causes.append("MODEL_NOT_FOUND")
        recommendations.append("fix_model_name")
    if health_http in {None, 408, 429} or "timeout" in combined_error or "timed out" in combined_error:
        root_causes.append("NETWORK_TIMEOUT")
        recommendations.append("retry_after_network_available")
    if "connection" in combined_error or "refused" in combined_error or "unreachable" in combined_error:
        root_causes.append("ENDPOINT_UNREACHABLE")
        recommendations.append("fix_endpoint")
    if health_http in {400, 401, 403} or judge_http in {400, 401, 403}:
        if "invalid credential" in combined_error or "unauthorized" in combined_error or "forbidden" in combined_error:
            root_causes.append("API_KEY_INVALID")
            recommendations.append("fix_api_key")
    if health_http == 200 and judge_http == 200:
        return root_causes or ["UNKNOWN"], recommendations or ["switch_to_manual_review_fallback"]
    if judge_http == 200 and "parse" in combined_error:
        root_causes.append("RESPONSE_PARSE_FAILED")
        recommendations.append("fix_request_format")
    if not root_causes:
        root_causes.append("UNKNOWN")
        recommendations.append("switch_to_manual_review_fallback")

    dedup_causes: list[str] = []
    for item in root_causes:
        if item not in dedup_causes:
            dedup_causes.append(item)
    dedup_recs: list[str] = []
    for item in recommendations:
        if item not in dedup_recs:
            dedup_recs.append(item)
    return dedup_causes, dedup_recs


def _render_report(payload: dict[str, Any]) -> str:
    lines = [
        "# GEMINI_CONNECTIVITY_DIAGNOSIS_V1",
        "",
        "## Current Context",
        "- REAL_PRODUCTION_GLOBAL_WATCHDOG_V1 = PASS",
        "- MULTI_CANDIDATE_RANKING_TIMEOUT_DIAGNOSIS_V1 = PASS",
        "- REAL_PRODUCTION_VALIDATION_V1_COMPLETE = NO",
        "- CONTENT_FACTORY_V1_FREEZE = NO",
        "- runtime_publish_status = BLOCKED",
        "",
        "## API Key Detection",
        f"- key_detected: `{payload.get('key_detected', 'NO')}`",
        f"- env_var_name: `{payload.get('env_var_name', 'missing')}`",
        f"- key_masked_preview: `{payload.get('key_masked_preview', 'MISSING')}`",
        f"- missing_key_reason: `{payload.get('missing_key_reason', '')}`",
        "",
        "## Model Configuration",
        f"- model: `{payload.get('model', '')}`",
        f"- endpoint: `{payload.get('endpoint', '')}`",
        f"- sdk_or_http_client: `{payload.get('sdk_or_http_client', 'urllib.request')}`",
        f"- request_timeout_enabled: `{payload.get('request_timeout_enabled', 'YES')}`",
        "",
        "## Health Check",
        f"- health_check_started: `{payload.get('health_check_started', '')}`",
        f"- health_check_timeout_seconds: `{payload.get('health_check_timeout_seconds', HEALTH_CHECK_TIMEOUT_SECONDS)}`",
        f"- health_check_http_status: `{payload.get('health_check_http_status', 'null')}`",
        f"- health_check_result: `{payload.get('health_check_result', 'FAIL')}`",
        f"- health_check_exception_type: `{payload.get('health_check_exception_type', 'None')}`",
        f"- health_check_exception_message: `{payload.get('health_check_exception_message', 'None')}`",
        f"- health_check_elapsed_seconds: `{payload.get('health_check_elapsed_seconds', '')}`",
        "",
        "## Minimal Judge Request",
        f"- judge_request_started: `{payload.get('judge_request_started', '')}`",
        f"- judge_timeout_seconds: `{payload.get('judge_timeout_seconds', JUDGE_REQUEST_TIMEOUT_SECONDS)}`",
        f"- judge_http_status: `{payload.get('judge_http_status', 'null')}`",
        f"- judge_result: `{payload.get('judge_result', 'FAIL')}`",
        f"- judge_response_summary: `{json.dumps(payload.get('judge_response_summary', {}), ensure_ascii=False)}`",
        f"- judge_exception_type: `{payload.get('judge_exception_type', 'None')}`",
        f"- judge_exception_message: `{payload.get('judge_exception_message', 'None')}`",
        f"- judge_elapsed_seconds: `{payload.get('judge_elapsed_seconds', '')}`",
        "",
        "## Root Cause Classification",
    ]
    root_causes = payload.get("root_cause_classification", [])
    if isinstance(root_causes, list) and root_causes:
        for item in root_causes:
            lines.append(f"- {item}")
    else:
        lines.append("- UNKNOWN")
    lines += [
        "",
        "## Recommendation",
    ]
    recommendations = payload.get("recommendations", [])
    if isinstance(recommendations, list) and recommendations:
        for item in recommendations:
            lines.append(f"- {item}")
    else:
        lines.append("- switch_to_manual_review_fallback")
    lines += [
        "",
        "## Safety Decision",
        "- release_allowed = NO",
        "- registry_update_allowed = NO",
        "- dashboard_pass_allowed = NO",
        "- validation_complete_allowed = NO",
    ]
    return "\n".join(lines) + "\n"


def _request_worker(api_key: str, payload: dict[str, object], timeout_seconds: int, output_queue) -> None:
    try:
        judge = GeminiJudge()
        result = judge._request(api_key, payload, timeout=timeout_seconds)  # noqa: SLF001
        output_queue.put({"ok": True, "result": result})
    except Exception as exc:  # pragma: no cover - worker safety
        output_queue.put(
            {
                "ok": False,
                "result": {
                    "ok": False,
                    "status_code": None,
                    "latency_ms": 0,
                    "raw_body": "",
                    "body": None,
                    "error": str(exc),
                    "exception_type": type(exc).__name__,
                    "exception_message": str(exc),
                },
            }
        )


def _run_request(api_key: str, timeout_seconds: int, prompt: str) -> dict[str, Any]:
    payload = {
        "contents": [
            {
                "role": "user",
                "parts": [{"text": prompt}],
            }
        ],
        "generationConfig": {
            "temperature": 0.0,
            "maxOutputTokens": 8,
        },
    }
    ctx = mp.get_context("spawn")
    output_queue = ctx.Queue()
    process = ctx.Process(target=_request_worker, args=(api_key, payload, timeout_seconds, output_queue))
    started = time.monotonic()
    process.start()
    process.join(timeout_seconds)
    if process.is_alive():
        process.terminate()
        process.join(timeout=1)
        ended = time.monotonic()
        return {
            "started_at": _now_iso(),
            "http_status": None,
            "result": "FAIL",
            "response_error_message": "timeout",
            "exception_type": "TimeoutExpired",
            "exception_message": f"Gemini request timed out after {timeout_seconds} seconds.",
            "elapsed_seconds": round(ended - started, 3),
            "response_summary": {},
            "raw_result": {
                "ok": False,
                "status_code": None,
                "latency_ms": int((ended - started) * 1000),
                "raw_body": "",
                "body": None,
                "error": "timeout",
                "exception_type": "TimeoutExpired",
                "exception_message": f"Gemini request timed out after {timeout_seconds} seconds.",
            },
        }
    try:
        worker_result = output_queue.get_nowait()
    except queue.Empty:
        worker_result = {
            "ok": False,
            "result": {
                "ok": False,
                "status_code": None,
                "latency_ms": int((time.monotonic() - started) * 1000),
                "raw_body": "",
                "body": None,
                "error": "empty worker response",
                "exception_type": "EmptyResult",
                "exception_message": "Gemini request worker produced no result.",
            },
        }
    result = worker_result.get("result", {})
    ended = time.monotonic()
    body_summary = _summarize_response(result.get("body"))
    return {
        "started_at": _now_iso(),
        "http_status": result.get("status_code"),
        "result": "PASS" if result.get("ok") else "FAIL",
        "response_error_message": result.get("raw_body") or result.get("error") or "",
        "exception_type": result.get("exception_type"),
        "exception_message": result.get("exception_message"),
        "elapsed_seconds": round(ended - started, 3),
        "response_summary": body_summary,
        "raw_result": result,
    }


def run() -> dict[str, Any]:
    started_at = time.monotonic()
    bootstrap_environment(force=True)

    current_loader = get_gemini_credentials()
    detected_keys = _detect_key_sources()
    current_loader_env = str(current_loader.get("key_source") or "missing")
    current_loader_detected = bool(current_loader.get("gemini_key_found"))

    chosen_env_name = None
    chosen_key = None
    chosen_preview = "MISSING"
    for candidate in detected_keys:
        env_name = candidate["env_var_name"]
        value = os.environ.get(env_name)
        if value and value.strip():
            chosen_env_name = env_name
            chosen_key = value.strip()
            chosen_preview = candidate["key_masked_preview"]
            break

    missing_key_reason = ""
    if not chosen_key:
        missing_key_reason = "No supported Gemini API key found in GEMINI_API_KEY, GOOGLE_API_KEY, GOOGLE_GENAI_API_KEY, or GOOGLE_GEMINI_API_KEY."
    elif not current_loader_detected:
        missing_key_reason = (
            "Key found outside the current loader's supported env var set; "
            f"current_loader_key_source={current_loader_env}."
        )
    else:
        missing_key_reason = "Gemini key detected."

    judge = GeminiJudge()
    model = getattr(judge, "HEALTH_MODEL", "gemini-2.5-flash")
    endpoint = getattr(judge, "endpoint", "")

    health_result: dict[str, Any] = {
        "started_at": _now_iso(),
        "http_status": None,
        "result": "FAIL",
        "response_error_message": "",
        "exception_type": None,
        "exception_message": None,
        "elapsed_seconds": 0.0,
        "response_summary": {},
        "raw_result": {},
    }
    judge_result: dict[str, Any] = {
        "started_at": _now_iso(),
        "http_status": None,
        "result": "FAIL",
        "response_error_message": "",
        "exception_type": None,
        "exception_message": None,
        "elapsed_seconds": 0.0,
        "response_summary": {},
        "raw_result": {},
    }

    if chosen_key:
        health_result = _run_request(chosen_key, HEALTH_CHECK_TIMEOUT_SECONDS, MINIMAL_HEALTH_PROMPT)
        judge_result = _run_request(chosen_key, JUDGE_REQUEST_TIMEOUT_SECONDS, MINIMAL_JUDGE_PROMPT)
    else:
        now = time.monotonic()
        health_result["elapsed_seconds"] = round(time.monotonic() - now, 3)
        judge_result["elapsed_seconds"] = round(time.monotonic() - now, 3)

    root_causes, recommendations = _classify_root_cause(
        key_detected=bool(chosen_key),
        current_loader_detected=current_loader_detected,
        health_result=health_result,
        judge_result=judge_result,
    )

    total_elapsed = round(time.monotonic() - started_at, 3)
    payload = {
        "generated_at": _now_iso(),
        "key_detected": "YES" if chosen_key else "NO",
        "env_var_name": chosen_env_name or "missing",
        "key_masked_preview": chosen_preview,
        "missing_key_reason": missing_key_reason,
        "model": model,
        "endpoint": endpoint,
        "sdk_or_http_client": "urllib.request",
        "request_timeout_enabled": "YES",
        "health_check_started": health_result.get("started_at", ""),
        "health_check_timeout_seconds": HEALTH_CHECK_TIMEOUT_SECONDS,
        "health_check_http_status": health_result.get("http_status"),
        "health_check_result": health_result.get("result"),
        "health_check_exception_type": health_result.get("exception_type"),
        "health_check_exception_message": health_result.get("exception_message"),
        "health_check_elapsed_seconds": health_result.get("elapsed_seconds"),
        "judge_request_started": judge_result.get("started_at", ""),
        "judge_timeout_seconds": JUDGE_REQUEST_TIMEOUT_SECONDS,
        "judge_http_status": judge_result.get("http_status"),
        "judge_result": judge_result.get("result"),
        "judge_response_summary": judge_result.get("response_summary", {}),
        "judge_exception_type": judge_result.get("exception_type"),
        "judge_exception_message": judge_result.get("exception_message"),
        "judge_elapsed_seconds": judge_result.get("elapsed_seconds"),
        "root_cause_classification": root_causes,
        "recommendations": recommendations,
        "total_elapsed_seconds": total_elapsed,
        "current_loader_env_var_name": current_loader_env,
        "current_loader_detected": current_loader_detected,
        "current_loader_api_key_preview": _mask_api_key(str(current_loader.get("api_key"))) if current_loader.get("api_key") else "MISSING",
        "all_detected_env_vars": [item["env_var_name"] for item in detected_keys],
    }
    _write_text(REPORT_PATH, _render_report(payload))
    payload["report_path"] = str(REPORT_PATH.relative_to(ROOT))
    return payload


def main() -> int:
    result = run()
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0 if result.get("health_check_result") == "PASS" and result.get("judge_result") == "PASS" else 1


if __name__ == "__main__":
    raise SystemExit(main())
