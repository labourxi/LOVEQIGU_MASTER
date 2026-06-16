# MINIMUM_EVENT_RUNTIME_PATH_V1_REPORT

# 最小上线路线图执行报告 V1

```yaml
task_id: MINIMUM_EVENT_RUNTIME_PATH_V1
executor: Cursor
date: 2026-06-07
status: COMPLETE
baseline: FIRST_EVENT_OPERATION_FLOW_AUDIT_V1 (20%)
output: docs/product/event/MINIMUM_EVENT_RUNTIME_PATH_V1.md
constraints:
  - 不修改代码
  - 不修改 Runtime
  - 仅分析
```

---

## 1. 任务执行摘要

| 项 | 结果 |
|----|------|
| 分析对象 | 爱企谷初见寻宝节 |
| 输入 | FIRST_EVENT_OPERATION_FLOW_AUDIT_V1 |
| 模块分类 | A 必须开发 12 项 · B 人工兜底 14 项 · C 暂时忽略 11 项 |
| 路线阶段 | 3 阶段 |
| 总工时 | **19.5 人日** |
| MVP 目标准备度 | **78%** |
| 成功标记 | `MINIMUM_EVENT_RUNTIME_PATH_V1_COMPLETE = YES` |

---

## 2. 三分法统计

| 分类 | 数量 | 说明 |
|------|------|------|
| **A 必须开发** | 12 | 阶段 1–2 全部覆盖 |
| **B 可人工兜底** | 14 | 首场可接受；CASE §12 半自动模式 |
| **C 暂时忽略** | 11 | 第二场或 6–12 个月路线 |

---

## 3. 阶段摘要

### 阶段 1 — 基础联通层

| 项 | 值 |
|----|-----|
| 工时 | 7 人日 |
| 准备度 | 20% → **45%** |
| 解除 | B01 · B08 · B20；部分 B09 · B14 |

### 阶段 2 — 核心闭环层

| 项 | 值 |
|----|-----|
| 工时 | 10.5 人日 |
| 准备度 | 45% → **78%** |
| 解除 | **B02 · B03 · B04 · B05 · B06 · B13** |

### 阶段 3 — 上线前检查

| 项 | 值 |
|----|-----|
| 工时 | 2 人日 |
| 准备度 | 维持 **78%**（MVP 达标） |
| 验收 | CASE §19 约 10/12 项可绿 |

---

## 4. B01–B06 专项结论

| ID | Blocker | 分类 | 阶段 | 工时 | 解除方式 |
|----|---------|------|------|------|----------|
| B01 | 零 API | A | 1 | 3–4d | 文件 DB API 骨架 |
| B02 | 平台 UI 不存在 | A | 2 | 2d | 4 页 platform-admin |
| B03 | 发布链路不存在 | A | 2 | 1.5d | publish API + qr_url |
| B04 | C 端无活动页 | A | 2 | 2d | merchant-event 2 页 |
| B05 | 领取未接入 | A | 2 | 1.5d | claim API + 权益中心 |
| B06 | 无核销页 | A | 2 | 1.5d | redemption 页 + verify API |

**六核心阻塞均在阶段 1–2 解除；B01 为阶段 1 前置，B02–B06 依赖 B01。**

---

## 5. 最小 MVP 定义

```yaml
codename: FIRST_EVENT_MVP_RUNTIME_V1
readiness_percent: 78
go_live_approved_after: 阶段3检查通过
core_loop:
  - 平台审核发布
  - 用户进入活动
  - 简化任务完成
  - 卡券领取
  - 到店核销
  - 基础数据可查
explicitly_out_of_scope:
  - Content/Visual Factory Release 自动化
  - 商家自助卡券创建
  - stats_daily 自动聚合
  - 风控/工单/分账
```

---

## 6. 准备度对照

| 里程碑 | % | 对外上线 |
|--------|---|----------|
| 当前（审计基线） | 20 | ❌ |
| 阶段 1 | 45 | ❌ |
| 阶段 2 | 78 | ⚠️ |
| 阶段 3 通过 | 78 | ✅ MVP |

---

## 7. 关键决策记录

| 决策 | 理由 |
|------|------|
| 不用 Content Release 链发布活动 | merchant_event 平行域；B15 活动侧绕过 |
| 探索任务简化为按钮确认 | 降低 B10 AR 依赖；首场验证闭环优先 |
| 商家卡券代录 | B07 人工兜底；节省 2–3 人日 |
| 文件 DB 而非真实数据库 | TECH MVP 建议；T2 可后续迁移 |
| 输码核销优先于扫码 | B06 最低可用；扫码 P1 |

---

## 8. 约束遵守

| 约束 | 状态 |
|------|------|
| 未修改代码 | ✅ |
| 未修改 Runtime | ✅ |
| 未修改 Release | ✅ |
| 仅分析规划 | ✅ |

---

## 9. 后续执行建议（Codex/Cursor 任务包）

| 优先级 | 任务 ID | 名称 | 阶段 |
|--------|---------|------|------|
| P0 | T-ME-01 | MERCHANT_EVENT_SEED_COMPLETE_V1 | 1 |
| P0 | T-ME-02 | MERCHANT_EVENT_API_SKELETON_V1 | 1 |
| P0 | T-ME-03 | EVENT_LIFECYCLE_MIN_V1 | 1 |
| P0 | T-ME-04 | PLATFORM_ADMIN_MVP_UI_V1 | 2 |
| P0 | T-ME-05 | MINIAPP_MERCHANT_EVENT_C_V1 | 2 |
| P0 | T-ME-06 | COUPON_CLAIM_REDEEM_V1 | 2 |
| P0 | T-ME-07 | FIRST_EVENT_SMOKE_TEST_V1 | 3 |

---

## 10. 完成确认

```yaml
MINIMUM_EVENT_RUNTIME_PATH_V1_COMPLETE: YES
artifacts:
  - docs/product/event/MINIMUM_EVENT_RUNTIME_PATH_V1.md
  - docs/product/event/MINIMUM_EVENT_RUNTIME_PATH_V1_REPORT.md
total_effort_person_days: 19.5
mvp_readiness_target: 78
```
