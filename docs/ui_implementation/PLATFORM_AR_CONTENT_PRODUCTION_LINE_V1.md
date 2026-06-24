# PLATFORM_AR_CONTENT_PRODUCTION_LINE_V1

## 1. 本轮问题说明

平台超管后台已有平台总览、审查中心、发布中心、景区管理、活动管理、卡券分析、工单等运营治理页面，但缺少 AR 游伴 **内容生产线** 功能页面。原先「内容生产专项（待建设）」仅为占位，无法满足平台后台演示与后续生产管理需要。

**本轮目标：** 补齐探索点、信物、祝福内容、AR 内容、美术需求单、生成任务等核心生产页面骨架，使平台后台具备可演示的内容生产闭环（mock 数据 + 状态展示 + 操作入口）。

---

## 2. AR 生产线 / 内容生产线定位

内容生产线服务于 **AR 游伴** 的故事进度资产生产，不是普通 CMS，也不是游戏装备或电商商品管理。

**生产链路：**

景区 → 活动 → 探索点 → 信物 → 祝福内容 / AR 内容 / 美术资源 → 审查 → 发布

**资产边界：**

- **信物（Relic）：** 故事进度资产，绑定探索点与章节节点
- **数字藏品：** 传播资产，与信物不可混用
- **AR 内容：** 服务于探索点、信物显现与故事进度，不是独立炫技素材库

---

## 3. 新增页面清单

根路径：`apps/admin/platform-admin/`

| # | 页面 | 路径 | 导航 ID |
|---|------|------|---------|
| 1 | 生产总览 | `platform_content_dashboard/` | `content_dashboard` |
| 2 | 探索点管理 | `platform_exploration_points/` | `exploration_points` |
| 3 | 信物管理 | `platform_relics/` | `relics` |
| 4 | 祝福内容管理 | `platform_blessing_content/` | `blessing_content` |
| 5 | AR 内容管理 | `platform_ar_content/` | `ar_content` |
| 6 | 美术需求单 | `platform_art_requests/` | `art_requests` |
| 7 | 生成任务 | `platform_generation_tasks/` | `generation_tasks` |

### 共享文件变更

| 文件 | 变更摘要 |
|------|----------|
| `apps/admin/shared/backoffice-shell.js` | 内容生产导航 7 项；扩展 STATUS_MAP（已生成、生成中、已绑定等） |
| `apps/admin/shared/backoffice.css` | 内容生产组件类（summary、lineage、binding-chip、workflow-card 等） |
| `apps/admin/platform-admin/shared/platform-content-boot.js` | **新增** 内容生产页统一 boot（auth + 面包屑） |
| `apps/admin/platform-admin/shared/platform-global-search.js` | 纳入探索点、信物、祝福内容、AR 内容、美术需求单 |
| `apps/admin/platform-admin/dashboard/index.html` | 替换「待建设」为内容生产快捷入口 |

---

## 4. 生产总览说明

**路径：** `platform_content_dashboard/`

**目标：** 平台运营人员 10 秒内看懂当前内容生产进度。

**展示模块：**

- 本周生产摘要
- 生产链路说明（`bo-content-lineage`）
- 9 项 KPI：景区、活动、探索点、信物、祝福、AR、美术需求单、待审查、待发布
- 待补齐内容 / 待审查·待发布
- 近期生成任务
- 风险提醒

**验收：** `PLATFORM_CONTENT_DASHBOARD_READY = YES`

---

## 5. 探索点管理说明

**路径：** `platform_exploration_points/`

管理景区 / 活动下探索点内容生产状态，体现信物、祝福、AR、美术绑定关系（`bo-content-binding-chip`）。

**操作入口：** 查看详情、生成信物占位、生成祝福文案、生成 AR 占位、生成美术需求单、提交审查（链接审查中心）。

**验收：** `PLATFORM_EXPLORATION_POINT_MANAGEMENT_READY = YES`

