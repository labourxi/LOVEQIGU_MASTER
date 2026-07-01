# 📄 VISUAL_ASSET_CONTRACT_V1.md

## LOVEQIGU / AR游伴｜视觉资产契约层（冻结版）

---

# 🧭 0. PURPOSE（系统目的）

本文件定义 LOVEQIGU / AR游伴系统中：

> 所有视觉资产（图片 / 图标 / 场景 / UI装饰）的唯一管理规则与调用机制。

---

## ❗核心原则

```txt
UI不直接"使用图片"
UI只能"引用资产契约"
```

---

# 🧱 1. ASSET LAYER ARCHITECTURE（资产分层）

```txt
L1：UI Page Layer（页面）
L2：Component Layer（组件）
L3：Asset Contract Layer（本文件）
L4：Asset Storage Layer（/assets）
```

---

# 📦 2. ASSET DIRECTORY STRUCTURE（强制结构）

Cursor必须遵守：

```bash
/assets/
  /scene/        # 场景背景（爱企谷 / 景区）
  /bg/           # 抽象背景（雾 / 光 / 星空）
  /ui/           # UI装饰元素（光圈 / 卡片 / 边框）
  /icon/         # 功能图标（登录 / 探索 / 信物）
  /relic/        # 信物 / 宝物视觉
  /collectible/  # 数字藏品视觉
  /ar/           # AR效果资源
```

---

# 🧠 3. ASSET REGISTRY SYSTEM（核心）

所有资产必须注册：

```bash
/assets/asset_registry.json
```

---

## 📌 标准结构

```json
{
  "asset_id": {
    "path": "/assets/scene/xxx.png",
    "type": "scene | ui | icon | bg | relic | collectible | ar",
    "theme": "aiqigu | myth | festival | neutral",
    "usage": "landing / detail / overlay",
    "description": "human readable meaning",
    "status": "active | deprecated"
  }
}
```

---

# 🚫 4. HARD RULES（强制规则）

---

## ❌ 禁止行为

```txt
- 禁止 UI 中直接写死图片路径
- 禁止使用未注册资源
- 禁止组件内临时引入图片
- 禁止"随便放一张图"
```

---

## ✅ 正确行为

```txt
所有图片必须来自 ASSET_MAP
所有UI必须通过 asset_id 引用
所有新增图片必须登记 registry
```

---

# 🧩 5. ASSET ACCESS STANDARD（访问规范）

---

## ✅ 标准访问方式

```ts
import { ASSET_MAP } from "@/assets/asset_map";
```

---

## 📦 ASSET_MAP 示例

```ts
export const ASSET_MAP = {
  landing_bg: "/assets/scene/aiqigu_landing_v1.jpg",
  portal_ring: "/assets/ui/portal_ring_gold.png",
  login_icon_wechat: "/assets/icon/wechat_login.png",
  explore_marker: "/assets/ui/explore_marker.png",
  relic_glow_frame: "/assets/relic/frame_gold_v2.png"
};
```

---

## ❌ 禁止写法

```jsx
<img src="/assets/scene/a.jpg" />
```

---

## ✅ 正确写法

```jsx
<img src={ASSET_MAP.landing_bg} />
```

---

# 🧭 6. LANDING PAGE ASSET RULE（首页专用规则）

Landing Page必须包含以下资产类别：

---

## 🌄 Scene Layer（爱企谷场景）

```txt
aiqigu_main_street
aiqigu_gate_cloud_fang
aiqigu_lantern_corridor
```

---

## 🌌 Portal Layer（入口）

```txt
portal_ring_light_v1
portal_particle_flow_v1
portal_golden_mist
```

---

## 🎯 UI Layer

```txt
login_wechat_button_gold
explore_carousel_card_bg
stat_panel_glass_gold
```

---

## 📊 Data Layer

```txt
icon_location
icon_relic
icon_collectible
icon_ar
```

---

# 🧬 7. IMAGE GENERATION PIPELINE（与生图系统对接）

---

## Step 1：UI定义需求

Cursor输出：

```txt
needs_assets:
- landing_scene_aiqigu
- portal_ring_v2
- lantern_floating_bg
```

---

## Step 2：Image Agent生成

（Gemini / Seedream / MJ）

---

## Step 3：回填规则

```txt
生成图片 → /assets/scene/
更新 asset_registry.json
更新 ASSET_MAP
```

---

# 🔁 8. VERSION CONTROL（版本控制）

---

## 资产更新必须遵守：

```txt
v1：初始生成
v2：优化光影
v3：风格统一
v_final：上线版本
```

---

## ❌ 禁止：

```txt
直接覆盖旧资源
无版本号替换
```

---

# 🧱 9. UI ↔ ASSET 解耦原则

---

## UI只负责：

```txt
layout
interaction
animation
state
```

---

## Asset负责：

```txt
visual appearance
style
emotion
world consistency
```

---

# ⚠️ 10. VISUAL CONSISTENCY RULE（最重要）

---

## LOVEQIGU视觉必须满足：

```txt
东方幻想 + 写实景区 + 金色愿力 + 雾层空间感
```

---

## 禁止：

```txt
纯扁平UI
科技UI风格
游戏UI风格
廉价icon风
```

---

# 🧭 11. SYSTEM SUMMARY

---

```txt
UI = 结构
Asset = 灵魂
Registry = 法典
```

---

# 🚀 12. CURSOR EXECUTION RULE（关键）

Cursor必须遵守：

```txt
任何UI开发前必须：
1. 查询 ASSET_MAP
2. 确认 asset_registry
3. 不存在则创建需求清单
4. 禁止临时图片引用
```

---

# 📌 END OF CONTRACT V1

---

## 冻结元信息

STATUS: FROZEN
VERSION: V1
DATE: 2026-06-29
OWNER: LOVEQIGU
