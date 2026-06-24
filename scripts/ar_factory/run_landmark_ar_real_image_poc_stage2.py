from __future__ import annotations

import json
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Tuple

ROOT = Path(__file__).resolve().parents[2]
DATA_DIR = ROOT / "data" / "ar_factory" / "poc" / "landmark_tree_v1"
REPORT_PATH = ROOT / "docs" / "product" / "ar_factory" / "LANDMARK_AR_REAL_IMAGE_POC_STAGE2_REPORT.md"

FACTORY_PACKAGE_PATH = DATA_DIR / "factory_package.json"
RUNTIME_PACKAGE_PATH = DATA_DIR / "runtime_package.json"
SCHEMA_VALIDATION_PATH = DATA_DIR / "schema_validation.json"

POC_ID = "landmark_tree_v1"
EXPLORATION_POINT_ID = "ancient_tree_exploration_point"
AR_ID = "landmark_tree_v1"
TEMPLATE_REF = "LANDMARK_RELIC_REVEAL"
INTERACTION_SCRIPT = "landmark_tree_v1"
COMPLETION_EVENT = "event.landmark_tree_v1.completed"

# LOVEQIGU test site approximate coordinates (exploration point ep_001 alignment)
DEFAULT_LAT = 31.23
DEFAULT_LNG = 121.47


def now_iso() -> str:
    return datetime.now(timezone.utc).astimezone().isoformat(timespec="seconds")


def read_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, data: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


def rel(path: Path) -> str:
    return str(path.relative_to(ROOT)).replace("\\", "/")


def build_factory_package(
    subject: Dict[str, Any],
    anchor: Dict[str, Any],
    anchor_quality: Dict[str, Any],
) -> Dict[str, Any]:
    reference_images = [
        rel(DATA_DIR / name)
        for name in subject.get("input_images_detail", [])
    ]
    template_confidence = round(
        min(1.0, subject.get("confidence", 0.0) * 0.4 + anchor_quality.get("overall_score", 0.0) * 0.6),
        3,
    )
    return {
        "id": POC_ID,
        "name": "爱企谷古树",
        "ar_type": "landmark_ar",
        "subject_type": subject.get("subject_type", "tree"),
        "anchor_file": "anchor.json",
        "position_guide": "position_guide.png",
        "alignment_overlay": "alignment_overlay.png",
        "status": "draft",
        "schema_id": "loveqigu.ar_factory.factory_package.v1",
        "draft_id": f"{POC_ID}_draft",
        "exploration_point_id": EXPLORATION_POINT_ID,
        "pipeline_version": "LANDMARK_AR_AUTOGEN_PIPELINE_V1.1",
        "review_status": "draft",
        "template_ref": TEMPLATE_REF,
        "template_confidence": template_confidence,
        "classifier_result": {
            "subject": subject.get("landmark_type", "ancient_tree"),
            "scene_type": "landmark_ar",
            "confidence": subject.get("confidence", 0.0),
            "analysis_mode": subject.get("analysis_method", "opencv_color_texture_consistency"),
        },
        "anchor_set": {
            "reference_images": reference_images,
            "descriptor_uri": rel(DATA_DIR / "anchor.json"),
            "feature_count": anchor_quality.get("feature_points", anchor.get("feature_points", 0)),
            "distribution_score": anchor_quality.get("distribution_score", anchor.get("distribution_score", 0.0)),
            "score": anchor_quality.get("overall_score", anchor.get("overall_score", 0.0)),
            "detector": anchor.get("anchor_method", "opencv_orb_akaze_real_image"),
            "reference_image": anchor.get("reference_image", "tree_trunk.jpg"),
        },
        "ar_guidance_draft": {
            "standing_guide_uri": rel(DATA_DIR / "position_guide.png"),
            "scan_guide_uri": rel(DATA_DIR / "position_guide.png"),
            "alignment_overlay_uri": rel(DATA_DIR / "alignment_overlay.png"),
        },
        "interaction_script": INTERACTION_SCRIPT,
        "reveal_assets": [
            {
                "asset_type": "alignment_overlay",
                "asset_uri": rel(DATA_DIR / "alignment_overlay.png"),
            },
            {
                "asset_type": "position_guide",
                "asset_uri": rel(DATA_DIR / "position_guide.png"),
            },
        ],
        "completion_event": COMPLETION_EVENT,
        "created_at": now_iso(),
        "source_poc": "LANDMARK_AR_REAL_IMAGE_POC_STAGE1",
        "diagnostic": {
            "real_image_input": True,
            "input_images": subject.get("input_images", 8),
            "anchor_score_min_publish": 0.65,
            "anchor_score": anchor_quality.get("overall_score", 0.0),
            "publish_ready": anchor_quality.get("overall_score", 0.0) >= 0.65,
            "notes": "Real-image POC factory package; publish blocked until review approval and anchor score gate.",
        },
    }


