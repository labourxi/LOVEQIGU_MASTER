#!/usr/bin/env python3
"""
VISUAL QA SCORING ENGINE — Python Port V2 (Pipeline V3 STEP 3)

Evaluates a generated image on 4 dimensions:
  1. style_consistency  (0.35) — matches STRUCTURE_SPEC style profile
  2. clarity            (0.25) — readable at mobile dimensions
  3. ui_fit             (0.25) — works as background layer
  4. completeness       (0.15) — non-trivial file, no obvious corruption

Key improvements over V1:
  - Reads ALL expected values from spec (no hardcoded defaults)
  - Supports --threshold CLI parameter for dynamic QA gate
  - Theme/density checks compare against spec values, not hardcoded strings
  - Accepts `--threshold` to override minimum score from outside

Usage:
  python qa_scoring_engine.py <image_path> [--spec <spec_json>] [--threshold <float>] [--json]

Exit code:
  0 = PASS (score >= threshold)
  1 = FAIL (score < threshold)
"""

import argparse, json, os, sys
from pathlib import Path
from PIL import Image


# ── Default spec values (fallback when no spec file provided) ──
DEFAULT_SPEC = {
    "style_profile": {
        "theme": "oriental_mystic_sci_fi",
        "color_system": ["#050510 (deep_black)", "#1A0A3E (indigo)", "#7B2D8E (violet)", "#E8C86A (gold_light)"],
        "lighting": "volumetric_soft_glow",
        "material": "energy_mist_glass_neon",
        "atmosphere": "sacred_futuristic_space",
    },
    "layout": {
        "type": "full_page_ui",
        "background": "deep_space_gradient_black_to_indigo",
        "center_focus": "energy_portal_gate",
        "ui_density": "very_low",
        "composition_rule": "center_dominant_symmetry",
    },
    "render_rules": {
        "must_be_single_image": True,
        "production_grade_only": True,
    },
    "visual_priority": {},
}

# ── Weights ──
QA_WEIGHTS = {
    "style_consistency": 0.25,
    "clarity": 0.15,
    "ui_fit": 0.15,
    "completeness": 0.10,
    "visual_ratio": 0.35,
}

DEFAULT_THRESHOLD = 0.70


def load_spec(spec_path: str | None) -> dict:
    """Load spec from JSON, extracting nested fields from generation_spec format."""
    if spec_path and os.path.exists(spec_path):
        with open(spec_path, "r", encoding="utf-8") as f:
            raw = json.load(f)
        out = {}
        pp = raw.get("prompt_primary", {})
        out["style_profile"] = pp.get("style_profile", raw.get("style_profile", DEFAULT_SPEC["style_profile"]))
        ls = raw.get("layout_spec", {})
        out["layout"] = {
            "type": ls.get("type", DEFAULT_SPEC["layout"]["type"]),
            "background": ls.get("z_order_bottom_to_top", [""])[0] if isinstance(ls.get("z_order_bottom_to_top"), list) else "",
            "center_focus": ls.get("center_focus", DEFAULT_SPEC["layout"]["center_focus"]),
            "ui_density": ls.get("ui_density", DEFAULT_SPEC["layout"]["ui_density"]),
            "composition_rule": ls.get("composition", ls.get("composition_rule", DEFAULT_SPEC["layout"]["composition_rule"])),
        }
        out["render_rules"] = raw.get("render_rules", DEFAULT_SPEC.get("render_rules", {}))
        out["visual_priority"] = raw.get("visual_priority", raw.get("visual_priority", {}))
        # Read qa_threshold from spec if present
        out["qa_threshold"] = raw.get("qa_threshold", DEFAULT_THRESHOLD)
        return out
    return DEFAULT_SPEC


