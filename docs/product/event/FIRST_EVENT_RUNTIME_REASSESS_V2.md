# FIRST_EVENT_RUNTIME_REASSESS_V2

# 爱企谷初见寻宝节 · 真实上线准备度再评估 V2

```yaml
project: LOVEQIGU / AR游伴
event: 爱企谷初见寻宝节
event_code: LOVEQIGU_FIRST_EVENT_CASE_V1
session: B会话｜TECH / 运营审查
version: V2
status: REASSESS_COMPLETE
owner: TECH / Operation
date: 2026-06-07
baseline: FIRST_EVENT_READINESS_REFRESH_V1 (38%)
constraints:
  - 禁止修改代码
  - 仅分析与评估
upstream:
  - docs/product/event/T5_COUPON_CLAIM_V1.md
  - docs/product/event/MINIMUM_EVENT_RUNTIME_PATH_PHASE2_V1.md
  - docs/product/USER_PROGRESS_STORE_AUDIT_V1.md
  - docs/product/event/EVENT_RUNTIME_SMOKE_TEST_V1.md
  - docs/product/merchant/MERCHANT_REDEMPTION_CENTER_V1.md
  - docs/product/event/FIRST_EVENT_READINESS_REFRESH_V1.md
```

---

## 1. 再评估结论（Executive Summary）

| 指标 | REFRESH V1 | **REASSESS V2** | 变化 |
|------|------------|----------------|------|
| **工程完成度** | 48% | **56%** | **+8%** |
| **运营完成度** | 34% | **41%** | **+7%** |
| **上线准备度** | 38% | **47%** | **+9%** |
| **是否可对外真实上线** | 否 | **否** | — |
| **E2E 用户全流程** | 未测 | **FAIL**（冒烟 0%） | — |

**一句话：** T5 领券原型、Phase2 状态引擎、商家核销 Mock 显著补齐 **脚本层与 B 端演示能力**；但 **小程序仍零 API、进度 Store 碎片化、C→B 券码不联通**，距真实微信端上线仍有 substantial gap。

```text
距 MINIMUM MVP 目标（78%）：尚差 31 个百分点
```

---

## 2. V2 新增输入 · _since REFRESH V1_

| 交付物 | 状态 | 对准备度贡献 |
|--------|------|-------------|
| **T5_COUPON_CLAIM_V1** | ✅ COMPLETE | HTML 领券页 + Python 脚本 + `data/user_mock/` |
| **MINIMUM_EVENT_RUNTIME_PATH_PHASE2_V1** | ✅ COMPLETE | `event_state_engine.py` · `EVENT_RUNTIME_PATH_PASS` |
| **MERCHANT_REDEMPTION_CENTER_V1** | ✅ COMPLETE | B 端核销列表/详情 Mock |
| **USER_PROGRESS_STORE_AUDIT_V1** | ✅ COMPLETE | 揭示 9 key 分裂 · 统一 Store 设计提案 |
| **EVENT_RUNTIME_SMOKE_TEST_V1** | ✅ COMPLETE | E2E 六步 FAIL · 分段 22 pass |

---

## 3. 三项完成度重算

### 3.1 工程完成度 · 56%

**定义：** 相对 `MINIMUM_EVENT_RUNTIME_PATH` Phase 1+2 工程范围的实现比例。

| 权重域 | V1 | **V2** | 变化依据 |
|--------|-----|--------|----------|
| 平台工程（schema + UI + API 读） | 73% | **73%** | 无变化 |
| 数据层（MEE seed + lifecycle + user_mock + runtime progress） | 59% | **68%** | +user_mock · runtime/user_progress.json |
| API 写链路 + HTTP 服务 | 8% | **20%** | +Phase2 file-backed write engine；仍无 HTTP POST |
| B 端 merchant / park | 26% | **42%** | +核销中心 2 页 · redemption-store |
| C 端 miniapp + 静态原型 | 28% | **32%** | +T4 HTML 活动页 · T5 HTML 领券；小程序未接 |
| 工厂自动化 | 31% | **31%** | 无变化 |
| 验证 / 脚本 / tooling | 80% | **88%** | +phase2 test · coupon scripts · smoke test |
| **加权合计** | **48%** | **56%** | **+8%** |

