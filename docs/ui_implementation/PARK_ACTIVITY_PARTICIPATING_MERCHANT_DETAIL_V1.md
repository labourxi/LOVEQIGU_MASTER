# PARK_ACTIVITY_PARTICIPATING_MERCHANT_DETAIL_V1

## 1. 本轮问题说明

园区后台活动页仅显示「爱企谷咖啡 等 5 家」摘要，园区负责人无法查看每家商家的礼遇配置、发放领取核销数据与协作状态。

**目标：** 在现有 mock / 静态后台中，将摘要升级为可审查的「参与商家明细」面板，不改 Runtime 数据、不改接口。

---

## 2. 参与商家明细展示目标

园区负责人应能一眼看到：

1. 参与商家名单
2. 每家发放 / 领取 / 核销 / 核销率
3. 卡券名称与礼遇内容
4. 参与状态（活跃 / 表现较好 / 需关注等）
5. 联系人脱敏信息
6. 协作操作入口

---

## 3. 商家字段设计

| 字段 | 展示 |
|------|------|
| 商家名称 | 卡片标题 |
| 业态 | 元信息行 |
| 参与状态 | 中文徽章 |
| 发放 / 领取 / 核销 / 核销率 | 右侧统计块 |
| 卡券名称 / 礼遇内容 | 中部列表 |
| 有效期 | 卡券区底部 |
| 联系人 | 脱敏（138****0000） |
| 操作 | 查看商家数据、提交协作工单 |

**实现：** `apps/admin/park-admin/shared/park-activity-merchants.js`

---

## 4. 卡券内容展示设计

每家商家展示 1~3 条卡券摘要，格式：

`卡券名｜礼遇内容｜发放 N｜领取 N｜核销 N｜核销率 N%｜状态`

多张卡券时超过 3 条显示「另有 N 张卡券（Mock 折叠）」。

示例商家「爱企谷咖啡」含 2 张卡券；「探索书屋」含 1 张。

**验收：** `PARK_ACTIVITY_MERCHANT_COUPON_DETAIL_VISIBLE = YES`

---

## 5. 默认显示前 10 家规则

- `PAGE_SIZE = 10`
- 参与商家 ≤ 10：全部展示，无分页控件
- 参与商家 > 10：默认第 1 页展示前 10 家

当前 mock 活动 `activity_001` 含 **12 家**商家，用于验收分页。

**验收：** `PARK_ACTIVITY_MERCHANT_DEFAULT_SHOW_TOP_10 = YES`

---

## 6. 分页 / 查看更多规则

超过 10 家时显示：

- 分页信息：`第 1 / N 页 · 每页 10 家`
- 按钮：上一页 / 下一页（边界隐藏）

文档记录完整分页需求：

`PARK_ACTIVITY_MERCHANT_PAGINATION_REQUIRED = YES`

**验收：** `PARK_ACTIVITY_MERCHANT_PAGINATION_OR_MORE_READY = YES`

---

## 7. 状态中文化说明

| 内部码 | 中文 |
|--------|------|
| ACTIVE | 活跃 |
| EXCELLENT | 表现较好 |
| NORMAL | 正常 |
| WARNING | 需关注 |
| INACTIVE | 未活跃 |
| PENDING | 待确认 |
| WITHDRAWN | 已退出 |

**简单规则（mock）：**

- 核销率 ≥ 30% → 表现较好
- 领取 ≥ 50 且核销率 < 15% → 需关注
- 核销率 < 10% → 需关注
- 其余按参与状态映射

**验收：** `PARK_ACTIVITY_MERCHANT_STATUS_READABLE = YES`

---

## 8. 修改文件清单

| 文件 | 变更 |
|------|------|
| `shared/park-activity-merchants.js` | **新增** mock 数据 + 渲染 + 分页 |
| `park_admin_activity_detail/index.html` | 参与商家明细面板（替换摘要） |
| `park_admin_activities/index.html` | 数据看板 Tab 增加参与商家明细 |
| `park_admin_merchants/index.html` | 增加跳转活动商家明细说明 |
| `shared/backoffice.css` | `bo-merchant-panel` / `bo-merchant-participant-card` 样式 |

---

## 9. 不改动项

- Runtime 数据结构、业务接口、权限逻辑
- 后台架构、大型 UI 框架、复杂 BI

---

## 10. 风险点

| 风险 | 缓解 |
|------|------|
| mock 商家数与活动卡片摘要数字不完全一致 | 活动卡片已更新为 12 家；汇总数字为演示值 |
| 卡券详情无独立详情页 | 卡片内展示完整摘要 + 商家数据入口 |
| 分页仅前端 mock | 结构可对接 API 分页参数 |

---

## 11. 验收页面清单

| 页面 | 验收要点 |
|------|----------|
| `park_admin_activities/` 数据看板 | 参与商家明细模块、前 10 家、分页 |
| `park_admin_activity_detail/` | 完整明细面板、卡券内容、状态中文 |
| `park_admin_merchants/` | 引导至活动商家明细 |

---

## 12. 验收标记

```
PARK_ACTIVITY_PARTICIPATING_MERCHANT_DETAIL_V1_CREATED = YES
PARK_ACTIVITY_PARTICIPATING_MERCHANTS_VISIBLE = YES
PARK_ACTIVITY_MERCHANT_COUPON_DETAIL_VISIBLE = YES
PARK_ACTIVITY_MERCHANT_DEFAULT_SHOW_TOP_10 = YES
PARK_ACTIVITY_MERCHANT_PAGINATION_OR_MORE_READY = YES
PARK_ACTIVITY_MERCHANT_PAGINATION_REQUIRED = YES
PARK_ACTIVITY_MERCHANT_STATUS_READABLE = YES
PARK_ACTIVITY_MERCHANT_NO_MORE_ONLY_SUMMARY = YES
DO_NOT_CHANGE_RUNTIME_DATA = CONFIRMED
DO_NOT_REBUILD_PRODUCT_LOGIC = CONFIRMED
READY_FOR_PARK_ADMIN_FINAL_BROWSER_REVIEW = YES
```

---

*文档版本：V1 · 2026-06-16*
