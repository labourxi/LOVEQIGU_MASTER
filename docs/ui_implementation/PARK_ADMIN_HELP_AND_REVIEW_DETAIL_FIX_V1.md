# PARK_ADMIN_HELP_AND_REVIEW_DETAIL_FIX_V1

## 1. 本轮问题说明

基于园区后台浏览器验收反馈，本轮针对两个协作闭环缺口进行收口小修：

| # | 问题 | 影响 |
|---|------|------|
| 1 | 商家 / 园区后台缺少可下载的操作手册 | 外部合作方无法离线查阅说明，仅靠页面文字不足 |
| 2 | 园区发布检查页仅显示状态标签 | 园区负责人无法了解阻断原因、平台意见与下一步动作 |

**边界：** 不重做视觉、不改 Runtime 数据、不改接口、不改权限逻辑、不引入大型 UI 框架、不做真实 PDF 生成。

---

## 2. 商家帮助中心操作手册补充说明

**路径：** `apps/admin/merchant-portal/merchant_help/index.html`

在原有礼遇 / 核销 / 结算 / 联系平台 / FAQ 基础上，新增 **操作手册下载** 模块：

| 下载项 | 适用对象 |
|--------|----------|
| 商家后台操作手册 | 店主和商家管理员 |
| 卡券核销说明 | 前台核销员 |
| 工单与结算说明 | 财务和门店负责人 |

每项含标题、说明与「下载」按钮。当前为 Mock 占位，点击提示后续接入正式 PDF，并标注「Mock 占位，后续接入正式 PDF」。

**验收：** `MERCHANT_HELP_MANUAL_DOWNLOAD_READY = YES`

---

## 3. 园区帮助中心补齐说明

**路径：** `apps/admin/park-admin/park_admin_help/index.html`（**新增**）

园区后台左侧导航「服务」分组新增 **帮助中心** 入口（`backoffice-shell.js`）。

页面结构：

1. **快速指南** — 数据总览、活动数据、商家表现、创建草稿、发布检查
2. **操作手册下载** — 园区负责人手册、活动协作、发布检查、工单提交（4 项 Mock 下载）
3. **常见问题** — 无法发布、数据更新、核销率偏低、发布阻断处理
4. **联系平台** — 工单入口、联系人占位、热线占位

**验收：** `PARK_HELP_CENTER_READY = YES`

---

## 4. 园区操作手册下载说明

园区帮助中心「操作手册下载」区与商家端共用 `bo-manual-downloads` / `bo-manual-card` / `bo-download-button` 样式。

下载项：

- 园区负责人操作手册
- 活动协作说明
- 发布检查说明
- 工单提交说明

均标注 Mock 占位，点击 `data-mock-download` 触发提示，不阻塞于真实 PDF 不存在。

**验收：** `PARK_HELP_MANUAL_DOWNLOAD_READY = YES`

---

## 5. 发布检查结论详情增强说明

**路径：** `apps/admin/park-admin/park_admin_activity_publish_check/index.html`

将原「检查结论」从两行状态标签升级为 **检查结论卡片**（`bo-review-detail-card`），默认展开，支持收起 / 查看详情切换。

展示内容：

1. 当前状态（待处理 / 已阻断 / 待平台审核）
2. 阻断原因
3. 平台优化意见
4. 需要补充内容（有序列表）
5. 下一步建议
6. 平台回复信息与回复时间
7. 操作入口（收起详情、提交工单、返回活动详情）

检查项表格中「礼遇配置」行同步改为「待平台审核」，与阻断原因一致。

**验收：** `PARK_PUBLISH_CHECK_RESULT_DETAIL_READY = YES`

---

## 6. 阻断原因与平台意见展示说明

使用任务指定 Mock 文案：

- **阻断原因：** 礼遇配置仍处于平台审核中，暂不可发布
- **平台优化意见：** 补充礼遇领取路径与商家核销规则说明
- **需要补充：** 3 条具体事项
- **下一步：** 等待审核或提交工单
- **平台回复：** 平台内容运营组 · 2026-06-20 15:30

样式区分：`bo-review-reason`（阻断）、`bo-review-advice`（意见）、`bo-review-next-step`（下一步）。

**验收：** `PARK_PUBLISH_BLOCK_REASON_VISIBLE = YES` · `PARK_PLATFORM_REVIEW_ADVICE_VISIBLE = YES`

---

## 7. 修改文件清单

### 页面

| 文件 | 变更 |
|------|------|
| `merchant_help/index.html` | 新增操作手册下载模块 + Mock 下载交互 |
| `park_admin_help/index.html` | **新增** 园区帮助中心全页 |
| `park_admin_activity_publish_check/index.html` | 检查结论详情卡片、收起切换、检查项文案对齐 |
| `park_admin_tickets/index.html` | 常见问题区增加帮助中心链接 |

### 共享

| 文件 | 变更 |
|------|------|
| `backoffice.css` | 新增 `bo-manual-*`、`bo-help-section`、`bo-help-faq`、`bo-review-*`、`bo-download-button` |
| `backoffice-shell.js` | 园区侧栏「服务」分组增加帮助中心导航项 |
| `park-admin/shared/page-boot.js` | **未改** |

---

## 8. 不改动项

- Runtime 数据结构与 mock 字段
- 业务接口与权限底层逻辑
- 后台项目架构
- 平台超管页面
- 真实 PDF 文件生成与存储

---

## 9. 风险点

| 风险 | 说明 | 缓解 |
|------|------|------|
| Mock 下载无真实文件 | 合作方可能期望立即获得 PDF | 按钮可点击并提示 Mock；页面明确标注后续接入 |
| 发布检查详情为静态 Mock | 未接真实审核 API | Phase 1 接受；结构已预留，后续只读绑定 |
| alert 交互较简 | Mock 下载反馈方式朴素 | 正式环境替换为真实下载或 toast |

---

## 10. 验收页面清单

| 页面 | 验收要点 |
|------|----------|
| `merchant_help/` | 操作手册下载区 3 项可见，Mock 标注存在 |
| `park_admin_help/` | 侧栏可进入；快速指南 + 下载 + FAQ + 联系平台 |
| `park_admin_activity_publish_check/` | 检查结论详情默认展开；阻断原因与平台意见可见；可收起 |
| `park_admin_tickets/` | 帮助中心链接可达 |

---

## 11. 验收标记

```
PARK_ADMIN_HELP_AND_REVIEW_DETAIL_FIX_V1_CREATED = YES
MERCHANT_HELP_MANUAL_DOWNLOAD_READY = YES
PARK_HELP_CENTER_READY = YES
PARK_HELP_MANUAL_DOWNLOAD_READY = YES
PARK_PUBLISH_CHECK_RESULT_DETAIL_READY = YES
PARK_PUBLISH_BLOCK_REASON_VISIBLE = YES
PARK_PLATFORM_REVIEW_ADVICE_VISIBLE = YES
DO_NOT_CHANGE_RUNTIME_DATA = CONFIRMED
DO_NOT_REBUILD_PRODUCT_LOGIC = CONFIRMED
READY_FOR_PARK_ADMIN_FINAL_BROWSER_REVIEW = YES
```

---

*文档版本：V1 · 2026-06-16 · 对应任务 PARK_ADMIN_HELP_AND_REVIEW_DETAIL_FIX_V1*
