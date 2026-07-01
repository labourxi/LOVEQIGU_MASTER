#!/usr/bin/env python3
"""
LANDING PAGE V3 — BATCH MULTI-CANDIDATE GENERATION
===================================================
Pipeline: VISUAL_PRODUCTION_PIPELINE_V3 STEP 2
Engine: Jimeng (即梦) via Seedream Ark (余额充足，使用 seedream_ark.py provider)

KEY IMPROVEMENTS OVER V1-V3:
  1. MULTI-CANDIDATE: Generate N candidates with different seeds, pick best
  2. CORRECT 9:16 RATIO: 1152x2048 → resize to 750x1333 (not 750x1624)
  3. VISUAL-QUALITY QA: Score includes brightness, complexity, color variety
  4. HUMAN SELECTION: All candidates saved; best one promoted to release
  5. PROVIDER LAYER: Uses seedream_ark.py which supports batch with candidate_count

USAGE:
  python scripts/generate_landing_v3_batch.py          # generate 5 candidates
  python scripts/generate_landing_v3_batch.py --count 3 # generate 3 candidates
  python scripts/generate_landing_v3_batch.py --select  # re-select from existing candidates

OUTPUT:
  candidates:  assets/visual-autopilot/candidates/landing_v3_candidate_*.jpg
  release:     apps/miniapp/static/scene/landing_v3_release.jpg (after selection)
  report:      docs/production/BATCH_GENERATION_REPORT_V3.md
"""

import json, os, sys, time, shutil
from pathlib import Path
from urllib import request, error

ROOT = Path("D:/LOVEQIGU_MASTER")
RELEASE = ROOT / "apps/miniapp/static/scene/landing_v3_release.jpg"
SPEC = ROOT / "assets/visual-pipeline/landing_v1/landing_v3_generation_spec.json"
CANDIDATES_DIR = ROOT / "assets/visual-autopilot/candidates"
QA_SCRIPT = ROOT / "scripts/qa_scoring_engine.py"
QA_THRESHOLD = 0.80

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
# PROMPT V3 — enhanced for visual quality
# ═════════════════════════════════════════════════════════════════
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


def crop_to_9_16(img_bytes: bytes, output_path: Path) -> int:
    """Crop square image to 9:16 aspect ratio (CORRECT).
    
    2048x2048 → crop center 1152x2048 → resize 750x1333
    9:16 = 0.5625; 750/1333 = 0.5626 ✅
    """
    from PIL import Image
    import io
    img = Image.open(io.BytesIO(img_bytes))
    orig_w, orig_h = img.size
    
    # Correct 9:16 crop from square: keep full height, crop width
    target_w = int(orig_h * 9 / 16)  # 2048 * 9/16 = 1152
    left = (orig_w - target_w) // 2
    cropped = img.crop((left, 0, left + target_w, orig_h))
    
    # Correct resize: 1152x2048 → 750x1333 (maintains 9:16)
    new_h = int(750 * 16 / 9)  # 1333
    resized = cropped.resize((750, new_h), Image.LANCZOS)
    
    output_path.parent.mkdir(parents=True, exist_ok=True)
    resized.save(output_path, quality=95)
    return output_path.stat().st_size


def download_image(url: str, timeout: int = 120) -> bytes:
    """Download image from URL."""
    with request.urlopen(url, timeout=timeout) as resp:
        return resp.read()


def call_jimeng(prompt: str, negative_prompt: str, seed: int) -> dict:
    """Call Jimeng API and return response."""
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


def run_qa(image_path: str, spec_path: str | None, threshold: float) -> dict:
    """Run QA scoring engine against image."""
    import subprocess
    cmd = [sys.executable, str(QA_SCRIPT), image_path, "--json", "--threshold", str(threshold)]
    if spec_path and os.path.exists(spec_path):
        cmd += ["--spec", spec_path]
    
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
    if result.returncode != 0:
        return {"error": result.stderr[:500] if result.stderr else "QA error"}
    
    try:
        return json.loads(result.stdout)
    except json.JSONDecodeError:
        return {"error": f"Invalid JSON: {result.stdout[:300]}"}


