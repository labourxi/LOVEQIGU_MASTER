# LOVEQIGU / AR游伴
# AR VISUAL RATIO ENGINE V1 — FROZEN

> **版本**: V1
> **冻结日期**: 2026-07-01
> **状态**: FROZEN
> **优先级**: 本文件定义所有 L0–L3 页面的**视觉成分比例约束**，所有审查/生成任务必须经过本引擎检查后方可进入下一步

---

# 🧭 0. 为什么要比例引擎

## 问题

之前的系统有规范、有状态机、有审查模型，但缺少一个**风格漂移的物理上限**：

```
生成模型自动优化方向：
  视觉更好看 → 更多星空/法阵/幻想元素 → 偏仙侠
审查模型自动优化方向：
  规则更严格 → 更多限制/否决 → 过度审查
```

两者来回摇摆，因为**没有"比例边界"作为锚点**。

## 解决方案

引入 **视觉比例约束** 作为系统的"物理定律"——

> 生成前就被约束住比例，而不是生成后再审查打回

---

# ════════════════════════════════════════════
# 1. 核心定义
# ════════════════════════════════════════════

## 1.1 四大视觉成分

每个页面/图像的视觉空间由四种成分组成：

| 成分 | 代码 | 说明 | 示例 |
|------|------|------|------|
| 🏙 文旅现实场景 | `REALITY` | 真实景区、建筑、自然景观 | 爱企谷实景、云间坊、园区入口 |
| 🧭 UI/产品结构 | `UI` | 界面元素、按钮、导航、文字 | 微信登录、TabBar、统计卡片 |
| ✨ 世界增强 | `WORLD` | 超现实/世界观视觉元素 | portal光环、金色粒子、光效、符文 |
| 👤 人物/行为叙事 | `HUMAN` | 人物、用户尺度参照、行为暗示 | 游客剪影、行走路径、互动暗示 |

---

## 1.2 核心公式

```
REALITY + UI + WORLD + HUMAN = 100%
```

任何页面的视觉成分之和必须为 100%。

**违规判定**：任一成分超出该状态的允许范围 → 警告/否决。

---

# ════════════════════════════════════════════
# 2. 各页面状态的视觉比例标准
# ════════════════════════════════════════════

## 2.1 S00 LANDING_GUEST（未登录 Landing）

| 成分 | 标准比例 | 允许波动 | 说明 |
|------|---------|---------|------|
| 🏙 文旅现实场景 | **55%** | ±10%（45-65%） | 必须有可识别的现实场景基底 |
| 🧭 UI/产品结构 | **20%** | ±5%（15-25%） | 登录CTA + 标题 + 数据（可选） |
| ✨ 世界增强 | **15%** | ±5%（10-20%） | 门/光/金色粒子/温和光环 |
| 👤 人物/行为叙事 | **10%** | ±5%（5-15%） | 路径暗示/行为引导/人物尺度参考 |
| **合计** | **100%** | — | — |

### 关键判定规则

| 条件 | 判定 | 严重度 |
|------|------|--------|
| WORLD > 30% | 直接否决 | CRITICAL |
| REALITY < 30% | 直接否决 | CRITICAL |
| UI > 35% | 视觉被UI淹没 | MAJOR |
| WORLD > UI | 幻想压过产品 | MAJOR |
| HUMAN = 0% | 缺少用户尺度参照 | MAJOR |
| REALITY 在 30-45% | 现实感弱 | MAJOR |
| WORLD 在 20-30% | 增强过强 | MAJOR |
| 色彩偏离轻微 | 可接受 | MINOR |
| HUMAN 在 0-5% | 建议增加 | MINOR |

---

## 2.2 S01 LANDING_LOGGED_IN（已登录 Landing）

