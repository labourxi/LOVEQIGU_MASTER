#!/usr/bin/env python3
"""
LANDING PAGE — LAYER A: PORTAL-ONLY BACKGROUND GENERATION
===========================================================
Pipeline: VISUAL_PRODUCTION_PIPELINE_V3 STEP 2 (modified for layered approach)

STRATEGY CHANGE:
  Old approach: "生成一张包含 portal + UI + 微信按钮 + 导航的完整页面"
    → AI 被迫在 2048x2048 里同时处理"美学"和"精确 UI"，两样都做不好

  New approach:
    Layer A: PORTAL ONLY — 完全放开美学约束。不画 UI。不画按钮。
    Layer B: CSS overlay — 微信登录 + 导航入口，用代码精确渲染。
    
  这样 portal 能达到 AI 最好的美学水平，UI 也绝对正确。

PROMPT DESIGN PHILOSOPHY:
  不再使用结构化数字约束 ("portal 55-60%", "UI 18-22%")
  改用纯粹的美学描述、氛围、风格参考
  让 AI 自由发挥视觉创造力

USAGE:
  python scripts/generate_landing_portal_only.py              # 生成 5 个 portal 候选
  python scripts/generate_landing_portal_only.py --count 10   # 生成 10 个
  python scripts/generate_landing_portal_only.py --batch 5    # 生成 5 个

OUTPUT:
  candidates: assets/visual-autopilot/candidates/portal_*.jpg
  selected:   apps/miniapp/static/scene/landing_portal.jpg (人工程序后)
  raw:        assets/visual-autopilot/candidates/portal_raw_*.jpg
"""

import json, os, sys, time, shutil
from pathlib import Path
from urllib import request, error

ROOT = Path("D:/LOVEQIGU_MASTER")
PORTAL_RELEASE = ROOT / "apps/miniapp/static/scene/landing_portal.jpg"
CANDIDATES_DIR = ROOT / "assets/visual-autopilot/candidates"
QA_SCRIPT = ROOT / "scripts/qa_scoring_engine.py"
QA_THRESHOLD = 0.70  # Portal-only 美学评估更宽松，因为不检查 UI

# ── Load .env.local ──
ENV_PATH = ROOT / ".env.local"
if ENV_PATH.exists():
    try:
        from dotenv import load_dotenv
        load_dotenv(dotenv_path=ENV_PATH, override=True)
    except Exception:
        for line in ENV_PATH.read_text(encoding="utf-8").splitlines():
            stripped = line.strip()
            if not stripped or stripped.startswith("#") or "=" not in stripped:
                continue
            key, value = stripped.split("=", 1)
            key = key.strip()
            value = value.strip().strip("'").strip('"')
            if key:
                os.environ[key] = value

ARK_API_KEY = os.environ.get("ARK_API_KEY", "")
ENDPOINT = "https://ark.cn-beijing.volces.com/api/v3/images/generations"
MODEL = "doubao-seedream-5-0-260128"

# ═════════════════════════════════════════════════════════════════
# MULTIPLE PROMPT STYLES — AI 可以根据不同风格自由发挥
# ═════════════════════════════════════════════════════════════════

