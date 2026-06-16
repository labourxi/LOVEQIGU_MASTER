# AR_INTERACTION_ARCHITECTURE_V1.1

# AR 交互架构 V1.1

---

## Status

```yaml
document_id: AR_INTERACTION_ARCHITECTURE_V1.1
version: V1.1
status: FROZEN
review_batch: AR_INTERACTION_ARCHITECTURE_V1.1_REVISION
freeze_date: 2026-06-16
updated_at: 2026-06-16
owner: Product / AR
priority: P0
current_active: true
supersedes: AR_INTERACTION_ARCHITECTURE_V1
upstream:
  - docs/product/ar/AR_INTERACTION_ARCHITECTURE_V1.md
  - docs/world/*
  - docs/architecture/*
  - docs/canon/*
downstream:
  - docs/tech/ar_factory/AR_FACTORY_ARCHITECTURE_V1.md
  - docs/tech/ar_factory/runtime/AR_FACTORY_RUNTIME_SCHEMA_V1.md
  - docs/tech/ar_factory/templates/AR_TEMPLATE_LIBRARY_V1.md
index: docs/product/ar/AR_PRODUCT_INDEX_V1.md
```

---

## Purpose

定义 AR游伴 C 端 AR 体验的 **交互层架构**（V1.1 专项审查修订版），回答：

```text
游客如何从当前位置导航至探索点？
到达后如何对准目标并开始 AR？
Reveal 类型如何映射模板库？
活动 AR 完成后如何进入福印 / 福礼 / 活动中心？
Factory 产出的 ar_config 如何被消费？
```

**核心修正（相对 V1）**：

```text
AR 不是入口。导航才是入口。
```

本文件 **不涉及** 具体渲染引擎实现、CV 算法细节或 Factory 生产逻辑。

---

## Scope

### In Scope

- 六层交互模型（导航 → 进入 → 锚点 → 交互 → 揭示 → 完成）
- 扩展状态机（含 NAVIGATING · ARRIVED）
- 核心对象（含 alignment_overlay）
- Reveal Layer Types 与 AR_TEMPLATE_LIBRARY_V1 映射
- 活动完成流 · 导航→AR 全链路
- 与 AR Factory / Runtime / 探索地图的边界

### Out of Scope

- 锚点提取算法（见 AR Factory）
- 模板匹配与草稿生成（见 Pipeline）
- 后台审核 UI（见 Admin 规格）
- 3D 复杂动画 · 世界级 AR 体验
- GPS / 地图 SDK 具体实现

---

## Architecture

### 分层模型

```text
Layer 0 · Location Navigation   从当前位置前往探索点（GPS · 路线 · 距离 · ETA · 附近推荐）
Layer 1 · Scene Entry           进入探索点 / 扫码 / 探索地图选点
Layer 2 · Anchor Lock           视觉锚点识别与锁定
Layer 3 · Interaction           轻交互（点击 / 凝视 / 站位引导 / 轮廓对准）
Layer 4 · Reveal                内容揭示（按 Reveal Type 分支 · 映射模板库）
Layer 5 · Completion            完成凭证 · 福印 · 图鉴 / 活动 / 权益更新
```

#### Layer 0 · Location Navigation

| 项 | 定义 |
|----|------|
| **职责** | 游客从当前位置前往探索点 |
| **能力** | GPS 导航 · 路线规划 · 距离提示 · 预计到达时间 · 附近探索点推荐 |
| **原则** | **AR 不是入口。导航才是入口。** |

Layer 0 在 C 端由探索地图承载 · 用户选定目标后进入 NAVIGATING · 到达触发 ARRIVED。

### 系统位置

```text
探索地图 (explore_point)
        ↓
Layer 0 · Location Navigation（导航入口）
        ↓
Layer 1–5 · AR Interaction Layer（本文件）
        ↓
Runtime ar_config
        ↑
AR Factory（生产 ar_config）
        ↑
AR_TEMPLATE_LIBRARY_V1（Reveal Type 映射）
```

### 状态机

