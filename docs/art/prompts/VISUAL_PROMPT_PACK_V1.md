# VISUAL_PROMPT_PACK_V1

**STATUS:** FROZEN  
**VERSION:** V1  
**SCOPE:** Landing Page · Explore Home · AR / 信物显现  
**ALIGN:** `LOVEQIGU_VISUAL_OPERATING_SYSTEM_V1` · `VISUAL_REVELATION_ENGINE_SPEC_V1` · `DUAL_HOME_SYSTEM_SPEC_V1`  
**PIPELINE:** Gemini · 豆包 · Seedream · Midjourney · 内部半自动生图系统

---

## 一、交付结构（给 Codex / Cursor / 生图流水线通用）

```text id="pack_00"
VISUAL_PROMPT_PACK_V1
```

用于：

* Gemini
* 豆包
* Seedream
* Midjourney（如用）
* 内部半自动生图系统

---

## 二、核心原则（统一约束）

```text id="pack_01"
所有生成必须遵守：

1. 东方克制视觉
2. 留白优先
3. 不游戏化
4. 不电商化
5. 不UI工具化
6. 不奖励机制视觉
7. 世界显现感（revelation）
```

---

## 三、Landing Page 生图 Prompt（核心）

### Prompt 1：Landing 主视觉

```text id="p1"
A minimal Eastern-inspired digital world entrance interface, deep dark ink-black to deep indigo gradient background, soft mist layers floating slowly, sparse star particles, subtle breathing glow, centered abstract incomplete map or star chart forming a "world yet to be revealed", extremely minimal composition, high aesthetic restraint, cinematic lighting, calm atmosphere, Japanese + Chinese ink aesthetic fusion, no UI clutter, no buttons emphasized, feeling of "entering a hidden world", ultra minimal, premium design, soft volumetric fog, high-end product interface style
```

---

### Prompt 2：Landing CTA区

```text id="p2"
Minimal interactive entrance button design, soft glowing text "enter exploration", semi-transparent white with gentle breathing animation feel, floating in dark mist environment, surrounded by subtle particles, no gamification, no icons, extremely restrained UI, cinematic negative space, Eastern spiritual calm aesthetic, interface feels like ritual gateway rather than product UI
```

**产品文案对照：** 终版 CTA 为「进入探索」；生图可用英文占位，落地时替换为 L2 产品语言。

---

### Prompt 3：Landing 世界中心结构

```text id="p3"
Abstract incomplete world map or celestial star network emerging from fog, not fully visible, partially erased edges, soft light lines connecting nodes, symbolic geography, mysterious and poetic, floating in deep dark atmospheric space, minimal digital art, sacred geometry inspiration, very low brightness, high depth, feeling of world slowly revealing itself
```

---

## 四、Explore Home 生图 Prompt（关键）

### Prompt 4：Explore 城市卡片流

```text id="p4"
A poetic exploration interface showing layered city exploration cards, misty urban photography backgrounds, soft blur, subtle depth, each card contains a place name and a poetic sentence, minimal UI overlay, no heavy borders, no grid rigidity, floating card system in a dark atmospheric environment, sense of memory, discovery, and quiet exploration, cinematic UI design, Eastern minimalism, soft light leaks, very restrained interface design
```

---

### Prompt 5：探索卡片单体

```text id="p5"
Single exploration card UI design, semi-transparent dark surface, blurred city background image, soft glowing edges, minimal typography, poetic description text, subtle fog overlay, feeling of memory fragment, not commercial, not gamified, calm discovery experience, high-end mobile interface aesthetic
```

---

### Prompt 6：搜索浮层（轻量）

```text id="p6"
Minimal search overlay UI, floating semi-transparent panel over dark mist background, soft input field, no heavy borders, elegant typography, search feels like whispering into a world rather than querying a system, very light interaction design, no suggestion grids, no aggressive UI, calm and restrained aesthetic
```

**产品文案对照：** 搜索占位为「地点 / 景点 / 关键词」。

---

## 五、AR / 信物显现 Prompt（系统核心）

### Prompt 7：信物显现瞬间

```text id="p7"
A mystical object slowly materializing from mist, glowing softly as if emerging from another dimension, Eastern ritual aesthetic, subtle golden-white light threads forming shape, not flashy, not explosive, calm revelation moment, sacred artifact appearance, cinematic darkness, sense of discovery and manifestation, extremely restrained magical realism style
```

---

### Prompt 8：AR触发瞬间

```text id="p8"
A subtle augmented reality interface moment, camera view implied, soft overlay lines appearing in space, object slowly revealing itself through mist and light refraction, minimal UI markers, no gaming effects, calm scientific-meets-spiritual aesthetic, feeling of world being gently unlocked rather than scanned
```

---

## 六、统一风格控制 Prompt（非常重要）

```text id="style_01"
Unified visual style: Eastern minimalism + cinematic digital atmosphere + high-end product design, deep dark tones, mist, soft particles, low saturation, high negative space, poetic and restrained, no gamification, no commercial UI patterns, no aggressive UX, world revelation aesthetic, calm discovery experience
```

**Token 对照（前端还原）：**

| Token | 值 |
|-------|-----|
| bg_primary | `#0B0F14` |
| bg_secondary | `#121821` |
| text_primary | `#E6ECF2` |
| text_secondary | `#BFC9D6` |
| text_muted | `#7E8FA3` |
| surface_soft | `rgba(255,255,255,0.04)` |
| stroke_soft | `rgba(255,255,255,0.08)` |
| glow_soft | `rgba(191,201,214,0.18)` |

---

## 七、禁止 Prompt（防止 AI 跑偏）

```text id="ban_01"
Do NOT generate:
- game UI
- reward animations
- flashy explosions
- commercial dashboard
- e-commerce interface
- lottery / gacha visuals
- bright saturated colors
- aggressive UI buttons
- heavy grids or tables
```

---

## 八、显现状态映射（生图选用）

| 状态 | 页面 | 推荐 Prompt |
|------|------|-------------|
| STATE_0 未显现 | Landing | p1 · p2 · p3 |
| STATE_1 半显现 | Explore Home | p4 · p5 · p6 |
| STATE_2 完全显现 | AR / 信物 | p7 · p8 |

**全局附加：** 每条生成均叠加 `style_01`；排除项引用 `ban_01`。

---

## 九、冻结标记

VISUAL_PROMPT_PACK_V1 = FROZEN  
PROMPT_COUNT = 8  
STYLE_CONTROL = style_01  
BAN_LIST = ban_01  
VISUAL_OS_ALIGNED = YES  
