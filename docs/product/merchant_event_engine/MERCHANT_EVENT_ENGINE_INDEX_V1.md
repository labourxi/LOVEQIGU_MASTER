# MERCHANT_EVENT_ENGINE_INDEX_V1.md

# 商家活动引擎模块索引 V1｜MERCHANT_EVENT_ENGINE_INDEX_V1

```yaml
project: LOVEQIGU / AR游伴
session: A会话｜产品运营
module: Merchant Event Engine
version: V1
status: ACTIVE_INDEX
owner: Product / Operation
created_for: 商家活动引擎模块文档索引、活动运营文档登记、后续活动案例与后台配置文档管理
```

---

# 1. 索引定义

MERCHANT_EVENT_ENGINE_INDEX_V1 是 AR游伴「商家活动引擎」模块的专用产品文档索引。

该索引用于统一登记以下类型文档：

```text
商家活动引擎架构文档
活动样板案例文档
活动后台配置文档
活动物料文档
商家招商话术文档
活动任务拆解文档
活动复盘报告文档
```

该索引的目标是：

```text
保证 merchant_event_engine 模块下的产品运营文档有明确入口、明确状态、明确上下游关系，避免后续活动案例、后台配置、商家脚本、物料文档分散失控。
```

---

# 2. 当前模块状态

```text
MERCHANT_EVENT_ENGINE_MODULE = ACTIVE
MERCHANT_EVENT_ENGINE_V1 = APPROVED_FOR_PRODUCT_ARCHITECTURE
LOVEQIGU_FIRST_EVENT_CASE_V1 = APPROVED_FOR_CASE_ARCHITECTURE
LOVEQIGU_FIRST_EVENT_ADMIN_CONFIG_V1 = APPROVED_FOR_ADMIN_CONFIG_ARCHITECTURE
LOVEQIGU_FIRST_EVENT_MERCHANT_SCRIPT_V1 = APPROVED_FOR_MERCHANT_SCRIPT_ARCHITECTURE
MERCHANT_EVENT_ENGINE_ACTIVITY_NAMING_V1 = APPROVED_FOR_ACTIVITY_NAMING
INDEX_STATUS = ACTIVE_INDEX
```

当前阶段说明：

```text
商家活动引擎 V1 已完成产品运营架构定义。
爱企谷首场活动样板已完成案例架构定义。
爱企谷初见寻宝节后台配置方案已完成架构定义。
爱企谷初见寻宝节商家招商与沟通话术已完成架构定义。
当前模块已具备继续拆解活动物料、任务执行清单、复盘报告文档的条件。
```

---

# 3. 已登记文档

## 3.1 MERCHANT_EVENT_ENGINE_V1.md

```yaml
filename: MERCHANT_EVENT_ENGINE_V1.md
path: docs/product/merchant_event_engine/MERCHANT_EVENT_ENGINE_V1.md
type: Product Operation Architecture
status: APPROVED_FOR_PRODUCT_ARCHITECTURE
module: Merchant Event Engine
priority: P0
upstream: none
downstream:
  - LOVEQIGU_FIRST_EVENT_CASE_V1.md
  - MERCHANT_EVENT_ENGINE_ADMIN_SCHEMA_V1.md
  - MERCHANT_EVENT_ENGINE_PRODUCT_SPEC_V1.md
  - MERCHANT_EVENT_ENGINE_MVP_TASKS_V1.md
description: 定义 AR游伴面向商家、景区/园区的活动运营机制，包括活动资产、活动模板、卡券核销、后台模块、MVP 边界和商业化闭环。
```

核心作用：

```text
该文件是 merchant_event_engine 模块的上游总架构文件。
后续所有活动案例、后台配置、商家参与机制、卡券核销机制、活动复盘机制均应继承该文件。
```

---

## 3.2 LOVEQIGU_FIRST_EVENT_CASE_V1.md

