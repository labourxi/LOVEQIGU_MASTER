# FIRST_EVENT_OPERATION_FLOW_AUDIT_V1

# 爱企谷初见寻宝节 · 完整运营流程审计 V1

```yaml
project: LOVEQIGU / AR游伴
event: 爱企谷初见寻宝节
event_code: LOVEQIGU_FIRST_EVENT_CASE_V1
session: B会话｜TECH / 运营审查
version: V1
status: APPROVED_FOR_FLOW_AUDIT
owner: TECH / Operation
date: 2026-06-07
audit_perspective: 真实运营完整链路（非文档完备度）
upstream:
  - docs/product/merchant_event_engine/LOVEQIGU_FIRST_EVENT_CASE_V1.md
  - docs/product/merchant_event_engine/LOVEQIGU_FIRST_EVENT_ADMIN_CONFIG_V1.md
  - docs/product/event/FIRST_EVENT_RUNTIME_READINESS_AUDIT_V1.md
  - docs/product/merchant/MERCHANT_OPERATION_GAP_ANALYSIS_V1.md
  - docs/product/merchant/PARK_ADMIN_OPERATION_GAP_ANALYSIS_V1.md
  - docs/product/platform_admin/PLATFORM_OPERATION_ADMIN_GAP_ANALYSIS_V1.md
  - docs/product/platform_admin/PLATFORM_ADMIN_MVP_SCHEMA_V1.md
constraints:
  - 不修改代码 / Runtime / Release
```

---

# 1. 审计结论

| 项 | 结论 |
|----|------|
| **完整运营链路是否可跑通** | **否** |
| **上线准备度** | **20%** |
| **总体评级** | **NOT READY** |
| **较 RUNTIME 审计变化** | +2%（新增 `data/merchant_event/` seed + `data/platform_admin/` schema） |

**一句话：** 运营流程 **「文档与 seed 已对齐爱企谷，执行链路全断」** — 商家/园区/平台三方无法完成一次真实的「提交→审核→发布→参与→领券→核销→结束→统计」闭环。

---

# 2. 评分标准

| 评级 | 定义 |
|------|------|
| **READY** | 该环节真实运营可执行，无需人工兜底 |
| **PARTIAL** | 有文档/mock/seed/局部 UI；不可闭环或仅演示 |
| **BLOCKED** | 核心能力缺失，该环节阻塞下游 |

---

# 3. 运营链路逐步审计

## 链路总览

```text
商家 → 园区 → 平台 → 发布 → 用户参与 → 卡券领取 → 卡券核销 → 活动结束 → 数据统计
```

| # | 环节 | 评级 | 完成度 | 关键证据 |
|---|------|------|--------|----------|
| 1 | **商家** | **BLOCKED** | 15% | 9 页 mock；无 login/卡券创建/核销页/API |
| 2 | **园区** | **PARTIAL** | 32% | 7 页 mock + activity_new/publish_check；无提交 API |
| 3 | **平台** | **PARTIAL** | 22% | `data/platform_admin/` 5 schema+mock；**零 UI/API** |
| 4 | **发布** | **BLOCKED** | 8% | `platform_release` mock 存在；无 publish 执行 |
| 5 | **用户参与** | **PARTIAL** | 28% | explore-map 通用壳；无活动专页/二维码 |
| 6 | **卡券领取** | **BLOCKED** | 10% | 权益中心：**「领取接口尚未接入」** |
| 7 | **卡券核销** | **BLOCKED** | 8% | 无核销页/API；help 仅文字 |
| 8 | **活动结束** | **BLOCKED** | 10% | Lifecycle 文档完整；无 end/archive 执行 |
| 9 | **数据统计** | **PARTIAL** | 25% | 三端 dashboard mock + platform summary mock |

**链路加权平均：20%**

---

## 3.1 环节 1：商家

**评级：BLOCKED**

| 运营动作 | 状态 | 系统 |
|----------|------|------|
| 商家入驻/登录 | ❌ | Merchant Portal |
| 提交卡券「爱企谷初见到店礼」 | ❌ | Merchant Portal |
| 查看审核状态 | ❌ | Merchant Portal |
| 申请参与爱企谷初见寻宝节 | ❌ | Merchant Portal |
| 店员培训（核销说明） | ⚠️ | merchant_help 静态 |

**数据对齐：** `data/merchant_event/coupon_template.mock.json` 已有 seed，但 **与 merchant-portal mock 未联通**。

---

## 3.2 环节 2：园区

**评级：PARTIAL**

| 运营动作 | 状态 | 系统 |
|----------|------|------|
| 创建「爱企谷初见寻宝节」 | ⚠️ | park_admin_activity_new mock |
| 绑定 3–5 家商家 | ⚠️ | park_admin_merchants mock |
| 绑定卡券 | ⚠️ | park_activity_coupon_link mock |
| 发布前 5 项检查 | ⚠️ | park_admin_activity_publish_check |
| 提交平台审核 | ❌ | 无 API |
| 查看活动数据 | ⚠️ | park_admin_dashboard mock |

