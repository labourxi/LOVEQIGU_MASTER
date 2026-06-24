# AR游伴 · 空间视觉语言

**文档 ID：** `03_visual/spatial_visual_language.md`  
**版本：** V1.2-STABLE  
**状态：** ENGINEERING_STANDARD  
**输入：** `point_id` 状态、`explore-map` 数据、adapter `userPointStates`  
**输出：** 探索地图节点三态、空间叙事节奏、与 SPACE/CRM 对齐的图形规则  

**闭环：** `USER → XR → VISUAL → SPACE → RELIC → CRM → REVENUE`  
**关联：** `visual_system_v1.md` · `05_crm/user_behavior_model.md`

---

## 1. Definition（定义）

### 1.1 空间视觉语言

空间视觉语言 = **场所感图形系统**：用户感知「在真实场域中移动」，而非手游地图。

关键词：星点 · 经纬线 · 墨色 · 宣纸 · 留白 · 仪式克制

### 1.2 SPACE 层定位

| 概念 | 视觉表现 | 数据锚点 |
|------|----------|----------|
| 空间 | 探索地图场域 | `park_id` |
| 探索点 | 星点节点 | `point_id` |
| 路径 | 细线连接 | `visitedPointIds` |
| 激活 | 暖金 | 当前 `nextPointId` |

### 1.3 输入 / 输出

| 方向 | 内容 |
|------|------|
| **输入** | `getExploreMapData`, `userPointStates[].status` |
| **输出** | 节点 class（dim/next/lit）、横幅样式、动效触发 `space_trail_v1` |

---

## 2. System Design（结构设计）

### 2.1 图形语汇

| 元素 | 含义 | CRM 状态对应 |
|------|------|--------------|
| 星点 `dim` | 待探索 | `LOCKED` / `AVAILABLE` |
| 星点 `next` | 推荐前行 | `AVAILABLE` + 推荐 |
| 星点 `lit` | 已探索 | `CHECKED_IN` … `COMPLETED` |
| 细线 | 路径观测 | `visitedPointIds` 边 |
| 圆弧门 | 进入景区 | `enter_scenic` 事件 |
| 墨块卡片 | 探索点详情 | `getExplorationPointDetail` |
| 暖金 | 激活 CTA | 主行动唯一 |

### 2.2 留白与层级

- 页面留白 ≥ 40%  
- 一屏一个主行动（与 `xr_visual_spec` 一致）  
- 仪式屏（lottie）无 L1 商业文案  

### 2.3 语言分层（同屏禁混）

| 层 | 视觉示例 | 禁用 |
|----|----------|------|
| L1 商业 | 完成页礼遇提示 | 仪式弹窗内价格 |
| L2 产品 | 探索地图、权益中心 | 心愿值 +N |
| L3 仪式 | 回响、信物名 | 积分、成就徽章 |

### 2.4 事件 → 空间视觉

| 行为事件 | 空间视觉变化 |
|----------|--------------|
| `enter_scenic` | 圆弧门横幅 `pilot-scene-banner` |
| `open_explore_map` | 地图展开 + `space_trail_v1` |
| `mock_check_in` | 目标星点 → `lit` 过渡 |
| `reveal_relic` | 节点永久 `lit` + 信物册入口亮 |
| `unlock_coupon` | 权益中心 Tab 提示点（可选） |

---

## 3. Flow（流程）

### 3.1 空间叙事节奏

```text
门（进入景区）→ 径（探索地图）→ 印（打卡）→ 物（信物）→ 礼（权益）→ 响（回响）
     │              │              │           │          │
  xr_start_v1   space_trail_v1   节点 lit   relic_emerge  权益中心
```

### 3.2 节点三态迁移

```text
dim ──(AVAILABLE + 推荐)──► next
dim/next ──(CHECKED_IN+)──► lit
lit ──(COMPLETED)──► lit（不可逆）
```

### 3.3 与收入路径（景区视角）

```text
空间视觉「门+径」降低进入摩擦 → enter_scenic ↑
节点 lit 密度 ↑ → relic 完成 ↑ → 商家核销 ↑ → M2/M3 续费论据
```

见 `business_model.md` §3.2

---

## 4. Data Model（数据模型）

### 4.1 地图节点 schema

```json
{
  "pointId": "ep_001",
  "visualState": "next",
  "status": "AVAILABLE",
  "statusLabel": "可探索",
  "coordinates": { "lat": 31.23, "lng": 121.47 },
  "relicName": "初见印记"
}
```

### 4.2 visualState 推导规则

```javascript
function mapVisualState(pointState, isRecommended) {
  if (['CHECKED_IN','AR_SCANNED','AR_SCANNED_WITH_FALLBACK','RELIC_REVEALED','COUPON_UNLOCKED','COMPLETED'].includes(pointState.status)) {
    return 'lit';
  }
  if (isRecommended && pointState.status === 'AVAILABLE') return 'next';
  return 'dim';
}
```

### 4.3 CSS class 约定

```text
.explore-node--dim
.explore-node--next    /* border-color: var(--gold) */
.explore-node--lit     /* background: rgba(182,138,61,.15) */
```

---

## 5. Example（示例）

### 5.1 爱企谷 ep_001 初始

```json
{ "pointId": "ep_001", "visualState": "next", "status": "AVAILABLE" }
```

打卡后：

```json
{ "pointId": "ep_001", "visualState": "lit", "status": "CHECKED_IN" }
```

### 5.2 探索地图加载

```javascript
// explore-map onLoad with pilotScene=explore
// → runStageEffect(EXPLORE) → space_trail_v1
// → 节点按 mapVisualState 渲染
```

---

## 6. Execution Notes（执行说明）

- C 端统一 `user-phase1-page` 类名  
- 新图标走 `docs/art/IMAGE_PRODUCTION_AND_REVIEW_FACTORY_V1.md`  
- 节点三态变更须同步 `user_behavior_model` 事件表  
- 路演 PPT 色板：`PITCH_DECK_MASTER_GUIDE_V1.md`  

---

*空间视觉语言 V1.2-STABLE · Batch 2*
