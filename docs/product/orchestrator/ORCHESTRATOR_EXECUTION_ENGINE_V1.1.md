# ORCHESTRATOR_EXECUTION_ENGINE_V1

STATUS

FROZEN

CURRENT_ACTIVE = V1.1
LEGACY = V1

VERSION

V1.1

LEVEL

P0

AUTOMATION_CORE

SYSTEM_BRAIN

---

# 一、定位

ORCHESTRATOR

=

自动化体系唯一调度中心

---

负责：

任务调度

任务排序

任务分发

重试控制

审批流控制

发布控制

---

不负责：

内容生产

视觉生产

代码执行

资产生成

---

# 二、架构位置

ENTITY

↓

MASTER_REGISTRY

↓

ORCHESTRATOR

↓

CONTENT_FACTORY

VISUAL_FACTORY

↓

REVIEW_GATE

↓

RUNTIME

---

# 三、核心原则

Factory负责生产

Orchestrator负责调度

Review负责验收

Runtime负责运行

---

# 四、输入

读取：

MASTER_REGISTRY

REGISTRY_EVENT

TASK_QUEUE

REVIEW_RESULT

RUNTIME_STATUS

---

# 五、输出

创建任务

分配任务

更新状态

触发审查

触发发布

---

# 六、执行引擎

统一状态机：

PENDING

↓

READY

↓

QUEUED

↓

RUNNING

↓

REVIEW

↓

APPROVED

↓

PUBLISHED

---

失败：

FAILED

↓

RETRY

↓

FAILED_FINAL

---

# 七、优先级系统

P0

系统级

---

P1

景区上线

---

P2

内容生产

---

P3

优化任务

---

执行顺序：

P0 > P1 > P2 > P3

---

# 八、任务路由

GENERATE_STORY

→ CONTENT_FACTORY

---

GENERATE_AR

→ CONTENT_FACTORY

---

GENERATE_ROUTE

→ CONTENT_FACTORY

---

GENERATE_RELIC

→ CONTENT_FACTORY

---

GENERATE_PROMPT

→ VISUAL_FACTORY

---

GENERATE_IMAGE

→ VISUAL_FACTORY

---

GENERATE_VIDEO

→ VISUAL_FACTORY

---

GENERATE_REVIEW

→ REVIEW_GATE

---

# 九、执行器层

EXECUTION_LAYER

正式独立

---

允许：

Cursor

Codex

Gemini

ChatGPT

豆包

Seedream

Minimax

---

Orchestrator

不直接调用工具

只分配任务

---

# 十、重试机制

默认：

retry_limit = 3

---

失败：

自动重试

---

连续失败：

FAILED_FINAL

---

进入人工审查

---

# 十一、审批机制

REVIEW_REQUIRED

= TRUE

---

禁止跳过

---

任何内容：

Story

AR

Relic

Prompt

Image

Video

必须审查

---

# 十二、发布机制

AUTO_PUBLISH

DEFAULT = FALSE

---

生产环境：

人工批准

↓

发布

---

测试环境：

允许自动发布

---

# 十三、事件总线

ENTITY_CREATED

ENTITY_UPDATED

ENTITY_APPROVED

ENTITY_PUBLISHED

ENTITY_ARCHIVED

---

触发：

ORCHESTRATOR_EVENT

---

# 十四、景区自动化示例

创建：

SCENIC_ENTITY

↓

MASTER_REGISTRY

↓

ORCHESTRATOR

↓

生成路线任务

↓

生成探索点任务

↓

生成剧情任务

↓

生成AR任务

↓

生成信物任务

↓

生成视觉任务

↓

审查

↓

发布

---

# 十五、视觉自动化链

VISUAL_FACTORY

↓

Prompt生成

↓

豆包出图

↓

Gemini出图

↓

评分

↓

Prompt优化

↓

资产冻结

↓

ART_ASSET_REGISTRY

---

# 十六、人工干预点

允许：

PAUSE

RESUME

CANCEL

RETRY

APPROVE

REJECT

---

# 十七、治理规则

所有状态变更

必须记录：

AI_DECISION_LOG

---

所有发布

必须记录：

CHANGELOG

---

# 十八、最终目标

新增一个景区

↓

创建SCENIC_ENTITY

↓

MASTER_REGISTRY登记

↓

ORCHESTRATOR自动拆解任务

↓

CONTENT_FACTORY生产内容

↓

VISUAL_FACTORY生产资产

↓

REVIEW_GATE验收

↓

RUNTIME发布

---

# 十九、冻结结论

ORCHESTRATOR

=

全系统唯一调度中心

---

CONTENT_FACTORY

=

内容生产中心

---

VISUAL_FACTORY

=

视觉生产中心

---

REVIEW_GATE

=

质量控制中心

---

RUNTIME

=

最终运行环境

---

STATUS

FROZEN