**数据对齐：** `data/merchant_event/activity.mock.json` 活动名一致；园区 UI **未读取 merchant_event seed**。

---

## 3.3 环节 3：平台

**评级：PARTIAL**

| 运营动作 | 状态 | 系统 |
|----------|------|------|
| 商家资料审核队列 | ⚠️ | platform_merchant_review mock |
| 卡券审核队列 | ⚠️ | platform_coupon_review mock |
| 活动审核队列 | ⚠️ | platform_activity_review mock |
| 审核通过/驳回操作 | ❌ | 无 UI/API |
| 工单处理 | ❌ | 无 platform ticket |
| 风控告警 | ❌ | 无 risk center |

**进展（较前期审计）：** `PLATFORM_ADMIN_MVP_SCHEMA_V1` 已落地 schema+mock；**apps/admin/platform-admin/ 仍不存在**。

---

## 3.4 环节 4：发布

**评级：BLOCKED**

| 运营动作 | 状态 | 系统 |
|----------|------|------|
| ADMIN_CONFIG §13 发布前 13 项检查 | ❌ | 无 gate 执行 |
| 预发布 / 正式发布 | ❌ | platform_release mock only |
| 活动二维码生成 | ❌ | — |
| C 端入口可见性切换 | ❌ | — |
| 暂停 / 下线 | ❌ | release_status 枚举有，无操作 |

**Event Lifecycle 当前态：** `activity.mock.json` → `status: DRAFT`（未进入待审核/已发布）。

---

## 3.5 环节 5：用户参与

**评级：PARTIAL**

| 运营动作 | 状态 | 系统 |
|----------|------|------|
| 扫码进入活动页 | ❌ | 无 pages/merchant-event |
| 完成 3 个爱企谷探索点 | ⚠️ | explore-map 有 CH 通用节点；**无爱企谷专属 4 点** |
| 获得「企谷初见印」活动信物 | ❌ | merchant_event 无 event_relic seed |
| 获得「爱企谷初见纪念藏品」 | ⚠️ | activity_asset.mock 有 event_dc seed；**C 端未接入** |
| 任务进度记录 | ⚠️ | activity_task.mock 1 条；无 runtime |

**CASE §19：** 活动页 / 二维码 / 探索点 — **3 项中 0 项 READY**。

---

## 3.6 环节 6：卡券领取

**评级：BLOCKED**

| 运营动作 | 状态 | 系统 |
|----------|------|------|
| 完成任务后领取卡券 | ❌ | 无 claim API |
| 权益中心展示 user_coupon | ❌ | rights-center 静态 rights.v1 |
| 限领/库存扣减 | ❌ | coupon_template seed 有 stock；无 runtime |
| 出示核销码 | ❌ | — |

**C 端明确阻塞：** `rights-center/index.js` — 「领取接口尚未接入」。

---

## 3.7 环节 7：卡券核销

**评级：BLOCKED**

| 运营动作 | 状态 | 系统 |
|----------|------|------|
| 店员扫码/输码核销 | ❌ | 无 merchant redemption 页 |
| 核销校验（本店/有效期/未核销） | ❌ | 无 API |
| 平台代核销兜底 | ❌ | TECH 规划未实现 |
| 核销记录写入 | ❌ | coupon_redemption_record mock 未联通 |

---

## 3.8 环节 8：活动结束

**评级：BLOCKED**

| 运营动作 | 状态 | 系统 |
|----------|------|------|
| 平台/园区结束活动 | ❌ | 无 end API |
| 状态流转 → 已结束 → 复盘中 → 已归档 | ❌ | ADMIN_CONFIG §5.3 仅文档 |
| 停止新领取/新参与 | ❌ | — |
| 历史活动可查 | ⚠️ | mock 可展示 DRAFT |

---

## 3.9 环节 9：数据统计

**评级：PARTIAL**

| 运营动作 | 状态 | 系统 |
|----------|------|------|
| 全平台 5 核心指标 | ⚠️ | platform_dashboard_summary mock |
| 园区活动数据 | ⚠️ | park_admin_dashboard mock |
| 商家领取/核销 | ⚠️ | merchant_dashboard mock |
| stats_daily 聚合 | ❌ | 未建 |
| 复盘报告（商家/园区/内部） | ❌ | CASE §20 结构仅文档 |
| CASE 核心验收「商家是否续费」 | ❌ | 无真实数据证据 |

---

# 4. 八大系统域审计

