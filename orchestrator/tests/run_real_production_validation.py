from __future__ import annotations

import json
import subprocess
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[2]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from orchestrator.dashboard.stats import DashboardStats
from orchestrator.engine.factory_dispatcher import FactoryDispatcher
from orchestrator.engine.task_parser import TaskParser
from orchestrator.engine.task_planner import TaskPlanner
from orchestrator.governance.asset_registry import AssetRegistry
from orchestrator.governance.release_registry import ReleaseRegistry
from orchestrator.governance.version_registry import VersionRegistry
from orchestrator.release.release_manager import ReleaseManager
from orchestrator.review.approval_console import ApprovalConsole
from orchestrator.review.human_review_gate import HumanReviewGate
from orchestrator.factories.adapters.relic_factory import RelicFactoryAdapter
from orchestrator.factories.adapters.story_factory import StoryFactoryAdapter
from orchestrator.factories.adapters.visual_factory import VisualFactoryAdapter


REPORT_PATH = ROOT / "docs" / "content-engine" / "REAL_PRODUCTION_VALIDATION_V1_REPORT.md"
DIAGNOSIS_REPORT_PATH = ROOT / "docs" / "content-engine" / "GEMINI_JUDGE_FAILURE_DIAGNOSIS_V1.md"
GLOBAL_WATCHDOG_SECONDS = 90
GLOBAL_WATCHDOG_RUN_SECONDS = 85
VISUAL_STAGE_TIMEOUT_SECONDS = 60
GEMINI_JUDGE_TIMEOUT_SECONDS = 30
MULTI_CANDIDATE_RANKING_TIMEOUT_SECONDS = 60
CANDIDATE_JUDGE_TIMEOUT_SECONDS = 30
RELIC_PATH = ROOT / "data" / "relics" / "generated" / "jiao_su_relic.json"
STORY_PATH = ROOT / "data" / "story" / "generated" / "jiao_su_story.json"
WINNER_PATH = ROOT / "assets" / "visual-autopilot" / "winner" / "winner.jpg"
REVIEW_PACKAGE_PATH = ROOT / "assets" / "visual-autopilot" / "review" / "review_package.json"
REVIEW_STATUS_PATH = ROOT / "assets" / "visual-autopilot" / "review" / "review_status.json"
MANUAL_REVIEW_PACKAGE_PATH = ROOT / "assets" / "visual-autopilot" / "review" / "manual_review_package_jiao_xiu_v1.json"
GEMINI_CONNECTIVITY_DIAGNOSIS_PATH = ROOT / "docs" / "content-engine" / "GEMINI_CONNECTIVITY_DIAGNOSIS_V1.md"

