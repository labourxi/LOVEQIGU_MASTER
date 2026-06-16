#!/usr/bin/env python3
"""Operational admin content model runner for LOVEQIGU."""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[2]
CONFIG_PATH = ROOT / "autopilot" / "admin_content_model_v1.config.json"
DEFAULT_REPORT = ROOT / "docs" / "ADMIN_AUTOPILOT_V1_REPORT.md"
SANDBOX_ROOT = ROOT / "sandbox" / "admin"


def load_config() -> dict[str, Any]:
    return json.loads(CONFIG_PATH.read_text(encoding="utf-8"))


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            digest.update(chunk)
    return digest.hexdigest().upper()


def current_hashes(paths: list[str]) -> dict[str, str]:
    out: dict[str, str] = {}
    for rel in paths:
        path = ROOT / rel
        if path.exists():
            out[rel] = sha256_file(path)
    return out


def check_frozen_integrity(config: dict[str, Any]) -> dict[str, Any]:
    baseline = config["baseline_hashes"]
    current = current_hashes(list(baseline.keys()))
    missing = [rel for rel in baseline if rel not in current]
    changed = [rel for rel in baseline if current.get(rel) != baseline[rel]]
    return {
        "ok": not missing and not changed,
        "missing": missing,
        "changed": changed,
    }


def ensure_sandbox_structure() -> dict[str, Path]:
    dirs = {
        "base": SANDBOX_ROOT,
        "checkpoints": SANDBOX_ROOT / "checkpoints",
        "relic_templates": SANDBOX_ROOT / "relic_templates",
        "art_requirements": SANDBOX_ROOT / "art_requirements",
        "runtime_registry": SANDBOX_ROOT / "runtime_registry",
    }
    for path in dirs.values():
        path.mkdir(parents=True, exist_ok=True)
    return dirs


def checkpoint_path(checkpoint_id: str) -> Path:
    return SANDBOX_ROOT / "checkpoints" / f"{checkpoint_id}.json"


def relic_template_path(checkpoint_id: str) -> Path:
    return SANDBOX_ROOT / "relic_templates" / f"{checkpoint_id}_relic_template.json"


def art_requirement_path(checkpoint_id: str) -> Path:
    return SANDBOX_ROOT / "art_requirements" / f"{checkpoint_id}_art_requirement.json"


def runtime_registry_path() -> Path:
    return SANDBOX_ROOT / "runtime_registry" / "draft_registry.json"


def build_checkpoint_record(checkpoint_id: str, chapter: str) -> dict[str, Any]:
    return {
        "checkpoint_id": checkpoint_id,
        "chapter_id": chapter,
        "map_region": "sandbox_admin_test_region",
        "title": "Sandbox Acceptance Checkpoint",
        "placeholder_status": "draft",
        "runtime_status": "draft_only",
        "relic_template_ref": str(relic_template_path(checkpoint_id).relative_to(ROOT)),
        "ar_template_ref": str(art_requirement_path(checkpoint_id).relative_to(ROOT)),
        "audit_status": "pending",
        "publish_status": "unpublished",
    }


def build_relic_template(checkpoint_id: str, chapter: str) -> dict[str, Any]:
    return {
        "relic_template_id": f"{checkpoint_id}_relic_template",
        "chapter_id": chapter,
        "relic_type": "story_progression_placeholder",
        "rarity_level": "template",
        "required_art": ["placeholder_visual"],
        "required_story": [checkpoint_id],
        "required_rights": ["sandbox_share_right"],
        "dc_enabled": False,
        "status": "draft",
    }


def build_art_requirement(checkpoint_id: str, chapter: str) -> dict[str, Any]:
    return {
        "art_requirement_id": f"{checkpoint_id}_art_requirement",
        "source_checkpoint": checkpoint_id,
        "asset_type": "placeholder_art",
        "asset_name": f"{chapter} sandbox art brief",
        "asset_description": "Acceptance-test art brief for checkpoint expansion sandbox.",
        "priority": "low",
        "status": "queued",
    }


def build_runtime_registry_draft(checkpoint_id: str, chapter: str) -> dict[str, Any]:
    return {
        "schema": "loveqigu.admin.runtime_registry.v1",
        "version": "1.0.0",
        "status": "draft",
        "checkpoint_id": checkpoint_id,
        "chapter_id": chapter,
        "entries": [
            {
                "kind": "checkpoint",
                "ref": str(checkpoint_path(checkpoint_id).relative_to(ROOT)),
            },
            {
                "kind": "relic_template",
                "ref": str(relic_template_path(checkpoint_id).relative_to(ROOT)),
            },
            {
                "kind": "art_requirement",
                "ref": str(art_requirement_path(checkpoint_id).relative_to(ROOT)),
            },
        ],
        "publish_status": "not_published",
    }