### 3.2 运营完成度 · 41%

**定义：** 真实运营链路可执行比例（含可培训级 Mock 演示，不含微信生产）。

| 环节 | V1 | **V2** | 说明 |
|------|-----|--------|------|
| 商家运营 | 15% | **35%** | 核销中心可 Mock 培训；仍无真实扫码 |
| 园区运营 | 32% | **32%** | 无变化 |
| 平台运营 | 55% | **55%** | 审核/发布 Mock 可演示 |
| 发布执行 | 35% | **35%** | Mock Publish/Block；C 端不可见 |
| 用户参与 | 28% | **32%** | 静态 HTML 活动页；小程序无入口 |
| 卡券领取 | 10% | **30%** | T5 浏览器领券 + 脚本；**非微信小程序** |
| 卡券核销 | 8% | **38%** | Admin Mock 核销；与 C 端券码孤立 |
| 活动结束 | 25% | **28%** | lifecycle mock + phase2 状态文件 |
| 数据统计 | 30% | **32%** | API 读 + runtime progress 可读 |
| **平均** | **34%** | **41%** | **+7%** |

### 3.3 上线准备度 · 47%

**公式：** 工程完成度 × 40% + 运营完成度 × 60%

```text
56% × 0.4 + 41% × 0.6 = 22.4% + 24.6% = 47.0%
```

**保守口径说明：** 若卡券领取/核销仅计「微信生产可用」，运营完成度降至 ~36%，上线准备度约 **42%**。本报告取 **含 Mock 可培训演示** 口径 **47%**。

---

## 4. B01–B06 再评估

| ID | Blocker | REFRESH V1 | **REASSESS V2** | 关键证据 |
|----|---------|------------|-----------------|----------|
| **B01** | 零 HTTP API / B-C 无法联通 | 部分解除 | **部分解除** ↑ | +Phase2 `event_state_engine.py` 文件写；仍无 HTTP 服务 · 无 POST · 小程序零 `wx.request` |
| **B02** | 平台 operation_admin UI 不存在 | 已解除 | **已解除** | platform-admin 4 页 + hub 不变 |
| **B03** | 活动发布执行链路不存在 | 部分解除 | **部分解除** | publish Mock + localStorage；C 端发布可见性仍断 |
| **B04** | C 端无 merchant-event 活动专页 | 未解除 | **部分解除** ↑ | `pages/merchant-event/` 3 页静态 HTML；**app.json 仍无路由** |
| **B05** | 权益中心领取接口未接入 | 未解除 | **部分解除** ↑ | T5 `coupon-center.html` + `claim_coupon.py`；**小程序 rights-center 仍「尚未接入」** |
| **B06** | 商家端无核销页 | 未解除 | **部分解除** ↑ | `merchant_redemptions` + detail · localStorage Mock |

### 汇总

```text
已解除：    1 项（B02）
部分解除：  5 项（B01 · B03 · B04 · B05 · B06）
未解除：    0 项（全量生产级）
```

**解读：** 六核心 Blocker **无一达到生产级全解**；但 V1→V2 有 **4 项从「未解除」升为「部分解除」**（B04/B05/B06 + B01 加深）。真实上线仍需 Phase-3：**HTTP + 小程序接入 + 统一 Store + C↔B 券码总线**。

---

## 5. 进度 Store 与链路审计（USER_PROGRESS_STORE 视角）

| Store | 位置 | 与活动链路关系 |
|-------|------|----------------|
| `runtime/user_progress/user_progress.json` | Phase2 引擎 | ✅ 脚本层 complete→relic→coupon→claim |
| `data/user_mock/user_coupon*.json` | T5 领券 | ✅ 脚本/页面可写 |
| `loveqigu_user_coupons` (localStorage) | coupon-center.html | ⚠️ 浏览器 isolated |
| `merchant_redemption_mock_state_v1` | B 端 Admin | ⚠️ 预设 claim_time，非 C 触发 |
| 小程序 wx.storage（5 key） | miniapp | ❌ 无活动/task/relic/coupon 域 |

