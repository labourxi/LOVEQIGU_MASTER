# FIRST_EVENT_READINESS_REFRESH_V1

# 爱企谷初见寻宝节 · 上线准备度刷新评估 V1

```yaml
project: LOVEQIGU / AR游伴
event: 爱企谷初见寻宝节
event_code: LOVEQIGU_FIRST_EVENT_CASE_V1
session: B会话｜TECH / 运营审查
version: V1
status: APPROVED_FOR_READINESS_REFRESH
owner: TECH / Operation
date: 2026-06-07
baseline: FIRST_EVENT_OPERATION_FLOW_AUDIT_V1 (20%)
upstream:
  - docs/product/event/FIRST_EVENT_OPERATION_FLOW_AUDIT_V1.md
  - docs/product/event/MINIMUM_EVENT_RUNTIME_PATH_V1.md
  - docs/product/platform_admin/PLATFORM_ADMIN_MVP_SCHEMA_V1.md
  - docs/product/platform_admin/PLATFORM_ADMIN_MVP_UI_V1.md
  - docs/product/event/T2_API_BACKBONE_V1.md
  - docs/product/event/EVENT_LIFECYCLE_ENGINE_V1.md
constraints:
  - 不修改代码 / Runtime / Release
  - 仅分析与评估
```

---

# 1. 刷新结论（Executive Summary）

| 指标 | 上次审计 | **本次刷新** | 变化 |
|------|----------|-------------|------|
| **工程完成度** | ~25% | **48%** | +23% |
| **运营完成度** | ~20% | **34%** | +14% |
| **上线准备度** | **20%** | **38%** | **+18%** |
| **是否可对外上线** | 否 | **否** | — |

**一句话：** 近期成果显著补齐 **平台侧 schema + UI + 数据 seed + API 读骨架 + 生命周期引擎**；**C 端参与、领券、核销、写 API** 仍全断，尚不具备真实运营上线条件，但 **平台审核发布已可 mock 演示**。

---

# 2. 评估输入 · 八大域最新状态

| 评估输入 | 评级 | 工程完成度 | 运营可用度 | 关键资产 |
|----------|------|-----------|-----------|----------|
| **Platform Admin MVP UI** | ✅ 新增 | **85%** | **70%** | 5 页 + shared JS · mock 审批/发布 |
| **Platform Admin Schema** | ✅ 已有 | **100%** | — | 5 schema + mock · validate pass |
| **API Backbone** | ⚠️ 部分 | **35%** | **15%** | `server/api/` GET 11 路由 · 无 HTTP 服务 · 无 POST |
| **Merchant Event Engine** | ⚠️ 增强 | **68%** | **10%** | schema/mock/seed · relics/tasks/merchants 补全 |
| **Event Lifecycle** | ⚠️ 部分 | **50%** | **5%** | `lifecycle_engine.py` · 10 态 · mock 路径 · 未接入 |
| **Merchant Portal** | ⚠️ 停滞 | **22%** | **10%** | 9 mock 页 · 无 login/创建/核销 |
| **Park Admin** | ⚠️ 停滞 | **30%** | **15%** | 7 mock 页 · 无提交 API |
| **Content Factory** | ⚠️ 不变 | **28%** | **0%** | Orchestrator Phase1 · 无首场 job |
| **Visual Factory** | ⚠️ 不变 | **35%** | **0%** | `runtime_publish_status: BLOCKED` |

---

# 3. 三项完成度计算

## 3.1 工程完成度 · 48%

**定义：** 相对 `MINIMUM_EVENT_RUNTIME_PATH` Phase 1+2 工程范围的实现比例。

| 权重域 | 完成度 | 加权 |
|--------|--------|------|
| 平台工程（schema+UI+API读） | 73% | 18.3% |
| 数据层（MEE seed+lifecycle） | 59% | 14.8% |
| API 写链路 + HTTP 服务 | 8% | 1.6% |
| B 端 merchant/park | 26% | 3.9% |
| C 端 miniapp | 28% | 4.2% |
| 工厂自动化 | 31% | 1.5% |
| 验证/脚本/tooling | 80% | 4.0% |
| **合计** | | **48.3% → 48%** |

## 3.2 运营完成度 · 34%

**定义：** 真实运营链路可执行比例（非 mock 演示）。

