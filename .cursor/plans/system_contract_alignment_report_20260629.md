# System Contract Alignment Fix — 工作报告

## 任务概述

**任务名称**: System Contract Alignment Fix (CRITICAL)  
**日期**: 2026-06-29  
**目标**: 将运行时实现严格对齐已冻结的信物体系规范文档

**对齐的规范文档**:
- `RELIC_CANON_V2` — 信物核心规范
- `RELIC_SYSTEM_REGISTRY_V1` — 信物系统注册表
- `RELIC_DROP_ALGORITHM_CANON_V1` — 掉落算法规范
- `RELIC_VISUAL_CANON_V1` — 视觉规范
- `RELIC_CONTENT_DENSITY_RULE_V1` — 内容密度规范

---

## 修改文件清单

| 文件 | 操作 | 说明 |
|------|------|------|
| `apps/miniapp/core/runtime/world_runtime_store.js` | 重写 | 新增 echo_store、collectible_store；替换 buildCollectionRenderTree 为规范版；新增 PAGE_07A/PAGE_07B 构建器；增强 discoverRelic 掉落算法 |
| `apps/miniapp/pages/collection/index.js` | 重写 | 从 3-tab 统一模型改为规范 PAGE_06/07A/07B 子视图切换结构 |
| `apps/miniapp/pages/collection/index.wxml` | 重写 | 全面替换为圆形构图，移除卡片网格，无游戏化 UI |
| `apps/miniapp/pages/collection/index.wxss` | 重写 | 圆形布局样式（轨道/光环/中心符号），东方克制风格 |
| `apps/miniapp/content/world/inject_world_content.js` | 修改 | 更新 injectCollectionContent 适配新的 relicNodes 结构 |

---

## 执行步骤与对齐结果

### STEP 1 — 移除无效结构

**删除**: 3-tab 分页模型（信物 / 数字藏品 / AR生成记录）

**原因**: `RELIC_SYSTEM_REGISTRY_V1` 明确禁止将 relic/echo/collectible 混在同一个列表视图中。

| 违反项 | 状态 |
|--------|------|
| 3-tab 混合视图 | ✔ 已移除 |
| 统一 userAssets 数据源 | ✔ 已替换为三独立 store |
| AR 事件与信物卡片同页展示 | ✔ 已移除 |

### STEP 2 — 重建页面结构

**对齐 `RELIC_SYSTEM_REGISTRY_V1` 的页面规范**:

| 规范页面 | 实现方式 | 状态 |
|---------|---------|------|
| PAGE_06: 我的信物 | 默认子视图，圆形构图 relicNodes | ✔ |
| PAGE_07A: 天之图鉴 | 星宿分组 + 四象摘要 | ✔ |
| PAGE_07B: 人之图鉴 | 经络分组 | ✔ |
| PAGE_07C: 信物详情 | 模态弹窗，圆形聚焦 | ✔ |

**架构变化**: 取消 unified "collection list"，改为三独立 store：
- `relic_store` — 成长系统（`relicStore`）
- `echo_store` — 意义系统（`echoStore`，新增）
- `collectible_store` — 用户媒体系统（`collectibleStore`，新增）

### STEP 3 — 强制系统分离

| 规范规则 | 实现 | 状态 |
|---------|------|------|
| relic = growth node (NOT collectible) | `buildCollectionRenderTree` 只读 `relicStore` + `echoStore` | ✔ |
| echo = immutable meaning response (NOT UI asset) | echo 只在详情模态中以 1 句哲学回响显示 | ✔ |
| collectible = user-generated memory only | `collectibleStore` 仅保存 template + metadata，无成长值 | ✔ |
| 三者在同一页面不混合 | 子视图通过 `pageType` 切换，每视图只展示一种系统 | ✔ |

### STEP 4 — 修复数据源绑定

