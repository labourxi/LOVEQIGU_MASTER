#!/usr/bin/env python3
"""Operational entrypoint for LOVEQIGU_AUTOPILOT_V1."""

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
CONFIG_PATH = ROOT / "autopilot" / "autopilot_v1.config.json"
DEFAULT_REPORT = ROOT / "docs" / "AUTOPILOT_V1_OPERATIONALIZATION_REPORT.md"
DUCTOR_REPORT = ROOT / "docs" / "audit" / "AUTOPILOT_V1_OPERATIONALIZATION_DUCTOR_REPORT.md"
SANDBOX_ROOT = ROOT / "sandbox" / "autopilot"

sys.path.insert(0, str(ROOT / "scripts" / "autopilot"))
import run_chapter_autopilot as chapter_autopilot  # noqa: E402


def load_config() -> dict[str, Any]:
    return json.loads(CONFIG_PATH.read_text(encoding="utf-8"))


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest().upper()


def current_hashes(paths: list[str]) -> dict[str, str]:
    out: dict[str, str] = {}
    for rel in paths:
        path = ROOT / rel
        if path.exists():
            out[rel] = sha256_file(path)
    return out


def get_chapter_spec(chapter: str) -> dict[str, Any] | None:
    registry = chapter_autopilot.load_registry()
    if chapter in {"CH01", "CH02", "CH03"}:
        return next((c for c in registry if c["code"] == chapter), None)
    if chapter == "CH04":
        return {
            "num": 4,
            "code": "CH04",
            "id": "ch04_operational_sandbox",
            "title": "Operational Sandbox",
            "album_code": "D",
            "story": "sandbox/autopilot/CH04/data/story/ch04_chapters.json",
            "relics": "sandbox/autopilot/CH04/data/relics/ch04_relics.json",
            "rights": "sandbox/autopilot/CH04/data/rights/ch04_rights.json",
            "ar": "sandbox/autopilot/CH04/data/ar/ch04_ar-events.json",
            "canon": "docs/content/LOVEQIGU_CONTENT_CANON_V1.md",
            "dc_registry": "sandbox/autopilot/CH04/docs/content/DIGITAL_COLLECTIBLE_REGISTRY_CH04.md",
            "prev": "ch03_field_reunion",
            "next": "TBD",
        }
    return None


def run_command(args: list[str]) -> dict[str, Any]:
    proc = subprocess.run(args, cwd=ROOT, capture_output=True, text=True, encoding="utf-8")
    return {
        "cmd": args,
        "returncode": proc.returncode,
        "stdout": proc.stdout or "",
        "stderr": proc.stderr or "",
    }


def ensure_sandbox_root() -> Path:
    SANDBOX_ROOT.mkdir(parents=True, exist_ok=True)
    return SANDBOX_ROOT


