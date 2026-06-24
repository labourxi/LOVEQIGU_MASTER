# AR游伴 · XR 视觉规范

**文档 ID：** `03_visual/xr_visual_spec.md`  
**版本：** V1.2-STABLE  
**状态：** ENGINEERING_STANDARD  
**输入：** `xr-event-bus` / `ar-event-bus` 事件、`ar-entry` phase、Marker 状态  
**输出：** Scene 层 + UI Overlay 层视觉规格、事件绑定验收项  

**闭环：** `USER → XR → VISUAL → SPACE → RELIC → CRM → REVENUE`  
**上位：** `visual_system_v1.md` §3.2 · `event_bus_contract.md`  
**不重复：** `xr_architecture.md`

---

## 1. Definition（定义）

### 1.1 XR 视觉定义

XR 视觉 = **显现时刻** 的三层观感：

```text
Layer A  xr-frame（3D · Marker · 光效）
Layer B  ui-overlay-layer（按钮 · 相位文案 · 状态）
Layer C  pilot-fx-overlay（全屏仪式动效，事件驱动）
```

原则：**克制、在场、可降级**；失败时 Layer C 不播放庆祝动效。

### 1.2 输入 / 输出

| 方向 | 内容 |
|------|------|
| **输入** | Bus 事件、phase、bridgeMode |
| **输出** | WXML 结构约束、验收脚本、现场降级 UI |

---

## 2. System Design（结构设计）

### 2.1 三层矩阵

| 层 | 组件路径 | 事件订阅 | 用户可操作 |
|----|----------|----------|------------|
| A Scene | `components/ar-marker-xr-scene/` | `ar:*` via marker | **否**（validator 禁止 bindtap） |
| B Overlay | `ar-entry` + `xr-ui-overlay.wxss` | phase 驱动 | **是**（overlay 外） |
| C Pilot FX | `pilot-fx-overlay/` | §2.2 表 | 否（自动播） |

### 2.2 XR 事件 → 三层视觉响应表

| 事件 | Layer A | Layer B | Layer C |
|------|---------|---------|---------|
| `XR_USER_TRIGGER` | 预加载/待命 | — | `xr_start_v1`（index） |
| `XR_STATE_CHANGE` RUNNING | 渲染启动 | scanning 文案 | — |
| `XR_FAILED` | 停止/保持末帧 | `phase=error`, retry | **禁止**庆祝 FX |
| `ar:detected` | Marker 框 | 「已识别标识」 | — |
| `ar:active` | 跟踪稳定 | `phase=scanning_ar` | — |
| `ar:lost` | 丢失提示 | 「请重新对准」 | — |
| `XR_RENDER_WORLD_SPACE` | 世界空间绘制 | — | — |
| `RELIC_CREATED` | 信物 3D spawn | 跳转 lottie 前 | `relic_emerge_v1` |
| `STAR_LIGHTED` | 节点光效 | star-map `lit` | — |
| adapter `completeARFallback` | — | `fallback_complete` | — |

### 2.3 ar-entry phase 视觉规格

| phase | Overlay 标题语气 | 按钮 | 色 |
|-------|------------------|------|-----|
| `idle` | L2「开始探索显现」 | start | `--ink` 底 |
| `scanning_ar` | L2「正在显现」 | complete_ar / complete_fallback | `--gold` 点缀 |
| `fallback_ready` | L2「备用显现」 | complete_fallback | 同 AR，无警告红 |
| `error` | L2「请重试」 | retry | `--gray` 辅助 |
| `ar_complete` | L3 克制一句 | reveal | `--gold` |
| `fallback_complete` | 同 ar_complete | reveal | 同左 |

源码：`pages/ar-entry/index.js` → `resolveActionUi`

### 2.4 禁止清单

- `xr-scene` 内 `view` / `text` / `button`  
- 霓虹 HUD、宝箱、等级条  
- AR 失败时播放 `relic_emerge_v1`  
- Layer C 与 Layer B 同屏抢主 CTA（一屏一主行动）  

---

## 3. Flow（流程）

### 3.1 显现成功路径（视觉）

```text
ar:detected → ar:active → Layer A 稳定
           → Layer B scanning_ar
           → completeARScan
           → ar_complete → navigate lottie
           → Layer C relic_emerge_v1
```

### 3.2 降级路径（视觉）

```text
XR_FAILED | camera denied
  → Layer B fallback_ready（无惊吓色）
  → completeARFallback
  → fallback_complete
  → Layer C relic_emerge_v1（与 AR 成功相同，避免歧视备用路径）
```

### 3.3 Marker 丢失

```text
ar:lost → Layer B 提示重新对准
       → 不 emit 庆祝事件
       → 用户可 retry 或走 fallback
```

---

## 4. Data Model（数据模型）

### 4.1 phase → UI schema

```json
{
  "phase": "scanning_ar",
  "bridgeMode": "AR",
  "primaryAction": "complete_ar",
  "secondaryAction": "back",
  "visual": {
    "overlayClass": "xr-ui-scanning",
    "ctaVariant": "primary-ink",
    "allowPilotFx": false
  }
}
```

### 4.2 XR_FAILED overlay

```json
{
  "phase": "error",
  "primaryAction": "retry",
  "secondaryAction": "complete_fallback",
  "visual": {
    "allowPilotFx": false,
    "toast": "请使用备用显现完成探索"
  }
}
```

---

## 5. Example（示例）

### 5.1 验收命令

```bash
node scripts/user_frontend/validate_xr_ui_decouple.js
node scripts/user_frontend/validate_pilot_scene_product.js
```

### 5.2 人工清单（每探索点）

| # | 操作 | 预期视觉 |
|---|------|----------|
| 1 | 开始显现 | scanning overlay，无白屏 |
| 2 | 备用显现 | fallback 文案，无红色警报 |
| 3 | 完成 | 跳转 lottie + `relic_emerge_v1` |
| 4 | 断 Marker | `ar:lost` 提示 |

---

## 6. Execution Notes（执行说明）

- 改动 phase 文案须过 L2/L3 语言审查  
- 新 bus 事件视觉响应先更 `visual_system_v1.md` §3.2  
- 现场物料：备用显现说明卡与 Layer B 文案一致  

---

*xr_visual_spec V1.2-STABLE · Batch 2*
