#!/usr/bin/env python3
"""
DESIGN AUDIT V2 — AI-POWERED VISUAL COMPLIANCE CHECKER
======================================================
Uses doubao-seed-2-1-turbo-260628 (vision model) to analyze
design images and check against LOVEQIGU visual specifications.

Usage:
  python scripts/audit_design_v2.py "assets/design-input/ChatGPT Image1.png"

Requires:
  - ARK_API_KEY in environment or .env.local
  - ep-20260701204340-cr4p9 endpoint for doubao-seed-2-1-turbo-260628
"""

import json, os, sys, base64, io
from pathlib import Path
from openai import OpenAI

ROOT = Path("D:/LOVEQIGU_MASTER")
ENDPOINT_ID = "ep-20260701204340-cr4p9"
BASE_URL = "https://ark.cn-beijing.volces.com/api/v3"

# ── Load API key ──
ENV_PATH = ROOT / ".env.local"
if ENV_PATH.exists():
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

SPEC_SYSTEM_PROMPT = """你是 LOVEQIGU / AR游伴 视觉规范合规审核员。

## 审计核心原则

请使用 **AR_PAGE_STATE_MACHINE_V1** 页面状态机来判断设计图属于哪个状态，然后仅对该状态的生效规范进行逐条检查。**不适用该状态的规范，跳过不报告**，避免规范冲突导致的过度审查。

## ⚠️ 特别重要 — 状态判定逻辑

第一步：根据图像特征判断页面状态：

| 特征 | 状态 ID | 名称 | 说明 |
|------|---------|------|------|
| 有微信登录按钮 + 无底部导航 | **S00** | LANDING_GUEST | 未登录 Landing Page |
| 无微信登录按钮 + 无底部导航 + 有 portal | **S01** | LANDING_LOGGED_IN | 已登录 Landing |
| 有底部导航 | **S02–S06** | HOME / 子页面 | 系统交互页 |
| 全屏沉浸 | **S07** | AR_SCAN | AR 体验页 |

## ⚠️ CRITICAL: AR_VISUAL_RATIO_ENGINE_V2.1 — 视觉比例约束（现实优先版）

在检查生效规范之前，**必须先进行比例分析**。估算画面中四种成分的占比，并按 V2.1 标准判定违规。

### 四大视觉成分

| 成分 | 代码 | 说明 |
|------|------|------|
| 🏙 文旅现实场景 | `REALITY` | 真实景区、建筑、自然景观、写实山水 |
| 🧭 UI/产品结构 | `UI` | 界面元素、按钮、导航、文字、标题 |
| ✨ 世界增强 | `WORLD` | 超现实/世界观视觉元素 |
| 👤 人物/行为叙事 | `HUMAN` | 人物、路径暗示、用户尺度参照、行为引导 |

**公式**: `REALITY + UI + WORLD + HUMAN = 100%`

### 🚨 现实优先锁定器（V2.1 核心新增）

> WORLD 元素**必须依附于现实场景结构**，禁止独立存在。

| ✅ 允许 | ❌ 禁止 |
|---------|---------|
| 山景中的微光门 | 独立漂浮的法阵 |
| 景区中的温和光环 | 纯星空背景 |
| 建筑上的金色光效 | 无现实锚点的幻想结构 |

### 硬性否决规则（V2.1）

以下规则**任何一条触发则直接判定 FAIL**，必须在 violations 中标记为 `CRITICAL`：

| 规则 | 条件 | 判定 | 说明 |
|------|------|------|------|
| V01 | WORLD > 18% (非 S07) | **FAIL** | 世界增强喧宾夺主 |
| V02 | REALITY < 35% (非 S07) | **FAIL** | 现实基底不足 |
| V03 | UI < 15% (非 S07) | **FAIL** | 无产品结构 |
| V04 | WORLD > UI (非 S07) | **MAJOR** | 幻想压过产品 |
| **V05** | **REALITY < WORLD (非 S07)** | **FAIL** | **现实优先锁定器触发** |

### S00 LANDING_GUEST 比例标准（V2.1）

| 成分 | 目标 | 允许范围 |
|------|------|---------|
| 🏙 REALITY | **65%** | 60–70% |
| 🧭 UI | **20%** | 18–23% |
| ✨ WORLD | **10%** | 8–12% |
| 👤 HUMAN | **5%** | 3–8% |

### S01 LANDING_LOGGED_IN 比例标准

| 成分 | 目标 | 允许范围 |
|------|------|---------|
| 🏙 REALITY | **60%** | 55–65% |
| 🧭 UI | **22%** | 20–25% |
| ✨ WORLD | **10%** | 8–12% |
| 👤 HUMAN | **8%** | 5–10% |

### S02 HOME 比例标准

| 成分 | 目标 | 允许范围 |
|------|------|---------|
| 🏙 REALITY | **45%** | 40–52% |
| 🧭 UI | **35%** | 30–40% |
| ✨ WORLD | **10%** | 8–12% |
| 👤 HUMAN | **10%** | 5–12% |

### S07 AR_SCAN 比例标准

| 成分 | 目标 | 允许范围 |
|------|------|---------|
| 🏙 REALITY | **30%** | 25–40% |
| 🧭 UI | **5%** | 3–8% |
| ✨ WORLD | **45%** | 40–50% |
| 👤 HUMAN | **20%** | 15–25% |
| 👤 HUMAN | **20%** | 15–25% |

### S02 HOME 比例标准

| 成分 | 目标 | 允许范围 |
|------|------|---------|
| 🏙 REALITY | 40% | 30–50% |
| 🧭 UI | 35% | 30–40% |
| ✨ WORLD | 15% | 10–20% |
| 👤 HUMAN | 10% | 5–15% |

### S07 AR_SCAN 比例标准

| 成分 | 目标 | 允许范围 |
|------|------|---------|
| 🏙 REALITY | 30% | 20–40% |
| 🧭 UI | 5% | 0–10% |
| ✨ WORLD | 45% | 35–55% |
| 👤 HUMAN | 20% | 10–30% |

## 各状态的生效规范

### S00 LANDING_GUEST（有微信登录按钮、无底部导航时使用此状态）

**生效规范**（仅检查这些）：
- AR_VISUAL_LAYER_SYSTEM_V4 §1.1：L0 入口层视觉要求
  - 目标：品牌识别、产品介绍、登录引导
  - 视觉：文旅现实风（主）、轻微金色/温润光效、UI清晰、结构完整
  - 禁止：强幻想、完全星空化、游戏化界面
- UI_CONTRACT_SYSTEM_V1 §3 L1 视觉层：门/光/路径隐喻
- UI_CONTRACT_SYSTEM_V1 §3 L3 行为层（仅登录部分）：微信一键登录（主CTA）

**不适用规范**（不要检查这些、不要报告缺失）：
- ❌ UI密度 (18-22%) → S00 密度应为 5-12%
- ❌ 底部导航 / TabBar → S00 禁止
- ❌ 四业务入口（探索/地图/权益/我的）→ S00 禁止
- ❌ L2 状态层 → S00 可选（非强制）
- ❌ BOTTOM_NAV_SYSTEM_V6 → S00 不适用
- ❌ 虚空渐变背景 (#050505 → #0F0530) → 已被 V4 §7 覆盖
- ❌ 精确金色 #C8A24A → S00 仅要求温润金色即可
- ❌ 粒子仅限 portal 边缘 → S00 允许全域温和粒子
- ❌ portal 55-60% 视觉权重 → S00 40-60% 灵活即可

### S01 LANDING_LOGGED_IN（无登录按钮、无底部导航、有 portal 时使用）

**生效规范**（仅检查这些）：
- AR_VISUAL_LAYER_SYSTEM_V4 §1.1：L0→L2 过渡态
- UI_CONTRACT_SYSTEM_V1 §3 L1 视觉层：门/光/路径隐喻
- UI_CONTRACT_SYSTEM_V1 §3 L2 状态层：必须展示四项统计数据
- UI_CONTRACT_SYSTEM_V1 §3 L3 行为层（仅"进入探索"）：不要求进地图/查看信物

**不适用规范**：
- ❌ 底部导航 / TabBar
- ❌ 四业务入口
- ❌ BOTTOM_NAV_SYSTEM_V6
- ❌ 虚空渐变背景

### S02–S06（有底部导航的系统页面）

**生效规范**：
- UI_CONTRACT_SYSTEM_V1 §3：全部三层结构
- AR_VISUAL_LAYER_SYSTEM_V4 §2-3：L1/L2 视觉风格
- BOTTOM_NAV_SYSTEM_V6：底部导航必须
- STRUCTURE_SPEC_LANDING_V3 §2（仅 S02 HOME）
- VISUAL_ASSET_CONTRACT_V1 §10
- Visual Tokens

## 🧠 JUDGE ENGINE V2 输出格式要求

请分析设计图，按照 **JUDGE ENGINE V2** 标准输出。先判断页面状态，再逐项评分。

评分标准：
- **STRUCTURE SCORE** (0-100): UI 结构完整性（登录按钮、标题、状态层、导航结构）
- **VISUAL SCORE** (0-100): 视觉审美质量（风格一致性、氛围、色彩、光效）
- **RATIO SCORE**: 比例合规性（来自比例分析结果）

**JUDGE 最终判定**：
- PASS: 三项分数均 >= 70 且无硬性否决
- FAIL: 任一分数 < 50 或触犯硬性否决（WORLD > 20% / REALITY < 30% / UI < 15%）
- NEED_REGRESSION: 分数在 50-70 之间或存在 MAJOR 违规

输出严格JSON格式：

{
  "judge_engine": "JUDGE_ENGINE_V2",
  "page_state": "S00",
  "state_name": "LANDING_GUEST",
  "visual_layer": "L0",
  "judge_status": "PASS/FAIL/NEED_REGRESSION",
  "scores": {
    "STRUCTURE": 0-100,
    "VISUAL": 0-100,
    "RATIO": 0-100
  },
  "overall_style": "简要描述整体视觉风格",
  "dimensions_ok": true/false,
  "elements_found": {
    "portal_gate": { "present": true/false, "location": "...", "description": "...", "issues": [] },
    "wechat_login_button": { "present": true/false, "location": "...", "color": "...", "has_icon": true/false, "issues": [] },
    "business_entries": { "present": true/false, "count": 0-4, "labels": [], "issues": [] },
    "title_text": { "present": true/false, "text": "...", "style": "...", "issues": [] },
    "stats_dashboard": { "present": true/false, "issues": [] },
    "gold_accents": { "present": true/false, "locations": [], "color_match": "yes/no/partial", "issues": [] },
    "background": { "color": "...", "type": "void_gradient/scenic_illustration/other", "has_competing_elements": true/false, "issues": [] },
    "bottom_nav": { "present": true/false, "items": [], "issues": [] },
    "atmosphere": { "style": "sacred_mystic/scenic_tourism/tech_ui/other", "has_fog_layers": true/false, "has_particles": true/false, "issues": [] }
  },
  "violations": [
    { "severity": "CRITICAL/MAJOR/MINOR", "spec": "违反的规范名和条款", "spec_source": "state_machine/AR_VISUAL_LAYER_SYSTEM_V4/UI_CONTRACT", "finding": "在图中观察到什么", "requirement": "规范要求什么", "fix_suggestion": "如何修改" }
  ],
  "active_specs": ["规范1", "规范2"],
  "inactive_specs": ["规范3", "规范4"],
  "ratio_analysis": {
    "REALITY": 55,
    "UI": 20,
    "WORLD": 15,
    "HUMAN": 10,
    "total": 100,
    "score": 95,
    "violations": []
  },
  "summary": "一句话总结合规情况（需包含状态判断摘要 + 比例分析摘要 + 最终判决摘要）"
}
"""


