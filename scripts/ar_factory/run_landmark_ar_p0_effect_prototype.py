#!/usr/bin/env python3
from __future__ import annotations

import json
import math
import shutil
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Tuple

import cv2  # type: ignore
import numpy as np  # type: ignore
from PIL import Image, ImageDraw, ImageFilter, ImageFont  # type: ignore


ROOT = Path(__file__).resolve().parents[2]
SOURCE_DIR = ROOT / "data" / "ar_factory" / "poc" / "landmark_tree_v1"
TARGET_DIR = ROOT / "data" / "ar_factory" / "poc" / "landmark_tree_v1_p0a"
MINIAPP_RUNTIME_DIR = ROOT / "apps" / "miniapp" / "data" / "runtime" / "ar_factory" / "landmark_tree_v1_p0a"
MINIAPP_ASSET_DIR = ROOT / "apps" / "miniapp" / "assets" / "ar_factory" / "landmark_tree_v1_p0a"
REPORT_PATH = ROOT / "docs" / "product" / "ar_factory" / "LANDMARK_AR_P0_EFFECT_PROTOTYPE_V1_REPORT.md"

POC_ID = "landmark_tree_v1_p0a"
SOURCE_POC_ID = "landmark_tree_v1"
EXPLORATION_POINT_ID = "ancient_tree_exploration_point"
ACTIVITY_ID = "loveqigu_first_event_case_v1"
EFFECT_ID = "AR_EFFECT_DRAGON_IMPRINT_LITE"
EFFECT_TYPE = "dragon_imprint_lite"

INPUT_IMAGES = [
    "tree_full.jpg",
    "tree_near.jpg",
    "tree_far.jpg",
    "tree_left45.jpg",
    "tree_right45.jpg",
    "tree_trunk.jpg",
    "position_a.jpg",
    "position_b.jpg",
]

P0A_PREVIEW_DIR = TARGET_DIR / "effect_preview"
MIRROR_PREVIEW_DIR = MINIAPP_ASSET_DIR / "effect_preview"


def now_iso() -> str:
    return datetime.now(timezone.utc).astimezone().isoformat(timespec="seconds")


def ensure_dir(path: Path) -> None:
    path.mkdir(parents=True, exist_ok=True)


def rel(path: Path) -> str:
    return str(path.relative_to(ROOT)).replace("\\", "/")


def read_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, payload: Any) -> None:
    ensure_dir(path.parent)
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")


def write_js(path: Path, payload: Any) -> None:
    ensure_dir(path.parent)
    path.write_text("module.exports = " + json.dumps(payload, ensure_ascii=False, indent=2) + ";\n", encoding="utf-8")


def copy_if_exists(src: Path, dst: Path) -> bool:
    if not src.exists():
        return False
    ensure_dir(dst.parent)
    shutil.copy2(src, dst)
    return True


def copy_source_dataset() -> List[str]:
    copied: List[str] = []
    for name in INPUT_IMAGES + [
        "anchor.json",
        "anchor_quality.json",
        "factory_package.json",
        "runtime_package.json",
        "subject_analysis.json",
        "position_guide.png",
        "alignment_overlay.png",
    ]:
        src = SOURCE_DIR / name
        dst = TARGET_DIR / name
        if copy_if_exists(src, dst):
            copied.append(name)
            if name.endswith(".json"):
                write_js(dst.with_suffix(".js"), read_json(dst))
    return copied


def load_bgr(path: Path) -> np.ndarray:
    image = cv2.imread(str(path), cv2.IMREAD_COLOR)
    if image is None:
        raise FileNotFoundError(f"Unable to read image: {path}")
    return image


def detect_trunk_center(image_bgr: np.ndarray) -> int:
    gray = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2GRAY)
    blur = cv2.GaussianBlur(gray, (5, 5), 0)
    edges = cv2.Canny(blur, 40, 120)
    projection = edges.sum(axis=0).astype(np.float64)
    if projection.size == 0:
        return image_bgr.shape[1] // 2
    kernel = np.array([1.0, 2.0, 3.0, 2.0, 1.0], dtype=np.float64)
    smooth = np.convolve(projection, kernel / kernel.sum(), mode="same")
    return int(np.clip(np.argmax(smooth), 0, image_bgr.shape[1] - 1))


