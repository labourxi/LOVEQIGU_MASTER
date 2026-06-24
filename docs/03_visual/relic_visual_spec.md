# AR游伴 · 信物视觉规范

**文件 ID：** `03_visual/relic_visual_spec.md`  
**版本：** V1 初稿  
**上游：** `docs/product/relic_system/AR_RELIC_SYSTEM_V3.md` · `docs/art/STAR_CHAIN_AND_MERIDIAN_REVEAL_MOTION_SPEC_V1.md`  

---

## 1. 概念定义

信物视觉表达 **故事进度与空间关系**，不是稀有度抽卡。

---

## 2. 结构说明

### 2.1 双图谱

- **星链系统**：星点 · 细线 · 柔和光晕  
- **经络系统**：经纬线 · 节点 · 克制脉冲  

### 2.2 节点状态

| 状态 | 视觉 |
|------|------|
| 未获得 | 暗点、可识别 |
| 待点亮 | 微弱脉动 |
| 已点亮 | 暖白/淡金光晕 |
| 已收录 | 稳定常亮 |

### 2.3 与数字藏品分离

| | 信物 | 数字藏品 |
|--|------|----------|
| 用途 | 探索进度 | 传播营销 |
| 视觉气质 | 图谱/古籍 | 活动海报 |
| 页面 | relic-archive | digital-collectible |

---

## 3. 流程说明

```text
显现完成 → relic_emerge_v1 → 信物册收录 → 星图/经络节点更新
```

---

## 4. 示例

星链最小单元：

```text
○ —— ○   （一角宿式双星结构，非五角星）
```

---

## 5. 可执行说明

- 信物页组件：`pages/relic-archive/` · `star-map` · `meridian-map`
- 出图批次：`docs/art/prompts/STAR_CHAIN_*` · `MERIDIAN_NODE_*`
- 禁止：战力数值 · 稀有度爆闪

---

*Canon 缺口不视觉臆造*
