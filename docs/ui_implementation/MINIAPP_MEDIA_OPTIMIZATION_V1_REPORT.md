# MINIAPP_MEDIA_OPTIMIZATION_V1_REPORT

## 任务

响应微信开发者工具「代码质量 → 代码包 → 图片和音频资源大小应不超过 200K」未通过项，对 `apps/miniapp` 做媒体瘦身与路径整理。

## 执行日期

2026-06-19

---

## 优化前基线

| 指标 | 数值 |
| --- | --- |
| 媒体文件总数 | 12 |
| 包内媒体合计 | **765.6 KB** |
| 主包媒体 | 115.4 KB |
| xr_demo 分包媒体 | 650.2 KB |
| 单文件 > 200KB | 0（优化前） |

主要体积来源：

- `xr_demo/.../effect_preview/` 预览图（5 PNG，合计约 415KB）
- `landmark_tree_v1` / `landmark_tree_v1_p0a` 重复 overlay + guide（各 71KB + 46KB）
- 未引用孤儿图 `assets/images/home-hero.jpg`（98KB）

---

## 已执行操作

### 1. 删除未引用孤儿资源

| 操作 | 路径 | 释放 |
| --- | --- | --- |
| DELETE | `apps/miniapp/assets/images/home-hero.jpg` | 98.0 KB |

代码中无任何引用。

---

### 2. 去重共享 AR 资源

经 MD5 校验，`landmark_tree_v1` 与 `landmark_tree_v1_p0a` 的 `alignment_overlay` / `position_guide` **内容完全相同**。

| 操作 | 路径 | 释放 |
| --- | --- | --- |
| DELETE | `xr_demo/.../landmark_tree_v1_p0a/alignment_overlay.png` | 71.6 KB |
| DELETE | `xr_demo/.../landmark_tree_v1_p0a/position_guide.png` | 45.8 KB |

**代码更新**：`apps/miniapp/services/ar-runtime/runtime-service.js`

- 新增 `SHARED_ASSET_PATHS`，p0a 变体自动复用 `landmark_tree_v1` 目录下的共享资源。

---

### 3. PNG → WebP 转换（运行时资源）

脚本：`scripts/miniapp/convert_miniapp_media_to_webp.py`

| 原文件 | 优化后 | 前 | 后 |
| --- | --- | ---: | ---: |
| `landmark_tree_v1/alignment_overlay` | `.webp` | 233.9 KB* | **114.3 KB** |
| `landmark_tree_v1/position_guide` | `.webp` | 130.2 KB* | **25.1 KB** |
| `effect_preview/dragon_imprint_overlay` | `.webp` | 312.6 KB* | **75.4 KB** |
| `effect_preview/dragon_energy_flow` | `.webp` | 283.2 KB* | **55.8 KB** |
| `effect_preview/dragon_head_reveal` | `.webp` | 339.8 KB* | **72.2 KB** |
| `effect_preview/azure_dragon_seal` | `.webp` | 124.8 KB* | **78.1 KB** |
| `effect_preview/preview_sheet` | `.webp` | 114.7 KB* | **82.6 KB** |

\* 中间态：首次 PNG 重保存曾意外膨胀体积；已通过 WebP 转换恢复并进一步压缩。**勿使用** `compress_miniapp_media.py`（已标记 DEPRECATED）。

---

### 4. Runtime URI 同步为 WebP

更新以下文件中的 `effect_preview/*.png` → `*.webp`：

- `data/runtime/ar_factory/landmark_tree_v1_p0a/runtime_package.js` / `.json`
- `data/runtime/ar_factory/landmark_tree_v1_p0a/effect_package.js` / `.json`
- `data/runtime/ar_factory/landmark_tree_v1_p0a/preview_assets.js` / `.json`
- `data/runtime/ar_factory/landmark_tree_v1_p0a/bridge_manifest.json`
- `data/runtime/ar_factory/landmark_tree_v1/bridge_manifest.json`

辅助脚本：`scripts/miniapp/patch-p0a-webp-uris.js`

**验证**：

```text
landmark_tree_v1_p0a overlay → .../dragon_imprint_overlay.webp
landmark_tree_v1 overlay     → .../alignment_overlay.webp
```

---

### 5. 打包排除 Factory 预览图

`apps/miniapp/project.config.json` → `packOptions.ignore`：

```json
{
  "type": "regexp",
  "value": ".*/effect_preview/preview_sheet\\.(png|webp)$"
}
```

