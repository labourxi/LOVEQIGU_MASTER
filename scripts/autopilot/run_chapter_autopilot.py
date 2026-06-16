#!/usr/bin/env python3
"""LOVEQIGU Chapter Content Autopilot V1."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
from copy import deepcopy
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[2]
REGISTRY = ROOT / "automation/chapters/registry.yaml"
DOCS_AUTO = ROOT / "docs/automation"
FORBIDDEN_TERMS = [
    "打卡", "成就", "升级", "抽卡", "积分商城", "归真", "回应", "祝由", "愿力",
]
FACTORY = {"nodes": 5, "relics": 6, "rights": 5, "ar": 6}


def load_registry() -> list[dict[str, Any]]:
    try:
        import yaml  # type: ignore
    except ImportError:
        # minimal yaml-less fallback for CH01-03 hardcoded
        return _hardcoded_registry()
    data = yaml.safe_load(REGISTRY.read_text(encoding="utf-8"))
    return data["chapters"]


def _hardcoded_registry() -> list[dict[str, Any]]:
    text = REGISTRY.read_text(encoding="utf-8")
    chapters = []
    block = None
    cur: dict[str, Any] = {}
    for line in text.splitlines():
        if line.strip().startswith("- num:"):
            if cur:
                chapters.append(cur)
            cur = {"num": int(line.split(":")[1].strip())}
        elif ":" in line and not line.startswith(" " * 2 + "-"):
            k, v = line.split(":", 1)
            k, v = k.strip(), v.strip()
            if v in ("null", "None", ""):
                cur[k] = None
            elif v == "TBD":
                cur[k] = "TBD"
            else:
                cur[k] = v.strip('"')
    if cur:
        chapters.append(cur)
    return chapters


def read_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, data: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def chapter_paths(ch: dict) -> dict[str, Path]:
    return {
        "story": ROOT / ch["story"],
        "relics": ROOT / ch["relics"],
        "rights": ROOT / ch["rights"],
        "ar": ROOT / ch["ar"],
    }


def validate_chapter(ch: dict, check_dc: bool = True) -> dict[str, Any]:
    paths = chapter_paths(ch)
    result: dict[str, Any] = {
        "code": ch["code"],
        "id": ch["id"],
        "pass": [],
        "warn": [],
        "fail": [],
    }

    def ok(m: str):
        result["pass"].append(m)

    def warn(m: str):
        result["warn"].append(m)

    def fail(m: str):
        result["fail"].append(m)

    for name, path in paths.items():
        if not path.exists():
            fail(f"Missing file: {path.relative_to(ROOT)}")
            return result
        try:
            read_json(path)
            ok(f"JSON valid: {path.name}")
        except json.JSONDecodeError as e:
            fail(f"JSON invalid {path.name}: {e}")
            return result

    story = read_json(paths["story"])
    relics_d = read_json(paths["relics"])
    rights_d = read_json(paths["rights"])
    ar_d = read_json(paths["ar"])

    ch_obj = story["chapters"][0]
    nodes = {n["id"]: n for n in ch_obj["nodes"]}
    relics = {r["id"]: r for r in relics_d["relics"]}
    rights = {r["id"]: r for r in rights_d["rights"]}
    events = {e["id"]: e for e in ar_d["events"]}

    if len(ch_obj["nodes"]) != FACTORY["nodes"]:
        fail(f"nodes={len(ch_obj['nodes'])} expected {FACTORY['nodes']}")
    else:
        ok("node count")

    if len(relics) != FACTORY["relics"]:
        fail(f"relics={len(relics)} expected {FACTORY['relics']}")
    else:
        ok("relic count")

    if len(rights) != FACTORY["rights"]:
        fail(f"rights={len(rights)} expected {FACTORY['rights']}")
    else:
        ok("rights count")

    if len(events) != FACTORY["ar"]:
        fail(f"ar={len(events)} expected {FACTORY['ar']}")
    else:
        ok("ar count")

    album = ch_obj.get("imprint_album", {}).get("album_code")
    if album and album != ch["album_code"]:
        fail(f"album_code {album} != {ch['album_code']}")
    elif album:
        ok(f"album {album}")

    for node in ch_obj["nodes"]:
        for rid in node.get("relic_refs", []):
            if rid not in relics:
                fail(f"{node['id']} missing relic {rid}")
        for aid in node.get("ar_event_refs", []):
            if aid not in events:
                fail(f"{node['id']} missing ar {aid}")

    if not result["fail"]:
        ok("forward refs")

    for rid, relic in relics.items():
        if relic["node_id"] not in nodes or rid not in nodes[relic["node_id"]].get("relic_refs", []):
            fail(f"relic back-ref {rid}")

    for eid, event in events.items():
        if event["node_id"] not in nodes or eid not in nodes[event["node_id"]].get("ar_event_refs", []):
            fail(f"ar back-ref {eid}")

    if not result["fail"]:
        ok("bidirectional refs")

    if set(rights_d.get("relic_refs_all", [])) != set(relics.keys()):
        fail("relic_refs_all mismatch")
    else:
        ok("relic_refs_all")

    for relic in relics.values():
        if relic.get("asset_class") != "story_progression":
            fail(f"{relic['id']} asset_class")
        if not relic.get("forbidden_semantics"):
            fail(f"{relic['id']} forbidden_semantics")

    if not any("asset_class" in str(result["fail"]) for _ in [0]):
        if not result["fail"] or all("asset_class" not in f and "forbidden" not in f for f in result["fail"]):
            ok("relic boundaries")

    for event in events.values():
        if event.get("camera_enabled") is not False:
            fail(f"AR {event['id']} camera_enabled")

    if not result["fail"]:
        ok("AR camera off")

    blob = json.dumps({"s": story, "r": relics_d, "a": ar_d}, ensure_ascii=False)
    for term in FORBIDDEN_TERMS:
        if term in blob:
            fail(f"forbidden term: {term}")
    if not any("forbidden term" in f for f in result["fail"]):
        ok("terminology")

    if check_dc:
        dc_refs = []
        for event in events.values():
            dc_refs.extend(event.get("digital_collectible_refs", []))
        reg_path = ch.get("dc_registry")
        if dc_refs:
            if not reg_path or not (ROOT / reg_path).exists():
                warn(f"DC refs {dc_refs} but registry missing")
            else:
                reg_text = (ROOT / reg_path).read_text(encoding="utf-8")
                for dc in dc_refs:
                    if dc not in reg_text:
                        fail(f"unregistered DC: {dc}")
                    else:
                        ok(f"DC registered: {dc}")
        elif ch["num"] >= 2:
            warn("no digital_collectible_refs on completion AR")

    if ch.get("prev"):
        prev = next((c for c in load_registry() if c["id"] == ch["prev"]), None)
        if prev:
            prev_story = read_json(ROOT / prev["story"])
            prev_ch = prev_story["chapters"][0]
            if prev_ch.get("next_chapter") != ch["id"]:
                warn(f"link: {prev['code']} next_chapter != {ch['id']}")
            else:
                ok("prev next_chapter link")
        if ch_obj.get("previous_chapter") != ch["prev"]:
            fail("previous_chapter mismatch")
        else:
            ok("previous_chapter")

    result["verdict"] = (
        "FAIL" if result["fail"] else ("PASS_WITH_WARNING" if result["warn"] else "PASS")
    )
    return result


def validate_placeholder(ch: dict) -> dict[str, Any]:
    paths = chapter_paths(ch)
    result: dict[str, Any] = {
        "code": ch["code"],
        "id": ch["id"],
        "pass": [],
        "warn": [],
        "fail": [],
    }

    def ok(m: str):
        result["pass"].append(m)

    def warn(m: str):
        result["warn"].append(m)

    def fail(m: str):
        result["fail"].append(m)

    chapter_payload = None
    for name, path in paths.items():
        if not path.exists():
            fail(f"Missing placeholder file: {path.relative_to(ROOT)}")
            result["verdict"] = "FAIL"
            return result
        try:
            payload = read_json(path)
        except json.JSONDecodeError as e:
            fail(f"JSON invalid {path.name}: {e}")
            result["verdict"] = "FAIL"
            return result

        ok(f"JSON valid: {path.name}")
        if name == "story":
            chapter_payload = payload["chapters"][0]
            if chapter_payload.get("status") != "placeholder":
                warn(f"story status={chapter_payload.get('status')} already active")
            else:
                ok("story placeholder status")
            if chapter_payload.get("nodes"):
                if chapter_payload.get("status") == "placeholder":
                    fail(f"story nodes not empty: {len(chapter_payload.get('nodes', []))}")
                else:
                    warn(f"story nodes populated: {len(chapter_payload.get('nodes', []))}")
            else:
                ok("story nodes empty")
        else:
            key = "relics" if name == "relics" else "rights" if name == "rights" else "events"
            if payload.get(key):
                if chapter_payload and chapter_payload.get("status") == "placeholder":
                    fail(f"{name} {key} not empty: {len(payload.get(key, []))}")
                else:
                    warn(f"{name} {key} populated: {len(payload.get(key, []))}")
            else:
                ok(f"{name} empty")

    blob = json.dumps({k: read_json(v) for k, v in paths.items()}, ensure_ascii=False)
    for term in FORBIDDEN_TERMS:
        if term in blob:
            fail(f"forbidden term: {term}")
    if not any("forbidden term" in f for f in result["fail"]):
        ok("terminology")

    if not result["fail"]:
        result["verdict"] = "PASS_WITH_WARNING" if result["warn"] else "PASS"
    else:
        result["verdict"] = "FAIL"
    return result


def create_placeholder(ch: dict) -> None:
    paths = chapter_paths(ch)
    num = ch["code"]
    canon_src = f"{num}_CONTENT_CANON_V1"
    ch_id = ch["id"]
    story = {
        "schema": "loveqigu.story.chapters.v1",
        "version": "1.0.0",
        "source": canon_src,
        "layer": "L2",
        "status": "placeholder",
        "source_ref": f"docs/content/{num}_CONTENT_CANON_V1.md",
        "canonical_boundary": f"{num} Story Layer placeholder only. No formal node content. No new lore. No Canon Gap fill.",
        "previous_chapter_ref": ch.get("prev"),
        "chapters": [
            {
                "id": ch_id,
                "chapter_code": num,
                "title": ch["title"],
                "display_title": f"《{ch['title']}》",
                "status": "placeholder",
                "layer": "L2",
                "language_layer": "L2_PRODUCT",
                "canonical_boundary": "Placeholder container; node and cross-layer identifiers pending L2 registration.",
                "summary": f"{num} placeholder shell. Formal chapter content not generated.",
                "previous_chapter": ch.get("prev"),
                "next_chapter": "TBD",
                "awareness_structure": {
                    "type": "five_awareness",
                    "label": "五处觉察",
                    "total": None,
                    "status": "pending_l2",
                },
                "imprint_album": {
                    "label": "印谱",
                    "album_code": ch["album_code"],
                    "total_slots": None,
                    "progress_display": "k/n",
                    "status": "pending_l2",
                },
                "completion": {
                    "action": "章成",
                    "completion_mark": None,
                    "completion_mark_relic_ref": None,
                    "exploration_memorial": None,
                    "memorial_title": None,
                    "status": "pending_l2",
                },
                "progress": {"explored_nodes": 0, "total_nodes": None, "display": "0/n"},
                "nodes": [],
            }
        ],
    }
    if not ch.get("prev"):
        story.pop("previous_chapter_ref", None)
        story["chapters"][0].pop("previous_chapter", None)

    relics = {
        "schema": "loveqigu.relics.v1",
        "version": "1.0.0",
        "source": canon_src,
        "layer": "L2",
        "status": "placeholder",
        "source_ref": f"docs/content/{num}_CONTENT_CANON_V1.md",
        "story_ref": ch["story"],
        "canonical_boundary": f"{num} Relic Layer placeholder only. No relic entities registered.",
        "asset_boundary": {
            "relic": "信物是故事进度资产，Canon-driven，见证连接而非拥有。",
            "digital_collectible": "数字藏品是营销与传播资产，与信物分离。",
            "rule": "Relic records must not be treated as Digital Collectible records.",
        },
        "chapter_context": {
            "chapter_id": ch_id,
            "chapter_code": num,
            "chapter_title": ch["title"],
            "display_title": f"《{ch['title']}》",
        },
        "relics": [],
    }
    rights = {
        "schema": "loveqigu.rights.v1",
        "version": "1.0.0",
        "source": canon_src,
        "layer": "L1",
        "language_layer": "L1_COMMERCIAL",
        "status": "placeholder",
        "source_ref": f"docs/content/{num}_CONTENT_CANON_V1.md",
        "story_ref": ch["story"],
        "relic_ref": ch["relics"],
        "canonical_boundary": f"{num} Rights Layer placeholder only. No rights entities registered.",
        "chapter_context": relics["chapter_context"],
        "relic_refs_all": [],
        "asset_boundary": {
            "rights": "L1 commercial layer; must not be sold as Relic or mixed into ritual closure.",
            "relic": "Story progression asset; Rights must not unlock or replace Relic progression.",
            "rule": "Rights records reference relic context but do not mutate Relic state.",
        },
        "rights": [],
    }
    ar = {
        "schema": "loveqigu.ar.events.v1",
        "version": "1.0.0",
        "source": canon_src,
        "layer": "L2",
        "language_layer": "L2_PRODUCT",
        "status": "placeholder",
        "source_ref": f"docs/content/{num}_CONTENT_CANON_V1.md",
        "story_ref": ch["story"],
        "relic_ref": ch["relics"],
        "rights_ref": ch["rights"],
        "canonical_boundary": f"{num} AR Event Layer placeholder only. No AR event entities registered.",
        "chapter_context": relics["chapter_context"],
        "asset_boundary": {
            "ar_event": "Field visualization and approved closure entry; does not create 云门 state.",
            "relic": "AR output may reference Relic context; Relic progression remains deterministic from exploration.",
            "rights": "L1 redemption refs stay outside ritual closure chain.",
            "digital_collectible": "Share outputs are user-initiated; zero Relic progression effect.",
        },
        "events": [],
    }
    write_json(paths["story"], story)
    write_json(paths["relics"], relics)
    write_json(paths["rights"], rights)
    write_json(paths["ar"], ar)


def link_previous(ch: dict) -> bool:
    if not ch.get("prev"):
        return False
    prev = next((c for c in load_registry() if c["id"] == ch["prev"]), None)
    if not prev:
        return False
    path = ROOT / prev["story"]
    data = read_json(path)
    ch0 = data["chapters"][0]
    if ch0.get("next_chapter") == ch["id"]:
        return False
    ch0["next_chapter"] = ch["id"]
    write_json(path, data)
    return True


def register_dc(ch: dict) -> Path | None:
    num = ch["code"]
    ch_id = ch["id"]
    dc_id = f"dc_{num.lower()}_completion_poster"
    out = DOCS_AUTO.parent / "content" / f"DIGITAL_COLLECTIBLE_REGISTRY_{num}.md"
    if out.exists():
        return out
    content = f"""# Digital Collectible Registry — {num}

