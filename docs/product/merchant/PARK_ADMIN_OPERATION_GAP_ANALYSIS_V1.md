# PARK_ADMIN_OPERATION_GAP_ANALYSIS_V1

# 景区/园区负责人端运营缺口分析 V1

```yaml
project: LOVEQIGU / AR游伴
session: B会话｜TECH / 运营审查
module: Park Admin
version: V1
status: APPROVED_FOR_GAP_ANALYSIS
owner: TECH / Operation
date: 2026-06-07
audit_scope:
  - docs/product/merchant/
  - apps/admin/park-admin/
  - data/park_admin/
upstream:
  - docs/product/merchant/MERCHANT_AND_PARK_ADMIN_MVP_SCOPE_REFINEMENT_V1.md
  - docs/product/merchant_event_engine/LOVEQIGU_FIRST_EVENT_ADMIN_CONFIG_V1.md
  - docs/tech/merchant_event/MERCHANT_PORTAL_AND_PARK_ADMIN_V1.md
perspective: 真实景区/园区运营负责人（组织活动、协调商家、看数据、向领导汇报）
```

---

# 1. 审查结论摘要

| 维度 | 现状 | 缺口等级 |
|------|------|----------|
| 文档与 Schema | ✅ 5 个 park schema + mock | 活动/商家/看板字段基本定义 |
| 页面骨架 | ⚠️ 5 页静态 HTML mock | **无真实交互与 API** |
| 后端 / API | ❌ 不存在 | **P0 阻塞上线** |
| 登录与园区隔离 | ❌ 无登录、无 park_id scope | **P0 阻塞上线** |
| 活动创建/申请 | ❌ 无新建页 | **P0** |
| 活动发布/审核流 | ⚠️ scope 有状态机，UI 无操作 | **P0** |
| 商家邀请/管理 | ⚠️ 列表 mock | P0 需可操作 |
| 数据看板 | ⚠️ dashboard mock | P0 需真实聚合 |
| 报告导出 | ❌ | P1 |
| 平台运营统计 | ❌ 园区端不应有；需平台侧 | 见 §3.8 |

**一句话：** 园区后台 **「能看一张样例报表，不能组织一场真活动」**；距首场活动，核心缺 **登录、活动申请/配置、发布检查、商家协同、真实数据 API**。

---

# 2. 现有资产盘点

## 2.1 文档（`docs/product/merchant/`）

| 文件 | 作用 |
|------|------|
| `MERCHANT_AND_PARK_ADMIN_MVP_SCOPE_REFINEMENT_V1.md` | 园区模块、活动状态、优化规则、Review Gates |
| `PARK_ADMIN_MVP_SCHEMA_V1.md` | 5 对象 schema |
| `PARK_ADMIN_MVP_PAGE_SKELETON_V1.md` | 5 页骨架 |
| `PARK_ADMIN_MVP_INTERACTION_V1.md` | mock 交互 |

## 2.2 页面（`apps/admin/park-admin/`）

| 页面 | 存在 | 能力 |
|------|------|------|
| `park_admin_dashboard` | ✅ | mock 园区总览 + TOP 商家 + 建议 |
| `park_admin_merchants` | ✅ | mock 商家列表 |
| `park_admin_activities` | ✅ | mock 活动列表 |
| `park_admin_activity_detail` | ✅ | mock 活动详情 + 关联卡券/商家 |
| `park_admin_tickets` | ✅ | mock 工单 |
| `park_login` | ❌ | **缺失** |
| `park_activities/new-request` | ❌ | **缺失**（发起活动/需求） |
| `park_merchants/:id` | ❌ | **缺失**（商家详情） |
| `park_stats` | ❌ | **缺失**（独立分析页） |
| `park_reports` | ❌ | **缺失**（导出） |
| `park_settings` | ❌ | **缺失** |

## 2.3 数据（`data/park_admin/`）

| Schema | Mock | 说明 |
|--------|------|------|
| `park_activity` | ✅ | 活动主记录 |
| `park_activity_merchant_link` | ✅ | 活动-商家 |
| `park_activity_coupon_link` | ✅ | 活动-卡券 |
| `park_admin_dashboard_summary` | ✅ | 看板快照 |
| `rule_based_optimization_suggestion` | ✅ | 规则建议 |

**缺失 schema：** `park_activity_application` · `park_merchant_profile` · `park_stats_daily` · `park_report_export` · `park_audit_log`

---

# 3. 分模块缺口分析

## 3.1 商家管理

| 能力 | 现状 | 优先级 | 说明 |
|------|------|--------|------|
| 所属园区商家列表 | ⚠️ mock | **P0** | 仅本 `park_id` |
| 商家合作状态 | ❌ 列表无字段 | **P0** | 待邀约/进行中/待续费 |
| 参与活动数 / 卡券数 | ⚠️ 部分 mock | **P0** | |
| 领取/核销数据 per 商家 | ❌ 列表无 | **P0** | 园区判断商家表现 |
| 商家详情页 | ❌ | P1 | 联系人、卡券、核销趋势 |
| 邀请商家（录入/发链接） | ❌ | **P0** | 首场需招商 3–5 家 |
| 推荐商家参与活动 | ❌ | P1 | |
| 低活跃商家标记 | ⚠️ scope 有规则 | P1 | 联动 optimization_suggestion |
| 商家资料审核查看 | ❌ | P1 | 平台审，园区可看状态 |

