# LOVEQIGU / AR游伴
# AR PAGE STATE MACHINE V1 — FROZEN

> **版本**: V1
> **冻结日期**: 2026-07-01
> **状态**: FROZEN
> **优先级**: 本文件定义"规范选择器"，决定在某个页面状态下哪些规范生效、哪些规范静默

---

# 🧭 0. 为什么需要状态机

## 问题

现有规范体系存在**结构冲突**：

| 规范 | 对 Landing Page 的要求 |
|------|----------------------|
| UI_CONTRACT_SYSTEM_V1 | L2 状态层 + L3 行为层 + 底部导航 |
| AR_VISUAL_LAYER_SYSTEM_V4 | L0 入口层 = 轻量转化页 |
| BOTTOM_NAV_SYSTEM_V6 | 底部导航必须存在 |

冲突结果：Landing Page 被要求"全都要"，产生过度审查。

## 解决方案

引入**页面状态机**概念：

> 不是"规范驱动 UI"，而是 **"页面状态决定哪些规范生效"**

---

# ════════════════════════════════════════════
# 1. 页面状态定义
# ════════════════════════════════════════════

## 1.1 状态总览

| 状态 ID | 名称 | 用户场景 | 所属视觉层 |
|---------|------|----------|-----------|
| S00 | LANDING_GUEST | 未登录访客到达 | L0（入口层） |
| S01 | LANDING_LOGGED_IN | 已登录用户回到入口 | L0→L2（过渡态） |
| S02 | HOME | 登录后主系统 | L2（系统交互层） |
| S03 | EXPLORE | 探索地图页 | L2（系统交互层） |
| S04 | COLLECTION | 藏品/信物页 | L2+L3（混合） |
| S05 | RIGHTS | 权益中心页 | L2（系统交互层） |
| S06 | PROFILE | 个人中心页 | L2（系统交互层） |
| S07 | AR_SCAN | AR 扫描体验 | L3（世界沉浸层） |
| S08 | RELIC_DETAIL | 信物详情页 | L3（世界沉浸层） |
| S09 | MERCHANT | 商户/优惠券页 | L2（系统交互层） |

---

## 1.2 状态转换图

```
                    ┌─────────────────────────────────┐
                    │          S00 LANDING_GUEST        │
                    │  (portal + 微信登录 + stats)     │
                    └──────────────┬──────────────────┘
                                   │ 微信登录
                                   ▼
                    ┌─────────────────────────────────┐
                    │       S01 LANDING_LOGGED_IN      │
                    │  (portal + stats + 进入探索)    │
                    └──────────────┬──────────────────┘
                                   │ 进入探索 / 自动跳转
                                   ▼
                    ┌─────────────────────────────────┐
                    │          S02 HOME               │
                    │   (TabBar: 探索/信物/AR/权益/我的) │
                    └──┬────┬────┬────┬──────────────┘
                       │    │    │    │
                ┌──────┘    │    │    └──────┐
                ▼           ▼    ▼            ▼
          S03 EXPLORE  S04 COLLECTION  S05 RIGHTS  S06 PROFILE
                │           │
                ▼           ▼
          S07 AR_SCAN   S08 RELIC_DETAIL
                │
                ▼
          S09 MERCHANT
```

### 核心原则

- **S00 → S01 → S02** 是单向转换（登录后不可回退到 guest）
- **S02 → S03/S04/S05/S06** 可自由切换（TabBar 导航）
- **S07 AR_SCAN** 是模态层，可从任何 L2 页面进入
- **Landing Page (S00/S01)** 不承载 TabBar

---

# ════════════════════════════════════════════
# 2. 状态 → 规范映射表
# ════════════════════════════════════════════

## 2.1 映射原则

- 每个页面状态有一个**"生效规范清单"**
- 不在清单内的规范，对该状态**静默不执行**
- 审计时先判断页面状态，再按映射表检查

## 2.2 映射表

### S00 LANDING_GUEST（未登录 Landing）

| 维度 | 取值 | 规范来源 |
|------|------|----------|
| **视觉层归属** | L0 入口层 | AR_VISUAL_LAYER_SYSTEM_V4 §1 |
| **TabBar** | **禁止** | 本文件 §3 |
| **底部导航** | **禁止** | 本文件 §3 |
| **核心行为** | 微信登录（主 CTA） | UI_CONTRACT_SYSTEM_V1 §3 L3 |
| **UI 密度** | **5-12%**（轻量登录页） | 本文件 §3 |
| **视觉风格** | 文旅现实风（主）+ 轻微金色光效 | AR_VISUAL_LAYER_SYSTEM_V4 §1.1 |
| **门/光/路径** | 必须存在 | UI_CONTRACT_SYSTEM_V1 §3 L1 |
| **L2 状态层** | 可选展示（非强制） | 本文件 §3 |
| **L3 行为层** | 仅登录，不要求进地图/查看信物 | 本文件 §3 |
| **背景色** | 不要求虚空渐变 | AR_VISUAL_LAYER_SYSTEM_V4 §7 |
| **金色色值** | 不要求精确 #C8A24A，温润金色即可 | 本文件 §3 |
| **粒子效果** | 允许全域温和粒子 | 本文件 §3 |
| **禁止项** | 完整 App 壳层、TabBar、游戏化界面 | AR_VISUAL_LAYER_SYSTEM_V4 §1.1 |