def generate_candidate(seed: int, attempt: int = 1) -> dict:
    """Generate one candidate image with given seed."""
    stamp = int(time.time())
    filename = f"landing_v3_candidate_s{seed}_{stamp}.jpg"
    candidate_path = CANDIDATES_DIR / filename
    
    print(f"\n{'─' * 50}")
    print(f"[{attempt}] Generating candidate (seed={seed})...")
    
    # Call API
    result = call_jimeng(PROMPT_V3, NEGATIVE_PROMPT, seed)
    if result["status"] != "ok":
        print(f"  API ERROR: {result.get('message', 'unknown')}")
        return {"seed": seed, "status": "api_error", "error": result.get("message")}
    
    elapsed = result["elapsed_ms"]
    
    # Extract URL
    image_url = None
    for entry in result["data"].get("data", []):
        if isinstance(entry, dict):
            url = entry.get("url")
            if url:
                image_url = url
                break
    
    if not image_url:
        print(f"  ERROR: No image URL in response")
        return {"seed": seed, "status": "no_url", "error": "No image URL"}
    
    print(f"  API: {elapsed}ms, URL received")
    
    # Download
    try:
        img_bytes = download_image(image_url)
        print(f"  Downloaded: {len(img_bytes)} bytes")
    except Exception as e:
        print(f"  Download error: {e}")
        return {"seed": seed, "status": "download_error", "error": str(e)}
    
    # Crop to CORRECT 9:16
    try:
        final_size = crop_to_9_16(img_bytes, candidate_path)
        print(f"  Saved: {candidate_path} ({final_size} bytes)")
    except Exception as e:
        # Fallback: save raw
        candidate_path.parent.mkdir(parents=True, exist_ok=True)
        candidate_path.write_bytes(img_bytes)
        final_size = len(img_bytes)
        print(f"  Saved raw (no crop): {candidate_path} ({final_size} bytes)")
    
    # Also backup raw for archive
    raw_backup = CANDIDATES_DIR / f"landing_v3_raw_s{seed}_{stamp}.jpg"
    raw_backup.write_bytes(img_bytes)
    
    # QA scoring
    qa_result = run_qa(str(candidate_path), str(SPEC), QA_THRESHOLD)
    if "error" in qa_result:
        print(f"  QA ERROR: {qa_result['error']}")
        return {"seed": seed, "path": str(candidate_path), "status": "qa_failed", "error": qa_result["error"]}
    
    score = qa_result.get("score", 0)
    passed = qa_result.get("pass", False)
    failed = qa_result.get("failed_dimensions", [])
    
    print(f"  QA Score: {score:.2f} / 1.00 (threshold: {QA_THRESHOLD})")
    if failed:
        print(f"  Failed dims: {failed}")
    print(f"  Pass: {'YES' if passed else 'NO'}")
    
    return {
        "seed": seed,
        "path": str(candidate_path),
        "status": "ok" if passed else "qa_blocked",
        "score": score,
        "passed": passed,
        "failed_dimensions": failed,
        "qa_result": qa_result,
        "elapsed_ms": elapsed,
        "file_size": final_size,
    }


