#!/usr/bin/env python3
"""LANDING_PAGE REAL IMAGE GENERATION — FIRST EXECUTION RUN
   Pipeline: VISUAL_PRODUCTION_PIPELINE_V3 STEP 2
   Engine: Jimeng (即梦) via Seedream Ark
   Input: STRUCTURE_SPEC_LANDING_V1
   Output: apps/miniapp/static/scene/aiqigu_landing_v1.jpg
"""

import json, os, sys, time
from pathlib import Path
from urllib import request, error

# ── Paths ──
ROOT = Path("D:/LOVEQIGU_MASTER")
OUTPUT = ROOT / "apps/miniapp/static/scene/aiqigu_landing_v1.jpg"

# ── Load .env.local (API keys) ──
ENV_PATH = ROOT / ".env.local"
if ENV_PATH.exists():
    try:
        from dotenv import load_dotenv
        load_dotenv(dotenv_path=ENV_PATH, override=False)
    except Exception:
        for line in ENV_PATH.read_text(encoding="utf-8").splitlines():
            stripped = line.strip()
            if not stripped or stripped.startswith("#") or "=" not in stripped:
                continue
            key, value = stripped.split("=", 1)
            key = key.strip()
            value = value.strip().strip("'").strip('"')
            if key and key not in os.environ:
                os.environ[key] = value

# ── API Config ──
ARK_API_KEY = os.environ.get("ARK_API_KEY", "")
ENDPOINT = "https://ark.cn-beijing.volces.com/api/v3/images/generations"
MODEL = "doubao-seedream-5-0-260128"

# ── Prompt from STRUCTURE_SPEC_LANDING_V1 (verbatim, no redesign) ──
# V1: Original prompt (used for first execution on 2026-07-01 15:19)
# V2: With VISUAL PRIORITY CONTROL RULES added (2026-07-01 15:55)
USE_V2_PROMPT = True  # Set to False to use V1 prompt

PROMPT_V1 = (
    "AIGU VALLEY landing page — full mobile screen. "
    "Sacred futuristic space entry scene. "
    "Deep black (#050510) to indigo (#1A0A3E) gradient background. "
    "Center: a luminous rotating energy portal gate — concentric rings of violet (#7B2D8E) "
    "and gold light (#E8C86A), volumetric soft glow emanating outward, misty energy tendrils. "
    "Floating star dust particles scattered throughout, slow drift. "
    "Atmosphere: solemn, ethereal, sacred space — NOT sci-fi combat. "
    "Top center: thin white glow text 'AR游伴' (27px, delicate, glowing). "
    "Bottom center: glowing energy button '进入世界' with subtle gold pulse. "
    "Bottom left: '故事' text. Bottom right: '说明' text. "
    "Minimal UI density — generous negative space. "
    "Oriental mystic sci-fi aesthetic — Eastern philosophical imagery fused with futuristic visual language. "
    "Composition: center-dominant symmetrical, portal as visual anchor. "
    "Material: energy mist, glass-like refraction, subtle neon edge glow. "
    "Motion hint: slow particle flow."
)

PROMPT_V2 = (
    "AIGU VALLEY landing page — full mobile screen. "
    "Sacred futuristic space entry scene. "
    "Deep black (#050510) to indigo (#1A0A3E) gradient background. "
    "Center: a luminous rotating energy portal gate — concentric rings of violet (#7B2D8E) "
    "and gold light (#E8C86A), volumetric soft glow emanating outward, misty energy tendrils. "
    "Floating star dust particles scattered throughout, slow drift. "
    "Atmosphere: solemn, ethereal, sacred space — NOT sci-fi combat. "
    "Top center: thin white glow text 'AR游伴' (27px, delicate, glowing). "
    "Bottom center: glowing energy button '进入世界' with subtle gold pulse. "
    "Bottom left: '故事' text. Bottom right: '说明' text. "
    "Minimal UI density — generous negative space. "
    "Oriental mystic sci-fi aesthetic — Eastern philosophical imagery fused with futuristic visual language. "
    "Composition: center-dominant symmetrical, portal as visual anchor. "
    "Material: energy mist, glass-like refraction, subtle neon edge glow. "
    "Motion hint: slow particle flow. "
    "VISUAL PRIORITY CONTROL RULES: "
    "[CENTER_ANCHOR] Portal gate is STRICT DOMINANT element — 60-70% of visual weight. "
    "Background must NOT compete with portal. "
    "[UI_SUPPRESSION] UI elements occupy under 15% of canvas. "
    "Top 20% of canvas: ONLY title text. Bottom 25% of canvas: ONLY bottom CTAs. "
    "No decorative elements in UI zones. "
    "[BACKGROUND_NON_COMPETITION] Background is strictly a canvas — gradient + particles only. "
    "No foreground objects. No complex textures. No competing focal points. "
    "[Z_ORDER] Strict layer separation: Background bottom → Particles → Portal → UI text/buttons on top. "
    "Portal must NOT overlap text or CTA zones."
)

PROMPT = PROMPT_V2 if USE_V2_PROMPT else PROMPT_V1
PROMPT_USED = "V2 (with VISUAL PRIORITY CONTROL RULES)" if USE_V2_PROMPT else "V1"

NEGATIVE_PROMPT = (
    "phoenix, dragon, warrior, weapon, anime, cartoon, neon overglow, "
    "game UI elements, rainbow gradient, high-purity fluorescent colors, "
    "human face, text watermark, logo, realistic photo, cluttered, "
    "high UI density, asymmetrical composition, "
    "dark forest colors (#0A1A14), gold accent (#C8A24A), ink-wash style, "
    "mountain valley, fog"
)

