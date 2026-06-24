# PARK_ADMIN_OPERATION_AUDIT_AND_SUBMIT_DECLARATION_V1

## 1. 本轮问题说明

园区负责人关键操作（创建草稿、提交审核、查看检查结论、工单咨询等）需可追溯；正式提交平台审核前须勾选责任声明，明确园区侧与平台侧责任边界。

**边界：** 不重构权限系统、不接入真实审计后端、不改 Runtime 数据结构、不改接口。

---

## 2. 园区关键操作日志设计

**文件：** `apps/admin/park-admin/shared/park-operation-log.js`

- 存储：`localStorage` key `park_admin_operation_logs_v1`
- 内置 seed 日志 4 条 + 页面操作动态追加
- API：`ParkOperationLog.appendLog()` / `getLogs()` / `renderTimeline()`

**记录操作类型（至少）：**

创建活动草稿 · 保存活动草稿 · 提交平台审核 · 查看发布检查结论 · 提交工单咨询 · （可扩展：修改活动、再次提交审核）

---

## 3. 正式提交活动前声明机制

**页面：** `park_admin_activity_publish_check/index.html`（`?mode=review` 时显示）

**标题：** 提交前确认

**三条复选框**（须全部勾选方可提交）：

1. 已核对活动信息真实完整
2. 知悉进入平台发布检查、未通过不上线
3. 确认真实协作意向并愿意配合修改

**声明版本号：** `PARK_ACTIVITY_SUBMIT_DECLARATION_V1`（写入提交日志 `declarationVersion`）

**补充说明：** 平台审核通过不替代园区侧真实性确认责任

---

## 4. 提交按钮禁用与勾选规则

- 默认：三条均未勾选 →「提交平台审核」`disabled`
- 全部勾选后：按钮可点击
- 点击提交：生成日志，`declarationAccepted: true`，按钮变为「已提交（Mock）」

**验收：** `PARK_ACTIVITY_SUBMIT_DECLARATION_REQUIRED = YES` · `PARK_ACTIVITY_SUBMIT_BUTTON_DISABLED_UNTIL_DECLARED = YES`

---

## 5. 日志字段设计

| 字段 | 说明 |
|------|------|
| logId | 唯一标识 |
| timestamp | 操作时间 |
| operatorName / operatorRole | 操作人 |
| parkName | 园区名称 |
| activityId / activityName | 关联活动 |
| actionType | 操作类型 |
| beforeStatus / afterStatus | 状态变化 |
| declarationAccepted | 是否确认声明 |
| declarationVersion | 声明版本 |
| summary | 操作摘要 |
| sourcePage | 来源页面 |
| deviceInfoPlaceholder / ipPlaceholder | Mock 占位 |

---

## 6. 活动详情页日志展示

**模块：** 最近操作记录（最近 5 条）

**示例格式：**

`2026-06-20 15:42｜园区负责人｜提交平台审核｜草稿 → 待平台审核`

**路径：** `park_admin_activity_detail/index.html`

---

## 7. 发布检查页日志展示

**模块：** 审核与提交记录

展示：提交审核、平台检查返回、声明确认（提交时）、查看结论等时间线。

**路径：** `park_admin_activity_publish_check/index.html`

---

## 8. 工单日志联动

**路径：** `park_admin_tickets/index.html`

- 工单表增加「关联活动」列
- 「工单相关操作记录」展示 `提交工单咨询` 类日志
- 新建工单（Mock）追加日志

---

## 9. 与发布检查语义联动

参见 `PARK_ACTIVITY_CHECK_SEMANTIC_FIX_V1.md`：

- `?mode=review` — 上线前发布检查 + 声明 + 提交
- `?mode=history` — 历史检查结论，无提交区
- 进行中活动访问 `?status=ACTIVE` — 提示返回详情，不混用运营巡检

---

## 10. 共享样式

`backoffice.css` 新增：

- `bo-declaration-card` / `bo-declaration-check` / `bo-declaration-text`
- `bo-audit-log` / `bo-audit-log-item` / `bo-log-meta` / `bo-log-summary`
- `bo-review-history` / `bo-submit-guard` / `bo-activity-actions`

---

## 11. 修改文件清单

| 文件 | 变更 |
|------|------|
| `shared/park-operation-log.js` | **新增** 操作日志 mock store |
| `shared/park-activity-status.js` | **新增** 发布检查状态判断 |
| `park_admin_activity_new/index.html` | 保存草稿写日志 |
| `park_admin_activity_detail/index.html` | 最近操作记录 + 状态化按钮 |
| `park_admin_activity_publish_check/index.html` | 声明卡片、提交守卫、审核记录 |
| `park_admin_tickets/index.html` | 工单操作记录、关联活动 |
| `park_admin_activities/index.html` | 活动列表操作与发布检查语义对齐 |
| `shared/backoffice.css` | 声明与日志样式 |

---

## 12. 不改动项

- Runtime 数据结构、业务接口、权限底层逻辑
- 真实审计后端、电子签章、法律合同
- 平台超管页面

---

## 13. 风险点

| 风险 | 缓解 |
|------|------|
| localStorage 仅本地演示 | 文档标注 Mock；结构可对接 API |
| 多次打开发布检查页重复「查看结论」日志 | 使用 `sessionStorage` 单次会话记录 |
| 声明勾选无后端校验 | Phase 1 前端守卫 + 日志留痕 |

---

## 14. 验收页面清单

| 页面 | 验收要点 |
|------|----------|
| `park_admin_activity_publish_check/?mode=review` | 声明未勾选按钮禁用；勾选后可提交；日志追加 |
| `park_admin_activity_detail/` | 进行中无发布检查主按钮；有最近操作记录 |
| `park_admin_activity_new/` | 保存草稿生成日志 |
| `park_admin_tickets/` | 工单操作记录可见 |

---

## 15. 验收标记

```
PARK_ADMIN_OPERATION_AUDIT_AND_SUBMIT_DECLARATION_V1_CREATED = YES
PARK_ACTIVITY_SUBMIT_DECLARATION_REQUIRED = YES
PARK_ACTIVITY_SUBMIT_BUTTON_DISABLED_UNTIL_DECLARED = YES
PARK_ADMIN_OPERATION_LOG_READY = YES
PARK_ACTIVITY_OPERATION_LOG_VISIBLE = YES
PARK_REVIEW_SUBMISSION_LOG_VISIBLE = YES
PARK_DECLARATION_VERSION_RECORDED = YES
DO_NOT_CHANGE_RUNTIME_DATA = CONFIRMED
DO_NOT_REBUILD_PRODUCT_LOGIC = CONFIRMED
READY_FOR_PARK_ADMIN_FINAL_BROWSER_REVIEW = YES
```

---

*文档版本：V1 · 2026-06-16*