| 成分 | 标准比例 | 允许波动 |
|------|---------|---------|
| 🏙 文旅现实场景 | **50%** | ±10%（40-60%） |
| 🧭 UI/产品结构 | **25%** | ±5%（20-30%） | 相比 S00 增加 stats |
| ✨ 世界增强 | **15%** | ±5%（10-20%） |
| 👤 人物/行为叙事 | **10%** | ±5%（5-15%） |
| **合计** | **100%** | — |

---

## 2.3 S02 HOME（登录后首页）

| 成分 | 标准比例 | 允许波动 |
|------|---------|---------|
| 🏙 文旅现实场景 | **40%** | ±10%（30-50%） | 系统页现实背景降为背景层 |
| 🧭 UI/产品结构 | **35%** | ±5%（30-40%） | TabBar + 业务入口 + 内容卡 |
| ✨ 世界增强 | **15%** | ±5%（10-20%） |
| 👤 人物/行为叙事 | **10%** | ±5%（5-15%） |
| **合计** | **100%** | — |

---

## 2.4 S03–S06（子页面）

| 成分 | 标准比例 | 允许波动 |
|------|---------|---------|
| 🏙 文旅现实场景 | **30%** | ±10%（20-40%） |
| 🧭 UI/产品结构 | **45%** | ±5%（40-50%） | 内容密集 |
| ✨ 世界增强 | **15%** | ±5%（10-20%） |
| 👤 人物/行为叙事 | **10%** | ±5%（5-15%） |
| **合计** | **100%** | — |

---

## 2.5 S07 AR_SCAN（AR 沉浸）

| 成分 | 标准比例 | 允许波动 |
|------|---------|---------|
| 🏙 文旅现实场景 | **30%** | ±10%（20-40%） | 摄像头画面 |
| 🧭 UI/产品结构 | **5%** | ±5%（0-10%） | UI 最小化 |
| ✨ 世界增强 | **45%** | ±10%（35-55%） | AR 叠加 |
| 👤 人物/行为叙事 | **20%** | ±10%（10-30%） | 交互提示 |
| **合计** | **100%** | — |

---

## 2.6 S08 RELIC_DETAIL / S09 MERCHANT

| 成分 | 标准比例 | 允许波动 |
|------|---------|---------|
| 🏙 文旅现实场景 | **25%** | ±10%（15-35%） |
| 🧭 UI/产品结构 | **50%** | ±5%（45-55%） |
| ✨ 世界增强 | **15%** | ±5%（10-20%） |
| 👤 人物/行为叙事 | **10%** | ±5%（5-15%） |
| **合计** | **100%** | — |

---

# ════════════════════════════════════════════
# 3. 违规判定总表
# ════════════════════════════════════════════

## 3.1 CRITICAL（生成阶段直接否决 / 审查阶段直接否决）

| 规则 | 条件 | 理由 |
|------|------|------|
| R01 | WORLD > 30%（S00–S06） | 世界增强喧宾夺主 |
| R02 | REALITY < 30%（S00–S02） | 无现实场景基底的纯幻想 |
| R03 | UI = 0%（S00–S06） | 无 UI 的产品不可用 |
| R04 | 完全无现实场景元素 | 违反 L0–L2 统一原则 |

## 3.2 MAJOR（需要调整）

| 规则 | 条件 | 理由 |
|------|------|------|
| R05 | WORLD > UI | 幻想压过产品结构 |
| R06 | HUMAN ≈ 0% | 无用户尺度参照 |
| R07 | 场景纯幻想化（仙侠化） | 违反文旅现实风 |
| R08 | UI > 35%（S00/S01） | Landing 页 UI 过重 |
| R09 | REALITY 在 30-45%（S00） | 现实感偏弱 |

## 3.3 MINOR（建议优化）

| 规则 | 条件 | 理由 |
|------|------|------|
| R10 | 色彩偏离轻微 | 可保留但建议统一 |
| R11 | WORLD 在 20-30% | 略超推荐上限 |
| R12 | HUMAN < 5% | 建议增加人物参照 |

---