PROMPT_STYLES = {
    "sacred_gold": (
        "AIGU VALLEY — World Entry Portal, Sacred Gate style. "
        "Full mobile screen 9:16 portrait, 2048x2048 square canvas. "
        "NO user interface elements. NO buttons. NO text. NO navigation. "
        "This is a pure visual scene — a background layer only. "
        "Composition: A massive transdimensional portal at center, "
        "ethereal gold (#D4AF37) rings of light, concentric circles, "
        "deep violet (#5A1A7A) outer glow, volumetric sacred light beams "
        "descending from top of frame. "
        "Background: deepest cosmic void black (#050505) with subtle "
        "indigo (#0F0530) mist at edges. "
        "Atmosphere: sacred, awe, divine presence, world-revealing. "
        "Particles: tiny floating gold dust motes, slow motion, near portal rim only. "
        "The portal feels like a dimension door — an entrance to another world. "
        "Color palette: black, deep violet, gold, white-gold highlights. "
        "Lighting: volumetric glow, rim light on portal edges, "
        "soft radiance from portal center. "
        "Mood: tranquil awe, sacred anticipation, mystical grandeur. "
        "Art direction: inspired by ethereal sacred architecture, "
        "not sci-fi, not fantasy combat, not anime. "
        "This is a STILL IMAGE — no motion blur, no action. "
        "CRITICAL: pure background scene ONLY. No UI elements at all."
    ),

    "cosmic_mist": (
        "AIGU VALLEY — World Entry Portal, Cosmic Mist style. "
        "Full mobile screen 9:16 portrait, 2048x2048. "
        "NO user interface elements. NO buttons. NO text. NO navigation. "
        "Pure visual scene — background only. "
        "Composition: A luminous portal gate in lower-center, "
        "emerging from ethereal mist and cosmic fog. "
        "Multiple concentric rings of pale gold and pearl white, "
        "soft diffusion effect, rings partially veiled by mist. "
        "The portal feels like a tear in reality — a passage emerging. "
        "Background: deep space gradient from black to deep purple-blue. "
        "Subtle nebula-like cloud formations at edges. "
        "Atmosphere: mysterious, dreamlike, ethereal. "
        "Mist layers: semi-transparent fog drifting across the portal, "
        "creating depth and mystery. "
        "Particles: very fine, like distant stardust, scattered, not dense. "
        "Color palette: black, midnight blue, pale gold, pearl, violet-white. "
        "Lighting: soft diffused glow, no harsh edges, volumetric mist light. "
        "Mood: dreamy anticipation, calm wonder. "
        "Art direction: inspired by memories of a sacred place, "
        "soft focus, atmospheric, poetic. "
        "CRITICAL: pure background scene ONLY. No UI elements at all."
    ),

    "ancient_awakening": (
        "AIGU VALLEY — World Entry Portal, Ancient Awakening style. "
        "Full mobile screen 9:16 portrait, 2048x2048. "
        "NO user interface elements. NO buttons. NO text. NO navigation. "
        "Pure visual scene — background only. "
        "Composition: An ancient celestial gate awakening from darkness. "
        "The portal is framed by subtle geometric patterns — "
        "circles within circles, glowing rune-like lines in gold and amber. "
        "The center of the portal is a warm golden-white light source, "
        "like a sun rising through dimensional fabric. "
        "Background: deep charcoal black fading to warm dark brown at edges, "
        "with hints of amber and gold mist. "
        "Atmosphere: ancient wisdom awakening, timeless, monumental. "
        "The portal feels like it has been沉睡 for millennia and is now stirring. "
        "Texture: subtle — like weathered stone mixed with light, "
        "not smooth, not rough, just presence. "
        "Color palette: charcoal, warm dark brown, amber, gold, golden-white. "
        "Lighting: warm glow from center, cold darkness at edges, "
        "high contrast but soft transitions. "
        "Mood: solemn grandeur, ancient ritual, moment of awakening. "
        "Art direction: inspired by celestial mechanics and sacred geometry, "
        "feels old but not aged, timeless. "
        "CRITICAL: pure background scene ONLY. No UI elements at all."
    ),

    "pure_void_crown": (
        "AIGU VALLEY — World Entry Portal, Pure Void Crown style. "
        "Full mobile screen 9:16 portrait, 2048x2048. "
        "NO user interface elements. NO buttons. NO text. NO navigation. "
        "Pure visual scene — background only. "
        "Composition: A single luminous portal in absolute void. "
        "The portal is a crown-like structure of pure light — "
        "concentric arcs of gold and violet, arranged in a halo formation. "
        "The center emits a soft white-gold radiance. "
        "Background: absolute black (hex #000000), NO gradient, NO texture, "
        "NO mist, NO stars, NOTHING but pure void. "
        "The void makes the portal the ONLY focus — absolute dominance. "
        "Atmosphere: primal, meditative, the world before creation. "
        "The portal is not a door — IT IS the world seed. "
        "Particles: zero. No dust, no stars, no motes. Just the portal in void. "
        "Color palette: black, gold, violet, white-gold. "
        "Lighting: self-illuminated portal only, no ambient light, "
        "no rim light on edges of frame. "
        "Mood: absolute stillness, infinite potential, sacred emptiness. "
        "Art direction: 'Less is infinitely more' — "
        "the portal alone in void is the most powerful composition. "
        "CRITICAL: pure background scene ONLY. No UI elements at all."
    ),
}

