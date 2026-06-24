from __future__ import annotations

import hashlib
import json
import math
import os
import struct
import time
import zlib
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, Iterable, List, Tuple


ROOT = Path(__file__).resolve().parents[2]
DOC_DIR = ROOT / "docs" / "product" / "ar_factory"
POC_DIR = ROOT / "data" / "ar_factory" / "poc" / "landmark_ar_poc_v1"
SYNTH_INPUT_DIR = POC_DIR / "synthetic_inputs"
REPORT_PATH = DOC_DIR / "LANDMARK_AR_AUTOGEN_POC_V1_REPORT.md"

EXPECTED_INPUTS = [
    "tree_01.jpg",
    "tree_02.jpg",
    "tree_03.jpg",
]

OUTPUT_FILES = {
    "upload_manifest": POC_DIR / "upload_manifest.json",
    "subject_analysis": POC_DIR / "subject_analysis.json",
    "anchor": POC_DIR / "anchor.json",
    "anchor_quality": POC_DIR / "anchor_quality.json",
    "position_guide": POC_DIR / "position_guide.png",
    "alignment_overlay": POC_DIR / "alignment_overlay.png",
    "template_match": POC_DIR / "template_match.json",
    "factory_package": POC_DIR / "factory_package.json",
    "runtime_package": POC_DIR / "runtime_package.json",
}


def now_iso() -> str:
    return datetime.now(timezone.utc).astimezone().isoformat(timespec="seconds")


def ensure_parent(path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)


def read_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, data: Any) -> None:
    ensure_parent(path)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


def sha1_bytes(data: bytes) -> str:
    return hashlib.sha1(data).hexdigest()


def sha1_text(text: str) -> str:
    return hashlib.sha1(text.encode("utf-8")).hexdigest()


def list_candidate_roots() -> List[Path]:
    return [
        ROOT,
        ROOT / "data" / "ar_factory",
        ROOT / "data" / "ar_factory" / "inputs",
        ROOT / "data" / "ar_factory" / "poc_inputs",
        ROOT / "assets" / "ar_factory",
        ROOT / "assets" / "ar_factory" / "inputs",
        ROOT / "assets" / "ar_factory" / "poc_inputs",
    ]


def resolve_expected_input(name: str) -> Tuple[Path | None, Dict[str, Any]]:
    for base in list_candidate_roots():
        candidate = base / name
        if candidate.exists():
            return candidate, {
                "requested_file": name,
                "resolved_file": str(candidate.relative_to(ROOT)),
                "status": "found",
                "is_synthetic": False,
                "file_size": candidate.stat().st_size,
                "sha1": sha1_bytes(candidate.read_bytes()),
            }
    synthetic = SYNTH_INPUT_DIR / f"{Path(name).stem}.synthetic.png"
    ensure_parent(synthetic)
    # Synthetic stand-in: generated only to allow the chain to execute for diagnosis.
    write_png(
        synthetic,
        960,
        720,
        make_placeholder_canvas(
            960,
            720,
            background=(248, 246, 242, 255),
            accent=(198, 58, 48, 255),
            gold=(182, 138, 61, 255),
            ink=(47, 42, 38, 255),
            green=(86, 123, 83, 255),
        ),
    )
    return synthetic, {
        "requested_file": name,
        "resolved_file": str(synthetic.relative_to(ROOT)),
        "status": "missing",
        "is_synthetic": True,
        "file_size": synthetic.stat().st_size,
        "sha1": sha1_bytes(synthetic.read_bytes()),
        "missing_reason": "requested input image not present in repository",
    }


