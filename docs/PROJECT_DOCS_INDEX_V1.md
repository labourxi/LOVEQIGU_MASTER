# AR游伴 · 项目文档体系索引 V1

> **已升级：** 请使用 [`PROJECT_DOCS_INDEX_V2.md`](./PROJECT_DOCS_INDEX_V2.md)（工程标准版 · V1.1-ENG）

**项目定位：** 空间行为记录与运营系统（非游戏 App）  
**品牌：** AR游伴（ARYOUBAN）  
**状态：** 初稿 · 已由 V2 取代  
**日期：** 2026-06-23  

---

## 文档优先级（知识来源）

| 优先级 | 路径 | 说明 |
|--------|------|------|
| 1 | `docs/canon/*` | Canon 冻结内容 |
| 2 | `docs/world/*` | 世界设定 |
| 3 | `docs/language/*` | 语言宪法与术语 |
| 4 | `docs/architecture/*` | 信息架构 |
| 5 | 本体系 `docs/0X_*/` | 工程落地文档 |
| 6 | 源代码 | 实现细节 |

**冲突处理：** 上位文档优先；本体系与代码不一致时，标注 `GAP` 并开 issue 对齐。

---

## 目录结构

```
docs/
├── PROJECT_DOCS_INDEX_V1.md          ← 本文件
├── 01_product/                       产品说明
│   ├── product_overview.md           ★ 优先
│   ├── user_journey.md
│   └── feature_spec.md
├── 02_technical/                     技术架构
│   ├── xr_architecture.md            ★ 优先
│   ├── runtime_flow.md
│   ├── event_bus_spec.md
│   └── system_boundary.md
├── 03_visual/                        视觉规范
│   ├── visual_system_v1.md
│   ├── xr_visual_spec.md
│   ├── relic_visual_spec.md
│   └── spatial_visual_language.md
├── 04_business/                      商业模型
│   ├── business_model.md             ★ 优先
│   ├── pricing_structure.md
│   ├── revenue_streams.md
│   └── city_partner_model.md
├── 05_crm/                           运营与关系数据
│   ├── crm_system_design.md
│   ├── user_behavior_model.md
│   └── relic_data_model.md
├── 06_deployment/                    部署与试点
│   ├── pilot_deployment_sop.md       ★ 优先
│   ├── scenic_spot_integration.md
│   └── onboarding_process.md
└── 07_pitch/                         路演材料
    ├── investor_pitch_outline.md
    ├── investor_qna.md
    └── market_analysis.md
```

---

## 术语速查（工程强制）

| 必须使用 | 禁止使用 |
|----------|----------|
| 探索地图 | 打卡地图 |
| 权益中心（L2 产品层） | 积分商城 |
| 信物 | 与数字藏品混称 |
| 回响 | 回应（仪式语境） |
| 心愿值 | 愿力 |
| 合真 | 归真 |
| 祝禁 | 祝由 |

**资产边界：** Relic（信物）= 故事进度资产；Digital Collectible（数字藏品）= 营销传播资产。

---

## 与历史文档关系

本体系为 **工程可执行层** 总览；不替代以下冻结文档：

- `docs/ar-product-definition-v1.md`
- `docs/product/ar_factory/AR_YOUBAN_SYSTEM_FREEZE_MASTER_V1.md`
- `docs/language/LOVEQIGU_LANGUAGE_CONSTITUTION_V1.md`
- `docs/product/pitch/AR_YOUBAN_INVESTOR_PITCH_DECK_V1.md`

本体系文件通过章节内 `上游引用` 字段指向上述文档。

---

## 维护规则

1. 每个文件必须含：概念定义 · 结构说明 · 流程（如适用）· 示例 · 可执行说明  
2. 新增能力先改 `02_technical/system_boundary.md`，再改产品/商业文档  
3. 试点变更同步 `06_deployment/pilot_deployment_sop.md`  
4. 视觉变更同步 `03_visual/visual_system_v1.md`  
5. 版本号：文件内 `STATUS` 字段；大改为 `V2` 新文件，不覆盖冻结稿  

---

## 快速入口（按角色）

| 角色 | 阅读顺序 |
|------|----------|
| 产品 | `01_product/product_overview` → `user_journey` → `feature_spec` |
| 工程 | `02_technical/xr_architecture` → `runtime_flow` → `event_bus_spec` |
| 商务 | `04_business/business_model` → `07_pitch/investor_pitch_outline` |
| 运营 | `06_deployment/pilot_deployment_sop` → `05_crm/crm_system_design` |
| 设计 | `03_visual/visual_system_v1` → `spatial_visual_language` |
