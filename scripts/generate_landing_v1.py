#!/usr/bin/env python3
"""landing_v1 generation via Seedream Ark (即梦 / Doubao Seedream).

Primary: 即梦 (Jimeng) via Volcengine Ark API
Fallback: Stable Diffusion (stub)
"""

import json, os, sys, time
from pathlib import Path
from urllib import request, error

ROOT = Path(__file__).resolve().parents[2]
OUTPUT = ROOT / "apps/miniapp/static/scene/landing_v1_final.png"

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

ARK_API_KEY = os.environ.get("ARK_API_KEY", "")
ENDPOINT = "https://ark.cn-beijing.volces.com/api/v3/images/generations"
MODEL = "doubao-seedream-5-0-260128"


def try_seedream_ark() -> bool:
    """Try primary provider: 即梦 via Seedream Ark API."""
    if not ARK_API_KEY:
        print("[SEEDREAM_ARK] No ARK_API_KEY set. Skipping.")
        return False

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

    print(f"[SEEDREAM_ARK] Calling {ENDPOINT} with model={MODEL}")
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
        return False
    except Exception as exc:
        print(f"[SEEDREAM_ARK] ERROR: {exc}")
        return False

    # Extract image URL from response
    image_url = None
    if isinstance(data, dict):
        for entry in data.get("data", []):
            if isinstance(entry, dict):
                url = entry.get("url") or entry.get("image_url") or entry.get("b64_json")
                if url:
                    image_url = url
                    break

    if not image_url:
        print(f"[SEEDREAM_ARK] No image URL in response: {json.dumps(data, ensure_ascii=False)[:500]}")
        return False

    # Download image
    print(f"[SEEDREAM_ARK] Downloading image from {image_url[:80]}...")
    try:
        with request.urlopen(image_url, timeout=120) as img_resp:
            img_bytes = img_resp.read()
    except Exception as exc:
        print(f"[SEEDREAM_ARK] Download failed: {exc}")
        return False

    # Save to target path
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_bytes(img_bytes)
    print(f"[SEEDREAM_ARK] Saved to {OUTPUT} ({len(img_bytes)} bytes)")
    return True


def main():
    print("=" * 60)
    print("LANDING_V1 GENERATION")
    print("=" * 60)
    print(f"Output: {OUTPUT}")
    print(f"ARK_API_KEY: {'SET (%s...)' % ARK_API_KEY[:8] if ARK_API_KEY else 'NOT SET'}")
    print()

    # Try primary: Seedream Ark (即梦)
    print("[1/2] Trying Seedream Ark (即梦, primary)...")
    if try_seedream_ark():
        print("\n[RESULT] SUCCESS — generated via Seedream Ark")
        return

    print("\n[2/2] Primary failed — checking fallback...")
    print("[FALLBACK] No SD API key available. Cannot generate.")
    print("\n[RESULT] FAILED — all providers exhausted.")
    sys.exit(1)


if __name__ == "__main__":
    main()