```yaml
filename: LOVEQIGU_FIRST_EVENT_CASE_V1.md
path: docs/product/merchant_event_engine/LOVEQIGU_FIRST_EVENT_CASE_V1.md
type: First Event Case Architecture
status: APPROVED_FOR_CASE_ARCHITECTURE
module: Merchant Event Engine
case: Loveqigu First Event Case
priority: P0
upstream:
  - MERCHANT_EVENT_ENGINE_V1.md
downstream:
  - LOVEQIGU_FIRST_EVENT_ADMIN_CONFIG_V1.md
  - LOVEQIGU_FIRST_EVENT_MATERIALS_V1.md
  - LOVEQIGU_FIRST_EVENT_MERCHANT_SCRIPT_V1.md
  - LOVEQIGU_FIRST_EVENT_TASKS_V1.md
  - LOVEQIGU_FIRST_EVENT_REVIEW_REPORT_V1.md
description: 定义“爱企谷初见寻宝节 V1”首场商家联动活动样板，用于验证游客探索、活动信物、卡券领取、到店核销、后台数据、活动复盘和商家续费闭环。
```

核心作用：

```text
该文件是 AR游伴第一个真实活动样板案例。
它不是新的总架构，而是 MERCHANT_EVENT_ENGINE_V1 的首场活动落地案例。
```

---

## 3.3 LOVEQIGU_FIRST_EVENT_ADMIN_CONFIG_V1.md

```yaml
filename: LOVEQIGU_FIRST_EVENT_ADMIN_CONFIG_V1.md
path: docs/product/merchant_event_engine/LOVEQIGU_FIRST_EVENT_ADMIN_CONFIG_V1.md
type: Admin Configuration Architecture
status: APPROVED_FOR_ADMIN_CONFIG_ARCHITECTURE
module: Merchant Event Engine
case: Loveqigu First Event Case
priority: P0
upstream:
  - MERCHANT_EVENT_ENGINE_V1.md
  - LOVEQIGU_FIRST_EVENT_CASE_V1.md
downstream:
  - LOVEQIGU_FIRST_EVENT_ADMIN_CONFIG_SPEC_V1.md
  - LOVEQIGU_FIRST_EVENT_MATERIALS_V1.md
  - LOVEQIGU_FIRST_EVENT_MERCHANT_SCRIPT_V1.md
  - LOVEQIGU_FIRST_EVENT_TASKS_V1.md
description: 定义爱企谷初见寻宝节在后台中的活动创建、探索点绑定、商家添加、卡券配置、信物配置、数字藏品配置、任务条件、活动发布、数据看板和复盘报告配置。
```

核心作用：

```text
该文件是爱企谷初见寻宝节的后台配置方案。
它将 LOVEQIGU_FIRST_EVENT_CASE_V1 拆解为后台可配置的对象、字段、按钮、状态、任务链和数据看板。
```

---

## 3.4 LOVEQIGU_FIRST_EVENT_MERCHANT_SCRIPT_V1.md

```yaml
filename: LOVEQIGU_FIRST_EVENT_MERCHANT_SCRIPT_V1.md
path: docs/product/merchant_event_engine/LOVEQIGU_FIRST_EVENT_MERCHANT_SCRIPT_V1.md
type: Merchant Sales Script
status: APPROVED_FOR_MERCHANT_SCRIPT_ARCHITECTURE
module: Merchant Event Engine
case: Loveqigu First Event Case
priority: P1
upstream:
  - MERCHANT_EVENT_ENGINE_V1.md
  - LOVEQIGU_FIRST_EVENT_CASE_V1.md
  - LOVEQIGU_FIRST_EVENT_ADMIN_CONFIG_V1.md
  - LOVEQIGU_FIRST_EVENT_MATERIALS_V1.md
downstream:
  - LOVEQIGU_FIRST_EVENT_TASKS_V1.md
  - LOVEQIGU_FIRST_EVENT_REVIEW_REPORT_V1.md
description: 定义爱企谷初见寻宝节面向商家的招商话术、参与说明、卡券配置说明、核销培训、活动复盘沟通和续费沟通话术。
```

核心作用：

```text
该文件是爱企谷初见寻宝节的商家招商与沟通话术标准。
它将活动方案转化为商家能听懂、能参与、能核销、能复盘、能续费的运营沟通工具。
```

