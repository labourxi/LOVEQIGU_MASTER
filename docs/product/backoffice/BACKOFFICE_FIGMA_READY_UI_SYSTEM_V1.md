# BACKOFFICE_FIGMA_READY_UI_SYSTEM_V1

# AR游伴 · Figma Ready 后台 UI 系统 V1

```yaml
project: LOVEQIGU / AR游伴
module: Figma Ready UI System
version: V1
status: COMPLETE
date: 2026-06-07
type: UI System（非业务逻辑）
upstream:
  - BACKOFFICE_DESIGN_SYSTEM_V1
  - BACKOFFICE_VISUAL_MOCKUP_V1
  - ADMIN_COMPONENT_LIBRARY_V1
  - PLATFORM_ADMIN_UI_V1
constraints:
  - 无 API · 无数据库 · 无 Runtime · 无 Release 变更
canvas:
  primary: 1440 × 900
  extended: 1920 × 1080
breakpoints: [1920, 1440, 1280, 1024]
```

---

## 1. 系统定位

将后台视觉体系升级为 **Figma Ready** 级别：

- 完整 **Design Token**（可导入 Figma Variables / Tokens Studio）
- 统一 **17 个核心组件**
- **4 个静态示例页**（组件总览 + 拼装 + 审核 + 卡券）
- Desktop First，四档响应式断点

---

## 2. 文件结构

```
apps/admin/shared/figma-ready/
├── tokens.json          # Figma Tokens 导入
├── tokens.css           # CSS Variables · 源 Token
├── system.css           # 组件样式 · 引用 tokens
├── ui-system.js         # 静态页面拼装（无业务逻辑）
├── index.html           # UI System 入口
├── overview.html        # 组件总览页
├── page-assembly.html   # Platform Dashboard 拼装
├── review-center.html   # 审核中心示例
└── coupon-center.html   # 卡券中心示例

apps/admin/shared/components/
├── index.js             # 组件渲染 API（增强）
└── library.css          # @import figma-ready/system.css
```

---

## 3. Design Token 规范

### 3.1 Colors

| Token | 值 | Figma 命名 |
|-------|-----|------------|
| `color.bg.page` | `#F7F5F0` | Paper/Page |
| `color.bg.panel` | `#FFFFFF` | Paper/Card |
| `color.text.primary` | `#2B2118` | Ink/Primary |
| `color.text.secondary` | `#6F5D4D` | Ink/Secondary |
| `color.text.muted` | `#9A8B7A` | Ink/Muted |
| `color.border.default` | `#E8E4DE` | Stone/Border |
| `color.accent.default` | `#5C4033` | Gold/Accent |
| `color.accent.light` | `#EBE0D4` | Gold/Light |
| `color.semantic.success` | `#2C7A4B` | Pine/Success |
| `color.semantic.warning` | `#B26B1B` | Amber/Warning |
| `color.semantic.danger` | `#A4412B` | Cinnabar/Danger |
| `color.semantic.info` | `#4A6670` | Slate/Info |

### 3.2 Spacing（4px 基准）

| Token | 值 |
|-------|-----|
| space.1 | 4px |
| space.2 | 8px |
| space.3 | 12px |
| space.4 | 16px |
| space.5 | 20px |
| space.6 | 24px |
| space.8 | 32px |
| space.12 | 48px |

### 3.3 Radius

| Token | 值 | 用途 |
|-------|-----|------|
| radius.sm | 8px | Button · Input · Badge |
| radius.md | 12px | Card · Table wrap |
| radius.lg | 16px | Modal |

### 3.4 Shadow

| Token | 值 |
|-------|-----|
| shadow.sm | `0 1px 3px rgba(43,33,24,0.06)` |
| shadow.md | `0 4px 16px rgba(43,33,24,0.08)` |
| shadow.lg | `0 8px 24px rgba(43,33,24,0.08)` |
| shadow.drawer | `-4px 0 24px rgba(43,33,24,0.1)` |

### 3.5 Typography

