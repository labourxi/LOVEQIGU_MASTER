#!/usr/bin/env python3
"""LANDING_PAGE V3 PRODUCTION RELEASE BUILD
   Pipeline: VISUAL_PRODUCTION_PIPELINE_V3 STEP 2
   Engine: Jimeng (即梦) via Seedream Ark
   Input: STRUCTURE_SPEC_LANDING_V3
   Output: apps/miniapp/static/scene/landing_v3_release.jpg
   QA Threshold: 0.80 (production gate)
"""

import json, os, sys, time
from pathlib import Path
from urllib import request, error

ROOT = Path("D:/LOVEQIGU_MASTER")
OUTPUT = ROOT / "apps/miniapp/static/scene/landing_v3_release.jpg"
SPEC = ROOT / "assets/visual-pipeline/landing_v1/landing_v3_generation_spec.json"
CANDIDATES = ROOT / "assets/visual-autopilot/candidates"
QA_THRESHOLD = 0.80

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

ARK_API_KEY = os.environ.get("ARK_API_KEY", "")
ENDPOINT = "https://ark.cn-beijing.volces.com/api/v3/images/generations"
MODEL = "doubao-seedream-5-0-260128"

PROMPT_V3 = (
    "AIGU VALLEY landing page V3 — PRODUCTION RELEASE BUILD. "
    "Final shipping version for mini program. "
    "Full mobile screen 9:16 portrait. "
    "This is a WORLD ENTRY page that is also a FULLY FUNCTIONAL PRODUCT ENTRY. "
    "Portal gate occupies 55-60% of canvas — moderate dominance that leaves substantial room "
    "for bottom UI navigation. "
    "Pure void background — deepest black (#050505) fading to indigo void (#0F0530). "
    "Zero background objects. Zero textures. Zero competing elements. "
    "Background is pure void canvas — serves atmosphere only. "
    "Center: WORLD ENTRY GATE — transdimensional portal, "
    "concentric rings of ethereal gold (#D4AF37) and deep violet (#5A1A7A), "
    "volumetric divine glow, dimension door style. "
    "Portal rim has minimal resonance particles — gold/violet dust near portal edge only. "
    "Atmosphere: sacred, awe, world-descending — NOT sci-fi combat. "
    "Top center: ritual light script 'AR游伴' — thin calligraphic divine glow, minimal signature. "
    "Bottom zone is CRITICAL for usability — it must contain ALL of the following elements: "
    "[1] WECHAT LOGIN BUTTON: prominent green button with WeChat icon, text '微信一键登录'. "
    "This is the primary action. Button must look like a standard WeChat OAuth login button — "
    "green background, white WeChat icon, clear readable text. "
    "[2] BUSINESS ENTRY ROW: four icon+text entries in a horizontal row below the login button — "
    "'探索' with compass icon, '地图' with map icon, "
    "'权益' with reward icon, '我的' with profile icon. "
    "Each entry must be clearly readable as a navigation action. "
    "UI density is production balanced — 18-22% of canvas. "
    "Bottom 30% of canvas is dedicated to login button + 4 business entries. "
    "The user is entering a world through WeChat login and immediately seeing all available actions. "
    "VISUAL PRIORITY CONTROL RULES: "
    "[CENTER_ANCHOR] Portal 55-60% — leaves room for navigation. "
    "[LOGIN] WeChat login button is green with icon — non-negotiable visible. "
    "[BUSINESS] Four entries (探索·地图·权益·我的) visible as icon+text row. "
    "[BACKGROUND] Pure void. "
    "[Z_ORDER] Void → particles → Portal → Title → WeChat login → Business nav row."
)

NEGATIVE_PROMPT = (
    "phoenix, dragon, warrior, weapon, anime, cartoon, neon overglow, "
    "rainbow gradient, high-purity fluorescent colors, "
    "human face, text watermark, realistic photo, cluttered, "
    "asymmetrical composition, "
    "dark forest colors (#0A1A14), ink-wash style, "
    "mountain valley, fog, waterfall, temple, architecture, "
    "city, stars, galaxy, nebula, starfield, "
    "busy background, decorative background, "
    "3D model, rendering, photorealistic, pixel art, "
    "metaphorical text, abstract UI, non-functional UI, "
    "poetic replacement for login"
)

print("=" * 60)
print("LANDING PAGE V3 — PRODUCTION RELEASE BUILD")
print("=" * 60)
print(f"Output: {OUTPUT}")
print(f"Engine: 即梦 (Jimeng) via Seedream Ark")
print(f"Model:  {MODEL}")
print(f"KEY:    {'SET (%s...)' % ARK_API_KEY[:12] if ARK_API_KEY else 'NOT SET'}")
print(f"QA Threshold: >= {QA_THRESHOLD}")
print()

if not ARK_API_KEY:
    print("[FATAL] ARK_API_KEY not set.")
    sys.exit(1)

payload = {
    "model": MODEL,
    "prompt": PROMPT_V3,
    "negative_prompt": NEGATIVE_PROMPT,
    "size": "2048x2048",
    "response_format": "url",
    "seed": 45,
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

print("[SEEDREAM_ARK] Downloading...")
try:
    with request.urlopen(image_url, timeout=120) as img_resp:
        img_bytes = img_resp.read()
except Exception as exc:
    print(f"[SEEDREAM_ARK] Download failed: {exc}")
    sys.exit(1)

raw_size = len(img_bytes)
print(f"[SEEDREAM_ARK] Downloaded {raw_size} bytes")

# ── Crop square to 9:16 ──
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

# ── Backup ──
CANDIDATES.mkdir(parents=True, exist_ok=True)
backup = CANDIDATES / f"landing_v3_release_{int(time.time())}.jpg"
backup.write_bytes(img_bytes)
print(f"[BACKUP] Saved to {backup}")

# ── QA GATE (threshold 0.80 — production gate) ──
sys.path.insert(0, str(ROOT / "scripts"))
from pipeline_step3_qa import qa_gate

qa_passed, qa_result = qa_gate(str(OUTPUT), str(SPEC) if SPEC.exists() else None, threshold=QA_THRESHOLD)

if not qa_passed:
    score = qa_result.get("score", 0)
    print(f"\n[QA_GATE_BLOCKED] Score {score:.2f} < {QA_THRESHOLD}. Asset NOT registered.")
    print(f"[QA_GATE_BLOCKED] Failed dimensions: {qa_result.get('failed_dimensions', [])}")
    print(f"\n[RESULT] GENERATION FAILED — QA GATE BLOCKED")
    sys.exit(1)

print(f"\n[QA_GATE] PASSED — asset cleared for registration.")
print(f"  QA Score: {qa_result.get('score', 0):.2f} / 1.00 (threshold: {QA_THRESHOLD})")

print()
print("[RESULT] GENERATION COMPLETE")
print(f"  Status:     SUCCESS")
print(f"  File:       {OUTPUT}")
print(f"  Size:       {final_size} bytes")
print(f"  Dimensions: 750x1624 (9:16)")
print(f"  Provider:   即梦 (Jimeng) via Seedream Ark")
print(f"  QA Score:   {qa_result.get('score', 0):.2f} / 1.00 (threshold: {QA_THRESHOLD})")