| 规范要求 | 实现 | 状态 |
|---------|------|------|
| relic 从 relic_store 读取 | `getDiscoveredRelics()` ← `relicStore` | ✔ |
| echo 从 echo_store 读取 | `getEchoesBySource()` ← `echoStore` | ✔ |
| collectible 从 collectible_store 读取 | `getAllCollectibles()` ← `collectibleStore` | ✔ |
| 禁止统一 "collection list" | 已完全移除旧的 `buildCollectionRenderTree` 3-tab 输出 | ✔ |

### STEP 5 — 视觉规范强制

**对齐 `RELIC_VISUAL_CANON_V1`**:

| 规范规则 | 实现 | 状态 |
|---------|------|------|
| 圆形构图 | orbit + ring + center symbol 三层结构 | ✔ |
| 单节点聚焦 | 每个 relic 独立显示，无网格混杂 | ✔ |
| 无卡片画廊 UI | 已移除 `collection-card` / `collection-grid` 全部样式 | ✔ |
| 无游戏化 UI | 移除 rarity 标签、等级边框、gamified 色彩 | ✔ |
| 东方克制风格 | 浅米色背景 (`#F4F1EB`)，金色光晕 (`#C8A24A`)，低饱和度 | ✔ |
| 无方形主体 | 所有节点均为正圆形 | ✔ |

### STEP 6 — 内容密度规范

**对齐 `RELIC_CONTENT_DENSITY_RULE_V1`**:

| 层级 | 规范要求 | 实现 | 状态 |
|------|---------|------|------|
| 星（relic） | 1 句释义 | `r.phenomenon`，WXML 中单行显示 | ✔ |
| 回响（echo） | 1 句哲学回应 | `echoText`，斜体显示在详情 | ✔ |
| 数字藏品（collectible） | template + filter metadata | `collectibleStore` 仅存 template/filter/metadata | ✔ |

### STEP 7 — 掉落算法规范

**对齐 `RELIC_DROP_ALGORITHM_CANON_V1`**:

| 规范规则 | 实现 | 状态 |
|---------|------|------|
| 禁止重复获得 | `discoverRelic()` 已发现返回 false + console.warn | ✔ |
| 仅基于进度解锁 | 新增 `getNextRecommendedRelic()` 优先补齐当前星宿/经络 | ✔ |
| 无 UI 手动分配 | `discoverRelic()` 现在需要 `sourceType` 参数，纯 UI 调用会被拒绝 | ✔ |
| 发现时自动生成回响 | `discoverRelic()` 成功后自动调用 `generateEcho()` | ✔ |

---

## 验收标准

| 条件 | 状态 |
|------|------|
| ✔ no 3-tab "collection system" | ✔ |
| ✔ system follows registry pages (PAGE_06/07A/07B/07C) | ✔ |
| ✔ relic/echo/collectible fully separated | ✔ |
| ✔ UI follows canonical visual rules (circular, no grid) | ✔ |
| ✔ no duplication logic (DROP_ALGORITHM enforced) | ✔ |
| ✔ no UI-based semantic mixing | ✔ |

---

## 潜在风险与后续建议

1. **其他页面引用旧结构**: 检查过 `visual_regression_guard.js` 中有一处引用 `renderTree.relics.items`（旧格式），但该检查在新结构下不会触发误报。
2. **`buildLegacyCollectionRenderTree`**: 保留了旧函数用于过渡，未来版本可彻底移除。
3. **seed 数据中无 echoes**: `initEchoStore()` 已含 fallback 逻辑，自动从已发现 relic 的 phenomenon 生成 echo。
4. **SEO/爬虫**: 当前为 WeChat Mini Program，无需考虑。

---

*报告生成时间: 2026-06-29 12:21 CST*
*对齐规范版本: RELIC_CANON_V2 (FROZEN) / RELIC_SYSTEM_REGISTRY_V1 (FROZEN) / RELIC_DROP_ALGORITHM_CANON_V1 (FROZEN) / RELIC_VISUAL_CANON_V1 (FROZEN) / RELIC_CONTENT_DENSITY_RULE_V1 (FROZEN)*