def materialize_sandbox(checkpoint_id: str, chapter: str) -> list[str]:
    ensure_sandbox_structure()
    files_created: list[str] = []

    checkpoint_file = checkpoint_path(checkpoint_id)
    relic_template_file = relic_template_path(checkpoint_id)
    art_requirement_file = art_requirement_path(checkpoint_id)
    registry_file = runtime_registry_path()

    payloads = {
        checkpoint_file: build_checkpoint_record(checkpoint_id, chapter),
        relic_template_file: build_relic_template(checkpoint_id, chapter),
        art_requirement_file: build_art_requirement(checkpoint_id, chapter),
        registry_file: build_runtime_registry_draft(checkpoint_id, chapter),
    }

    for path, payload in payloads.items():
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        files_created.append(str(path.relative_to(ROOT)))

    return files_created


def sandbox_state(checkpoint_id: str) -> dict[str, bool]:
    return {
        "checkpoint": checkpoint_path(checkpoint_id).exists(),
        "relic_template": relic_template_path(checkpoint_id).exists(),
        "art_requirement": art_requirement_path(checkpoint_id).exists(),
        "runtime_registry": runtime_registry_path().exists(),
        "published_registry": (SANDBOX_ROOT / "runtime_registry" / "published_registry.json").exists(),
    }


def evaluate_admin_gate(
    config: dict[str, Any],
    checkpoint_id: str,
    chapter: str,
    report_path: Path,
    require_sandbox_artifacts: bool = True,
) -> dict[str, Any]:
    integrity = check_frozen_integrity(config)
    state = sandbox_state(checkpoint_id)

    sandbox_only = all(
        not any(path for path in ROOT.glob(pattern))
        for pattern in [
            "autopilot/admin/runtime_registry/published*",
            "sandbox/admin/runtime_registry/published*",
        ]
    )

    report_exists = report_path.exists()
    sandbox_ready = state["checkpoint"] and state["relic_template"] and state["art_requirement"] and state["runtime_registry"]
    runtime_registry_draft_only = state["runtime_registry"] and not state["published_registry"]
    if not require_sandbox_artifacts:
        runtime_registry_draft_only = True

    warnings = []
    if require_sandbox_artifacts and not sandbox_ready:
        warnings.append("sandbox draft artifacts incomplete")

    ok = integrity["ok"] and sandbox_only and runtime_registry_draft_only
    if require_sandbox_artifacts and not sandbox_ready:
        ok = False
    verdict = "PASS" if ok and not warnings else ("WARN" if ok else "FAIL")
    return {
        "verdict": verdict,
        "integrity": integrity,
        "sandbox_state": state,
        "sandbox_only": sandbox_only,
        "runtime_registry_draft_only": runtime_registry_draft_only,
        "report_exists": report_exists,
        "warnings": warnings,
        "chapter": chapter,
        "checkpoint_id": checkpoint_id,
    }


def render_report(result: dict[str, Any], command: str, chapter: str, checkpoint_id: str, sandbox: bool, no_write: bool, files_created: list[str], gate: dict[str, Any], ductor_note: str) -> str:
    lines = [
        "# Admin Autopilot V1 Report",
        "",
        f"Generated: {datetime.now(timezone.utc).strftime('%Y-%m-%d')}",
        "",
        "## Verdict",
        "",
        f"`ADMIN_AUTOPILOT_V1_COMPLETE = {'YES' if result['operational'] else 'NO'}`",
        "",
        "## Files Created",
    ]
    if files_created:
        for item in files_created:
            lines.append(f"- `{item}`")
    else:
        lines.append("- None")

    lines.extend(
        [
            "",
            "## Sandbox Structure",
            "",
            f"- `{SANDBOX_ROOT.relative_to(ROOT)}`",
            f"- `sandbox/admin/checkpoints/`",
            f"- `sandbox/admin/relic_templates/`",
            f"- `sandbox/admin/art_requirements/`",
            f"- `sandbox/admin/runtime_registry/`",
            "",
            "## Runner Results",
            "",
            f"- command: `{command}`",
            f"- chapter: `{chapter}`",
            f"- checkpoint: `{checkpoint_id}`",
            f"- sandbox: `{sandbox}`",
            f"- no_write: `{no_write}`",
            f"- integrity_ok: `{result['integrity']['ok']}`",
            f"- gate_verdict: `{gate['verdict']}`",
            "",
            "## Gate Results",
            "",
            f"- verdict: `{gate['verdict']}`",
            f"- sandbox_only: `{gate['sandbox_only']}`",
            f"- runtime_registry_draft_only: `{gate['runtime_registry_draft_only']}`",
            f"- report_exists: `{gate['report_exists']}`",
            f"- integrity_ok: `{gate['integrity']['ok']}`",
        ]
    )
    if gate["warnings"]:
        lines.append("- warnings:")
        for warning in gate["warnings"]:
            lines.append(f"  - {warning}")
    else:
        lines.append("- warnings: none")

    lines.extend(
        [
            "",
            "## Ductor Results",
            "",
            f"- {ductor_note}",
            "",
            "## Future Admin Workflow",
            "",
            "1. Create a checkpoint record.",
            "2. Expand the checkpoint into a relic template and art requirement.",
            "3. Write sandbox-only placeholder artifacts.",
            "4. Run the admin gate.",
            "5. Freeze the sandbox draft.",
            "6. Publish only after gate approval and explicit runtime promotion.",
            "",
            "## Validation Commands",
        ]
    )
    for cmd in result["commands_tested"]:
        lines.append(f"- `{cmd}`")

    lines.extend(
        [
            "",
            f"`ADMIN_AUTOPILOT_V1_COMPLETE = {'YES' if result['operational'] else 'NO'}`",
            f"`LOVEQIGU_ADMIN_AUTOPILOT_READY = {'YES' if result['operational'] else 'NO'}`",
        ]
    )
    return "\n".join(lines) + "\n"


