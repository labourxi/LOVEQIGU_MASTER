# AR游伴 · 定价结构

**文档 ID：** `04_business/pricing_structure.md`  
**版本：** V1.2-STABLE  
**状态：** ENGINEERING_STANDARD  
**输入：** 景区类型、点位/商家规模、模块勾选  
**输出：** 模块单价表结构、能力对照、CRM 验收字段、不含项清单  

**闭环：** `USER → XR → VISUAL → SPACE → RELIC → CRM → REVENUE`  
**关联：** `business_model.md` §2.1 · `pricing_scenarios.md`

---

## 1. Definition（定义）

### 1.1 定价原则

- 按 **模块 + 规模** 计费，不按 C 端人头抽成（MVP）  
- 每一报价行 **必须** 映射系统能力与 CRM 验收字段  
- 金额由商务填表；本文冻结 **结构**，不冻结数字  

### 1.2 输入 / 输出

| 方向 | 内容 |
|------|------|
| **输入** | 场景 ID（S-A…E）、qty |
| **输出** | `quote_line[]` + `capabilities[]` + `crm_fields[]` |

---

## 2. System Design（结构设计）

### 2.1 模块定价表（结构）

| 模块 | 计费维度 | 单价栏 | 系统能力包 | CRM 验收 |
|------|----------|--------|------------|----------|
| M1 | 景区/年 | `[  ]` | 小程序+后台+XR 接入 | `enter_scenic` |
| M2 | 探索点/套 | `[  ]` | 点+信物+显现+视觉 | `reveal_relic`, `completion_rate` |
| M3 | 商家/场 | `[  ]` | 券+核销门户 | `unlock_coupon`, `benefit_redeemed` |
| M4 | 90天包 | `[  ]` | pilot SOP+KPI | 5 KPI 报表 |
| M5 | 城市/年 | `[  ]` | 复制+审查 | 跨 park 发布 |

### 2.2 M2 单点能力拆解（不可拆卖「纯 AR」）

| 子项 | 运行时 | 视觉 |
|------|--------|------|
| 空间绑定 | `explorationPoints` | 地图节点 |
| 信物模板 | `relics` | `relic_emerge_v1` |
| 显现 | `arContents`, `ar-entry` | `xr_visual_spec` |
| 发布 | platform-admin | — |

### 2.3 收入路径与模块对应

```text
M1 ── 系统可运行 ── enter_scenic ── 续费论据
M2 ── 每点信物 ─── reveal_relic ─── 点验收款
M3 ── 商家礼遇 ─── redeem ──────── 到店 GMV（间接）
M4 ── 陪跑交付 ─── KPI 达标 ───── 尾款
```

### 2.4 不含项（报价必列）

```json
{
  "exclusions": [
    "auto_split",
    "pos_integration",
    "complex_crm",
    "c_end_virtual_goods",
    "canon_content_authoring_outside_sow"
  ]
}
```

---

## 3. Flow（流程）

```text
勘测 → 场景 S-A…E → 勾选 M1–M5 → 填单价栏
     → 附 capabilities + crm_fields → 审批 → 合同 SOW
     → pilot_deployment_sop 执行 → CRM 对账 → 回款
```

---

## 4. Data Model（数据模型）

### 4.1 报价行 schema

```json
{
  "line_id": "L-001",
  "module_id": "M2",
  "qty": 3,
  "unit": "point",
  "unit_price_cny": null,
  "line_total_cny": null,
  "capabilities": ["exploration_point", "relic_template", "ar_manifestation", "visual_fx"],
  "crm_acceptance": {
    "per_point": ["reveal_relic", "userPointStates.COMPLETED"],
    "aggregate": ["relic_acquisition_rate"]
  }
}
```

### 4.2 爱企谷示意报价单

```text
模块                    数量    单价(万)    小计(万)
────────────────────────────────────────────
M1 空间系统基础          1      [  ]       [  ]
M2 探索点内容包          3      [  ]       [  ]
M3 商家活动包            5      [  ]       [  ]
M4 90天运营陪跑          1      [  ]       [  ]
────────────────────────────────────────────
合计                              [  ]

CRM 验收：3点×reveal_relic；≥1 benefit_redeemed
不含：分账/POS/复杂CRM
```

### 4.3 增购单价结构

| 增购 | 计费 | 能力 |
|------|------|------|
| +1 探索点 | M2 ×1 | 完整 M2 子项 |
| +10 商家 | M3 包 | 券+核销 |
| 陪跑延期 30d | M4 块 | SOP 延续 |

---

## 5. Example（示例）

### 5.1 S-A 首发场景报价骨架

```json
{
  "scenario_id": "S-A",
  "lines": [
    { "module_id": "M1", "qty": 1 },
    { "module_id": "M2", "qty": 3 },
    { "module_id": "M3", "qty": 5 },
    { "module_id": "M4", "qty": 1, "unit": "90day_pack" }
  ],
  "crm_acceptance_fields": [
    "explore_completion_rate",
    "relic_acquisition_rate",
    "benefit_claim_rate",
    "manifest_success_rate",
    "benefit_redeemed"
  ]
}
```

### 5.2 CRM 对账

```text
合同 M2 qty=3 → CRM 统计 userRelics 按 explorationPointId 去重 ≥3
合同 M3 qty=5 → 5 商家各 ≥1 券配置；核销≥1 作试点成功样例
```

---

## 6. Execution Notes（执行说明）

- 与 `business_model.md` 模块 ID 保持一致  
- 场景组合见 `pricing_scenarios.md`  
- 续费逻辑见 `business_model.md` §5.3  
- 收入流见 `revenue_streams.md`（间接收入分类）  

---

*定价结构 V1.2-STABLE · Batch 2*
