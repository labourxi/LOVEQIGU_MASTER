#!/usr/bin/env python3
"""
AR VISUAL RATIO ENGINE V2.1 — 视觉比例控制引擎（微调版）

V2 → V2.1 变化（2026-07-01）：
  1. REALITY 目标从 60% 提升至 65% (范围 60-70%)
  2. WORLD  目标从 12% 降低至 10% (范围 8-12%)
  3. 新增"现实优先锁定器"：WORLD 元素必须依附现实结构
  4. 新增 V05 规则：独立漂浮 WORLD 元素直接 FAIL
  5. 收紧硬性否决：WORLD > 18% 即 FAIL (从 20% 收紧)

用法：
  from ar_visual_ratio_engine import check_ratio_v21, judge_engine_v21, get_prompt_constraint_v21
"""

# ════════════════════════════════════════════
# V2.1 比例规范定义
# ════════════════════════════════════════════
#
# V2.1 相比 V2 的微调：
#   V2:   REALITY 目标 60%, 范围 55-65%
#   V2.1: REALITY 目标 65%, 范围 60-70%  ← 提升 5%
#
#   V2:   WORLD 目标 12%, 范围 10-15%
#   V2.1: WORLD 目标 10%, 范围 8-12%     ← 降低 3%
#
#   V2:   WORLD > 20% → FAIL
#   V2.1: WORLD > 18% → FAIL             ← 收紧 2%
#
#   新增 V2.1: "现实优先锁定器" — WORLD 必须依附现实结构

RATIO_SPEC_V21 = {
    # ── S00: LANDING_GUEST（未登录 Landing） ──
    "S00": {
        "REALITY": {"target": 65, "range": (60, 70), "label": "文旅现实场景",
                    "min_hard": 35, "message_hard": "无现实场景基底"},
        "UI":      {"target": 20, "range": (18, 23), "label": "UI/产品结构",
                    "min_hard": 15, "message_hard": "无产品结构"},
        "WORLD":   {"target": 10, "range": (8, 12),  "label": "世界增强",
                    "max_hard": 18, "message_hard": "世界增强喧宾夺主"},
        "HUMAN":   {"target": 5,  "range": (3, 8),   "label": "人物/行为叙事"},
    },
    # ── S01: LANDING_LOGGED_IN（已登录 Landing） ──
    "S01": {
        "REALITY": {"target": 60, "range": (55, 65), "label": "文旅现实场景",
                    "min_hard": 35, "message_hard": "无现实场景基底"},
        "UI":      {"target": 22, "range": (20, 25), "label": "UI/产品结构",
                    "min_hard": 18, "message_hard": "无产品结构"},
        "WORLD":   {"target": 10, "range": (8, 12),  "label": "世界增强",
                    "max_hard": 18, "message_hard": "世界增强喧宾夺主"},
        "HUMAN":   {"target": 8,  "range": (5, 10),  "label": "人物/行为叙事"},
    },
    # ── S02: HOME（登录后首页） ──
    "S02": {
        "REALITY": {"target": 45, "range": (40, 52), "label": "文旅现实场景",
                    "min_hard": 25, "message_hard": "无现实场景基底"},
        "UI":      {"target": 35, "range": (30, 40), "label": "UI/产品结构",
                    "min_hard": 25, "message_hard": "UI 结构不足"},
        "WORLD":   {"target": 10, "range": (8, 12),  "label": "世界增强",
                    "max_hard": 18, "message_hard": "世界增强喧宾夺主"},
        "HUMAN":   {"target": 10, "range": (5, 12),  "label": "人物/行为叙事"},
    },
    # ── S07: AR_SCAN（AR 沉浸） ──
    "S07": {
        "REALITY": {"target": 30, "range": (25, 40), "label": "文旅现实场景",
                    "min_hard": 15, "message_hard": "无现实场景基底"},
        "UI":      {"target": 5,  "range": (3, 8),   "label": "UI/产品结构",
                    "max_hard": 15, "message_hard": "UI 过重"},
        "WORLD":   {"target": 45, "range": (40, 50), "label": "世界增强",
                    "min_hard": 25, "message_hard": "AR 增强不足"},
        "HUMAN":   {"target": 20, "range": (15, 25), "label": "人物/行为叙事"},
    },
}

