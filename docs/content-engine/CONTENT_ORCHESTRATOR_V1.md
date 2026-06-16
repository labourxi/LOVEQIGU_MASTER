# CONTENT_ORCHESTRATOR_V1

STATUS

FROZEN

VERSION

V1.1

DATE

2026-06-13

OWNER

LOVEQIGU

LEVEL

CONTENT_ENGINE_CORE

PRIORITY

P0

---

# 一、文件定位

本文件定义：

LOVEQIGU

内容总编排器。

---

定位：

全部工厂之上的中央调度系统。

---

职责：

接收任务

↓

判断价值

↓

拆解任务

↓

分配工厂

↓

控制资源

↓

推动发布

↓

完成用户体验

---

# 二、核心原则

正式冻结：

EXPERIENCE_FIRST_RULE

---

目标不是：

生成Prompt

生成图片

生成文档

生成资产

---

目标是：

生成完整用户体验

---

最终验收：

用户扫码

↓

显现

↓

获得信物

↓

图鉴点亮

↓

祝福触发

↓

体验成立

---

# 三、总体架构

CONTENT_ORCHESTRATOR

├─ Task Parser

├─ Task Planner

├─ Decision Engine

├─ Project Stage Manager

├─ Resource Controller

├─ Factory Dispatcher

├─ Dependency Manager

├─ Retry Manager

├─ Approval Gate

├─ Release Manager

├─ Orchestrator Memory

└─ Execution Bridge

---

# 四、Task Parser

职责：

解析用户任务。

---

输入：

新增景区

新增探索点

新增信物

新增视觉资产

新增章节

---

输出：

标准任务对象。

---

# 五、Task Planner

职责：

自动拆解任务。

---

示例：

新增角宿一

↓

故事

↓

信物

↓

祝福

↓

图鉴

↓

视觉资产

↓

Runtime

---

# 六、Decision Engine

新增。

---

职责：

判断任务是否值得执行。

---

评估：

必要性

ROI

当前阶段适配度

资产冲突风险

内容重复风险

资源占用

---

输出：

APPROVE

DEFER

REJECT

---

# 七、Project Stage Manager

新增。

---

职责：

感知项目阶段。

---

例如：

视觉验证阶段

↓

禁止批量生产164星

---

上线阶段

↓

允许批量生成

---

输出：

STAGE_PERMISSION

---

# 八、Resource Controller

新增。

---

职责：

控制成本。

---

记录：

Gemini额度

豆包额度

Seedance额度

ChatGPT额度

人工审查预算

---

规则：

超预算

↓

自动暂停

---

禁止：

无限生成

---

# 九、Factory Dispatcher

职责：

派发任务。

---

支持：

PRODUCT_FACTORY

STORY_FACTORY

RELIC_FACTORY

VISUAL_FACTORY

BLESSING_FACTORY

ATLAS_FACTORY

RUNTIME_FACTORY

GOVERNANCE_FACTORY

---

# 十、Dependency Manager

职责：

依赖控制。

---

例如：

视觉资产

必须等待

信物定义完成

---

否则：

BLOCK

---

# 十一、Retry Manager

职责：

失败重试。

---

调用：

VISUAL_AUTOPILOT_RETRY_V1

PROMPT_EVOLUTION_TREE_V1

---

自动修正。

---

# 十二、Approval Gate

职责：

审批控制。

---

低风险：

自动审批

---

高风险：

人工审批

---

# 十三、Release Manager

职责：

发布控制。

---

调用：

ART_RUNTIME_DEPLOYMENT_V1

---

自动：

生成Manifest

部署Preview

正式发布

---

# 十四、Orchestrator Memory

职责：

长期记忆。

---

记录：

历史任务

历史失败

历史成功

资产关系

Prompt冠军版本

最佳模型组合

---

用于：

持续优化。

---

# 十五、Execution Bridge

新增。

---

职责：

连接：

ChatGPT

Cursor

Codex

Gemini

豆包

Runtime

---

输出：

执行任务。

---

例如：

生成Cursor任务

↓

生成Codex任务

↓

自动验收

↓

自动回写状态

---

# 十六、自动化成熟度

Level 0

全部人工

---

Level 1

AI辅助

---

Level 2

自动工厂

---

Level 3

自动编排

---

Level 4

自动运营

---

当前：

Level 2.5

---

目标：

Level 3

---

# 十七、用户参与度

当前：

约70%

---

目标：

≤20%

---

最终：

≤5%

---

用户仅负责：

方向

审批

验收

---

# 十八、执行顺序

Phase 1

Task Parser

Task Planner

Factory Dispatcher

---

Phase 2

Decision Engine

Project Stage Manager

Resource Controller

---

Phase 3

Retry Manager

Approval Gate

Release Manager

---

Phase 4

Execution Bridge

Orchestrator Memory

---

# 十九、最终目标

未来：

用户输入：

新增角宿一

---

系统自动：

生成故事

↓

生成信物

↓

生成祝福

↓

生成图鉴

↓

生成视觉资产

↓

评分

↓

优化

↓

冻结

↓

注册

↓

发布

↓

用户可见

---

# 二十、冻结结论

CONTENT_ORCHESTRATOR_V1

正式冻结。

---

LOVEQIGU_CONTENT_ENGINE_V2

正式拥有：

中央编排能力。

---

STATUS

FROZEN