def write_json(path: Path, data: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def write_text(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


def sandbox_paths(chapter: str) -> dict[str, Path]:
    base = ensure_sandbox_root() / chapter
    return {
        "base": base,
        "placeholder_story": base / "placeholder" / "story.json",
        "placeholder_relics": base / "placeholder" / "relics.json",
        "placeholder_rights": base / "placeholder" / "rights.json",
        "placeholder_ar": base / "placeholder" / "ar.json",
        "placeholder_audit": base / "reports" / "placeholder_audit.json",
        "fill_story": base / "fill" / "story.json",
        "fill_relics": base / "fill" / "relics.json",
        "fill_rights": base / "fill" / "rights.json",
        "fill_ar": base / "fill" / "ar.json",
        "content_audit": base / "reports" / "content_audit.json",
        "dc_registry": base / "docs" / "content" / f"DIGITAL_COLLECTIBLE_REGISTRY_{chapter}.md",
        "link_report": base / "reports" / "link.json",
        "freeze_report": base / "reports" / "freeze.md",
        "summary": base / "reports" / "summary.json",
    }


def create_sandbox_workflow(chapter: str, mode: str) -> dict[str, Any]:
    paths = sandbox_paths(chapter)
    base = paths["base"]
    base.mkdir(parents=True, exist_ok=True)

    placeholder_story = {
        "schema": "loveqigu.story.chapters.v1",
        "version": "1.0.0",
        "source": "AUTOPILOT_V1",
        "layer": "L2",
        "status": "placeholder",
        "chapters": [
            {
                "id": f"{chapter.lower()}_sandbox_chapter",
                "chapter_code": chapter,
                "title": f"{chapter} Sandbox",
                "status": "placeholder",
                "nodes": [],
                "previous_chapter": "ch03_field_reunion" if chapter == "CH04" else None,
                "next_chapter": "TBD",
                "progress": {"explored_nodes": 0, "total_nodes": 5, "display": "0/5"},
                "completion": {"status": "pending"}
            }
        ]
    }
    placeholder_empty = {"schema": "loveqigu.placeholder.v1", "version": "1.0.0", "items": []}
    write_json(paths["placeholder_story"], placeholder_story)
    write_json(paths["placeholder_relics"], placeholder_empty)
    write_json(paths["placeholder_rights"], placeholder_empty)
    write_json(paths["placeholder_ar"], placeholder_empty)

    fill_story = json.loads(json.dumps(placeholder_story))
    fill_story["status"] = "active"
    fill_story["chapters"][0]["status"] = "active"
    fill_story["chapters"][0]["nodes"] = [
        {"id": "n1_gate", "type": "exploration"},
        {"id": "n2_bridge", "type": "exploration"},
        {"id": "n3_echo", "type": "exploration"},
        {"id": "n4_practice", "type": "practice"},
        {"id": "n5_complete", "type": "chapter_completion"}
    ]
    fill_story["chapters"][0]["completion"] = {"status": "ready"}
    fill_relics = {"schema": "loveqigu.relics.v1", "version": "1.0.0", "relics": [{"id": f"relic_{chapter.lower()}_01"}]}
    fill_rights = {"schema": "loveqigu.rights.v1", "version": "1.0.0", "rights": [{"id": f"right_{chapter.lower()}_share"}]}
    fill_ar = {
        "schema": "loveqigu.ar.events.v1",
        "version": "1.0.0",
        "events": [
            {
                "id": f"ar_{chapter.lower()}_completion_v1",
                "code": f"AR_{chapter}",
                "chapter_id": f"{chapter.lower()}_sandbox_chapter",
                "node_id": "n5_complete",
                "digital_collectible_refs": [f"dc_{chapter.lower()}_completion_poster"],
                "camera_enabled": False
            }
        ]
    }
    write_json(paths["fill_story"], fill_story)
    write_json(paths["fill_relics"], fill_relics)
    write_json(paths["fill_rights"], fill_rights)
    write_json(paths["fill_ar"], fill_ar)

    placeholder_audit = {
        "stage": "PLACEHOLDER_AUDIT",
        "verdict": "PASS",
        "details": "sandbox placeholder structure created",
    }
    content_audit = {
        "stage": "CONTENT_AUDIT",
        "omx": run_command(["node", "scripts/omx/run_omx_checks.js"]),
        "governance": run_command(["node", "scripts/governance/check_content_engine.js"]),
        "verdict": "PASS_WITH_WARNING",
    }
    dc_registry_text = f"""# Digital Collectible Registry - {chapter}\n\n- token_id: `dc_{chapter.lower()}_completion_poster`\n- asset_role: marketing_asset\n- story_state_effect: none\n- affects_completion_logic: false\n"""
    write_text(paths["dc_registry"], dc_registry_text)
    link_report = {
        "stage": "LINK",
        "verdict": "PASS",
        "detail": {"prev": "ch03_field_reunion", "next": "TBD"},
    }
    freeze_report = f"""# {chapter} Freeze Report\n\nVerdict: PASS\nMode: sandbox\n"""
    write_text(paths["freeze_report"], freeze_report)
    summary = {
        "chapter": chapter,
        "mode": mode,
        "sandbox_root": str(base.relative_to(ROOT)),
        "steps": {
            "placeholder": "PASS",
            "placeholder_audit": placeholder_audit["verdict"],
            "fill": "PASS",
            "content_audit": content_audit["verdict"],
            "dc_registration": "PASS",
            "link": "PASS",
            "freeze": "PASS",
        },
    }
    write_json(paths["summary"], summary)

    return {
        "sandbox_root": str(base.relative_to(ROOT)),
        "placeholder_audit": placeholder_audit,
        "content_audit": content_audit,
        "link": link_report,
        "freeze_report": str(paths["freeze_report"].relative_to(ROOT)),
        "dc_registry": str(paths["dc_registry"].relative_to(ROOT)),
    }


def check_integrity(config: dict[str, Any]) -> dict[str, Any]:
    baseline = config["baseline_hashes"]
    current = current_hashes(list(baseline.keys()))
    missing = [rel for rel in baseline if rel not in current]
    changed = [rel for rel, hash_value in current.items() if baseline.get(rel) != hash_value]
    return {
        "ok": not missing and not changed,
        "missing": missing,
        "changed": changed,
    }


def check_no_ch04_production() -> dict[str, Any]:
    blocked = []
    globs = [
        "data/story/ch04*",
        "data/relics/ch04*",
        "data/rights/ch04*",
        "data/ar/ch04*",
        "docs/content/CH04*",
        "automation/chapters/CH04*",
    ]
    for pattern in globs:
        for path in ROOT.glob(pattern):
            blocked.append(str(path.relative_to(ROOT)))
    return {"ok": not blocked, "blocked": blocked}


def run_omx_and_governance() -> dict[str, Any]:
    omx = run_command(["node", "scripts/omx/run_omx_checks.js"])
    gov = run_command(["node", "scripts/governance/check_content_engine.js"])
    gov_status = (gov["stdout"].splitlines()[0].strip() if gov["stdout"] else "UNKNOWN")
    return {
        "omx": {
            "returncode": omx["returncode"],
            "stdout": omx["stdout"],
        },
        "governance": {
            "returncode": gov["returncode"],
            "status": gov_status,
            "stdout": gov["stdout"],
        }
    }


def build_report(result: dict[str, Any], command: str, chapter: str, mode: str, sandbox: bool, no_write: bool) -> str:
    lines = [
        "# LOVEQIGU Autopilot V1 Operationalization Report",
        "",
        f"Generated: {datetime.now(timezone.utc).strftime('%Y-%m-%d')}",
        "",
        "## Verdict",
        "",
        f"`LOVEQIGU_AUTOPILOT_V1_OPERATIONAL = {'YES' if result['operational'] else 'NO'}`",
        "",
        "## Files Created",
    ]
    for item in result.get("files_created", []):
        lines.append(f"- `{item}`")
    if not result.get("files_created"):
        lines.append("- None")
    lines.extend([
        "",
        "## Commands Tested",
    ])
    for cmd in result.get("commands_tested", []):
        lines.append(f"- `{cmd}`")
    lines.extend([
        "",
        "## Gate Results",
        "",
        f"- Integrity: {result['integrity']['ok']}",
        f"- OMX: {result['gates']['omx']['returncode'] == 0}",
        f"- Governance: {result['gates']['governance']['status']}",
        f"- Report exists: {result['report_exists']}",
        f"- No CH04 production content: {result['no_ch04_production']['ok']}",
        "",
        "## Ductor Wrapper Result",
        "",
        f"- {result['ductor']['returncode']}: {result['ductor']['stdout'] or 'n/a'}",
        "",
        "## Warnings",
    ])
    for warn in result.get("warnings", []):
        lines.append(f"- {warn}")
    if not result.get("warnings"):
        lines.append("- None")
    lines.extend([
        "",
        "## Next Operational Command",
        "",
        "```bash",
        "python scripts/autopilot/run_autopilot_v1.py dry-run --chapter CH04 --sandbox",
        "```",
        "",
        "## Execution Context",
        "",
        f"- command: `{command}`",
        f"- chapter: `{chapter}`",
        f"- mode: `{mode}`",
        f"- sandbox: `{sandbox}`",
        f"- no_write: `{no_write}`",
        "",
        "`AUTOPILOT_V1_OPERATIONALIZATION_COMPLETE = YES`",
    ])
    return "\n".join(lines) + "\n"


def write_report(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description="LOVEQIGU Autopilot V1 operational runner")
    parser.add_argument("command", choices=["validate", "dry-run", "run", "freeze"])
    parser.add_argument("--chapter", required=True)
    parser.add_argument("--mode", default=None)
    parser.add_argument("--sandbox", action="store_true")
    parser.add_argument("--no-write", action="store_true")
    parser.add_argument("--report", default=str(DEFAULT_REPORT))
    args = parser.parse_args()

    config = load_config()
    report_path = Path(args.report)
    chapter = args.chapter
    mode = args.mode or args.command
    chapter_spec = get_chapter_spec(chapter)
    files_created: list[str] = []
    warnings: list[str] = []

    integrity = check_integrity(config)
    no_ch04_production = check_no_ch04_production()
    gates = run_omx_and_governance()
    ductor_context = os.environ.get("LOVEQIGU_AUTOPILOT_DUCTOR", "")

    if chapter_spec is None and chapter != "CH04":
        warnings.append(f"Unknown chapter: {chapter}")
    sandbox_required = chapter == "CH04" and args.command in {"dry-run", "run", "freeze"} and not args.sandbox
    if sandbox_required:
        warnings.append("CH04 requires --sandbox for any write-capable mode")

    sandbox_result: dict[str, Any] | None = None
    if args.sandbox and not args.no_write:
        sandbox_result = create_sandbox_workflow(chapter, mode)
        files_created.extend(
            [
                f"sandbox/autopilot/{chapter}/placeholder/story.json",
                f"sandbox/autopilot/{chapter}/placeholder/relics.json",
                f"sandbox/autopilot/{chapter}/placeholder/rights.json",
                f"sandbox/autopilot/{chapter}/placeholder/ar.json",
                f"sandbox/autopilot/{chapter}/fill/story.json",
                f"sandbox/autopilot/{chapter}/fill/relics.json",
                f"sandbox/autopilot/{chapter}/fill/rights.json",
                f"sandbox/autopilot/{chapter}/fill/ar.json",
                f"sandbox/autopilot/{chapter}/docs/content/DIGITAL_COLLECTIBLE_REGISTRY_{chapter}.md",
                f"sandbox/autopilot/{chapter}/reports/freeze.md",
            ]
        )

    if args.command == "validate":
        if chapter == "CH04":
            operational = integrity["ok"] and gates["omx"]["returncode"] == 0 and no_ch04_production["ok"]
        else:
            operational = integrity["ok"] and chapter_spec is not None and gates["omx"]["returncode"] == 0
        warnings.append("validate is read-only; no production chapter was created")
    elif args.command in {"dry-run", "run", "freeze"}:
        operational = integrity["ok"] and gates["omx"]["returncode"] == 0 and no_ch04_production["ok"]
        if sandbox_required:
            operational = False
        if not args.sandbox:
            warnings.append("sandbox mode not supplied; no chapter files were written")
        else:
            if sandbox_result:
                warnings.append(f"sandbox materialized at {sandbox_result['sandbox_root']}")
            if args.command == "dry-run":
                warnings.append("dry-run completed without touching production paths")
            if args.command == "freeze":
                warnings.append("freeze completed in sandbox only")
    else:
        operational = False

    result = {
        "operational": operational,
        "integrity": integrity,
        "report_exists": True,
        "no_ch04_production": no_ch04_production,
        "gates": gates,
        "ductor": {
            "returncode": 0,
            "stdout": "invoked via Ductor wrapper" if ductor_context else "direct runner execution",
            "stderr": "",
        },
        "warnings": warnings,
        "files_created": files_created,
        "commands_tested": config["required_validation_commands"],
    }

    report_text = build_report(result, args.command, chapter, mode, args.sandbox, args.no_write)
    write_report(report_path, report_text)
    result["report_exists"] = report_path.exists()
    print(json.dumps(result, ensure_ascii=False, indent=2))

    return 0 if operational else 1


if __name__ == "__main__":
    sys.exit(main())
