# RELIC Library Discovery Audit Report

**Mission:** P1 · RELIC_LIBRARY_DISCOVERY_AUDIT  
**Generated:** 2026-06-09  
**Scope:** `apps/miniapp/` — 信物库 / 信物档案页面存在性、路由、入口可达性

---

## Verdict

## **`PASS (page exists, partial discovery gaps)`**

| Marker | Value |
|--------|-------|
| **RELIC_PAGE_EXISTS** | **YES** |
| **RELIC_ROUTE** | **`/pages/relic-archive/index`** |
| **HOME_ENTRY_EXISTS** | **YES** |
| **PROFILE_ENTRY_EXISTS** | **NO** |

---

## 1. 信物库页面是否存在

| Item | Result |
|------|--------|
| 主页面 | **YES** — `apps/miniapp/pages/relic-archive/index`（四件套齐全） |
| `app.json` 注册 | **YES** — 第 13 项 `pages/relic-archive/index` |
| 导航栏标题 | `信物档案`（`index.json`） |
| 页面内容标题 | `信物库`（`prototypeRuntime.getRelicLibrary().title`） |
| 数据源 | `relic-service` + `prototype-runtime-service.getRelicLibrary()` |
| 功能 | 按景区分组展示 Runtime 信物、收藏进度、资产边界说明 |

**结论：** 信物库功能页面 **已存在**，正式路由为 **relic-archive**。

### 遗留 / 未注册页面

| 路径 | 状态 | 说明 |
|------|------|------|
| `pages/relics/index` | **未注册** | 占位页，导航标题「我的信物」，**不在 `app.json`**，用户无法通过正常路由到达 |
| `pages/relic-archive/index` | **已注册** | 当前唯一可用的信物库页面 |

---

## 2. 页面路由

| 路由 | 注册 | 可导航 |
|------|------|--------|
| **`/pages/relic-archive/index`** | YES | YES |
| `/pages/relics/index` | NO | NO（文件存在但未注册） |

**DevTools 编译条件入口：** `project.config.json` → `condition.miniprogram.list` 含「信物档案」→ `pages/relic-archive/index`（仅开发者快捷打开，非用户入口）。

---

## 3. 入口位置汇总

| # | 入口位置 | 标签/文案 | 路由 | 可点击 | 状态 |
|---|----------|-----------|------|--------|------|
| 1 | 首页 · 探索模式 · **原型导航** | `信物库` | `/pages/relic-archive/index` | YES | **有效入口** |
| 2 | 首页 · `home-shell-service` sections 数据 | `最近获得` → relic-archive | `/pages/relic-archive/index` | NO | **数据已定义，UI 未渲染** |
| 3 | 首页 · 「最近获得」列表 | 信物名称展示 | — | NO | **只读，无跳转** |
| 4 | 个人中心 `pages/profile/index` | 统计「信物收藏」 | — | NO | **无入口** |
| 5 | 结缘模式 `affinity-home-panel` | — | — | NO | **无信物库入口** |
| 6 | TabBar | — | — | — | **无 TabBar 配置** |
| 7 | 探索地图 / 故事档案 / 权益中心 | — | — | NO | **无直达链接** |

---

## 4. 首页入口

### HOME_ENTRY_EXISTS = **YES**

**有效入口（1 处）：**

```text
pages/index/index
  └─ explore-home-panel（探索模式）
       └─ 原型导航 · quickLinks
            └─ label: 「信物库」
            └─ path: /pages/relic-archive/index
            └─ bindtap: onOpenPage → navigate 事件 → wx.navigateTo
```

数据源：`services/prototype/prototype-runtime-service.js` → `getHomeDashboard().quickLinks`

### 未接线的首页相关数据

`services/home/home-shell-service.js` 的 `buildExplorePanel().sections` 含：

```javascript
{
  id: 'recent_relics',
  label: '最近获得',
  path: '/pages/relic-archive/index'
}
```

该 `sections` 数组 **未在** `explore-home-panel.wxml` 中渲染，不构成用户可见入口。

---

## 5. 个人中心入口

### PROFILE_ENTRY_EXISTS = **NO**

`pages/profile/index` 现状：

| 区块 | 内容 | 跳转信物库 |
|------|------|------------|
| 收藏统计 | 「信物收藏 · N 件」 | NO |
| 已探索景区 | 景区卡片 | → scenic-detail only |
| 天人之系 | 星图 / 经络图 | → star-map / meridian-map |
| 信物库 / 信物档案链接 | — | **不存在** |

`profile/index.js` 无 `relic-archive` 或 `relics` 相关 `navigateTo`。

---

## 6. 命名与 IA 对齐说明

| 术语 | 出现位置 | 备注 |
|------|----------|------|
| 信物库 | 原型导航、relic-archive 页内 title | 产品原型用语 |
| 信物档案 | relic-archive 导航栏 | 页面注册名 |
| 我的信物 | `pages/relics` 占位、Rights copy | IA 目标入口名；**主页面未使用该路由** |

IA（`LOVEQIGU_INFORMATION_ARCHITECTURE_V1.md`）期望首页快捷入口含 **「我的信物」**。当前实现为原型区 **「信物库」**，且个人中心无对应入口。

---

## 7. 发现的问题（P1 后续建议）

| ID | 严重度 | 问题 |
|----|--------|------|
| R-001 | 中 | 个人中心无信物库入口（`PROFILE_ENTRY_EXISTS = NO`） |
| R-002 | 低 | `home-shell sections.recent_relics` 路径已定义但未渲染 |
| R-003 | 低 | 首页「最近获得」列表不可点击跳转 |
| R-004 | 低 | `pages/relics/index` 遗留占位页未注册，与 IA「我的信物」命名并存易混淆 |
| R-005 | 低 | 导航栏「信物档案」与页内「信物库」命名不一致 |

---

## 8. 文件索引

| 文件 | 角色 |
|------|------|
| `apps/miniapp/pages/relic-archive/index.*` | 信物库主页面 |
| `apps/miniapp/pages/relics/index.*` | 未注册遗留占位 |
| `apps/miniapp/services/prototype/prototype-runtime-service.js` | `getRelicLibrary()` + 首页 quickLinks |
| `apps/miniapp/components/explore-home-panel/explore-home-panel.wxml` | 首页「信物库」入口 UI |
| `apps/miniapp/services/home/home-shell-service.js` | sections 数据（未渲染） |
| `apps/miniapp/pages/profile/index.*` | 个人中心（无信物库入口） |
| `apps/miniapp/app.json` | 路由注册 |

---

`RELIC_LIBRARY_DISCOVERY_AUDIT_COMPLETE = YES`
