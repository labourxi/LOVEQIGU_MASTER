# LOVEQIGU VISUAL OPERATING SYSTEM V1

## 一、系统定义

本系统是 LOVEQIGU / AR游伴 的视觉操作系统（Visual OS）。

所有 UI、AR、信物、探索行为，不再是功能模块，而是"世界显现状态的表达"。

---

## 二、三大子系统收敛

### 1. 双首页系统（DUAL HOME SYSTEM）

```text
Landing → Explore
```

* Landing = 世界入口（未显现）
* Explore = 世界展开（半显现）

规则：

* Landing 不承载信息
* Explore 不承担入口仪式
* 严格单向流转

---

### 2. 视觉显现引擎（REVELATION ENGINE）

```text
STATE_0 → STATE_1 → STATE_2
```

* STATE_0：未显现（Landing）
* STATE_1：半显现（Explore）
* STATE_2：完全显现（AR / 信物）

规则：

* UI = 状态表达
* 信物 = 显现结果
* AR = 状态触发器

---

### 3. AR / 信物系统（REALITY LAYER）

定义：

* AR = 触发显现行为
* 信物 = 世界显现后的结果物

规则：

* 信物不可作为UI组件
* AR不可作为页面系统
* 两者必须归属 STATE_2

---

## 三、统一世界观规则（非内容，是结构）

```text
世界 = 不断显现的过程
```

所有系统必须服从：

* 未显现 → 半显现 → 已显现

---

## 四、视觉统一原则

### 1. 所有UI必须表达状态

UI ≠ 页面
UI = 世界状态

---

### 2. 禁止功能化UI

禁止：

* 后台感
* 工具面板
* 数值系统
* 电商结构
* 游戏奖励结构

---

### 3. 禁止系统割裂

禁止：

* Landing独立逻辑
* Explore独立逻辑
* AR独立逻辑

必须统一：

```text
一个状态机驱动全部
```

---

## 五、统一状态机（核心）

```text
STATE_0 = Landing（未显现）
STATE_1 = Explore（半显现）
STATE_2 = AR / 信物（完全显现）
```

---

## 六、系统运行逻辑

```text
用户进入 Landing
        ↓
进入 Explore
        ↓
触发 AR / 信物显现
```

---

## 七、系统边界（强约束）

* 不允许新增独立首页系统
* 不允许新增平行信息结构
* 不允许AR独立UI体系
* 不允许信物脱离显现引擎

---

## 八、系统统一结论

```text
LOVEQIGU = 一个视觉状态机系统
不是产品集合
不是功能集合
```

---

## 九、最终冻结标记

LOVEQIGU_VISUAL_OPERATING_SYSTEM_V1 = FROZEN  
DUAL_HOME_SYSTEM = INTEGRATED  
REVELATION_ENGINE = ACTIVE  
AR_SYSTEM = STATE_2_LAYER  
VISUAL_SYSTEM = UNIFIED  
