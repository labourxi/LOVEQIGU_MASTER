# VISUAL_REVELATION_ENGINE_SPEC_V1（视觉显现引擎）

## 一、系统定义

本系统定义"视觉不是展示，而是世界显现过程"的统一状态模型。

所有 UI / AR / 信物 / 探索内容，均属于同一显现引擎的不同状态表达。

---

## 二、核心理念

```text
UI = 世界显现状态
不是界面
不是功能
```

---

## 三、三态显现模型（核心）

### STATE_0：未显现（Landing）

关键词：

* 未展开
* 未被阅读
* 世界潜伏

视觉表达：

* 雾
* 星点
* 低对比轮廓
* 极少信息

规则：

* 不允许信息结构
* 不允许列表
* 不允许搜索
* 不允许内容承载

---

### STATE_1：半显现（Explore）

关键词：

* 世界正在被理解
* 线索出现
* 城市被阅读

视觉表达：

* 卡片
* 城市标签
* 弱叙事文本
* 探索路径

规则：

* 允许轻信息结构
* 允许卡片流
* 允许轻搜索
* 禁止工具化后台结构

---

### STATE_2：完全显现（AR / 信物）

关键词：

* 世界被触发
* 结果具象化
* 记忆固化

视觉表达：

* 信物
* AR触发
* 光纹显现
* 事件反馈

规则：

* 信物必须是"结果"
* AR必须是"触发动作"
* 不允许列表化展示

---

## 四、状态流转规则

```text
Landing → Explore → AR/信物
```

含义：

* 从未显现到半显现再到完全显现

---

## 五、统一视觉行为规则

### 1. 所有视觉 = 状态表达

UI不再是UI，而是状态映射。

---

### 2. 信物定义

信物 = 世界显现后的"结果物"

禁止定义：

* 不能是UI组件
* 不能是数值奖励
* 不能是抽象资产

---

### 3. AR定义

AR = 状态触发器

不是功能页，是"显现触发动作"。

---

### 4. Explore定义

Explore = 状态阅读层

不是列表，不是工具，是"理解世界的过程"。

---

### 5. Landing定义

Landing = 状态入口层

唯一职责：

* 引导进入显现

---

## 六、动效语言统一

允许：

* fade in
* mist reveal
* slow float
* soft breathing
* layer emergence

禁止：

* reward animation
* explosion
* bounce
* gamification feedback
* UI强化动效

---

## 七、系统统一关系

```text
Landing（未显现）
   ↓
Explore（半显现）
   ↓
AR / 信物（完全显现）
```

---

## 八、系统边界（强约束）

禁止跨层行为：

* Landing 不可展示 Explore 数据
* Explore 不可变成后台
* AR 不可变成功能页

---

## 九、最终冻结标记

VISUAL_REVELATION_ENGINE_V1 = FROZEN  
STATE_MODEL = ACTIVE  
VISUAL_LANGUAGE = UNIFIED  
SYSTEM_CONVERGENCE = COMPLETED  
