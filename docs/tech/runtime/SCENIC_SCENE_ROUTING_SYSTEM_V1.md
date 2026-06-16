# SCENIC_SCENE_ROUTING_SYSTEM_V1

Version: V1

Status: FREEZE

Owner: LOVEQIGU TECH

---

# 一、文档目标

定义 LOVEQIGU 多景区运行架构。

支持：

一个平台

多个景区

多个内容包

多个商业合作方

统一运行。

---

# 二、核心原则

LOVEQIGU不是单景区系统。

LOVEQIGU是：

景区容器平台。

---

所有景区：

共享Runtime。

---

但拥有：

独立入口

独立首页

独立地图

独立信物

独立权益

独立AR内容

---

# 三、用户入口

用户扫描：

景区专属二维码

↓

进入小程序

↓

自动识别景区

↓

加载对应内容包

↓

进入景区专属首页

---

# 四、二维码规范

二维码必须携带：

scene参数

例如：

scene=aiqigu

scene=jiuhuashan

scene=laojunshan

scene=wuhouci

---

禁止：

所有景区共用同一个入口页面。

---

# 五、景区内容包结构

data/scenes/

---

示例：

data/scenes/aiqigu/

---

包含：

scene.json

home.json

map.json

relics.json

rights.json

ar.json

---

# 六、首页加载逻辑

进入系统

↓

读取scene

↓

加载对应景区配置

↓

生成首页

---

例如：

scene=aiqigu

↓

加载AIQIGU首页

---

scene=jiuhuashan

↓

加载九华山首页

---

# 七、地图加载逻辑

每个景区：

拥有独立地图。

---

禁止：

不同景区共用探索地图。

---

# 八、信物加载逻辑

每个景区：

拥有独立信物体系。

---

例如：

爱企谷：

万象之印

---

九华山：

地藏体系

---

老君山：

道家体系

---

# 九、权益加载逻辑

每个景区：

拥有独立权益体系。

---

例如：

爱企谷：

茶饮券

烧烤券

商家优惠

---

九华山：

景区权益

文创权益

商户权益

---

# 十、AR加载逻辑

每个景区：

拥有独立AR内容。

---

禁止：

统一NPC。

---

禁止：

统一神灵。

---

遵守：

ART_02_AR_CULTURAL_EXPERIENCE_MODEL_V1

---

# 十一、商业合作原则

景区拥有：

独立入口。

---

景区游客：

优先停留在本景区内容体系。

---

禁止：

将A景区流量直接导入B景区。

---

# 十二、未来扩展

新增景区时：

无需修改Runtime。

---

仅新增：

景区内容包。

---

即可上线。

---

# 十三、样板景区

当前样板：

AIQIGU

爱企谷健康生态小镇

---

Scene ID：

aiqigu

---

状态：

ACTIVE_SAMPLE

---

# 十四、冻结结论

LOVEQIGU采用：

景区专属入口

+

景区专属首页

+

景区专属内容包

运行模式。

支持未来：

100+

景区接入。

FREEZE.