| 系统域 | 评级 | 完成度 | 说明 |
|--------|------|--------|------|
| **Merchant Portal** | **PARTIAL** | 22% | 9 mock 页；无 login/创建/核销/API |
| **Park Admin** | **PARTIAL** | 30% | 7 mock 页；activity_new/publish_check 可达 |
| **Platform Admin** | **PARTIAL** | 20% | schema+mock ✅；UI/API ❌ |
| **Merchant Event Engine** | **PARTIAL** | 38% | 6 份产品 doc + `data/merchant_event/` 5 对象 seed |
| **Event Lifecycle** | **PARTIAL** | 18% | 11 态状态机文档化；runtime 停于 DRAFT |
| **Visual Factory** | **PARTIAL** | 35% | 管道存在；活动视觉/MATERIALS 未产出 |
| **Content Factory** | **PARTIAL** | 28% | Orchestrator 框架；无首场活动 content job |
| **Release** | **BLOCKED** | 10% | `runtime_publish_status: BLOCKED`；活动 release 路径未建 |

**系统域加权平均：25%**（链路 20% × 60% + 系统 25% × 40% ≈ **22%**；报告取 **20%** 保守值）

---

# 5. Event Lifecycle 对照

来源：`ADMIN_CONFIG_V1` §5.3

| 状态 | 文档 | 当前 runtime |
|------|------|--------------|
| 草稿 | ✅ | ✅ `activity.mock status=DRAFT` |
| 配置中 | ✅ | ⚠️ seed 部分（缺 event_relic、3 探索点 task） |
| 待审核 | ✅ | ❌ |
| 审核通过 | ✅ | ❌ |
| 预发布 | ✅ | ❌ |
| 已发布 | ✅ | ❌ |
| 进行中 | ✅ | ❌ |
| 已结束 | ✅ | ❌ |
| 复盘中 | ✅ | ❌ |
| 已归档 | ✅ | ❌ |

**Lifecycle 执行就绪：1 / 10 态 · BLOCKED**

---

# 6. Merchant Event Engine 数据层

`data/merchant_event/` 现状：

| 对象 | Schema | Mock | 首场对齐 |
|------|--------|------|----------|
| activity | ✅ | ✅ 爱企谷初见寻宝节 | ✅ |
| activity_task | ✅ | ⚠️ 仅 1 条入口任务 | 缺 3 探索点 |
| activity_asset | ✅ | ⚠️ 仅 event_dc | **缺企谷初见印 event_relic** |
| coupon_template | ✅ | ✅ 爱企谷初见到店礼 | ✅ |
| merchant_binding | ✅ | ⚠️ 仅 1 家咖啡馆 | 缺 3–5 家 |

**结论：** seed 层 PARTIAL；**未接入 miniapp / admin / API**。

---

# 7. TOP20_BLOCKERS

按 **运营链路顺序 × 阻塞严重度** 排序：

| # | Blocker | 评级 | 阻塞环节 | 说明 |
|---|---------|------|----------|------|
| **B01** | **零 HTTP API / B-C 端无法联通** | **BLOCKED** | 全链路 | TECH T2 未启动 |
| **B02** | **平台 operation_admin UI 不存在** | **BLOCKED** | 平台·发布 | 仅有 schema，无审核/发布页 |
| **B03** | **活动发布执行链路不存在** | **BLOCKED** | 发布·用户参与 | publish → 二维码 → C 端可见 |
| **B04** | **C 端无 merchant-event 活动专页** | **BLOCKED** | 用户参与 | app.json 无路由 |
| **B05** | **权益中心领取接口未接入** | **BLOCKED** | 卡券领取 | rights-center 明确文案 |
| **B06** | **商家端无核销页（扫码/输码）** | **BLOCKED** | 卡券核销 | 店员最高频操作缺失 |
| **B07** | **商家端无登录 + 卡券创建/提交** | **BLOCKED** | 商家 | 招商闭环起点断裂 |
| **B08** | **merchant_event seed 未接入 runtime** | **BLOCKED** | 全链路 | JSON 存在但 services 不读 |
| **B09** | **Event Lifecycle 停在 DRAFT** | **BLOCKED** | 发布·结束 | 无状态机执行 |
| **B10** | **爱企谷 3+1 探索点未配置 C 端** | **BLOCKED** | 用户参与 | activity_task 仅 1 条 |
| **B11** | **活动信物「企谷初见印」seed 缺失** | **BLOCKED** | 用户参与 | activity_asset 无 event_relic |
| **B12** | **园区无法真实提交平台审核** | **BLOCKED** | 园区→平台 | activity_new 无 API |
| **B13** | **平台审核操作 UI/API 不存在** | **BLOCKED** | 平台 | review mock 无处理入口 |
| **B14** | **stats_daily / 埋点 / 复盘数据为零** | **BLOCKED** | 数据统计 | CASE 续费验收无证据 |
| **B15** | **Release 双 BLOCKED** | **BLOCKED** | 发布 | content runtime + 活动 release 均未通 |
| **B16** | **Visual 活动物料未生产** | **PARTIAL** | 用户参与·线下 | MATERIALS_V1 未产出 |
| **B17** | **merchant_binding 仅 1 家商家** | **PARTIAL** | 商家·园区 | CASE 要求 3–5 家 |
| **B18** | **活动结束/归档流程不存在** | **BLOCKED** | 活动结束 | 无 end/archive API |
| **B19** | **平台工单/风控中心不存在** | **BLOCKED** | 平台·核销异常 | 现场问题无处理入口 |
| **B20** | **三端 mock 数据未统一 ID 源** | **PARTIAL** | 全链路 | merchant_portal / park / platform / merchant_event ID 不一致 |

