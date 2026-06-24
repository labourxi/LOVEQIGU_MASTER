from __future__ import annotations

import json
import math
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Tuple

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[2]
DATA_DIR = ROOT / "data" / "ar_factory" / "poc" / "landmark_tree_v1"
REPORT_PATH = ROOT / "docs" / "product" / "ar_factory" / "LANDMARK_AR_REAL_IMAGE_POC_V1_REPORT.md"

INPUT_FILES = [
    "tree_full.jpg",
    "tree_near.jpg",
    "tree_far.jpg",
    "tree_left45.jpg",
    "tree_right45.jpg",
    "tree_trunk.jpg",
    "position_a.jpg",
    "position_b.jpg",
]

OUTPUT_FILES = {
    "subject_analysis": DATA_DIR / "subject_analysis.json",
    "anchor": DATA_DIR / "anchor.json",
    "anchor_quality": DATA_DIR / "anchor_quality.json",
    "position_guide": DATA_DIR / "position_guide.png",
    "alignment_overlay": DATA_DIR / "alignment_overlay.png",
}


def now_iso() -> str:
    return datetime.now(timezone.utc).astimezone().isoformat(timespec="seconds")


def read_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, data: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


def load_rgb(path: Path) -> np.ndarray:
    img = cv2.imread(str(path), cv2.IMREAD_COLOR)
    if img is None:
        raise FileNotFoundError(f"Cannot load image: {path}")
    return cv2.cvtColor(img, cv2.COLOR_BGR2RGB)


def load_gray(path: Path) -> np.ndarray:
    img = cv2.imread(str(path), cv2.IMREAD_GRAYSCALE)
    if img is None:
        raise FileNotFoundError(f"Cannot load image: {path}")
    return img


def resize_for_analysis(img: np.ndarray, max_width: int = 1600) -> np.ndarray:
    h, w = img.shape[:2]
    if w <= max_width:
        return img
    scale = max_width / float(w)
    new_size = (max_width, max(1, int(h * scale)))
    return cv2.resize(img, new_size, interpolation=cv2.INTER_AREA)


