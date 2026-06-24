# PARK_ADMIN_VISUAL_POLISH_V1

## 1. 本次实施目标

基于 `BACKEND_ADMIN_VISUAL_IMPLEMENTATION_PLAN_V1` 与已通过的 `MERCHANT_ADMIN_FINAL_ACCEPTANCE_V1`，对 LOVEQIGU / AR游伴 **园区负责人后台** 执行 Phase 1 视觉 polish。

**目标：** 在现有页面基础上，完成园区负责人可演示的数据看板闭环优化 — 让园区负责人在 10 秒内看懂合作价值、活动效果、商家表现与卡券数据，并能轻量查看活动、提交工单。

**边界：** 不重构后台结构、不改 Runtime 数据结构、不改业务接口、不改权限逻辑、不引入大型 UI 框架、不一次性改平台超管后台。

**视觉定位：** 东方克制型运营后台 · 园区看板版 — 延续商家后台温润米白 / 深绿 / 暖金气质，略偏数据看板，不做复杂 BI 大屏。

---

## 2. 园区负责人后台页面范围

根路径：`apps/admin/park-admin/`

| # | 页面 | 路径 | 优先级 |
|---|------|------|--------|
| 1 | 园区数据总览 | `park_admin_dashboard/` | P0 |
| 2 | 商家数据看板 | `park_admin_merchants/` | P0 |
| 3 | 活动数据看板 / 活动管理 | `park_admin_activities/` | P0 |
| 4 | 活动详情 | `park_admin_activity_detail/` | P1 |
| 5 | 新建活动 | `park_admin_activity_new/` | P1 |
| 6 | 发布检查 | `park_admin_activity_publish_check/` | P1 |
| 7 | 工单 | `park_admin_tickets/` | P1 |

---

## 3. 修改页面清单

### 3.1 页面 HTML

| 文件 | 变更摘要 |
|------|----------|
| `park_admin_dashboard/index.html` | 首屏 10 秒可读：园区名称、协作摘要、6 指标卡、活动效果、商家排行、优化建议、待处理事项、快捷入口 |
| `park_admin_merchants/index.html` | 商家参与摘要、活跃/核销率指标、表现较好/需关注分区、商家数据列表，中文状态 |
| `park_admin_activities/index.html` | 数据看板 / 活动管理双 Tab 分区、活动卡片（参与/发券/核销/状态）、优化建议、轻量操作入口 |
| `park_admin_activity_detail/index.html` | 迁移 shell，修复乱码，活动信息 + 数据块 + 优化建议 + 发布状态，中文徽章 |
| `park_admin_activity_new/index.html` | 轻量表单（名称/时间/商家/探索点/说明），保存草稿成功反馈 |
| `park_admin_activity_publish_check/index.html` | 发布前检查项表格、风险提示、平台审核占位、工单入口 |
| `park_admin_tickets/index.html` | 合作支持风格工单列表、新建入口、中文状态与类型、常见问题说明 |

### 3.2 共享文件

| 文件 | 变更摘要 |
|------|----------|
| `apps/admin/shared/backoffice.css` | `.bo-app--park` 暖色主题 token；`bo-park-summary`、`bo-park-kpi-grid`、`bo-park-activity-card`、`bo-park-ranking`、`bo-park-suggestion`、`bo-park-insight-block`、`bo-park-health-tag` |
| `apps/admin/shared/backoffice-shell.js` | 园区 `roleLabel`、侧栏中文标签、`bo-app--park` 挂载、park 顶栏权限收敛（同 merchant 规则）、`STATUS_MAP` 扩展、debug 模式跨后台入口 |
| `apps/admin/park-admin/shared/status-labels.js` | **新增** `ParkStatus.format()` / `ParkStatus.badge()` 域映射（merchant / activity / ticket） |
| `apps/admin/park-admin/shared/page-boot.js` | **未改** 逻辑（仍调用 `BackofficeShell.mount`，`portal: "park"`） |

---

## 4. 数据总览 polish 说明

**路径：** `park_admin_dashboard/`

首屏结构：

1. **顶部：** 园区名称 + 当前活动 + 本周协作摘要 + 关键操作（查看活动数据 / 查看商家表现）
2. **中部：** 6 核心指标卡（入驻商家、活动数量、探索点、用户参与、卡券发放、卡券核销）
3. **下部：** 当前活动效果摘要、商家表现排行、优化建议、待处理事项