print("=" * 60)
print("LANDING PAGE REAL IMAGE GENERATION (FIRST EXECUTION)")
print("=" * 60)
print(f"Output: {OUTPUT}")
print(f"Engine: 即梦 (Jimeng) via Seedream Ark")
print(f"Prompt: {PROMPT_USED}")
print(f"Model:  {MODEL}")
print(f"KEY:     {'SET (%s...)' % ARK_API_KEY[:12] if ARK_API_KEY else 'NOT SET'}")
print()

if not ARK_API_KEY:
    print("[FATAL] ARK_API_KEY not set.")
    sys.exit(1)

# ── Build API payload ──
payload = {
    "model": MODEL,
    "prompt": PROMPT,
    "negative_prompt": NEGATIVE_PROMPT,
    "size": "2048x2048",
    "response_format": "url",
    "seed": 42,
}

body = json.dumps(payload, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
req = request.Request(ENDPOINT, data=body, method="POST")
req.add_header("Content-Type", "application/json")
req.add_header("Authorization", f"Bearer {ARK_API_KEY}")

print("[SEEDREAM_ARK] Calling API...")
started = time.perf_counter()

try:
    with request.urlopen(req, timeout=180) as resp:
        raw = resp.read().decode("utf-8", errors="replace")
        elapsed = int((time.perf_counter() - started) * 1000)
        print(f"[SEEDREAM_ARK] HTTP {resp.status} in {elapsed}ms")
        data = json.loads(raw)
except error.HTTPError as exc:
    raw = exc.read().decode("utf-8", errors="replace")
    elapsed = int((time.perf_counter() - started) * 1000)
    print(f"[SEEDREAM_ARK] HTTP {exc.code} in {elapsed}ms: {raw[:500]}")
    sys.exit(1)
except Exception as exc:
    print(f"[SEEDREAM_ARK] Error: {exc}")
    sys.exit(1)

# ── Extract image URL ──
image_url = None
for entry in data.get("data", []):
    if isinstance(entry, dict):
        url = entry.get("url")
        if url:
            image_url = url
            break

if not image_url:
    print(f"[SEEDREAM_ARK] No image URL in response: {json.dumps(data, ensure_ascii=False)[:500]}")
    sys.exit(1)

print(f"[SEEDREAM_ARK] Image URL received ({len(image_url)} chars)")

# ── Download ──
print("[SEEDREAM_ARK] Downloading...")
try:
    with request.urlopen(image_url, timeout=120) as img_resp:
        img_bytes = img_resp.read()
except Exception as exc:
    print(f"[SEEDREAM_ARK] Download failed: {exc}")
    sys.exit(1)

raw_size = len(img_bytes)
print(f"[SEEDREAM_ARK] Downloaded {raw_size} bytes")

# ── Crop square (2048x2048) to 9:16 portrait (1152x2048) then resize to 750x1624 ──
try:
    from PIL import Image
    import io
    img = Image.open(io.BytesIO(img_bytes))
    orig_w, orig_h = img.size
    print(f"[CROP] Original: {orig_w}x{orig_h}")

    target_w = int(orig_h * 9 / 16)
    left = (orig_w - target_w) // 2
    cropped = img.crop((left, 0, left + target_w, orig_h))
    resized = cropped.resize((750, 1624), Image.LANCZOS)
    print(f"[CROP] Final: 750x1624 (9:16)")

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    resized.save(OUTPUT, quality=95)
    final_size = OUTPUT.stat().st_size
    print(f"[SAVE] Saved to {OUTPUT} ({final_size} bytes)")

except ImportError:
    # Fallback: save raw and crop manually
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_bytes(img_bytes)
    print(f"[SAVE] Saved raw (no Pillow for crop): {OUTPUT} ({raw_size} bytes)")
    final_size = raw_size

# ── Also backup to candidates ──
CANDIDATES = ROOT / "assets/visual-autopilot/candidates"
CANDIDATES.mkdir(parents=True, exist_ok=True)
backup = CANDIDATES / f"landing_v1_execution_run1_{int(time.time())}.png"
backup.write_bytes(img_bytes)
print(f"[BACKUP] Saved to {backup}")

# ── STEP 3: QA SCORING GATE (mandatory) ──
QA_SPEC = ROOT / "assets/visual-pipeline/landing_v1/landing_v1_generation_spec.json"
sys.path.insert(0, str(ROOT / "scripts"))
from pipeline_step3_qa import qa_gate

qa_passed, qa_result = qa_gate(str(OUTPUT), str(QA_SPEC) if QA_SPEC.exists() else None)

if not qa_passed:
    score = qa_result.get("score", 0)
    print(f"\n[QA_GATE_BLOCKED] Score {score:.2f} < 0.70. Asset NOT registered.")
    print(f"[QA_GATE_BLOCKED] Failed dimensions: {qa_result.get('failed_dimensions', [])}")
    print(f"[QA_GATE_BLOCKED] Image remains at {OUTPUT} but is NOT in asset system.")
    print(f"\n[RESULT] GENERATION FAILED — QA GATE BLOCKED")
    sys.exit(1)

print(f"\n[QA_GATE] PASSED — asset cleared for registration.")
print(f"  QA Score: {qa_result.get('score', 0):.2f} / 1.00")

print()
print("[RESULT] GENERATION COMPLETE")
print(f"  Status:     SUCCESS")
print(f"  File:       {OUTPUT}")
print(f"  Size:       {final_size} bytes")
print(f"  Dimensions: 750x1624 (9:16)")
print(f"  Provider:   即梦 (Jimeng) via Seedream Ark")
print(f"  QA Score:   {qa_result.get('score', 0):.2f} / 1.00")
