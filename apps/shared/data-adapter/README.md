# LOVEQIGU Data Adapter Layer

## 定位

`apps/shared/data-adapter/` 是 Phase 2 统一数据适配层，用于将分散在各后台与用户端的 Mock 数据收口，并为后续真实 API 替换预留入口。

**当前模式：** `mock`（默认）  
**预留模式：** `api`（未实现，不发起网络请求）

## 加载方式（浏览器）

按顺序引入脚本后使用全局对象 `LoveqiguDataAdapter`：

```html
<script src="../../shared/data-adapter/mock-source.js"></script>
<script src="../../shared/data-adapter/status-map.js"></script>
<script src="../../shared/data-adapter/role-map.js"></script>
<script src="../../shared/data-adapter/user-app-adapter.js"></script>
<script src="../../shared/data-adapter/merchant-admin-adapter.js"></script>
<script src="../../shared/data-adapter/park-admin-adapter.js"></script>
<script src="../../shared/data-adapter/platform-admin-adapter.js"></script>
<script src="../../shared/data-adapter/content-production-adapter.js"></script>
<script src="../../shared/data-adapter/search-adapter.js"></script>
<script src="../../shared/data-adapter/ar-runtime-bridge.js"></script>
<script src="../../shared/data-adapter/index.js"></script>
```

```javascript
var dashboard = LoveqiguDataAdapter.merchantAdmin.getMerchantDashboard("merchant_001");
var label = LoveqiguDataAdapter.status.formatStatus("PENDING", "redemption").label; // 待核销
```

## Node / 工具链

```javascript
const adapter = require("./index.js");
```

需先 `require` 各子模块，或由 bundler 打包。

## 文件说明

| 文件 | 职责 |
|------|------|
| `index.js` | 统一导出入口，`mock` / `api` mode 切换 |
| `mock-source.js` | 标准 Mock 数据集（16 类核心对象） |
| `status-map.js` | 状态中文化 `formatStatus(status, domain)` |
| `role-map.js` | 五类角色菜单与门户配置 |
| `user-app-adapter.js` | 用户端 6 类读接口 |
| `merchant-admin-adapter.js` | 商家后台 8 类读接口 |
| `park-admin-adapter.js` | 园区后台 8 类读接口 |
| `platform-admin-adapter.js` | 平台后台 9 类读接口 |
| `content-production-adapter.js` | 内容生产线 7 类读接口 |
| `search-adapter.js` | 全局搜索 9 类对象 |
| `adapter-session.js` | Session 持久化（sessionStorage / localStorage） |
| `ar-runtime-bridge.js` | AR 设备能力 mock 桥接层（不接真实 SDK） |

## AR Runtime Bridge Mock

`ar-runtime-bridge.js` 是 AR 设备能力与未来真实 AR SDK 的统一桥接层。

1. 当前为 **mock implementation**，不调用真实摄像头、定位或 AR SDK
2. 页面不得直接调用 AR SDK；应继续通过 `user-app-adapter` 触发 AR 流程
3. Bridge 不写 `userRelics` / `userPointState` / `couponClaims`
4. 后续真实 SDK 接入时只替换 bridge 内部实现，不改页面与 adapter 对外方法
5. 调试对象（开发环境）：`window.LQGARuntimeBridge`、`window.LQGARDebug`
6. 统一入口：`LoveqiguDataAdapter.arRuntimeBridge` 或 `LQGARRuntimeBridge`

加载顺序（浏览器）需在 `index.js` 之前引入：

```html
<script src="../../shared/data-adapter/ar-runtime-bridge.js"></script>
```

```javascript
var caps = LQGARRuntimeBridge.detectDeviceCapabilities();
LQGARDebug.simulateARUnsupported();
```

## AR Runtime Bridge User Adapter Wiring

`user-app-adapter.js` 的 AR 流程已接入 `ar-runtime-bridge.js`。

1. 页面调用方式不变，仍通过 `LoveqiguDataAdapter.userApp.startARScan` / `completeARScan` / `completeARFallback`
2. `startARScan` 会先调用 bridge 的 `detectDeviceCapabilities`，再按推荐模式请求摄像头权限或启动 mock AR session
3. `completeARScan` 通过 bridge 的 `completeARSession` 完成 mock 显现，由 adapter 写入 `AR_SCANNED` 状态
4. `completeARFallback` 通过 bridge 的 `completeFallback` 完成备用显现，由 adapter 写入 `AR_SCANNED_WITH_FALLBACK`
5. 当前仍不接真实 AR SDK，不调用真实摄像头 / 定位
6. bridge 不写 `userRelics` / `couponClaims` / `userPointState`
7. `revealRelic` 与 `unlockCoupon` 仍由 `user-app-adapter` 独立处理；`completeARScan` 不会自动触发显现

```javascript
var start = LoveqiguDataAdapter.userApp.startARScan("ep_001", "user_001");
var complete = LoveqiguDataAdapter.userApp.completeARScan(start.scanSessionId, "user_001");
var reveal = LoveqiguDataAdapter.userApp.revealRelic("ep_001", "user_001");
```

## 与现有 Mock 的关系

以下文件**未删除、未替换**，页面仍可独立运行：

- `apps/admin/platform-admin/shared/mock-store.js`
- `apps/admin/merchant-portal/shared/redemption-store.js`
- `apps/admin/platform-admin/shared/platform-global-search.js`

迁移策略：页面逐步改为调用 adapter，adapter 内部可先代理到上述 legacy mock。

## 不改 Runtime 数据

本层仅提供前端 Mock 读模型与状态/角色配置，**不修改** Canon Runtime 数据结构、不写入真实发布系统。

## 后续迁移步骤

1. 单页面试点：从 adapter 读取 dashboard 数据
2. 将 legacy mock 字段映射到 `mock-source.js`
3. 实现 `api` mode 下各 adapter 方法的 fetch 实现
4. 保留 `formatStatus` 作为唯一用户可见状态出口
5. 接入 `ROLE_BASED_ADMIN_NAVIGATION_V1` 使用 `role-map.js`

## Adapter Session Persistence

Phase 3 起，`adapter-session.js` 提供 mock 演示层持久化（**不等于真实后端**）。

### 当前持久化模式

| 模式 | 说明 |
|------|------|
| `memory` | 仅内存，刷新丢失 |
| `sessionStorage` | **默认**，同 tab 刷新保留 |
| `localStorage` | 跨 tab 保留，适合长演示 |

### Storage Key

- Session：`LOVEQIGU_ADAPTER_SESSION_V1`
- Meta：`LOVEQIGU_ADAPTER_SESSION_META_V1`
- Backup：`LOVEQIGU_ADAPTER_SESSION_BACKUP_V1`

### 重置 Session

```javascript
LQGAdapterSessionStore.resetSession();
// 或 console
LQGAdapterSessionDebug.reset();
```

### 导出 / 导入 Session

```javascript
var snapshot = LQGAdapterSessionStore.exportSessionSnapshot();
LQGAdapterSessionStore.importSessionSnapshot(snapshot);
```

### 持久化数据范围

用户探索、商家核销、园区活动、平台审查发布、内容生产相关 session 集合（见 `SESSION_COLLECTION_KEYS`）。

### 调试工具（Console）

```javascript
LQGAdapterSessionDebug.printSummary();
LQGAdapterSessionDebug.setMode("localStorage");
LQGAdapterSessionDebug.export();
```

### 未来真实 API 替换

页面仍只调用 adapter；将 `index.js` mode 切换为 `api` 后，adapter 内部从 fetch 读取，**页面不直接读写 storage**。