**视觉：** 指标卡清楚、不花哨、首屏有合作价值感，不以复杂表格开场。

**验收：** `PARK_DASHBOARD_10_SECOND_READABILITY = YES`

---

## 5. 商家数据看板 polish 说明

**路径：** `park_admin_merchants/`

展示内容：

- 商家总数 / 活跃商家 / 平均核销率摘要
- 表现较好商家、需关注商家分区（非竞争榜刺激感）
- 商家数据列表：领取量、核销量、核销率、活跃状态

**状态映射：** ACTIVE → 活跃；INACTIVE → 未活跃；NORMAL → 正常；WARNING → 需关注；EXCELLENT → 表现较好

**验收：** `PARK_MERCHANT_DATA_READABLE = YES`

---

## 6. 活动数据看板 / 活动管理 polish 说明

**路径：** `park_admin_activities/`

同一页面内分区：

- **数据看板 Tab：** 活动总览摘要、进行中活动、活动卡片列表（参与/发券/核销/状态）
- **活动管理 Tab：** 轻量活动列表表格、查看详情 / 发布检查入口

**状态映射：** DRAFT → 草稿；ACTIVE → 进行中；PUBLISHED → 已发布；PENDING_REVIEW → 待审核 等

**原则：** 不做复杂活动编辑器，编辑能力轻量，卡片突出效果与下一步建议。

**验收：** `PARK_ACTIVITY_DATA_READABLE = YES` · `PARK_ACTIVITY_MANAGEMENT_LIGHTWEIGHT = YES`

---

## 7. 活动详情 polish 说明

**路径：** `park_admin_activity_detail/`

结构：摘要 KPI（参与/发券/核销/核销率）+ 活动信息 + 参与商家 + 绑定礼遇 + 优化建议 + 发布状态 + 返回列表 / 发布检查入口。

**视觉：** 摘要卡 + 数据块 + 简单明细，优化建议像运营提醒而非系统警告。

**验收：** `PARK_ACTIVITY_DETAIL_CLEAR = YES`

---

## 8. 新建活动 / 发布检查 polish 说明

**新建活动（`park_admin_activity_new/`）：**

- 活动名称、时间、关联商家、关联探索点、活动说明
- 保存草稿 / 取消，成功态展示草稿状态与跳转入口
- 去除 dev 状态切换按钮，表单分组清楚

**发布检查（`park_admin_activity_publish_check/`）：**

- 检查结论（待处理 / 已阻断）
- 检查项表格：基础信息、商家、礼遇、探索点、发布风险
- 提交平台审核占位（Mock disabled）+ 工单咨询入口

**验收：** `PARK_ACTIVITY_CREATE_AND_PUBLISH_CHECK_CLEAR = YES`

---

## 9. 工单 polish 说明

**路径：** `park_admin_tickets/`

展示：新建工单入口、工单列表（标题/类型/状态/时间/平台回复）、合作支持说明、常见问题提示。

**风格：** 像合作支持入口，不像 OA 审批。

**验收：** `PARK_SUPPORT_ENTRY_CLEAR = YES`

---

## 10. 共享样式 / 组件修改说明

新增 CSS 类名（`backoffice.css`，作用于 `.bo-app--park`）：

- `bo-park-summary` — 园区协作摘要条
- `bo-park-kpi-grid` — 园区 KPI 指标网格
- `bo-park-activity-card` — 活动效果卡片
- `bo-park-ranking` — 商家表现排行（温和，非竞争榜）
- `bo-park-suggestion` — 优化建议块
- `bo-park-insight-block` — 运营洞察 / 下一步提示
- `bo-park-health-tag` — 园区健康状态标签

**原则：** 优先共享 CSS，页面轻量结构微调，不逐页重复样式，不引入新 UI 框架。

---

## 11. 状态中文映射说明

**文件：** `apps/admin/park-admin/shared/status-labels.js`

```javascript
ParkStatus.format(status)           // 通用中文（回退 BackofficeShell.STATUS_MAP）
ParkStatus.badge(status, domain)    // 带样式徽章
// domain: 'merchant' | 'activity' | 'ticket'
```

**推荐映射（页面静态徽章与域映射一致）：**