def generate_report(result: dict, report_path: str):
    """Generate structured audit report from JUDGE ENGINE V2 result."""
    with open(report_path, "w", encoding="utf-8") as f:
        f.write("# Design Audit V2 — AI-Powered Visual Compliance Report\n\n")
        f.write(f"> **Date**: 2026-07-01\n")
        f.write(f"> **Model**: doubao-seed-2-1-turbo-260628\n")
        f.write(f"> **Image**: {result.get('image_path', 'N/A')}\n\n")

        if "error" in result:
            f.write(f"## ERROR\n\n{result['error']}\n")
            return

        # ── JUDGE STATUS ──
        f.write("## JUDGE ENGINE V2 — Final Verdict\n\n")
        js = result.get("judge_status", "N/A")
        status_icon = {"PASS": "PASS", "FAIL": "FAIL", "NEED_REGRESSION": "REGRESSION"}.get(js, "N/A")
        f.write(f"**Status**: {status_icon}\n\n")

        scores = result.get("scores", {})
        f.write("| Score | Value | Min for PASS |\n")
        f.write("|-------|-------|-------------|\n")
        for k in ("STRUCTURE", "VISUAL", "RATIO"):
            v = scores.get(k, "N/A")
            f.write(f"| {k} | {v} | 70 |\n")
        f.write(f"\n**Min Score**: {result.get('min_score', 'N/A')}\n\n")

        # ── Page State ──
        f.write("## Page State\n\n")
        f.write(f"- **State ID**: {result.get('page_state', 'N/A')}\n")
        f.write(f"- **State Name**: {result.get('state_name', 'N/A')}\n")
        f.write(f"- **Visual Layer**: {result.get('visual_layer', 'N/A')}\n")
        f.write(f"- **Active Specs**: {', '.join(result.get('active_specs', []))}\n")
        f.write(f"- **Inactive Specs (skipped)**: {', '.join(result.get('inactive_specs', []))}\n\n")

        # ── Summary ──
        f.write(f"## Summary\n\n{result.get('summary', 'N/A')}\n\n")

        # ── Elements Found ──
        f.write("## Elements Found\n\n")
        elements = result.get("elements_found", {})
        for elem_name, elem_data in elements.items():
            if isinstance(elem_data, dict):
                present = elem_data.get("present", "N/A")
                f.write(f"### {elem_name}\n")
                f.write(f"- Present: {present}\n")
                for k, v in elem_data.items():
                    if k != "present":
                        f.write(f"- {k}: {v}\n")
                f.write("\n")

        # ── Violations ──
        f.write("## Violations\n\n")
        violations = result.get("violations", [])
        if violations:
            f.write("| # | Severity | Spec | Finding | Fix |\n")
            f.write("|---|----------|------|---------|-----|\n")
            for i, v in enumerate(violations, 1):
                sev = v.get("severity", "INFO")
                spec = v.get("spec", "").replace("\n", " ")[:60]
                finding = v.get("finding", "").replace("\n", " ")[:60]
                fix = v.get("fix_suggestion", "").replace("\n", " ")[:60]
                f.write(f"| {i} | {sev} | {spec} | {finding} | {fix} |\n")
        else:
            f.write("No violations detected.\n")

        # ── Ratio Analysis ──
        f.write("\n## Visual Ratio Analysis\n\n")
        ratio = result.get("ratio_analysis", {})
        if ratio:
            f.write("| Component | Estimated % | Target % | Range | Status |\n")
            f.write("|-----------|------------|---------|-------|--------|\n")
            comps = {"REALITY": "文旅现实场景", "UI": "UI/产品结构", "WORLD": "世界增强", "HUMAN": "人物/叙事"}
            for code, label in comps.items():
                val = ratio.get(code, "N/A")
                f.write(f"| {label} | {val}% | — | — | — |\n")
            f.write(f"\n**Total**: {ratio.get('total', 'N/A')}% | **Score**: {ratio.get('score', 'N/A')}/100\n\n")
            rv = ratio.get("violations", [])
            if rv:
                f.write("### Ratio Violations\n\n")
                f.write("| Severity | Rule | Message |\n")
                f.write("|----------|------|---------|\n")
                for v in rv:
                    if isinstance(v, dict):
                        f.write(f"| {v.get('severity', 'INFO')} | {v.get('rule', v.get('component', 'N/A'))} | {v.get('message', '')} |\n")
                    else:
                        f.write(f"| — | — | {v} |\n")
        else:
            f.write("No ratio analysis available.\n")


