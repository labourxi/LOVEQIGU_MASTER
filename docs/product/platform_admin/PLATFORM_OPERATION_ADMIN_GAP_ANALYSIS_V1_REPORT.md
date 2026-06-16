# PLATFORM_OPERATION_ADMIN_GAP_ANALYSIS_V1_REPORT

# 平台运营后台缺口分析执行报告 V1

```yaml
task_id: PLATFORM_OPERATION_ADMIN_GAP_ANALYSIS_V1
executor: Cursor
date: 2026-06-07
status: COMPLETE
output: docs/product/platform_admin/PLATFORM_OPERATION_ADMIN_GAP_ANALYSIS_V1.md
constraints:
  - 不修改代码
  - 不修改 Runtime
  - 不修改 Release
  - 只做分析
```

---

# 1. 任务执行摘要

| 项 | 结果 |
|----|------|
| 审查范围 | `apps/admin/` · `docs/product/` · `docs/content-engine/` · `runtime/` |
| 分析维度 | 6 中心（商家审核/活动审核/发布/全平台数据/工单/风控） |
| 优先级框架 | P0 上线必须 · P1 3 个月内 · P2 后续优化 |
| 输出文档 | `PLATFORM_OPERATION_ADMIN_GAP_ANALYSIS_V1.md` |
| 成功标记 | `PLATFORM_OPERATION_ADMIN_GAP_ANALYSIS_V1_COMPLETE = YES` |

---

# 2. 审查方法

1. **实现枚举** — 扫描 `apps/admin/` 全部 HTML；确认无 `platform-admin/` 目录
2. **产品规格对照** — `MERCHANT_EVENT_ENGINE_V1` §12 · `LOVEQIGU_FIRST_EVENT_ADMIN_CONFIG_V1` §12–§15 · `MERCHANT_PORTAL_AND_PARK_ADMIN_V1` §5.3/§7.3/§8.3
3. **双端缺口衔接** — 读取 `MERCHANT/PARK *_GAP_ANALYSIS_V1`，确认平台为双端 P0 依赖项
4. **数据层对照** — 枚举 `data/`；确认无 `platform_admin/` 或 `merchant_event/`
5. **域边界审查** — 区分 content-engine/runtime（内容工厂）与 operation_admin（活动运营）
6. **运营场景验收** — 以爱企谷首场活动平台侧流程为基准

---

# 3. 关键发现

## 3.1 实现现状：全空

| 类别 | 商家端 | 园区端 | **平台端** |
|------|--------|--------|-----------|
| HTML 页面 | 9 mock | 7 mock | **0** |
| data schema | 5 | 5 | **0** |
| API | 0 | 0 | **0** |
| 登录/RBAC | 0 | 0 | **0** |

`apps/admin/index.html` 仅为 **Merchant & Park Admin MVP hub**，标题与导航均无 EVENT_OPERATION_CENTER。

## 3.2 产品规格：完整

EVENT_OPERATION_CENTER 12 子模块已在 `MERCHANT_EVENT_ENGINE_V1.md` 定义；审核规则、发布检查 13 项、数据看板三类报告已在 `ADMIN_CONFIG` 定义；TECH 文档已规划 8 条 admin API 路由与 T5 任务。

## 3.3 content-engine / runtime：不同域

| 资产 | 结论 |
|------|------|
| `runtime/dashboard/dashboard.json` | 内容工厂指标；**不可**作活动运营看板 |
| `APPROVAL_CONSOLE_V1` | 视觉资产审核；模式可参考，**不可复用** |
| `runtime_publish_status: BLOCKED` | 内容 Release 门禁；与活动发布**无关** |

避免将 content-engine 审核控制台误当作 platform operation_admin。

---

# 4. 六中心缺口统计

| 中心 | P0 项 | P1 项 | P2 项 | 当前可用度 |
|------|-------|-------|-------|-----------|
| 商家审核中心 | 9 | 3 | 1 | **0%** |
| 活动审核中心 | 8 | 3 | 2 | **0%** |
| 发布中心 | 8 | 3 | 3 | **0%** |
| 全平台数据中心 | 6 | 6 | 1 | **0%** |
| 工单中心 | 5 | 4 | 2 | **0%** |
| 风险控制中心 | 4 | 5 | 2 | **~5%**（park 规则 schema only） |