def build_ar_runtime_flow() -> Dict[str, Any]:
    return {
        "version": "AR_FACTORY_RUNTIME_SCHEMA_V1.1",
        "stages": [
            {
                "stage": "navigation",
                "interaction_state": "NAVIGATING",
                "consumes": ["navigation_binding"],
            },
            {
                "stage": "arrival",
                "interaction_state": "ARRIVED",
                "consumes": ["navigation_binding.arrival_radius_m", "ar_guidance.standing_guide"],
            },
            {
                "stage": "scanning",
                "interaction_state": "SCANNING",
                "consumes": ["anchor", "ar_guidance.alignment_overlay", "ar_guidance.scan_guide"],
            },
            {
                "stage": "anchor_lock",
                "interaction_state": "ANCHOR_LOCKED",
                "consumes": ["anchor.anchor_payload"],
            },
            {
                "stage": "interaction",
                "interaction_state": "INTERACTING",
                "consumes": ["interaction_script"],
            },
            {
                "stage": "reveal",
                "interaction_state": "REVEALING",
                "consumes": ["ar_entity.reveal_type", "reveal_assets"],
            },
            {
                "stage": "completion",
                "interaction_state": "COMPLETED",
                "consumes": ["completion_event", "activity_binding"],
            },
        ],
    }


def build_runtime_package(factory_package: Dict[str, Any], anchor_quality: Dict[str, Any]) -> Dict[str, Any]:
    anchor_score = anchor_quality.get("overall_score", factory_package["anchor_set"]["score"])
    return {
        "schema_id": "loveqigu.ar.runtime.runtime_package.v1",
        "ar_entity": {
            "ar_id": AR_ID,
            "exploration_point_id": factory_package["exploration_point_id"],
            "status": "draft",
            "ar_type": factory_package["ar_type"],
            "reveal_type": "relic_reveal",
            "runtime_version": "AR_FACTORY_RUNTIME_SCHEMA_V1.1",
            "created_at": factory_package["created_at"],
            "updated_at": now_iso(),
        },
        "ar_guidance": {
            "standing_guide": {
                "guide_uri": factory_package["ar_guidance_draft"]["standing_guide_uri"],
                "rule_params": {"arrival_radius_m": 30},
            },
            "scan_guide": {
                "guide_uri": factory_package["ar_guidance_draft"]["scan_guide_uri"],
                "hint_text": "请将古树轮廓与参考轮廓对齐。",
            },
            "alignment_overlay": {
                "overlay_uri": factory_package["ar_guidance_draft"]["alignment_overlay_uri"],
                "contour_uri": factory_package["ar_guidance_draft"]["alignment_overlay_uri"],
                "alignment_threshold": 0.75,
                "hint_text": "请将古树轮廓与参考轮廓重合。",
                "alignment_success_text": "对准成功，可以开始探索。",
            },
        },
        "anchor": {
            "anchor_type": "image_anchor",
            "anchor_payload": {
                "descriptor_uri": factory_package["anchor_set"]["descriptor_uri"],
                "detector": factory_package["anchor_set"]["detector"],
                "feature_count": factory_package["anchor_set"]["feature_count"],
                "score": anchor_score,
            },
        },
        "navigation_binding": {
            "latitude": DEFAULT_LAT,
            "longitude": DEFAULT_LNG,
            "arrival_radius_m": 30,
            "distance": None,
            "eta": None,
            "nearby_points_ref": [],
        },
        "activity_binding": {
            "activity_id": "loveqigu_first_event_case_v1",
            "blessing_stamp": {
                "stamp_id": "blessing_stamp_landmark_tree_v1",
                "grant_on_completion": True,
            },
            "activity_progress": {
                "progress_key": "landmark_tree_v1_progress",
                "increment": 1,
            },
            "reward_mapping": {
                "reward_type": "blessing_stamp",
                "reward_ref": "blessing_stamp_landmark_tree_v1",
            },
            "rights_center_route": "/pages/rights-center/index",
        },
        "ar_runtime_flow": build_ar_runtime_flow(),
        "interaction_script": factory_package["interaction_script"],
        "reveal_assets": factory_package["reveal_assets"],
        "completion_event": factory_package["completion_event"],
        "runtime_compat": "miniapp_ar_v1",
        "published_at": None,
        "source_factory_package_id": factory_package["id"],
        "diagnostic": {
            "publish_state": "draft_poc",
            "real_image_anchor": True,
            "anchor_score": anchor_score,
            "notes": "Runtime package generated from real-image factory package for schema and loader validation.",
        },
    }


def _missing_fields(obj: Dict[str, Any], required: List[str], prefix: str = "") -> List[str]:
    missing = []
    for field in required:
        key = field.split(".")[0]
        if key not in obj or obj[key] is None:
            missing.append(f"{prefix}{field}" if prefix else field)
    return missing