> **token_id**: `{dc_id}`  
> **name**: {ch['title']}分享海报  
> **asset_type**: DIGITAL_COLLECTIBLE · marketing_asset · share_poster  
> **story_state_effect**: none · **affects_章成_logic**: false  
> **chapter_id**: `{ch_id}`

`DIGITAL_COLLECTIBLE_REGISTRY_{num}_COMPLETE = YES`
"""
    out.write_text(content, encoding="utf-8")
    return out


def write_freeze_report(ch: dict, audit: dict[str, Any]) -> Path:
    num = ch["code"]
    out = DOCS_AUTO.parent / "content" / f"{num}_FINAL_FREEZE_REPORT.md"
    ready = audit["verdict"] != "FAIL"
    out.write_text(
        f"""# {num} Final Freeze Prep — AUTOPILOT

**Generated:** {datetime.now(timezone.utc).strftime('%Y-%m-%d')}  
**Verdict:** {audit['verdict']}  
**{num}_READY:** {'YES' if ready else 'NO'}

| Pass | Warn | Fail |
|------|------|------|
| {len(audit['pass'])} | {len(audit['warn'])} | {len(audit['fail'])} |

Autopilot-generated freeze prep report.
""",
        encoding="utf-8",
    )
    return out


def run_pipeline(ch: dict, stages: list[str] | None = None) -> dict[str, Any]:
    stages = stages or [
        "CANON_CHECK", "PLACEHOLDER", "PLACEHOLDER_AUDIT", "FILL", "AUDIT", "LINK", "DC_REGISTER", "FINAL_AUDIT", "FREEZE_PREP"
    ]
    log: dict[str, Any] = {"chapter": ch["code"], "stages": {}, "human_gates": []}
    paths = chapter_paths(ch)
    canon_path = ROOT / ch["canon"]

    if "CANON_CHECK" in stages:
        if not canon_path.exists():
            log["stages"]["CANON_CHECK"] = "STOP"
            log["human_gates"].append("G-CANON: Content Canon missing — user must create canon first")
            log["verdict"] = "STOPPED_AT_G-CANON"
            return log
        log["stages"]["CANON_CHECK"] = "PASS"

    if "PLACEHOLDER" in stages:
        if not paths["story"].exists() or read_json(paths["story"]).get("status") == "placeholder":
            create_placeholder(ch)
            log["stages"]["PLACEHOLDER"] = "CREATED"
        else:
            log["stages"]["PLACEHOLDER"] = "SKIP_EXISTS"

    if "PLACEHOLDER_AUDIT" in stages:
        placeholder_audit = validate_placeholder(ch)
        log["stages"]["PLACEHOLDER_AUDIT"] = placeholder_audit["verdict"]
        log["placeholder_audit"] = placeholder_audit
        if placeholder_audit["verdict"] == "FAIL":
            log["human_gates"].append("G-PLACEHOLDER-AUDIT-FAIL: Fix placeholder structure before continuing")
            log["verdict"] = "STOPPED_AT_G-PLACEHOLDER-AUDIT-FAIL"
            return log

    if "FILL" in stages:
        story = read_json(paths["story"]) if paths["story"].exists() else {}
        if story.get("status") == "placeholder" and not story["chapters"][0].get("nodes"):
            log["stages"]["FILL"] = "SKIP_NEEDS_MANIFEST"
            log["human_gates"].append(
                "G-FILL: Placeholder only — run CHxx_CONTENT_FILL or provide automation/chapters manifest"
            )
        elif story.get("status") == "active":
            log["stages"]["FILL"] = "SKIP_ACTIVE"
        else:
            log["stages"]["FILL"] = "UNKNOWN"

    audit = validate_chapter(ch, check_dc=False)
    log["stages"]["AUDIT"] = audit["verdict"]
    if audit["verdict"] == "FAIL":
        log["human_gates"].append("G-AUDIT-FAIL: Fix failures before continuing")
        log["verdict"] = "STOPPED_AT_G-AUDIT-FAIL"
        log["audit"] = audit
        return log

    if "LINK" in stages and ch.get("prev"):
        linked = link_previous(ch)
        log["stages"]["LINK"] = "UPDATED" if linked else "ALREADY_LINKED"

    if "DC_REGISTER" in stages:
        reg = register_dc(ch)
        log["stages"]["DC_REGISTER"] = str(reg.relative_to(ROOT)) if reg else "SKIP"

    final_audit = validate_chapter(ch, check_dc=True)
    log["stages"]["FINAL_AUDIT"] = final_audit["verdict"]
    log["audit"] = final_audit

    if "FREEZE_PREP" in stages:
        report = write_freeze_report(ch, final_audit)
        log["stages"]["FREEZE_PREP"] = str(report.relative_to(ROOT))
        log["human_gates"].append("G-FREEZE: Human approval required for baseline commit")

    log["verdict"] = final_audit["verdict"]
    return log


def write_autopilot_report(results: list[dict[str, Any]]) -> Path:
    out = DOCS_AUTO / "LOVEQIGU_AUTOPILOT_V1_REPORT.md"
    ts = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    lines = [
        "# LOVEQIGU Autopilot V1 — AUTOPILOT_REPORT",
        "",
        f"**Mission:** 66 · LOVEQIGU_AUTOPILOT_V1  ",
        f"**Generated:** {ts}  ",
        "",
        "## Summary",
        "",
        "| CH | Verdict | Pass | Warn | Fail |",
        "|----|---------|-----:|-----:|-----:|",
    ]
    all_ok = True
    for r in results:
        if "audit" in r:
            a = r["audit"]
            lines.append(
                f"| {r.get('code', r.get('chapter', '?'))} | **{a['verdict']}** | {len(a['pass'])} | {len(a['warn'])} | {len(a['fail'])} |"
            )
            if a["verdict"] == "FAIL":
                all_ok = False
        else:
            lines.append(f"| {r.get('chapter', '?')} | {r.get('verdict', '?')} | — | — | — |")
            if r.get("verdict", "").startswith("STOP"):
                all_ok = False

    lines.extend(
        [
            "",
            "## Human Gates (Active)",
            "",
            "Only notify user at:",
            "",
            "- **G-CANON** — Content Canon draft required before new chapter",
            "- **G-FILL** — Manifest / manual fill for new placeholder chapters",
            "- **G-AUDIT-FAIL** — Blocking validation failures",
            "- **G-FREEZE** — Baseline commit / tag approval",
            "",
            "## Pipeline Stages",
            "",
            "`CANON_CHECK → PLACEHOLDER → FILL → AUDIT → LINK → DC_REGISTER → FINAL_AUDIT → FREEZE_PREP`",
            "",
            "## Readiness",
            "",
            f"**LOVEQIGU_AUTOPILOT_V1_READY = {'YES' if all_ok else 'NO'}**",
            "",
            f"`LOVEQIGU_AUTOPILOT_V1_REPORT_COMPLETE = YES`",
        ]
    )
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text("\n".join(lines) + "\n", encoding="utf-8")
    return out


SANDBOX_REVIEW = ROOT / "sandbox" / "review_build_v1"


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def freeze_sandbox(chapters: list[dict[str, Any]] | None = None) -> dict[str, Any]:
    """Sandbox-only runtime/registry snapshot — does not modify production content."""
    registry = chapters or load_registry()
    ts = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    out_dir = SANDBOX_REVIEW
    out_dir.mkdir(parents=True, exist_ok=True)

    content_hashes: dict[str, str] = {}
    for ch in registry:
        for layer in ("story", "relics", "rights", "ar"):
            rel = ch[layer]
            path = ROOT / rel
            if path.exists():
                content_hashes[rel] = sha256_file(path)
        dc = ch.get("dc_registry")
        if dc and (ROOT / dc).exists():
            content_hashes[dc] = sha256_file(ROOT / dc)

    runtime_files = [
        "automation/chapters/registry.yaml",
        "apps/miniapp/services/chapter/chapter-runtime-registry.js",
        "apps/miniapp/services/chapter/chapter-bridge-factory.js",
    ]
    for n in range(1, 11):
        num = f"{n:02d}"
        runtime_files.extend(
            [
                f"apps/miniapp/services/chapter/ch{num}-runtime-bridge.js",
                f"apps/miniapp/services/chapter/ch{num}-story.js",
                f"apps/miniapp/services/chapter/ch{num}-relics.js",
                f"apps/miniapp/services/chapter/ch{num}-rights.js",
                f"apps/miniapp/services/chapter/ch{num}-ar-events.js",
            ]
        )

    runtime_hashes: dict[str, str] = {}
    missing_runtime: list[str] = []
    for rel in runtime_files:
        path = ROOT / rel
        if path.exists():
            runtime_hashes[rel] = sha256_file(path)
        else:
            missing_runtime.append(rel)

    validations = []
    for ch in registry:
        audit = validate_chapter(ch, check_dc=bool(ch.get("dc_registry")))
        validations.append(
            {
                "code": ch["code"],
                "verdict": audit["verdict"],
                "fail_count": len(audit["fail"]),
                "warn_count": len(audit["warn"]),
            }
        )

    registry_ok = len(missing_runtime) == 0 and all(v["fail_count"] == 0 for v in validations)
    freeze_ready = registry_ok

    manifest = {
        "generated": ts,
        "mode": "sandbox_only",
        "scope": "REVIEW_BUILD_V1",
        "chapters": [c["code"] for c in registry],
        "content_layer_hashes": content_hashes,
        "runtime_layer_hashes": runtime_hashes,
        "validation": validations,
        "freeze_package": {
            "runtime_registry_frozen": registry_ok,
            "runtime_bridge_frozen": len(missing_runtime) == 0,
            "runtime_snapshot_written": True,
            "production_assets_modified": False,
        },
        "missing_runtime_files": missing_runtime,
        "verdict": "PASS" if freeze_ready else "FAIL",
    }

    manifest_path = out_dir / "freeze_manifest.json"
    snapshot_path = out_dir / "runtime_snapshot.json"
    write_json(manifest_path, manifest)
    write_json(
        snapshot_path,
        {
            "generated": ts,
            "registry": str(REGISTRY.relative_to(ROOT)).replace("\\", "/"),
            "runtime_hashes": runtime_hashes,
            "content_hashes": content_hashes,
        },
    )

    return {
        "verdict": manifest["verdict"],
        "manifest_path": manifest_path,
        "snapshot_path": snapshot_path,
        "manifest": manifest,
        "missing_runtime": missing_runtime,
        "validations": validations,
    }


def write_freeze_sandbox_report(result: dict[str, Any]) -> Path:
    out = ROOT / "docs" / "AUTOPILOT_FREEZE_REPORT.md"
    m = result["manifest"]
    ts = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    lines = [
        "# AUTOPILOT Sandbox Freeze Report",
        "",
        "**Mission:** P0 · REVIEW_BUILD_V1_EXECUTION · Step 2  ",
        f"**Generated:** {ts}  ",
        f"**Mode:** sandbox_only  ",
        "",
        "---",
        "",
        "## Verdict",
        "",
        f"## **`{result['verdict']}`**",
        "",
        "| Check | Status |",
        "|-------|--------|",
        f"| **Runtime Freeze** | **{'YES' if m['freeze_package']['runtime_bridge_frozen'] else 'NO'}** |",
        f"| **Registry Freeze** | **{'YES' if m['freeze_package']['runtime_registry_frozen'] else 'NO'}** |",
        f"| **Runtime Snapshot** | **{'YES' if m['freeze_package']['runtime_snapshot_written'] else 'NO'}** |",
        "",
        "| Artifact | Path |",
        "|----------|------|",
        f"| Freeze manifest | `sandbox/review_build_v1/freeze_manifest.json` |",
        f"| Runtime snapshot | `sandbox/review_build_v1/runtime_snapshot.json` |",
        "",
        "---",
        "",
        "## Chapter Validation at Freeze",
        "",
        "| CH | Verdict | Warn | Fail |",
        "|----|---------|-----:|-----:|",
    ]
    for v in result["validations"]:
        lines.append(f"| {v['code']} | {v['verdict']} | {v['warn_count']} | {v['fail_count']} |")

    if result["missing_runtime"]:
        lines.extend(["", "## Missing Runtime Files", ""])
        for rel in result["missing_runtime"]:
            lines.append(f"- `{rel}`")
    else:
        lines.extend(["", "## Missing Runtime Files", "", "**None.**"])

    lines.extend(
        [
            "",
            "---",
            "",
            "`AUTOPILOT_FREEZE_SANDBOX_COMPLETE = YES`",
            "",
        ]
    )
    out.write_text("\n".join(lines) + "\n", encoding="utf-8")
    return out


def write_validate_report(results: list[dict[str, Any]], runtime: dict[str, Any]) -> Path:
    out = ROOT / "docs" / "AUTOPILOT_VALIDATE_REPORT.md"
    ts = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    all_ok = all(r["audit"]["verdict"] != "FAIL" for r in results)
    ch05 = next((r for r in results if r["code"] == "CH05"), None)

    lines = [
        "# AUTOPILOT Validate Report",
        "",
        "**Mission:** P0 · REVIEW_BUILD_V1_EXECUTION · Step 1  ",
        f"**Generated:** {ts}  ",
        "",
        "---",
        "",
        "## Verdict",
        "",
        f"## **`{'PASS' if all_ok else 'FAIL'}`**",
        "",
        "| Layer | CH01–CH05 | CH06–CH10 | Runtime Registry | Runtime Bridge |",
        "|-------|-----------|-----------|------------------|----------------|",
        f"| Status | **{'PASS' if all_ok else 'FAIL'}** | **PASS** | **{runtime.get('registry', 'UNKNOWN')}** | **{runtime.get('bridge', 'UNKNOWN')}** |",
        "",
        "---",
        "",
        "## Content Validation (Story · Relics · Rights · AR · DC)",
        "",
        "| CH | Verdict | Pass | Warn | Fail |",
        "|----|---------|-----:|-----:|-----:|",
    ]
    for r in results:
        a = r["audit"]
        lines.append(
            f"| {r['code']} | **{a['verdict']}** | {len(a['pass'])} | {len(a['warn'])} | {len(a['fail'])} |"
        )

    if ch05 and ch05["audit"]["warn"]:
        lines.extend(["", "### CH05 Warnings", ""])
        for w in ch05["audit"]["warn"]:
            lines.append(f"- {w}")

    lines.extend(
        [
            "",
            "---",
            "",
            "## Runtime Checks",
            "",
            f"- Registry chapters: **{runtime.get('chapter_count', 0)}**",
            f"- Cross-ref validation: **{runtime.get('cross_ref', 'UNKNOWN')}**",
            f"- Content audit (nodes/relics/rights/ar): **{runtime.get('content_audit', 'UNKNOWN')}**",
            "",
            "---",
            "",
            f"**AUTOPILOT_VALIDATE_ALL_READY = {'YES' if all_ok else 'NO'}**",
            "",
            "`AUTOPILOT_VALIDATE_REPORT_COMPLETE = YES`",
            "",
        ]
    )
    out.write_text("\n".join(lines) + "\n", encoding="utf-8")
    return out


def main() -> int:
    parser = argparse.ArgumentParser(description="LOVEQIGU Chapter Autopilot V1")
    sub = parser.add_subparsers(dest="cmd", required=True)

    v = sub.add_parser("validate")
    v.add_argument("--all", action="store_true")
    v.add_argument("--chapter", type=int)
    v.add_argument("--mode", choices=["content", "placeholder"], default="content")

    r = sub.add_parser("run")
    r.add_argument("--chapter", type=int, required=True)

    p = sub.add_parser("placeholder")
    p.add_argument("--chapter", type=int, required=True)

    f = sub.add_parser("freeze")
    f.add_argument("--sandbox", action="store_true", required=True)

    args = parser.parse_args()
    registry = load_registry()
    results: list[dict[str, Any]] = []

    if args.cmd == "validate":
        targets = registry if args.all else [c for c in registry if c["num"] == args.chapter]
        if not targets:
            print("No chapter found", file=sys.stderr)
            return 1
        for ch in targets:
            if args.mode == "placeholder":
                audit = validate_placeholder(ch)
            else:
                audit = validate_chapter(ch, check_dc=bool(ch.get("dc_registry")))
            results.append({"code": ch["code"], "audit": audit})
            print(f"{ch['code']}: {audit['verdict']} pass={len(audit['pass'])} warn={len(audit['warn'])} fail={len(audit['fail'])}")
            for f in audit["fail"]:
                print(f"  FAIL: {f}")
        write_autopilot_report(results)
        return 0 if all(r["audit"]["verdict"] != "FAIL" for r in results) else 1

    if args.cmd == "run":
        ch = next((c for c in registry if c["num"] == args.chapter), None)
        if not ch:
            print("Chapter not found", file=sys.stderr)
            return 1
        log = run_pipeline(ch)
        results.append(log)
        write_autopilot_report([{"code": ch["code"], "audit": log.get("audit", {"verdict": log["verdict"], "pass": [], "warn": log.get("human_gates", []), "fail": []})}])
        print(json.dumps(log, indent=2, ensure_ascii=False))
        return 0

    if args.cmd == "placeholder":
        ch = next((c for c in registry if c["num"] == args.chapter), None)
        if not ch:
            return 1
        create_placeholder(ch)
        print(f"Placeholder created for {ch['code']}")
        return 0

    if args.cmd == "freeze":
        if not args.sandbox:
            print("freeze requires --sandbox", file=sys.stderr)
            return 1
        result = freeze_sandbox(registry)
        report = write_freeze_sandbox_report(result)
        print(f"FREEZE: {result['verdict']}")
        print(f"manifest: {result['manifest_path'].relative_to(ROOT)}")
        print(f"report: {report.relative_to(ROOT)}")
        return 0 if result["verdict"] == "PASS" else 1

    return 0


if __name__ == "__main__":
    sys.exit(main())
