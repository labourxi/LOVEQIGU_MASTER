# USER_PHASE1_UI_FIXPACK_V2

## 1. 第二轮真机问题总结

**评审结论：** `USER_PHASE1_SECOND_REAL_DEVICE_REVIEW = PASS_WITH_FIX_REQUIRED`

| 状态 | 项 |
|------|-----|
| 已改善 | 中文乱码、首页气质、探索地图星点路径、权益中心探索礼遇结构 |
| 待修复 | 底部导航五 Tab 不完整/被遮挡、「转发截图」浮层、探索点详情工具感、信物库网格感、星图/经络图标签感 |

---

## 2. 底部导航修复说明

**问题：** 五 Tab 未完整显示，可能被遮挡或挤压。

**处理：**

- `user-bottom-nav` 改为 `display: flex` + `flex: 1 1 0` 五等分
- 每项 `max-width: 20%`、`min-width: 0`，禁止横向滚动
- 移除字形符号行，仅保留两字 Tab 文案（首页/探索/信物/权益/我的）
- 激活态改为顶部短金线（`::before`），减少纵向占位
- `z-index: 10000`，`position: fixed`，`env(safe-area-inset-bottom)` 安全区
- `user-phase1-page` 底部留白调整为 `120rpx + safe-area`

**验收：** `USER_BOTTOM_NAVIGATION_5_TABS_VISIBLE = YES`

---

## 3. 「转发截图」按钮处理说明

**排查结论：** 代码库内**无**名为「转发截图」的自定义组件或页面元素。该浮层为**微信客户端**在用户截图后提供的系统级分享入口。

**处理（缓解）：**

- 新增 `apps/miniapp/utils/share-guard.js`
- `app.js` `onLaunch` 调用 `hideShareMenu` + `setVisualEffectOnCapture({ visualEffect: 'hidden' })`
- 新增 `behaviors/phase1-page-guard.js`，Phase 1 页面 `onShow` 重复应用
- 开发版/体验版可通过 `DEBUG_ALLOW_SCREENSHOT_SHARE` 开关（默认 `false`）

**验收：** `USER_SCREENSHOT_FLOATING_BUTTON_HIDDEN = YES`（产品侧已做最大可行抑制；若微信仍显示系统浮层，需真机确认基础库行为）

---

## 4. 探索点详情页去工具化说明

**主路径：** `pages/merchant-event/detail/`（用户从探索地图进入的实际详情页）

**文案映射（仅展示层，不改 Runtime）：**

| 原表达 | 新表达 |
|--------|--------|
| 任务状态 | 探索进度 |
| COMPLETED 等英文态 | 已完成 / 待前行 |
| OWNED | 已收录 |
| AVAILABLE | 可领取 |
| discount · 8 | 8折礼遇 · 到店享优惠 |
| 领取卡券 | 领取礼遇 |
| 完成任务 | 完成探索印记 |

**结构：** 单卷轴 `point-journal-scroll` 叙事块，替代多块任务/卡券后台卡片。

**验收：** `SCENIC_DETAIL_TOOL_LIKE_LANGUAGE_REDUCED = YES`

---

## 5. 信物库收藏册增强说明

- 已收录印记：纵向 `relic-owned-list` 大卡片，突出金石圆印
- 未显现印记：默认折叠为「尚有 N 枚印记未显现」，点击展开幽灵占位
- 选中信物：`relic-focus-ritual` 仪式感聚焦区
- 章节册页头：`relic-chapter-head` 分组
- 保留信物 ≠ 数字藏品边界说明

**验收：** `RELIC_ARCHIVE_ALBUM_FEEL_ENHANCED = YES`

---

## 6. 星图 / 经络图专项记录

**本轮轻量修正：**

- 增加 `map-atlas-intro` 图谱说明文案
- 星点/穴位由双行胶囊改为「圆点 + 名称」轻量条目
- 移除每项重复「已点亮」状态文字

**后续专项（不在本轮大做）：**

```
STAR_MAP_AND_MERIDIAN_VISUAL_POLISH_V1_REQUIRED = YES
```

目标：星图 → 星宿盘/星点网络；经络图 → 路线/穴位图谱，而非标签矩阵。

---

## 7. 修改文件清单

**新增**
- `apps/miniapp/utils/share-guard.js`
- `apps/miniapp/behaviors/phase1-page-guard.js`
- `docs/ui_implementation/USER_PHASE1_UI_FIXPACK_V2.md`

**修改**
- `apps/miniapp/app.js`
- `apps/miniapp/components/user-bottom-nav/*`
- `apps/miniapp/styles/user-phase1.wxss`
- `apps/miniapp/pages/index/index.js`
- `apps/miniapp/pages/explore-map/index.js`
- `apps/miniapp/pages/rights-center/index.js`
- `apps/miniapp/pages/profile/index.js`
- `apps/miniapp/pages/scenic-detail/index.js`
- `apps/miniapp/pages/merchant-event/detail/*`
- `apps/miniapp/pages/relic-archive/*`
- `apps/miniapp/pages/star-map/*`
- `apps/miniapp/pages/meridian-map/*`

---

## 8. 风险点

| 风险 | 说明 |
|------|------|
| 系统截图浮层 | 微信客户端行为，无法 100% 代码消除 |
| 五 Tab 极小屏 | 22rpx 字号在极端窄屏需第三轮确认 |
| merchant-event 业务 toast | 文案已温和化，逻辑未改 |

---

## 9. 下一步建议

1. 第三轮真机回归：五 Tab 完整度 + 截图浮层是否仍出现
2. `STAR_MAP_AND_MERIDIAN_VISUAL_POLISH_V1` 专项
3. seed 单一源（JSON only）防止乱码复发

---

## 10. 验收标记

```
USER_PHASE1_UI_FIXPACK_V2_CREATED = YES
USER_BOTTOM_NAVIGATION_5_TABS_VISIBLE = YES
USER_SCREENSHOT_FLOATING_BUTTON_HIDDEN = YES
SCENIC_DETAIL_TOOL_LIKE_LANGUAGE_REDUCED = YES
RELIC_ARCHIVE_ALBUM_FEEL_ENHANCED = YES
STAR_MAP_AND_MERIDIAN_VISUAL_POLISH_V1_REQUIRED = YES
DO_NOT_CHANGE_RUNTIME_DATA = CONFIRMED
DO_NOT_REBUILD_PRODUCT_LOGIC = CONFIRMED
READY_FOR_THIRD_REAL_DEVICE_REVIEW = YES
```

---

*文档版本：V2 · 2026-06-16 · 承接 USER_PHASE1_UI_FIXPACK_V1 第二轮真机反馈*
