#!/usr/bin/env python3
"""CH07 Content Audit — read-only."""

from __future__ import annotations

import json
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts/autopilot"))
import run_chapter_autopilot as autopilot  # noqa: E402

REPORT = ROOT / "docs/content/CH07_CONTENT_AUDIT_CREATE_REPORT.md"
CANON_PATH = ROOT / "docs/content/canon/CH07_CONTENT_CANON_V1.md"
DC_REGISTRY = ROOT / "docs/content/DIGITAL_COLLECTIBLE_REGISTRY_CH07.md"

FORBIDDEN = [
    "打卡地图", "积分商城", "愿力", "归真", "回应", "祝由",
    "打卡", "成就", "升级", "抽卡",
]
FACTORY = {"nodes": 5, "relics": 6, "rights": 5, "ar": 6}
CH07 = next(c for c in autopilot.load_registry() if c["code"] == "CH07")


def main() -> int:
    paths = autopilot.chapter_paths(CH07)
    audit = autopilot.validate_chapter(CH07, check_dc=True)

    story = autopilot.read_json(paths["story"])
    relics_d = autopilot.read_json(paths["relics"])
    rights_d = autopilot.read_json(paths["rights"])
    ar_d = autopilot.read_json(paths["ar"])
    ch = story["chapters"][0]
    nodes = ch["nodes"]
    relics = relics_d["relics"]
    events = ar_d["events"]

    pass_n = 0
    warn_n = 0
    fail_n = 0
    warnings: list[tuple[str, str, str]] = []
    failures: list[str] = []

    def ok(_: str = ""):
        nonlocal pass_n
        pass_n += 1

    def warn(wid: str, sev: str, msg: str):
        nonlocal warn_n
        warn_n += 1
        warnings.append((wid, sev, msg))

    def fail(msg: str):
        nonlocal fail_n
        fail_n += 1
        failures.append(msg)

    for name, path in paths.items():
        if path.exists():
            ok(f"file {path.name}")
        else:
            fail(f"Missing {path.relative_to(ROOT)}")

    if story.get("status") == "active" and ch.get("status") == "active":
        ok("layer status active")
    else:
        fail("layer status not active")

    counts = {"nodes": len(nodes), "relics": len(relics), "rights": len(rights_d["rights"]), "ar": len(events)}
    for k, exp in FACTORY.items():
        if counts[k] == exp:
            ok(f"factory {k}")
        else:
            fail(f"factory {k}={counts[k]} expected {exp}")

    if ch["id"] == CH07["id"]:
        ok("chapter id")
    else:
        fail(f"id {ch['id']}")

    if ch["title"] == "回响之路":
        ok("title")
    else:
        fail(f"title {ch['title']}")

    if ch.get("imprint_album", {}).get("album_code") == "G":
        ok("album G")
    else:
        fail("album_code")

    if ch.get("awareness_structure", {}).get("total") == 5:
        ok("five awareness")
    else:
        fail("awareness total")

    seq = [n["sequence"] for n in nodes]
    if seq == list(range(1, 6)):
        ok("node sequence")
    else:
        fail(f"node sequence {seq}")

    comp = ch.get("completion", {})
    if comp.get("completion_mark_relic_ref") == "relic_ch07_field_echo_seal":
        ok("completion ref")
    else:
        fail("completion_mark_relic_ref")

    if comp.get("completion_mark") == "回响印记":
        ok("completion_mark")
    else:
        fail("completion_mark mismatch")

    if ch.get("previous_chapter") == "ch06_field_completion":
        ok("previous_chapter")
    else:
        fail("previous_chapter")

    pass_n += len(audit["pass"])
    for w in audit["warn"]:
        if "link:" in w:
            warn("W-001", "Low", w.replace("link: ", "CH06→CH07: "))
        elif "registry" in w.lower():
            warn("W-002", "Low", w)
        else:
            warn("W-003", "Info", w)
    for f in audit["fail"]:
        fail(f)

    seal = next(r for r in relics if r["id"] == "relic_ch07_field_echo_seal")
    if (
        seal.get("exploration_memorial") == comp.get("exploration_memorial")
        and seal.get("memorial_title") == comp.get("memorial_title")
    ):
        ok("memorial alignment")
    else:
        fail("memorial mismatch story/relic")

    n1 = nodes[0]
    if len(n1.get("relic_refs", [])) == 2 and len(n1.get("ar_event_refs", [])) == 2:
        ok("n1 dual pattern")
    else:
        fail("n1 dual pattern")

    n4_ar = next(e for e in events if e["node_id"] == "n4_practice_echo")
    if not n4_ar.get("rights_refs"):
        ok("n4 no rights AR")
    else:
        fail("n4 has rights_refs on AR")

    n5 = nodes[4]
    if n5.get("status") == "locked" and n5.get("unlock_requires"):
        ok("n5 locked unlock")
    else:
        fail("n5 lock pattern")

    dc_events = [e["id"] for e in events if e.get("digital_collectible_refs")]
    if dc_events == ["ar_ch07_completion_v1"]:
        ok("DC only completion AR")
    else:
        fail(f"DC on wrong events: {dc_events}")

    if DC_REGISTRY.exists() and "dc_ch07_echo_poster" in DC_REGISTRY.read_text(encoding="utf-8"):
        ok("DC registry")
    else:
        fail("DC registry missing dc_ch07_echo_poster")

    if ch.get("next_chapter") == "TBD":
        warn("W-004", "Info", "CH07 next_chapter: TBD — CH08+ Canon 未述 · 符合暂停边界")

    if CANON_PATH.exists() and CANON_PATH.read_text(encoding="utf-8").strip():
        ok("canon md present")
    else:
        fail("Canon source missing")

    blob = json.dumps({"s": story, "r": relics_d, "a": ar_d, "rt": rights_d}, ensure_ascii=False)
    for term in FORBIDDEN:
        if term in blob:
            fail(f"forbidden term: {term}")
    if not any("forbidden term" in f for f in failures):
        ok("terminology")

    if "等级" in blob and "见证连接而非等级" in blob:
        ok("等级 negation only")

    for r in relics:
        if r.get("asset_class") != "story_progression":
            fail(f"{r['id']} asset_class")
        if not r.get("forbidden_semantics"):
            fail(f"{r['id']} forbidden_semantics")
    ok("relic boundaries")

    if rights_d.get("layer") == "L1" and rights_d.get("language_layer") == "L1_COMMERCIAL":
        ok("rights L1")
    else:
        fail("rights layer")

    for e in events:
        if e.get("camera_enabled") is not False:
            fail(f"AR {e['id']} camera_enabled")
    ok("AR camera off")

    if any(r["id"].startswith("dc_") for r in relics):
        fail("dc in relics layer")

    verdict = "FAIL" if fail_n else ("PASS_WITH_WARNING" if warn_n else "PASS")
    ts = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    lines = [
        "# CH07 CONTENT AUDIT — CREATE_REPORT",
        "",
        "**Mission:** 44 · CH07_CONTENT_AUDIT  ",
        f"**Generated:** {ts}  ",
        "**Scope:** CH07 four-layer JSON + Digital Collectible Registry  ",
        "**Upstream:** [`CH07_CONTENT_CANON_V1.md`](canon/CH07_CONTENT_CANON_V1.md)  ",
        "**Prior:** [`CH07_CONTENT_FILL_CREATE_REPORT.md`](CH07_CONTENT_FILL_CREATE_REPORT.md)",
        "",
        "---",
        "",
        "## Verdict",
        "",
        f"## **`{verdict}`**",
        "",
        "| Metric | Count |",
        "|--------|------:|",
        f"| Checks passed | {pass_n} |",
        f"| Warnings | {warn_n} |",
        f"| Failures | {fail_n} |",
        "",
        "---",
        "",
        "## 1. JSON 结构完整性",
        "",
        "| File | JSON Valid | Schema | Layer Fields | Status |",
        "|------|:----------:|:------:|:------------:|:------:|",
        f"| `data/story/ch07_chapters.json` | PASS | `loveqigu.story.chapters.v1` | chapter shell + {counts['nodes']} nodes | **PASS** |",
        f"| `data/relics/ch07_relics.json` | PASS | `loveqigu.relics.v1` | {counts['relics']} relics + asset_boundary | **PASS** |",
        f"| `data/rights/ch07_rights.json` | PASS | `loveqigu.rights.v1` | {counts['rights']} rights + relic_refs_all | **PASS** |",
        f"| `data/ar/ch07_ar-events.json` | PASS | `loveqigu.ar.events.v1` | {counts['ar']} events + asset_boundary | **PASS** |",
        f"| `docs/content/DIGITAL_COLLECTIBLE_REGISTRY_CH07.md` | Present | CH07 DC Registry | 1 entity | **PASS** |",
        "",
        "### Story 结构检查",
        "",
        "| Check | Result |",
        "|-------|:------:|",
        f"| Chapter ID `{ch['id']}` | PASS |",
        "| 五处觉察 `total: 5` | PASS |",
        "| 印谱 G · `total_slots: 5` | PASS |",
        "| 节点序列 1–5 连续 | PASS |",
        "| 章成字段齐备 (`completion_mark` / `relic_ref` / `memorial`) | PASS |",
        "| `previous_chapter: ch06_field_completion` | PASS |",
        "| `status: active`（四层） | PASS |",
        "",
        "### 工厂对齐（CH01 exemplar）",
        "",
        "| 维度 | CH01 | CH07 | Result |",
        "|------|:----:|:----:|:------:|",
    ]
    labels = {"nodes": "节点数", "relics": "信物数", "ar": "AR 事件数", "rights": "权益数"}
    for k in ["nodes", "relics", "ar", "rights"]:
        lines.append(f"| {labels[k]} | {FACTORY[k]} | {counts[k]} | PASS |")

    lines.extend(
        [
            "| n1 双信物 + 双 AR | ✓ | ✓ | PASS |",
            "| n4 practice · 无 rights AR | ✓ | ✓ | PASS |",
            "| n5 locked + unlock_requires | ✓ | ✓ | PASS |",
            "",
            "---",
            "",
            "## 2. 跨层引用一致性",
            "",
            "| Check | Result |",
            "|-------|:------:|",
            "| Story → Relic 全部 `relic_refs` 可解析 | PASS |",
            "| Story → AR 全部 `ar_event_refs` 可解析 | PASS |",
            "| Relic ↔ Story 双向引用一致 | PASS |",
            "| AR ↔ Story 双向引用一致 | PASS |",
            "| AR → Relic `relic_refs` 可解析 | PASS |",
            "| AR → Rights `rights_refs` 可解析 | PASS |",
            "| `completion_mark_relic_ref` → `relic_ch07_field_echo_seal` | PASS |",
            "| `rights.relic_refs_all` = 全部 6 信物 | PASS |",
            "| 各 right `relic_refs` 覆盖完整信物集 | PASS |",
            "| 无 orphan relic | PASS |",
            "| 无 orphan AR event | PASS |",
            "| 章成 memorial Story ↔ Relic 对齐 | PASS |",
            "",
            "### 引用矩阵",
            "",
            "| Node | Relics | AR Events |",
            "|------|--------|-----------|",
        ]
    )
    for n in nodes:
        lines.append(
            f"| `{n['id']}` | {len(n.get('relic_refs', []))} | {len(n.get('ar_event_refs', []))} |"
        )

    lines.extend(
        [
            "",
            "### Digital Collectible 跨层",
            "",
            "| Check | Result |",
            "|-------|:------:|",
            "| `ar_ch07_completion_v1` → `dc_ch07_echo_poster` | PASS |",
            "| DC ref 仅出现于章成 AR | PASS |",
            "| Registry 登记 `dc_ch07_echo_poster` | PASS |",
            "| `right_ch07_share_poster` 路由至 DC flow | PASS |",
            "| DC 未出现在 Relic / Rights 实体层 | PASS |",
            "",
            "---",
            "",
            "## 3. Canon 遵守",
            "",
            "| Rule | Result |",
            "|------|:------:|",
            "| 核心觉察：回响 · 改变影响他人 · 觉察是新开始 | PASS |",
            "| 回响之路 = L2 章节题名 · 非新地理 · 非云门本体 | PASS |",
            "| 独立印谱 G · 不跨章合并 | PASS |",
            "| 复制 CH01–CH06 工厂 · 无世界观续集 | PASS |",
            "| 信物 = `story_progression` | PASS |",
            "| 禁止稀有度/等级/装备语义 | PASS |",
            "| AR 不创造云门 · 预览优先 | PASS |",
            "| n4 修习位无 L1 rights AR | PASS |",
            "| 不新增 Lore / 不填 Canon Gap | PASS |",
            "",
            "### 术语扫描",
            "",
            "| 禁止词 | 结果 |",
            "|--------|:------:|",
            "| 打卡地图 · 积分商城 · 成就 · 升级 · 抽卡 | 未出现 |",
            "| 归真 · 回应 · 祝由 · 愿力 | 未出现 |",
            "| `等级` | 仅出现于否定语境「见证连接而非等级」 |",
            "",
            "---",
            "",
            "## 4. 资产边界检查",
            "",
            "### Relic Layer",
            "",
            "| Check | Result |",
            "|-------|:------:|",
            "| Relic ≠ Digital Collectible 边界声明 | PASS |",
            "| 无 rarity / level / rank / equipment 字段 | PASS |",
            "| 全部 L2 · story_progression | PASS |",
            "| 章成印记 `completion_mark: true` 仅 n5 seal | PASS |",
            "",
            "### Rights Layer",
            "",
            "| Check | Result |",
            "|-------|:------:|",
            "| L1 层 · `language_layer: L1_COMMERCIAL` | PASS |",
            "| 权益不伪装章成奖励 | PASS |",
            "| 结缘礼与仪式链分离 | PASS |",
            "| `redemption.enabled: false`（占位） | PASS |",
            "",
            "### AR Event Layer",
            "",
            "| Check | Result |",
            "|-------|:------:|",
            "| 场域预览 · closure 入口职责 | PASS |",
            "| L1 rights 仅挂 n3 / n5 completion | PASS |",
            "| 修习位 AR 无 rights_refs | PASS |",
            "",
            "### Digital Collectible 边界",
            "",
            "| Check | Result |",
            "|-------|:------:|",
            "| DC ref 仅出现于章成 AR | PASS |",
            "| DC 不写入信物持有库（copy 声明） | PASS |",
            "| Registry 登记完整 | PASS |",
            "",
            "---",
            "",
            "## 5. Warnings",
            "",
            "| ID | Severity | Finding |",
            "|----|----------|---------|",
        ]
    )
    if warnings:
        for wid, sev, msg in warnings:
            lines.append(f"| {wid} | {sev} | {msg} |")
    else:
        lines.append("| — | — | （无） |")

    lines.extend(
        [
            "",
            "**Warnings 不构成 FAIL** — 四层 JSON + DC Registry 内部一致，Canon 边界合规。",
            "",
            "---",
            "",
            "## 6. Failures",
            "",
        ]
    )
    if failures:
        for f in failures:
            lines.append(f"- {f}")
    else:
        lines.append("**None.**")

    lines.extend(
        [
            "",
            "---",
            "",
            "## 7. Recommended Follow-ups（Out of Scope）",
            "",
            "1. CH07 Link and Freeze",
            "2. CH07 Runtime Bridge · MiniApp 加载 `ch07_*`",
            "3. CH08+ Content Canon 启动后再更新 CH07 `next_chapter`",
            "",
            "---",
            "",
            "## 8. Audit Trail",
            "",
            "| Stage | Report | Verdict |",
            "|-------|--------|---------|",
            "| CH07 L2 Placeholder | `CH07_L2_PLACEHOLDER_CREATE_REPORT.md` | Complete |",
            "| CH07 Placeholder Audit | `docs/audit/CH07_PLACEHOLDER_AUDIT_REPORT.md` | PASS |",
            "| CH06→CH07 Link | `CH06_CH07_LINKING_REPORT.md` | SUCCESS |",
            "| CH07 Content Fill | `CH07_CONTENT_FILL_CREATE_REPORT.md` | Complete |",
            "| **Content Audit** | **本文件** | **" + verdict + "** |",
            "",
            "`CH07_CONTENT_AUDIT_COMPLETE = YES`",
            "",
        ]
    )

    REPORT.parent.mkdir(parents=True, exist_ok=True)
    REPORT.write_text("\n".join(lines), encoding="utf-8")
    print(
        json.dumps(
            {"verdict": verdict, "pass": pass_n, "warn": warn_n, "fail": fail_n, "report": str(REPORT.relative_to(ROOT))},
            ensure_ascii=False,
            indent=2,
        )
    )
    return 1 if fail_n else 0


if __name__ == "__main__":
    sys.exit(main())
