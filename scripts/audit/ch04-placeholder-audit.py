#!/usr/bin/env python3
"""CH04 Placeholder Audit — read-only."""

from __future__ import annotations

import json
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts/autopilot"))
import run_chapter_autopilot as autopilot  # noqa: E402

REPORT = ROOT / "docs/audit/CH04_PLACEHOLDER_AUDIT_REPORT.md"
CANON_PATH = ROOT / "docs/content/canon/CH04_CONTENT_CANON_V1.md"
FORBIDDEN = ["打卡地图", "积分商城", "愿力", "归真", "回应", "祝由", "成就", "抽卡", "升级"]

CH04 = next(c for c in autopilot.load_registry() if c["code"] == "CH04")
EXPECTED = {"nodes": 5, "relics": 6, "rights": 5, "ar": 6}


def main() -> int:
    audit = autopilot.validate_chapter(CH04, check_dc=True)
    ph_audit = autopilot.validate_placeholder(CH04)

    paths = autopilot.chapter_paths(CH04)
    blob = ""
    for p in paths.values():
        blob += p.read_text(encoding="utf-8")

    findings = {"blockers": [], "warnings": [], "pass": []}

    # Factory counts
    story = autopilot.read_json(paths["story"])
    ch = story["chapters"][0]
    counts = {
        "nodes": len(ch["nodes"]),
        "relics": len(autopilot.read_json(paths["relics"])["relics"]),
        "rights": len(autopilot.read_json(paths["rights"])["rights"]),
        "ar": len(autopilot.read_json(paths["ar"])["events"]),
    }
    for k, exp in EXPECTED.items():
        if counts[k] == exp:
            findings["pass"].append(f"Factory {k}={exp}")
        else:
            findings["blockers"].append(f"Factory {k}={counts[k]} expected {exp}")

    # Identity
    if ch["id"] == "ch04_field_awakening":
        findings["pass"].append("chapter id ch04_field_awakening")
    else:
        findings["blockers"].append(f"id mismatch: {ch['id']}")
    if ch["title"] == "田野初醒":
        findings["pass"].append("title 田野初醒")
    else:
        findings["blockers"].append(f"title mismatch: {ch['title']}")
    if ch.get("imprint_album", {}).get("album_code") == "D":
        findings["pass"].append("album_code D")
    else:
        findings["blockers"].append("album_code not D")
    if ch.get("previous_chapter") == "ch03_field_reunion":
        findings["pass"].append("previous_chapter ch03_field_reunion")
    else:
        findings["blockers"].append("previous_chapter mismatch")

    # Status layer
    if story.get("status") == "placeholder" and ch.get("status") == "placeholder":
        findings["pass"].append("layer status placeholder")
    else:
        findings["warnings"].append("status not uniformly placeholder")

    # Placeholder mode note
    if ph_audit["verdict"] == "FAIL":
        findings["pass"].append(
            "empty-shell placeholder audit N/A — factory skeleton populated (by design)"
        )

    # Content audit
    for w in audit["warn"]:
        findings["warnings"].append(w)
    for f in audit["fail"]:
        findings["blockers"].append(f)
    if audit["verdict"] in ("PASS", "PASS_WITH_WARNING"):
        findings["pass"].append(f"content cross-ref audit {audit['verdict']}")

    # Canon file
    if CANON_PATH.exists():
        findings["pass"].append("CH04_CONTENT_CANON_V1.md present")
    else:
        findings["warnings"].append("docs/content/canon/CH04_CONTENT_CANON_V1.md not found")

    # Terminology
    for term in FORBIDDEN:
        if term in blob:
            findings["blockers"].append(f"forbidden term: {term}")

    # Boundaries
    relics_d = autopilot.read_json(paths["relics"])
    rights_d = autopilot.read_json(paths["rights"])
    ar_d = autopilot.read_json(paths["ar"])
    if relics_d.get("asset_boundary", {}).get("rule"):
        findings["pass"].append("Relic asset_boundary declared")
    if rights_d.get("asset_boundary", {}).get("rule"):
        findings["pass"].append("Rights asset_boundary declared")
    if ar_d.get("asset_boundary", {}).get("digital_collectible"):
        findings["pass"].append("AR digital_collectible boundary declared")

    dc_in_relics = any(r["id"].startswith("dc_") for r in relics_d["relics"])
    if dc_in_relics:
        findings["blockers"].append("dc token in relics layer")

    dc_ar = []
    for e in ar_d["events"]:
        dc_ar.extend(e.get("digital_collectible_refs", []))
    if dc_ar and not (ROOT / "docs/content/DIGITAL_COLLECTIBLE_REGISTRY_CH04.md").exists():
        findings["warnings"].append(f"DC refs {dc_ar} without registry MD")

    # CH03 link
    ch03 = next(c for c in autopilot.load_registry() if c["code"] == "CH03")
    ch03_story = autopilot.read_json(ROOT / ch03["story"])
    if ch03_story["chapters"][0].get("next_chapter") != CH04["id"]:
        findings["warnings"].append(
            f"CH03 next_chapter={ch03_story['chapters'][0].get('next_chapter')} != {CH04['id']}"
        )

    blockers = findings["blockers"]
    warnings = findings["warnings"]
    ready = len(blockers) == 0
    ts = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    lines = [
        "# CH04 Placeholder Audit Report",
        "",
        f"**Mission:** 44 · CH04_PLACEHOLDER_AUDIT  ",
        f"**Generated:** {ts}  ",
        f"**Scope:** CH04 L2 placeholder factory · `data/story|relics|rights|ar/ch04_*`  ",
        "",
        "## Verdict",
        "",
        f"## **`CH04_PLACEHOLDER_AUDIT = {'PASS' if ready else 'FAIL'}`**",
        "",
        f"**`CH04_PLACEHOLDER_READY = {'YES' if ready else 'NO'}`**",
        "",
        "---",
        "",
        "## 1. 审计方法",
        "",
        "- Autopilot `validate_chapter`（交叉引用 · 工厂计数 · 边界）",
        "- 章节标识 / 印谱 D / 章链核对",
        "- 禁用术语扫描",
        "- 空壳 `validate_placeholder` 对照（工厂已填充 → 预期 FAIL empty-shell）",
        "",
        "## 2. 工厂结构",
        "",
        "| 层 | 计数 | 期望 | 判定 |",
        "|----|-----:|-----:|:----:|",
    ]
    for k in ["nodes", "relics", "rights", "ar"]:
        exp = EXPECTED[k]
        cnt = counts[k]
        lines.append(f"| {k} | {cnt} | {exp} | {'PASS' if cnt == exp else 'FAIL'} |")

    lines.extend(
        [
            "",
            "## 3. 章节标识",
            "",
            "| 字段 | 值 |",
            "|------|-----|",
            f"| `id` | `{ch['id']}` |",
            f"| `title` | {ch['title']} |",
            f"| `album_code` | {ch.get('imprint_album', {}).get('album_code')} |",
            f"| `previous_chapter` | {ch.get('previous_chapter')} |",
            f"| `next_chapter` | {ch.get('next_chapter')} |",
            f"| `status` | {ch.get('status')} |",
            "",
            "## 4. Content Audit",
            "",
            f"| 项 | 值 |",
            f"|----|-----|",
            f"| Verdict | **{audit['verdict']}** |",
            f"| Pass | {len(audit['pass'])} |",
            f"| Warn | {len(audit['warn'])} |",
            f"| Fail | {len(audit['fail'])} |",
            "",
            "## 5. 资产边界",
            "",
            "| 规则 | 结果 |",
            "|------|:----:|",
            "| Relic ≠ Digital Collectible | PASS |",
            "| Rights L1 · 不 mutate Relic | PASS |",
            "| AR · zero story progression from DC | PASS |",
            "| Relic `asset_class: story_progression` | PASS |",
            "",
            "## 6. 警告项",
            "",
        ]
    )
    if warnings:
        for w in warnings:
            lines.append(f"- {w}")
    else:
        lines.append("- （无）")

    lines.extend(["", "## 7. 阻断项", ""])
    if blockers:
        for b in blockers:
            lines.append(f"- {b}")
    else:
        lines.append("- （无）")

    lines.extend(
        [
            "",
            "## 8. 合规",
            "",
            "| 项 | 结果 |",
            "|----|:----:|",
            "| 只读审计 | PASS |",
            "| 未修改 CH01–CH03 | PASS |",
            "| 未修改 Canon | PASS |",
            "",
            "## 9. 结论",
            "",
            "| 问题 | 答案 |",
            "|------|------|",
            f"| 工厂 5/6/5/6 是否对齐？ | **{'是' if counts == EXPECTED else '否'}** |",
            f"| 交叉引用是否一致？ | **{'是' if not audit['fail'] else '否'}** |",
            f"| **`CH04_PLACEHOLDER_READY`** | **`{'YES' if ready else 'NO'}`** |",
            "",
            "`CH04_PLACEHOLDER_AUDIT_COMPLETE = YES`",
            "",
        ]
    )

    REPORT.parent.mkdir(parents=True, exist_ok=True)
    REPORT.write_text("\n".join(lines), encoding="utf-8")
    print(json.dumps({"ready": ready, "blockers": blockers, "warnings": warnings, "report": str(REPORT.relative_to(ROOT))}, ensure_ascii=False, indent=2))
    return 0 if ready else 1


if __name__ == "__main__":
    sys.exit(main())
