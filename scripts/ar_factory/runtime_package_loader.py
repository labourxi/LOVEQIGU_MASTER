from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Dict, List


def read_runtime_package(path: Path) -> Dict[str, Any]:
    if not path.exists():
        raise FileNotFoundError(f"runtime_package.json not found: {path}")
    return json.loads(path.read_text(encoding="utf-8"))


def parse_ar_entity(runtime_package: Dict[str, Any]) -> Dict[str, Any]:
    entity = runtime_package.get("ar_entity")
    if not isinstance(entity, dict):
        raise ValueError("AR_ENTITY missing or invalid")
    required = [
        "ar_id", "exploration_point_id", "status", "ar_type",
        "reveal_type", "runtime_version", "created_at", "updated_at",
    ]
    missing = [field for field in required if field not in entity]
    if missing:
        raise ValueError(f"AR_ENTITY missing fields: {', '.join(missing)}")
    return entity


def parse_ar_guidance(runtime_package: Dict[str, Any]) -> Dict[str, Any]:
    guidance = runtime_package.get("ar_guidance")
    if not isinstance(guidance, dict):
        raise ValueError("AR_GUIDANCE missing or invalid")
    for subsection in ("standing_guide", "scan_guide", "alignment_overlay"):
        if subsection not in guidance or not isinstance(guidance[subsection], dict):
            raise ValueError(f"AR_GUIDANCE.{subsection} missing or invalid")
    overlay = guidance["alignment_overlay"]
    overlay_required = [
        "overlay_uri", "contour_uri", "alignment_threshold",
        "hint_text", "alignment_success_text",
    ]
    missing = [field for field in overlay_required if field not in overlay]
    if missing:
        raise ValueError(f"AR_GUIDANCE.alignment_overlay missing fields: {', '.join(missing)}")
    return guidance


def parse_ar_anchor(runtime_package: Dict[str, Any]) -> Dict[str, Any]:
    anchor = runtime_package.get("anchor")
    if not isinstance(anchor, dict):
        raise ValueError("AR_ANCHOR missing or invalid")
    if anchor.get("anchor_type") != "image_anchor":
        raise ValueError("AR_ANCHOR.anchor_type must be image_anchor for landmark POC")
    payload = anchor.get("anchor_payload")
    if not isinstance(payload, dict):
        raise ValueError("AR_ANCHOR.anchor_payload missing or invalid")
    required = ["descriptor_uri", "detector", "feature_count", "score"]
    missing = [field for field in required if field not in payload]
    if missing:
        raise ValueError(f"AR_ANCHOR.anchor_payload missing fields: {', '.join(missing)}")
    return anchor


def parse_navigation_binding(runtime_package: Dict[str, Any]) -> Dict[str, Any]:
    binding = runtime_package.get("navigation_binding")
    if not isinstance(binding, dict):
        raise ValueError("NAVIGATION_BINDING missing or invalid")
    required = ["latitude", "longitude", "arrival_radius_m"]
    missing = [field for field in required if binding.get(field) is None]
    if missing:
        raise ValueError(f"NAVIGATION_BINDING missing fields: {', '.join(missing)}")
    return binding


def parse_activity_binding(runtime_package: Dict[str, Any]) -> Dict[str, Any]:
    binding = runtime_package.get("activity_binding")
    if not isinstance(binding, dict):
        raise ValueError("ACTIVITY_BINDING missing or invalid")
    if not binding.get("activity_id"):
        raise ValueError("ACTIVITY_BINDING.activity_id missing")
    return binding


def parse_ar_runtime_flow(runtime_package: Dict[str, Any]) -> Dict[str, Any]:
    flow = runtime_package.get("ar_runtime_flow")
    if not isinstance(flow, dict):
        raise ValueError("AR_RUNTIME_FLOW missing or invalid")
    stages = flow.get("stages")
    if not isinstance(stages, list) or len(stages) < 7:
        raise ValueError("AR_RUNTIME_FLOW.stages must contain 7 stages")
    expected = [
        "navigation", "arrival", "scanning", "anchor_lock",
        "interaction", "reveal", "completion",
    ]
    actual = [stage.get("stage") for stage in stages if isinstance(stage, dict)]
    missing = [name for name in expected if name not in actual]
    if missing:
        raise ValueError(f"AR_RUNTIME_FLOW missing stages: {', '.join(missing)}")
    return flow


def load_and_validate_runtime_package(path: Path) -> Dict[str, Any]:
    errors: List[str] = []
    parsed: Dict[str, Any] = {}

    try:
        runtime_package = read_runtime_package(path)
    except Exception as exc:
        return {
            "passed": False,
            "source": str(path),
            "errors": [str(exc)],
        }

    parsers = {
        "ar_entity": parse_ar_entity,
        "ar_guidance": parse_ar_guidance,
        "anchor": parse_ar_anchor,
        "navigation_binding": parse_navigation_binding,
        "activity_binding": parse_activity_binding,
        "ar_runtime_flow": parse_ar_runtime_flow,
    }

    for name, parser in parsers.items():
        try:
            parsed[name] = parser(runtime_package)
        except Exception as exc:
            errors.append(f"{name}: {exc}")

    if "ar_runtime_flow" in parsed:
        parsed["ar_runtime_flow"] = {
            "version": parsed["ar_runtime_flow"].get("version"),
            "stage_count": len(parsed["ar_runtime_flow"].get("stages", [])),
            "stages": [s.get("stage") for s in parsed["ar_runtime_flow"].get("stages", [])],
        }

    return {
        "passed": not errors,
        "source": str(path),
        "schema_id": runtime_package.get("schema_id"),
        "errors": errors,
        **parsed,
    }


def main() -> int:
    import sys

    root = Path(__file__).resolve().parents[2]
    default_path = root / "data" / "ar_factory" / "poc" / "landmark_tree_v1" / "runtime_package.json"
    target = Path(sys.argv[1]) if len(sys.argv) > 1 else default_path
    result = load_and_validate_runtime_package(target)
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0 if result["passed"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