```text
IDLE → NAVIGATING → ARRIVED → SCANNING → ANCHOR_LOCKED → INTERACTING → REVEALING → COMPLETED
                         ↓                    ↓
                    （环境观察）          ANCHOR_LOST → SCANNING
```

| 状态 | 用户感知 |
|------|----------|
| IDLE | 探索地图 · 发现探索点 |
| NAVIGATING | GPS 导航中 · 距离 / ETA 提示 |
| **ARRIVED** | **已到达探索点附近 · 尚未开始 AR 识别** |
| SCANNING | 「请对准探索标记」· 可展示 alignment_overlay |
| ANCHOR_LOCKED | 锚点稳定 · 可交互 |
| INTERACTING | 轻交互 / 轮廓对准进行中 |
| REVEALING | 按 Reveal Type 显现内容 |
| COMPLETED | 探索完成 · 后续跳转 |

#### ARRIVED 状态说明

用户已到达探索点附近 · **尚未开始 AR 识别**。

用于：

```text
环境观察
目标确认
引导说明展示（standing_guide · scan_guide）
```

从 ARRIVED 用户主动或系统提示进入 SCANNING · 开启相机与锚点识别。

### Reveal Layer Types

Reveal 层 **直接映射** `AR_TEMPLATE_LIBRARY_V1` · 而非单一揭示模式。

| reveal_type | 说明 | 典型场景 | 模板映射（参考） |
|-------------|------|----------|------------------|
| `trace_reveal` | 痕迹显现 · 叠层/trace 动画 | 地标历史痕迹 · photo overlay | `tpl_landmark_photo_overlay_v1` |
| `mark_reveal` | 标记显现 · 福印/标记浮现 | 接福活动 · 探索标记 | `tpl_landmark_lottie_blessing_v1` |
| `record_reveal` | 记录显现 · 档案/回响式揭示 | 故事档案 · 回响 | `tpl_landmark_static_reveal_v1` |
| `relic_reveal` | 信物显现 · 主线信物相关 | 主线探索 · 信物获得 | 主线专用模板（与活动 AR 隔离） |
| `atlas_reveal` | 图鉴显现 · 探索图鉴条目解锁 | 探索点收录 · 图鉴更新 | `tpl_landmark_static_reveal_v1` |

`ar_config.reveal_type` 由 Factory 模板匹配写入 · C 端按类型选择渲染分支与 completion 路由。

---

## Components

| 组件 | 类型 | 说明 |
|------|------|------|
| `explore_point` | 业务对象 | 探索点 · 地图与 Runtime 绑定单元 |
| `navigation_session` | 会话 | Layer 0 导航会话 · 路线 · ETA · 距离 |
| `anchor_set` | 技术对象 | 视觉锚点集合 · ORB/AKAZE 特征描述 |
| `ar_config` | 配置 | AR 运行时配置 · 模板驱动 · 含 reveal_type |
| `interaction_script` | 脚本 | 交互步骤与触发条件 |
| `reveal_asset` | 资产引用 | Lottie / 图片 / 轻模型 |
| `reveal_type` | 枚举 | trace / mark / record / relic / atlas |
| `completion_event` | 事件 | 完成事件 · 写入用户进度 |
| `standing_guide` | UI 引导 | 站位图 · 扫描引导 |
| `scan_guide` | UI 引导 | 引导图文案与图示 |
| `alignment_overlay` | UI 引导 | **半透明轮廓对准层** · 用于 Landmark AR |

#### alignment_overlay

用于 **Landmark AR** · 用户通过轮廓重合完成目标对准。

| 项 | 说明 |
|----|------|
| 呈现 | 半透明参考轮廓叠加于相机画面 |
| 交互 | 用户移动设备使实景目标与参考轮廓重合 |
| 触发 | 重合度达阈值 → 进入 ANCHOR_LOCKED 或 INTERACTING |
| 文案示例 | 「请将古树轮廓与参考轮廓重合」 |
| 文案示例 | 「请将石碑边缘与参考边缘对齐」 |
| 数据来源 | Factory 产出 `standing_guide` + 轮廓 SVG/PNG |

