# RELIC_ARCHIVE_COLLAPSE_EMPTY_SLOTS_FIX_V1

## 1. 问题说明

「我的信物 / 信物库」页面在已收录信物较少时，仍展示大量「待显现」空位，导致：

- 页面被空白占位拉得很长
- 视觉像游戏背包 / 库存格子
- 收藏册感被削弱
- 滑动成本过高

---

## 2. 折叠规则

**每行格位数：** `colCount = 3`（手机宽度下 3 列网格）

**核心公式（ownedCount > 0）：**

```
visibleRows = ceil(ownedCount / colCount)
visibleSlots = visibleRows * colCount
```

- 先填满已收录信物（选中信物优先排序）
- 剩余可见格位用淡化「待显现」占位补齐（不超过 `visibleSlots`）
- 其余未显现位置折叠，不铺满页面

---

## 3. ownedCount = 0 时展示规则

- 显示空状态区块：
  - 标题：第一枚印记尚未显现
  - 正文：从探索地图前往第一个探索点…
  - 按钮：前往探索
- **不**展示全部空位
- 仅展示 **1 行**（最多 3 个）淡化「待显现」占位
- 折叠提示：尚有 X 枚印记未显现
- 若 X > 3，可「展开查看全部」未显现印记（按实际 catalog 数量，非 60 格假空位）

---

## 4. ownedCount > 0 时展示规则

| ownedCount | visibleRows | visibleSlots | 示例 |
|------------|-------------|--------------|------|
| 1 | 1 | 3 | 1 已收录 + 2 淡化占位 |
| 4 | 2 | 6 | 4 已收录 + 2 淡化占位 |
| 7 | 3 | 9 | 7 已收录 + 2 淡化占位 |

超出 `visibleSlots` 的未显现印记 → 折叠区「尚有 X 枚印记未显现」

---

## 5. 每行 3 个位置的计算逻辑

实现位置：`apps/miniapp/pages/relic-archive/index.js` → `buildAlbumLayout()`

```javascript
const COL_COUNT = 3;
const visibleRows = Math.ceil(ownedCount / COL_COUNT);
const visibleSlotCount = visibleRows * COL_COUNT;
const pendingInGrid = Math.min(pendingTotal, visibleSlotCount - ownedCount);
const remainingPending = pendingTotal - pendingInGrid;
```

---

## 6. 剩余未显现位置折叠说明

- 默认折叠，显示虚线边框提示区
- 文案：尚有 X 枚印记未显现 / 继续探索后，它们会逐步收进这里
- 支持「展开查看全部」→ 展示 catalog 内剩余未显现印记（紧凑 3 列）
- 再次点击 → 收起
- 展开不影响已收录信物点击逻辑

---

## 7. 修改文件清单

- `apps/miniapp/pages/relic-archive/index.js` — `buildAlbumLayout` 折叠计算
- `apps/miniapp/pages/relic-archive/index.wxml` — 3 列网格 + 空状态 + 折叠区
- `apps/miniapp/pages/relic-archive/index.wxss` — 收藏册网格样式
- `apps/miniapp/styles/user-phase1.wxss` — `.relic-grid` 改为 3 列（全局一致）

---

## 8. 是否未改 Runtime 数据

**CONFIRMED** — 仅页面展示层计算与 WXML 结构，未改 `getRelicLibrary` 或服务层数据结构。

---

## 9. 是否未改业务逻辑

**CONFIRMED** — 信物数据来源、收录判定、点击详情逻辑未变。

---

## 10. 验收标记

```
RELIC_ARCHIVE_COLLAPSE_EMPTY_SLOTS_FIX_V1_CREATED = YES
RELIC_EMPTY_SLOTS_COLLAPSED = YES
RELIC_ARCHIVE_OWNED_COUNT_ZERO_EMPTY_STATE_OK = YES
RELIC_ARCHIVE_OWNED_COUNT_FOUR_SHOWS_TWO_ROWS = YES
RELIC_ARCHIVE_REMAINING_SLOTS_FOLDED = YES
DO_NOT_CHANGE_RUNTIME_DATA = CONFIRMED
DO_NOT_REBUILD_PRODUCT_LOGIC = CONFIRMED
READY_FOR_FINAL_USER_PHASE1_UI_ACCEPTANCE = YES
```

---

*文档版本：V1 · 2026-06-16*