---

## 3.5 MERCHANT_EVENT_ENGINE_ACTIVITY_NAMING_V1.md

```yaml
filename: MERCHANT_EVENT_ENGINE_ACTIVITY_NAMING_V1.md
path: docs/product/merchant_event_engine/MERCHANT_EVENT_ENGINE_ACTIVITY_NAMING_V1.md
type: Activity Naming Standard
status: APPROVED_FOR_ACTIVITY_NAMING
module: Merchant Event Engine
priority: P0
upstream:
  - MERCHANT_EVENT_ENGINE_V1.md
  - LOVEQIGU_FIRST_EVENT_CASE_V1.md
  - LOVEQIGU_FIRST_EVENT_ADMIN_CONFIG_V1.md
downstream:
  - MERCHANT_PORTAL_AND_PARK_ADMIN_V1.md
  - LOVEQIGU_FIRST_EVENT_DISPLAY_COPY_V1.md
description: 定义 AR游伴商家活动和景区活动中的祝福文化命名体系，将活动表达统一为接福、集福、纳福、福礼、福印等中国祝福文化符号。
```

核心作用：

```text
该文件是 merchant_event_engine 模块的活动命名规范。
统一对外推广、节庆活动、月度活动、商家活动、卡券权益、活动信物等用户端展示语言，将活动体系从“寻宝 / 卡券 / 打卡”升级为“接福 / 集福 / 纳福 / 福礼 / 福印”表达体系。
```

---

# 4. 建议后续登记文档

以下文档尚未创建，但建议后续按优先级逐步拆解并登记。

## 4.1 LOVEQIGU_FIRST_EVENT_ADMIN_CONFIG_V1.md

```yaml
filename: LOVEQIGU_FIRST_EVENT_ADMIN_CONFIG_V1.md
path: docs/product/merchant_event_engine/LOVEQIGU_FIRST_EVENT_ADMIN_CONFIG_V1.md
type: Admin Configuration Architecture
status: REGISTERED
priority: P0
note: 已登记，见 §3.3
```

---

## 4.2 LOVEQIGU_FIRST_EVENT_MATERIALS_V1.md

```yaml
filename: LOVEQIGU_FIRST_EVENT_MATERIALS_V1.md
path: docs/product/merchant_event_engine/LOVEQIGU_FIRST_EVENT_MATERIALS_V1.md
type: Offline Materials Spec
status: PLANNED
priority: P1
upstream:
  - LOVEQIGU_FIRST_EVENT_CASE_V1.md
description: 定义爱企谷初见寻宝节所需线下物料，包括活动主海报、商家门店台卡、探索点提示牌、核销说明卡、工作人员说明单、游客参与说明页。
```

建议优先级：

```text
P1
```

原因：

```text
首场活动必须依赖线下入口获取扫码量，因此物料文档是活动真实落地的重要支撑。
```

---

## 4.3 LOVEQIGU_FIRST_EVENT_MERCHANT_SCRIPT_V1.md

```yaml
filename: LOVEQIGU_FIRST_EVENT_MERCHANT_SCRIPT_V1.md
path: docs/product/merchant_event_engine/LOVEQIGU_FIRST_EVENT_MERCHANT_SCRIPT_V1.md
type: Merchant Sales Script
status: REGISTERED
priority: P1
note: 已登记，见 §3.4
```

---

## 4.4 LOVEQIGU_FIRST_EVENT_TASKS_V1.md

```yaml
filename: LOVEQIGU_FIRST_EVENT_TASKS_V1.md
path: docs/product/merchant_event_engine/LOVEQIGU_FIRST_EVENT_TASKS_V1.md
type: Execution Task Breakdown
status: PLANNED
priority: P1
upstream:
  - LOVEQIGU_FIRST_EVENT_CASE_V1.md
description: 定义爱企谷初见寻宝节从准备、招商、配置、物料、上线、运营、核销、复盘到续费的执行任务清单。
```

建议优先级：

```text
P1
```

原因：

