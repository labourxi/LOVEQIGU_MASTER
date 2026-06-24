# AR游伴 · 项目文档体系索引 V2

**项目名：** AR游伴（唯一）  
**定位：** 空间行为记录与运营系统  
**状态：** ENGINEERING_STANDARD · V1.2 Batch 2 稳定化  
**日期：** 2026-06-23  

**闭环链路：** `USER → XR → VISUAL → SPACE → RELIC → CRM → REVENUE`

**文档标准：** [`DOC_STANDARD_V1.md`](./DOC_STANDARD_V1.md)  
**术语注册：** [`TERMINOLOGY_REGISTRY_V1.md`](./TERMINOLOGY_REGISTRY_V1.md)  

---

## 知识优先级

| 优先级 | 路径 | 说明 |
|--------|------|------|
| 1 | `docs/canon/*` | Canon 冻结 |
| 2 | `docs/world/*` | 世界设定 |
| 3 | `docs/language/*` | 语言宪法 |
| 4 | `docs/architecture/*` | 信息架构 |
| 5 | `docs/0X_*/` | 本工程体系 |
| 6 | 源代码 | 实现 |

冲突：上位文档优先；与代码不一致标 `GAP` 并开 issue。

---

## 目录结构

```
docs/
├── PROJECT_DOCS_INDEX_V2.md        ← 本文件
├── DOC_STANDARD_V1.md              六段标准
├── TERMINOLOGY_REGISTRY_V1.md      术语强制表
├── 01_product/
│   ├── product_overview.md
│   ├── user_journey.md
│   └── feature_spec.md
├── 02_technical/
│   ├── xr_architecture.md          ★ V1.1-ENG
│   ├── xr_state_machine.md         ★ 新增
│   ├── event_bus_contract.md       ★ 新增（主）
│   ├── event_bus_spec.md           已迁移 → contract
│   ├── runtime_flow.md
│   └── system_boundary.md
├── 03_visual/
│   ├── visual_system_v1.md         ★ V1.1-ENG
│   ├── xr_visual_spec.md
│   ├── relic_visual_spec.md
│   └── spatial_visual_language.md
├── 04_business/
│   ├── business_model.md           ★ V1.1-ENG
│   ├── pricing_scenarios.md        ★ 新增
│   ├── pricing_structure.md
│   ├── revenue_streams.md
│   └── city_partner_model.md
├── 05_crm/
│   ├── crm_system_design.md
│   ├── user_behavior_model.md
│   └── relic_data_model.md
├── 06_deployment/
│   ├── pilot_deployment_sop.md     ★ V1.1-ENG
│   ├── failure_recovery_sop.md     ★ 新增
│   ├── scenic_spot_integration.md
│   └── onboarding_process.md
└── 07_pitch/
    ├── investor_pitch_outline.md
    ├── investor_qna.md
    └── market_analysis.md
```

---

## V1.1-ENG 升级状态

| 文件 | 状态 | 六段结构 | 可开发 |
|------|------|----------|--------|
| `xr_architecture.md` | ✅ | ✅ | ✅ |
| `xr_state_machine.md` | ✅ | ✅ | ✅ |
| `event_bus_contract.md` | ✅ | ✅ | ✅ |
| `visual_system_v1.md` | ✅ | ✅ | ✅ |
| `business_model.md` | ✅ | ✅ | ✅ |
| `pricing_scenarios.md` | ✅ | ✅ | ✅ |
| `pilot_deployment_sop.md` | ✅ | ✅ | ✅ |
| `failure_recovery_sop.md` | ✅ | ✅ | ✅ |
| `01_product/product_overview.md` | ✅ Batch 1 | ✅ | ✅ |
| `02_technical/runtime_flow.md` | ✅ Batch 1 | ✅ | ✅ |
| `02_technical/system_boundary.md` | ✅ Batch 1 | ✅ | ✅ |
| `05_crm/relic_data_model.md` | ✅ Batch 1 | ✅ | ✅ |
| `05_crm/user_behavior_model.md` | ✅ Batch 1 | ✅ | ✅ |
| `03_visual/visual_system_v1.md` | ✅ Batch 2 | ✅ | ✅ |
| `03_visual/xr_visual_spec.md` | ✅ Batch 2 | ✅ | ✅ |
| `03_visual/spatial_visual_language.md` | ✅ Batch 2 | ✅ | ✅ |
| `04_business/business_model.md` | ✅ Batch 2 | ✅ | ✅ |
| `04_business/pricing_structure.md` | ✅ Batch 2 | ✅ | ✅ |
| `06_deployment/pilot_deployment_sop.md` | ✅ Batch 2 | ✅ | ✅ |
| `06_deployment/failure_recovery_sop.md` | ✅ Batch 2 | ✅ | ✅ |
| 其余 `01_product` · `04–07` | 初稿/部分 | 部分 | 待 Batch 3 |

---

## 术语速查（工程强制）

| 必须使用 | 英文键 | 禁止 |
|----------|--------|------|
| AR游伴 | ARYOUBAN | 其他项目名 |
| XR Runtime | xr-runtime | AR引擎混称 |
| 信物 | relic | 藏品/NFT/道具 |
| 空间 / 世界 | space / world | 混用场域与世界 |
| 事件总线 | event-bus | 产品级 MQ 名 |
| 探索地图 | explore-map | 打卡地图 |
| 权益中心 | rights-center | 积分商城 |

**资产：** Relic（信物）= 故事进度；Digital Collectible = 营销资产，禁止混表。

---

## 按角色阅读路径

| 角色 | 顺序 |
|------|------|
| **开发** | `xr_architecture` → `xr_state_machine` → `event_bus_contract` → `runtime_flow` |
| **设计** | `visual_system_v1` → `xr_visual_spec` → `relic_visual_spec` |
| **商务** | `business_model` → `pricing_scenarios` → `07_pitch/investor_pitch_outline` |
| **运营/景区** | `pilot_deployment_sop` → `failure_recovery_sop` → `scenic_spot_integration` |
| **投资** | `07_pitch/*` + `business_model` §4 ROI |

---

## 维护规则

1. 新文档必须符合 `DOC_STANDARD_V1.md` 六段结构  
2. 新事件写入 `event_bus_contract.md`，不写 `event_bus_spec.md`  
3. 试点变更同步 `pilot_deployment_sop.md` + `failure_recovery_sop.md`  
4. 大版本新建 `V2` 文件，不覆盖冻结 Canon  

---

## 与历史文档关系

不替代：

- `docs/ar-product-definition-v1.md`
- `docs/product/ar_factory/AR_YOUBAN_SYSTEM_FREEZE_MASTER_V1.md`
- `docs/language/LOVEQIGU_LANGUAGE_CONSTITUTION_V1.md`
- `docs/product/pitch/AR_YOUBAN_INVESTOR_PITCH_DECK_V1.md`

---

*索引 V2 · 工程标准版*