| 环节 | 上次 | 本次 | 说明 |
|------|------|------|------|
| 商家 | 15% | 15% | 无变化 |
| 园区 | 32% | 32% | 无变化 |
| 平台 | 22% | **55%** | UI 可演示审核/发布 mock |
| 发布 | 8% | **35%** | mock Publish/Block 可见 |
| 用户参与 | 28% | 28% | 无 C 端活动页 |
| 卡券领取 | 10% | 10% | 未接入 |
| 卡券核销 | 8% | 8% | 无核销页 |
| 活动结束 | 10% | **25%** | lifecycle mock 有 FINISHED 路径 |
| 数据统计 | 25% | **30%** | API 可读 dashboard mock |
| **平均** | 20% | **34%** | |

## 3.3 上线准备度 · 38%

**公式：** 工程完成度 × 40% + 运营完成度 × 60%

```text
48% × 0.4 + 34% × 0.6 = 19.2% + 20.4% = 39.6% → 保守取 38%
```

**距 MINIMUM MVP 目标（78%）：尚差 40 个百分点**

---

# 4. B01–B06 阻塞刷新审查

| ID | Blocker | 上次 | **本次状态** | 说明 |
|----|---------|------|-------------|------|
| **B01** | 零 HTTP API / B-C 无法联通 | 未解除 | **部分解除** | `server/api/` 11 GET 路由 + mock_loader + 单测通过；**无 HTTP 服务、无 POST、未接 UI/C 端** |
| **B02** | 平台 operation_admin UI 不存在 | 未解除 | **已解除** | `apps/admin/platform-admin/` 4 页 + hub · login/reviews/publish/dashboard |
| **B03** | 活动发布执行链路不存在 | 未解除 | **部分解除** | publish 页 mock Publish/Block + localStorage；**无 C 端可见性、无真实 QR** |
| **B04** | C 端无 merchant-event 活动专页 | 未解除 | **未解除** | app.json 仍无路由 |
| **B05** | 权益中心领取接口未接入 | 未解除 | **未解除** | rights-center 文案未变 |
| **B06** | 商家端无核销页 | 未解除 | **未解除** | 无 redemption 页 |

### 汇总

```text
已解除：    1 项（B02）
部分解除：  2 项（B01 · B03）
未解除：    3 项（B04 · B05 · B06）
```

**六核心阻塞解除率：1/6 全解 + 2/6 部分 = 实际闭环仍阻塞**

---

# 5. B01–B06 专项分析

## B01 · API Backbone

| 维度 | 状态 |
|------|------|
| 已有 | `server/api/router.py` · mock_loader · 11 GET 端点 · unittest |
| 缺失 | HTTP server · POST claim/redeem/publish/review · RBAC · event_log 写入 |
| 判定 | **部分解除** — 读骨架就位，写链路为零 |

## B02 · Platform Admin UI

| 维度 | 状态 |
|------|------|
| 已有 | login/dashboard/reviews/publish · 三 Tab 审核 · 模拟审批/拒绝 · Publish/Block |
| 缺失 | 与 server API 联通（当前 localStorage mock） |
| 判定 | **已解除** — MVP mock 审核后台可点击演示 |

## B03 · 发布链路

| 维度 | 状态 |
|------|------|
| 已有 | publish 页 · platform_release mock · 模拟 PUBLISHED/BLOCKED |
| 缺失 | C 端 gate · 二维码生成 · lifecycle RUNNING 联动 |
| 判定 | **部分解除** — 平台侧 mock 发布可操作 |

## B04 · C 端活动页

| 维度 | 状态 |
|------|------|
| 已有 | explore-map 通用壳 · MEE seed 可读 via API GET |
| 缺失 | `pages/merchant-event/*` · 扫码入口 |
| 判定 | **未解除**

## B05 · 卡券领取

