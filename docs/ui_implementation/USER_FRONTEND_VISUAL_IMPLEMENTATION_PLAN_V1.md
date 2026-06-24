# USER_FRONTEND_VISUAL_IMPLEMENTATION_PLAN_V1

## 1. 本次实施目标

基于 `USER_AND_ADMIN_PAGE_VISUAL_IMPLEMENTATION_SCOPE_V1` 中 Phase 1 用户端核心闭环范围，在**不重构业务逻辑、不改动 Runtime 数据结构**的前提下，完成：

- 用户端 6 个核心页面的视觉统一与 polish
- 自定义底部导航五 Tab 补齐（首页 / 探索 / 信物 / 权益 / 我的）
- 公共东方探索样式层建立（`user-phase1.wxss`）
- 可验收的第一批真机 UI 呈现

**不在本次范围：** 商家后台、园区后台、超管后台；原生 `app.json` tabBar 图标资源包；AR 真实能力接入。

---

## 2. 涉及页面路径

| 编号 | 页面 | 路径 |
|------|------|------|
| A1/A2 | 入口首页 / 双首页 | `apps/miniapp/pages/index/` |
| A3 | 探索地图 | `apps/miniapp/pages/explore-map/` |
| A4 | 探索点详情（景区/探索承载） | `apps/miniapp/pages/scenic-detail/` |
| A6 | 信物详情（聚焦态在档案页内） | `apps/miniapp/pages/relic-archive/` |
| A7 | 我的信物 | `apps/miniapp/pages/relic-archive/` |
| A8 | 权益中心 | `apps/miniapp/pages/rights-center/` |
| — | 我的（Tab 承载） | `apps/miniapp/pages/profile/` |
| — | 底部导航组件 | `apps/miniapp/components/user-bottom-nav/` |

**路由说明：** 探索点打卡详情实际业务页为 `pages/merchant-event/detail/index`（已有路由，未改含义）。`scenic-detail` 承担景区/探索点故事+权益+前往承载页。

---

## 3. 技术栈与文件结构（扫描结论）

- **框架：** 微信原生小程序（`.wxml` / `.wxss` / `.js` / `.json`）
- **非 Taro / uni-app / React**
- **已有公共样式：** `apps/miniapp/styles/prototype-v1.wxss`
- **新增公共样式：** `apps/miniapp/styles/user-phase1.wxss`
- **已有公共组件：** `user-bottom-nav`、`prototype-v1` 设计 token 类
- **导航工具：** `apps/miniapp/utils/user-tab-nav.js`（Tab 页 `reLaunch`）
- **app.json：** 已注册全部页面路由，**未配置原生 tabBar**（采用自定义底部导航）

---

## 4. 各页面当前状态与 polish 方案

### 4.1 首页 `pages/index/`

**实施前：** 已有 prototype 骨架，品牌与闭环入口不完整，模板感较强。

**实施后：**
- Hero：品牌「AR游伴」、主文案「看见即是找回」、景区名、探索/信物/权益统计
- 「开始探索」主 CTA → 探索地图
- 今日推荐探索点、核心入口模块网格、回响轻模块
- `user-phase1-page` 底部留白适配自定义导航
- `activeTab: 'home'`

**验收：** 扫码进入可理解产品定位；可进入探索地图、信物、权益。

---

### 4.2 探索地图 `pages/explore-map/`

**实施前：** 列表型展示，缺少图谱感与状态区分。

**实施后：**
- 东方探索图谱区：`explore-graph` 星点节点 + 墨线路径
- 探索点卡片：`--lit` / `--dim` / `--next` 三态（已完成 / 待显现 / 推荐下一步）
- 推荐探索点文案提示
- 保留原有 `merchant-event/detail` 与 `ar-entry` 跳转逻辑
- `activeTab: 'map'`

**验收：** 可区分已完成与未完成；有推荐下一步；可进入详情与打卡。

---

### 4.3 探索点详情 `pages/scenic-detail/`

**实施前：** 景区详情页，结构偏信息罗列，无底部导航。

**实施后：**
- 文化故事、可获得信物、AR 显现说明、附近权益（来自活动 overview 映射，非 Runtime 改动）
- 开始打卡 → `merchant-event/exploration`
- 权益模块克制展示 + `rights-source` 来源标签
- 注册 `user-bottom-nav`，`activeTab: 'map'`
- 空权益 placeholder

**验收：** 用户理解来意、可获得物、可打卡、权益非主角。

---

### 4.4 我的信物 `pages/relic-archive/`

**实施前：** `mvp-page` 列表风，无底部导航，收藏册感不足。

**实施后：**
- Hero + 收集进度三格统计
- 信物边界说明面板保留（信物 ≠ 数字藏品）
- 双列 `relic-grid`：已获得温润质感 / 未获得虚线占位「尚未显现的印记」
- 信物点击聚焦详情（原有 star-map / meridian-map 逻辑保留）
- 「继续探索」→ 探索地图
- 注册 `user-bottom-nav`，`activeTab: 'relic'`

**验收：** 收藏册气质；已获得/未获得可辨；不混淆数字藏品。

---

### 4.5 权益中心 `pages/rights-center/`

**实施前：** 偏卡券列表，电商感风险。

**实施后：**
- 分区：活动概览 / 可领取 / 已领取 + 核销码占位
- `rights-source` 标注「来自探索」
- 权益说明强调在地礼遇，非积分商城
- `activeTab: 'rights'`（修正原 `progress` key 不匹配问题）

**验收：** 权益来源清晰；无大促/红包感；使用状态可读。

---

### 4.6 我的 `pages/profile/`

**实施前：** 已有 prototype 结构与底部导航。

**实施后：**
- 补充 `user-phase1-page` 底部留白
- `activeTab: 'me'` 与导航 key 对齐

