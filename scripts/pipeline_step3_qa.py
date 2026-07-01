#!/usr/bin/env python3
"""
PIPELINE STEP 3 — QA GATE MODULE

Reusable QA injection for any visual generation script.
Passes --threshold to qa_scoring_engine for dynamic threshold support.

Usage:
  from pipeline_step3_qa import qa_gate
  passed, result = qa_gate(image_path, spec_path, threshold=0.80)

If score < threshold:
  - Returns (False, result)
  - Asset NOT registered
  - Caller must NOT proceed to assetMap update

If score >= threshold:
  - Returns (True, result)
  - Caller may proceed to asset registration
"""

import json, os, subprocess, sys
from pathlib import Path

QA_SCRIPT = Path(__file__).resolve().parent / "qa_scoring_engine.py"
DEFAULT_SPEC = Path(__file__).resolve().parent.parent / "assets/visual-pipeline/landing_v1/landing_v1_generation_spec.json"
DEFAULT_MIN_SCORE = 0.70


def qa_gate(image_path: str, spec_path: str | None = None, max_regeneration: int = 3, threshold: float | None = None) -> tuple:
    """
    Mandatory QA blocking gate.
    
    Args:
        image_path: Path to generated image
        spec_path: Path to STRUCTURE_SPEC JSON
        max_regeneration: Max regeneration attempts (default 3)
        threshold: Override minimum score (default: 0.70 or spec's qa_threshold)
    
    Returns:
        (passed: bool, result: dict)
    """
    if not os.path.exists(QA_SCRIPT):
        print(f"[QA_GATE_ERROR] QA engine not found: {QA_SCRIPT}")
        return False, {"error": "QA engine not found"}

    if not os.path.exists(image_path):
        print(f"[QA_GATE_ERROR] Image not found: {image_path}")
        return False, {"error": "Image not found"}

    spec_arg = spec_path if spec_path and os.path.exists(spec_path) else str(DEFAULT_SPEC) if DEFAULT_SPEC.exists() else ""
    effective_threshold = threshold if threshold is not None else DEFAULT_MIN_SCORE

    print(f"\n{'=' * 60}")
    print(f"PIPELINE STEP 3 — QA GATE")
    print(f"{'=' * 60}")
    print(f"Image:  {image_path}")
    print(f"Spec:   {spec_arg or '(default)'}")
    print(f"Threshold: {effective_threshold}")
    print(f"Engine: {QA_SCRIPT}")

    attempt = 0
    while attempt < max_regeneration:
        attempt += 1
        print(f"\n[QA] Attempt {attempt}/{max_regeneration}...")

        cmd = [sys.executable, str(QA_SCRIPT), image_path, "--json"]
        if spec_arg:
            cmd += ["--spec", spec_arg]
        cmd += ["--threshold", str(effective_threshold)]

        result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)

        if result.returncode != 0:
            print(f"[QA] Engine error: {result.stderr[:300] if result.stderr else 'unknown'}")
            return False, {"error": result.stderr[:500] if result.stderr else "QA engine error"}

        try:
            qa_result = json.loads(result.stdout)
        except json.JSONDecodeError:
            print(f"[QA] Invalid JSON output: {result.stdout[:300]}")
            return False, {"error": "Invalid QA output"}

        score = qa_result.get("score", 0)
        passed = qa_result.get("pass", False)
        failed = qa_result.get("failed_dimensions", [])

        print(f"  Score: {score:.2f} / 1.00  (threshold: {effective_threshold})")
        print(f"  Pass:  {'YES' if passed else 'NO'}")
        if failed:
            print(f"  Failed dimensions: {', '.join(failed)}")

        if passed:
            print(f"\n[QA_GATE] PASSED — asset cleared for registration.")
            return True, qa_result
        else:
            if attempt < max_regeneration:
                print(f"[QA] Score {score} < {effective_threshold}. Regeneration required (attempt {attempt}/{max_regeneration}).")
                print(f"[QA] Regeneration must be triggered externally.")
                return False, qa_result
            else:
                print(f"[QA] Max regeneration attempts ({max_regeneration}) reached.")
                return False, qa_result

    return False, {"error": "Max attempts reached"}
