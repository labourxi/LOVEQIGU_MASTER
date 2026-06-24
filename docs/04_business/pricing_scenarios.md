# AR游伴 · 定价场景

**文档 ID：** `04_business/pricing_scenarios.md`  
**版本：** V1.1-ENG  
**状态：** ENGINEERING_STANDARD  
**输入：** 景区类型、点位规模、商家数、服务深度  
**输出：** 推荐模块组合、交付范围、KPI 集  

---

## 1. Definition（定义）

定价场景 = **可复用的模块组合模板**，供商务在勘测后选用；不是公开价目表。

---

## 2. System Design（结构设计）

### 2.1 景区类型矩阵

| 场景 ID | 类型 | 典型点位 | 商家 | 推荐模块 |
|---------|------|----------|------|----------|
| S-A | 单景区首发试点 | 3 | 3–10 | M1+M2(3)+M3+M4 |
| S-B | 文博馆常设 | 5–8 | 0–3 | M1+M2(n)+M4 |
| S-C | 城市公园网络 | 10+ | 20+ | M1+M2(n)+M3+M5 |
| S-D | 商业综合体 | 3–5 | 15+ | M1+M2+M3(重) |
| S-E | 复制扩容 | +3 点 | 原基础 | M2(增)+M4(短) |

### 2.2 模块组合规则

```text
必选：M1（系统存在）
内容：M2 × 探索点数
商家：M3 × 参与商家数（可为 0）
首发：M4（90天）
城市：M5（仅 S-C 且第二阶段）
```

---

## 3. Flow（流程）

```text
勘测表 → 判定场景 S-A…E → 勾选模块 → 生成 quote JSON → 审批 → 合同
```

---

## 4. Data Model（数据模型）

### 4.1 场景 S-A 模板

```json
{
  "scenario_id": "S-A",
  "label": "单景区首发试点",
  "modules": [
    { "id": "M1", "qty": 1 },
    { "id": "M2", "qty": 3, "notes": "入口/核心/礼遇" },
    { "id": "M3", "qty": 5, "notes": "可下调" },
    { "id": "M4", "qty": 90, "unit": "day" }
  ],
  "kpi_set": [
    "explore_completion_rate",
    "relic_acquisition_rate",
    "benefit_claim_rate",
    "fallback_ratio",
    "d7_return_rate"
  ],
  "amount_cny": null
}
```

### 4.2 场景 S-B 差异

```json
{
  "scenario_id": "S-B",
  "modules": [
    { "id": "M1", "qty": 1 },
    { "id": "M2", "qty": 6 },
    { "id": "M4", "qty": 60 }
  ],
  "notes": "弱商家模块，重内容解说与信物档案"
}
```

### 4.3 增购规则

| 触发 | 增购模块 |
|------|----------|
| 新增 1 探索点 | M2 ×1 |
| 新增 10 商家活动 | M3 包 |
| 第二景区同集团 | M1 折扣 + M2 全价 |
| 仅陪跑延期 | M4 按 30 天块 |

---

## 5. Example（示例）

**客户：** 县域单一 4A 景区，首发  

1. 勘测：3 点位可 Marker，5 家餐饮  
2. 选 **S-A**  
3. 报价单填 M1+M2(3)+M3(5)+M4(90)  
4. KPI 仅命名，数值留空至试运行后修订  

---

## 6. Execution Notes（执行说明）

- 报价须附 `exclusions` 数组（见 `business_model.md` §2.4）  
- 场景变更需重新勘测，不可口头加点位  
- 与 `pricing_structure.md` 模块 ID 保持一致  

---

*定价场景 V1.1-ENG*