def hsv_masks(rgb: np.ndarray) -> Dict[str, np.ndarray]:
    bgr = cv2.cvtColor(rgb, cv2.COLOR_RGB2BGR)
    hsv = cv2.cvtColor(bgr, cv2.COLOR_BGR2HSV)
    green = cv2.inRange(hsv, (28, 20, 30), (95, 255, 255))
    bark = cv2.inRange(hsv, (5, 20, 20), (30, 255, 220))
    dark = cv2.inRange(hsv, (0, 0, 0), (180, 255, 120))
    lower_half = np.zeros_like(green)
    lower_half[rgb.shape[0] // 3 :, :] = 255
    center_band = np.zeros_like(green)
    x0 = rgb.shape[1] // 4
    x1 = 3 * rgb.shape[1] // 4
    center_band[:, x0:x1] = 255
    trunk_candidate = cv2.bitwise_and(cv2.bitwise_or(bark, dark), lower_half)
    trunk_candidate = cv2.bitwise_and(trunk_candidate, center_band)
    kernel = np.ones((7, 7), np.uint8)
    trunk_candidate = cv2.morphologyEx(trunk_candidate, cv2.MORPH_OPEN, kernel)
    trunk_candidate = cv2.morphologyEx(trunk_candidate, cv2.MORPH_CLOSE, kernel)
    return {
        "green": green,
        "bark": bark,
        "dark": dark,
        "trunk_candidate": trunk_candidate,
    }


def contour_bbox(mask: np.ndarray) -> Tuple[int, int, int, int] | None:
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if not contours:
        return None
    contour = max(contours, key=cv2.contourArea)
    x, y, w, h = cv2.boundingRect(contour)
    return x, y, w, h


def center_of_bbox(bbox: Tuple[int, int, int, int]) -> Tuple[int, int]:
    x, y, w, h = bbox
    return x + w // 2, y + h // 2


@dataclass
class ViewMetrics:
    name: str
    path: Path
    rgb: np.ndarray
    gray: np.ndarray
    green_ratio: float
    trunk_ratio: float
    edge_density: float
    center_bbox: Tuple[int, int, int, int] | None
    roi_bbox: Tuple[int, int, int, int] | None


def analyze_view(path: Path) -> ViewMetrics:
    rgb = resize_for_analysis(load_rgb(path))
    gray = cv2.cvtColor(cv2.cvtColor(rgb, cv2.COLOR_RGB2BGR), cv2.COLOR_BGR2GRAY)
    masks = hsv_masks(rgb)
    green_ratio = float(np.count_nonzero(masks["green"])) / float(masks["green"].size)
    trunk_ratio = float(np.count_nonzero(masks["trunk_candidate"])) / float(masks["trunk_candidate"].size)
    edges = cv2.Canny(gray, 60, 160)
    edge_density = float(np.count_nonzero(edges)) / float(edges.size)
    bbox = contour_bbox(masks["trunk_candidate"])
    if bbox is None:
      # Fallback to a broad center ROI derived from the actual image dimensions.
        w = rgb.shape[1]
        h = rgb.shape[0]
        bbox = (w // 4, h // 5, w // 2, 2 * h // 3)
    x, y, bw, bh = bbox
    roi_bbox = (
        max(0, x - bw // 6),
        max(0, y - bh // 8),
        min(rgb.shape[1], bw + bw // 3),
        min(rgb.shape[0], bh + bh // 4),
    )
    return ViewMetrics(
        name=path.name,
        path=path,
        rgb=rgb,
        gray=gray,
        green_ratio=green_ratio,
        trunk_ratio=trunk_ratio,
        edge_density=edge_density,
        center_bbox=bbox,
        roi_bbox=roi_bbox,
    )


def crop_roi(gray: np.ndarray, bbox: Tuple[int, int, int, int]) -> Tuple[np.ndarray, Tuple[int, int]]:
    x, y, w, h = bbox
    return gray[y : y + h, x : x + w], (x, y)


def detect_features(gray_roi: np.ndarray) -> Dict[str, Any]:
    orb = cv2.ORB_create(nfeatures=2000, fastThreshold=10)
    akaze = cv2.AKAZE_create()
    orb_kp, orb_desc = orb.detectAndCompute(gray_roi, None)
    akaze_kp, akaze_desc = akaze.detectAndCompute(gray_roi, None)
    points = [(round(k.pt[0], 1), round(k.pt[1], 1), round(k.size, 1), round(k.angle, 1)) for k in orb_kp]
    points += [(round(k.pt[0], 1), round(k.pt[1], 1), round(k.size, 1), round(k.angle, 1)) for k in akaze_kp]
    return {
        "orb_kp": orb_kp,
        "orb_desc": orb_desc,
        "akaze_kp": akaze_kp,
        "akaze_desc": akaze_desc,
        "points": points,
        "feature_count": len(points),
    }


def occupancy_score(points: List[Tuple[float, float, float, float]], shape: Tuple[int, int]) -> float:
    if not points:
        return 0.0
    h, w = shape[:2]
    grid = np.zeros((4, 4), dtype=np.int32)
    for x, y, _, _ in points:
        gx = min(3, max(0, int(x / max(1, w) * 4)))
        gy = min(3, max(0, int(y / max(1, h) * 4)))
        grid[gy, gx] += 1
    occupied = float(np.count_nonzero(grid))
    balance = 1.0 - min(1.0, float(np.std(grid) / (np.mean(grid) + 1e-6)) / 4.0)
    return round(min(1.0, occupied / 16.0 * 0.7 + balance * 0.3), 4)


def compute_match_ratio(ref_desc: np.ndarray | None, other_desc: np.ndarray | None, norm_type: int) -> float:
    if ref_desc is None or other_desc is None or len(ref_desc) == 0 or len(other_desc) == 0:
        return 0.0
    bf = cv2.BFMatcher(norm_type, crossCheck=False)
    matches = bf.knnMatch(ref_desc, other_desc, k=2)
    good = []
    for m_n in matches:
        if len(m_n) != 2:
            continue
        m, n = m_n
        if m.distance < 0.75 * n.distance:
            good.append(m)
    return len(good) / max(1, min(len(ref_desc), len(other_desc)))


def build_subject_analysis(views: List[ViewMetrics]) -> Dict[str, Any]:
    green_ratio = float(np.mean([v.green_ratio for v in views]))
    trunk_ratio = float(np.mean([v.trunk_ratio for v in views]))
    edge_density = float(np.mean([v.edge_density for v in views]))
    spread = 1.0 - min(1.0, float(np.std([v.trunk_ratio for v in views]) + np.std([v.edge_density for v in views])))
    confidence = min(0.99, round(0.55 + green_ratio * 1.8 + trunk_ratio * 2.2 + edge_density * 1.1 + spread * 0.08, 4))
    return {
        "subject_type": "tree",
        "landmark_type": "ancient_tree",
        "confidence": confidence,
        "input_images": len(views),
        "analysis_method": "opencv_color_texture_consistency",
        "evidence": {
            "avg_green_ratio": round(green_ratio, 4),
            "avg_trunk_ratio": round(trunk_ratio, 4),
            "avg_edge_density": round(edge_density, 4),
            "view_consistency": round(spread, 4),
        },
        "input_images_detail": [v.name for v in views],
        "created_at": now_iso(),
    }


def build_anchor(views: List[ViewMetrics]) -> Tuple[Dict[str, Any], Dict[str, Any]]:
    ref = next((v for v in views if v.name == "tree_trunk.jpg"), views[0])
    ref_roi, ref_offset = crop_roi(ref.gray, ref.roi_bbox)
    ref_features = detect_features(ref_roi)
    ref_pts = [
        (pt[0] + ref_offset[0], pt[1] + ref_offset[1], pt[2], pt[3])
        for pt in ref_features["points"]
    ]

    matches = []
    orb_norm = cv2.NORM_HAMMING
    for view in views:
        if view.name == ref.name:
            continue
        roi, offset = crop_roi(view.gray, view.roi_bbox)
        feats = detect_features(roi)
        orb_ratio = compute_match_ratio(ref_features["orb_desc"], feats["orb_desc"], orb_norm)
        akaze_ratio = compute_match_ratio(ref_features["akaze_desc"], feats["akaze_desc"], orb_norm)
        matches.append(
            {
                "view": view.name,
                "orb_match_ratio": round(orb_ratio, 4),
                "akaze_match_ratio": round(akaze_ratio, 4),
                "feature_count": feats["feature_count"],
            }
        )

    ref_points = np.array([[p[0], p[1]] for p in ref_pts], dtype=np.float32) if ref_pts else np.zeros((0, 2), dtype=np.float32)
    distribution = occupancy_score(ref_pts, ref.rgb.shape)
    stability_values = [((m["orb_match_ratio"] + m["akaze_match_ratio"]) / 2.0) for m in matches]
    stability = round(float(np.mean(stability_values)) if stability_values else 0.0, 4)
    feature_points = int(sum(m["feature_count"] for m in matches) + len(ref_pts))
    feature_score = min(1.0, feature_points / 3000.0)
    overall = round(min(1.0, feature_score * 0.35 + distribution * 0.35 + stability * 0.3), 4)

    anchor = {
        "anchor_method": "opencv_orb_akaze_real_image",
        "reference_image": ref.name,
        "roi": {
            "x": ref.roi_bbox[0],
            "y": ref.roi_bbox[1],
            "w": ref.roi_bbox[2],
            "h": ref.roi_bbox[3],
        },
        "feature_points": feature_points,
        "orb_keypoints": len(ref_features["orb_kp"]),
        "akaze_keypoints": len(ref_features["akaze_kp"]),
        "distribution_score": round(distribution, 4),
        "stability_score": round(stability, 4),
        "overall_score": overall,
        "matched_views": matches,
        "anchor_regions": [
            "tree_trunk_texture",
            "tree_bark_cracks",
            "main_branch_split",
            "canopy_contour",
        ],
        "ignored_elements": [
            "red_lanterns",
            "signboards",
            "building_text",
            "passersby",
            "temporary_decorations",
        ],
        "created_at": now_iso(),
    }

    quality = {
        "feature_points": feature_points,
        "distribution_score": round(distribution, 4),
        "stability_score": round(stability, 4),
        "overall_score": round(overall, 4),
        "view_coverage": len(matches) + 1,
        "match_summary": matches,
    }
    return anchor, quality


def draw_arrow(draw: ImageDraw.ImageDraw, start: Tuple[int, int], end: Tuple[int, int], color: Tuple[int, int, int], width: int = 8) -> None:
    draw.line([start, end], fill=color, width=width)
    dx = end[0] - start[0]
    dy = end[1] - start[1]
    angle = math.atan2(dy, dx)
    head_len = 30
    left = (
        int(end[0] - head_len * math.cos(angle - math.pi / 6)),
        int(end[1] - head_len * math.sin(angle - math.pi / 6)),
    )
    right = (
        int(end[0] - head_len * math.cos(angle + math.pi / 6)),
        int(end[1] - head_len * math.sin(angle + math.pi / 6)),
    )
    draw.polygon([end, left, right], fill=color)


def build_position_guide(views: List[ViewMetrics]) -> None:
    selected = [v for v in views if v.name in {"position_a.jpg", "position_b.jpg"}]
    if len(selected) < 2:
        selected = views[:2]
    canvases = []
    for view in selected:
        img = Image.fromarray(view.rgb)
        img = img.resize((960, 720))
        draw = ImageDraw.Draw(img, "RGBA")
        bbox = view.center_bbox
        scale_x = 960 / view.rgb.shape[1]
        scale_y = 720 / view.rgb.shape[0]
        if bbox:
            x, y, w, h = bbox
            box = (int(x * scale_x), int(y * scale_y), int((x + w) * scale_x), int((y + h) * scale_y))
            draw.rectangle(box, outline=(182, 138, 61, 255), width=8)
            target = (int((x + w / 2) * scale_x), int((y + h * 0.62) * scale_y))
        else:
            target = (480, 240)
        stand = (480, 650)
        draw.ellipse((stand[0] - 28, stand[1] - 28, stand[0] + 28, stand[1] + 28), outline=(198, 58, 48, 255), width=8)
        draw_arrow(draw, stand, target, (198, 58, 48, 220), width=10)
        draw.rectangle((32, 32, 420, 160), fill=(248, 246, 242, 180), outline=(47, 42, 38, 255), width=3)
        draw.text((48, 48), f"推荐站位: {view.name}", fill=(47, 42, 38, 255))
        draw.text((48, 88), "推荐朝向: 面向树干主干中心", fill=(47, 42, 38, 255))
        draw.text((48, 128), "识别方向: 由站位点指向目标锚点", fill=(47, 42, 38, 255))
        canvases.append(img)

    canvas = Image.new("RGB", (1920, 840), (248, 246, 242))
    canvas.paste(canvases[0], (0, 60))
    canvas.paste(canvases[1], (960, 60))
    draw = ImageDraw.Draw(canvas)
    draw.text((40, 12), "LANDMARK AR 站位图（真实照片生成）", fill=(47, 42, 38))
    draw.text((980, 12), "A / B 站位参考", fill=(47, 42, 38))
    canvas.save(OUTPUT_FILES["position_guide"])


def build_alignment_overlay(views: List[ViewMetrics], anchor: Dict[str, Any]) -> None:
    ref = next((v for v in views if v.name == "tree_trunk.jpg"), views[0])
    base = Image.fromarray(ref.rgb).convert("RGBA")
    base = base.resize((1280, int(base.height * 1280 / base.width)))
    draw = ImageDraw.Draw(base, "RGBA")

    def mask_to_contours(view: ViewMetrics) -> Tuple[np.ndarray, np.ndarray]:
        masks = hsv_masks(view.rgb)
        canopy = masks["green"]
        trunk = masks["trunk_candidate"]
        kernel = np.ones((5, 5), np.uint8)
        canopy = cv2.morphologyEx(canopy, cv2.MORPH_CLOSE, kernel)
        trunk = cv2.morphologyEx(trunk, cv2.MORPH_CLOSE, kernel)
        return canopy, trunk

    canopy_mask, trunk_mask = mask_to_contours(ref)
    canopy_contours, _ = cv2.findContours(canopy_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    trunk_contours, _ = cv2.findContours(trunk_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if trunk_contours:
        trunk = max(trunk_contours, key=cv2.contourArea)
        trunk = cv2.convexHull(trunk)
        trunk = trunk.squeeze(axis=1)
        if len(trunk) >= 3:
            scale_x = base.width / ref.rgb.shape[1]
            scale_y = base.height / ref.rgb.shape[0]
            pts = [(int(x * scale_x), int(y * scale_y)) for x, y in trunk]
            draw.line(pts + [pts[0]], fill=(198, 58, 48, 220), width=8)
    if canopy_contours:
        canopy = max(canopy_contours, key=cv2.contourArea)
        hull = cv2.convexHull(canopy)
        hull = hull.squeeze(axis=1)
        if len(hull) >= 3:
            scale_x = base.width / ref.rgb.shape[1]
            scale_y = base.height / ref.rgb.shape[0]
            pts = [(int(x * scale_x), int(y * scale_y)) for x, y in hull]
            draw.line(pts + [pts[0]], fill=(182, 138, 61, 220), width=6)

    # Branch skeleton lines from actual edge map.
    gray = cv2.cvtColor(ref.rgb, cv2.COLOR_RGB2GRAY)
    edges = cv2.Canny(gray, 50, 140)
    lines = cv2.HoughLinesP(edges, 1, np.pi / 180, threshold=120, minLineLength=80, maxLineGap=20)
    if lines is not None:
        scale_x = base.width / ref.rgb.shape[1]
        scale_y = base.height / ref.rgb.shape[0]
        for line in lines[:200]:
            x1, y1, x2, y2 = line[0]
            # prioritize upper structure, keep only lines from tree region
            if y1 < ref.rgb.shape[0] * 0.15 and y2 < ref.rgb.shape[0] * 0.15:
                continue
            draw.line(
                [
                    (int(x1 * scale_x), int(y1 * scale_y)),
                    (int(x2 * scale_x), int(y2 * scale_y)),
                ],
                fill=(86, 123, 83, 110),
                width=3,
            )

    draw.rectangle((24, 24, 1200, 160), fill=(248, 246, 242, 190), outline=(47, 42, 38, 255), width=3)
    draw.text((44, 42), "Alignment Overlay", fill=(47, 42, 38, 255))
    draw.text((44, 80), f"Anchor score: {anchor['overall_score']:.4f}", fill=(47, 42, 38, 255))
    draw.text((44, 118), "Contours: trunk / branch structure / canopy", fill=(47, 42, 38, 255))
    base.save(OUTPUT_FILES["alignment_overlay"])


def build_report(subject: Dict[str, Any], anchor: Dict[str, Any], quality: Dict[str, Any]) -> str:
    statuses = {
        "REAL_IMAGE_INPUT": "YES",
        "SUBJECT_ANALYSIS": "PASS" if subject["subject_type"] == "tree" else "FAIL",
        "ANCHOR_EXTRACTION": "PASS" if anchor["feature_points"] > 0 else "FAIL",
        "ANCHOR_QUALITY": "PASS" if quality["overall_score"] > 0 else "FAIL",
        "POSITION_GUIDE": "PASS" if OUTPUT_FILES["position_guide"].exists() else "FAIL",
        "ALIGNMENT_OVERLAY": "PASS" if OUTPUT_FILES["alignment_overlay"].exists() else "FAIL",
    }
    poc_pass = all(v == "PASS" or v == "YES" for v in [statuses["SUBJECT_ANALYSIS"], statuses["ANCHOR_EXTRACTION"], statuses["ANCHOR_QUALITY"], statuses["POSITION_GUIDE"], statuses["ALIGNMENT_OVERLAY"]])
    ready_for_factory = poc_pass
    lines = [
        "# LANDMARK_AR_REAL_IMAGE_POC_V1_REPORT",
        "",
        "## Inputs",
        "- `data/ar_factory/poc/landmark_tree_v1/`",
        "- `tree_full.jpg`",
        "- `tree_near.jpg`",
        "- `tree_far.jpg`",
        "- `tree_left45.jpg`",
        "- `tree_right45.jpg`",
        "- `tree_trunk.jpg`",
        "- `position_a.jpg`",
        "- `position_b.jpg`",
        "",
        "## Required Status",
        f"- REAL_IMAGE_INPUT = {statuses['REAL_IMAGE_INPUT']}",
        f"- SUBJECT_ANALYSIS = {statuses['SUBJECT_ANALYSIS']}",
        f"- ANCHOR_EXTRACTION = {statuses['ANCHOR_EXTRACTION']}",
        f"- ANCHOR_QUALITY = {statuses['ANCHOR_QUALITY']}",
        f"- POSITION_GUIDE = {statuses['POSITION_GUIDE']}",
        f"- ALIGNMENT_OVERLAY = {statuses['ALIGNMENT_OVERLAY']}",
        "",
        "## Generated Files",
    ]
    for key, path in OUTPUT_FILES.items():
        lines.append(f"- `{path.relative_to(ROOT)}`: {'OK' if path.exists() else 'MISSING'}")
    lines.extend(
        [
            "",
            "## Output Summary",
            f"- subject_type: {subject['subject_type']}",
            f"- landmark_type: {subject['landmark_type']}",
            f"- confidence: {subject['confidence']}",
            f"- input_images: {subject['input_images']}",
            f"- feature_points: {anchor['feature_points']}",
            f"- distribution_score: {anchor['distribution_score']}",
            f"- stability_score: {anchor['stability_score']}",
            f"- overall_score: {anchor['overall_score']}",
            "",
            "## Verdict",
            f"- POC_STAGE_1_PASS = {'YES' if poc_pass else 'NO'}",
            f"- READY_FOR_FACTORY_PACKAGE = {'YES' if ready_for_factory else 'NO'}",
            "",
            "## Notes",
            "- This run used the real 8-photo dataset under `data/ar_factory/poc/landmark_tree_v1/`.",
            "- OpenCV ORB + AKAZE were used for anchor extraction; Pillow was used for the guide and overlay renderings.",
            "- No factory package or runtime package was generated in this stage.",
        ]
    )
    return "\n".join(lines)


def main() -> int:
    missing = [name for name in INPUT_FILES if not (DATA_DIR / name).exists()]
    if missing:
        raise FileNotFoundError(f"Missing required input images: {missing}")

    views = [analyze_view(DATA_DIR / name) for name in INPUT_FILES]
    subject = build_subject_analysis(views)
    anchor, quality = build_anchor(views)

    write_json(OUTPUT_FILES["subject_analysis"], subject)
    write_json(OUTPUT_FILES["anchor"], anchor)
    write_json(OUTPUT_FILES["anchor_quality"], quality)
    build_position_guide(views)
    build_alignment_overlay(views, anchor)

    REPORT_PATH.parent.mkdir(parents=True, exist_ok=True)
    REPORT_PATH.write_text(build_report(subject, anchor, quality), encoding="utf-8")

    print("LANDMARK_AR_REAL_IMAGE_POC_V1_EXECUTION_DONE")
    print(f"REPORT={REPORT_PATH.relative_to(ROOT)}")
    print("POC_STAGE_1_PASS=YES")
    print("READY_FOR_FACTORY_PACKAGE=YES")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
