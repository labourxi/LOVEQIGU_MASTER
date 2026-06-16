# CONTENT_FACTORY_MASTER_ARCHITECTURE_V1

STATUS

FROZEN

VERSION

V1.0

DATE

2026-06-13

OWNER

LOVEQIGU

LEVEL

MASTER_ARCHITECTURE

PRIORITY

P0

---

# 一、文件定位

本文件定义：

LOVEQIGU_CONTENT_ENGINE_V2

总体架构。

---

本文件是：

LOVEQIGU

全部内容生产体系

最高级母架构。

---

优先级高于：

WORLD_FACTORY

VISUAL_FACTORY

PROMPT_FACTORY

RUNTIME_FACTORY

---

# 二、核心目标

实现：

最少人工参与

最大自动化生产

持续内容增长

---

最终目标：

用户负责方向

AI负责生产

系统负责上线

---

# 三、核心原则

正式冻结：

CONTENT_FIRST_RULE

---

目标不是：

生成Prompt

---

不是：

生成图片

---

不是：

生成文档

---

目标是：

生成用户体验

---

最终交付：

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

体验完成

---

# 四、总体架构

CONTENT_ENGINE

├─ PRODUCT_FACTORY

├─ STORY_FACTORY

├─ RELIC_FACTORY

├─ VISUAL_FACTORY

├─ BLESSING_FACTORY

├─ ATLAS_FACTORY

├─ RUNTIME_FACTORY

└─ GOVERNANCE_FACTORY

---

# 五、PRODUCT_FACTORY

职责：

探索点生产。

---

输入：

景区

地标

探索点

文化内容

---

输出：

poi_id

---

示例：

化城寺

↓

poi_id

---

# 六、STORY_FACTORY

职责：

内容生产。

---

自动生成：

发现文本

显现文本

故事文本

图鉴文本

---

输出：

story_id

---

# 七、RELIC_FACTORY

职责：

信物生产。

---

自动生成：

星

宿

四象

天

人

太极

---

输出：

relic_id

---

# 八、VISUAL_FACTORY

职责：

视觉资产生产。

---

调用：

Prompt Engine

↓

多模型生成

↓

自动评分

↓

自动重试

↓

自动冻结

---

输出：

asset_id

---

# 九、BLESSING_FACTORY

职责：

祝福生产。

---

自动生成：

祝福内容

祝福等级

祝福表现

---

输出：

blessing_id

---

# 十、ATLAS_FACTORY

职责：

图鉴生产。

---

自动生成：

图鉴页

卷轴页

星图页

成长页

---

输出：

atlas_id

---

# 十一、RUNTIME_FACTORY

职责：

Runtime发布。

---

自动绑定：

asset_id

↓

relic_id

↓

atlas_id

↓

blessing_id

---

输出：

runtime_manifest

---

# 十二、GOVERNANCE_FACTORY

职责：

治理。

---

自动执行：

审计

版本控制

冻结

回滚

日志

---

输出：

governance_log

---

# 十三、自动化总流程

新增探索点

↓

生成内容

↓

生成信物

↓

生成祝福

↓

生成Prompt

↓

多模型出图

↓

自动评分

↓

自动优化

↓

自动冻结

↓

生成图鉴

↓

自动绑定

↓

Runtime发布

↓

用户可见

---

# 十四、AI角色分工

ChatGPT

负责：

架构

Prompt

评审

治理

---

Gemini

负责：

视觉生成

视觉评分

---

豆包

负责：

视觉生成

风格补充

---

Cursor

负责：

文件

索引

同步

注册

---

Codex

负责：

自动化实现

脚本

Runtime接入

---

# 十五、用户角色

当前：

用户参与约70%

---

目标：

用户参与≤20%

---

最终：

用户参与≤5%

---

用户职责：

确定方向

审批结果

批准发布

---

# 十六、自动驾驶层

已接入：

VISUAL_AUTOPILOT_HUMAN_ALIGNMENT_V1

VISUAL_AUTOPILOT_USAGE_GOVERNANCE_V1

VISUAL_AUTOPILOT_RETRY_V1

VISUAL_SCORECARD_V1

PROMPT_EVOLUTION_TREE_V1

ART_RUNTIME_DEPLOYMENT_V1

---

# 十七、未来总控层

新增：

CONTENT_ORCHESTRATOR_V1

---

职责：

统一调度：

PRODUCT_FACTORY

STORY_FACTORY

RELIC_FACTORY

VISUAL_FACTORY

BLESSING_FACTORY

ATLAS_FACTORY

RUNTIME_FACTORY

GOVERNANCE_FACTORY

---

成为：

LOVEQIGU_CONTENT_ENGINE

中央编排器。

---

# 十八、成熟度模型

WORLD_FACTORY

100%

---

PROMPT_FACTORY

90%

---

VISUAL_FACTORY

85%

---

RUNTIME_FACTORY

60%

---

CONTENT_ENGINE

20%

---

目标：

CONTENT_ENGINE

100%

---

# 十九、最终验收标准

最终验收不是：

Prompt通过

---

不是：

图片通过

---

不是：

文档通过

---

而是：

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

全部通过：

CONTENT_ENGINE_PASS

---

# 二十、冻结结论

CONTENT_FACTORY_MASTER_ARCHITECTURE_V1

正式冻结。

---

LOVEQIGU

正式进入：

CONTENT_ENGINE_V2

建设阶段。

---

STATUS

FROZEN