# ── V2.1 硬性否决规则 ──
HARD_VETO_RULES_V21 = [
    {"id": "V01", "check": lambda sid, c: c["WORLD"] >= 18.1 and sid != "S07",
     "severity": "CRITICAL", "message": "世界增强({WORLD}%) > 18%, 喧宾夺主, 直接 FAIL"},
    {"id": "V02", "check": lambda sid, c: c["REALITY"] < 35 and sid != "S07",
     "severity": "CRITICAL", "message": "文旅现实场景({REALITY}%) < 35%, 现实基底不足, 直接 FAIL"},
    {"id": "V03", "check": lambda sid, c: c["UI"] < 15 and sid not in ("S07",),
     "severity": "CRITICAL", "message": "UI({UI}%) < 15%, 无产品结构, 直接 FAIL"},
    {"id": "V04", "check": lambda sid, c: c["WORLD"] > c["UI"] and sid != "S07",
     "severity": "MAJOR", "message": "世界增强({WORLD}%) > UI({UI}%), 幻想压过产品"},
    # ── V2.1 新增: 现实优先锁定器 ──
    {"id": "V05", "check": lambda sid, c: c["REALITY"] < c["WORLD"] and sid != "S07",
     "severity": "CRITICAL", "message": "现实({REALITY}%) < 增强({WORLD}%), 现实优先锁定器触发, 直接 FAIL"},
]


def check_ratio_v21(state_id, reality, ui, world, human):
    """
    V2.1 比例检查。更强调现实优先。
    """
    spec = RATIO_SPEC_V21.get(state_id)
    total = reality + ui + world + human
    violations = []
    score = 100
    deductions = {"CRITICAL": 35, "MAJOR": 10, "MINOR": 3}
    components = {"REALITY": reality, "UI": ui, "WORLD": world, "HUMAN": human}

    if not spec:
        return {
            "engine": "V2.1",
            "pass": True,
            "score": 100,
            "violations": [],
            "components": components,
            "total": total,
        }

    # 1. 检查各成分推荐范围
    for name, value in components.items():
        if name not in spec:
            continue
        target = spec[name]["target"]
        min_v, max_v = spec[name]["range"]
        if value < min_v or value > max_v:
            deviation = abs(value - target) / max(target, 1) * 100
            sev = "MAJOR" if deviation > 15 else "MINOR"
            violations.append({
                "severity": sev,
                "component": name,
                "actual": value,
                "expected_range": f"{min_v}-{max_v}%",
                "message": f"{spec[name]['label']}({value}%) 超出推荐范围 [{min_v}-{max_v}%]"
            })
            score -= deductions.get(sev, 3)

    # 2. 硬性否决规则
    for rule in HARD_VETO_RULES_V21:
        try:
            if rule["check"](state_id, components):
                msg = rule["message"].format(**components)
                violations.append({
                    "severity": rule["severity"],
                    "rule": rule["id"],
                    "message": msg,
                })
                score -= deductions.get(rule["severity"], 10)
        except Exception:
            pass

    # 3. 各状态额外规则
    spec_rules = {
        "S00": [
            ("HUMAN == 0", "MAJOR", "人物/叙事 = 0%, 无用户尺度参照"),
            ("c.REALITY < 50 and c.REALITY >= 35", "MAJOR", "文旅现实场景({REALITY}%) 低于 50%, 现实优先度不足"),
        ],
        "S02": [
            ("c.UI < 25", "MAJOR", "UI({UI}%) < 25%, HOME 需要完整 UI"),
        ],
        "S07": [
            ("c.WORLD < 30", "MAJOR", "世界增强({WORLD}%) < 30%, AR 需要足够增强"),
        ],
    }
    for cond_str, sev, msg_pattern in spec_rules.get(state_id, []):
        try:
            c = components
            if eval(cond_str):
                msg = msg_pattern.format(**components)
                violations.append({"severity": sev, "rule": "spec", "message": msg})
                score -= deductions.get(sev, 3)
        except Exception:
            pass

    score = max(0, min(100, score))
    return {
        "engine": "V2.1",
        "pass": score >= 70,
        "score": score,
        "violations": violations,
        "components": components,
        "total": total,
    }


# ════════════════════════════════════════════
# JUDGE ENGINE V2.1 — 强化现实优先级
# ════════════════════════════════════════════

def judge_engine_v21(state_id, structure_score, visual_score,
                     reality, ui, world, human):
    """
    JUDGE ENGINE V2.1 判决系统。
    
    新增 V2.1 逻辑：
      - 如果触发了 V05（现实 < 增强 = 锁定器触发），直接 FAIL
      - 即使分数达标，REALITY < 50 也标记 NEED_REGRESSION
    """
    ratio_result = check_ratio_v21(state_id, reality, ui, world, human)
    ratio_score = ratio_result["score"]
    violations = list(ratio_result["violations"])

    has_veto = any(
        v["severity"] == "CRITICAL" and v.get("rule", "").startswith("V")
        for v in violations
    )

    # V2.1 新增：如果现实 < 增强，即使分数够也强制 FAIL
    anchor_triggered = any(v.get("rule") == "V05" for v in violations)

    final_scores = {
        "STRUCTURE": max(0, min(100, structure_score)),
        "VISUAL": max(0, min(100, visual_score)),
        "RATIO": ratio_score,
    }

    min_score = min(final_scores.values())
    has_major = any(v["severity"] == "MAJOR" for v in violations)

    # V2.1: 现实优先锁定器触发 → 直接 FAIL
    if anchor_triggered:
        status = "FAIL"
    elif has_veto or min_score < 50:
        status = "FAIL"
    elif min_score >= 70 and not has_major:
        status = "PASS"
    else:
        status = "NEED_REGRESSION"

    return {
        "engine": "JUDGE_ENGINE_V2.1",
        "state_id": state_id,
        "status": status,
        "scores": final_scores,
        "min_score": min_score,
        "violations": violations,
        "has_veto": has_veto,
        "anchor_triggered": anchor_triggered,
    }