---

## 6. 信物管理说明

**路径：** `platform_relics/`

管理信物作为故事进度资产。页面顶部必须有 **信物 ≠ 数字藏品** 提示（`bo-content-warning`）。

**字段：** 信物名称、景区、活动、探索点、章节、等级、显现/文案/AR/审查/发布状态。

**操作：** 查看详情、编辑文案、绑定 AR、生成美术需求、提交审查、发布占位。

**验收：**

- `PLATFORM_RELIC_MANAGEMENT_READY = YES`
- `PLATFORM_RELIC_NOT_DIGITAL_COLLECTIBLE_NOTICE_VISIBLE = YES`

---

## 7. 祝福内容管理说明

**路径：** `platform_blessing_content/`

管理祝福文案、显现文案、回响文案、领取提示、探索提示等。

**术语合规：** 使用祝福、回响、显现；不使用愿力、祝由、合真等禁用术语。页面顶部有术语合规提示。

**操作：** 查看内容、编辑、生成候选文案、提交审查、发布到 Runtime 占位。

**验收：**

- `PLATFORM_BLESSING_CONTENT_MANAGEMENT_READY = YES`
- `PLATFORM_TERMINOLOGY_COMPLIANCE_VISIBLE = YES`

---

## 8. AR 内容管理说明

**路径：** `platform_ar_content/`

管理 AR 扫描、显现仪式、印记粒子、Gate 打开、AR 贴合资源等，强调绑定探索点与信物（`bo-content-lineage`）。

**操作：** 查看配置、预览占位、绑定信物、生成美术需求单、提交审查、发布占位。

**验收：**

- `PLATFORM_AR_CONTENT_MANAGEMENT_READY = YES`
- `PLATFORM_AR_CONTENT_BINDING_RELATION_VISIBLE = YES`

---

## 9. 美术需求单说明

**路径：** `platform_art_requests/`

管理提交给会话 C / 豆包 / Gemini / 人工设计的视觉资产需求。卡片 + 表格双视图（`bo-art-request-card`）。

**资产类型：** 信物视觉、AR 显现素材、探索点视觉、活动视觉、祝福卡片。

**状态：** 待生成、生成中、待审查、需重做、已通过、已绑定。

**操作：** 查看需求、复制生成 Prompt、标记已生成、提交美术审查、绑定资源。

**验收：** `PLATFORM_ART_REQUEST_MANAGEMENT_READY = YES`

---

## 10. 生成任务说明

**路径：** `platform_generation_tasks/`

记录占位生成、文案生成、AR 占位、美术需求、审查、发布等任务流（`bo-generation-task-row`）。

**任务类型：** 生成信物占位、生成祝福文案、生成 AR 占位、生成美术需求单、提交审查、发布到 Runtime。

**状态中文化：** 草稿、已生成、生成中、待审查、已通过、已驳回、已绑定、待发布、已发布、失败。

**操作：** 查看任务、继续执行、提交审查、查看日志、发布占位。

**验收：** `PLATFORM_GENERATION_TASKS_READY = YES`

---

## 11. 审查中心与发布中心联动说明

本轮无真实联动接口，但各生产页面提供明确入口：

| 入口 | 出现页面 |
|------|----------|
| **提交审查** → `reviews/index.html` | 探索点、信物、祝福、AR、美术需求单、生成任务 |
| **发布占位** → `publish/index.html` | 信物、祝福、AR、生成任务 |

按钮为 mock 占位，文案与状态清晰可辨。

**验收：**

- `PLATFORM_CONTENT_REVIEW_ENTRY_READY = YES`
- `PLATFORM_CONTENT_PUBLISH_ENTRY_READY = YES`

---

## 12. 全局搜索联动说明

`platform-global-search.js` 新增搜索类型：

1. 探索点
2. 信物
3. 祝福内容
4. AR 内容
5. 美术需求单

