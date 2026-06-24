# AR游伴 · 商业模型

**文档 ID：** `04_business/business_model.md`  
**版本：** V1.2-STABLE  
**状态：** ENGINEERING_STANDARD  
**输入：** 景区签约范围、探索点/商家数、试点周期、CRM 基线能力  
**输出：** 模块报价、收入路径图、CRM→收入换算、续费条件  

**闭环：** `USER → XR → VISUAL → SPACE → RELIC → CRM → REVENUE`  
**关联：** `pricing_structure.md` · `05_crm/user_behavior_model.md` · `06_deployment/pilot_deployment_sop.md`

---

## 1. Definition（定义）

### 1.1 商业对象

| 付费方 | 购买物 | 不购买 |
|--------|--------|--------|
| 景区/文博 | 空间行为记录与运营系统能力 | C 端人头费 |
| 在地商家 | 活动包 + 核销能力 | XR 源码 |
| 游客 C 端 | 免费探索 | 虚拟道具 |

### 1.2 价值单元（MVU）

```text
MVU = 1 park_id × 3 point_id × 90 days × KPI_set × CRM_exportable
```

### 1.3 输入 / 输出

| 方向 | 内容 |
|------|------|
| **输入** | 规模、模块勾选、景区客单价假设（商务填） |
| **输出** | 报价 JSON、收入路径图、CRM 字段→收入行 |

---

## 2. System Design（结构设计）

### 2.1 收费模块 = 系统能力映射（强制）

| 模块 | 售卖的系统能力 | 运行时组件 | CRM 产出 |
|------|----------------|------------|----------|
| **M1** 空间系统基础 | 小程序 + 三端后台 + XR Runtime 接入 | `miniapp`, `xr-event-bus`, `runtime-builder`, admin | `enter_scenic`, Tab 导航 |
| **M2** 探索点内容包 | 每点 1 空间 + 1 信物 + 1 显现 | `mock-source` point/relic/ar, `ar-entry`, `lottie` | `reveal_relic`, `userRelics` |
| **M3** 商家活动包 | 礼遇 + 核销 | `couponClaims`, merchant-portal | `unlock_coupon`, `redeem_coupon` |
| **M4** 运营陪跑 | 90 天可执行 SOP + 门禁 | `validate_*`, pilot SOP | 5 KPI 日报 |
| **M5** 城市复制 | 模板 + 审查 + 多 park | platform-admin 发布链 | 跨 park 聚合 |

**原则：** 报价单每一行必须能指到 §2.1 能力列；不得销售表外「特效包」而无 M2 内容链。

### 2.2 B2B2C 结构

```text
平台 AR游伴 OS
 ├── 景区（M1+M2+M4）
 │     ├── 探索点 × N → SPACE + RELIC
 │     └── 数据 → CRM
 ├── 商家（M3）→ 核销 → 到店收入
 └── 游客（免费）→ 行为 → CRM → 景区续费论据
```

### 2.3 景区 → 收入路径图

```text
                    ┌─────────────────────────────────────┐
                    │ 景区签约 M1–M4（合同 REVENUE_in）    │
                    └──────────────────┬──────────────────┘
                                       │
     ┌─────────────────────────────────┼─────────────────────────────────┐
     │                                 │                                 │
     ▼                                 ▼                                 ▼
┌─────────┐                    ┌─────────────┐                    ┌─────────────┐
│ M1 年费  │                    │ M2 点内容费  │                    │ M4 陪跑费    │
│ 系统存在 │                    │ 每点信物+显现│                    │ 90天交付     │
└────┬────┘                    └──────┬──────┘                    └─────────────┘
     │                                │
     │         USER 进入景区           │
     │              │                 │
     │              ▼                 │
     │         XR 显现 + VISUAL        │
     │              │                 │
     │              ▼                 │
     │    SPACE 探索 / RELIC 获得     │
     │              │                 │
     │              ▼                 │
     │         CRM 行为沉淀           │
     │              │                 │
     └──────────────┼─────────────────┘
                    │
        ┌───────────┴───────────┐
        ▼                       ▼
 ┌──────────────┐        ┌──────────────┐
 │ 续费/扩容 M1  │        │ 商家 M3 收入  │
 │ KPI 达标      │        │ 核销→到店 GMV │
 └──────────────┘        └──────────────┘
        │                       │
        └───────────┬───────────┘
                    ▼
           REVENUE_out（景区可感知）
           · 合同回款（直接）
           · 到店增量（间接，需核销数据）
           · 续费（次年 M1/M2）
```

### 2.4 CRM 数据如何转收入

| CRM 字段 / 事件 | 商业含义 | 收入类型 | 计算公式 |
|-----------------|----------|----------|----------|
| `enter_scenic` | 景区引流能力证明 | 间接 | 续费谈判论据 |
| `reveal_relic` / `userRelics` | M2 交付完成 | **直接** | M2 按点验收 |
| `unlock_coupon` | 礼遇触达 | 间接 | 转化漏斗 |
| `benefit_redeemed` / `claimStatus=USED` | 到店核销 | **间接** | `核销数 × 客单价_assumption` |
| `userPointStates.COMPLETED` | 单点闭环 | 直接 | M2 点验收 |
| `fallback_ratio` | 显现质量 | 风险 | 低于阈值可触发 M4 延期不罚 |
| 5 KPI 集合 | 试点成功 | 直接 | M4 尾款 + M1 续费 |

