#!/usr/bin/env python3
"""LANDING_PAGE V2 WORLD ENTRY GENERATION — SECOND EXECUTION RUN
   Pipeline: VISUAL_PRODUCTION_PIPELINE_V3 STEP 2
   Engine: Jimeng (即梦) via Seedream Ark
   Input: STRUCTURE_SPEC_LANDING_V2
   Upgrade: Visual priority 0.75-0.85, UI < 10%, ritual copy, world gate feel
   Output: apps/miniapp/static/scene/landing_v2_world_entry.jpg
"""

import json, os, sys, time
from pathlib import Path
from urllib import request, error

# ── Paths ──
ROOT = Path("D:/LOVEQIGU_MASTER")
OUTPUT = ROOT / "apps/miniapp/static/scene/landing_v2_world_entry.jpg"
SPEC = ROOT / "assets/visual-pipeline/landing_v1/landing_v2_generation_spec.json"
CANDIDATES = ROOT / "assets/visual-autopilot/candidates"

# ── Load .env.local (API keys) ──
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
            if key and key not in os.environ:
                os.environ[key] = value
            elif key:
                os.environ[key] = value  # override existing

# ── API Config ──
ARK_API_KEY = os.environ.get("ARK_API_KEY", "")
ENDPOINT = "https://ark.cn-beijing.volces.com/api/v3/images/generations"
MODEL = "doubao-seedream-5-0-260128"

# ── PROMPT V2 WORLD ENTRY (from STRUCTURE_SPEC_LANDING_V2) ──
PROMPT_V2 = (
    "AIGU VALLEY landing page V2 — WORLD ENTRY INVOCATION. "
    "Full mobile screen 9:16. "
    "NOT a product page. NOT a UI page. "
    "This is a WORLD DESCENDING RITUAL visual. "
    "Portal gate occupies 75-85% of canvas — ABSOLUTE DOMINANCE. "
    "Pure void background — deepest black (#050505) fading to indigo void (#0F0530). "
    "Zero background objects. Zero textures. Zero competing elements. "
    "Background is NOT a scene — it is VOID. "
    "Center: WORLD ENTRY GATE — a massive transdimensional portal, "
    "larger than V1, 240px equivalent visual weight. "
    "Concentric rings of ethereal gold (#D4AF37) and deep violet (#5A1A7A), "
    "volumetric divine glow, gate feels like a DIMENSION DOOR not a technology portal. "
    "Portal rim has minimal resonance particles — gold/violet dust, "
    "only near portal edge, NOT scattered across screen. "
    "Atmosphere: sacred, world-descending, awe — "
    "NOT sci-fi, NOT game UI, NOT combat. "
    "Top center: ritual light script 'AR游伴' — 24px, divine glow, "
    "thin calligraphic style, visual weight is MINIMAL SIGNATURE only, like a seal. "
    "Bottom center: invocation glyph '谒见世界' — 14px, gate ring style, "
    "symbolic presence NOT functional button. "
    "Bottom left: ancient fragment '往世书'. "
    "Bottom right: light inscription '启明录'. "
    "All UI text reads as RITUAL FRAGMENTS not product UI. "
    "UI density is SYMBOLIC ONLY — under 10% of canvas. "
    "The ONLY visual subject is the world entry gate. "
    "The user is not using an app — they are WITNESSING A WORLD ENTERING. "
    "VISUAL PRIORITY CONTROL RULES: "
    "[CENTER_ANCHOR] Portal 75-85% absolute dominance. Only subject. "
    "[UI_SUPPRESSION] UI < 10%. Top 15% of canvas: title seal only. "
    "Bottom 20%: ritual CTAs only. No decorative elements anywhere. "
    "[BACKGROUND] Pure void. Zero competition. Only gradient + minimal portal-rim particles. "
    "[Z_ORDER] Void background → minimal portal particles → World Entry Gate "
    "(center, 75-85%) → Ritual glyph UI layer (symbolic fragments only)."
)

NEGATIVE_PROMPT = (
    "phoenix, dragon, warrior, weapon, anime, cartoon, neon overglow, "
    "game UI elements, rainbow gradient, high-purity fluorescent colors, "
    "human face, text watermark, logo, realistic photo, cluttered, "
    "high UI density, asymmetrical composition, "
    "dark forest colors (#0A1A14), gold accent (#C8A24A), ink-wash style, "
    "mountain valley, fog, waterfall, temple, architecture, "
    "city, stars, galaxy, nebula, starfield, "
    "busy background, decorative background, competing focal points, "
    "product UI, button, functional UI, app store style, "
    "flat design, material design, glassmorphism, "
    "3D model, rendering, photorealistic, pixel art"
)

print("=" * 60)
print("LANDING PAGE V2 — WORLD ENTRY GENERATION")
print("=" * 60)
print(f"Output: {OUTPUT}")
print(f"Engine: 即梦 (Jimeng) via Seedream Ark")
print(f"Model:  {MODEL}")
print(f"KEY:    {'SET (%s...)' % ARK_API_KEY[:12] if ARK_API_KEY else 'NOT SET'}")
print()

if not ARK_API_KEY:
    print("[FATAL] ARK_API_KEY not set.")
    sys.exit(1)

# ── Build API payload ──
payload = {
    "model": MODEL,
    "prompt": PROMPT_V2,
    "negative_prompt": NEGATIVE_PROMPT,
    "size": "2048x2048",
    "response_format": "url",
    "seed": 43,
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
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_bytes(img_bytes)
    print(f"[SAVE] Saved raw (no Pillow for crop): {OUTPUT} ({raw_size} bytes)")
    final_size = raw_size

# ── Also backup to candidates ──
CANDIDATES.mkdir(parents=True, exist_ok=True)
backup = CANDIDATES / f"landing_v2_world_entry_{int(time.time())}.jpg"
backup.write_bytes(img_bytes)
print(f"[BACKUP] Saved to {backup}")

# ── STEP 3: QA SCORING GATE (mandatory) ──
sys.path.insert(0, str(ROOT / "scripts"))
from pipeline_step3_qa import qa_gate

qa_passed, qa_result = qa_gate(str(OUTPUT), str(SPEC) if SPEC.exists() else None)

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
