#!/usr/bin/env python3
"""LANDING PAGE V2 — GEMINI GENERATION (STANDBON)
   Fallback from Seedream Ark to Gemini when ARK_API_KEY is invalid.
   Input: V2 WORLD ENTRY prompt from STRUCTURE_SPEC_LANDING_V2
   Output: apps/miniapp/static/scene/landing_v2_world_entry.jpg
"""

import json, os, sys, time
from pathlib import Path
from urllib import request, error

ROOT = Path("D:/LOVEQIGU_MASTER")
OUTPUT = ROOT / "apps/miniapp/static/scene/landing_v2_world_entry.jpg"

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
ENDPOINT = (
    "https://generativelanguage.googleapis.com/v1beta/models/"
    "gemini-3.1-flash-image:generateContent"
)

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
    "(center, 75-85%) → Ritual glyph UI layer (symbolic fragments only). "
    "Generate as 9:16 portrait aspect ratio image. "
    "Style: oriental mystical, sacred, world descending portal."
)

payload = {
    "contents": [{"parts": [{"text": PROMPT_V2}]}],
    "generationConfig": {
        "temperature": 0.85,
        "topP": 0.95,
        "topK": 40,
        "candidateCount": 1,
    },
}

print("=" * 60)
print("LANDING PAGE V2 — GEMINI GENERATION (STANDBON)")
print("=" * 60)
print(f"Output: {OUTPUT}")
print(f"Engine: Gemini 2.5 Flash Image")
print(f"KEY:    {'SET (%s...)' % GEMINI_API_KEY[:12] if GEMINI_API_KEY else 'NOT SET'}")
print()

if not GEMINI_API_KEY:
    print("[FATAL] GEMINI_API_KEY not set.")
    sys.exit(1)

body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
req = request.Request(ENDPOINT, data=body, method="POST")
req.add_header("Content-Type", "application/json")
req.add_header("x-goog-api-key", GEMINI_API_KEY)

print("[GEMINI] Calling API...")
started = time.perf_counter()

try:
    with request.urlopen(req, timeout=120) as resp:
        raw = resp.read().decode("utf-8", errors="replace")
        elapsed = int((time.perf_counter() - started) * 1000)
        print(f"[GEMINI] HTTP {resp.status} in {elapsed}ms")
        data = json.loads(raw)
except error.HTTPError as exc:
    raw = exc.read().decode("utf-8", errors="replace")
    elapsed = int((time.perf_counter() - started) * 1000)
    print(f"[GEMINI] HTTP {exc.code} in {elapsed}ms: {raw[:1000]}")
    sys.exit(1)
except Exception as exc:
    print(f"[GEMINI] Error: {exc}")
    sys.exit(1)

# ── Extract inline image data (Gemini returns base64 inline) ──
img_bytes = None
candidates = data.get("candidates", [])
if candidates:
    parts = candidates[0].get("content", {}).get("parts", [])
    for part in parts:
        inline_data = part.get("inlineData", {})
        if inline_data and inline_data.get("mimeType", "").startswith("image/"):
            import base64
            img_bytes = base64.b64decode(inline_data["data"])
            print(f"[GEMINI] Inline image data: {len(img_bytes)} bytes ({inline_data.get('mimeType')})")
            break

if not img_bytes:
    print(f"[GEMINI] No image data in response: {json.dumps(data, ensure_ascii=False)[:1000]}")
    sys.exit(1)

raw_size = len(img_bytes)

# ── Save (no crop needed if Gemini respects 9:16) ──
OUTPUT.parent.mkdir(parents=True, exist_ok=True)
OUTPUT.write_bytes(img_bytes)
final_size = OUTPUT.stat().st_size
print(f"[SAVE] Saved to {OUTPUT} ({final_size} bytes)")

# ── Backup ──
CANDIDATES = ROOT / "assets/visual-autopilot/candidates"
CANDIDATES.mkdir(parents=True, exist_ok=True)
backup = CANDIDATES / f"landing_v2_world_entry_gemini_{int(time.time())}.jpg"
backup.write_bytes(img_bytes)
print(f"[BACKUP] Saved to {backup}")

# ── QA Gate ──
SPEC = ROOT / "assets/visual-pipeline/landing_v1/landing_v2_generation_spec.json"
sys.path.insert(0, str(ROOT / "scripts"))
from pipeline_step3_qa import qa_gate

qa_passed, qa_result = qa_gate(str(OUTPUT), str(SPEC) if SPEC.exists() else None)

if not qa_passed:
    score = qa_result.get("score", 0)
    print(f"\n[QA_GATE_BLOCKED] Score {score:.2f} < 0.70. Asset NOT registered.")
    print(f"\n[RESULT] GENERATION FAILED — QA GATE BLOCKED")
    sys.exit(1)

print(f"\n[QA_GATE] PASSED — score: {qa_result.get('score', 0):.2f} / 1.00")

print()
print("[RESULT] GENERATION COMPLETE")
print(f"  Status:     SUCCESS")
print(f"  File:       {OUTPUT}")
print(f"  Size:       {final_size} bytes")
print(f"  Provider:   Gemini 2.5 Flash Image")
print(f"  QA Score:   {qa_result.get('score', 0):.2f} / 1.00")