DEFAULT_NEGATIVE = (
    "user interface, UI, button, text, label, icon, navigation, "
    "menu, input, form, login, WeChat, "
    "phoenix, dragon, warrior, weapon, anime, cartoon, "
    "human face, person, animal, "
    "mountain, forest, water, building, architecture, city, "
    "star field, galaxy, nebula, starry sky, "
    "rainbow, fluorescent, neon glow, "
    "realistic photo, 3D render, pixel art, "
    "busy, cluttered, noisy, chaotic"
)


def crop_square_to_9_16(img_bytes: bytes, output_path: Path, quality: int = 95) -> int:
    """Crop 2048x2048 to correct 9:16 → 1152x2048 → resize to 750x1333"""
    from PIL import Image
    import io
    img = Image.open(io.BytesIO(img_bytes))
    orig_w, orig_h = img.size
    target_w = int(orig_h * 9 / 16)
    left = (orig_w - target_w) // 2
    cropped = img.crop((left, 0, left + target_w, orig_h))
    new_h = int(750 * 16 / 9)
    resized = cropped.resize((750, new_h), Image.LANCZOS)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    resized.save(output_path, quality=quality)
    return output_path.stat().st_size


def download_image(url: str, timeout: int = 120) -> bytes:
    with request.urlopen(url, timeout=timeout) as resp:
        return resp.read()


