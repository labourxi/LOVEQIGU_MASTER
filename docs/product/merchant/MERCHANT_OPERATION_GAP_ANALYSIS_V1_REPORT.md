# MERCHANT_OPERATION_GAP_ANALYSIS_V1_REPORT

# 商家端运营缺口分析执行报告 V1

```yaml
task_id: MERCHANT_OPERATION_GAP_ANALYSIS_V1
executor: Cursor
date: 2026-06-07
status: COMPLETE
output: docs/product/merchant/MERCHANT_OPERATION_GAP_ANALYSIS_V1.md
constraints:
  - 不修改代码
  - 不修改页面
  - 不修改 Runtime
  - 不修改 Release
```

---

# 1. 任务执行摘要

| 项 | 结果 |
|----|------|
| 审查范围 | `docs/product/merchant/` · `apps/admin/merchant-portal/` · `data/merchant_portal/` |
| 分析维度 | 8 模块（卡券/核销/财务/账单/工单/帮助/账号/运营数据） |
| 优先级框架 | P0 上线必须 · P1 3 个月内 · P2 后续优化 |
| 输出文档 | `MERCHANT_OPERATION_GAP_ANALYSIS_V1.md` |
| 成功标记 | `MERCHANT_OPERATION_GAP_ANALYSIS_V1_COMPLETE = YES` |

---

# 2. 审查方法

1. **产品规格对照** — 读取 `MERCHANT_AND_PARK_ADMIN_MVP_SCOPE_REFINEMENT_V1.md`、schema/page skeleton/interaction 文档
2. **实现对照** — 枚举 `apps/admin/merchant-portal/` 全部 HTML 页面与导航结构
3. **数据对照** — 核对 `data/merchant_portal/` schema 与 mock 覆盖字段
4. **运营场景对照** — 以 `LOVEQIGU_FIRST_EVENT_CASE_V1` 商家侧流程（提交卡券 → 核销 → 看数据 → 续费决策）为验收基准
5. **技术方案对照** — 参考 `docs/tech/merchant_event/MERCHANT_PORTAL_AND_PARK_ADMIN_V1.md` 中 RBAC/API 规划

---

# 3. 关键发现

## 3.1 已有资产（可复用）

- 7 页商家端静态 mock 页面（dashboard / coupons / coupon_detail / finance / account / tickets / help）
- 5 个 JSON schema + mock（profile · coupon · redemption_record · bill · ticket）
- 完整 MVP 产品规格与 Review Gates

## 3.2 核心缺口（P0 汇总）

| # | 缺口 | 影响 |
|---|------|------|
| 1 | 无登录页 / 无 RBAC | 无法区分商家身份 |
| 2 | 无卡券创建/提交/审核 UI + API | 招商闭环断裂 |
| 3 | **无独立核销页**（扫码/输码） | 店员无法现场操作 |
| 4 | 零后端 API，全部为硬编码 mock | 数据不可信 |
| 5 | 无活动申请模块 | 商家无法报名参与 |
| 6 | 工单无真实提交表单 | 异常无法上报 |
| 7 | 运营数据无真实聚合 | 老板无法复盘 |

## 3.3 模块缺口统计

| 模块 | P0 项 | P1 项 | P2 项 | 当前可用度 |
|------|-------|-------|-------|-----------|
| 卡券管理 | 8 | 2 | 2 | ~15%（只读 mock） |
| 核销管理 | 6 | 3 | 1 | ~5%（help 文字 only） |
| 财务管理 | 2 | 3 | 2 | ~30%（只读 mock） |
| 账单管理 | 1 | 4 | 0 | ~25% |
| 工单管理 | 2 | 4 | 1 | ~10% |
| 帮助中心 | 4 | 2 | 1 | ~60%（静态内容） |
| 账号管理 | 3 | 2 | 2 | ~20% |
| 运营数据 | 4 | 4 | 0 | ~25% |

---

# 4. 与 TECH 方案差异说明

`MERCHANT_PORTAL_AND_PARK_ADMIN_V1.md` §3.1 记录「商家/园区后台应用不存在」。**本次审查更新：**

- 自该文档编写后，已新增 **静态 mock 页面 + data schema**
- 但 **API / 登录 / 核销实操 / 卡券生命周期** 仍为零，TECH 结论方向不变
- 建议 TECH 文档下一版将 §3.1 更新为「mock 骨架存在，无运行时能力」

---

# 5. 建议下一步（仅建议，本次未执行）

```text
T1  MERCHANT_EVENT_DATA_SCHEMA_V1 — 统一 schema 落盘
T2  merchant-portal API 骨架
T3  登录 + RBAC
T4  卡券 CRUD + 审核流
T5  核销页（扫码/输码）
T6  dashboard 真实 stats
T7  活动申请 + 工单提交
```

---

# 6. 风险与依赖

| 风险 | 说明 |
|------|------|
| C 端权益中心只读 | 卡券领取 API 未接入，商家「已领取」数据无法真实 |
| 平台审核未建 | 卡券/活动审核依赖 platform operation_admin |
| 首场时间压力 | P0 项约 10 个跨模块能力，需并行 API + 双端 UI |

---

# 7. 完成确认

```yaml
MERCHANT_OPERATION_GAP_ANALYSIS_V1_COMPLETE: YES
report_generated: 2026-06-07
artifacts:
  - docs/product/merchant/MERCHANT_OPERATION_GAP_ANALYSIS_V1.md
  - docs/product/merchant/MERCHANT_OPERATION_GAP_ANALYSIS_V1_REPORT.md
code_changes: NONE
page_changes: NONE
runtime_changes: NONE
release_changes: NONE
```
