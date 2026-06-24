# 🧭 AR游伴系统冻结总文档 V1.0

## 一、系统总定义
AR游伴 = 基于XR识别 + 事件驱动 + 世界结构化建模的现实增强运行时系统

---

## 二、四层架构

### 1 感知层（XR Layer）
职责：现实 -> 数字输入

组件：
- XR Frame
- Marker
- SLAM tracking
- Camera input

输出：
- ar:detected
- ar:active
- ar:lost

### 2 事件层（Event Layer）
职责：唯一状态驱动中心

规则：
- 必须通过 Event Bus
- 禁止直接修改UI或World

标准事件：
- ar:detected
- ar:active
- ar:lost
- relic_spawn
- star_light
- meridian_flow
- quest_update

### 3 世界层（World Layer）

#### 星宿系统
- 28星宿（四象7）
- 节点点亮系统
- 状态：dim / active / complete

#### 🧭 经络系统
- 12经络 + 365穴位
- 曲线路径（spline）
- 能量流动

#### 🧬 四象系统
- 青龙 / 白虎 / 朱雀 / 玄武
- 星宿聚合结构

#### 🪙 信物系统
- 用户收集单位
- 绑定星宿 / 经络 / 宝物

### 4 表现层（Experience Layer）
职责：世界 -> 用户体验

内容：
- 星宿点亮动画
- 经络流动效果
- 四象结构演化
- AR宝物展示
- 信物档案系统

### 5 商业层（Commerce Layer）
模块：
- 卡券系统
- 活动系统（接福 / 纳福 / 集福）
- 商家系统
- 奖励系统

---

## 三、核心数据模型

### 星宿
```json
{
  "id": "star_x",
  "constellation": "qinglong/baihu/zhuque/xuanwu",
  "state": "dim | active | complete"
}
```

### 经络
```json
{
  "meridian": "lung_meridian",
  "nodes": ["acupoint_1", "acupoint_2"],
  "state": "inactive | flowing | active"
}
```

### 信物
```json
{
  "relic_id": "xxx",
  "bind_type": "star | meridian | artifact",
  "unlock": true
}
```

### 宝物
```json
{
  "artifact_id": "dragon_jade",
  "type": "3d_model",
  "trigger": "relic_spawn"
}
```

---

## 四、事件系统规则

XR INPUT -> Event Bus -> Trigger Layer -> World Engine -> UI / AR Render -> Commerce

禁止：
- XR不能直接操作UI
- UI不能直接修改世界
- Domain必须通过Event Bus
- 禁止双事件系统

---

## 五、世界结构规则

星宿：点 -> 星宿 -> 四象

经络：穴位 -> 经络路径 -> 能量流

信物：用户行为 -> 信物 -> 解锁节点

宝物：AR触发 -> 3D实体 -> 奖励/活动

---

## 六、系统定义

AR游伴 = 现实世界 + XR感知 + 事件驱动 + 结构化世界 + 用户体验 + 商业闭环

---

## 七、系统状态

- XR系统：READY
- Event系统：SINGLE PIPELINE
- 世界结构：DEFINED
- 商业系统：READY
- 架构状态：PRODUCTION READY

---END