**数据源：** `user_behavior_model.md` · adapter session · 试点日报 `pilot_deployment_sop.md` §4.2

### 2.5 景区触发 → 收入节点

| 景区侧触发 | 系统响应 | 收入关联 |
|------------|----------|----------|
| 签约上线 | 发布 `activity` PUBLISHED | M1 首款 |
| 新增探索点 | M2 增购 + 内容审查 | M2 按点 |
| 节庆活动 | 新 `activity_id` | M2+M3 |
| 商家入驻 | M3 场次 | M3 按商家 |
| 90 天复盘 KPI 达标 | 模板冻结 | M4 尾款 + M1 续费意向 |

### 2.6 不在 MVP 范围

自动分账 · POS · 复杂会员 CRM · C 端道具付费

---

## 3. Flow（流程）

### 3.1 签约到现金流

```text
意向 → 勘测 → 报价(M1–M5) → 合同
    → 内容发布 → CRM 开始采集
    → T+60 Go → 对外运营
    → 核销发生 → REVENUE_out（间接）
    → T+90 复盘 → 续费/扩容
```

### 3.2 试点三阶段与 CRM

| 阶段 | 日历 | CRM 里程碑 | 收入节点 |
|------|------|------------|----------|
| P1 | T+0–30 | 点位的 `getExplorationPointDetail` 可读 | 内容预付款 |
| P2 | T+31–60 | 首条 `reveal_relic` 成功 | 内容上线款 |
| P3 | T+61–90 | KPI + 首笔核销 | 尾款 + 续费谈判 |

### 3.3 回款里程碑

| 节点 | 建议占比 | CRM/运行释放条件 |
|------|----------|------------------|
| 签约 | 30% | 合同 + 账号 |
| 内容上线 | 40% | `publishRecords` PUBLISHED + validate PASS |
| 试运行 | 20% | T+60 Go + 首条 `reveal_relic` |
| 验收 | 10% | T+90 复盘 + KPI 表 |

---

## 4. Data Model（数据模型）

### 4.1 报价单 schema

```json
{
  "quote_id": "Q-2026-001",
  "park_id": "park_001",
  "modules": [
    { "id": "M1", "qty": 1, "capabilities": ["miniapp", "admin", "xr_runtime"] },
    { "id": "M2", "qty": 3, "capabilities": ["point", "relic", "manifestation"] },
    { "id": "M3", "qty": 5, "capabilities": ["coupon", "redemption"] },
    { "id": "M4", "qty": 90, "capabilities": ["pilot_sop", "kpi_report"] }
  ],
  "crm_acceptance_fields": [
    "enter_scenic", "reveal_relic", "unlock_coupon", "benefit_redeemed", "completion_rate"
  ],
  "amount_cny": null
}
```

### 4.2 ROI 测算（景区填假设）

```text
REVENUE_direct = Σ模块合同额
REVENUE_indirect_month = benefit_redeemed × 客单价_assumption × 毛利率_assumption
回收期月数 = REVENUE_direct / max(REVENUE_indirect_month, ε)
```

### 4.3 CRM→收入对账行

```json
{
  "park_id": "park_001",
  "period": "2026-Q3",
  "crm": {
    "enter_scenic": 1200,
    "relic_acquired": 820,
    "benefit_claimed": 700,
    "benefit_redeemed": 310
  },
  "revenue": {
    "contract_m2_points_delivered": 3,
    "estimated_store_gmv": null,
    "renewal_eligible": true
  }
}
```

---

## 5. Example（示例）

### 5.1 爱企谷 MVU

| 项 | 值 |
|----|-----|
| park | park_001 |
| points | ep_001–003 |
| 模块 | M1+M2(3)+M3(5)+M4(90) |
| CRM 验收 | 3 点各 ≥1 `userRelics`；≥1 核销 |

### 5.2 收入说明（馆长可读）

```text
您付的费用购买的是：
  1. 可运行的空间探索系统（M1）
  2. 每探索点一套信物+显现内容（M2）
  3. 商家礼遇与核销（M3）
  4. 90天陪跑与数据报表（M4）

您获得的回报：
  · 合同内：系统上线 + 探索完成数据
  · 合同外（需配合客单价）：核销带动到店
```

### 5.3 续费

| 条件 | 动作 |
|------|------|
| KPI 达基线 | M1 年费 |
| 新增点 | M2 增购 |
| 新商家活动 | M3 增购 |

---

## 6. Execution Notes（执行说明）

- 报价必附 `pricing_structure.md` 能力对照  
- SOW 必列 `crm_acceptance_fields`  
- 试点执行：`pilot_deployment_sop.md`  
- 降级：`failure_recovery_sop.md`（影响 `fallback_ratio` 与续费谈判）  

---

*商业模型 V1.2-STABLE · Batch 2*
