# HOME Relic Discovery Improvement Report

**Mission:** P1 · HOME_RELIC_DISCOVERY_IMPROVEMENT_V1  
**Generated:** 2026-06-09  
**Goal:** 提升信物系统可发现性

---

## Verdict

## **`PASS`**

| Marker | Value |
|--------|-------|
| **TOP_RELIC_ENTRY_EXISTS** | **YES** |
| **VIEW_ALL_LINK_EXISTS** | **YES** |
| **RECENT_RELICS_CLICKABLE** | **YES** |
| **RELIC_DETAIL_DEEP_LINK** | **YES** |

| Metric | Count |
|--------|------:|
| Checks passed | 9 |
| Failures | 0 |

---

## Changes Applied

| # | Requirement | Implementation |
|---|-------------|----------------|
| 1 | 「最近获得」标题 + 查看全部 > | `section-head-row` + `查看全部 >` → `/pages/relic-archive/index` |
| 2 | 最近获得列表可点击 | 每项 `bindtap` + `data-path="{{item.path}}"` |
| 3 | 点击信物 → 详情或信物库 | `/pages/relic-archive/index?relicId={id}` + 信物库顶部详情面板 |
| 4 | 首页顶部「已获得信物 N 件」 | `relic-summary-bar` → `/pages/relic-archive/index` |

---

## Entry Map (Explore Home)

```text
explore-home-panel
├── [NEW] relic-summary-bar
│     └── 已获得信物 N 件 → /pages/relic-archive/index
├── 最近获得
│     ├── 查看全部 > → /pages/relic-archive/index
│     └── relic-item ×3 → /pages/relic-archive/index?relicId=...
└── 原型导航 · 信物库（既有）
```

---

## Relic Detail Flow

无独立 `relic-detail` 页面。点击首页信物 → 信物库页顶部 **信物详情** 面板（`focusedRelic`），列表中对应卡片高亮。

---

## Files Modified

| File | Change |
|------|--------|
| `services/home/home-shell-service.js` | `getRelicSummary()` + `recentRelics[].path` |
| `components/explore-home-panel/explore-home-panel.wxml` | 顶部入口 + 查看全部 + 列表点击 |
| `components/explore-home-panel/explore-home-panel.wxss` | summary bar / relic item 样式 |
| `pages/relic-archive/index.js` | `relicId` 查询参数 → 详情面板 |
| `pages/relic-archive/index.wxml` | `focused-relic-panel` + 高亮卡片 |
| `pages/relic-archive/index.wxss` | 详情面板样式 |

---

## Failures

**None.**

---

`HOME_RELIC_DISCOVERY_IMPROVEMENT_V1_COMPLETE = YES`