---

# 8. 链路阻塞图

```mermaid
flowchart LR
  M[商家 BLOCKED] --> K[园区 PARTIAL]
  K --> P[平台 PARTIAL]
  P --> R[发布 BLOCKED]
  R --> U[用户参与 PARTIAL]
  U --> C[卡券领取 BLOCKED]
  C --> X[卡券核销 BLOCKED]
  X --> E[活动结束 BLOCKED]
  E --> D[数据统计 PARTIAL]

  style M fill:#a4412b,color:#fff
  style K fill:#b26b1b,color:#fff
  style P fill:#b26b1b,color:#fff
  style R fill:#a4412b,color:#fff
  style U fill:#b26b1b,color:#fff
  style C fill:#a4412b,color:#fff
  style X fill:#a4412b,color:#fff
  style E fill:#a4412b,color:#fff
  style D fill:#b26b1b,color:#fff
```

**首个 HARD BLOCK：** B07 商家无法提交 → 后续即使平台就绪也无卡券可审。

**枢纽 HARD BLOCK：** B02/B03 平台无法审核发布 → 用户永远无法参与。

---

# 9. CASE §19 执行前检查（流程视角）

| # | 检查项 | 评级 |
|---|--------|------|
| 1 | 活动页可打开 | **BLOCKED** |
| 2 | 活动二维码可扫码 | **BLOCKED** |
| 3 | 3 个探索点可完成 | **PARTIAL** |
| 4 | 活动信物可发放 | **BLOCKED** |
| 5 | 卡券可领取 | **BLOCKED** |
| 6 | 卡券可核销 | **BLOCKED** |
| 7 | 商家知道如何核销 | **PARTIAL** |
| 8 | 线下海报可摆放 | **BLOCKED** |
| 9 | 工作人员知道说明 | **PARTIAL** |
| 10 | 后台可看基础数据 | **PARTIAL** |

**READY：0 · PARTIAL：4 · BLOCKED：6**

---

# 10. 较前期审计进展

| 资产 | RUNTIME 审计 | 本审计 |
|------|-------------|--------|
| `data/platform_admin/` | ❌ | ✅ 5 schema + mock |
| `data/merchant_event/` | ❌ | ✅ 5 schema + seed |
| Platform 域完成度 | 0% | 20% |
| Merchant Event Engine | ~28% | 38% |
| **总上线准备度** | **18%** | **20%** |

**实质变化：** 数据 seed 层前进；**运营执行层仍全断**。

---

# 11. 最小可跑通路径（建议，未执行）

```text
1. T2 API + merchant_event seed 加载
2. T5 平台审核/发布 UI（绑定 platform_admin mock）
3. T3 商家 login + 卡券提交 + 核销页
4. T4 园区 activity_new → 提交审核 API
5. T6 C端 merchant-event + claim → 权益中心
6. 补全 activity_task ×4 + activity_asset event_relic
7. stats_daily 最小埋点
8. 活动 end + 复盘 CSV 导出（可人工兜底）
```

---

# 12. 最终判定

```yaml
event: 爱企谷初见寻宝节
operation_flow_ready: NO
readiness_percent: 20
overall_rating: NOT_READY
flow_stage_ratings:
  merchant: BLOCKED
  park: PARTIAL
  platform: PARTIAL
  publish: BLOCKED
  user_participation: PARTIAL
  coupon_claim: BLOCKED
  coupon_redemption: BLOCKED
  event_end: BLOCKED
  data_stats: PARTIAL
system_ratings:
  merchant_portal: PARTIAL
  park_admin: PARTIAL
  platform_admin: PARTIAL
  merchant_event_engine: PARTIAL
  event_lifecycle: PARTIAL
  visual_factory: PARTIAL
  content_factory: PARTIAL
  release: BLOCKED
top_blockers: 20
FIRST_EVENT_OPERATION_FLOW_AUDIT_V1_COMPLETE: YES
```

**运营建议：** 解除 **B01–B06** 前，不得对外宣布活动上线；当前可用于 **文档对齐演示 + seed 数据评审**。