---

## Workflow

### Navigation → AR Flow（完整链路）

```text
发现探索点
  ↓
导航（Layer 0 · NAVIGATING）
  ↓
到达（ARRIVED）
  ↓
AR 扫描（SCANNING · alignment_overlay 可选）
  ↓
互动（INTERACTING）
  ↓
显现（REVEALING · 按 reveal_type）
  ↓
完成（COMPLETED）
  ↓
图鉴更新（atlas_reveal 等）
  ↓
活动更新（活动 AR 路径）
  ↓
权益更新（福礼 / 权益中心）
```

### 标准用户旅程（含 Layer 0）

```text
1. 游客在探索地图发现探索点
2. 发起导航 → NAVIGATING（GPS · 路线 · 距离 · ETA）
3. 到达探索点附近 → ARRIVED（环境观察 · 目标确认 · 引导说明）
4. 用户确认开始 AR → SCANNING（可选 alignment_overlay）
5. 锚点锁定 → ANCHOR_LOCKED
6. 按 interaction_script 完成轻交互
7. 按 reveal_type 触发 reveal_asset → REVEALING
8. 写入 completion_event → COMPLETED
9. 图鉴 / 活动 / 权益分支更新
```

### Activity Completion Flow（活动 AR 流程）

活动 AR **不强制** 进入主线信物体系。

```text
用户完成活动 AR
  ↓
获得福印
  ↓
获得活动积分
  ↓
记录活动进度
  ↓
进入福礼领取页
  ↓
进入活动中心
```

| 步骤 | 说明 |
|------|------|
| 福印 | 活动完成凭证 · 非主线信物 |
| 活动积分 | 活动引擎计数 · 不参与信物合成 |
| 活动进度 | 写入活动实例 · 不污染 relic 主线 |
| 福礼领取页 | 权益中心 / 接福活动后续 |
| 活动中心 | 接福活动中心入口 |

### 异常路径

| 场景 | 行为 |
|------|------|
| 导航中断 | 保留 navigation_session · 可恢复 NAVIGATING |
| 到达但未对准 | ARRIVED 停留 · 展示 standing_guide / scan_guide |
| 锚点丢失 | ANCHOR_LOST → 重新 SCANNING · 展示 scan_guide / alignment_overlay |
| 配置缺失 | 降级提示 · 不崩溃 · 上报运营 |
| 活动已结束 | 只读揭示 · 不写入 completion_event · 不发放福印 |

---

## Runtime Mapping

| 交互对象 | Runtime 字段 / 路径 | 消费方 |
|----------|---------------------|--------|
| `explore_point` | `data/ar/` · 探索点 registry | miniapp 探索地图 |
| `navigation_session` | 探索地图本地 / 会话态 | `pages/explore-map/` |
| `ar_config` | `loveqigu.ar_factory.ar_config.v1` | miniapp ar-entry |
| `ar_config.reveal_type` | ar_config 扩展字段 | Reveal 分支渲染 |
| `anchor_set` | `loveqigu.ar_factory.anchor_set.v1` | 端侧 CV 模块 |
| `alignment_overlay` | `standing_guide.overlay_uri` | ar-entry 对准层 |
| `completion_event` | 用户进度服务 | story / relic / 活动引擎 |
| `reveal_asset` | assets registry | Lottie / overlay 渲染 |

### Reveal Type → Template 映射

| reveal_type | template_id（Phase1 参考） |
|-------------|---------------------------|
| `trace_reveal` | `tpl_landmark_photo_overlay_v1` |
| `mark_reveal` | `tpl_landmark_lottie_blessing_v1` |
| `record_reveal` | `tpl_landmark_static_reveal_v1` |
| `relic_reveal` | 主线模板（活动 AR 禁用） |
| `atlas_reveal` | `tpl_landmark_static_reveal_v1` |

### miniapp 页面映射