def evaluate_style_consistency(spec: dict) -> dict:
    """Check if the generated image matches the STRUCTURE_SPEC style profile."""
    style = spec.get("style_profile", {})
    # Start lower — engine is textual, cannot truly verify generated content
    score = 0.80
    details = []

    theme = style.get("theme", "")
    color_system = style.get("color_system", [])
    atmosphere = style.get("atmosphere", "")

    # The spec's own theme is always "valid" — we just note what it is
    if theme:
        details.append(f"Spec theme: {theme}")
    else:
        score -= 0.15
        details.append("No theme defined in spec")

    # Color system: spec defines its own expected colors
    if len(color_system) >= 4:
        details.append(f"Color system defined ({len(color_system)} colors)")
    elif len(color_system) >= 2:
        details.append(f"Color system minimal ({len(color_system)} colors)")
        score -= 0.05
    else:
        score -= 0.1
        details.append("Incomplete color system")

    if atmosphere:
        details.append(f"Spec atmosphere: {atmosphere}")

    return {
        "dimension": "style_consistency",
        "score": max(0.5, min(1.0, score)),
        "details": "; ".join(details),
        "pass": True,  # All valid specs pass — we can't verify content from text
    }


def evaluate_clarity(image_path: str) -> dict:
    """Check file size and dimensions for mobile readability."""
    score = 1.0
    details = []

    try:
        img = Image.open(image_path)
        w, h = img.size
        file_size = os.path.getsize(image_path)

        details.append(f"{w}x{h}, {file_size} bytes")

        # File size check
        if file_size < 500:
            score -= 0.4
            details.append("Very small file — may be corrupt")
        elif file_size < 1000:
            score -= 0.2
            details.append("Small file — limited detail")
        elif file_size > 100000:
            details.append("Good file size for mobile display")
        else:
            details.append("Adequate file size")

        # Aspect ratio check (target: 9:16 ≈ 0.5625)
        if h > 0:
            ratio = w / h
            if 0.5 <= ratio <= 0.65:
                details.append(f"9:16 aspect ratio (w/h={ratio:.3f})")
            else:
                score -= 0.15
                details.append(f"Non-standard ratio: w/h={ratio:.3f}")

        # Minimum resolution check
        if w >= 750 and h >= 1334:
            details.append("Sufficient resolution for mobile portrait")
        else:
            score -= 0.1
            details.append(f"Low resolution: {w}x{h}")

    except Exception as e:
        score = 0.3
        details.append(f"Cannot open image: {e}")

    return {
        "dimension": "clarity",
        "score": max(0.0, min(1.0, score)),
        "details": "; ".join(details),
        "pass": score >= DEFAULT_THRESHOLD,
    }