def encode_image(image_path: str) -> str:
    with open(image_path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")


def audit_design(image_path: str) -> dict:
    if not ARK_API_KEY:
        return {"error": "ARK_API_KEY not found"}
    
    if not os.path.exists(image_path):
        return {"error": f"File not found: {image_path}"}
    
    print(f"[AUDIT] Loading image: {image_path}")
    b64_image = encode_image(image_path)
    
    print(f"[AUDIT] Calling doubao-seed-2-1-turbo-260628 (endpoint: {ENDPOINT_ID})...")
    print(f"[AUDIT] Image size: {len(b64_image) // 1024} KB base64")
    
    client = OpenAI(
        api_key=ARK_API_KEY,
        base_url=BASE_URL,
    )
    
    response = client.chat.completions.create(
        model=ENDPOINT_ID,
        messages=[
            {"role": "system", "content": SPEC_SYSTEM_PROMPT},
            {"role": "user", "content": [
                {"type": "text", "text": "请审核这张LOVEQIGU Landing Page设计图的视觉合规性。严格按照规范逐条检查，输出JSON。"},
                {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{b64_image}", "detail": "high"}},
            ]},
        ],
        temperature=0.1,
        max_tokens=4096,
        response_format={"type": "json_object"},
    )
    
    content = response.choices[0].message.content
    
    # Extract JSON from response (handle potential markdown wrapping)
    if "```json" in content:
        content = content.split("```json")[1].split("```")[0].strip()
    elif "```" in content:
        content = content.split("```")[1].split("```")[0].strip()
    
    try:
        result = json.loads(content)
    except json.JSONDecodeError:
        result = {
            "error": "Failed to parse JSON from model response",
            "raw_response": content[:2000],
        }
    
    result["model"] = "doubao-seed-2-1-turbo-260628"
    result["endpoint"] = ENDPOINT_ID
    result["image_path"] = image_path
    
    return result


if __name__ == "__main__":
    if len(sys.argv) < 2:
        image = str(ROOT / "assets/design-input/ChatGPT Image1.png")
    else:
        image = sys.argv[1]
    
    result = audit_design(image)
    print(json.dumps(result, indent=2, ensure_ascii=False))
    
    # Save report using JUDGE ENGINE V2 formatter
    report_dir = ROOT / "docs/production"
    report_dir.mkdir(parents=True, exist_ok=True)
    report_path = report_dir / "DESIGN_AUDIT_V2_AI_REPORT.md"
    generate_report(result, str(report_path))
    
    print(f"\n[AUDIT] Report saved: {report_path}")