| Token | 值 | 用途 |
|-------|-----|------|
| fontSize.caption | 12px | 表头 · Badge |
| fontSize.body | 14px | 正文 |
| fontSize.h1 | 24px | Page title |
| fontSize.kpi | 28px | KPI 数值 |
| fontWeight.semibold | 600 | 标题 |
| fontFamily.base | PingFang SC 栈 | 全局 |

### 3.6 Table Density

| 模式 | 行高 | padding Y | padding X | 场景 |
|------|------|-----------|-----------|------|
| **comfortable** | 48px | 12px | 16px | 默认 · 商家端 |
| **compact** | 40px | 8px | 12px | 平台大数据列表 |

CSS class: `.ad-table--compact` · `.ad-table--sticky` · `.ad-table-wrap--sticky`

---

## 4. 响应式断点

| 断点 | 宽度 | content max | page padding | sidenav |
|------|------|-------------|--------------|---------|
| XL | 1920 | 1600px | 24px | 240px |
| LG | 1440 | 1360px | 24px | 240px |
| MD | 1280 | 1120px | 20px | 240px |
| SM | 1024 | 960px | 16px | 64px 折叠 |

---

## 5. 组件清单

| 组件 | CSS 前缀 | JS API | 关键规格 |
|------|----------|--------|----------|
| TopNav | `.ad-topnav` | `renderTopNav` | h 56px · sticky |
| SideNav | `.ad-sidenav` | `renderSideNav` | w 240px · active 左 3px |
| Breadcrumb | `.ad-breadcrumb` | `renderBreadcrumb` | 13px muted |
| PageHeader | `.ad-page-header` | `renderPageHeader` | H1 24px + actions |
| KpiCard | `.ad-kpi` | `renderKpiCard` | min-h 96 · value 28px |
| Table | `.ad-table` | `renderTable` | density · sticky |
| StatusBadge | `.ad-badge` | `renderStatusBadge` | 6 tones |
| Button | `.ad-btn` | `renderButton` | r 8px · lg 44px |
| FilterBar | `.ad-filter-bar` | `renderFilterBar` | chips + search |
| TabBar | `.ad-tab-bar` | `renderTabBar` | underline active |
| Pagination | `.ad-pagination` | `renderPagination` | 共 N 条 |
| Drawer | `.ad-drawer` | `renderDrawer` | w 480px · 右滑 |
| Modal | `.ad-modal` | `renderModal` | max 480px |
| EmptyState | `.ad-state--empty` | `renderEmptyState` | 无插画 |
| LoadingState | `.ad-state--loading` | `renderLoadingState` | |
| ErrorState | `.ad-state--error` | `renderErrorState` | |
| AppShell | `.ad-app` | `renderAppShell` | 全局壳层 |

---

## 6. 示例页说明

| 页面 | 路径 | 内容 |
|------|------|------|
| UI System Hub | `figma-ready/index.html` | 导航入口 |
| 组件总览 | `figma-ready/overview.html` | 全部 Token + 组件静态展示 |
| 页面拼装 | `figma-ready/page-assembly.html` | Platform Dashboard · KPI + Chart + Table |
| 审核中心 | `figma-ready/review-center.html` | Tab + Filter + Table + Drawer |
| 卡券中心 | `figma-ready/coupon-center.html` | Filter + 大数据 Table + Pagination |

---

## 7. Figma 导入指南

1. 安装 **Tokens Studio for Figma**
2. Import `apps/admin/shared/figma-ready/tokens.json`
3. 创建 Frame **1440 × 900**（主稿）· **1920 × 1080**（扩展）
4. 按 `overview.html` 对照绘制 Component Set
5. 用 `page-assembly / review-center / coupon-center` 验证拼装

---

## 8. 本地预览

```bash
npx serve apps/admin
# http://localhost:3000/shared/figma-ready/
```

---

## 9. 验收标记

```yaml
BACKOFFICE_FIGMA_READY_UI_SYSTEM_V1_COMPLETE: YES
design_tokens: [colors, spacing, radius, shadow, typography, table_density]
components: 17
example_pages: 4
breakpoints: 4
business_logic: NONE
```
