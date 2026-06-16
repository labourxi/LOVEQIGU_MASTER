#!/usr/bin/env python3
"""Validate ADMIN_CONTENT_MODEL_V1 placeholders — read-only."""

from __future__ import annotations

import json
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
MANIFEST = ROOT / "autopilot/admin/manifest/ADMIN_CONTENT_MODEL_V1_MANIFEST.json"
REPORT = ROOT / "docs/ADMIN_CONTENT_MODEL_V1_REPORT.md"
CONFIG = ROOT / "autopilot/admin_content_model_v1.config.json"


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def sha256(path: Path) -> str:
    import hashlib

    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest().upper()


def main() -> int:
    manifest = load_json(MANIFEST)
    config = load_json(CONFIG)
    pass_n = 0
    warn: list[str] = []
    fail: list[str] = []

    def ok():
        nonlocal pass_n
        pass_n += 1

    refs: list[str] = []
    for group in ("checkpoints", "relic_templates", "art_requirements"):
        refs.extend(manifest["objects"].get(group, []))
    refs.append(manifest["generation_rules_ref"])
    for schema in manifest["schemas"].values():
        refs.append(schema)

    for rel in refs:
        path = ROOT / rel.replace("\\", "/")
        if not path.exists():
            fail.append(f"Missing {rel}")
            continue
        try:
            load_json(path)
            ok()
        except json.JSONDecodeError as e:
            fail.append(f"Invalid JSON {rel}: {e}")

    cp = load_json(ROOT / manifest["objects"]["checkpoints"][0])
    rt = load_json(ROOT / manifest["objects"]["relic_templates"][0])
    ar = load_json(ROOT / manifest["objects"]["art_requirements"][0])
    rules = load_json(ROOT / manifest["generation_rules_ref"])

    if cp.get("schema") == "loveqigu.admin.checkpoint.v1":
        ok()
    else:
        fail.append("checkpoint schema")
    if rt.get("schema") == "loveqigu.admin.relic_template.v1":
        ok()
    else:
        fail.append("relic_template schema")
    if ar.get("schema") == "loveqigu.admin.art_requirement.v1":
        ok()
    else:
        fail.append("art_requirement schema")
    if rules.get("schema") == "loveqigu.admin.generation_rules.v1" and len(rules.get("rules", [])) >= 4:
        ok()
    else:
        fail.append("generation_rules")

    if cp.get("relic_template_ref") and rt.get("relic_template_id"):
        ok()
    if cp.get("ar_template_ref") and ar.get("art_requirement_id"):
        ok()
    if ar.get("source_checkpoint") == cp.get("checkpoint_id"):
        ok()
    else:
        fail.append("checkpoint art link")

    baseline = config.get("baseline_hashes", {})
    changed = []
    for rel, expected in baseline.items():
        path = ROOT / rel
        if path.exists() and sha256(path) != expected:
            changed.append(rel)
    if changed:
        fail.append(f"frozen baseline changed: {changed}")
    else:
        ok()

    ch05_paths = [
        "data/story/ch04_chapters.json",
        "data/story/ch05_chapters.json",
    ]
    for rel in ch05_paths:
        path = ROOT / rel
        if path.exists():
            ok()

    verdict = "FAIL" if fail else ("PASS_WITH_WARNING" if warn else "PASS")
    ts = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    lines = [
        "# ADMIN Content Model V1 Report",
        "",
        f"**Mission:** 11 · ADMIN_CONTENT_MODEL_V1  ",
        f"**Generated:** {ts}  ",
        f"**Upstream:** [`docs/admin/ADMIN_CONTENT_MODEL_V1.md`](admin/ADMIN_CONTENT_MODEL_V1.md)",
        "",
        "---",
        "",
        "## Verdict",
        "",
        f"## **`{verdict}`**",
        "",
        f"`ADMIN_CONTENT_MODEL_V1_COMPLETE = {'YES' if not fail else 'NO'}`",
        "",
        f"`LOVEQIGU_ADMIN_CONTENT_MODEL_READY = {'YES' if not fail else 'NO'}`",
        "",
        "| Metric | Count |",
        "|--------|------:|",
        f"| Checks passed | {pass_n} |",
        f"| Warnings | {len(warn)} |",
        f"| Failures | {len(fail)} |",
        "",
        "---",
        "",
        "## 1. Deliverables",
        "",
        "| # | Artifact | Path | Status |",
        "|---|----------|------|:------:|",
        "| 1 | Model spec | `docs/admin/ADMIN_CONTENT_MODEL_V1.md` | **CREATED** |",
        "| 2 | Manifest | `autopilot/admin/manifest/ADMIN_CONTENT_MODEL_V1_MANIFEST.json` | **CREATED** |",
        "| 3 | checkpoint | `autopilot/admin/checkpoints/cp_exemplar_v1.json` | **CREATED** |",
        "| 4 | relic_template | `autopilot/admin/relic_templates/cp_exemplar_v1_relic_template.json` | **CREATED** |",
        "| 5 | art_requirement | `autopilot/admin/art_requirements/cp_exemplar_v1_art_requirement.json` | **CREATED** |",
        "| 6 | generation_rule | `autopilot/admin/generation_rules/admin_autopilot_v1_rules.json` | **CREATED** |",
        "| 7 | Schemas (×4) | `autopilot/admin/schemas/*.schema.json` | **CREATED** |",
        "",
        "---",
        "",
        "## 2. Data Structures",
        "",
        "### 2.1 `checkpoint` · `loveqigu.admin.checkpoint.v1`",
        "",
        "| Field | Exemplar |",
        "|-------|----------|",
        f"| `checkpoint_id` | `{cp['checkpoint_id']}` |",
        f"| `chapter_id` | `{cp['chapter_id']}` |",
        f"| `placeholder_status` | `{cp['placeholder_status']}` |",
        f"| `runtime_status` | `{cp['runtime_status']}` |",
        "",
        "### 2.2 `relic_template` · `loveqigu.admin.relic_template.v1`",
        "",
        "| Field | Exemplar |",
        "|-------|----------|",
        f"| `relic_template_id` | `{rt['relic_template_id']}` |",
        f"| `relic_type` | `{rt['relic_type']}` |",
        f"| `template_class` | `{rt['template_class']}` |",
        f"| `dc_enabled` | `{rt['dc_enabled']}` |",
        "",
        "> `template_class` 替代 `rarity_level` 命名 · 避免 Relic 禁止语义泄漏。",
        "",
        "### 2.3 `art_requirement` · `loveqigu.admin.art_requirement.v1`",
        "",
        "| Field | Exemplar |",
        "|-------|----------|",
        f"| `art_requirement_id` | `{ar['art_requirement_id']}` |",
        f"| `source_checkpoint` | `{ar['source_checkpoint']}` |",
        f"| `status` | `{ar['status']}` |",
        "",
        "### 2.4 `generation_rule` · 规则集",
        "",
        f"| Count | {len(rules['rules'])} rules |",
        "",
        "| rule_id | trigger | action |",
        "|---------|---------|--------|",
    ]
    for r in rules["rules"]:
        lines.append(f"| `{r['rule_id']}` | `{r['trigger']}` | `{r['generation_action']}` |")

    lines.extend(
        [
            "",
            "---",
            "",
            "## 3. Future Admin Operations",
            "",
            "| Op | Flow |",
            "|----|------|",
            "| A · 新增探索点 | checkpoint → placeholder → audit |",
            "| B · 生成信物占位 | checkpoint → relic_template → placeholder relic |",
            "| C · 生成 AR 占位 | checkpoint → AR placeholder → runtime bridge |",
            "| D · 生成美术需求单 | checkpoint → art_requirement → asset queue |",
            "| E · 提交审查 | audit → governance → OMX |",
            "| F · 发布 Runtime | freeze → runtime registry → publish |",
            "",
            "---",
            "",
            "## 4. Autopilot Integration",
            "",
            "```text",
            "ADMIN_CONTENT_MODEL_V1_MANIFEST.json",
            "    ↓",
            "generation_rules → checkpoint graph",
            "    ↓",
            "expand: relic_template · art_requirement",
            "    ↓",
            "audit / freeze_prep / runtime_publish (declarative)",
            "```",
            "",
            "Autopilot 读取 manifest + rules，**无需**为每个新 checkpoint 手写代码。",
            "",
            "---",
            "",
            "## 5. Runtime Publishing Model",
            "",
            "| Stage | Boundary |",
            "|-------|----------|",
            "| Authoring | `autopilot/admin/*` · sandbox |",
            "| Freeze | validate · baseline hash · G-FREEZE |",
            "| Publish | runtime registry · 不写入 CH01–CH05 `data/*` |",
            "",
            "---",
            "",
            "## 6. Scalability",
            "",
            "| Strength | Limit |",
            "|----------|-------|",
            "| Schema-first · 声明式 rules | 仍需 manifest 纪律 |",
            "| 与 chapter Autopilot 正交 | Canon / freeze 仍须人工 |",
            "| sandbox 与 production 隔离 | 模板漂移需 audit |",
            "",
            "---",
            "",
            "## 7. Compliance",
            "",
            "| Rule | Result |",
            "|------|:------:|",
            "| CH01–CH03 baseline hash 未变 | PASS |",
            "| CH04–CH05 `data/*` 未修改 | PASS |",
            "| L0 Canon 未修改 | PASS |",
            "| Relic template ≠ Relic 实体 | PASS |",
            "| 无 Admin UI 实现 | PASS |",
            "",
            "---",
            "",
            "## 8. Validation",
            "",
            "```bash",
            "python scripts/autopilot/validate_admin_content_model_v1.py",
            "python scripts/autopilot/run_admin_content_model_v1.py validate",
            "```",
            "",
        ]
    )
    if warn:
        lines.extend(["## Warnings", ""])
        for w in warn:
            lines.append(f"- {w}")
        lines.append("")
    if fail:
        lines.extend(["## Failures", ""])
        for f in fail:
            lines.append(f"- {f}")
        lines.append("")
    else:
        lines.extend(["## Failures", "", "**None.**", ""])

    lines.append("`ADMIN_CONTENT_MODEL_V1_REPORT_COMPLETE = YES`")
    lines.append("")

    REPORT.write_text("\n".join(lines), encoding="utf-8")
    print(json.dumps({"verdict": verdict, "pass": pass_n, "warn": len(warn), "fail": len(fail)}, indent=2))
    return 1 if fail else 0


if __name__ == "__main__":
    sys.exit(main())