## 3.2 活动管理

| 能力 | 现状 | 优先级 | 说明 |
|------|------|--------|------|
| 活动列表（状态/时间） | ⚠️ mock | **P0** | |
| 活动详情（商家/卡券/数据） | ⚠️ mock | **P0** | |
| **新建活动 / 活动需求** | ❌ 无页面 | **P0** | ADMIN_CONFIG 要求绑定探索点/任务 |
| 编辑活动基础信息 | ❌ | **P0** | 名称/时间/规则 |
| 选择参与商家 | ❌ | **P0** | `park_activity_merchant_link` |
| 绑定卡券 | ❌ | **P0** | `park_activity_coupon_link` |
| 暂停/结束活动 | ❌ | P1 | 平台或授权园区操作 |
| 活动模板一键创建 | ❌ | P1 | 月度寻宝/首场样板 |
| 探索点/任务配置 | ❌ | **P0** | 依赖 ADMIN_CONFIG；当前 park UI 无 |
| 活动资产占位（信物/DC） | ❌ | P1 | 可平台代配 |

## 3.3 活动发布

| 能力 | 现状 | 优先级 | 说明 |
|------|------|--------|------|
| 发布前检查清单 | ⚠️ scope §7 有规则 | **P0** | 名称/时间/商家/卡券/平台检查 |
| 提交发布申请 | ❌ | **P0** | 园区不直接 publish（TECH 方案） |
| 预发布/正式发布状态 | ❌ UI | **P0** | |
| 生成活动二维码/入口 | ❌ | **P0** | 线下物料依赖 |
| 暂停/下线 | ❌ | P1 | |
| 越权发布拦截 | ❌ 无 API | **P0** | park_admin 不能绕过平台 |

## 3.4 活动审核

| 能力 | 现状 | 优先级 | 说明 |
|------|------|--------|------|
| 园区提交 → 平台审核 | ❌ | **P0** | 首场活动必经 |
| 查看审核状态/驳回原因 | ❌ | **P0** | |
| 修改后重新提交 | ❌ | P1 | |
| 活动文案/资产审核进度 | ❌ | P1 | 平台侧为主；园区只读 |
| 商家卡券审核状态汇总 | ❌ | **P0** | 园区需知哪些商家卡券未过审 |

**说明：** 「活动审核」执行主体是 **平台 operation_admin**；园区端 P0 需 **提交 + 查看状态**；完整审核 UI 在平台后台（本分析标注为园区依赖项 P0）。

## 3.5 活动效果分析

| 能力 | 现状 | 优先级 | 说明 |
|------|------|--------|------|
| 活动访问/参与人数 | ❌ | **P0** | 向园区领导汇报核心 |
| 任务完成人数/完成率 | ❌ | **P0** | |
| 探索点热度 | ❌ | P1 | 依赖 C 端埋点 |
| 卡券领取/核销/转化率 | ⚠️ 列表有 mock | **P0** | |
| 活动维度 dashboard | ⚠️ detail 页 mock | **P0** | |
| 规则化优化建议 | ⚠️ mock 1 条 | P1 | HIGH_CLAIM_LOW_REDEEM 等 |
| 同比/环比 | ❌ | P2 | |
| 用户分享次数 | ❌ | P2 | |

## 3.6 商家数据统计

| 能力 | 现状 | 优先级 | 说明 |
|------|------|--------|------|
| 园区商家总数/活跃/参与 | ⚠️ dashboard mock | **P0** | |
| 整体核销率 | ⚠️ mock | **P0** | |
| TOP / 低活跃商家 | ⚠️ mock | P1 | |
| 按商家排行导出 | ❌ | P1 | |
| 单商家 drill-down | ❌ | P1 | |

## 3.7 平台运营统计

| 能力 | 现状 | 优先级 | 说明 |
|------|------|--------|------|
| 跨园区总览 | ❌ 不应在 park 端 | — | **平台 admin 职责** |
| 本园区在平台中排名 | ❌ | P2 | 可选 |
| 平台活动模板使用率 | ❌ | P2 | 平台侧 |

**园区端 P0 对应项：** 本园区 **完整运营快照**（§3.5 + §3.6），而非全平台统计。全平台统计缺口记入 **平台后台 P0 依赖**（见 REPORT）。

## 3.8 工单管理

| 能力 | 现状 | 优先级 | 说明 |
|------|------|--------|------|
| 查看商家工单 | ⚠️ scope 有定义 | P1 | |
| 回复商家工单 | ❌ | P1 | |
| 向平台提交工单 | ⚠️ 页面占位 | **P0** | 活动配置/发布/数据异常 |
| 工单关联活动/商家 | ❌ | P1 | |
| 更新工单状态 | ❌ | P1 | |

