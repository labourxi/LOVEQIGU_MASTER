# DATA_ADAPTER_LAYER_V1

## 1. 本轮目标

建立 Phase 2 统一数据适配层，将用户端、商家后台、园区后台、平台后台、内容生产 / AR生产线中分散的 Mock 数据收口到 `apps/shared/data-adapter/`，为后续真实 API 替换做准备。

**边界：** 不接真实接口、不改 Runtime 数据、不重做页面视觉、不要求一次性迁移所有页面。

---

## 2. 目录结构

实际采用路径（项目原无 `apps/shared/`，新建如下）：

```
apps/shared/data-adapter/
├── index.js
├── mock-source.js
├── status-map.js
├── role-map.js
├── search-adapter.js
├── user-app-adapter.js
├── merchant-admin-adapter.js
├── park-admin-adapter.js
├── platform-admin-adapter.js
├── content-production-adapter.js
└── README.md
```

**未重复造轮子说明：** 保留既有：

- `apps/admin/platform-admin/shared/mock-store.js`
- `apps/admin/merchant-portal/shared/redemption-store.js`
- `apps/admin/platform-admin/shared/platform-global-search.js`

adapter 为增量层，legacy mock 待页面逐步迁移。

---

## 3. Adapter 总设计

统一入口：`LoveqiguDataAdapter`（`index.js`）

```javascript
{
  mode: "mock",           // 预留 "api"
  setMode / getMode,
  mockSource,
  userApp,
  merchantAdmin,
  parkAdmin,
  platformAdmin,
  contentProduction,
  search,
  status: { formatStatus },
  role: { getRoleConfig, getAllRoles }
}
```

---

## 4. Mock Source 说明

`mock-source.js` 包含 16 类标准对象代表数据：

parks, merchants, activities, explorationPoints, relics, blessingContents, arContents, coupons, couponClaims, reviews, publishes, workOrders, operationLogs, artRequests, generationTasks, users

提供 `get(collection, id)` / `find(collection, predicate)` 辅助方法。

**验收：** `MOCK_SOURCE_STANDARDIZED = YES`

---

## 5. 状态字典说明

`status-map.js` → `formatStatus(status, domain)`

支持 domain：generic, activity, review, publish, coupon, redemption, finance, content, ar, workOrder

内部枚举保持英文，用户可见层统一中文。例如 `PENDING` + `redemption` →「待核销」。

**验收：** `STATUS_MAP_SHARED_READY = YES`

---

## 6. 角色配置说明

`role-map.js` → `getRoleConfig(roleKey)`

五类角色：visitor, merchant_admin, merchant_staff, park_admin, platform_admin

每角色含：roleKey, roleName, allowedPortals, defaultEntry, visibleTopbarActions, visibleMenus, forbiddenPortals

当前仅为配置，不 enforced 真实权限。

**验收：** `ROLE_CONFIG_ADAPTER_READY = YES`

---

## 7–12. 各域 Adapter 说明

| Adapter | 关键方法 | 覆盖页面 |
|---------|----------|----------|
| user-app-adapter | getHomeData, getExploreMapData, getExplorationPointDetail, getRelicArchive, getRightsCenter, getProfileData | 用户端 6 类核心读场景 |
| merchant-admin-adapter | getMerchantDashboard, getMerchantCoupons, … getMerchantHelp | 商家后台 8 类 |
| park-admin-adapter | getParkDashboard, getParkActivities, … getParkOperationLogs | 园区后台 8 类 |
| platform-admin-adapter | getPlatformDashboard, getReviewQueue, … getPlatformSettings | 平台后台 9 类 |
| content-production-adapter | getContentProductionDashboard, getExplorationPoints, … getGenerationTasks | 内容生产线 7 类 |
| search-adapter | searchGlobal(keyword, options) | 9 类全局搜索 |

各 adapter 当前仅返回 mock，未接页面。

**验收：**

- `USER_APP_ADAPTER_READY = YES`
- `MERCHANT_ADMIN_ADAPTER_READY = YES`
- `PARK_ADMIN_ADAPTER_READY = YES`
- `PLATFORM_ADMIN_ADAPTER_READY = YES`
- `CONTENT_PRODUCTION_ADAPTER_READY = YES`
- `GLOBAL_SEARCH_ADAPTER_READY = YES`
- `DATA_ADAPTER_ENTRY_READY = YES`

---

## 13. 不改动项

1. 未修改用户端 / 商家 / 园区 / 平台 HTML 页面
2. 未改 Runtime 数据结构
3. 未接真实后端接口
4. 未改权限系统
5. 未删除现有 mock 文件

---

## 14. 风险点

1. **双轨数据：** adapter 与 legacy mock 短期并存，需迁移清单避免字段漂移
2. **路径差异：** search-adapter 使用 `apps/admin/...` 绝对式路径，页面引用时需按相对路径调整
3. **浏览器加载顺序：** 须按 README 顺序引入脚本
4. **api mode 空壳：** `setMode("api")` 已预留但未实现 fetch

---

## 15. 下一步建议

1. **ROLE_BASED_ADMIN_NAVIGATION_V1** — 使用 `role-map.js` 驱动菜单可见性
2. 商家 dashboard 单页面试点接入 `merchantAdmin.getMerchantDashboard`
3. `platform-global-search.js` 代理至 `searchAdapter.searchGlobal`
4. 编写 `MERCHANT_REDEMPTION_DATA_FLOW_V1` 对接 redemption-store

---

## 16. 验收标记

```
DATA_ADAPTER_LAYER_V1_CREATED = YES
DATA_ADAPTER_ENTRY_READY = YES
MOCK_SOURCE_STANDARDIZED = YES
STATUS_MAP_SHARED_READY = YES
ROLE_CONFIG_ADAPTER_READY = YES
USER_APP_ADAPTER_READY = YES
MERCHANT_ADMIN_ADAPTER_READY = YES
PARK_ADMIN_ADAPTER_READY = YES
PLATFORM_ADMIN_ADAPTER_READY = YES
CONTENT_PRODUCTION_ADAPTER_READY = YES
GLOBAL_SEARCH_ADAPTER_READY = YES
DO_NOT_CHANGE_RUNTIME_DATA = CONFIRMED
DO_NOT_REBUILD_PRODUCT_LOGIC = CONFIRMED
READY_FOR_ROLE_BASED_ADMIN_NAVIGATION_V1 = YES
```