### S01 LANDING_LOGGED_IN（已登录 Landing）

| 维度 | 取值 | 规范来源 |
|------|------|----------|
| **视觉层归属** | L0→L2 过渡态 | 本文件 §3 |
| **TabBar** | **禁止** | 本文件 §3 |
| **底部导航** | **禁止** | 本文件 §3 |
| **核心行为** | 进入探索（主 CTA） | UI_CONTRACT_SYSTEM_V1 §3 L3 |
| **UI 密度** | **8-16%**（较 guest 增加 stats） | 本文件 §3 |
| **L2 状态层** | **必须**展示四项统计数据 | UI_CONTRACT_SYSTEM_V1 §3 L2 |
| **L3 行为层** | 仅"进入探索"，不要求进地图/查看信物 | 本文件 §3 |

### S02 HOME（登录后首页）

| 维度 | 取值 | 规范来源 |
|------|------|----------|
| **视觉层归属** | L2 系统交互层 | AR_VISUAL_LAYER_SYSTEM_V4 §3 |
| **TabBar** | **必须** | BOTTOM_NAV_SYSTEM_V6 |
| **底部导航项** | 探索 / 信物 / AR(中心) / 权益 / 我的 | user-bottom-nav/index.js |
| **UI 密度** | production_balanced (18-22%) | STRUCTURE_SPEC_LANDING_V3 |
| **视觉风格** | 70% 现实文旅 + 30% 世界观增强 | AR_VISUAL_LAYER_SYSTEM_V4 §2.3 |

### S03–S06（子页面）

| 维度 | S03 EXPLORE | S04 COLLECTION | S05 RIGHTS | S06 PROFILE |
|------|------------|----------------|------------|-------------|
| **视觉层** | L2 | L2+L3 | L2 | L2 |
| **TabBar** | 必须 | 必须 | 必须 | 必须 |
| **UI 密度** | 18-22% | 18-22% | 18-22% | 18-22% |

### S07 AR_SCAN（AR 扫描）

| 维度 | 取值 |
|------|------|
| **视觉层归属** | L3 世界沉浸层 |
| **TabBar** | **禁止**（全屏沉浸） |
| **UI** | 最小化，扫描界面为主 |
| **退出** | 返回上一页 |

---

## 2.3 生效规范速查

| 规范文件 | 适用状态 | 不适用状态 |
|----------|---------|-----------|
| AR_VISUAL_LAYER_SYSTEM_V4 | 全部（决定视觉风格基调） | — |
| UI_CONTRACT_SYSTEM_V1 | S02–S06（完整三层结构） | S00（仅 L1 视觉 + L3 登录） |
| STRUCTURE_SPEC_LANDING_V3 | S02 HOME | S00/S01 Landing（被 V4 覆盖） |
| BOTTOM_NAV_SYSTEM_V6 | S02–S06 | S00/S01 Landing、S07 AR |
| VISUAL_ASSET_CONTRACT_V1 | S02–S08 | S00/S01（不要求写实景区） |

---

# ════════════════════════════════════════════
# 3. Landing Page 专用规范（S00 / S01）
# ════════════════════════════════════════════

## 3.1 定义

Landing Page（S00 / S01）是**独立转化页**，不是小程序完整壳层页面。

## 3.2 必须包含

### 视觉（必须）
- 主世界视觉 / 门 / 光 / 路径隐喻（L1 视觉层）

### 行为（必须）
- **S00**：微信一键登录（主 CTA）
- **S01**：进入探索（主 CTA）

### 数据（可选 / S01 建议）
- exploration_count
- relic_count
- collectible_count / coupon_count
- progress / 探索进度

## 3.3 禁止

| 禁止项 | 原因 |
|--------|------|
| TabBar / 底部导航 | Landing 是转化页，不是系统壳层 |
| 四业务入口（探索/地图/权益/我的） | 登录后才能访问，Landing 不展示 |
| 完整 App 壳层 | 不符合转化页定位 |
| 游戏化界面 | AR_VISUAL_LAYER_SYSTEM V4 §1.1 |
| 强幻想 / 完全星空化 | AR_VISUAL_LAYER_SYSTEM V4 §1.1 |

## 3.4 允许的灵活空间

| 维度 | 允许范围 | 说明 |
|------|---------|------|
| 背景色 | 不限制虚空渐变，允许 portal 暖色调 | V4 §7 已覆盖 STRUCTURE_SPEC_LANDING_V3 |
| 金色色值 | 温润金色即可，不强制 #C8A24A | 该设计通过暖金色光效已满足 L0 要求 |
| 粒子效果 | 允许全域温和粒子分布 | 氛围光效属于 L0 "温润光效"范围 |
| portal 视觉权重 | 40-60% 灵活，不强制 55-60% | Landing 转化页需要留空间给 CTA |
| UI 密度 | **S00: 5-12% / S01: 8-16%** | 转化页密度应显著低于系统页 |
| 幻想元素容忍度 | portal + 光效 + 金色符文 = L0 可接受 | 不引入完整幻想场景/古风人物/楼阁即可 |

