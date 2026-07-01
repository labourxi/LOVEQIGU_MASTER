# LANDING V1 — FULL PAGE VISUAL GENERATION PROMPT

> **管线步骤**: VISUAL_PRODUCTION_PIPELINE_V3 — STEP 2
> **输入来源**: `STRUCTURE_SPEC_LANDING_V1.md`
> **执行日期**: 2026-07-01 14:32
> **状态**: **GENERATION_SPEC_READY** — 接 API Key 后可直接执行

---

## 主提示词（Primary Prompt）

```
AIGU VALLEY landing page — full mobile screen。

Sacred futuristic space entry scene。

Deep black (#050510) to indigo (#1A0A3E) gradient background。

Center: a luminous rotating energy portal gate — concentric rings 
of violet (#7B2D8E) and gold light (#E8C86A), volumetric soft glow 
emanating outward, misty energy tendrils。

Floating star dust particles scattered throughout, slow drift。

Atmosphere: solemn, ethereal, sacred space — NOT sci-fi combat。

Top center: thin white glow text "AR游伴" (27px, delicate, glowing)。

Bottom center: glowing energy button "进入世界" with subtle gold pulse。

Bottom left: "故事" text. Bottom right: "说明" text。

Minimal UI density — generous negative space。

Oriental mystic sci-fi aesthetic — Eastern philosophical imagery 
fused with futuristic visual language。

Composition: center-dominant symmetrical, portal as visual anchor。

Material: energy mist, glass-like refraction, subtle neon edge glow。

Motion hint: slow particle flow。

No phoenix, no dragon, no warrior, no anime, no cartoon, no game UI, 
no rainbow gradient, no human face, no text watermark。
```

---

## 反提示词（Negative Prompt）

```
phoenix, dragon, warrior, weapon, anime, cartoon, neon overglow, game UI elements,
rainbow gradient, high-purity fluorescent colors, human face, text watermark, logo,
realistic photo, cluttered, high UI density, asymmetrical composition,
dark forest colors (#0A1A14), gold accent (#C8A24A), ink-wash style,
mountain valley, fog
```

---

## 规格参数

| 参数 | 值 |
|------|-----|
| 宽 × 高 | 750 × 1624 px |
| 比例 | 9:16 |
| 输出格式 | PNG / JPEG |
| 配色 | `#050510` → `#1A0A3E` → `#7B2D8E` → `#E8C86A` |
| 光照 | volumetric_soft_glow |
| 材质 | energy_mist_glass_neon |
| 氛围 | sacred_futuristic_space |

---

## API 调用方式

### 方案 A: Gemini 2.0 Flash

```
Provider:  Gemini
Endpoint:  https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent
API Key:   GEMINI_API_KEY
Payload:   { contents: [{ parts: [{ text: "<<主提示词>>" }] }] }
温度:      0.85
```

### 方案 B: Seedream

```
Provider:  Seedream
API Key:   SEEDREAM_API_KEY
Width:     750
Height:    1624
Style:     oriental_mystic_sci_fi
CFG Scale: 7.5
Steps:     30
```

### 方案 C: 豆包 / 即梦

```
Provider:  豆包 / 即梦
API Key:   DOUBAO_API_KEY
Width:     750
Height:    1624
Style:     写实厚涂 东方神秘
CFG Scale: 7.0
Steps:     25
```

---

## 后处理规则

| 情况 | 处理方式 |
|------|---------|
| 中文文字乱码 | 生成无文字版本，后续叠加文字 |
| 比例偏差 | 居中裁剪为 9:16，不拉伸 |
| 颜色偏差 | 校正至 `#050510/#1A0A3E/#7B2D8E/#E8C86A` 色板 |
| Portal 不突出 | 增大 portal 视觉权重，降低背景复杂度 |

---

## 输出位置

```
assets/visual-pipeline/landing_v1/landing_full_page_v1.png
```

---

*生成于 2026-07-01 14:32 · 管线：VISUAL_PRODUCTION_PIPELINE_V3 STEP 2 · 状态：GENERATION_SPEC_READY*