def _nested_missing(obj: Dict[str, Any], spec: Dict[str, List[str]], prefix: str) -> List[str]:
    missing: List[str] = []
    for section, fields in spec.items():
        if section not in obj or not isinstance(obj[section], dict):
            missing.append(section)
            continue
        for field in fields:
            if field not in obj[section] or obj[section][field] is None:
                missing.append(f"{prefix}{section}.{field}")
    return missing


def validate_factory_package(pkg: Dict[str, Any]) -> Dict[str, Any]:
    poc_required = [
        "id", "name", "ar_type", "subject_type", "anchor_file",
        "position_guide", "alignment_overlay", "status",
    ]
    schema_required = [
        "schema_id", "draft_id", "exploration_point_id", "pipeline_version",
        "review_status", "template_ref", "template_confidence", "anchor_set",
        "ar_guidance_draft", "interaction_script", "reveal_assets",
        "completion_event", "created_at",
    ]
    missing = _missing_fields(pkg, poc_required)
    missing.extend(_missing_fields(pkg, schema_required))
    missing.extend(_nested_missing(pkg, {
        "anchor_set": ["reference_images", "feature_count", "distribution_score"],
        "ar_guidance_draft": [
            "standing_guide_uri", "scan_guide_uri", "alignment_overlay_uri",
        ],
    }, ""))
    asset_files = [
        DATA_DIR / pkg.get("anchor_file", "anchor.json"),
        DATA_DIR / pkg.get("position_guide", "position_guide.png"),
        DATA_DIR / pkg.get("alignment_overlay", "alignment_overlay.png"),
    ]
    missing_files = [rel(p) for p in asset_files if not p.exists()]
    passed = not missing and not missing_files
    return {
        "document": "factory_package.json",
        "schema_id": pkg.get("schema_id"),
        "passed": passed,
        "missing_fields": missing,
        "missing_files": missing_files,
    }


def validate_runtime_package(pkg: Dict[str, Any]) -> Dict[str, Any]:
    top_required = [
        "schema_id", "ar_entity", "ar_guidance", "anchor", "navigation_binding",
        "activity_binding", "ar_runtime_flow", "interaction_script",
        "reveal_assets", "completion_event", "runtime_compat",
    ]
    forbidden = [
        "review_status", "pipeline_version", "reference_images",
        "classifier_result", "template_confidence",
    ]
    missing = _missing_fields(pkg, top_required)
    missing.extend(_nested_missing(pkg, {
        "ar_entity": [
            "ar_id", "exploration_point_id", "status", "ar_type",
            "reveal_type", "runtime_version", "created_at", "updated_at",
        ],
        "anchor": ["anchor_type", "anchor_payload"],
        "navigation_binding": ["latitude", "longitude", "arrival_radius_m"],
        "activity_binding": ["activity_id", "rights_center_route"],
    }, ""))
    guidance = pkg.get("ar_guidance", {})
    for subsection, fields in {
        "standing_guide": ["guide_uri"],
        "scan_guide": ["guide_uri", "hint_text"],
        "alignment_overlay": [
            "overlay_uri", "contour_uri", "alignment_threshold",
            "hint_text", "alignment_success_text",
        ],
    }.items():
        block = guidance.get(subsection, {})
        if not isinstance(block, dict):
            missing.append(f"ar_guidance.{subsection}")
            continue
        for field in fields:
            if field not in block or block[field] is None:
                missing.append(f"ar_guidance.{subsection}.{field}")
    anchor_payload = pkg.get("anchor", {}).get("anchor_payload", {})
    if not isinstance(anchor_payload, dict):
        missing.append("anchor.anchor_payload")
    else:
        for field in ["descriptor_uri", "detector", "feature_count", "score"]:
            if field not in anchor_payload or anchor_payload[field] is None:
                missing.append(f"anchor.anchor_payload.{field}")
    flow = pkg.get("ar_runtime_flow", {})
    if "stages" not in flow or not flow["stages"]:
        missing.append("ar_runtime_flow.stages")
    elif len(flow["stages"]) < 7:
        missing.append("ar_runtime_flow.stages.count>=7")
    leaks = [field for field in forbidden if field in pkg]
    passed = not missing and not leaks
    return {
        "document": "runtime_package.json",
        "schema_id": pkg.get("schema_id"),
        "runtime_version": pkg.get("ar_entity", {}).get("runtime_version"),
        "passed": passed,
        "missing_fields": missing,
        "forbidden_field_leaks": leaks,
    }


def build_schema_validation(
    factory_result: Dict[str, Any],
    runtime_result: Dict[str, Any],
) -> Dict[str, Any]:
    overall = factory_result["passed"] and runtime_result["passed"]
    return {
        "validated_at": now_iso(),
        "schema_version": "AR_FACTORY_RUNTIME_SCHEMA_V1.1",
        "overall_pass": overall,
        "factory_package": factory_result,
        "runtime_package": runtime_result,
        "result": "PASS" if overall else "FAIL",
    }


