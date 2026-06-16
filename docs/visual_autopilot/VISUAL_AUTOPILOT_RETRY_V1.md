# VISUAL_AUTOPILOT_RETRY_V1

STATUS

FROZEN

VERSION

V1.0

DATE

2026-06-13

OWNER

LOVEQIGU

LEVEL

AUTOPILOT_CORE_ENGINE

PRIORITY

P1

---

# 一、文件定位

本文件定义：

LOVEQIGU

视觉自动驾驶系统

自动重试与Prompt进化引擎。

---

目标：

让系统具备：

自动发现问题

自动修正Prompt

自动重新生成

自动达标冻结

能力。

---

# 二、核心原则

目标不是：

优化Prompt。

---

目标是：

获得可上线视觉资产。

---

Prompt只是：

中间工具。

---

最终交付：

Runtime可用资产。

---

# 三、标准流程

世界观规范

↓

视觉规范

↓

Prompt生成

↓

多模型出图

↓

自动评分

↓

问题诊断

↓

Prompt修正

↓

再次生成

↓

连续达标

↓

Prompt冻结

↓

资产冻结

↓

Runtime发布

---

# 四、多模型生成层

统一支持：

ChatGPT

Gemini

豆包

Flux

即梦

可灵

---

输出：

Candidate Assets

---

# 五、评分体系

统一采用：

VISUAL_SCORECARD

---

东方感

> =85

---

信物感

> =85

---

古籍感

> =85

---

显现感

> =80

---

游戏化风险

<=20

---

凤凰化风险

<=10

---

神兽化风险

<=10

---

# 六、Retry Trigger

触发条件：

任意指标不达标。

---

触发：

RETRY

---

# 七、Prompt Diagnosis

自动识别问题。

---

案例A

凤凰化

---

自动追加：

NO bird

NO phoenix

NO feathers

NO beak

---

案例B

纪念币化

---

自动追加：

not coin

not medal

not commemorative token

---

案例C

游戏化

---

自动追加：

not RPG

not game item

not equipment

---

案例D

知识感不足

---

自动追加：

ancient manuscript

astronomical archive

historical celestial atlas

---

案例E

信物感不足

---

自动追加：

jade relic

bronze seal

archaeological artifact

museum collection

---

# 八、Prompt Evolution Tree

建立：

Prompt V1

↓

Prompt V2

↓

Prompt V3

↓

Prompt V4

---

禁止覆盖旧版本。

---

全部保留。

---

形成：

Prompt Evolution History

---

# 九、连续达标机制

STABILITY_GATE

---

单次PASS

不允许冻结。

---

必须：

连续3轮PASS

---

且：

风险指标全部达标

---

才允许：

PROMPT_FREEZE

---

# 十、人类偏好对齐

接入：

VISUAL_AUTOPILOT_HUMAN_ALIGNMENT_V1

---

评分权重：

Gemini

70%

---

Human

30%

---

样本量超过500后：

Gemini

50%

---

Human

50%

---

# 十一、Prompt冻结条件

同时满足：

连续3轮PASS

---

人工无重大异议

---

风险项达标

---

输出：

PROMPT_STATUS = FROZEN

---

# 十二、资产冻结条件

同时满足：

Prompt冻结

---

资产评分达标

---

Runtime预览通过

---

真机验收通过

---

输出：

ASSET_STATUS = FROZEN

---

# 十三、自动注册

冻结后自动：

生成 asset_id

↓

绑定 relic_id

↓

绑定 atlas_id

↓

绑定 blessing_id

↓

登记 registry

↓

登记 history

↓

登记 governance

---

# 十四、自动发布

通过后自动：

进入 Runtime

---

进入图鉴

---

进入祝福系统

---

进入探索系统

---

进入后台资产库

---

# 十五、失败处理

连续5轮Retry失败：

自动进入：

HUMAN_REVIEW_QUEUE

---

生成：

FAILURE_ANALYSIS_REPORT

---

等待人工介入。

---

# 十六、治理规则

禁止：

无限Retry

---

最大Retry次数：

5

---

超过：

自动暂停

---

记录：

usage.json

---

写入：

governance_log

---

# 十七、最终目标

不是：

Prompt越来越好。

---

而是：

资产越来越好。

---

Prompt只是工具。

---

最终目标：

用户扫码

↓

显现动画

↓

获得信物

↓

图鉴点亮

↓

祝福触发

↓

体验成立

---

# 十八、冻结结论

VISUAL_AUTOPILOT_RETRY_V1

正式冻结。

---

VISUAL_AUTOPILOT

从：

自动出图

升级为：

自动学习

自动优化

自动冻结

自动发布

---

STATUS

FROZEN
