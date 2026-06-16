# EVENT_RUNTIME_SMOKE_TEST_V1_REPORT

# 爱企谷初见寻宝节 · 用户全流程冒烟测试执行报告 V1

```yaml
task_id: EVENT_RUNTIME_SMOKE_TEST_V1
executor: Cursor
date: 2026-06-07
mode: READ_ONLY_AUDIT
status: COMPLETE
event: 爱企谷初见寻宝节
event_code: LOVEQIGU_FIRST_EVENT_CASE_V1
```

---

## Result

**AUDIT COMPLETE — E2E FAIL / SEGMENT PASS**

---

## 执行摘要

对「进入活动页 → 探索点 → 任务 → 信物 → 领券 → 商家核销」六步流程进行了 **只读模拟审计**。

| 结论 | 说明 |
|------|------|
| **E2E 全流程** | ❌ 不可走通 |
| **分段资产** | ✅ 页面 / Mock 数据大量存在 |
| **状态流转** | ❌ Step 3–5 无 Runtime 写入 |
| **Mock 链路** | ❌ `bindings.seed.json` 无消费者 |

**一句话：** 工程侧已具备 **数据定义 + 静态页面 + B 端核销 Mock**；用户侧 **无法从参加活动一路走到被商家核销**，中间四步（任务完成、信物获得、卡券领取、C→B 联通）全部断裂。

---

## 逐步冒烟结果

| Step | 页面 | 数据 | 状态流转 | Mock 链路 | 段结论 |
|------|------|------|----------|-----------|--------|
| 1 进入活动页 | ⚠️ | ✅ | ❌ | ⚠️ | **PARTIAL** |
| 2 查看探索点 | ⚠️ | ✅ | ❌ | ⚠️ | **PARTIAL** |
| 3 完成任务 | ⚠️ | ✅ | ❌ | ❌ | **FAIL** |
| 4 获得信物 | ⚠️ | ✅ | ❌ | ❌ | **FAIL** |
| 5 领取卡券 | ⚠️ | ✅ | ❌ | ❌ | **FAIL** |
| 6 商家核销 | ✅ | ✅ | ✅* | ❌ | **PARTIAL** |

\* B 端 Admin localStorage 模拟，与 C 端无关。

---

## 通过项（22）

| # | 项 | 路径 / 说明 |
|---|-----|-------------|
| 1 | 活动入口静态页 | `pages/merchant-event/index.html` |
| 2 | 探索点列表页 | `pages/merchant-event/exploration.html` |
| 3 | 探索点详情页（可打开） | `pages/merchant-event/detail.html` |
| 4 | 活动 Mock | `data/merchant_event/activity.mock.json` |
| 5 | 探索点 Seed ×5 | `exploration_points.seed.json` |
| 6 | 任务 Seed + Mock | `tasks.seed.json` · `activity_task.mock.json` |
| 7 | 信物 Seed ×5 | `relics.seed.json` |
| 8 | 卡券模板 Mock | `coupon_template.mock.json` |
| 9 | 完整绑定图 | `bindings.seed.json` |
| 10 | API 读骨架 | `server/api/router.py` — 11 GET |
| 11 | 小程序探索地图 | `apps/miniapp/pages/explore-map/` |
| 12 | 小程序故事流链 | ar → atom → lottie → echo → digital-collectible |
| 13 | 小程序信物库 | `pages/relic-archive/` |
| 14 | 权益中心只读 | `pages/rights-center/` |
| 15 | 核销列表 | `merchant_redemptions/index.html` |
| 16 | 核销详情 | `merchant_redemption_detail/index.html` |
| 17 | 核销 Mock ×10 | `merchant_redemption_center.mock.json` |
| 18 | 模拟核销 | PENDING → VERIFIED |
| 19 | 模拟失败 | PENDING → FAILED |
| 20 | 搜索 / 筛选 / 分页 | 核销列表 UI |
| 21 | loading / empty / success | 核销页三态 |
| 22 | 数据 Schema 校验 | `scripts/merchant_portal/validate_schema.py` |

---

## 失败项（18）