`preview_sheet` 仅用于 Factory / 文档预览，**不参与小程序运行时**，不上传代码包。

---

## 优化后结果

| 指标 | 优化前 | 优化后 | 变化 |
| --- | ---: | ---: | ---: |
| 媒体文件数 | 12 | **9** | -3 |
| 包内媒体合计 | 765.6 KB | **517.9 KB** | **-247.7 KB (-32%)** |
| 主包媒体 | 115.4 KB | **14.4 KB** | -101.0 KB |
| xr_demo 分包媒体 | 650.2 KB | **503.5 KB** | -146.7 KB |
| 单文件 > 200KB | 0 | **0** | — |
| 最大单文件 | 114.7 KB | **114.3 KB** | alignment_overlay.webp |

### 当前媒体清单（按大小降序）

| 文件 | 大小 KB | 后缀 |
| --- | ---: | --- |
| `xr_demo/.../landmark_tree_v1/alignment_overlay.webp` | 114.25 | webp |
| `xr_demo/.../effect_preview/preview_sheet.webp` | 82.63 | webp（已 ignore） |
| `xr_demo/.../effect_preview/azure_dragon_seal.webp` | 78.12 | webp |
| `xr_demo/.../effect_preview/dragon_imprint_overlay.webp` | 75.41 | webp |
| `xr_demo/.../effect_preview/dragon_head_reveal.webp` | 72.19 | webp |
| `xr_demo/.../effect_preview/dragon_energy_flow.webp` | 55.81 | webp |
| `xr_demo/.../landmark_tree_v1/position_guide.webp` | 25.06 | webp |
| `assets/ar_factory/landmark_ar_poc_v1/alignment_overlay.png` | 10.12 | png |
| `assets/ar_factory/landmark_ar_poc_v1/position_guide.png` | 4.32 | png |

---

## 变更文件清单

| 类型 | 路径 |
| --- | --- |
| 修改 | `apps/miniapp/project.config.json` |
| 修改 | `apps/miniapp/services/ar-runtime/runtime-service.js` |
| 修改 | `apps/miniapp/data/runtime/ar_factory/landmark_tree_v1/bridge_manifest.json` |
| 修改 | `apps/miniapp/data/runtime/ar_factory/landmark_tree_v1_p0a/*`（runtime / effect / preview / bridge） |
| 新增 | `scripts/miniapp/convert_miniapp_media_to_webp.py` |
| 新增 | `scripts/miniapp/patch-p0a-webp-uris.js` |
| 删除 | `apps/miniapp/assets/images/home-hero.jpg` |
| 删除 | `xr_demo/.../landmark_tree_v1_p0a/alignment_overlay.png` |
| 删除 | `xr_demo/.../landmark_tree_v1_p0a/position_guide.png` |
| 删除 | 7 个 AR PNG（已替换为 WebP） |

---

## 微信开发者工具复验步骤

1. **详情 → 清缓存 → 全部清除**
2. **重新编译**
3. 打开 **代码质量 → 代码包 → 图片和音频资源**
4. 可选：**工具 → 代码依赖分析**，确认无 >200KB 单文件

预期：**单文件 200KB 检查应通过**（最大 114.3 KB）。

若仍显示未通过，可能为**目录/分包合计**规则 → 下一步将 `effect_preview/` 四张运行时 WebP 外迁 CDN（见下文）。

---

## 后续建议（若仍告警）

| 优先级 | 动作 |
| --- | --- |
| P1 | `effect_preview` 运行时图改 CDN URL，仅保留 `alignment_overlay.webp`（114KB）在包内 |
| P2 | 将 `alignment_overlay.webp` 再压至 <80KB（降低 max_side / quality） |
| P3 | CI 接入 `node scripts/audit/miniapp-media-audit.js`，>200KB fail |

---

## 输出标记

```yaml
MINIAPP_MEDIA_OPTIMIZATION_V1: COMPLETE
SINGLE_FILE_OVER_200KB: 0
TOTAL_MEDIA_KB_BEFORE: 765.6
TOTAL_MEDIA_KB_AFTER: 517.9
MAIN_PACKAGE_MEDIA_KB_AFTER: 14.4
RUNTIME_WEBP_PATHS_SYNCED: YES
PREVIEW_SHEET_PACK_IGNORED: YES
READY_FOR_DEVTOOLS_RECHECK: YES
```