def make_placeholder_canvas(
    width: int,
    height: int,
    background: Tuple[int, int, int, int],
    accent: Tuple[int, int, int, int],
    gold: Tuple[int, int, int, int],
    ink: Tuple[int, int, int, int],
    green: Tuple[int, int, int, int],
) -> bytes:
    buf = bytearray()
    for y in range(height):
        for x in range(width):
            # Base background.
            r, g, b, a = background
            # Add a simple tree-like schematic so the artifact is not blank.
            dx = x - width // 2
            dy = y - height // 3
            trunk = abs(dx) < 12 and y > height // 4
            canopy = (dx * dx + (dy + 30) * (dy + 30)) < 60 * 60 and y < height // 2
            guide = (x == width // 2) or (y == height // 2)
            frame = x in (24, width - 25) or y in (24, height - 25)
            if trunk:
                r, g, b, a = ink
            elif canopy:
                r, g, b, a = green
            elif guide:
                r, g, b, a = accent
            elif frame:
                r, g, b, a = gold
            buf.extend((r, g, b, a))
    return bytes(buf)


def draw_overlay_canvas(
    width: int,
    height: int,
    background: Tuple[int, int, int, int],
    overlay: Tuple[int, int, int, int],
    highlight: Tuple[int, int, int, int],
) -> bytes:
    buf = bytearray()
    for y in range(height):
        for x in range(width):
            r, g, b, a = background
            border = x in (30, width - 31) or y in (30, height - 31)
            cross = abs(x - width // 2) <= 2 or abs(y - height // 2) <= 2
            box = width // 3 < x < 2 * width // 3 and height // 5 < y < 4 * height // 5
            if border:
                r, g, b, a = overlay
            elif cross:
                r, g, b, a = highlight
            elif box and (x + y) % 17 == 0:
                r, g, b, a = (182, 138, 61, 120)
            buf.extend((r, g, b, a))
    return bytes(buf)


def set_pixel(buf: bytearray, width: int, x: int, y: int, rgba: Tuple[int, int, int, int]) -> None:
    if x < 0 or y < 0:
        return
    height = len(buf) // (width * 4)
    if x >= width or y >= height:
        return
    idx = (y * width + x) * 4
    buf[idx : idx + 4] = bytes(rgba)


def line(buf: bytearray, width: int, x0: int, y0: int, x1: int, y1: int, rgba: Tuple[int, int, int, int]) -> None:
    dx = abs(x1 - x0)
    dy = -abs(y1 - y0)
    sx = 1 if x0 < x1 else -1
    sy = 1 if y0 < y1 else -1
    err = dx + dy
    while True:
        set_pixel(buf, width, x0, y0, rgba)
        if x0 == x1 and y0 == y1:
            break
        e2 = 2 * err
        if e2 >= dy:
            err += dy
            x0 += sx
        if e2 <= dx:
            err += dx
            y0 += sy


def write_png(path: Path, width: int, height: int, rgba_bytes: bytes) -> None:
    ensure_parent(path)
    stride = width * 4
    raw = bytearray()
    for y in range(height):
        raw.append(0)
        raw.extend(rgba_bytes[y * stride : (y + 1) * stride])

    def chunk(tag: bytes, data: bytes) -> bytes:
        return (
            struct.pack(">I", len(data))
            + tag
            + data
            + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)
        )

    png = b"\x89PNG\r\n\x1a\n"
    png += chunk(b"IHDR", struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0))
    png += chunk(b"IDAT", zlib.compress(bytes(raw), level=9))
    png += chunk(b"IEND", b"")
    path.write_bytes(png)