---

## 5. 底部导航实施方案

**决策：** 不使用 `app.json` 原生 tabBar（避免双套导航、无现成 icon 资源增包体）。

**实现：** 自定义组件 `components/user-bottom-nav/`

| Tab | 文案 | 路径 |
|-----|------|------|
| home | 首页 | `/pages/index/index` |
| map | 探索 | `/pages/explore-map/index` |
| relic | 信物 | `/pages/relic-archive/index` |
| rights | 权益 | `/pages/rights-center/index` |
| me | 我的 | `/pages/profile/index` |

- 组件内 `onTap` → `user-tab-nav.navigateTab()`（Tab 页 `wx.reLaunch`）
- `NAV_ITEMS` 与 `user-frontend-service.js` 已同步
- 已挂载页面：index、explore-map、relic-archive、rights-center、profile、scenic-detail
- 文字 Tab，无大图 icon

---

## 6. 公共样式建议

**文件：** `apps/miniapp/styles/user-phase1.wxss`（扩展 `prototype-v1.wxss`）

| 类名 | 用途 |
|------|------|
| `.user-phase1-page` | 页面底部导航留白 |
| `.user-tagline` / `.user-hero-stats` | 首页品牌与统计 |
| `.user-primary-cta` | 主按钮 |
| `.user-module-grid` / `.user-module-card` | 入口模块 |
| `.user-echo-panel` | 回响轻模块 |
| `.explore-graph` / `.explore-node--*` | 探索图谱 |
| `.explore-point-card--*` | 探索点列表态 |
| `.relic-grid` / `.relic-grid-card--*` | 信物收藏册网格 |
| `.rights-source` / `.rights-qr-placeholder` | 权益来源与核销占位 |
| `.scenic-story-panel` / `.scenic-relic-chip` | 探索点详情 |

**色彩：** 米白 `#f4f1eb`、墨绿 `#263a34`、暖金 `#e8d8b4` / `#b68a3d`、黛青 `#4b635c`

---

## 7. 不改动项

- 不删除任何已有页面
- 不改动 Runtime / Mock 数据结构定义
- 不改动接口地址与服务层核心逻辑
- 不改变已有路由含义（`merchant-event/detail` 仍为探索点详情主路径）
- 不引入大型第三方 UI 框架
- 不做游戏化、仙侠化、电商堆叠、亮金爆闪视觉

---

## 8. 风险点

| 风险 | 说明 | 缓解 |
|------|------|------|
| 双首页语义 | `index` 同时承担入口与第二首页 | 当前用模块分区承载，后续可拆子 Tab 或滚动锚点 |
| scenic-detail vs merchant-event/detail | 范围文档 A4 路径与业务主路径不一致 | 文档已标注；打卡主流程仍走 merchant-event |
| 自定义导航非全局 | 部分子页面无底部导航 | Phase 2 可按需扩展挂载 |
| reLaunch 切换 | Tab 切换清空页面栈 | 符合 Tab 预期；子页仍用 navigateTo |
| 占位模块 | 部分权益/AR 为 placeholder | 已标注 placeholder，待真实数据接入 |

---

## 9. 验收标准

### 首页
- [x] AR游伴品牌 + 「看见即是找回」
- [x] 可进入探索地图、信物、权益
- [x] 景区信息与东方克制视觉

### 探索地图
- [x] 探索点展示 + 完成/未完成区分 + 推荐点
- [x] 可进入详情与打卡
- [x] 图谱风格非普通地图列表

### 探索点详情
- [x] 故事、信物、权益、打卡、导航按钮
- [x] 权益非页面主角

### 我的信物
- [x] 已获得/未获得展示 + 收藏册感
- [x] 信物与数字藏品边界文案

### 权益中心
- [x] 可领取/已领取 + 核销占位
- [x] 非电商商城感

### 底部导航
- [x] 五 Tab 可切换
- [x] 不破坏原有路由
- [ ] 真机全量回归（建议下一步）

---

## 10. 下一步建议

1. **真机 UI 回归：** 五 Tab 切换、reLaunch 性能、底部安全区适配
2. **merchant-event/detail polish：** 对齐 A4 探索点详情视觉（故事+信物+权益+打卡）
3. **Tab icon：** 轻量 SVG/字体图标，控制包体
4. **子页面导航策略：** ar-entry、progress-center 等是否显示底部导航
5. **Phase 2 页面：** story-flow、echo、star-map、meridian-map 视觉延续
6. **高保真素材：** 卷轴纹理、星图背景图（可选，注意包体）

---

## 变更文件索引（V1 实施）

**新增**
- `apps/miniapp/styles/user-phase1.wxss`
- `apps/miniapp/utils/user-tab-nav.js`
- `docs/ui_implementation/USER_FRONTEND_VISUAL_IMPLEMENTATION_PLAN_V1.md`

**修改**
- `apps/miniapp/components/user-bottom-nav/index.js`
- `apps/miniapp/services/user-frontend/user-frontend-service.js`
- `apps/miniapp/pages/index/*`
- `apps/miniapp/pages/explore-map/*`
- `apps/miniapp/pages/scenic-detail/*`
- `apps/miniapp/pages/relic-archive/*`
- `apps/miniapp/pages/rights-center/*`
- `apps/miniapp/pages/profile/index.wxml` / `index.wxss` / `index.js`

---

## V1.1 修订（USER_PHASE1_UI_FIXPACK_V1）

真机测试后执行质量修正包，详见 `USER_PHASE1_UI_FIXPACK_V1.md`：

- 修复 `merchant_event/*.seed.js` 中文乱码（源数据编码损坏）
- 探索地图重构为星点路径 + 时间轴
- 权益中心重组为探索礼遇三区
- 首页 / 信物 / 详情页减少工具感卡片堆叠