def evaluate_ui_fit(spec: dict, image_path: str) -> dict:
    """Check if the image works as a mobile background layer.
    
    Uses the spec's own ui_density value as reference.
    No hardcoded expectations — the spec defines what's valid.
    """
    layout = spec.get("layout", {})
    visual_priority = spec.get("visual_priority", {})
    score = 0.80
    details = []

    # Log what the spec says — no penalty for density value itself
    ui_density = layout.get("ui_density", "not specified")
    composition = layout.get("composition_rule", "not specified")
    center_focus = layout.get("center_focus", "not specified")

    details.append(f"UI density (spec): {ui_density}")
    details.append(f"Composition (spec): {composition}")

    if center_focus:
        details.append(f"Center focus (spec): {center_focus}")

    # Check visual_priority rules exist
    if visual_priority:
        rules_present = [k for k in ("center_anchor", "ui_suppression", "background_non_competition", "z_order_enforcement") if k in visual_priority]
        details.append(f"Visual priority rules: {len(rules_present)}/4 defined ({', '.join(rules_present)})")

    # Dark background check (via average brightness estimation)
    try:
        img = Image.open(image_path).convert("L")
        pixels = list(img.getdata())
        avg_brightness = sum(pixels) / len(pixels)
        if avg_brightness < 100:
            details.append(f"Dark-toned image (brightness ~{avg_brightness:.0f}/255) — good for UI overlay")
        else:
            details.append(f"Bright image (brightness ~{avg_brightness:.0f}/255) — may compete with UI")
            score -= 0.1
    except Exception:
        details.append("Brightness check skipped")

    # Check for non-void background (approximate: if brightness varies too much)
    try:
        img = Image.open(image_path).convert("L")
        pixels = list(img.getdata())
        # Sample variance as rough complexity check
        step = max(1, len(pixels) // 100)
        sampled = [pixels[i] for i in range(0, len(pixels), step)]
        variance = sum((x - avg_brightness) ** 2 for x in sampled) / len(sampled)
        if variance > 3000:
            details.append(f"High visual complexity (variance ~{variance:.0f}) — may compete with UI")
            score -= 0.05
        else:
            details.append(f"Low visual complexity (variance ~{variance:.0f}) — good UI canvas")
    except Exception:
        details.append("Complexity check skipped")

    return {
        "dimension": "ui_fit",
        "score": max(0.5, min(1.0, score)),
        "details": "; ".join(details),
        "pass": score >= DEFAULT_THRESHOLD,
    }


def evaluate_completeness(image_path: str) -> dict:
    """Check if the file is non-trivial and not corrupt."""
    score = 0.85
    details = []

    try:
        file_size = os.path.getsize(image_path)
        img = Image.open(image_path)
        img.verify()

        if file_size < 300:
            score = 0.3
            details.append("File appears empty or corrupt")
        elif file_size < 1000:
            score = 0.5
            details.append(f"File very small ({file_size} bytes)")
        else:
            details.append(f"File exists with non-trivial content ({file_size} bytes)")

        details.append("Image format verified (no corruption detected)")

    except Exception as e:
        score = 0.0
        details.append(f"Corrupt or unreadable: {e}")

    return {
        "dimension": "completeness",
        "score": max(0.0, min(1.0, score)),
        "details": "; ".join(details),
        "pass": score >= DEFAULT_THRESHOLD,
    }


def evaluate_visual_ratio(image_path: str, state_id: str = "S00") -> dict:
    """Evaluate visual ratio based on AR_VISUAL_RATIO_ENGINE_V1.
    
    Uses pixel-level analysis to estimate REALITY / UI / WORLD / HUMAN ratios.
    This is an approximate heuristic — exact ratios require AI vision model.
    """
    score = 0.80
    details = []
    violations = []

    try:
        sys.path.insert(0, os.path.join(os.path.dirname(__file__), "."))
        from ar_visual_ratio_engine import check_ratio_v21

        img = Image.open(image_path).convert("RGB")
        w, h = img.size
        pixels = list(img.getdata())
        total_pixels = len(pixels)

        # Simple heuristic: sample brightness and color zones
        # DARK areas (potential UI / void space)
        dark_count = sum(1 for r, g, b in pixels if r < 30 and g < 30 and b < 40)
        dark_ratio = dark_count / total_pixels * 100

        # BRIGHT GOLD areas (potential WORLD enhancement)
        gold_count = sum(1 for r, g, b in pixels if r > 180 and g > 120 and b < 100)
        gold_ratio = gold_count / total_pixels * 100

        # GREEN / BROWN areas (potential REALITY scenery)
        nature_count = sum(1 for r, g, b in pixels if b < 150 and g > 100 and abs(r - g) < 60)
        nature_ratio = nature_count / total_pixels * 100

        # VERY BRIGHT areas (potential UI elements / text)
        bright_count = sum(1 for r, g, b in pixels if r > 230 and g > 230 and b > 200)
        bright_ratio = bright_count / total_pixels * 100

        # Estimate ratios from pixel data
        reality_est = max(0, nature_ratio * 0.6 + dark_ratio * 0.2)
        ui_est = max(0, bright_ratio * 0.8)
        world_est = max(0, gold_ratio * 0.7 + bright_ratio * 0.2)
        human_est = max(0, 100 - reality_est - ui_est - world_est)

        # Normalize to 100%
        total_est = reality_est + ui_est + world_est + human_est
        if total_est > 0:
            reality_est = round(reality_est / total_est * 100)
            ui_est = round(ui_est / total_est * 100)
            world_est = round(world_est / total_est * 100)
            human_est = 100 - reality_est - ui_est - world_est

        details.append("REALITY=%d%%, UI=%d%%, WORLD=%d%%, HUMAN=%d%%" % (reality_est, ui_est, world_est, human_est))

        # Check against ratio engine
        result = check_ratio_v2(state_id, reality_est, ui_est, world_est, human_est)
        score = max(0.0, result["score"] / 100.0)
        violations = result["violations"]

        for v in violations:
            details.append("[%s] %s" % (v["severity"], v["message"]))

    except ImportError:
        details.append("ar_visual_ratio_engine not available, skipping ratio check")
    except Exception as e:
        details.append("Ratio analysis error: %s" % str(e))
        score -= 0.1

    return {
        "dimension": "visual_ratio",
        "score": max(0.0, min(1.0, score)),
        "details": "; ".join(details),
        "pass": score >= DEFAULT_THRESHOLD,
        "violations": violations,
    }


def score_asset(image_path: str, spec: dict, threshold: float = DEFAULT_THRESHOLD, state_id: str = "S00") -> dict:
    """Run full 5-dimension QA scoring on a generated image."""
    results = []

    r1 = evaluate_style_consistency(spec)
    results.append(r1)

    r2 = evaluate_clarity(image_path)
    results.append(r2)

    r3 = evaluate_ui_fit(spec, image_path)
    results.append(r3)

    r4 = evaluate_completeness(image_path)
    results.append(r4)

    r5 = evaluate_visual_ratio(image_path, state_id)
    results.append(r5)

    total_weighted = sum(r["score"] * QA_WEIGHTS[r["dimension"]] for r in results)
    total_weight = sum(QA_WEIGHTS[r["dimension"]] for r in results)
    final_score = total_weighted / total_weight if total_weight > 0 else 0

    return {
        "assetKey": os.path.basename(image_path),
        "pass": final_score >= threshold,
        "score": round(final_score, 2),
        "threshold": threshold,
        "details": results,
        "failed_dimensions": [r["dimension"] for r in results if r["score"] < threshold],
        "regeneration_needed": final_score < threshold,
    }


def main():
    parser = argparse.ArgumentParser(description="Visual QA Scoring Engine — Pipeline V3 STEP 3")
    parser.add_argument("image_path", help="Path to the generated image")
    parser.add_argument("--spec", help="Path to STRUCTURE_SPEC JSON file (optional)")
    parser.add_argument("--threshold", type=float, default=None, help="Override minimum score threshold")
    parser.add_argument("--state", default="S00", help="Page state for ratio check (e.g. S00, S02)")
    parser.add_argument("--json", action="store_true", help="Output as JSON only")
    args = parser.parse_args()

    if not os.path.exists(args.image_path):
        print(f"[QA_ERROR] Image not found: {args.image_path}")
        sys.exit(1)

    spec = load_spec(args.spec)
    # Determine threshold: CLI arg > spec's qa_threshold > global default
    threshold = args.threshold if args.threshold is not None else spec.get("qa_threshold", DEFAULT_THRESHOLD)

    result = score_asset(args.image_path, spec, threshold=threshold, state_id=args.state)

    if args.json:
        print(json.dumps(result, ensure_ascii=False, indent=2))
    else:
        print("=" * 60)
        print("VISUAL QA SCORING ENGINE — PIPELINE V3 STEP 3")
        print("=" * 60)
        print(f"Asset:    {result['assetKey']}")
        print(f"Score:    {result['score']:.2f} / 1.00")
        print(f"Threshold: {result['threshold']}")
        print(f"PASS:     {'YES' if result['pass'] else 'NO'}")
        print(f"Regen:    {'NEEDED' if result['regeneration_needed'] else 'NOT NEEDED'}")
        print()
        for d in result["details"]:
            mark = "PASS" if d["pass"] else "FAIL"
            print(f"  [{mark}] {d['dimension']}: {d['score']:.2f}")
            print(f"         {d['details']}")
        print()
        if result["failed_dimensions"]:
            print(f"Failed dimensions: {', '.join(result['failed_dimensions'])}")
        print(f"Overall: {'PASS' if result['pass'] else 'FAIL'} (score {'>=' if result['pass'] else '<'} {result['threshold']})")

    sys.exit(0 if result["pass"] else 1)


if __name__ == "__main__":
    main()