| # | 项 | 根因 |
|---|-----|------|
| 1 | 活动页不动态加载 JSON | T4 生成静态 HTML，无 fetch |
| 2 | 小程序无商家活动页 | 未注册于 `app.json` |
| 3 | 活动 ID 不跨页传递 | 无 activity context |
| 4 | 详情页忽略 point_id | `detail.html` 硬编码入口广场 |
| 5 | 探索地图加载故事节点 | 非 `point_entrance_plaza` 等商家 ID |
| 6 | 探索进度不更新 | 无 progress write |
| 7 | 无完成任务交互 | 全链路无 complete 按钮 |
| 8 | 任务状态恒「未开始」 | 静态展示 |
| 9 | 故事流不记完成 | 仅 navigateTo |
| 10 | 任务完成不授信物 | 无 grantRelic |
| 11 | 信物 status 静态 | unrecorded / placeholder 不变 |
| 12 | 双轨信物 ID 不统一 | merchant vs canon namespace |
| 13 | 权益中心无领取 | 文案明确「尚未接入」 |
| 14 | 卡券 status 静态 | locked 不转 claimed |
| 15 | 无 coupon_code 生成 | 缺 claim service |
| 16 | C→B 无 coupon_code 联通 | 核销记录预设 claim_time |
| 17 | 核销非 C 端触发 | Admin 独立 Mock |
| 18 | 小程序零 API 调用 | 读骨架未被消费 |

---

## 缺失项（14）

| # | 项 | 优先级 |
|---|-----|--------|
| 1 | 小程序 merchant-event 页 | P0 |
| 2 | Admin Hub merchant-event 入口 | P2 |
| 3 | 任务完成 Service + 持久化 | P0 |
| 4 | POST /api/task/complete | P0 |
| 5 | 信物授予 Service | P0 |
| 6 | POST /api/relic/grant | P0 |
| 7 | 卡券领取 UI + Service | P0 |
| 8 | POST /api/coupon/claim | P0 |
| 9 | C 端券码 / QR 页 | P0 |
| 10 | 用户卡券钱包 | P1 |
| 11 | POST /api/redemption/verify | P1 |
| 12 | C 端核销状态回显 | P1 |
| 13 | 跨步骤用户进度 Store | P0 |
| 14 | HTTP Server 挂载 router | P1 |

---

## B01–B06 冒烟对照

| Blocker | 冒烟结果 | 变化 |
|---------|----------|------|
| B01 Zero API | GET 可读，POST 全缺 | 与 REFRESH 一致 |
| B02 Platform UI | 未测（B 端平台） | — |
| B03 Publish | 未测 | — |
| B04 C 端活动页 | ❌ 小程序无入口 | 确认 FAIL |
| B05 领取接口 | ❌ 无 claim | 确认 FAIL |
| B06 商家核销 | ✅ Admin Mock 独立 PASS | B06 部分解除确认 |

---

## 评分

| 维度 | 分数 | 说明 |
|------|------|------|
| 页面覆盖 | 65% | 静态页 + 小程序原型存在，缺联通 |
| 数据完整 | 85% | merchant_event seed 齐全 |
| 状态流转 | 15% | 仅 B 端核销 localStorage |
| Mock 链路 | 28% | bindings 无 runtime |
| **E2E 全流程** | **0%** | 六步不可串联 |

---

## 约束遵守

| 约束 | 状态 |
|------|------|
| 禁止修改代码 | ✅ |
| 仅审计 | ✅ |
| 未修改 Runtime / Release | ✅ |
| 未修改 Visual / Content Factory | ✅ |

---

## 产出文件

| 文件 | 路径 |
|------|------|
| 冒烟测试规格 | `docs/product/event/EVENT_RUNTIME_SMOKE_TEST_V1.md` |
| 执行报告 | `docs/product/event/EVENT_RUNTIME_SMOKE_TEST_V1_REPORT.md` |

---

## 完成确认

```yaml
EVENT_RUNTIME_SMOKE_TEST_V1_COMPLETE: YES
E2E_USER_FLOW_PASS: NO
pass_count: 22
fail_count: 18
missing_count: 14
recommended_action: MINIMUM_EVENT_RUNTIME_PATH_V1 Phase-2
```