| 维度 | 状态 |
|------|------|
| 已有 | coupon_template seed · GET /api/event/* |
| 缺失 | POST claim · user_coupon · 权益中心对接 |
| 判定 | **未解除**

## B06 · 商家核销

| 维度 | 状态 |
|------|------|
| 已有 | merchant_help 文字 · coupon_redemption_record schema |
| 缺失 | merchant_redemptions 页 · verify API |
| 判定 | **未解除**

---

# 6. Phase-1 · 完成项

对照 `MINIMUM_EVENT_RUNTIME_PATH_V1` 阶段 1：

| # | 任务 | 状态 |
|---|------|------|
| 1 | 统一 `data/merchant_event/` seed | ✅ **完成** — activity/merchants/tasks/relics/coupons/bindings/exploration_points |
| 2 | API 骨架 + mock loader | ⚠️ **部分完成** — GET 路由；无 RBAC/POST/HTTP |
| 3 | merchant_event loader | ✅ **完成** — `server/api/mock_loader.py` |
| 4 | Event Lifecycle 状态机 | ⚠️ **部分完成** — engine + mock；未接入 runtime |
| 5 | 基础 event_log | ❌ **未完成** |
| 6 | validate 脚本 | ✅ **完成** — merchant_event · platform_admin · event_lifecycle |
| 7 | Platform Admin schema | ✅ **完成** |
| 8 | Platform Admin UI | ✅ **超额完成**（属 Phase 2 范围） |

**Phase-1 完成率：5/8 全完成 · 2/8 部分 · 1/8 未完成 ≈ 69%**

---

# 7. Phase-2 · 剩余项

| # | 剩余任务 | 优先级 | 解除 Blocker |
|---|----------|--------|--------------|
| 1 | HTTP API 服务 + POST 写端点 | P0 | B01 |
| 2 | C 端 merchant-event 2 页 | P0 | B04 |
| 3 | claim API + 权益中心对接 | P0 | B05 |
| 4 | merchant_redemptions + verify | P0 | B06 |
| 5 | merchant login 固定账号 | P0 | B07 |
| 6 | Platform UI ↔ server API 联通 | P1 | B01/B03 深化 |
| 7 | lifecycle 与 publish 联动 | P1 | B03/B09 |
| 8 | event_log 写入 | P1 | B14 |
| 9 | QR URL 生成 | P1 | B03 |
| 10 | Platform/Merchant/Park dashboard 读真实 log | P2 | B14 |

**Phase-2 剩余率：~75% 未完成**

---

# 8. Phase-3 · 上线前必须项

来源：CASE §19 + MINIMUM 阶段 3

| # | 必须项 | 当前 | Phase-3 前需达成 |
|---|--------|------|-----------------|
| 1 | 活动页可打开 | ❌ | B04 完成 |
| 2 | 二维码可扫码 | ❌ | B03 QR + B04 |
| 3 | 探索点可完成 | ⚠️ | C 端简化任务 |
| 4 | 活动信物可发放 | ⚠️ | seed 有企谷初见印 · 需 C 端 runtime |
| 5 | 卡券可领取 | ❌ | B05 |
| 6 | 卡券可核销 | ❌ | B06 |
| 7 | 商家核销培训 | ⚠️ | help + 现场培训 |
| 8 | 线下海报 | ❌ | B 类人工物料 |
| 9 | 工作人员说明 | ⚠️ | MERCHANT_SCRIPT 已有 |
| 10 | 后台可看真实数据 | ❌ | event_log + dashboard |
| 11 | 端到端演练 | ❌ | Phase 2 完成后 |
| 12 | Canon 红线检查 | ⚠️ | 发布前人工 |

**Phase-3 就绪：0/12 全绿 · 4 项可人工兜底**

---

# 9. 进展对照表（自上次审计）

| 成果 | 影响 |
|------|------|
| `PLATFORM_ADMIN_MVP_SCHEMA_V1` | 平台数据模型就位 |
| `PLATFORM_ADMIN_MVP_UI_V1` | **B02 解除** · 运营演示 +18% |
| `T2_API_BACKBONE_V1` | **B01 部分解除** · 工程 +8% |
| `merchant_event/*.seed.json` 扩展 | MEE 38%→68% · B11 部分解除 |
| `EVENT_LIFECYCLE_ENGINE_V1` | lifecycle 18%→50% |
| Merchant/Park/C端/Visual/Content | **无变化** |

---

# 10. 最小 MVP 距离

| 里程碑 | 准备度 | 状态 |
|--------|--------|------|
| 上次 FLOW 审计 | 20% | NOT READY |
| **本次刷新** | **38%** | NOT READY |
| Phase-1 目标 | 45% | **接近（69% Phase1 工程）** |
| Phase-2 目标 | 78% | **尚差 40pp** |
| 对外最小上线 | 78%+ | **需完成 B04/B05/B06 + API 写链路** |

---

# 11. 建议下一步（仅建议）

```text
P0 顺序：
  1. POST API（claim · verify · review · publish）+ HTTP 服务
  2. C 端 merchant-event 页
  3. merchant_redemptions 页
  4. 权益中心 claim 对接
  5. Phase-3 smoke test

并行：
  · Platform UI 切 server API（替换 localStorage）
  · lifecycle engine 接入 publish 流程
```

---

# 12. 成功标记

```yaml
event: 爱企谷初见寻宝节
engineering_completion: 48
operational_completion: 34
readiness_percent: 38
go_live_ready: NO
blockers:
  resolved: [B02]
  partial: [B01, B03]
  open: [B04, B05, B06]
FIRST_EVENT_READINESS_REFRESH_V1_COMPLETE: YES
```