def build_report(
    factory_generated: bool,
    runtime_generated: bool,
    schema_validation: Dict[str, Any],
    load_result: Dict[str, Any],
) -> str:
    schema_pass = schema_validation["result"] == "PASS"
    load_pass = load_result.get("passed", False)
    ready = schema_pass and load_pass
    return "\n".join([
        "# LANDMARK_AR_REAL_IMAGE_POC_STAGE2_REPORT",
        "",
        "## Purpose",
        "",
        "Validate real-image Stage1 outputs through Factory Package → Runtime Package → Schema validation → Runtime loader.",
        "",
        "## Input",
        "",
        f"- `{rel(DATA_DIR)}/`",
        "- subject_analysis.json",
        "- anchor.json",
        "- anchor_quality.json",
        "- position_guide.png",
        "- alignment_overlay.png",
        "",
        "## Generated Files",
        "",
        f"- `{rel(FACTORY_PACKAGE_PATH)}`",
        f"- `{rel(RUNTIME_PACKAGE_PATH)}`",
        f"- `{rel(SCHEMA_VALIDATION_PATH)}`",
        f"- `{rel(ROOT / 'scripts/ar_factory/runtime_package_loader.py')}`",
        "",
        "## Results",
        "",
        f"- FACTORY_PACKAGE_GENERATED: {'YES' if factory_generated else 'NO'}",
        f"- RUNTIME_PACKAGE_GENERATED: {'YES' if runtime_generated else 'NO'}",
        f"- SCHEMA_VALIDATION: {schema_validation['result']}",
        f"- RUNTIME_LOAD_TEST: {'PASS' if load_pass else 'FAIL'}",
        "",
        "## Schema Validation Detail",
        "",
        f"- factory_package.passed: {schema_validation['factory_package']['passed']}",
        f"- runtime_package.passed: {schema_validation['runtime_package']['passed']}",
        "",
        "## Runtime Loader Detail",
        "",
        f"- loader_passed: {load_pass}",
        f"- ar_entity.ar_id: {load_result.get('ar_entity', {}).get('ar_id', '—')}",
        f"- anchor_type: {load_result.get('anchor', {}).get('anchor_type', '—')}",
        f"- ar_runtime_flow_stages: {load_result.get('ar_runtime_flow', {}).get('stage_count', 0)}",
        "",
        "## Final Verdict",
        "",
        f"- READY_FOR_RUNTIME_INTEGRATION: {'YES' if ready else 'NO'}",
        "",
        "## Notes",
        "",
        "- This stage validates package generation and runtime read path only.",
        "- No WeChat AR, device AR, AR SDK, or AR rendering was connected.",
        "- Real photos and real OpenCV anchor from Stage1 feed the factory/runtime packages.",
        "- Publish gate (anchor_score >= 0.65) remains advisory; packages are draft status.",
        "",
    ])


def main() -> int:
    subject = read_json(DATA_DIR / "subject_analysis.json")
    anchor = read_json(DATA_DIR / "anchor.json")
    anchor_quality = read_json(DATA_DIR / "anchor_quality.json")

    factory_package = build_factory_package(subject, anchor, anchor_quality)
    runtime_package = build_runtime_package(factory_package, anchor_quality)

    write_json(FACTORY_PACKAGE_PATH, factory_package)
    write_json(RUNTIME_PACKAGE_PATH, runtime_package)

    factory_validation = validate_factory_package(factory_package)
    runtime_validation = validate_runtime_package(runtime_package)
    schema_validation = build_schema_validation(factory_validation, runtime_validation)
    write_json(SCHEMA_VALIDATION_PATH, schema_validation)

    sys.path.insert(0, str(ROOT / "scripts" / "ar_factory"))
    from runtime_package_loader import load_and_validate_runtime_package

    load_result = load_and_validate_runtime_package(RUNTIME_PACKAGE_PATH)
    report = build_report(True, True, schema_validation, load_result)
    REPORT_PATH.parent.mkdir(parents=True, exist_ok=True)
    REPORT_PATH.write_text(report, encoding="utf-8")

    print(json.dumps({
        "factory_package": rel(FACTORY_PACKAGE_PATH),
        "runtime_package": rel(RUNTIME_PACKAGE_PATH),
        "schema_validation": schema_validation["result"],
        "runtime_load_test": "PASS" if load_result["passed"] else "FAIL",
        "ready_for_runtime_integration": schema_validation["overall_pass"] and load_result["passed"],
    }, ensure_ascii=False, indent=2))

    return 0 if schema_validation["overall_pass"] and load_result["passed"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