**合计 P0：40 项 · 当前可运行：0 项**

---

# 5. 三端阻塞链

```text
商家提交卡券 ──┐
商家申请参与 ──┼──→ [平台审核 ❌] ──→ [发布 ❌] ──→ C端领取 ❌ ──→ 数据/风控 ❌
园区提交活动 ──┘
```

园区端自上次审查已新增：
- `park_admin_activity_new`
- `park_admin_activity_publish_check`

但平台端 **仍无任何对应收件与处理页面**，阻塞加剧（上游 mock 增多、下游仍为零）。

---

# 6. 与双端缺口分析衔接

| 双端 P0 依赖 | 平台对应模块 | 平台状态 |
|-------------|-------------|----------|
| 卡券审核 | 商家审核中心 | ❌ |
| 活动提交审核 | 活动审核中心 | ❌ |
| 活动发布 | 发布中心 | ❌ |
| 本园区数据（真实） | 全平台数据中心（聚合源） | ❌ |
| 工单平台处理 | 工单中心 | ❌ |
| 高领取低核销建议 | 风险控制中心 | ❌ |

**联合结论：** 商家 + 园区 + 平台三端 P0 中，**平台端为最长阻塞路径**。

---

# 7. TECH 任务建议（仅建议，本次未执行）

| 优先级 | 任务 | 产出 |
|--------|------|------|
| 1 | T1 MERCHANT_EVENT_DATA_SCHEMA_V1 | audit_log · stats_daily · platform_admin_dashboard_summary |
| 2 | T2 API_SKELETON | `/api/admin/*` |
| 3 | **T5 PLATFORM_EVENT_ADMIN_MVP_V1** | 6 中心最小 8 页 |
| 4 | T6 MINIAPP claim/redemption | 平台数据非零前提 |
| 5 | 风控规则引擎 v1 | HIGH_CLAIM_LOW_REDEEM |

**T5 最小验收（TECH §11.3）：**

```text
□ 可以审核商家、卡券、活动申请
□ 可以发布 / 暂停 / 结束活动
□ 可以查看商家、园区、活动总数据
□ 可以代核销兜底
```

本次审查 **额外补充** 用户要求的：工单中心 · 风险控制中心 · 回滚（P1 待规格化）。

---

# 8. 风险清单

| 风险 | 等级 | 说明 |
|------|------|------|
| 三端 mock 先行、平台滞后 | 🔴 | 待审对象堆积，无法闭环 |
| content-engine 与 operation_admin 混用 | 🟠 | 错误复用 APPROVAL_CONSOLE |
| 活动发布写入 runtime release | 🔴 | 须严格域隔离 |
| 无 rollback 规格 | 🟡 | 用户要求；P1 需产品补定义 |
| C 端 claim 未通 | 🔴 | 平台数据中心永远为零 |
| Canon 红线（信物/DC/权益混用） | 🔴 | 审核中心 P0 须内置规则 |

---

# 9. 输出物清单

| 文件 | 状态 |
|------|------|
| `docs/product/platform_admin/PLATFORM_OPERATION_ADMIN_GAP_ANALYSIS_V1.md` | ✅ 已生成 |
| `docs/product/platform_admin/PLATFORM_OPERATION_ADMIN_GAP_ANALYSIS_V1_REPORT.md` | ✅ 本文件 |

---

# 10. 完成确认

```yaml
PLATFORM_OPERATION_ADMIN_GAP_ANALYSIS_V1_COMPLETE: YES
report_generated: 2026-06-07
code_changes: NONE
runtime_changes: NONE
release_changes: NONE
```

---

# 11. 三端缺口总览（供决策）

| 端 | 页面 mock | 核心 P0 缺口 | 阻塞关系 |
|----|-----------|-------------|----------|
| 商家 | 9 页 | 登录·卡券创建·核销页·API | 产出待审对象 |
| 园区 | 7 页 | 登录·活动创建·提交审核·API | 产出待审对象 |
| **平台** | **0 页** | **6 中心全部** | **枢纽阻塞** |

**建议决策：** 并行 T2 API 骨架时，**T5 平台后台优先级不低于 T3/T4**；无平台则双端 mock 无法验收。
