#!/usr/bin/env python3
"""Save landing_v1 generated image to correct path."""
import json, os, sys, time
from pathlib import Path
from urllib import request, error

ROOT = Path("D:/LOVEQIGU_MASTER")
OUTPUT = ROOT / "apps/miniapp/static/scene/landing_v1_final.png"
CANDIDATES = ROOT / "assets/visual-autopilot/candidates"

ARK_API_KEY = os.environ.get("ARK_API_KEY", "")
ENDPOINT = "https://ark.cn-beijing.volces.com/api/v3/images/generations"
MODEL = "doubao-seedream-5-0-260128"

PROMPT = (
    "AIGU VALLEY landing page full mobile screen. "
    "Sacred futuristic space entry scene. "
    "Deep black (#050510) to indigo (#1A0A3E) gradient background. "
    "Center: a luminous rotating energy portal gate with concentric rings of violet (#7B2D8E) "
    "and gold light (#E8C86A), volumetric soft glow emanating outward, misty energy tendrils. "
    "Floating star dust particles scattered throughout, slow drift. "
    "Atmosphere: solemn, ethereal, sacred space. "
    "Top center: thin white glow text AR游伴. "
    "Bottom center: glowing energy button 进入世界 with subtle gold pulse. "
    "Bottom left: story text. Bottom right: info text. "
    "Minimal UI density, generous negative space. "
    "Oriental mystic sci-fi aesthetic. "
    "Composition center-dominant symmetrical, portal as visual anchor. "
    "Material: energy mist, glass-like refraction, subtle neon edge glow."
)

NEGATIVE_PROMPT = (
    "phoenix, dragon, warrior, weapon, anime, cartoon, neon overglow, "
    "game UI elements, rainbow gradient, high-purity fluorescent colors, "
    "human face, text watermark, logo, realistic photo, cluttered, "
    "high UI density, asymmetrical composition"
)

print("=" * 60)
print("LANDING_V1 GENERATION (corrected path)")
print("=" * 60)
print(f"Output: {OUTPUT}")
print(f"ARK_API_KEY: {'SET' if ARK_API_KEY else 'NOT SET'}")

if not ARK_API_KEY:
    print("[FATAL] No ARK_API_KEY.")
    sys.exit(1)

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

print(f"[SEEDREAM_ARK] Generating...")
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

# Extract image URL
image_url = None
for entry in data.get("data", []):
    if isinstance(entry, dict):
        url = entry.get("url")
        if url:
            image_url = url
            break

if not image_url:
    print(f"[SEEDREAM_ARK] No URL in response: {json.dumps(data, ensure_ascii=False)[:300]}")
    sys.exit(1)

# Download
print(f"[SEEDREAM_ARK] Downloading...")
try:
    with request.urlopen(image_url, timeout=120) as img_resp:
        img_bytes = img_resp.read()
except Exception as exc:
    print(f"[SEEDREAM_ARK] Download failed: {exc}")
    sys.exit(1)

# Save to both candidate dir and final static dir
OUTPUT.parent.mkdir(parents=True, exist_ok=True)
OUTPUT.write_bytes(img_bytes)
print(f"[SEEDREAM_ARK] Saved to {OUTPUT} ({len(img_bytes)} bytes)")

CANDIDATES.mkdir(parents=True, exist_ok=True)
candidate_path = CANDIDATES / f"landing_v1_seedream_{int(time.time())}.png"
candidate_path.write_bytes(img_bytes)
print(f"[SEEDREAM_ARK] Backup to {candidate_path}")

print(f"\n[RESULT] SUCCESS")
print(f"  Output: {OUTPUT}")
print(f"  Size: {len(img_bytes)} bytes")