搜索结果跳转至对应管理页面。

**验收：** `PLATFORM_GLOBAL_SEARCH_CONTENT_OBJECTS_READY = YES`

---

## 13. 状态中文化说明

内容生产线所有用户可见状态均为中文，通过 `BackofficeShell.STATUS_MAP` 与页面内 `badge` 直接展示。

推荐状态：草稿、待生成、已生成、生成中、待审查、已通过、已驳回、需补充、需重做、已绑定、待发布、已发布、失败。

禁止在用户可见页面出现：`PENDING`、`REJECTED`、`APPROVED`、`GENERATED`、`FAILED` 等英文 raw status。

**验收：** `PLATFORM_CONTENT_STATUS_CHINESE = YES`

---

## 14. 不改动项

1. 不改 Runtime 数据结构
2. 不改后端接口
3. 不接真实 AI 生成服务 / 图片生成 API
4. 不引入大型 UI 框架
5. 不重构后台架构
6. 不删除已有平台后台页面
7. 不回改已通过的商家后台和园区后台
8. 不把内容生产做成复杂真实 CMS
9. 不混淆信物与数字藏品

**验收：**

- `DO_NOT_CHANGE_RUNTIME_DATA = CONFIRMED`
- `DO_NOT_REBUILD_PRODUCT_LOGIC = CONFIRMED`

---

## 15. 风险点

1. **Mock 与真实数据脱节：** 当前 KPI 与表格为静态 mock，接入真实生产 API 后需统一数据源。
2. **审查 / 发布仅为链接占位：** 生产对象尚未在审查中心列表中自动登记。
3. **生成操作无反馈：** 「生成信物占位」等按钮暂无 toast / 任务创建反馈。
4. **跨页面状态不一致：** 各页 mock 状态独立维护，后续需集中 mock-store 或 API。

---

## 16. 下一步建议

1. 扩展 `mock-store.js` 统一内容生产对象与任务状态
2. 审查中心列表增加来自生产线的 mock 条目
3. 生成按钮点击后写入 `platform_generation_tasks`  mock 任务
4. 探索点详情抽屉 / 侧栏展示完整绑定 lineage
5. 接入真实 AI 文案候选生成（会话 C）时保留当前页面结构

---

## 17. 验收标记

```
PLATFORM_AR_CONTENT_PRODUCTION_LINE_V1_CREATED = YES
PLATFORM_CONTENT_PRODUCTION_NAV_READY = YES
PLATFORM_CONTENT_DASHBOARD_READY = YES
PLATFORM_EXPLORATION_POINT_MANAGEMENT_READY = YES
PLATFORM_RELIC_MANAGEMENT_READY = YES
PLATFORM_RELIC_NOT_DIGITAL_COLLECTIBLE_NOTICE_VISIBLE = YES
PLATFORM_BLESSING_CONTENT_MANAGEMENT_READY = YES
PLATFORM_TERMINOLOGY_COMPLIANCE_VISIBLE = YES
PLATFORM_AR_CONTENT_MANAGEMENT_READY = YES
PLATFORM_AR_CONTENT_BINDING_RELATION_VISIBLE = YES
PLATFORM_ART_REQUEST_MANAGEMENT_READY = YES
PLATFORM_GENERATION_TASKS_READY = YES
PLATFORM_CONTENT_REVIEW_ENTRY_READY = YES
PLATFORM_CONTENT_PUBLISH_ENTRY_READY = YES
PLATFORM_CONTENT_STATUS_CHINESE = YES
PLATFORM_GLOBAL_SEARCH_CONTENT_OBJECTS_READY = YES
DO_NOT_CHANGE_RUNTIME_DATA = CONFIRMED
DO_NOT_REBUILD_PRODUCT_LOGIC = CONFIRMED
READY_FOR_PLATFORM_ADMIN_BROWSER_REVIEW_CONTINUE = YES
```