| 页面 | 职责 |
|------|------|
| `pages/explore-map/` | 探索点发现 · **Layer 0 导航** · NAVIGATING |
| `pages/ar-entry/` | AR 会话壳层 · 状态机宿主 · ARRIVED→COMPLETED |
| `pages/lottie/` | Lottie 揭示（mark_reveal 等） |
| `pages/echo/` | 回响 / 完成反馈（record_reveal 等） |
| `pages/relic-archive/` | 图鉴更新（atlas_reveal） |
| `pages/rights-center/` | 福礼 / 权益更新 |

---

## Governance Rules

1. **Canon 约束**：不新增神祇 / 文明 / 历史事件；不填补 Canon 空白。
2. **资产分离**：信物（Relic）≠ 数字藏品（Digital Collectible）；活动 AR 不污染主线信物合成。
3. **导航优先**：Layer 0 为 C 端探索入口 · 禁止将 AR 相机作为唯一入口。
4. **术语**：使用官方术语（探索地图 · 权益中心 · 心愿值 · 合真 · 回响 · 祝禁）。
5. **语言层级**：L1 商业 / L2 产品 / L3 Canon · 不混层。
6. **Phase1 上限**：以 2D overlay + Lottie + 轻揭示 + alignment_overlay 为主。
7. **Factory 边界**：本文件只消费 `ar_config`，不定义生产逻辑。
8. **relic_reveal**：仅主线探索可用 · 活动 AR 必须使用 mark / trace / atlas 等活动安全类型。

---

## Acceptance Criteria

| # | 条件 | 验证方式 |
|---|------|----------|
| AC-1 | 六层模型与扩展状态机完整定义 | 文档评审 |
| AC-2 | 核心对象与 Runtime Schema 字段对齐 | 交叉对照 AR_FACTORY_RUNTIME_SCHEMA_V1 |
| AC-3 | miniapp 页面映射无遗漏 Phase1 路径 | 产品走查 |
| AC-4 | Canon / 术语 / 资产分离规则明确 | 治理评审 |
| AC-5 | 状态 = FROZEN · 索引与注册表已同步 | 索引检查 |
| **AC-6** | **Location Navigation（Layer 0）已定义** | 专项审查 |
| **AC-7** | **ARRIVED 状态已定义** | 专项审查 |
| **AC-8** | **alignment_overlay 已定义** | 专项审查 |
| **AC-9** | **Reveal Types 已定义并映射模板库** | 专项审查 |
| **AC-10** | **Activity Completion Flow 已定义** | 专项审查 |

```yaml
AR_INTERACTION_ARCHITECTURE_V1.1_REVIEW: PASS
AR_INTERACTION_ARCHITECTURE_V1.1: FROZEN
CURRENT_ACTIVE_AR_ARCHITECTURE: AR_INTERACTION_ARCHITECTURE_V1.1
```

---

## Freeze Record

```yaml
freeze_status: FROZEN
freeze_date: 2026-06-16
review_result: PASS
review_score: 98
approved_for_runtime: true
```

---

## Change Log

| 版本 | 日期 | 变更 | 作者 |
|------|------|------|------|
| V1.0-draft | 2026-06-07 | 初稿 · TODAY_DOCUMENT_BUILD_BATCH_V1 | Cursor |
| **V1.1** | **2026-06-07** | **专项审查修订：Layer 0 导航 · ARRIVED · alignment_overlay · Reveal Types · Activity Flow · Navigation→AR 全链路 · AC-6–AC-10** | **Cursor** |
| V1.1-freeze | 2026-06-16 | 审查通过 · 状态 FROZEN · review_score 98 · approved_for_runtime | Cursor |

### V1.1 修订项对照

| Fix ID | 内容 |
|--------|------|
| FIX-01 | Layer 0 · Location Navigation |
| FIX-02 | ARRIVED 状态 |
| FIX-03 | alignment_overlay 组件 |
| FIX-04 | Reveal Layer Types |
| FIX-05 | Activity Completion Flow |
| FIX-06 | Navigation → AR Flow |
| FIX-07 | AC-6 – AC-10 |