def get_prompt_constraint_v21(state_id):
    """
    V2.1 生成 prompt 约束段落。
    更强调"现实优先"和"依附结构"。
    """
    spec = RATIO_SPEC_V21.get(state_id)
    if not spec:
        return ""

    state_names = {
        "S00": "LANDING_GUEST（未登录 Landing）",
        "S01": "LANDING_LOGGED_IN（已登录 Landing）",
        "S02": "HOME（系统首页）",
        "S07": "AR_SCAN（AR 沉浸）",
    }

    lines = []
    lines.append("")
    lines.append("=== AR VISUAL RATIO ENGINE V2.1 — 生成前强制约束 ===")
    lines.append("")
    lines.append(f"状态: [{state_id} {state_names.get(state_id, '')}]")
    lines.append("")
    lines.append("视觉成分必须遵守以下比例（总和 = 100%）：")
    lines.append("")

    for code, info in spec.items():
        if code == "rules":
            continue
        lines.append(f"  [{code}] {info['label']}: 目标 {info['target']}%，范围 {info['range'][0]}-{info['range'][1]}%")

    lines.append("")
    lines.append("现实优先锁定器规则（必须遵守）：")
    lines.append("  - 世界增强元素（WORLD）必须依附于现实场景结构")
    lines.append("  - 禁止独立漂浮的法阵、纯星空背景、无现实锚点的幻想元素")
    lines.append("  - 示例：山景中的微光门 [OK] | 独立漂浮法阵 [NO] | 纯星空结构 [NO]")
    lines.append("")
    lines.append("硬性限制（违反则直接 FAIL）：")
    lines.append("  - 世界增强（WORLD）不得超过 18%")
    lines.append("  - 文旅现实场景（REALITY）不得少于 35%")
    lines.append("  - 现实（REALITY）必须大于增强（WORLD）")
    lines.append("  - UI 结构不得少于 15%")
    lines.append("  - 禁止纯仙侠/幻想风格")
    lines.append("  - 禁止星空主视觉 / 法阵主结构")
    lines.append("")
    lines.append("=== 约束结束 ===")
    lines.append("")

    return "\n".join(lines)


# ── 测试 ──
if __name__ == "__main__":
    import os, sys

    print("=" * 60)
    print("AR VISUAL RATIO ENGINE V2.1 测试")
    print("=" * 60)

    test_cases = [
        # (name, state_id, structure, visual, reality, ui, world, human)
        ("完美合规",        "S00", 85, 80, 65, 20, 10, 5),
        ("WORLD 略高 16%",  "S00", 85, 80, 60, 20, 16, 4),
        ("WORLD 18% FAIL",  "S00", 80, 75, 55, 18, 18, 9),
        ("现实 < 增强 FAIL", "S00", 75, 70, 30, 15, 35, 20),
        ("无现实基底 FAIL",  "S00", 80, 75, 25, 25, 20, 30),
        ("UI 不足 FAIL",    "S00", 50, 70, 65, 10, 15, 10),
        ("HOME 完美",       "S02", 80, 75, 45, 35, 10, 10),
        ("AR SCAN",         "S07", 30, 85, 30, 5, 45, 20),
    ]

    for name, sid, s_score, v_score, r, u, w, h in test_cases:
        print(f"\n--- {name} ({sid}) ---")
        result = judge_engine_v21(sid, s_score, v_score, r, u, w, h)
        print(f"  Status: {result['status']}")
        print(f"  Scores: STRUCTURE={result['scores']['STRUCTURE']}, "
              f"VISUAL={result['scores']['VISUAL']}, RATIO={result['scores']['RATIO']}")
        if result["anchor_triggered"]:
            print(f"  [VETO] 现实优先锁定器触发!")
        elif result["has_veto"]:
            print(f"  [VETO] 硬性否决触发!")
        for v in result["violations"]:
            print(f"  [{v['severity']}] {v['message']}")

    print("\n\n--- V2.1 Prompt 约束 (S00) ---")
    print(get_prompt_constraint_v21("S00"))