def write_text(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


def run_validation_only(config: dict[str, Any], report_path: Path, chapter: str, checkpoint_id: str) -> dict[str, Any]:
    gate = evaluate_admin_gate(config, checkpoint_id, chapter, report_path, require_sandbox_artifacts=False)
    gate["report_exists"] = True
    return {
        "operational": gate["integrity"]["ok"] and gate["sandbox_only"] and gate["runtime_registry_draft_only"],
        "integrity": gate["integrity"],
        "gate": gate,
        "files_created": [],
        "warnings": ["validate is read-only"],
        "commands_tested": config["required_validation_commands"],
    }


def run_sandbox_command(config: dict[str, Any], command: str, chapter: str, checkpoint_id: str) -> dict[str, Any]:
    files_created = materialize_sandbox(checkpoint_id, chapter)
    gate = evaluate_admin_gate(config, checkpoint_id, chapter, DEFAULT_REPORT, require_sandbox_artifacts=True)
    gate["report_exists"] = True
    operational = gate["integrity"]["ok"] and gate["sandbox_only"] and gate["runtime_registry_draft_only"]
    return {
        "operational": operational,
        "integrity": gate["integrity"],
        "gate": gate,
        "files_created": files_created,
        "warnings": [
            f"sandbox materialized at {SANDBOX_ROOT.relative_to(ROOT)}",
            f"{command} completed in sandbox only",
        ],
        "commands_tested": config["required_validation_commands"],
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="LOVEQIGU admin content model runner")
    parser.add_argument("command", choices=["validate", "dry-run", "generate"])
    parser.add_argument("--checkpoint", default=None)
    parser.add_argument("--chapter", default=None)
    parser.add_argument("--sandbox", action="store_true")
    parser.add_argument("--report", default=str(DEFAULT_REPORT))
    parser.add_argument("--no-write", action="store_true")
    args = parser.parse_args()

    config = load_config()
    checkpoint_id = args.checkpoint or config["test_checkpoint_id"]
    chapter = args.chapter or config["default_chapter"]
    report_path = Path(args.report)
    os.environ["LOVEQIGU_ADMIN_AUTOPILOT"] = "1"

    if args.command == "validate":
        result = run_validation_only(config, report_path, chapter, checkpoint_id)
    else:
        if not args.sandbox:
            result = {
                "operational": False,
                "integrity": check_frozen_integrity(config),
                "gate": evaluate_admin_gate(config, checkpoint_id, chapter, report_path),
                "files_created": [],
                "warnings": ["sandbox required for dry-run/generate"],
            }
        else:
            result = run_sandbox_command(config, args.command, chapter, checkpoint_id)

    ductor_note = "invoked via Ductor wrapper" if os.environ.get("LOVEQIGU_ADMIN_DUCTOR") == "1" else "direct runner execution"
    gate = result.get("gate") or evaluate_admin_gate(config, checkpoint_id, chapter, report_path)
    report_text = render_report(
        result,
        args.command,
        chapter,
        checkpoint_id,
        args.sandbox,
        args.no_write,
        result.get("files_created", []),
        gate,
        ductor_note,
    )
    write_text(report_path, report_text)

    payload = {
        "operational": result["operational"],
        "integrity": result["integrity"],
        "gate": gate,
        "files_created": result.get("files_created", []),
        "warnings": result.get("warnings", []),
        "report": str(report_path.relative_to(ROOT)),
    }
    print(json.dumps(payload, ensure_ascii=False, indent=2))
    return 0 if result["operational"] else 1


if __name__ == "__main__":
    sys.exit(main())