# ════════════════════════════════════════════
# 4. 与现有规范的关系
# ════════════════════════════════════════════

## 4.1 本引擎在体系中的位置

```
AR_VISUAL_LAYER_SYSTEM_V4（四层定义）
    ↓
AR_PAGE_STATE_MACHINE_V1（页面状态 → 规范映射）
    ↓
AR_VISUAL_RATIO_ENGINE_V1（比例约束） ← 本文件
    ↓
审查 / 生成 执行层
```

## 4.2 与 V4 世界观释放节奏的对齐

| V4 层级 | 世界观释放比例 | 比例引擎中 WORLD 成分标准 |
|---------|-------------|------------------------|
| L0 | 5% | 15% (±5%) — 注意：V4 世界观释放 5% 指的是"叙事深度"，比例引擎 15% 指的是"视觉面积"。视觉需要更多面积来表现 5% 的世界观 |
| L1 | 10% | 15% (±5%) |
| L2 | 20% | 15% (±5%) |
| L3 | 100% | 45% (±10%) — AR 层 |

## 4.3 与状态机的关系

状态机决定"哪个比例标准生效"，比例引擎决定"画面是否在比例范围内"。
两者串联使用：**先判定状态 → 再加载比例标准 → 再审查**

---

# ════════════════════════════════════════════
# 5. 执行接口
# ════════════════════════════════════════════

## 5.1 Python 接口

```python
# ar_visual_ratio_engine.py

RATIO_SPEC = {
    "S00": {  # LANDING_GUEST
        "REALITY": {"target": 55, "range": (45, 65)},
        "UI":      {"target": 20, "range": (15, 25)},
        "WORLD":   {"target": 15, "range": (10, 20)},
        "HUMAN":   {"target": 10, "range": (5, 15)},
        "rules": {
            "WORLD_max_30":         {"condition": "WORLD > 30", "severity": "CRITICAL"},
            "REALITY_min_30":       {"condition": "REALITY < 30", "severity": "CRITICAL"},
            "WORLD_over_UI":        {"condition": "WORLD > UI", "severity": "MAJOR"},
            "HUMAN_zero":           {"condition": "HUMAN == 0", "severity": "MAJOR"},
            "REALITY_below_45":     {"condition": "REALITY < 45", "severity": "MAJOR"},
        }
    },
    "S01": {  # LANDING_LOGGED_IN
        "REALITY": {"target": 50, "range": (40, 60)},
        "UI":      {"target": 25, "range": (20, 30)},
        "WORLD":   {"target": 15, "range": (10, 20)},
        "HUMAN":   {"target": 10, "range": (5, 15)},
        "rules": {
            "WORLD_max_30":   {"condition": "WORLD > 30", "severity": "CRITICAL"},
            "REALITY_min_30": {"condition": "REALITY < 30", "severity": "CRITICAL"},
            "UI_min_20":      {"condition": "UI < 20", "severity": "MAJOR"},
        }
    },
    "S02": {  # HOME
        "REALITY": {"target": 40, "range": (30, 50)},
        "UI":      {"target": 35, "range": (30, 40)},
        "WORLD":   {"target": 15, "range": (10, 20)},
        "HUMAN":   {"target": 10, "range": (5, 15)},
        "rules": {
            "WORLD_max_30": {"condition": "WORLD > 30", "severity": "CRITICAL"},
            "UI_min_25":    {"condition": "UI < 25", "severity": "MAJOR"},
        }
    },
    "S07": {  # AR_SCAN
        "REALITY": {"target": 30, "range": (20, 40)},
        "UI":      {"target": 5,  "range": (0, 10)},
        "WORLD":   {"target": 45, "range": (35, 55)},
        "HUMAN":   {"target": 20, "range": (10, 30)},
        "rules": {
            "WORLD_min_30": {"condition": "WORLD < 30", "severity": "MAJOR"},
        }
    }
}

def check_ratio(state_id: str, reality: float, ui: float, world: float, human: float) -> dict:
    """检查比例合规性。返回 violations 列表和 score。"""
    spec = RATIO_SPEC.get(state_id)
    if not spec:
        return {"pass": True, "violations": [], "score": 100}
    
    total = reality + ui + world + human
    violations = []
    score = 100
    deductions = {"CRITICAL": 25, "MAJOR": 10, "MINOR": 3}
    
    # Check each component range
    components = {"REALITY": reality, "UI": ui, "WORLD": world, "HUMAN": human}
    for name, value in components.items():
        target = spec[name]["target"]
        min_v, max_v = spec[name]["range"]
        if value < min_v or value > max_v:
            deviation = abs(value - target) / target * 100
            sev = "MAJOR" if deviation > 20 else "MINOR"
            violations.append({
                "severity": sev,
                "component": name,
                "actual": value,
                "expected_range": f"{min_v}-{max_v}%",
                "message": f"{name} = {value}%, 超出范围 [{min_v}-{max_v}%]"
            })
            score -= deductions.get(sev, 3)
    
    # Check specific rules
    for rule_id, rule in spec.get("rules", {}).items():
        condition = rule["condition"]
        sev = rule["severity"]
        if eval(condition, {}, components):
            violations.append({
                "severity": sev,
                "rule": rule_id,
                "condition": condition,
                "message": f"违反规则: {condition}"
            })
            score -= deductions.get(sev, 3)
    
    score = max(0, score)
    return {
        "pass": score >= 70,
        "score": score,
        "violations": violations,
        "components": components
    }
```