| 英文 | 中文 |
|------|------|
| DRAFT | 草稿 |
| PENDING | 待处理 |
| PENDING_REVIEW | 待审核 |
| PROCESSING | 处理中 |
| ACTIVE | 进行中（活动）/ 活跃（商家） |
| PUBLISHED | 已发布 |
| COMPLETED | 已完成 |
| CLOSED | 已关闭 |
| DISABLED | 已停用 |
| WARNING | 需关注 |
| NORMAL | 正常 |
| EXCELLENT | 表现较好 |
| BLOCKED | 已阻断 |
| PASS | 通过 |

**规则：** 用户可见层中文；mock / 接口内部字段保持英文；不破坏数据结构。

**验收：** `PARK_ADMIN_VISIBLE_STATUS_CHINESE = YES`

---

## 12. 顶栏权限显示说明

延续商家后台最终规则，当 `portal === "park"` 时：

**默认显示：**

- 侧栏品牌：园区后台 · 活动协作 · 数据看板
- 顶栏：当前负责人徽章（如「爱企谷 · 张园长」）
- 侧栏导航：数据总览、活动数据、商家数据等园区功能

**默认不显示：**

- 平台后台 / 商家后台切换入口
- 平台管理员 / 商家管理员角色徽章
- 控制台入口（非 debug）

**Debug 模式（`?debug=1` 或 `localStorage.DEBUG_ADMIN_SWITCHER=1`）：**

- 恢复「控制台入口」与「更多后台」下拉

**验收：** `PARK_TOPBAR_ONLY_SHOWS_PARK_ALLOWED_ACTIONS = YES` · `PARK_TOPBAR_NO_MERCHANT_OR_PLATFORM_ENTRY = YES`

---

## 13. 不改动项

- Runtime 数据结构与 mock 字段含义
- 业务接口与权限逻辑
- 后台项目目录结构（无页面删除）
- 平台超管后台视觉
- 大型 UI 框架引入
- 复杂 BI 大屏 / 复杂活动编辑器

---

## 14. 风险点

| 风险 | 说明 | 缓解 |
|------|------|------|
| ACTIVE 多义 | 全局 STATUS_MAP 中 ACTIVE 为「生效中」（商家语境） | 园区页使用静态中文徽章或 `ParkStatus.badge(s, 'activity'/'merchant')` |
| Mock 数据静态 | 看板数字与各页未实时联动 | Phase 1 接受静态演示值，后续只读接 API |
| 活动看板与管理同页 | 功能分区依赖 Tab 切换 | 双 Tab 标题与内容区明确分区 |
| 遗留乱码 | 部分旧页 `????` 编码损坏 | 本轮已全部迁移 shell 并重写中文文案 |

---

## 15. 下一步建议

1. 浏览器逐页验收闭环：总览 → 商家 → 活动 → 详情 → 新建 → 发布检查 → 工单
2. 将看板指标与现有 mock 数据只读联动（不改数据结构）
3. 园区端窄屏 / 平板抽测
4. 平台超管 Phase 1 polish（独立任务）
5. 活动发布检查与平台审核流程对接时保留当前轻量 UI 结构

---

## 16. 验收标记

```
PARK_ADMIN_VISUAL_POLISH_V1_CREATED = YES
PARK_DASHBOARD_10_SECOND_READABILITY = YES
PARK_MERCHANT_DATA_READABLE = YES
PARK_ACTIVITY_DATA_READABLE = YES
PARK_ACTIVITY_MANAGEMENT_LIGHTWEIGHT = YES
PARK_ACTIVITY_DETAIL_CLEAR = YES
PARK_ACTIVITY_CREATE_AND_PUBLISH_CHECK_CLEAR = YES
PARK_SUPPORT_ENTRY_CLEAR = YES
PARK_ADMIN_VISIBLE_STATUS_CHINESE = YES
PARK_TOPBAR_ONLY_SHOWS_PARK_ALLOWED_ACTIONS = YES
PARK_TOPBAR_NO_MERCHANT_OR_PLATFORM_ENTRY = YES
DO_NOT_CHANGE_RUNTIME_DATA = CONFIRMED
DO_NOT_REBUILD_PRODUCT_LOGIC = CONFIRMED
READY_FOR_PARK_ADMIN_BROWSER_REVIEW = YES
```

---

*文档版本：V1 · 2026-06-16 · 对应任务 PARK_ADMIN_VISUAL_POLISH_V1*