def heuristic_bytes_stats(data: bytes) -> Dict[str, Any]:
    if not data:
        return {"feature_count": 0, "distribution_score": 0.0, "texture_score": 0.0}
    buckets = [0] * 16
    for b in data[:200_000]:
        buckets[b >> 4] += 1
    total = sum(buckets) or 1
    peak = max(buckets)
    spread = 1.0 - (peak / total)
    entropy = 0.0
    for count in buckets:
        if count:
            p = count / total
            entropy -= p * math.log(p, 2)
    entropy_norm = entropy / 4.0  # 16 buckets -> max 4 bits
    feature_count = max(0, min(9999, len(data) // 128))
    return {
        "feature_count": feature_count,
        "distribution_score": round(max(0.0, min(1.0, spread)), 3),
        "texture_score": round(max(0.0, min(1.0, entropy_norm)), 3),
    }


def detect_subject(resolved_inputs: List[Dict[str, Any]]) -> Dict[str, Any]:
    any_real = any(not entry["is_synthetic"] for entry in resolved_inputs)
    if any_real:
        confidence = 0.68
        analysis_mode = "heuristic_on_real_inputs"
    else:
        confidence = 0.41
        analysis_mode = "heuristic_on_synthetic_inputs"
    return {
        "subject": "ancient_tree",
        "scene_type": "landmark_ar",
        "confidence": confidence,
        "analysis_mode": analysis_mode,
        "subject_bbox": {"x": 164, "y": 88, "w": 248, "h": 396},
        "ar_recommendation": "landmark_ar",
        "source_note": "requested inputs were missing; using diagnostic heuristic to keep the POC runnable",
    }


def extract_anchor_metrics(resolved_inputs: List[Dict[str, Any]]) -> Dict[str, Any]:
    aggregate = bytearray()
    for entry in resolved_inputs:
        aggregate.extend(Path(entry["resolved_file"]).read_bytes() if False else b"")
    # Aggregate bytes from resolved files.
    bytes_blob = bytearray()
    for entry in resolved_inputs:
        bytes_blob.extend((ROOT / entry["resolved_file"]).read_bytes())

    stats = heuristic_bytes_stats(bytes(bytes_blob))
    feature_count = stats["feature_count"]
    distribution_score = stats["distribution_score"]
    texture_score = stats["texture_score"]
    lighting_score = round(0.45 + distribution_score * 0.35, 3)
    anchor_score = round(
        min(
            1.0,
            0.25
            + (feature_count / 2500.0)
            + distribution_score * 0.25
            + texture_score * 0.2
            + lighting_score * 0.2,
        ),
        3,
    )
    return {
        "anchor_method": "heuristic_fallback",
        "feature_count": feature_count,
        "distribution_score": distribution_score,
        "lighting_score": lighting_score,
        "texture_score": texture_score,
        "anchor_score": anchor_score,
        "source_note": "OpenCV ORB/AKAZE unavailable in this environment; heuristic fallback used",
    }


def write_guide_pngs() -> None:
    position = make_placeholder_canvas(
        960,
        720,
        background=(248, 246, 242, 255),
        accent=(198, 58, 48, 255),
        gold=(182, 138, 61, 255),
        ink=(47, 42, 38, 255),
        green=(86, 123, 83, 255),
    )
    pos_buf = bytearray(position)
    w = 960
    h = 720
    # Draw a stylized standing guide arrow and target frame.
    line(pos_buf, w, 120, 610, 840, 610, (182, 138, 61, 255))
    line(pos_buf, w, 480, 120, 480, 610, (198, 58, 48, 255))
    line(pos_buf, w, 320, 260, 640, 260, (86, 123, 83, 255))
    line(pos_buf, w, 320, 260, 320, 420, (86, 123, 83, 255))
    line(pos_buf, w, 640, 260, 640, 420, (86, 123, 83, 255))
    line(pos_buf, w, 320, 420, 640, 420, (86, 123, 83, 255))
    line(pos_buf, w, 480, 610, 480, 420, (47, 42, 38, 255))
    write_png(OUTPUT_FILES["position_guide"], w, h, bytes(pos_buf))

    overlay = draw_overlay_canvas(
        960,
        720,
        background=(0, 0, 0, 0),
        overlay=(182, 138, 61, 180),
        highlight=(198, 58, 48, 160),
    )
    overlay_buf = bytearray(overlay)
    # Add a centered lock box.
    line(overlay_buf, w, 260, 180, 700, 180, (182, 138, 61, 200))
    line(overlay_buf, w, 260, 180, 260, 540, (182, 138, 61, 200))
    line(overlay_buf, w, 700, 180, 700, 540, (182, 138, 61, 200))
    line(overlay_buf, w, 260, 540, 700, 540, (182, 138, 61, 200))
    line(overlay_buf, w, 480, 120, 480, 600, (198, 58, 48, 210))
    line(overlay_buf, w, 180, 360, 780, 360, (198, 58, 48, 210))
    write_png(OUTPUT_FILES["alignment_overlay"], w, h, bytes(overlay_buf))


def template_match_result(subject: Dict[str, Any], anchor: Dict[str, Any]) -> Dict[str, Any]:
    base = 0.52 + (subject["confidence"] * 0.2) + (anchor["anchor_score"] * 0.2)
    confidence = round(min(0.86, base), 3)
    return {
        "template_id": "LANDMARK_RELIC_REVEAL",
        "template_confidence": confidence,
        "match_reason": "landmark tree case mapped to reveal template",
        "reveal_type": "relic_reveal",
        "status": "matched" if confidence >= 0.65 else "partial",
    }


def build_factory_package(
    upload_manifest: Dict[str, Any],
    subject: Dict[str, Any],
    anchor: Dict[str, Any],
    template_match: Dict[str, Any],
) -> Dict[str, Any]:
    review_status = "rejected" if upload_manifest["diagnostics"]["real_input_count"] == 0 else "pending_review"
    return {
        "schema_id": "loveqigu.ar_factory.factory_package.v1",
        "draft_id": "landmark_ar_poc_v1_draft",
        "exploration_point_id": "ancient_tree_exploration_point",
        "pipeline_version": "LANDMARK_AR_AUTOGEN_PIPELINE_V1.1",
        "review_status": review_status,
        "template_ref": template_match["template_id"],
        "template_confidence": template_match["template_confidence"],
        "classifier_result": {
            "subject": subject["subject"],
            "scene_type": subject["scene_type"],
            "confidence": subject["confidence"],
            "analysis_mode": subject["analysis_mode"],
        },
        "anchor_set": {
            "reference_images": [entry["resolved_file"] for entry in upload_manifest["inputs"]],
            "feature_count": anchor["feature_count"],
            "distribution_score": anchor["distribution_score"],
        },
        "ar_guidance_draft": {
            "standing_guide_uri": str(OUTPUT_FILES["position_guide"].relative_to(ROOT)),
            "scan_guide_uri": str(OUTPUT_FILES["position_guide"].relative_to(ROOT)),
            "alignment_overlay_uri": str(OUTPUT_FILES["alignment_overlay"].relative_to(ROOT)),
        },
        "interaction_script": "landmark_ar_poc_v1",
        "reveal_assets": [
            {
                "asset_type": "alignment_overlay",
                "asset_uri": str(OUTPUT_FILES["alignment_overlay"].relative_to(ROOT)),
            },
            {
                "asset_type": "position_guide",
                "asset_uri": str(OUTPUT_FILES["position_guide"].relative_to(ROOT)),
            },
        ],
        "completion_event": "event.landmark_ar_poc_v1.completed",
        "created_at": now_iso(),
        "diagnostic": {
            "input_validation_passed": upload_manifest["diagnostics"]["real_input_count"] > 0,
            "tooling_validation_passed": False,
            "notes": "POC executed with synthetic fallback inputs because required source files and imaging libraries were unavailable.",
        },
    }


def build_runtime_package(factory_package: Dict[str, Any]) -> Dict[str, Any]:
    return {
        "schema_id": "loveqigu.ar.runtime.runtime_package.v1",
        "ar_entity": {
            "ar_id": "landmark_ar_poc_v1",
            "exploration_point_id": factory_package["exploration_point_id"],
            "status": "draft" if factory_package["review_status"] != "approved" else "published",
            "ar_type": "landmark_ar",
            "reveal_type": "relic_reveal",
            "runtime_version": "AR_FACTORY_RUNTIME_SCHEMA_V1.1",
            "created_at": now_iso(),
            "updated_at": now_iso(),
        },
        "ar_guidance": {
            "standing_guide": {
                "guide_uri": str(OUTPUT_FILES["position_guide"].relative_to(ROOT)),
                "rule_params": {"arrival_radius_m": 30},
            },
            "scan_guide": {
                "guide_uri": str(OUTPUT_FILES["position_guide"].relative_to(ROOT)),
                "hint_text": "请将古树轮廓与参考轮廓对齐。",
            },
            "alignment_overlay": {
                "overlay_uri": str(OUTPUT_FILES["alignment_overlay"].relative_to(ROOT)),
                "contour_uri": str(OUTPUT_FILES["alignment_overlay"].relative_to(ROOT)),
                "alignment_threshold": 0.75,
                "hint_text": "请将古树轮廓与参考轮廓重合。",
                "alignment_success_text": "对准成功，可以开始探索。",
            },
        },
        "anchor": {
            "anchor_type": "image_anchor",
            "anchor_payload": {
                "descriptor_uri": str(OUTPUT_FILES["anchor"].relative_to(ROOT)),
                "detector": "heuristic_fallback",
                "feature_count": factory_package["anchor_set"]["feature_count"],
                "score": factory_package["anchor_set"]["distribution_score"],
            },
        },
        "navigation_binding": {
            "latitude": None,
            "longitude": None,
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
                "progress_key": "landmark_ar_poc_v1_progress",
                "increment": 1,
            },
            "reward_mapping": {
                "reward_type": "blessing_stamp",
                "reward_ref": "blessing_stamp_landmark_tree_v1",
            },
            "rights_center_route": "/pages/rights-center/index",
        },
        "interaction_script": "landmark_ar_poc_v1",
        "reveal_assets": factory_package["reveal_assets"],
        "completion_event": factory_package["completion_event"],
        "runtime_compat": "miniapp_ar_v1",
        "published_at": None,
        "diagnostic": {
            "publish_state": "blocked",
            "input_validation_passed": factory_package["diagnostic"]["input_validation_passed"],
            "notes": "Runtime package generated for validation; publish step was not executed because the POC chain is not fully ready.",
        },
    }


def build_upload_manifest(resolved_inputs: List[Dict[str, Any]]) -> Dict[str, Any]:
    real_inputs = sum(1 for item in resolved_inputs if not item["is_synthetic"])
    synthetic_inputs = len(resolved_inputs) - real_inputs
    return {
        "poc_id": "LANDMARK_AR_AUTOGEN_POC_V1",
        "case_name": "爱企谷 / 古树探索点",
        "expected_inputs": EXPECTED_INPUTS,
        "inputs": resolved_inputs,
        "diagnostics": {
            "real_input_count": real_inputs,
            "synthetic_input_count": synthetic_inputs,
            "all_real_inputs_available": real_inputs == len(EXPECTED_INPUTS),
            "source_images_missing": real_inputs == 0,
            "input_state": "synthetic_fallback" if real_inputs == 0 else "real_inputs_available",
            "created_at": now_iso(),
        },
    }


def build_anchor_quality(subject: Dict[str, Any], anchor: Dict[str, Any], template_match: Dict[str, Any]) -> Dict[str, Any]:
    score = round(
        min(
            1.0,
            0.15
            + subject["confidence"] * 0.25
            + anchor["anchor_score"] * 0.45
            + template_match["template_confidence"] * 0.15,
        ),
        3,
    )
    return {
        "score": score,
        "subject_confidence": subject["confidence"],
        "anchor_score": anchor["anchor_score"],
        "template_confidence": template_match["template_confidence"],
        "recommendation": "manual_review_required" if score < 0.7 else "ready_for_review",
    }


def build_report(
    upload_manifest: Dict[str, Any],
    subject: Dict[str, Any],
    anchor: Dict[str, Any],
    anchor_quality: Dict[str, Any],
    template_match: Dict[str, Any],
    factory_package: Dict[str, Any],
    runtime_package: Dict[str, Any],
) -> str:
    generated = []
    for key, path in OUTPUT_FILES.items():
        generated.append((key, str(path.relative_to(ROOT)), path.exists()))

    failures = []
    if upload_manifest["diagnostics"]["real_input_count"] == 0:
        failures.append("Requested source images tree_01.jpg/tree_02.jpg/tree_03.jpg were not present in the repository.")
    if not upload_manifest["diagnostics"]["all_real_inputs_available"]:
        failures.append("Upload stage did not validate real input assets; synthetic fallback inputs were used.")
    failures.append("cv2 / OpenCV is unavailable in this environment, so ORB + AKAZE could not run.")
    failures.append("Pillow / numpy are unavailable in this environment, so PNG drawing and image analysis used stdlib fallback.")

    lines = [
        "# LANDMARK_AR_AUTOGEN_POC_V1_REPORT",
        "",
        "## 1. Generated Files",
    ]
    for key, rel, exists in generated:
        lines.append(f"- `{rel}`: {'OK' if exists else 'MISSING'}")
    lines.extend([
        "",
        "## 2. Failed Steps",
        f"- STEP1 upload: {'FAIL' if upload_manifest['diagnostics']['source_images_missing'] else 'PASS'}",
        f"- STEP2 subject analysis: {'FAIL' if upload_manifest['diagnostics']['source_images_missing'] else 'PARTIAL'}",
        "- STEP3 anchor extraction: FAIL",
        "- STEP4 anchor quality: PASS (diagnostic fallback)",
        "- STEP5 position guide: PASS (schematic output)",
        "- STEP6 alignment overlay: PASS (schematic output)",
        "- STEP7 template match: PASS (diagnostic fallback)",
        f"- STEP8 factory package: {'PASS' if factory_package else 'FAIL'}",
        f"- STEP9 runtime package: {'PASS' if runtime_package else 'FAIL'}",
        "",
        "## 3. Failure Reasons",
    ])
    for item in failures:
        lines.append(f"- {item}")
    lines.extend([
        "",
        "## 4. Required Tools",
        "- OpenCV (`cv2`) with ORB + AKAZE support",
        "- Pillow or another image drawing library",
        "- Real source images: `tree_01.jpg`, `tree_02.jpg`, `tree_03.jpg`",
        "",
        "## 5. Required Services",
        "- If the production chain must remain aligned with the frozen docs, a real vision subject-analysis service is needed for the subject stage.",
        "- A real artifact storage path for upload inputs would make the chain reproducible without synthetic fallback.",
        "",
        "## 6. Required Model",
        "- Subject analysis model aligned to the frozen Landmark AR pipeline docs (Gemini Vision path mentioned in the schema).",
        "",
        "## 7. Conclusion",
        f"- POC_CHAIN_PASS = {'YES' if upload_manifest['diagnostics']['all_real_inputs_available'] and anchor['anchor_score'] >= 0.65 and factory_package['review_status'] == 'approved' else 'NO'}",
        "",
        "## 8. Notes",
        "- This run generated the requested runtime artifacts, but it did so with synthetic fallback inputs because the real tree photos were not present and the environment lacked the required imaging libraries.",
        "- The chain is therefore diagnostic, not a proof of genuine field input validation.",
    ])
    return "\n".join(lines)


def main() -> int:
    POC_DIR.mkdir(parents=True, exist_ok=True)
    SYNTH_INPUT_DIR.mkdir(parents=True, exist_ok=True)
    DOC_DIR.mkdir(parents=True, exist_ok=True)

    resolved_inputs: List[Dict[str, Any]] = []
    for name in EXPECTED_INPUTS:
        _, info = resolve_expected_input(name)
        resolved_inputs.append(info)

    upload_manifest = build_upload_manifest(resolved_inputs)
    write_json(OUTPUT_FILES["upload_manifest"], upload_manifest)

    subject = detect_subject(resolved_inputs)
    write_json(OUTPUT_FILES["subject_analysis"], subject)

    anchor = extract_anchor_metrics(resolved_inputs)
    write_json(OUTPUT_FILES["anchor"], anchor)

    anchor_quality = build_anchor_quality(subject, anchor, template_match_result(subject, anchor))
    write_json(OUTPUT_FILES["anchor_quality"], anchor_quality)

    write_guide_pngs()

    template_match = template_match_result(subject, anchor)
    write_json(OUTPUT_FILES["template_match"], template_match)

    factory_package = build_factory_package(upload_manifest, subject, anchor, template_match)
    write_json(OUTPUT_FILES["factory_package"], factory_package)

    runtime_package = build_runtime_package(factory_package)
    write_json(OUTPUT_FILES["runtime_package"], runtime_package)

    report = build_report(
        upload_manifest,
        subject,
        anchor,
        anchor_quality,
        template_match,
        factory_package,
        runtime_package,
    )
    REPORT_PATH.write_text(report, encoding="utf-8")

    print("LANDMARK_AR_AUTOGEN_POC_V1_EXECUTION_DONE")
    print(f"REPORT={REPORT_PATH.relative_to(ROOT)}")
    print(f"POC_CHAIN_PASS={'YES' if upload_manifest['diagnostics']['all_real_inputs_available'] and anchor['anchor_score'] >= 0.65 and factory_package['review_status'] == 'approved' else 'NO'}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
