# ART_RUNTIME_DEPLOYMENT_V1

STATUS

FROZEN

VERSION

V1.0

DATE

2026-06-13

OWNER

LOVEQIGU

LEVEL

TECH_ART_INTEGRATION_CANON

PRIORITY

P0

---

# 一、文件定位

本文件定义：

LOVEQIGU

视觉资产部署体系。

---

目标：

实现：

Prompt

↓

Asset

↓

Registry

↓

Runtime

↓

User

完整闭环。

---

本文件是：

LOVEQIGU_VISUAL_FACTORY

与

LOVEQIGU_RUNTIME

之间的桥梁。

---

# 二、核心原则

最终目标不是：

Prompt通过。

---

不是：

图片通过。

---

而是：

用户扫码后体验成立。

---

正式定义：

USER_EXPERIENCE_FIRST_RULE

---

# 三、标准流程

世界观

↓

Prompt

↓

出图

↓

评分

↓

Prompt冻结

↓

资产冻结

↓

资产注册

↓

Runtime验证

↓

真机验证

↓

正式发布

---

# 四、Asset Freeze

来源：

VISUAL_FACTORY

---

要求：

ASSET_STATUS = FROZEN

---

输出：

master_asset.png

---

# 五、Asset Registration

新增：

ART_REGISTRY

---

生成：

asset_id

---

标准：

asset_xxxxx

---

记录：

资产类型

版本

来源

冻结时间

---

# 六、Relic Binding

自动绑定：

asset_id

↓

relic_id

---

示例：

asset_001

↓

jiao_star_001

---

# 七、Atlas Binding

自动绑定：

asset_id

↓

atlas_id

---

确保：

图鉴系统

自动识别。

---

# 八、Blessing Binding

自动绑定：

asset_id

↓

blessing_id

---

确保：

祝福系统

自动识别。

---

# 九、Manifest Build

自动生成：

runtime_manifest.json

---

包含：

asset_id

relic_id

atlas_id

blessing_id

version

status

publish_time

---

# 十、Runtime Preview

自动部署：

Preview Runtime

---

验证：

图鉴显示

---

验证：

祝福显示

---

验证：

显现页显示

---

验证：

缩略图显示

---

验证：

移动端显示

---

# 十一、Runtime Scorecard

建立：

RUNTIME_SCORECARD

---

图鉴可读性

≥85

---

信物识别度

≥85

---

缩略图识别度

≥80

---

移动端适配

≥90

---

全部通过：

RUNTIME_PASS

---

# 十二、Device Validation

必须：

真机验证

---

设备：

iPhone

Android

---

流程：

扫码

↓

显现

↓

获得信物

↓

图鉴点亮

↓

祝福触发

---

全部通过：

DEVICE_PASS

---

# 十三、Production Release

自动发布：

Runtime

---

自动同步：

图鉴

---

自动同步：

探索系统

---

自动同步：

祝福系统

---

自动同步：

后台资产库

---

# 十四、Runtime目录结构

runtime/

├─ relics/

├─ atlas/

├─ blessings/

├─ manifestations/

├─ manifests/

---

# 十五、Registry目录结构

registry/

├─ assets.json

├─ relic_bindings.json

├─ atlas_bindings.json

├─ blessing_bindings.json

---

# 十六、回滚机制

新增：

ROLLBACK_ENGINE

---

触发：

Runtime FAIL

---

自动：

回滚上一版本

---

记录：

deployment_history.json

---

# 十七、Release Gate

同时满足：

ASSET_FROZEN

---

RUNTIME_PASS

---

DEVICE_PASS

---

才能：

RELEASE

---

# 十八、自动化发布链

冻结资产

↓

自动注册

↓

自动绑定

↓

自动生成Manifest

↓

自动部署Preview

↓

自动验收

↓

自动发布

---

# 十九、验收标准

最终验收必须成立：

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

体验完成

---

否则：

FAIL

---

# 二十、与自动驾驶体系关系

上游：

VISUAL_AUTOPILOT_HUMAN_ALIGNMENT_V1

VISUAL_AUTOPILOT_USAGE_GOVERNANCE_V1

VISUAL_AUTOPILOT_RETRY_V1

VISUAL_SCORECARD_V1

PROMPT_EVOLUTION_TREE_V1

---

下游：

LOVEQIGU_RUNTIME

EXPLORE_SYSTEM

BLESSING_SYSTEM

ATLAS_SYSTEM

---

# 二十一、冻结结论

ART_RUNTIME_DEPLOYMENT_V1

正式冻结。

---

LOVEQIGU

正式完成：

Prompt工厂

↓

视觉工厂

↓

Runtime工厂

自动化闭环。

---

STATUS

FROZEN