---

# 4. 跨模块 P0 缺口（上线必须）

```text
1. 园区负责人登录 + park_id 数据隔离
2. 园区概览 dashboard（真实 API：商家数/参与/领取/核销/核销率）
3. 商家列表：本园区商家 + 合作状态 + 基础数据
4. 活动列表 + 活动详情
5. 活动需求/创建：名称、时间、目标、商家、卡券绑定（表单 + API）
6. 提交平台审核 + 查看审核状态
7. 发布前检查（scope §7 五项）+ 平台发布后的「已发布/进行中」可见
8. 活动效果：参与/完成/领取/核销（至少 4 指标真实）
9. 向平台提交工单（活动/数据/商家协调类）
10. 后端 API + 与商家端/平台端数据一致
11. 平台侧：活动/卡券/商家审核 + 发布（园区 P0 依赖）
```

---

# 5. P1（3 个月内）

```text
- 活动模板一键创建 · 暂停/结束
- 商家详情 · 邀请链接 · 推荐参与
- 探索点热度 · 7 日趋势 · 规则化建议完整规则集
- CSV/Markdown 报告导出（园区版/领导汇报版）
- 工单回复 · 关联活动/商家
- 商家低活跃预警 · TOP 排行
- 活动复盘页（结构对齐 FIRST_EVENT_CASE §20）
- 预发布二维码预览
- 单商家 drill-down 统计
```

---

# 6. P2（后续优化）

```text
- 跨园区对比 · 平台排名
- 复杂活动编排（多路线/排行榜/抽奖）
- AI 活动优化建议
- 自动招商邮件/短信
- 与景区票务/客流系统对接
- 多园区账号体系
- PDF 精美报告 · 领导驾驶舱
```

---

# 7. 真实园区运营场景对照

| 场景 | 当前能否完成 | 缺口 |
|------|-------------|------|
| 负责人组织「爱企谷初见寻宝节」 | ❌ | 活动创建 + 商家绑定 |
| 查看哪些商家已提交卡券 | ❌ | 商家管理 + 审核状态 |
| 提交活动给平台审核上线 | ❌ | 申请 + 审核流 |
| 活动进行中看每天参与/核销 | ⚠️ mock | 真实 stats API |
| 向领导汇报活动效果 | ❌ | 导出报告 |
| 某商家核销太低，协调优化 | ⚠️ 有建议 mock | 真实数据 + 商家联系 |
| 活动结束后要复盘和续费建议 | ❌ | 复盘模板 + 数据 |

---

# 8. 与 ADMIN_CONFIG / Review Gates 对齐

来源：`LOVEQIGU_FIRST_EVENT_ADMIN_CONFIG_V1` · `MERCHANT_AND_PARK_ADMIN_MVP_SCOPE_REFINEMENT_V1` §7

| 检查项 | 要求 | 当前 |
|--------|------|------|
| 活动名称 | 必填 | ❌ 无表单 |
| 活动时间 | 必填 | ❌ |
| 关联商家 | 必填 | ❌ |
| 关联卡券 | 必填 | ❌ |
| 平台发布检查 | 必填 | ❌ |
| 探索点绑定 | ADMIN_CONFIG §6 | ❌ park UI 无 |
| 任务链配置 | ADMIN_CONFIG §7 | ❌ |
| 园区越权发布 | 禁止 | ✅ 无发布按钮 |

---

# 9. 园区 vs 平台职责边界（缺口归属）

| 能力 | 园区端 | 平台端 | 当前 |
|------|--------|--------|------|
| 创建活动草稿/需求 | ✅ P0 | — | ❌ |
| 审核活动/卡券/商家 | 只读状态 P0 | 执行 P0 | ❌ |
| 发布活动 | ❌ | ✅ P0 | ❌ |
| 代核销 | ❌ | ✅ P1 | ❌ |
| 全平台统计 | ❌ | ✅ P0 | ❌ |
| 本园区统计 | ✅ P0 | — | ⚠️ mock |

---

# 10. 建议实施顺序（园区端）

```text
Phase A（P0）
  API + 登录 + dashboard 真实数据 + 商家列表

Phase B（P0 · 首场活动）
  活动创建/申请 → 商家/卡券绑定 → 提交审核 → 发布状态可见

Phase C（P0 · 依赖平台）
  平台审核 UI + 发布 + 活动二维码生成

Phase D（P1）
  报告导出 · 优化建议 · 工单闭环 · 复盘页
```

---

# 11. 当前结论

```text
PARK_ADMIN_OPERATION_GAP_ANALYSIS_V1_COMPLETE = YES
```

**核心判断：** 园区后台 mock 覆盖了 **看板/列表/详情雏形**，但 **无法完成活动组织闭环**；且 **强依赖平台审核发布 API**。首场活动前须补齐 §4 P0，并同步建设 **平台 operation_admin 审核发布能力**。
