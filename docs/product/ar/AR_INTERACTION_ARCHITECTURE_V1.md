# AR_INTERACTION_ARCHITECTURE_V1

# AR 交互架构 V1

---

## Status

```yaml
document_id: AR_INTERACTION_ARCHITECTURE_V1
version: V1
status: REVIEW
review_batch: TODAY_DOCUMENT_BUILD_BATCH_V1
updated_at: 2026-06-07
owner: Product / AR
priority: P0
upstream:
  - docs/world/*
  - docs/architecture/*
  - docs/canon/*
downstream:
  - docs/tech/ar_factory/AR_FACTORY_ARCHITECTURE_V1.md
  - docs/tech/ar_factory/runtime/AR_FACTORY_RUNTIME_SCHEMA_V1.md
index: docs/product/ar/AR_PRODUCT_INDEX_V1.md
```

---

## Purpose

定义 AR游伴 C 端 AR 体验的 **交互层架构**，回答：

```text
游客在真实场景中如何完成一次 AR 探索与接福？
交互状态如何流转？
Factory 产出的 ar_config 如何被消费？
```

本文件 **不涉及** 具体渲染引擎实现、CV 算法细节或 Factory 生产逻辑。

---

## Scope

### In Scope

- 五层交互模型（进入 → 锚点 → 交互 → 揭示 → 完成）
- 核心对象与状态机
- 与 AR Factory / Runtime / 探索地图的边界
- Phase1 交互能力上限（2D overlay · Lottie · 轻揭示）

### Out of Scope

- 锚点提取算法（见 AR Factory）
- 模板匹配与草稿生成（见 Pipeline）
- 后台审核 UI（见 Admin 规格）
- 3D 复杂动画 · 世界级 AR 体验

---

## Architecture

### 分层模型

```text
Layer 1 · Scene Entry      进入探索点 / 扫码 / 探索地图选点
Layer 2 · Anchor Lock      视觉锚点识别与锁定
Layer 3 · Interaction      轻交互（点击 / 凝视 / 站位引导）
Layer 4 · Reveal           内容揭示（Lottie / 2D overlay / 轻 3D）
Layer 5 · Completion       完成凭证 · 福印 · 跳转福礼 / 福册 / 故事
```

### 系统位置

```text
探索地图 (explore_point)
        ↓
AR Interaction Layer（本文件）
        ↓
Runtime ar_config
        ↑
AR Factory（生产 ar_config）
```

### 状态机

```text
IDLE → SCANNING → ANCHOR_LOCKED → INTERACTING → REVEALING → COMPLETED
                  ↓
              ANCHOR_LOST → SCANNING
```

| 状态 | 用户感知 |
|------|----------|
| SCANNING | 「请对准探索标记」 |
| ANCHOR_LOCKED | 锚点稳定 · 可交互 |
| INTERACTING | 轻交互进行中 |
| REVEALING | 福印 / 内容揭示 |
| COMPLETED | 接福完成 · 后续跳转 |

---

## Components

| 组件 | 类型 | 说明 |
|------|------|------|
| `explore_point` | 业务对象 | 探索点 · 地图与 Runtime 绑定单元 |
| `anchor_set` | 技术对象 | 视觉锚点集合 · ORB/AKAZE 特征描述 |
| `ar_config` | 配置 | AR 运行时配置 · 模板驱动 |
| `interaction_script` | 脚本 | 交互步骤与触发条件 |
| `reveal_asset` | 资产引用 | Lottie / 图片 / 轻模型 |
| `completion_event` | 事件 | 完成事件 · 写入用户进度 |
| `standing_guide` | UI 引导 | 站位图 · 扫描引导 |
| `scan_guide` | UI 引导 | 引导图文案与图示 |

---

## Workflow

### 标准用户旅程

```text
1. 游客在探索地图选择探索点 / 扫码进入
2. 加载 explore_point 绑定的 ar_config
3. 相机开启 → SCANNING
4. 锚点锁定 → ANCHOR_LOCKED
5. 按 interaction_script 完成轻交互
6. 触发 reveal_asset → REVEALING
7. 写入 completion_event → COMPLETED
8. 跳转福礼 / 福册 / 接福活动后续页
```

### 异常路径

| 场景 | 行为 |
|------|------|
| 锚点丢失 | ANCHOR_LOST → 重新 SCANNING · 展示 scan_guide |
| 配置缺失 | 降级提示 · 不崩溃 · 上报运营 |
| 活动已结束 | 只读揭示 · 不写入 completion_event |

---

## Runtime Mapping

| 交互对象 | Runtime 字段 / 路径 | 消费方 |
|----------|---------------------|--------|
| `explore_point` | `data/ar/` · 探索点 registry | miniapp 探索地图 |
| `ar_config` | `loveqigu.ar_factory.ar_config.v1` | miniapp ar-entry |
| `anchor_set` | `loveqigu.ar_factory.anchor_set.v1` | 端侧 CV 模块 |
| `completion_event` | 用户进度服务 | story / relic / 活动引擎 |
| `reveal_asset` | assets registry | Lottie / overlay 渲染 |

### miniapp 页面映射

| 页面 | 职责 |
|------|------|
| `pages/explore-map/` | 探索点入口 |
| `pages/ar-entry/` | AR 会话壳层 · 状态机宿主 |
| `pages/lottie/` | Lottie 揭示 |
| `pages/echo/` | 回响 / 完成反馈 |

---

## Governance Rules

1. **Canon 约束**：不新增神祇 / 文明 / 历史事件；不填补 Canon 空白。
2. **资产分离**：信物（Relic）≠ 数字藏品（Digital Collectible）；活动 AR 不污染主线信物合成。
3. **术语**：使用官方术语（探索地图 · 权益中心 · 心愿值 · 合真 · 回响 · 祝禁）。
4. **语言层级**：L1 商业 / L2 产品 / L3 Canon · 不混层。
5. **Phase1 上限**：以 2D overlay + Lottie + 轻揭示为主；不承诺复杂 3D。
6. **Factory 边界**：本文件只消费 `ar_config`，不定义生产逻辑。

---

## Acceptance Criteria

| # | 条件 | 验证方式 |
|---|------|----------|
| AC-1 | 五层模型与状态机完整定义 | 文档评审 |
| AC-2 | 核心对象与 Runtime Schema 字段对齐 | 交叉对照 AR_FACTORY_RUNTIME_SCHEMA_V1 |
| AC-3 | miniapp 页面映射无遗漏 Phase1 路径 | 产品走查 |
| AC-4 | Canon / 术语 / 资产分离规则明确 | 治理评审 |
| AC-5 | 状态 = REVIEW · 未标记 FROZEN | 索引检查 |

```yaml
AR_INTERACTION_ARCHITECTURE_V1_REVIEW: PENDING
```

---

## Change Log

| 版本 | 日期 | 变更 | 作者 |
|------|------|------|------|
| V1.0-draft | 2026-06-07 | 初稿 · TODAY_DOCUMENT_BUILD_BATCH_V1 · 标准结构 · REVIEW | Cursor |
| V1.0-freeze-attempt | 2026-06-08 | 曾短暂标记 FROZEN · 本批次回退至 REVIEW | Cursor |