## 5.2 审计 prompt 注入

审计脚本的 `SPEC_SYSTEM_PROMPT` 中需要加入比例引擎要求，要求 AI 模型在分析时**估算四种成分的比例**并据此判定违规。

---

# ════════════════════════════════════════════
# 6. 生成阶段的比例约束
# ════════════════════════════════════════════

## 6.1 原则

- 比例引擎不是"生成后审查"，而是**生成前约束**
- 生成 prompt 中必须包含比例指引
- 对于 AI 生图，prompt 中应明确指引四种成分的大致比例

## 6.2 Prompt 注入模板

```text
开始生成前，请遵循以下视觉比例约束：

[S00 LANDING_GUEST]
- 🏙 文旅现实场景 ~55%（实景基底，如爱企谷写实景区）
- 🧭 UI/产品结构 ~20%（登录按钮 + 标题 + 少量文字）
- ✨ 世界增强 ~15%（温和光环 + 金色粒子 + 门/光效果，**禁止**星象/法阵/符文）
- 👤 人物/行为叙事 ~10%（路径引导 + 人物尺度暗示）

⚠️ 关键限制：
- 世界增强不得超过 30%
- 文旅现实场景不得少于 30%
- 禁止纯仙侠/幻想风格
```

---

# ════════════════════════════════════════════
# 7. 冻结声明
# ════════════════════════════════════════════

## 7.1 冻结条款

- 禁止修改四大成分定义（REALITY / UI / WORLD / HUMAN）
- 禁止修改 S00 标准比例（55/20/15/10）
- 禁止修改 CRITICAL 否决条件（WORLD > 30% / REALITY < 30%）
- 禁止移除"生成前约束"原则

## 7.2 允许修改

- 其他页面状态的比例值（S01–S09）
- 允许波动范围
- MAJOR/MINOR 判定条件
- 具体执行层的实现细节

## 7.3 生效范围

- 所有视觉审查必须经过比例引擎
- 所有图像生成 prompt 必须包含比例约束
- 审计报告必须包含比例分析章节

---

## 冻结元信息

```
STATUS:     FROZEN
VERSION:    V1
DATE:       2026-07-01
OWNER:      LOVEQIGU
ALIGNS_WITH: AR_VISUAL_LAYER_SYSTEM_V4 §6.2,
             AR_PAGE_STATE_MACHINE_V1 §2.2
```