def call_jimeng(prompt: str, negative_prompt: str, seed: int) -> dict:
    payload = {
        "model": MODEL,
        "prompt": prompt,
        "negative_prompt": negative_prompt,
        "size": "2048x2048",
        "response_format": "url",
        "seed": seed,
    }
    body = json.dumps(payload, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
    req = request.Request(ENDPOINT, data=body, method="POST")
    req.add_header("Content-Type", "application/json")
    req.add_header("Authorization", f"Bearer {ARK_API_KEY}")
    started = time.perf_counter()
    try:
        with request.urlopen(req, timeout=180) as resp:
            raw = resp.read().decode("utf-8", errors="replace")
            elapsed = int((time.perf_counter() - started) * 1000)
            data = json.loads(raw)
            return {"status": "ok", "data": data, "elapsed_ms": elapsed}
    except error.HTTPError as exc:
        raw = exc.read().decode("utf-8", errors="replace")
        return {"status": "error", "code": exc.code, "message": raw[:500]}
    except Exception as exc:
        return {"status": "error", "message": str(exc)}


def generate_portal(style_name: str, prompt: str, seed: int) -> dict:
    """Generate one portal candidate with given style and seed."""
    # ── 比例约束注入：生成前约束 ──
    sys.path.insert(0, str(ROOT / "scripts"))
    try:
        from ar_visual_ratio_engine import get_prompt_constraint_v21
        ratio_text = get_prompt_constraint_v21("S00")
        full_prompt = prompt + "\n\n" + ratio_text
    except ImportError:
        full_prompt = prompt

    stamp = int(time.time())
    raw_filename = f"portal_raw_{style_name}_s{seed}_{stamp}.jpg"
    crop_filename = f"portal_crop_{style_name}_s{seed}_{stamp}.jpg"
    raw_path = CANDIDATES_DIR / raw_filename
    crop_path = CANDIDATES_DIR / crop_filename

    print(f"\n{'─' * 50}")
    print(f"[{style_name}] seed={seed}")

    result = call_jimeng(full_prompt, DEFAULT_NEGATIVE, seed)
    if result["status"] != "ok":
        print(f"  API ERROR: {result.get('message', 'unknown')}")
        return {"style": style_name, "seed": seed, "status": "api_error"}

    image_url = None
    for entry in result["data"].get("data", []):
        if isinstance(entry, dict) and entry.get("url"):
            image_url = entry["url"]
            break

    if not image_url:
        print(f"  ERROR: No image URL")
        return {"style": style_name, "seed": seed, "status": "no_url"}

    print(f"  API: {result['elapsed_ms']}ms, URL ok")

    try:
        img_bytes = download_image(image_url)
        raw_path.write_bytes(img_bytes)
        print(f"  Raw saved: {raw_filename} ({len(img_bytes)} bytes)")
    except Exception as e:
        print(f"  Download error: {e}")
        return {"style": style_name, "seed": seed, "status": "download_error"}

    # Crop to 9:16
    try:
        crop_square_to_9_16(img_bytes, crop_path, quality=95)
        print(f"  Crop saved: {crop_filename}")
    except Exception as e:
        print(f"  Crop error: {e}")
        return {"style": style_name, "seed": seed, "status": "crop_error"}

    return {
        "style": style_name,
        "seed": seed,
        "raw_path": str(raw_path),
        "crop_path": str(crop_path),
        "status": "ok",
        "elapsed_ms": result["elapsed_ms"],
    }


def generate_all(count_per_style: int = 2):
    """Generate portal candidates across all styles."""
    CANDIDATES_DIR.mkdir(parents=True, exist_ok=True)

    style_names = list(PROMPT_STYLES.keys())
    total = len(style_names) * count_per_style

    print("=" * 60)
    print("LANDING PORTAL-ONLY GENERATION")
    print("=" * 60)
    print(f"Styles:       {len(style_names)}")
    print(f"Per style:    {count_per_style}")
    print(f"Total images: {total}")
    print()
    for sn in style_names:
        print(f"  - {sn}")
    print()

    all_results = []
    for style_name in style_names:
        prompt = PROMPT_STYLES[style_name]
        for i in range(count_per_style):
            seed = hash(f"{style_name}_{i}") % 10000 + 1
            result = generate_portal(style_name, prompt, seed)
            all_results.append(result)

    # Summary
    print(f"\n{'=' * 60}")
    print("GENERATION SUMMARY")
    print(f"{'=' * 60}")

    ok = [r for r in all_results if r["status"] == "ok"]
    failed = [r for r in all_results if r["status"] != "ok"]

    print(f"\nSuccessful: {len(ok)}/{total}")
    print(f"Failed:     {len(failed)}")

    for r in ok:
        print(f"  OK {r['style']} (seed={r['seed']})")
    for r in failed:
        print(f"  FAIL {r['style']} (seed={r.get('seed', '?')}) — {r.get('status', 'unknown')}")

    print(f"\n{'=' * 60}")
    print("ALL PORTAL RAW IMAGES")
    print(f"{'=' * 60}")
    for r in ok:
        print(f"  assets/visual-autopilot/candidates/{os.path.basename(r['raw_path'])}")
    print(f"\nALL PORTAL CROPPED IMAGES")
    for r in ok:
        print(f"  assets/visual-autopilot/candidates/{os.path.basename(r['crop_path'])}")
    print()

    # Generate report
    report_path = ROOT / "docs/production/PORTAL_ONLY_GENERATION_REPORT.md"
    with open(report_path, "w", encoding="utf-8") as f:
        f.write("# PORTAL-ONLY GENERATION REPORT\n\n")
        f.write(f"> **Date**: 2026-07-01\n")
        f.write(f"> **Engine**: {MODEL}\n")
        f.write(f"> **Styles**: {len(style_names)}\n")
        f.write(f"> **Total images**: {total}\n\n")
        f.write(f"| # | Style | Seed | Raw | Crop | Status |\n")
        f.write(f"|---|-------|------|-----|------|--------|\n")
        for i, r in enumerate(all_results, 1):
            raw_name = os.path.basename(r.get("raw_path", ""))
            crop_name = os.path.basename(r.get("crop_path", ""))
            f.write(f"| {i} | {r.get('style', '-')} | {r.get('seed', '-')} | {raw_name} | {crop_name} | {r.get('status', '-')} |\n")

    print(f"Report: {report_path}")
    print(f"\nNEXT STEP: Review the portal images. Pick the best one.")
    print(f"Then run:  python scripts/generate_landing_v3_batch.py --select")
    print(f"          (to re-rank existing V3 candidates with new criteria)")
    print()


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Landing Portal-Only Generator")
    parser.add_argument("--per-style", type=int, default=2, help="Images per style (total = 4 styles × N)")
    args = parser.parse_args()

    if not ARK_API_KEY:
        print("[FATAL] ARK_API_KEY not set.")
        sys.exit(1)

    generate_all(count_per_style=args.per_style)