## 3.5 Landing Page 的信仰释放比例

| 层级 | 释放比例 | Landing 上的表现形式 |
|------|---------|---------------------|
| L0 | 5% | 品牌标识（"爱企谷"）、门/光隐喻 |
| L1 | 10% | portal 光效、温和粒子 |
| L2 | 20% | stats 数据（S01 可选） |
| L3 | 100% | 不展示（登录后进入） |

参照 `AR_VISUAL_LAYER_SYSTEM_V4 §6.2` 世界观释放节奏。

---

# ════════════════════════════════════════════
# 4. 审计规则
# ════════════════════════════════════════════

## 4.1 审计流程

```
输入：设计图
  │
  ├── 1. 判断页面状态（S00–S09）
  │     依据：图中有无微信登录按钮 → S00/S01
  │           图中有无 TabBar → S02–S06
  │           图中全屏沉浸 → S07–S08
  │
  ├── 2. 加载该状态对应的"生效规范清单"
  │
  ├── 3. 仅对生效规范逐条检查
  │     主动跳过不适用规范（不报告"缺失"）
  │
  └── 4. 输出审计结果（含状态标识）
```

## 4.2 状态判定逻辑（审计脚本用）

```python
def determine_page_state(image_data):
    """根据图像内容推断页面状态"""
    has_login_button = detect_login_button(image_data)
    has_tabbar = detect_tabbar(image_data)
    is_fullscreen = detect_fullscreen(image_data)

    if has_login_button and not has_tabbar:
        return "S00"  # LANDING_GUEST（或 S01，取决于登录状态不可见）
    if not has_login_button and not has_tabbar and has_portal:
        return "S01"  # LANDING_LOGGED_IN
    if has_tabbar and not is_fullscreen:
        return "S02"  # HOME（或子页面，取决于具体内容）
    if is_fullscreen:
        return "S07"  # AR_SCAN
    return "S02"  # 默认 HOME
```

## 4.3 审计报告格式

审计报告必须包含状态标识：

```json
{
  "page_state": "S00",
  "state_name": "LANDING_GUEST",
  "visual_layer": "L0",
  "compliance_score": 0-100,
  "effective_specs": ["AR_VISUAL_LAYER_SYSTEM_V4 §1", "UI_CONTRACT_SYSTEM_V1 §3 L1+L3"],
  "inactive_specs": ["BOTTOM_NAV_SYSTEM_V6", "STRUCTURE_SPEC_LANDING_V3"],
  "violations": [...]
}
```

---

# ════════════════════════════════════════════
# 5. 与其他规范的关系
# ════════════════════════════════════════════

## 5.1 优先级

```
本文件（状态机） > AR_VISUAL_LAYER_SYSTEM_V4 > UI_CONTRACT_SYSTEM_V1 > BOTTOM_NAV_SYSTEM_V6 > STRUCTURE_SPEC_LANDING_V3
```

本文件不修改各规范的内部定义，只定义"在哪个状态下执行哪个规范"。

## 5.2 覆盖声明

本文件冻结后：

- `STRUCTURE_SPEC_LANDING_V3` 中对 UI 密度、背景色、portal 权重的具体要求，**仅在 S02 HOME 状态下生效**
- `BOTTOM_NAV_SYSTEM_V6` 的导航要求，**不适用于 S00/S01/S07**
- `UI_CONTRACT_SYSTEM_V1` 的 L2 状态层要求，**S00 下为可选、S01 下为必须**
- `UI_CONTRACT_SYSTEM_V1` 的 L3 行为层要求（进入地图/查看信物/查看回响），**S00/S01 下不要求**

---

# ════════════════════════════════════════════
# 6. 冻结声明
# ════════════════════════════════════════════

## 6.1 冻结条款

- 禁止修改九种页面状态（S00–S09）的定义
- 禁止修改 S00/S01 的 TabBar 禁止规则
- 禁止修改 Landing Page 的 UI 密度范围（5-12% / 8-16%）
- 禁止修改状态机优先级规则（§5）

## 6.2 允许修改

- 新增页面状态（需注明所属视觉层）
- 调整特定状态下各规范的执行强度
- 细化状态判定逻辑（审计脚本实现）

## 6.3 生效范围

- 本文件生效后，所有视觉审计必须基于状态机判断
- 所有审计报告必须标明页面状态
- 禁止在不标识页面状态的情况下抛出违规项

---

## 冻结元信息

```
STATUS:     FROZEN
VERSION:    V1
DATE:       2026-07-01
OWNER:      LOVEQIGU
OVERRIDES:  UI_CONTRACT_SYSTEM_V1 (partial),
            STRUCTURE_SPEC_LANDING_V3 (partial),
            BOTTOM_NAV_SYSTEM_V6 (partial)
```