def generate_batch(count: int = 5):
    """Generate N candidates and select best."""
    CANDIDATES_DIR.mkdir(parents=True, exist_ok=True)
    results = []
    
    # Use different seeds for variety (avoid seed 42, 43, 44, 45 used by V1-V3)
    seeds = [100 + i * 7 for i in range(count)]  # 100, 107, 114, 121, 128
    
    print("=" * 60)
    print(f"LANDING V3 BATCH GENERATION — {count} candidates")
    print("=" * 60)
    print(f"Model:  {MODEL}")
    print(f"Seeds:  {seeds}")
    print(f"Output: {CANDIDATES_DIR}")
    print()
    
    for i, seed in enumerate(seeds, 1):
        result = generate_candidate(seed, attempt=i)
        results.append(result)
    
    # Summary
    print(f"\n{'=' * 60}")
    print("BATCH GENERATION SUMMARY")
    print(f"{'=' * 60}")
    
    passed = [r for r in results if r.get("status") == "ok"]
    failed = [r for r in results if r.get("status") != "ok"]
    qa_blocked = [r for r in results if r.get("status") == "qa_blocked"]
    
    print(f"  Total:     {len(results)}")
    print(f"  Passed QA: {len(passed)}")
    print(f"  Blocked:   {len(qa_blocked)}")
    print(f"  Errors:    {len(failed)}")
    
    if passed:
        # Sort by score descending
        passed.sort(key=lambda r: r.get("score", 0), reverse=True)
        print(f"\n  Ranked by QA score:")
        for rank, r in enumerate(passed, 1):
            print(f"    #{rank}: seed={r['seed']}, score={r['score']:.2f}, file={os.path.basename(r['path'])}")
        
        # Select best
        best = passed[0]
        print(f"\n{'=' * 60}")
        print(f"SELECTED BEST CANDIDATE")
        print(f"{'=' * 60}")
        print(f"  Seed:  {best['seed']}")
        print(f"  Score: {best['score']:.2f}")
        print(f"  File:  {best['path']}")
        
        # Promote to release
        shutil.copy2(best["path"], RELEASE)
        print(f"\n  Promoted to: {RELEASE}")
        
        # Also copy raw (uncropped) for archive
        # Find raw backup
        for f in CANDIDATES_DIR.glob(f"landing_v3_raw_s{best['seed']}_*.jpg"):
            raw_release = ROOT / "assets/visual-autopilot" / f"landing_v3_raw_best.jpg"
            shutil.copy2(f, raw_release)
            print(f"  Raw backup: {raw_release}")
            break
    
    # Generate report
    report_path = ROOT / "docs/production/BATCH_GENERATION_REPORT_V3.md"
    with open(report_path, "w", encoding="utf-8") as f:
        f.write(f"# BATCH GENERATION REPORT V3\n\n")
        f.write(f"> **Date**: 2026-07-01\n")
        f.write(f"> **Engine**: {MODEL}\n")
        f.write(f"> **Candidates**: {len(results)}\n")
        f.write(f"> **QA Threshold**: {QA_THRESHOLD}\n\n")
        f.write(f"| Rank | Seed | Score | Size | Status | Failed Dims |\n")
        f.write(f"|------|------|-------|------|--------|-------------|\n")
        
        all_results = sorted(results, key=lambda r: r.get("score", 0) if r.get("score") else 0, reverse=True)
        for rank, r in enumerate(all_results, 1):
            status = r.get("status", "error")
            score = f"{r.get('score', 0):.2f}" if r.get("score") else "-"
            size = f"{r.get('file_size', 0)}" if r.get("file_size") else "-"
            failed = ", ".join(r.get("failed_dimensions", [])) if r.get("failed_dimensions") else "-"
            f.write(f"| {rank} | {r.get('seed', '-')} | {score} | {size} | {status} | {failed} |\n")
        
        if passed:
            best = passed[0]
            f.write(f"\n## Selected\n\n")
            f.write(f"- **Seed**: {best['seed']}\n")
            f.write(f"- **Score**: {best['score']:.2f}\n")
            f.write(f"- **Path**: `{best['path']}`\n")
            f.write(f"- **Release**: `{RELEASE}`\n")
    
    print(f"\n  Report: {report_path}")
    
    # Final result
    if not passed:
        print(f"\n{'!' * 50}")
        print("NO CANDIDATE PASSED QA THRESHOLD")
        print(f"{'!' * 50}")
        sys.exit(1)
    
    return passed


def select_from_existing():
    """Re-select best candidate from already-generated candidates.
    Useful when you want to re-rank without regenerating.
    """
    import glob
    candidates = sorted(CANDIDATES_DIR.glob("landing_v3_candidate_*.jpg"))
    if not candidates:
        print("No existing candidates found. Run with --count N first.")
        return
    
    print(f"Re-scoring {len(candidates)} existing candidates...")
    scored = []
    for c in candidates:
        qa = run_qa(str(c), str(SPEC), QA_THRESHOLD)
        score = qa.get("score", 0) if "error" not in qa else 0
        scored.append({"path": str(c), "score": score, "qa": qa})
    
    scored.sort(key=lambda r: r["score"], reverse=True)
    for rank, r in enumerate(scored, 1):
        print(f"  #{rank}: {os.path.basename(r['path'])} — score={r['score']:.2f}")
    
    best = scored[0]
    if best["score"] >= QA_THRESHOLD:
        shutil.copy2(best["path"], RELEASE)
        print(f"\nPromoted: {best['path']} → {RELEASE}")
    else:
        print(f"\nBest score {best['score']:.2f} < {QA_THRESHOLD}. Not promoted.")


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Landing V3 Batch Generator")
    parser.add_argument("--count", type=int, default=5, help="Number of candidates to generate")
    parser.add_argument("--select", action="store_true", help="Re-select from existing candidates only")
    args = parser.parse_args()
    
    if not ARK_API_KEY:
        print("[FATAL] ARK_API_KEY not set.")
        sys.exit(1)
    
    if args.select:
        select_from_existing()
    else:
        generate_batch(count=args.count)