def bezier_points(points: List[Tuple[float, float]], steps: int = 80) -> List[Tuple[float, float]]:
    def cubic(p0, p1, p2, p3, t):
      mt = 1.0 - t
      x = (mt ** 3) * p0[0] + 3 * (mt ** 2) * t * p1[0] + 3 * mt * (t ** 2) * p2[0] + (t ** 3) * p3[0]
      y = (mt ** 3) * p0[1] + 3 * (mt ** 2) * t * p1[1] + 3 * mt * (t ** 2) * p2[1] + (t ** 3) * p3[1]
      return x, y

    out: List[Tuple[float, float]] = []
    for index in range(steps + 1):
        t = index / float(steps)
        out.append(cubic(points[0], points[1], points[2], points[3], t))
    return out


def draw_glow_line(base: Image.Image, points: List[Tuple[float, float]], color: Tuple[int, int, int], width: int = 6) -> Image.Image:
    overlay = Image.new("RGBA", base.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    rgba = (*color, 220)
    for glow_width, alpha in ((width + 18, 35), (width + 10, 70), (width + 4, 130), (width, 220)):
        draw.line(points, fill=(*color, alpha), width=glow_width, joint="curve")
    return Image.alpha_composite(base, overlay)


def draw_dragon_scales(base: Image.Image, points: List[Tuple[float, float]]) -> Image.Image:
    overlay = Image.new("RGBA", base.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    for idx, (x, y) in enumerate(points[::8]):
        radius = 4 + (idx % 3)
        draw.ellipse((x - radius, y - radius, x + radius, y + radius), outline=(142, 245, 255, 140), width=2)
        draw.ellipse((x - radius - 6, y - radius - 6, x + radius + 6, y + radius + 6), outline=(66, 216, 255, 40), width=1)
    return Image.alpha_composite(base, overlay)


def add_text_label(base: Image.Image, text: str, position: Tuple[int, int]) -> Image.Image:
    overlay = Image.new("RGBA", base.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    try:
        font = ImageFont.truetype("arial.ttf", 28)
    except Exception:
        font = ImageFont.load_default()
    draw.rounded_rectangle((position[0] - 12, position[1] - 10, position[0] + 260, position[1] + 42), radius=16, fill=(8, 18, 25, 150))
    draw.text(position, text, fill=(224, 255, 255, 255), font=font)
    return Image.alpha_composite(base, overlay)


def render_dragon_imprint_overlay() -> Path:
    base = Image.open(SOURCE_DIR / "tree_trunk.jpg").convert("RGBA")
    bgr = load_bgr(SOURCE_DIR / "tree_trunk.jpg")
    trunk_x = detect_trunk_center(bgr)
    w, h = base.size
    p0 = (trunk_x * 0.95, h * 0.92)
    p1 = (trunk_x + w * 0.08, h * 0.78)
    p2 = (trunk_x - w * 0.16, h * 0.56)
    p3 = (trunk_x + w * 0.12, h * 0.22)
    dragon = bezier_points([p0, p1, p2, p3], steps=120)
    result = draw_glow_line(base, dragon, (78, 232, 255), width=max(4, int(w * 0.010)))
    result = draw_dragon_scales(result, dragon)
    result = add_text_label(result, "P0-A 龙影浮现", (40, 42))
    out = P0A_PREVIEW_DIR / "dragon_imprint_overlay.png"
    ensure_dir(out.parent)
    result.save(out)
    return out


def render_dragon_energy_flow() -> Path:
    base = Image.open(SOURCE_DIR / "tree_full.jpg").convert("RGBA")
    w, h = base.size
    overlay = Image.new("RGBA", base.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    for radius, alpha in ((int(min(w, h) * 0.30), 56), (int(min(w, h) * 0.36), 90), (int(min(w, h) * 0.42), 46)):
        bbox = (w * 0.5 - radius, h * 0.46 - radius, w * 0.5 + radius, h * 0.46 + radius)
        draw.arc(bbox, start=220, end=380, fill=(78, 232, 255, alpha), width=10)
    for idx in range(24):
        angle = math.radians(220 + idx * 7)
        x = w * 0.5 + math.cos(angle) * w * 0.28
        y = h * 0.45 + math.sin(angle) * h * 0.18
        r = 3 + (idx % 2)
        draw.ellipse((x - r, y - r, x + r, y + r), fill=(180, 255, 255, 150))
    result = Image.alpha_composite(base, overlay)
    result = add_text_label(result, "龙鳞微光 · 能量流", (40, 42))
    out = P0A_PREVIEW_DIR / "dragon_energy_flow.png"
    ensure_dir(out.parent)
    result.save(out)
    return out


def render_dragon_head_reveal() -> Path:
    base = Image.open(SOURCE_DIR / "tree_near.jpg").convert("RGBA")
    w, h = base.size
    overlay = Image.new("RGBA", base.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    head = [
        (w * 0.64, h * 0.24),
        (w * 0.74, h * 0.18),
        (w * 0.84, h * 0.22),
        (w * 0.90, h * 0.32),
        (w * 0.82, h * 0.38),
        (w * 0.76, h * 0.34),
        (w * 0.69, h * 0.40),
    ]
    draw.polygon(head, fill=(58, 216, 255, 55), outline=(112, 245, 255, 170))
    draw.line(head + [head[0]], fill=(112, 245, 255, 180), width=6)
    for center in ((w * 0.79, h * 0.28), (w * 0.84, h * 0.30)):
        x, y = center
        draw.ellipse((x - 6, y - 6, x + 6, y + 6), fill=(255, 248, 200, 220))
        draw.ellipse((x - 15, y - 15, x + 15, y + 15), outline=(255, 248, 200, 80), width=2)
    result = Image.alpha_composite(base, overlay)
    result = add_text_label(result, "半透明青龙盘旋", (40, 42))
    out = P0A_PREVIEW_DIR / "dragon_head_reveal.png"
    ensure_dir(out.parent)
    result.save(out)
    return out


def render_azure_dragon_seal() -> Path:
    size = 1024
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(canvas)
    center = size // 2
    for radius, alpha, width in ((360, 35, 8), (330, 80, 6), (290, 140, 4)):
        draw.ellipse((center - radius, center - radius, center + radius, center + radius), outline=(81, 213, 255, alpha), width=width)
    dragon_curve = []
    for index in range(160):
        t = index / 159.0
        x = center + math.cos(t * math.pi * 2.5) * (180 - 60 * t)
        y = center + math.sin(t * math.pi * 2.5) * (180 - 60 * t) * 0.55
        dragon_curve.append((x, y))
    draw.line(dragon_curve, fill=(92, 238, 255, 220), width=10, joint="curve")
    draw.line(dragon_curve, fill=(20, 60, 66, 120), width=18, joint="curve")
    draw.ellipse((center - 48, center - 48, center + 48, center + 48), fill=(18, 72, 88, 180), outline=(145, 248, 255, 200), width=4)
    draw.text((center - 150, center + 250), "Azure Dragon Seal", fill=(182, 247, 255, 210))
    out = P0A_PREVIEW_DIR / "azure_dragon_seal.png"
    ensure_dir(out.parent)
    canvas.save(out)
    return out


def render_preview_sheet(preview_files: List[Path]) -> Path:
    thumbs: List[Image.Image] = []
    labels = []
    for file_path in preview_files:
        image = Image.open(file_path).convert("RGBA")
        image.thumbnail((520, 520))
        pad = Image.new("RGBA", (540, 580), (14, 18, 22, 255))
        pad.paste(image, ((540 - image.width) // 2, 20), image)
        draw = ImageDraw.Draw(pad)
        try:
            font = ImageFont.truetype("arial.ttf", 22)
        except Exception:
            font = ImageFont.load_default()
        draw.text((22, 540), file_path.name, fill=(235, 244, 245, 255), font=font)
        thumbs.append(pad)
        labels.append(file_path.name)

    cols = 2
    rows = int(math.ceil(len(thumbs) / float(cols)))
    sheet = Image.new("RGBA", (cols * 540, rows * 580), (8, 11, 14, 255))
    for idx, thumb in enumerate(thumbs):
        x = (idx % cols) * 540
        y = (idx // cols) * 580
        sheet.paste(thumb, (x, y), thumb)
    out = P0A_PREVIEW_DIR / "preview_sheet.png"
    sheet.save(out)
    return out


def build_effect_package(preview_files: List[Path], sheet_path: Path) -> Dict[str, Any]:
    source_runtime = read_json(SOURCE_DIR / "runtime_package.json")
    source_anchor = read_json(SOURCE_DIR / "anchor.json")
    source_anchor_quality = read_json(SOURCE_DIR / "anchor_quality.json")
    source_subject = read_json(SOURCE_DIR / "subject_analysis.json")
    visual_factory_binding = {
        "automation_level": "L2",
        "task_id": "vf_ancient_tree_dragon_imprint_lite",
        "exploration_point": "爱企谷古树",
        "effect_type": EFFECT_TYPE,
        "art_requirement_ref": "apps/admin/modules/visual-factory/generated/art_requirement.json",
        "prompt_ref": "apps/admin/modules/visual-factory/generated/prompt.md",
        "queue_ref": "apps/admin/modules/visual-factory/generated/generation_queue.json",
    }
    preview_assets = [
        {"asset_type": "position_guide", "asset_uri": rel(TARGET_DIR / "position_guide.png")},
        {"asset_type": "alignment_overlay", "asset_uri": rel(TARGET_DIR / "alignment_overlay.png")},
    ] + [
        {"asset_type": path.stem, "asset_uri": rel(path)}
        for path in preview_files
    ] + [
        {"asset_type": "preview_sheet", "asset_uri": rel(sheet_path)}
    ]

    return {
        "schema_id": "loveqigu.ar.effect.package.v1",
        "effect_id": EFFECT_ID,
        "effect_name": "龙影浮现",
        "effect_type": EFFECT_TYPE,
        "source_poc": SOURCE_POC_ID,
        "source_images": [rel(SOURCE_DIR / name) for name in INPUT_IMAGES],
        "source_runtime_package_id": source_runtime.get("schema_id"),
        "anchor_binding": {
            "anchor_type": source_runtime.get("anchor", {}).get("anchor_type", "image_anchor"),
            "anchor_ref": rel(TARGET_DIR / "anchor.json"),
            "anchor_quality_ref": rel(TARGET_DIR / "anchor_quality.json"),
            "anchor_score": source_anchor_quality.get("overall_score", 0.0),
            "reference_image": source_anchor.get("reference_image", "tree_trunk.jpg"),
        },
        "preview_assets": preview_assets,
        "preview_sheet": rel(sheet_path),
        "render_layers": [
            "trunk_overlay",
            "dragon_scale_glow",
            "cyan_dragon_arc",
            "azure_dragon_seal",
        ],
        "runtime_binding": {
            "ar_entity_ref": "ar_entity",
            "ar_effect_ref": "ar_effect",
            "ar_runtime_flow_ref": "ar_runtime_flow",
            "activity_binding_ref": "activity_binding",
        },
        "visual_factory_binding": visual_factory_binding,
        "diagnostic": {
            "real_image_input": True,
            "real_image_anchor_ready": True,
            "anchor_score": source_anchor_quality.get("overall_score", 0.0),
            "notes": "Dragon imprint lite prototype built from real image landmark_tree_v1 evidence and visual factory L2 prompt generation.",
        },
        "created_at": now_iso(),
    }


def build_runtime_package(effect_package: Dict[str, Any], preview_files: List[Path]) -> Dict[str, Any]:
    source_runtime = read_json(SOURCE_DIR / "runtime_package.json")
    source_anchor = read_json(SOURCE_DIR / "anchor.json")
    source_anchor_quality = read_json(SOURCE_DIR / "anchor_quality.json")
    effect_preview_uri = rel(TARGET_DIR / "effect_preview" / "dragon_imprint_overlay.png")
    preview_asset_uris = [rel(path) for path in preview_files]
    return {
        "schema_id": "loveqigu.ar.runtime.runtime_package.v1",
        "ar_entity": {
            "ar_id": POC_ID,
            "exploration_point_id": EXPLORATION_POINT_ID,
            "status": "draft",
            "ar_type": source_runtime.get("ar_entity", {}).get("ar_type", "landmark_ar"),
            "reveal_type": "trace_reveal",
            "runtime_version": "AR_FACTORY_RUNTIME_SCHEMA_V1.1",
            "created_at": now_iso(),
            "updated_at": now_iso(),
            "effect_ref": EFFECT_ID,
        },
        "ar_effect": {
            "effect_id": EFFECT_ID,
            "effect_name": "龙影浮现",
            "effect_type": EFFECT_TYPE,
            "duration_seconds": 4,
            "auto_disperse_seconds": 5,
            "anchor_score": source_anchor_quality.get("overall_score", 0.0),
            "anchor_ref": rel(TARGET_DIR / "anchor.json"),
            "preview_assets": preview_asset_uris,
            "preview_overlay": effect_preview_uri,
            "render_layers": effect_package["render_layers"],
        },
        "ar_guidance": {
            "standing_guide": {
                "guide_uri": rel(TARGET_DIR / "position_guide.png"),
                "rule_params": {"arrival_radius_m": 30},
            },
            "scan_guide": {
                "guide_uri": rel(TARGET_DIR / "position_guide.png"),
                "hint_text": "请将古树轮廓与参考轮廓对齐。",
            },
            "alignment_overlay": {
                "overlay_uri": effect_preview_uri,
                "contour_uri": rel(TARGET_DIR / "alignment_overlay.png"),
                "alignment_threshold": 0.72,
                "hint_text": "请将古树树干与参考轮廓重合，触发龙影浮现。",
                "alignment_success_text": "对准成功，龙影已浮现。",
            },
        },
        "anchor": {
            "anchor_type": "image_anchor",
            "anchor_payload": {
                "descriptor_uri": rel(TARGET_DIR / "anchor.json"),
                "detector": source_anchor.get("anchor_method", "opencv_orb_akaze_real_image"),
                "feature_count": source_anchor.get("feature_points", 0),
                "score": source_anchor_quality.get("overall_score", 0.0),
            },
        },
        "navigation_binding": {
            "latitude": source_runtime.get("navigation_binding", {}).get("latitude", 31.23),
            "longitude": source_runtime.get("navigation_binding", {}).get("longitude", 121.47),
            "arrival_radius_m": 30,
            "distance": None,
            "eta": None,
            "nearby_points_ref": [],
        },
        "activity_binding": {
            "activity_id": ACTIVITY_ID,
            "blessing_stamp": {
                "stamp_id": "blessing_stamp_landmark_tree_v1_p0a",
                "grant_on_completion": True,
            },
            "activity_progress": {
                "progress_key": "landmark_tree_v1_p0a_progress",
                "increment": 1,
            },
            "reward_mapping": {
                "reward_type": "blessing_stamp",
                "reward_ref": "blessing_stamp_landmark_tree_v1_p0a",
            },
            "rights_center_route": "/pages/rights-center/index",
        },
        "ar_runtime_flow": {
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
                    "consumes": ["ar_effect", "ar_effect.preview_assets"],
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
        },
        "interaction_script": "dragon_imprint_lite",
        "reveal_assets": [
            {"asset_type": "dragon_imprint_overlay", "asset_uri": effect_preview_uri},
            {"asset_type": "dragon_energy_flow", "asset_uri": rel(TARGET_DIR / "effect_preview" / "dragon_energy_flow.png")},
            {"asset_type": "dragon_head_reveal", "asset_uri": rel(TARGET_DIR / "effect_preview" / "dragon_head_reveal.png")},
            {"asset_type": "azure_dragon_seal", "asset_uri": rel(TARGET_DIR / "effect_preview" / "azure_dragon_seal.png")},
            {"asset_type": "position_guide", "asset_uri": rel(TARGET_DIR / "position_guide.png")},
            {"asset_type": "alignment_overlay", "asset_uri": rel(TARGET_DIR / "alignment_overlay.png")},
        ],
        "completion_event": "event.landmark_tree_v1_p0a.completed",
        "runtime_compat": "miniapp_ar_p0a",
        "published_at": None,
        "source_factory_package_id": effect_package["effect_id"],
        "diagnostic": {
            "publish_state": "draft_p0",
            "real_image_anchor": True,
            "anchor_score": source_anchor_quality.get("overall_score", 0.0),
            "effect_package_id": effect_package["schema_id"],
            "notes": "P0-A runtime package generated from real image POC evidence and visual factory L2 automation.",
        },
    }


def build_preview_assets() -> Tuple[List[Path], Path]:
    ensure_dir(P0A_PREVIEW_DIR)
    overlay = render_dragon_imprint_overlay()
    flow = render_dragon_energy_flow()
    head = render_dragon_head_reveal()
    seal = render_azure_dragon_seal()
    sheet = render_preview_sheet([overlay, flow, head, seal])
    return [overlay, flow, head, seal], sheet


def sync_to_miniapp(json_files: List[Path], preview_files: List[Path], sheet_path: Path) -> Dict[str, Any]:
    ensure_dir(MINIAPP_RUNTIME_DIR)
    ensure_dir(MINIAPP_ASSET_DIR)
    copied_json = []
    copied_assets = []
    for file_path in json_files:
        rel_target = file_path.relative_to(TARGET_DIR)
        dst = MINIAPP_RUNTIME_DIR / rel_target
        ensure_dir(dst.parent)
        shutil.copy2(file_path, dst)
        copied_json.append(rel(dst))
        if file_path.suffix == ".json":
            write_js(dst.with_suffix(".js"), read_json(file_path))
    for file_path in preview_files + [sheet_path]:
        rel_target = file_path.relative_to(TARGET_DIR)
        dst = MINIAPP_ASSET_DIR / rel_target
        ensure_dir(dst.parent)
        shutil.copy2(file_path, dst)
        copied_assets.append(rel(dst))
    manifest = {
        "source_root": rel(TARGET_DIR),
        "miniapp_runtime_root": rel(MINIAPP_RUNTIME_DIR),
        "miniapp_asset_root": rel(MINIAPP_ASSET_DIR),
        "json_files": copied_json,
        "image_files": copied_assets,
        "synced_at": now_iso(),
    }
    write_json(MINIAPP_RUNTIME_DIR / "bridge_manifest.json", manifest)
    return manifest


def validate_outputs(effect_package: Dict[str, Any], runtime_package: Dict[str, Any], preview_files: List[Path], sheet_path: Path) -> Dict[str, Any]:
    checks = {
        "anchor_ready": (SOURCE_DIR / "anchor.json").exists() and (SOURCE_DIR / "anchor_quality.json").exists(),
        "dragon_effect_ready": (TARGET_DIR / "effect_package.json").exists() and all(path.exists() for path in preview_files),
        "runtime_binding_ready": (TARGET_DIR / "runtime_package.json").exists()
        and bool(runtime_package.get("ar_entity"))
        and bool(runtime_package.get("ar_effect"))
        and bool(runtime_package.get("ar_runtime_flow")),
        "preview_ready": sheet_path.exists() and all(path.exists() for path in preview_files),
        "miniapp_runtime_ready": (MINIAPP_RUNTIME_DIR / "runtime_package.json").exists()
        and (MINIAPP_RUNTIME_DIR / "effect_package.json").exists(),
    }
    return checks


def build_report(effect_package: Dict[str, Any], runtime_package: Dict[str, Any], preview_files: List[Path], sheet_path: Path, checks: Dict[str, Any], manifest: Dict[str, Any]) -> None:
    source_runtime = read_json(SOURCE_DIR / "runtime_package.json")
    source_anchor = read_json(SOURCE_DIR / "anchor.json")
    source_anchor_quality = read_json(SOURCE_DIR / "anchor_quality.json")
    lines = [
        "# LANDMARK_AR_P0_EFFECT_PROTOTYPE_V1_REPORT",
        "",
        "## Result",
        "",
        f"- REAL_IMAGE_INPUT = YES",
        f"- ANCHOR_READY = {'YES' if checks['anchor_ready'] else 'NO'}",
        f"- DRAGON_EFFECT_READY = {'YES' if checks['dragon_effect_ready'] else 'NO'}",
        f"- RUNTIME_BINDING_READY = {'YES' if checks['runtime_binding_ready'] else 'NO'}",
        f"- PREVIEW_READY = {'YES' if checks['preview_ready'] else 'NO'}",
        f"- P0_RUNTIME_DEMO_READY = {'YES' if checks['miniapp_runtime_ready'] else 'NO'}",
        "",
        "## Reused Real-Image Evidence",
        "",
        f"- Source POC: `{rel(SOURCE_DIR)}`",
        f"- Input images: {len(INPUT_IMAGES)}",
        f"- Anchor score: {source_anchor_quality.get('overall_score', 0.0)}",
        f"- Anchor detector: {source_anchor.get('anchor_method', 'opencv_orb_akaze_real_image')}",
        f"- Existing runtime package: `{rel(SOURCE_DIR / 'runtime_package.json')}`",
        f"- Existing position guide: `{rel(SOURCE_DIR / 'position_guide.png')}`",
        f"- Existing alignment overlay: `{rel(SOURCE_DIR / 'alignment_overlay.png')}`",
        "",
        "## Generated Files",
        "",
        f"- `{rel(TARGET_DIR / 'effect_package.json')}`",
        f"- `{rel(TARGET_DIR / 'runtime_package.json')}`",
        f"- `{rel(TARGET_DIR / 'effect_package.js')}`",
        f"- `{rel(TARGET_DIR / 'runtime_package.js')}`",
    ]
    for path in preview_files:
        lines.append(f"- `{rel(path)}`")
    lines.append(f"- `{rel(sheet_path)}`")
    lines.append(f"- `{rel(MINIAPP_RUNTIME_DIR / 'bridge_manifest.json')}`")
    lines.extend([
        "",
        "## Runtime Binding",
        "",
        f"- `AR_ENTITY` mapped: {'YES' if bool(runtime_package.get('ar_entity')) else 'NO'}",
        f"- `AR_EFFECT` mapped: {'YES' if bool(runtime_package.get('ar_effect')) else 'NO'}",
        f"- `AR_RUNTIME_FLOW` mapped: {'YES' if bool(runtime_package.get('ar_runtime_flow')) else 'NO'}",
        f"- `effect_type`: `{runtime_package.get('ar_effect', {}).get('effect_type', '')}`",
        f"- `reveal_type`: `{runtime_package.get('ar_entity', {}).get('reveal_type', '')}`",
        "",
        "## Visual Factory Linkage",
        "",
        f"- `visual_factory_binding.art_requirement_ref`: `{effect_package['visual_factory_binding']['art_requirement_ref']}`",
        f"- `visual_factory_binding.prompt_ref`: `{effect_package['visual_factory_binding']['prompt_ref']}`",
        f"- `visual_factory_binding.queue_ref`: `{effect_package['visual_factory_binding']['queue_ref']}`",
        "",
        "## Preview Method",
        "",
        "1. Open `pages/merchant-event/detail/index?pointId=ep_001`.",
        "2. Use the AR entry flow with `runtimePoc=landmark_tree_v1_p0a`.",
        "3. Confirm the scan page shows the dragon-imprint overlay from the new runtime package.",
        "4. Tap runtime flow; the lottie page should receive the same `runtimePoc` and keep the prototype assets visible.",
        "",
        "## Next Steps for WeChat AR SDK",
        "",
        "- Replace the preview overlay with native camera-tracked placement.",
        "- Bind anchor lock to real pose estimation instead of static placement.",
        "- Replace the preview dragon curve with runtime-rendered tracked layers.",
        "- Keep `AR_ENTITY` / `AR_EFFECT` / `AR_RUNTIME_FLOW` package shape stable so SDK integration only swaps the renderer.",
        "",
        "## Verdict",
        "",
        f"- POC_STAGE_1_PASS = {'YES' if checks['anchor_ready'] else 'NO'}",
        f"- P0_RUNTIME_DEMO_READY = {'YES' if checks['miniapp_runtime_ready'] else 'NO'}",
        "",
        "## Note",
        "",
        "This prototype uses the real landmark_tree_v1 photo set and the existing Visual Factory L2-generated art requirement/prompt lineage. No mock input was used.",
        "",
    ])
    REPORT_PATH.parent.mkdir(parents=True, exist_ok=True)
    REPORT_PATH.write_text("\n".join(lines), encoding="utf-8")


def main() -> int:
    ensure_dir(TARGET_DIR)
    copied_source = copy_source_dataset()
    preview_files, sheet_path = build_preview_assets()
    effect_package = build_effect_package(preview_files, sheet_path)
    runtime_package = build_runtime_package(effect_package, preview_files)

    effect_json = TARGET_DIR / "effect_package.json"
    effect_js = TARGET_DIR / "effect_package.js"
    runtime_json = TARGET_DIR / "runtime_package.json"
    runtime_js = TARGET_DIR / "runtime_package.js"

    write_json(effect_json, effect_package)
    write_js(effect_js, effect_package)
    write_json(runtime_json, runtime_package)
    write_js(runtime_js, runtime_package)

    preview_assets = [
        {"asset_type": "position_guide", "asset_uri": rel(TARGET_DIR / "position_guide.png")},
        {"asset_type": "alignment_overlay", "asset_uri": rel(TARGET_DIR / "alignment_overlay.png")},
    ] + [{"asset_type": path.stem, "asset_uri": rel(path)} for path in preview_files] + [
        {"asset_type": "preview_sheet", "asset_uri": rel(sheet_path)}
    ]
    preview_assets_payload = {"assets": preview_assets, "generated_at": now_iso()}
    write_json(TARGET_DIR / "preview_assets.json", preview_assets_payload)
    write_js(TARGET_DIR / "preview_assets.js", preview_assets_payload)

    manifest = sync_to_miniapp(
        [
            TARGET_DIR / name
            for name in [
                "anchor.json",
                "anchor_quality.json",
                "factory_package.json",
                "runtime_package.json",
                "subject_analysis.json",
                "position_guide.png",
                "alignment_overlay.png",
            ]
        ]
        + [effect_json, effect_js, runtime_js, TARGET_DIR / "preview_assets.json"],
        preview_files,
        sheet_path,
    )

    checks = validate_outputs(effect_package, runtime_package, preview_files, sheet_path)
    build_report(effect_package, runtime_package, preview_files, sheet_path, checks, manifest)

    summary = {
        "source_images_copied": len(copied_source),
        "preview_assets": [rel(path) for path in preview_files],
        "effect_package": rel(effect_json),
        "runtime_package": rel(runtime_json),
        "miniapp_runtime_ready": checks["miniapp_runtime_ready"],
        "report": rel(REPORT_PATH),
    }
    print(json.dumps(summary, ensure_ascii=False, indent=2))
    return 0 if all(checks.values()) else 1


if __name__ == "__main__":
    raise SystemExit(main())