**结论：** Phase2 与 T5 各自闭环，**三轨 Store 未统一**（USER_PROGRESS_STORE_AUDIT G01–G07 仍成立）。

---

## 6. 冒烟测试对照（EVENT_RUNTIME_SMOKE_TEST）

| Step | V2 工程资产 | V2 用户可走完 |
|------|-------------|---------------|
| 进入活动页 | ✅ HTML 静态页 | ⚠️ 浏览器 only |
| 查看探索点 | ✅ exploration.html | ⚠️ 无进度写入 |
| 完成任务 | ✅ Phase2 脚本 | ❌ 无 UI 按钮 |
| 获得信物 | ✅ Phase2 脚本 | ❌ 无 UI 反馈 |
| 领取卡券 | ✅ T5 HTML / 脚本 | ⚠️ 非小程序 |
| 商家核销 | ✅ Admin Mock | ⚠️ 与 C 端孤立 |

**E2E 用户全流程：** ❌ **仍 FAIL**（与 V1 冒烟结论一致）

---

## 7. 剩余阻塞 Top 10

| Rank | Blocker | 域 | 关联 ID | 严重度 |
|------|---------|-----|---------|--------|
| **1** | 无 HTTP Server + POST API（claim / verify / task_complete） | 工程 | B01 | 🔴 Critical |
| **2** | 小程序无 merchant-event 路由 · 零 `wx.request` | C 端 | B04 | 🔴 Critical |
| **3** | 小程序 rights-center 未接 T5 领券链路 | C 端 | B05 | 🔴 Critical |
| **4** | 统一 User Progress Store 未实现（9 key 分裂） | 架构 | G01–G07 | 🔴 Critical |
| **5** | C 端领券 ↔ B 端核销无 `coupon_code` 总线 | 联通 | B05+B06 | 🔴 Critical |
| **6** | Phase2 状态引擎未接入任何 UI / API | 工程 | — | 🟠 High |
| **7** | 活动发布 → C 端可见性链路断裂 | 运营 | B03 | 🟠 High |
| **8** | merchant-event 页无任务完成交互 · 探索进度不写入 | C 端 | — | 🟠 High |
| **9** | 无微信 openid / 用户身份 · 无法多用户运营 | 身份 | — | 🟠 High |
| **10** | Visual Factory `runtime_publish_status: BLOCKED` · 活动物料自动化不可用 | 工厂 | — | 🟡 Medium |

---

## 8. 真实上线判定

| 判定项 | 结果 |
|--------|------|
| 可对外真实上线（微信小程序） | ❌ **NO** |
| 可内部 Mock 全流程培训演示 | ⚠️ **PARTIAL**（需人工切换 HTML / Admin / 脚本） |
| 可平台侧审核发布 Mock 演示 | ✅ **YES** |
| 可商家核销操作 Mock 培训 | ✅ **YES** |
| Phase2 脚本层状态链验证 | ✅ **YES**（`EVENT_RUNTIME_PATH_PASS`） |

---

## 9. 建议下一步（Phase-3 最小集）

按阻塞优先级：

1. 实现 `loveqigu_user_progress_v1` 统一 Store（合并 Phase2 + T5 + 小程序）
2. 小程序注册 merchant-event 页 + rights-center 接 claim
3. HTTP Server 挂载 router + POST claim/verify/task
4. `coupon_code` 贯通 C 领券 → B 核销
5. 活动 PUBLISHED 后 C 端可见开关

**预估：** 再 +20~25 个百分点可达 **68–72%**；距 78% MVP 仍差一轮 RBAC + 埋点 + 探索任务 UI。

---

## 10. 完成确认

```yaml
FIRST_EVENT_RUNTIME_REASSESS_V2_COMPLETE: YES
engineering_completion: 56%
operational_completion: 41%
launch_readiness: 47%
blockers_fully_resolved: 1
blockers_partially_resolved: 5
blockers_unresolved_full: 0
e2e_user_flow: FAIL
real_wechat_launch: NO
```