```text
该文档将活动方案拆成真实执行动作，适合后续交给运营、产品、Codex/Cursor 或项目管理工具执行。
```

---

## 4.5 LOVEQIGU_FIRST_EVENT_REVIEW_REPORT_V1.md

```yaml
filename: LOVEQIGU_FIRST_EVENT_REVIEW_REPORT_V1.md
path: docs/product/merchant_event_engine/LOVEQIGU_FIRST_EVENT_REVIEW_REPORT_V1.md
type: Event Review Report Template
status: PLANNED
priority: P2
upstream:
  - LOVEQIGU_FIRST_EVENT_CASE_V1.md
description: 定义爱企谷初见寻宝节活动结束后的复盘报告结构，包括游客参与数据、探索点数据、卡券领取、卡券核销、商家反馈、景区反馈、问题记录和下一期建议。
```

建议优先级：

```text
P2
```

原因：

```text
该文档适合在活动上线前准备模板，活动结束后填充真实数据，形成对商家和景区的续费依据。
```

---

# 5. 文档关系图

```text
MERCHANT_EVENT_ENGINE_INDEX_V1
│
├── MERCHANT_EVENT_ENGINE_V1
│   └── 定义商家活动引擎总架构
│
├── MERCHANT_EVENT_ENGINE_ACTIVITY_NAMING_V1  ← 已登记
│   └── 定义活动祝福文化命名体系（接福 / 集福 / 纳福 / 福礼 / 福印）
│
└── LOVEQIGU_FIRST_EVENT_CASE_V1
    └── 定义爱企谷首场活动样板
        │
        ├── LOVEQIGU_FIRST_EVENT_ADMIN_CONFIG_V1  ← 已登记
        ├── LOVEQIGU_FIRST_EVENT_MATERIALS_V1
        ├── LOVEQIGU_FIRST_EVENT_MERCHANT_SCRIPT_V1  ← 已登记
        ├── LOVEQIGU_FIRST_EVENT_TASKS_V1
        └── LOVEQIGU_FIRST_EVENT_REVIEW_REPORT_V1
```

---

# 6. 继承规则

所有后续 merchant_event_engine 模块文档必须继承以下规则：

```text
1. 不得把商家定义为普通广告位。
2. 不得把卡券做成用户端一级优惠券商城。
3. 不得让活动信物污染主线信物体系。
4. 不得让数字藏品承担主线剧情推进功能。
5. 不得承诺数字藏品金融价值、升值空间或投资属性。
6. 不得绕开活动数据复盘。
7. 不得跳过商家核销数据。
8. 不得破坏 AR游伴的东方探索感。
9. 不得修改主线信物、数字藏品、权益中心、探索点等既有规则文件，除非另有专项审批。
10. 所有活动案例都必须明确上游来源、状态、MVP 边界和验收标准。
```

---

# 7. 后续执行优先级

建议后续执行顺序：

```text
1. LOVEQIGU_FIRST_EVENT_MATERIALS_V1
2. LOVEQIGU_FIRST_EVENT_TASKS_V1
3. LOVEQIGU_FIRST_EVENT_REVIEW_REPORT_V1
```

当前最优先建议：

```text
LOVEQIGU_FIRST_EVENT_TASKS_V1
```

原因：

```text
商家招商话术已完成，下一步需要将活动方案拆解为可执行任务清单，支撑运营落地。
```

---

# 8. 当前结论

```text
MERCHANT_EVENT_ENGINE_INDEX_V1 = ACTIVE_INDEX
MERCHANT_EVENT_ENGINE_V1 = REGISTERED
MERCHANT_EVENT_ENGINE_ACTIVITY_NAMING_V1 = REGISTERED
LOVEQIGU_FIRST_EVENT_CASE_V1 = REGISTERED
LOVEQIGU_FIRST_EVENT_ADMIN_CONFIG_V1 = REGISTERED
LOVEQIGU_FIRST_EVENT_MERCHANT_SCRIPT_V1 = REGISTERED
```

该索引已登记 5 份核心文档，merchant_event_engine 模块具备继续扩展物料、任务、复盘文档的基础。