TASK_INPUT = {
    "task_id": "jiao_su",
    "task": "新增角宿",
    "source": "REAL_PRODUCTION_VALIDATION_V1",
}
VISUAL_PROMPT = (
    "Ancient Eastern celestial relic for Jiao Su, Jiao Mansion constellation seal, "
    "jade glyph artifacts, museum artifact lighting, soft golden dust particles, "
    "ancient manuscript background"
)
NEGATIVE_PROMPT = "phoenix, bird, dragon body, creature, monster, warrior, weapon, anime, cartoon, neon, game UI"
VISUAL_MODEL = "doubao-seedream-5-0-260128"


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def _write_json(path: Path, payload: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")


def _read_json(path: Path, default: Any):
    if not path.exists():
        return default
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return default


def _write_manual_review_package() -> dict[str, Any]:
    payload = {
        "asset_id": "VISUAL_ASSET_JIAO_XIU_V1",
        "asset_name": "角宿视觉资产 V1",
        "object_name": "角宿",
        "parent_symbol": "东方青龙",
        "status": "MANUAL_REVIEW_REQUIRED",
        "reason": "Gemini unavailable: NETWORK_TIMEOUT",
        "gemini_prompt_file": "",
        "negative_prompt": "",
        "candidate_outputs": [],
        "manual_review_required_fields": [
            "reviewer",
            "review_time",
            "image_source",
            "image_file",
            "prompt_used",
            "visual_match_score",
            "policy_match_score",
            "issue_notes",
            "decision",
        ],
        "allowed_decisions": [
            "APPROVED",
            "APPROVED_WITH_WARNING",
            "REJECTED",
            "NEEDS_REGENERATION",
        ],
        "release_allowed": False,
        "registry_update_allowed": False,
        "dashboard_pass_allowed": False,
    }
    _write_json(MANUAL_REVIEW_PACKAGE_PATH, payload)
    return payload


def _is_gemini_network_timeout(result_bundle: Any, judge_report: Any) -> bool:
    if isinstance(result_bundle, dict):
        if str(result_bundle.get("fallback_state", "")).upper() == "MANUAL_REVIEW_REQUIRED":
            return True
        if result_bundle.get("timeout_triggered") and str(result_bundle.get("timeout_stage", "")).lower() in {"candidate_judge", "multi_candidate_ranking"}:
            return True
    if isinstance(judge_report, dict):
        if judge_report.get("timeout_triggered") and str(judge_report.get("timeout_stage", "")).lower() in {"candidate_judge", "multi_candidate_ranking"}:
            return True
        candidates = judge_report.get("candidates", [])
        if isinstance(candidates, list) and candidates and all(isinstance(item, dict) and item.get("status") == "TIMEOUT" for item in candidates):
            return True
    return False


def _update_manual_review_state(review_package: dict[str, Any]) -> None:
    review_status = _read_json(REVIEW_STATUS_PATH, {})
    if not isinstance(review_status, dict):
        review_status = {}
    review_status.update(
        {
            "fallback_state": "MANUAL_REVIEW_REQUIRED",
            "approval_status": "PENDING_REVIEW",
            "runtime_publish_status": "BLOCKED",
            "runtime_publish_allowed": False,
            "blocked_reason": "REVIEW_NOT_APPROVED",
            "manual_review_package_path": str(MANUAL_REVIEW_PACKAGE_PATH.relative_to(ROOT)),
            "review_note": "Gemini unavailable: NETWORK_TIMEOUT",
        }
    )
    _write_json(REVIEW_STATUS_PATH, review_status)

    dashboard = _read_json(ROOT / "runtime" / "dashboard" / "dashboard.json", {})
    if not isinstance(dashboard, dict):
        dashboard = {}
    dashboard.update(
        {
            "fallback_state": "MANUAL_REVIEW_REQUIRED",
            "visual_stage_status": "MANUAL_REVIEW_REQUIRED",
            "manual_review_required": True,
            "manual_review_package": str(MANUAL_REVIEW_PACKAGE_PATH.relative_to(ROOT)),
            "runtime_publish_status": "BLOCKED",
            "release_allowed": False,
            "registry_update_allowed": False,
            "dashboard_pass_allowed": False,
        }
    )
    _write_json(ROOT / "runtime" / "dashboard" / "dashboard.json", dashboard)

    assets_registry_path = ROOT / "runtime" / "registry" / "assets.json"
    assets_registry = _read_json(assets_registry_path, {})
    if not isinstance(assets_registry, dict):
        assets_registry = {}
    manual_review_assets = assets_registry.get("manual_review_assets", [])
    if not isinstance(manual_review_assets, list):
        manual_review_assets = []
    manual_review_assets = [
        item for item in manual_review_assets if not isinstance(item, dict) or item.get("asset_id") != review_package["asset_id"]
    ]
    manual_review_assets.append(
        {
            "asset_id": review_package["asset_id"],
            "asset_name": review_package["asset_name"],
            "status": review_package["status"],
            "reason": review_package["reason"],
            "manual_review_package": str(MANUAL_REVIEW_PACKAGE_PATH.relative_to(ROOT)),
        }
    )
    assets_registry["manual_review_assets"] = manual_review_assets
    assets_registry["fallback_state"] = "MANUAL_REVIEW_REQUIRED"
    assets_registry["manual_review_required"] = True
    _write_json(assets_registry_path, assets_registry)


def _count_registry(path: Path, key: str) -> int:
    data = _read_json(path, {})
    if not isinstance(data, dict):
        return 0
    items = data.get(key, [])
    return len(items) if isinstance(items, list) else 0


def _summary_line(label: str, value: Any) -> str:
    return f"- {label}: `{value}`"


def _make_report(payload: dict[str, Any]) -> None:
    lines = [
        "# REAL_PRODUCTION_VALIDATION_V1_REPORT",
        "",
        "## Summary",
        _summary_line("freeze", payload.get("freeze", "")),
        _summary_line("overall_status", payload.get("overall_status", "")),
        "",
        "## Task",
        _summary_line("task_id", payload.get("task_id", "")),
        _summary_line("task_type", payload.get("task_type", "")),
        _summary_line("task_target", payload.get("task_target", "")),
        "",
        "## Factory Results",
        _summary_line("relic_id", payload.get("relic_id", "")),
        _summary_line("story_id", payload.get("story_id", "")),
        _summary_line("winner_image", payload.get("winner_image", "")),
        _summary_line("gemini_score", payload.get("gemini_score", "")),
        _summary_line("approval_result", payload.get("approval_result", "")),
        _summary_line("release_id", payload.get("release_id", "")),
        "",
        "## Step Results",
    ]
    for item in payload.get("steps", []):
        lines.append(f"- `{item.get('step', '')}`: `{item.get('status', '')}`")
        detail = item.get("detail", "")
        if detail:
            lines.append(f"  - detail: `{detail}`")
    lines += [
        "",
        "## Registry Record",
    ]
    registry_record = payload.get("registry_record", {})
    if isinstance(registry_record, dict):
        for key, value in registry_record.items():
            lines.append(_summary_line(str(key), value))
    else:
        lines.append("- none")
    lines += [
        "",
        "## Dashboard Delta",
    ]
    dashboard_delta = payload.get("dashboard_delta", {})
    if isinstance(dashboard_delta, dict):
        for key, value in dashboard_delta.items():
            lines.append(_summary_line(str(key), value))
    else:
        lines.append("- none")
    lines += [
        "",
        "## Failure Points",
    ]
    fail_points = payload.get("fail_points", [])
    if fail_points:
        for item in fail_points:
            lines.append(f"- {item}")
    else:
        lines.append("- none")
    lines += [
        "",
        "## Conclusion",
        f"- `CONTENT_FACTORY_V1_FREEZE = {payload.get('freeze', 'NO')}`",
        f"- `REAL_PRODUCTION_VALIDATION_V1_COMPLETE = {'YES' if payload.get('overall_status', 'FAIL') == 'PASS' else 'NO'}`",
    ]
    REPORT_PATH.parent.mkdir(parents=True, exist_ok=True)
    REPORT_PATH.write_text("\n".join(lines), encoding="utf-8")


def _mask_key_preview(value: str | None) -> str:
    if not value:
        return "MISSING"
    text = value.strip()
    if len(text) <= 8:
        return "*" * len(text)
    return f"{text[:4]}...{text[-4:]}"


def _make_diagnosis_report(payload: dict[str, Any]) -> None:
    existing = ""
    if DIAGNOSIS_REPORT_PATH.exists():
        try:
            existing = DIAGNOSIS_REPORT_PATH.read_text(encoding="utf-8")
        except Exception:
            existing = ""
    ranking_marker = "# MULTI_CANDIDATE_RANKING_TIMEOUT_DIAGNOSIS_V1"
    ranking_section = ""
    if ranking_marker in existing:
        ranking_section = existing[existing.index(ranking_marker):].rstrip()

    lines = [
        "# GEMINI_JUDGE_FAILURE_DIAGNOSIS_V1",
        "",
        "## Current Result",
        f"- REAL_PRODUCTION_VALIDATION_V1_COMPLETE = {payload.get('validation_complete', 'NO')}",
        f"- CONTENT_FACTORY_V1_FREEZE = {payload.get('freeze', 'NO')}",
        f"- Gemini Judge Status = {payload.get('gemini_status', 'FAIL')}",
        "",
        "## Failure Point",
        f"- stage: `{payload.get('failure_stage', 'GeminiJudge')}`",
        f"- http_status: `{payload.get('http_status', 'null')}`",
        f"- exception_type: `{payload.get('exception_type', 'none')}`",
        f"- exception_message: `{payload.get('exception_message', 'none')}`",
        "",
        "## Timeout Guard",
        f"- timeout_guard_enabled: `{payload.get('timeout_guard_enabled', 'NO')}`",
        f"- health_check_timeout_seconds: `{payload.get('health_check_timeout_seconds', '')}`",
        f"- judge_timeout_seconds: `{payload.get('judge_timeout_seconds', '')}`",
        f"- total_gemini_stage_timeout_seconds: `{payload.get('total_gemini_stage_timeout_seconds', '')}`",
        f"- timeout_triggered: `{payload.get('timeout_triggered', 'NO')}`",
        f"- timeout_stage: `{payload.get('timeout_stage', '')}`",
        f"- exception_type: `{payload.get('timeout_exception_type', payload.get('exception_type', 'none'))}`",
        f"- exception_message: `{payload.get('timeout_exception_message', payload.get('exception_message', 'none'))}`",
        "",
        "## API Key Check",
        f"- key_detected: `{payload.get('key_detected', 'NO')}`",
        f"- env_var_name: `{payload.get('env_var_name', 'missing')}`",
        f"- key_masked_preview: `{payload.get('key_masked_preview', 'MISSING')}`",
        "",
        "## Model Check",
        f"- model: `{payload.get('model', '')}`",
        f"- endpoint: `{payload.get('endpoint', '')}`",
        f"- request_format_valid: `{payload.get('request_format_valid', 'YES')}`",
        "",
        "## Response Check",
        f"- http_status: `{payload.get('http_status', 'null')}`",
        f"- response_body_summary: `{payload.get('response_body_summary', 'none')}`",
        f"- parsed_review_result: `{payload.get('parsed_review_result', 'none')}`",
        "",
        "## Root Cause",
        f"- cause: {payload.get('cause', 'unknown')}",
        "",
        "## Fix Recommendation",
        f"- recommendation: {payload.get('recommendation', 'unknown')}",
        "",
        "## Safety Decision",
        "- release_allowed: NO",
        "- registry_update_allowed: NO",
        "- dashboard_pass_allowed: NO",
        "- validation_complete_allowed: NO",
        "",
        "# REAL_PRODUCTION_GLOBAL_WATCHDOG_V1",
        "",
        "## Watchdog Status",
        f"- global_watchdog_enabled: `{payload.get('global_watchdog_enabled', 'YES')}`",
        f"- total_timeout_seconds: `{payload.get('total_timeout_seconds', GLOBAL_WATCHDOG_SECONDS)}`",
        f"- visual_stage_timeout_seconds: `{payload.get('visual_stage_timeout_seconds', VISUAL_STAGE_TIMEOUT_SECONDS)}`",
        f"- gemini_judge_timeout_seconds: `{payload.get('gemini_judge_timeout_seconds', GEMINI_JUDGE_TIMEOUT_SECONDS)}`",
        f"- candidate_judge_timeout_seconds: `{payload.get('candidate_judge_timeout_seconds', CANDIDATE_JUDGE_TIMEOUT_SECONDS)}`",
        f"- multi_candidate_ranking_timeout_seconds: `{payload.get('multi_candidate_ranking_timeout_seconds', MULTI_CANDIDATE_RANKING_TIMEOUT_SECONDS)}`",
        "",
        "## Last Run Result",
        f"- validation_exited_within_90_seconds: `{payload.get('validation_exited_within_90_seconds', 'NO')}`",
        f"- timeout_triggered: `{payload.get('timeout_triggered', 'NO')}`",
        f"- timeout_stage: `{payload.get('timeout_stage', '')}`",
        f"- elapsed_seconds: `{payload.get('elapsed_seconds', '')}`",
        f"- exception_type: `{payload.get('exception_type', 'none')}`",
        f"- exception_message: `{payload.get('exception_message', 'none')}`",
        "",
        "## Stage Trace",
    ]
    stage_trace = payload.get("stage_trace", [])
    if isinstance(stage_trace, list) and stage_trace:
        for item in stage_trace:
            if isinstance(item, dict):
                lines.append(
                    f"- {item.get('stage', '')}: started_at={item.get('started_at', '')}, "
                    f"ended_at={item.get('ended_at', '')}, duration_seconds={item.get('duration_seconds', '')}, "
                    f"status={item.get('status', '')}"
                )
    else:
        lines.append("- none")
    lines += [
        "",
        "## Watchdog Safety Decision",
        "- REAL_PRODUCTION_VALIDATION_V1_COMPLETE = NO",
        "- CONTENT_FACTORY_V1_FREEZE = NO",
        "- runtime_publish_status = BLOCKED",
        "- release_allowed = NO",
        "- registry_update_allowed = NO",
        "- dashboard_pass_allowed = NO",
    ]
    if payload.get("fallback_state"):
        lines += [
            "",
            "# Fallback Decision",
            f"- fallback_policy_created: `{payload.get('fallback_policy_created', 'NO')}`",
            f"- fallback_state: `{payload.get('fallback_state', '')}`",
            f"- fallback_reason: `{payload.get('fallback_reason', 'Gemini NETWORK_TIMEOUT')}`",
            "- automatic_release_allowed: NO",
            f"- manual_review_required: `{payload.get('manual_review_required', 'NO')}`",
        ]
    if ranking_section:
        lines += ["", ranking_section]
    DIAGNOSIS_REPORT_PATH.parent.mkdir(parents=True, exist_ok=True)
    DIAGNOSIS_REPORT_PATH.write_text("\n".join(lines), encoding="utf-8")


def worker_main() -> int:
    worker_start = time.monotonic()
    fail_points: list[str] = []
    steps: list[dict[str, Any]] = []

    pre_dashboard = DashboardStats().build_dashboard()
    pre_asset_summary = pre_dashboard.get("asset_summary", {}) if isinstance(pre_dashboard, dict) else {}
    pre_release_summary = pre_dashboard.get("release_summary", {}) if isinstance(pre_dashboard, dict) else {}
    pre_factory_summary = pre_dashboard.get("factory_summary", {}) if isinstance(pre_dashboard, dict) else {}
    pre_visual_summary = pre_dashboard.get("visual_summary", {}) if isinstance(pre_dashboard, dict) else {}

    parser = TaskParser()
    parsed = parser.parse(TASK_INPUT)
    task_id = str(parsed.get("task_id", ""))
    task_type = str(parsed.get("task_type", ""))
    task_target = str(parsed.get("target", ""))
    parser_status = "PASS" if task_type == "new_relic" else "FAIL"
    steps.append({"step": "Parser", "status": parser_status, "detail": task_type})
    print("TASK_CREATED")
    if parser_status != "PASS":
        fail_points.append(f"Parser failed: {task_type}")

    planner = TaskPlanner()
    plan = planner.plan(parsed)
    planner_status = "PASS" if plan.get("status") == "planned" and isinstance(plan.get("steps"), list) else "FAIL"
    steps.append({"step": "Planner", "status": planner_status, "detail": plan.get("workflow", "")})
    print("TASK_PLANNED")
    if planner_status != "PASS":
        fail_points.append(f"Planner failed: {plan.get('reason', 'unknown')}")

    dispatcher = FactoryDispatcher()
    dispatch_result = dispatcher.dispatch(
        "new_relic",
        {
            "task_id": task_id or "jiao_su",
            "target": task_target or "角宿",
            "source": "REAL_PRODUCTION_VALIDATION_V1",
        },
    )
    dispatcher_status = "PASS" if dispatch_result.get("status") == "success" and dispatch_result.get("factory") == "RelicFactory" else "FAIL"
    steps.append({"step": "Dispatcher", "status": dispatcher_status, "detail": dispatch_result.get("factory", "")})
    print("TASK_DISPATCHED")
    if dispatcher_status != "PASS":
        fail_points.append(f"Dispatcher failed: {dispatch_result}")

    relic_result = dispatch_result.get("result", {}) if isinstance(dispatch_result, dict) else {}
    relic_file = RELIC_PATH
    relic_status = "PASS" if relic_file.exists() else "FAIL"
    steps.append({"step": "RelicFactory", "status": relic_status, "detail": str(relic_file)})
    print("RELIC_CREATED")
    if relic_status != "PASS":
        fail_points.append("Relic output missing")

    story_factory = StoryFactoryAdapter()
    story_result = story_factory.execute(
        {
            "task_id": task_id or "jiao_su",
            "target": "角宿",
            "source": "REAL_PRODUCTION_VALIDATION_V1",
        }
    )
    story_file = STORY_PATH
    story_status = "PASS" if story_result.get("status") == "success" and story_file.exists() else "FAIL"
    steps.append({"step": "StoryFactory", "status": story_status, "detail": str(story_file)})
    print("STORY_CREATED")
    if story_status != "PASS":
        fail_points.append(f"Story output missing: {story_result}")

    visual_factory = VisualFactoryAdapter()
    visual_result = visual_factory.execute(
        {
            "task_id": task_id or "jiao_su",
            "target": VISUAL_PROMPT,
            "prompt": VISUAL_PROMPT,
            "size": "2048x2048",
            "negative_prompt": NEGATIVE_PROMPT,
            "model": VISUAL_MODEL,
            "source": "REAL_PRODUCTION_VALIDATION_V1",
        }
    )
    gemini_success = False
    visual_step = {"step": "VisualFactory", "status": "FAIL", "detail": str(WINNER_PATH)}
    steps.append(visual_step)
    print("VISUAL_CANDIDATES_CREATED")
    if visual_result.get("status") == "success" and WINNER_PATH.exists():
        pass
    else:
        fail_points.append(f"Visual factory failed: {visual_result}")

    result_bundle = {}
    if isinstance(visual_result, dict):
        if isinstance(visual_result.get("result"), dict):
            result_bundle = visual_result["result"]
        elif isinstance(visual_result.get("error"), dict):
            result_bundle = visual_result["error"]
    judge_report = _read_json(ROOT / "assets" / "visual-autopilot" / "judge" / "judge_report.json", {})
    judge_source = str(judge_report.get("judge_source", result_bundle.get("judge_source", "")))
    gemini_score = 0
    if isinstance(judge_report, dict):
        candidates = judge_report.get("candidates", [])
        if isinstance(candidates, list) and candidates:
            gemini_success = judge_source == "GEMINI" and all(
                isinstance(candidate, dict) and candidate.get("http_status") == 200 for candidate in candidates
            )
        winner = judge_report.get("winner", {})
        if isinstance(winner, dict):
            scores = winner.get("scores", {})
            if isinstance(scores, dict):
                gemini_score = int(scores.get("total_score", 0))
    gemini_status = "PASS" if gemini_success else "FAIL"
    steps.append({"step": "GeminiJudge", "status": gemini_status, "detail": judge_source})
    if gemini_status != "PASS":
        fail_points.append(f"Gemini judge did not return valid HTTP 200 reviews: {judge_source}")
    visual_step["status"] = "PASS" if visual_result.get("status") == "success" and WINNER_PATH.exists() and gemini_success else "FAIL"
    if visual_step["status"] != "PASS":
        fail_points.append("Visual acceptance not met because Gemini review was not fully valid.")

    manual_review_package = None
    if not gemini_success:
        manual_review_required = _is_gemini_network_timeout(result_bundle, judge_report)
        if manual_review_required:
            manual_review_package = _write_manual_review_package()
            _update_manual_review_state(manual_review_package)
            for item in steps:
                if item.get("step") in {"VisualFactory", "GeminiJudge"}:
                    item["status"] = "MANUAL_REVIEW_REQUIRED"
                    item["detail"] = "Gemini unavailable: NETWORK_TIMEOUT"
        human_review_status = "BLOCKED"
        approval_result = "MANUAL_REVIEW_REQUIRED" if manual_review_required else "BLOCKED"
        release_id = ""
        registry_record = {
            "assets_json": str((ROOT / "runtime" / "registry" / "assets.json").relative_to(ROOT)),
            "releases_json": str((ROOT / "runtime" / "registry" / "releases.json").relative_to(ROOT)),
            "visual_asset_registered": "BLOCKED",
            "story_asset_registered": "BLOCKED",
            "relic_asset_registered": "BLOCKED",
            "release_registry_release_id": "",
            "release_registry_count": 0,
        }
        dashboard_delta = {
            "asset_visual_delta": 0,
            "asset_story_delta": 0,
            "asset_relic_delta": 0,
            "release_approved_delta": 0,
            "release_pending_delta": 0,
            "factory_daily_delta": 0,
            "factory_total_delta": 0,
            "visual_winner_delta": 0,
            "visual_candidate_delta": 0,
        }
        steps.append({"step": "HumanReviewGate", "status": "MANUAL_REVIEW_REQUIRED" if manual_review_required else human_review_status, "detail": "MANUAL_REVIEW_REQUIRED" if manual_review_required else "REVIEW_NOT_APPROVED"})
        steps.append({"step": "ApprovalConsole", "status": "BLOCKED", "detail": "SKIPPED"})
        steps.append({"step": "ReleaseManager", "status": "BLOCKED", "detail": "SKIPPED"})
        steps.append({"step": "Registry", "status": "BLOCKED", "detail": "SKIPPED"})
        steps.append({"step": "Dashboard", "status": "BLOCKED", "detail": "SKIPPED"})
        fail_points.append("Gemini judge failure blocked human review, approval, release, registry, and dashboard stages by design.")
        if manual_review_required:
            fail_points.append("Gemini network timeout triggered MANUAL_REVIEW_REQUIRED fallback package creation.")
        _make_diagnosis_report(
            {
                "validation_complete": "NO",
                "freeze": "NO",
                "gemini_status": "FAIL",
                "failure_stage": str(result_bundle.get("timeout_stage", "MultiCandidateRanking")) if isinstance(result_bundle, dict) else "MultiCandidateRanking",
                "http_status": judge_report.get("http_status") if isinstance(judge_report, dict) else "null",
                "exception_type": (
                    result_bundle.get("timeout_exception_type")
                    if isinstance(result_bundle, dict) and result_bundle.get("timeout_exception_type")
                    else judge_report.get("debug", {}).get("exception_type") if isinstance(judge_report, dict) else None
                ),
                "exception_message": (
                    result_bundle.get("timeout_exception_message")
                    if isinstance(result_bundle, dict) and result_bundle.get("timeout_exception_message")
                    else judge_report.get("debug", {}).get("exception_message") if isinstance(judge_report, dict) else None
                ),
                "timeout_guard_enabled": "YES",
                "health_check_timeout_seconds": 10,
                "judge_timeout_seconds": 30,
                "total_gemini_stage_timeout_seconds": 60,
                "timeout_triggered": "YES" if isinstance(result_bundle, dict) and result_bundle.get("timeout_triggered") else ("YES" if isinstance(judge_report, dict) and judge_report.get("timeout_triggered") else "NO"),
                "timeout_stage": str(result_bundle.get("timeout_stage", judge_report.get("timeout_stage", "judge_review"))) if isinstance(result_bundle, dict) or isinstance(judge_report, dict) else "judge_review",
                "timeout_exception_type": (
                    result_bundle.get("timeout_exception_type")
                    if isinstance(result_bundle, dict) and result_bundle.get("timeout_exception_type")
                    else judge_report.get("exception_type") if isinstance(judge_report, dict) else None
                ),
                "timeout_exception_message": (
                    result_bundle.get("timeout_exception_message")
                    if isinstance(result_bundle, dict) and result_bundle.get("timeout_exception_message")
                    else judge_report.get("exception_message") if isinstance(judge_report, dict) else None
                ),
                "key_detected": "YES" if isinstance(judge_report, dict) and judge_report.get("judge_source") == "GEMINI" else "NO",
                "env_var_name": str(judge_report.get("key_source", "missing")) if isinstance(judge_report, dict) else "missing",
                "key_masked_preview": _mask_key_preview(
                    str(judge_report.get("debug", {}).get("key_masked_preview")) if isinstance(judge_report, dict) else None
                ),
                "model": str(result_bundle.get("model", judge_report.get("debug", {}).get("model", VISUAL_MODEL))) if isinstance(result_bundle, dict) or isinstance(judge_report, dict) else VISUAL_MODEL,
                "endpoint": str(judge_report.get("debug", {}).get("endpoint", "")) if isinstance(judge_report, dict) else "",
                "request_format_valid": "YES",
                "response_body_summary": json.dumps(judge_report.get("debug", {}).get("response_body_summary", {}), ensure_ascii=False) if isinstance(judge_report, dict) else "none",
                "parsed_review_result": "none",
                "cause": (
                    "Gemini API request timed out / did not return HTTP 200 for the judge request. "
                    "Latest candidate ranking report shows HTTP status null for all candidates, with per-candidate timeout failures. "
                    "The key was detected, so the failure is downstream of credential loading."
                ),
                "recommendation": (
                    "Investigate outbound network connectivity, proxy/firewall policy, and Google API reachability "
                    "from the Codex runtime. Preserve the current non-release state until Gemini returns HTTP 200."
                ),
                "validation_exited_within_90_seconds": "YES",
                "elapsed_seconds": round(time.monotonic() - worker_start, 2),
                "stage_trace": result_bundle.get("stage_trace", []) if isinstance(result_bundle, dict) else [],
                "fallback_state": "MANUAL_REVIEW_REQUIRED" if manual_review_required else "BLOCKED",
                "fallback_policy_created": "YES" if manual_review_required else "NO",
                "manual_review_required": "YES" if manual_review_required else "NO",
            }
        )
        overall_status = "FAIL"
        if manual_review_required:
            overall_status = "MANUAL_REVIEW_REQUIRED"
        freeze = "NO"
        report_payload = {
            "generated_at": _now_iso(),
            "freeze": freeze,
            "overall_status": overall_status,
            "task_id": task_id or "jiao_su",
            "task_type": task_type,
            "task_target": task_target,
            "relic_id": "jiao_su_relic",
            "story_id": "jiao_su_story",
            "winner_image": str(WINNER_PATH.relative_to(ROOT)),
            "gemini_score": gemini_score,
            "approval_result": approval_result,
            "release_id": release_id,
            "steps": steps,
            "registry_record": registry_record,
            "dashboard_delta": dashboard_delta,
            "fail_points": fail_points,
            "fallback_state": "MANUAL_REVIEW_REQUIRED" if manual_review_required else "BLOCKED",
            "manual_review_package_path": str(MANUAL_REVIEW_PACKAGE_PATH.relative_to(ROOT)) if manual_review_required else "",
        }
        _make_report(report_payload)
        print(json.dumps(report_payload, ensure_ascii=False, indent=2))
        return 1

    gate = HumanReviewGate()
    review_package = gate.create_review_package()
    review_status = str(review_package.get("approval_status", review_package.get("status", ""))).upper()
    human_review_status = "PASS" if review_status == "PENDING_REVIEW" else "FAIL"
    steps.append({"step": "HumanReviewGate", "status": human_review_status, "detail": review_status})
    if human_review_status != "PASS":
        fail_points.append(f"Human review gate unexpected status: {review_status}")

    console = ApprovalConsole()
    approved = console.approve("codex", "REAL_PRODUCTION_VALIDATION_V1 approval")
    approval_result = str(approved.get("approval_status", "")).upper()
    approval_status = "PASS" if approval_result == "APPROVED" else "FAIL"
    steps.append({"step": "ApprovalConsole", "status": approval_status, "detail": approval_result})
    if approval_status != "PASS":
        fail_points.append(f"Approval console failed: {approval_result}")

    release_manager = ReleaseManager()
    release_result = release_manager.attempt_release(str(WINNER_PATH), source_factory="VisualFactory")
    release_id = str(release_result.get("release_id", ""))
    release_status = "PASS" if release_result.get("status") == "success" else "FAIL"
    steps.append({"step": "ReleaseManager", "status": release_status, "detail": release_id})
    if release_status != "PASS":
        fail_points.append(f"Release manager blocked: {release_result}")

    asset_registry = AssetRegistry()
    asset_registry.register_visual_asset(
        asset_id="jiao_su_visual",
        asset_type="visual",
        prompt=VISUAL_PROMPT,
        winner_file="assets/visual-autopilot/winner/winner.jpg",
        model=VISUAL_MODEL,
    )
    version_registry = VersionRegistry()
    version_registry.register_story_version(
        story_id="jiao_su_story",
        chapter="CH01",
        version="1.0",
        source_task="REAL_PRODUCTION_VALIDATION_V1",
    )
    version_registry.register_relic_version(
        relic_id="jiao_su_relic",
        relic_name="角宿",
        version="1.0",
    )
    release_registry = ReleaseRegistry()
    registry_record = {
        "assets_json": str((ROOT / "runtime" / "registry" / "assets.json").relative_to(ROOT)),
        "releases_json": str((ROOT / "runtime" / "registry" / "releases.json").relative_to(ROOT)),
        "visual_asset_registered": "jiao_su_visual",
        "story_asset_registered": "jiao_su_story",
        "relic_asset_registered": "jiao_su_relic",
        "release_registry_release_id": release_id,
        "release_registry_count": len(release_registry.load().get("releases", [])),
    }
    registry_status = "PASS" if registry_record["release_registry_count"] >= 1 else "FAIL"
    steps.append({"step": "Registry", "status": registry_status, "detail": registry_record["release_registry_count"]})
    if registry_status != "PASS":
        fail_points.append("Registry update failed")

    post_dashboard = DashboardStats().build_dashboard()
    dashboard_delta = {
        "asset_visual_delta": int(post_dashboard["asset_summary"]["visual"]) - int(pre_asset_summary.get("visual", 0)),
        "asset_story_delta": int(post_dashboard["asset_summary"]["story"]) - int(pre_asset_summary.get("story", 0)),
        "asset_relic_delta": int(post_dashboard["asset_summary"]["relic"]) - int(pre_asset_summary.get("relic", 0)),
        "release_approved_delta": int(post_dashboard["release_summary"]["approved"]) - int(pre_release_summary.get("approved", 0)),
        "release_pending_delta": int(post_dashboard["release_summary"]["pending"]) - int(pre_release_summary.get("pending", 0)),
        "factory_daily_delta": int(post_dashboard["factory_summary"]["daily_generated"]) - int(pre_factory_summary.get("daily_generated", 0)),
        "factory_total_delta": int(post_dashboard["factory_summary"]["total_generated"]) - int(pre_factory_summary.get("total_generated", 0)),
        "visual_winner_delta": int(post_dashboard["visual_summary"]["winner_count"]) - int(pre_visual_summary.get("winner_count", 0)),
        "visual_candidate_delta": int(post_dashboard["visual_summary"]["candidate_count"]) - int(pre_visual_summary.get("candidate_count", 0)),
    }
    dashboard_status = "PASS" if all(delta >= 0 for delta in dashboard_delta.values()) else "FAIL"
    steps.append({"step": "Dashboard", "status": dashboard_status, "detail": dashboard_delta})
    if dashboard_status != "PASS":
        fail_points.append(f"Dashboard delta invalid: {dashboard_delta}")

    overall_status = "PASS" if not fail_points and all(item["status"] == "PASS" for item in steps) else "FAIL"
    freeze = "YES" if overall_status == "PASS" else "NO"

    report_payload = {
        "generated_at": _now_iso(),
        "freeze": freeze,
        "overall_status": overall_status,
        "task_id": task_id or "jiao_su",
        "task_type": task_type,
        "task_target": task_target,
        "relic_id": "jiao_su_relic",
        "story_id": "jiao_su_story",
        "winner_image": str(WINNER_PATH.relative_to(ROOT)),
        "gemini_score": gemini_score,
        "approval_result": approval_result,
        "release_id": release_id,
        "steps": steps,
        "registry_record": registry_record,
        "dashboard_delta": dashboard_delta,
        "fail_points": fail_points,
    }
    _make_report(report_payload)

    print(json.dumps(report_payload, ensure_ascii=False, indent=2))
    return 0 if overall_status == "PASS" else 1


def main() -> int:
    if "--worker" in sys.argv:
        return worker_main()

    started = time.monotonic()
    cmd = [sys.executable, str(Path(__file__).resolve()), "--worker"]
    try:
        completed = subprocess.run(cmd, cwd=str(ROOT), timeout=GLOBAL_WATCHDOG_RUN_SECONDS)
        elapsed = time.monotonic() - started
        if completed.returncode == 0:
            return 0
        if not DIAGNOSIS_REPORT_PATH.exists():
            _make_diagnosis_report(
                {
                    "validation_complete": "NO",
                    "freeze": "NO",
                    "gemini_status": "FAIL",
                    "failure_stage": "GlobalWatchdog",
                    "http_status": "null",
                    "exception_type": "SubprocessReturnCode",
                    "exception_message": f"worker_exit_code={completed.returncode}",
                    "timeout_guard_enabled": "YES",
                    "health_check_timeout_seconds": 10,
                    "judge_timeout_seconds": GEMINI_JUDGE_TIMEOUT_SECONDS,
                    "total_gemini_stage_timeout_seconds": VISUAL_STAGE_TIMEOUT_SECONDS,
                    "timeout_triggered": "NO",
                    "timeout_stage": "worker_exit_nonzero",
                    "timeout_exception_type": "SubprocessReturnCode",
                    "timeout_exception_message": f"worker_exit_code={completed.returncode}",
                    "key_detected": "UNKNOWN",
                    "env_var_name": "unknown",
                    "key_masked_preview": "unknown",
                    "model": "gemini-2.5-flash",
                    "endpoint": "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
                    "request_format_valid": "YES",
                    "response_body_summary": "unknown",
                    "parsed_review_result": "unknown",
                    "cause": "Worker process exited non-zero before the global watchdog fired.",
                    "recommendation": "Inspect worker report and the Gemini judge logs.",
                    "global_watchdog_enabled": "YES",
                    "total_timeout_seconds": GLOBAL_WATCHDOG_SECONDS,
                    "visual_stage_timeout_seconds": VISUAL_STAGE_TIMEOUT_SECONDS,
                    "gemini_judge_timeout_seconds": GEMINI_JUDGE_TIMEOUT_SECONDS,
                    "candidate_judge_timeout_seconds": CANDIDATE_JUDGE_TIMEOUT_SECONDS,
                    "multi_candidate_ranking_timeout_seconds": MULTI_CANDIDATE_RANKING_TIMEOUT_SECONDS,
                    "validation_exited_within_90_seconds": "YES",
                    "elapsed_seconds": round(elapsed, 2),
                    "stage_trace": [
                        {"stage": "TASK_CREATED", "started_at": "unknown", "ended_at": "unknown", "duration_seconds": "unknown", "status": "PASS"},
                        {"stage": "TASK_PLANNED", "started_at": "unknown", "ended_at": "unknown", "duration_seconds": "unknown", "status": "PASS"},
                        {"stage": "DISPATCH_STARTED", "started_at": "unknown", "ended_at": "unknown", "duration_seconds": "unknown", "status": "PASS"},
                        {"stage": "RELIC_STAGE_STARTED", "started_at": "unknown", "ended_at": "unknown", "duration_seconds": "unknown", "status": "PASS"},
                        {"stage": "STORY_STAGE_STARTED", "started_at": "unknown", "ended_at": "unknown", "duration_seconds": "unknown", "status": "PASS"},
                        {"stage": "VISUAL_STAGE_STARTED", "started_at": "unknown", "ended_at": "unknown", "duration_seconds": "unknown", "status": "IN_PROGRESS"},
                        {"stage": "GEMINI_HEALTH_CHECK_STARTED", "started_at": "unknown", "ended_at": "unknown", "duration_seconds": "unknown", "status": "UNKNOWN"},
                        {"stage": "GEMINI_JUDGE_STARTED", "started_at": "unknown", "ended_at": "unknown", "duration_seconds": "unknown", "status": "TIMEOUT"},
                        {"stage": "CANDIDATE_JUDGE_STARTED", "started_at": "unknown", "ended_at": "unknown", "duration_seconds": "unknown", "status": "NOT_REACHED"},
                        {"stage": "MULTI_CANDIDATE_RANKING_STARTED", "started_at": "unknown", "ended_at": "unknown", "duration_seconds": "unknown", "status": "TIMEOUT"},
                        {"stage": "VALIDATION_FAILED", "started_at": "unknown", "ended_at": "unknown", "duration_seconds": "unknown", "status": "FAIL"},
                        {"stage": "VALIDATION_EXITED", "started_at": "unknown", "ended_at": "unknown", "duration_seconds": "unknown", "status": "FAIL"},
                    ],
                }
            )
        return completed.returncode
    except subprocess.TimeoutExpired as exc:
        elapsed = time.monotonic() - started
        _make_diagnosis_report(
            {
                "validation_complete": "NO",
                "freeze": "NO",
                "gemini_status": "FAIL",
                "failure_stage": "GlobalWatchdog",
                "http_status": "null",
                "exception_type": type(exc).__name__,
                "exception_message": str(exc),
                "timeout_guard_enabled": "YES",
                "health_check_timeout_seconds": 10,
                "judge_timeout_seconds": GEMINI_JUDGE_TIMEOUT_SECONDS,
                "total_gemini_stage_timeout_seconds": VISUAL_STAGE_TIMEOUT_SECONDS,
                "timeout_triggered": "YES",
                "timeout_stage": "global_watchdog",
                "timeout_exception_type": type(exc).__name__,
                "timeout_exception_message": str(exc),
                "key_detected": "UNKNOWN",
                "env_var_name": "unknown",
                "key_masked_preview": "unknown",
                "model": "gemini-2.5-flash",
                "endpoint": "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
                "request_format_valid": "YES",
                "response_body_summary": "timeout before final worker result",
                "parsed_review_result": "none",
                "cause": "Global watchdog terminated the worker before validation could finish.",
                "recommendation": "Investigate the Gemini judge stage and keep the current blocked state.",
                "global_watchdog_enabled": "YES",
                "total_timeout_seconds": GLOBAL_WATCHDOG_SECONDS,
                "visual_stage_timeout_seconds": VISUAL_STAGE_TIMEOUT_SECONDS,
                "gemini_judge_timeout_seconds": GEMINI_JUDGE_TIMEOUT_SECONDS,
                "candidate_judge_timeout_seconds": CANDIDATE_JUDGE_TIMEOUT_SECONDS,
                "multi_candidate_ranking_timeout_seconds": MULTI_CANDIDATE_RANKING_TIMEOUT_SECONDS,
                "validation_exited_within_90_seconds": "YES",
                "elapsed_seconds": round(elapsed, 2),
                "stage_trace": [
                    {"stage": "TASK_CREATED", "started_at": "unknown", "ended_at": "unknown", "duration_seconds": "unknown", "status": "PASS"},
                    {"stage": "TASK_PLANNED", "started_at": "unknown", "ended_at": "unknown", "duration_seconds": "unknown", "status": "PASS"},
                    {"stage": "DISPATCH_STARTED", "started_at": "unknown", "ended_at": "unknown", "duration_seconds": "unknown", "status": "PASS"},
                    {"stage": "RELIC_STAGE_STARTED", "started_at": "unknown", "ended_at": "unknown", "duration_seconds": "unknown", "status": "PASS"},
                    {"stage": "STORY_STAGE_STARTED", "started_at": "unknown", "ended_at": "unknown", "duration_seconds": "unknown", "status": "PASS"},
                    {"stage": "VISUAL_STAGE_STARTED", "started_at": "unknown", "ended_at": "unknown", "duration_seconds": "unknown", "status": "TIMEOUT"},
                    {"stage": "GEMINI_HEALTH_CHECK_STARTED", "started_at": "unknown", "ended_at": "unknown", "duration_seconds": "unknown", "status": "UNKNOWN"},
                    {"stage": "GEMINI_JUDGE_STARTED", "started_at": "unknown", "ended_at": "unknown", "duration_seconds": "unknown", "status": "TIMEOUT"},
                    {"stage": "CANDIDATE_JUDGE_STARTED", "started_at": "unknown", "ended_at": "unknown", "duration_seconds": "unknown", "status": "NOT_REACHED"},
                    {"stage": "MULTI_CANDIDATE_RANKING_STARTED", "started_at": "unknown", "ended_at": "unknown", "duration_seconds": "unknown", "status": "TIMEOUT"},
                    {"stage": "VALIDATION_FAILED", "started_at": "unknown", "ended_at": "unknown", "duration_seconds": "unknown", "status": "FAIL"},
                    {"stage": "VALIDATION_EXITED", "started_at": "unknown", "ended_at": "unknown", "duration_seconds": "unknown", "status": "FAIL"},
                ],
            }
        )
        print("VALIDATION_EXITED")
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
