# EXPLORATION_NODE_MODEL_V1

STATUS

FROZEN

VERSION

V1.1

DATE

2026-06-14

LEVEL

P0

CORE_DATA_MODEL

---

# 一、核心原则

正式冻结：

ENTITY

≠

NODE

---

ENTITY

主数据层（Master Data）

---

NODE

运行时层（Runtime）

---

一切业务对象先定义为 ENTITY。

进入探索画布后映射为 NODE。

---

# 二、实体层（MASTER ENTITY LAYER）

正式冻结：

SCENIC

景区实体

---

POINT

探索点实体

---

MERCHANT

商家实体

---

ROUTE

路线实体

---

STORY

剧情实体

---

RELIC

信物实体

---

COLLECTION

数字藏品实体

---

BENEFIT

权益实体

---

CONSTELLATION

星宿实体

---

STAR

星实体

---

MERIDIAN

经络实体

---

ACUPOINT

穴位实体

---

# 三、运行时节点层（RUNTIME NODE LAYER）

正式冻结：

SCENIC_NODE

---

POINT_NODE

---

ROUTE_NODE

---

AR_NODE

---

STORY_NODE

---

RELIC_NODE

---

COLLECTION_NODE

---

BENEFIT_NODE

---

MERCHANT_NODE

---

CONSTELLATION_NODE

---

STAR_NODE

---

MERIDIAN_NODE

---

ACUPOINT_NODE

---

# 四、统一节点结构

{
"id":"",
"type":"",
"name":"",
"domain":"",
"status":"",
"parent_id":"",
"children":[],
"relations":[],
"unlock_rules":[],
"assets":{},
"rewards":{},
"factory_hooks":[]
}

---

# 五、Domain归属体系

正式冻结：

AZURE_DRAGON

---

VERMILION_BIRD

---

WHITE_TIGER

---

BLACK_TORTOISE

---

LUNG_MERIDIAN

---

HEART_MERIDIAN

---

SPLEEN_MERIDIAN

---

LIVER_MERIDIAN

---

其它经络体系

---

示例：

{
"domain":"AZURE_DRAGON"
}

---

# 六、节点状态

LOCKED

未发现

---

AVAILABLE

可探索

---

ACTIVE

当前目标

---

DISCOVERED

已发现

---

COMPLETE

已完成

---

# 七、关系模型

LOCATED_IN

位于

---

UNLOCKS

解锁

---

BELONGS_TO

归属

---

REQUIRES

前置条件

---

RESONATES_WITH

共鸣

---

COMBINES_TO

合成

---

HAS_AR

关联AR

---

HAS_ROUTE

关联路线

---

HAS_RELIC

关联信物

---

HAS_BENEFIT

关联权益

---

# 八、路线模型

ROUTE_ENTITY

↓

ROUTE_NODE

---

示例：

泉眼路线

↓

泉眼

↓

大树

↓

古码头

↓

望江台

---

路线优先于单节点。

---

# 九、Point 与 AR 分离

正式冻结：

POINT_NODE

≠

AR_NODE

---

一个探索点

允许多个AR事件。

---

示例：

泉眼

↓

AR显现V1

↓

AR显现V2

↓

节日AR

---

关系：

POINT_NODE

HAS_AR

AR_NODE

---

# 十、商家模型

MERCHANT

实体层

---

MERCHANT_NODE

运行时层

---

允许挂载：

优惠券

联名活动

兑换权益

商家任务

---

禁止直接挂入：

RELIC_LAYER

---

# 十一、奖励模型

{
"relics":[],
"collections":[],
"benefits":[],
"blessings":[]
}

---

正式冻结：

数字藏品

进入：

collections

---

信物

进入：

relics

---

权益

进入：

benefits

---

# 十二、剧情绑定

{
"chapter":"",
"scene":"",
"event":""
}

---

示例：

CH07

↓

回响之路

↓

泉眼事件

↓

获得青龙残卷

---

# 十三、地理绑定

POINT_NODE

必须支持：

{
"lat":"",
"lng":"",
"radius":""
}

---

用于：

GPS

导航

AR触发

---

# 十四、AR绑定

{
"trigger_type":"",
"trigger_value":""
}

---

支持：

GPS

扫码

图片识别

地标识别

---

# 十五、Node Template

新增：

NODE_TEMPLATE

---

POINT_TEMPLATE

自动生成：

POINT_NODE

AR_NODE

RELIC_NODE

STORY_BINDING

REWARD_BINDING

FACTORY_HOOKS

---

SCENIC_TEMPLATE

自动生成：

SCENIC_NODE

ROUTE_NODE

POINT_NODE占位

景区进度结构

---

# 十六、Factory Hooks

正式冻结：

{
"factory_hooks":[
"story_generate",
"ar_generate",
"relic_generate",
"art_generate"
]
}

---

用途：

进入内容工厂自动链。

---

# 十七、内容工厂映射

新增探索点

↓

创建节点

↓

生成剧情占位

↓

生成AR占位

↓

生成信物占位

↓

生成美术需求单

↓

进入审查

↓

发布Runtime

---

# 十八、扩容原则

支持：

10节点

100节点

1000节点

10000节点

---

方式：

按层加载

按区域加载

按关系加载

---

禁止：

一次性加载全部节点

---

# 十九、核心原则

正式冻结：

NODE

=

系统最小运行单位

---

ENTITY

=

系统最小业务单位

---

CONTENT_FACTORY

=

节点自动生成系统

---

EXPLORE_CANVAS

=

节点运行系统

---

# 二十、架构关系

MASTER ENTITY

↓

NODE TEMPLATE

↓

RUNTIME NODE

↓

CONTENT FACTORY

↓

EXPLORE CANVAS

↓

HOME

EXPLORE

AR

ATLAS

BENEFIT

PROFILE

---

# 二十一、冻结结论

EXPLORATION_NODE_MODEL_V1

正式冻结

STATUS

FROZEN
