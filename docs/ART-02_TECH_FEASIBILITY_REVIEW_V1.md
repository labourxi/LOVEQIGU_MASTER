# ART-02_TECH_FEASIBILITY_REVIEW_V1
---

# 一、需求特征分析

ART-02 本质不是：

```text
游戏特效
```

不是：

```text
SSR抽卡
```

不是：

```text
升级动画
```

而是：

```text
东方仪式动画
```

核心表现：

```text
世界安静

↓

古星图展开

↓

对应星位出现

↓

星位点亮

↓

金色流线连接

↓

仪式文案出现

↓

停顿

↓

卷轴收回
```

总时长：

```text
8~12秒
```

要求：

```text
克制
高级
留白
低噪声
```



---

# 二、Lottie方案评估

## 适合内容

非常适合：

```text
卷轴展开

印章落下

文案浮现

金线流动

光晕呼吸

粒子飘散
```

---

## 优势

### 美术还原度最高

设计师：

```text
AE

↓

Bodymovin

↓

Lottie
```

即可导出。

---

### 开发成本最低

前端：

```text
<lottie-player>
```

即可播放。

---

### 修改成本最低

后期：

```text
改动画

↓

重新导出JSON
```

无需改代码。

---

## 风险

### 文件体积

如果：

```text
粒子太多

遮罩太多

路径太复杂
```

则：

```text
JSON膨胀
```

容易：

```text
500KB+

1MB+
```

---

### 微信兼容性

复杂Lottie：

```text
低端安卓
```

容易掉帧。

---

## 评分

```text
视觉表现
★★★★★

开发成本
★★★★★

维护成本
★★★★★

性能
★★★☆
```

---

# 三、Canvas方案评估

## 适合内容

非常适合：

```text
星图底板

星位状态

连线状态

星宿结构

未来28宿扩展
```

---

## 优势

### 可扩展

未来：

```text
7星

↓

28宿

↓

四象

↓

完整星图
```

都能共用。

---

### 数据驱动

直接：

```text
checkpoint

↓

star_node

↓

canvas render
```

即可。

符合 Autopilot 思路。

---

## 风险

### 美术成本高

很多效果：

```text
粒子

卷轴

光晕

印章
```

需要程序实现。

---

### 开发量高

需要：

```text
状态机

绘制器

动画系统
```

---

## 评分

```text
视觉表现
★★★★

开发成本
★★

维护成本
★★★

性能
★★★★★
```

---

# 四、视频方案评估

## 优势

```text
视觉100%还原
```

设计师做什么：

```text
用户看到什么
```

---

## 致命问题

### 包体

非常危险。

例如：

```text
1080P

10秒
```

轻松：

```text
3MB~10MB
```

---

### 适配差

不同设备：

```text
卡顿

黑屏

首帧延迟
```

问题较多。

---

### 无法扩展

未来：

```text
28宿
```

会变成：

```text
28个视频
```

维护灾难。

---

## 评分

```text
视觉表现
★★★★★

开发成本
★★★★

维护成本
★

性能
★★

扩展性
★
```

---

# 五、微信小程序兼容性

根据当前：

```text
白屏问题已修复

包体优化已完成
```

历史经验来看：

最安全的是：

```text
Canvas
+
Lottie
```

组合。

不建议：

```text
纯视频
```

方案。

---

# 六、包体影响评估

## Canvas

```text
≈ 0KB
```

主要是代码。

---

## Lottie

建议：

```text
单文件

< 200KB
```

最好：

```text
50KB~150KB
```

---

## 视频

建议：

```text
禁止作为主方案
```

---

# 七、资源规范建议

建议建立：

```text
assets/star-ritual/
```

结构：

```text
assets/star-ritual/

├─ lottie/
│  ├─ chart_open.json
│  ├─ star_activate.json
│  └─ seal_complete.json

├─ textures/
│  ├─ paper_bg.webp
│  ├─ star_glow.webp
│  └─ seal.webp

├─ audio/
│  ├─ ignition.mp3
│  ├─ flow.mp3
│  └─ completion.mp3
```

---

# 八、推荐路线（最终结论）

## 不推荐

```text
纯视频
```

原因：

```text
包体
性能
扩展性
```

都差。

---

## 不推荐

```text
纯Canvas
```

原因：

```text
开发成本过高
```

---

## 推荐

```text
Canvas
+
Lottie
```

架构：

```text
Canvas

负责：

星图
星位
连线
状态机

↓

Lottie

负责：

卷轴展开

金线流动

仪式动画

印章反馈

↓

文案层

独立UI
```

---

# 最终评级

```text
ART_02_TECH_FEASIBILITY_REVIEW_V1

Lottie方案
PASS

Canvas方案
PASS

视频方案
NOT_RECOMMENDED

微信兼容性
PASS

包体风险
LOW

推荐路线

Canvas + Lottie Hybrid
```

---

## 技术侧结论

```text
ART_02_IMPLEMENTATION_RECOMMENDED = YES

RECOMMENDED_ARCHITECTURE =
Canvas + Lottie

VIDEO_PRIMARY_SOLUTION =
NO
```
