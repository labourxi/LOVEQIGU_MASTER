# ROLE_BASED_ADMIN_NAVIGATION_V1

## 1. 本轮目标

建立 Phase 2 角色驱动后台导航层，使商家、园区、平台后台的左侧菜单、顶部按钮、后台切换入口、代管视图标记由 `role-map.js` 配置驱动，替代页面写死的角色入口。

**边界：** 不接真实登录/权限接口，前端隐藏不等于真实安全。

---

## 2. 前置依赖

- `DATA_ADAPTER_LAYER_V1` — `role-map.js`、`index.js`
- `PHASE2_DATA_PERMISSION_INTEGRATION_PLAN_V1` — 角色体系规划
- `backoffice-shell.js` — 共享顶栏与侧栏渲染

---

## 3. 角色列表

| roleKey | roleName | 主要门户 |
|---------|----------|----------|
| visitor | 用户 | user_app |
| merchant_admin | 商家管理员 | merchant_admin |
| merchant_staff | 商家核销员 | merchant_admin |
| park_admin | 园区负责人 | park_admin |
| platform_admin | 平台管理员 | platform_admin + 代管视图 |

每角色含：`allowedPortals`、`forbiddenPortals`、`visibleMenus`、`visibleTopbarActions`、`canImpersonatePark`、`canEnterMerchantPortal`、`canEnterParkPortal`、`canEnterPlatformPortal`

**验收：** `ROLE_MAP_COMPLETE = YES`

---

## 4. 当前角色解析规则

优先级（`role-navigation.js` → `resolveCurrentRole`）：

1. URL 参数 `?role=`
2. `localStorage` → `loveqigu.currentRole`
3. 路径推断（merchant-portal → merchant_admin，park-admin → park_admin，platform-admin → platform_admin）

**验收：** `CURRENT_ROLE_RESOLUTION_READY = YES`

---

## 5. 商家后台菜单规则（merchant_admin）

**顶部：** 商家管理员 · 控制台入口 · 退出（无平台/园区/更多后台）

**侧栏：** 今日概览、扫码核销、核销记录、我的卡券、账单与发票、工单、帮助中心、门店资料、核销员

**验收：** `MERCHANT_ADMIN_NAV_ROLE_BASED = YES`

---

## 6. 商家核销员菜单规则（merchant_staff）

**顶部：** 商家核销员 · 退出（可选顶栏扫码 CTA）

**侧栏：** 扫码核销、我的核销记录、帮助中心

**禁止：** 财务、门店资料、核销员管理、平台/园区入口

**验收：** `MERCHANT_STAFF_NAV_MINIMAL = YES`

---

## 7. 园区后台菜单规则（park_admin）

**顶部：** 园区负责人 · 控制台入口 · 退出

**侧栏：** 数据总览、活动数据、创建活动、发布检查、商家数据、工单、帮助中心、操作日志

**禁止：** 商家/平台后台入口

**验收：** `PARK_ADMIN_NAV_ROLE_BASED = YES`

---

## 8. 平台后台菜单规则（platform_admin）

**顶部：** 平台管理员 · 控制台入口 · 更多后台 · 退出 · 全局搜索

**侧栏：** 平台总览、审查/发布、景区/活动/卡券分析、内容生产 7 项、工单、系统设置

**验收：** `PLATFORM_ADMIN_NAV_ROLE_BASED = YES`

---

## 9. 更多后台规则

仅 `platform_admin` 且 `more_portals` 动作可见时展示：

- 进入园区视图（`?asPlatform=1&parkId=&role=platform_admin`）
- 进入商家视图（`?asPlatform=1&merchantId=&role=platform_admin`）

仅 1 个可切换目标时显示单链接，不显示「更多后台」下拉；≥2 个时显示下拉。

**验收：** `PLATFORM_MORE_PORTALS_ROLE_BASED = YES`

---

## 10. 页面访问拦截占位说明

`forbiddenPortals` 或 `checkAccess` 失败时：

- 主内容区显示 `bo-access-denied` 卡片
- 文案：当前账号暂无访问该后台的权限
- 按钮：返回我的工作台
- 侧栏隐藏

**验收：** `ROLE_BASED_ACCESS_GUARD_READY = YES`

---

## 11. 平台代管视图说明

`?asPlatform=1` 时，`platform_admin` 可进入园区/商家视图：

- 顶栏显示「代管查看」标记
- 内容区顶部 `bo-impersonation-banner`：平台代管视图 · 当前景区/商家 + 返回平台后台
- 不伪装为园区负责人/商家管理员本人

**验收：**

- `PARK_AS_PLATFORM_VIEW_BADGE_READY = YES`
- `PLATFORM_IMPERSONATION_VIEW_BADGE_READY = YES`

---

## 12. 修改文件清单

| 文件 | 变更 |
|------|------|
| `apps/shared/data-adapter/role-map.js` | 完整五角色配置 + 菜单别名 |
| `apps/admin/shared/role-navigation.js` | **新增** 角色解析、过滤、守卫、代管横幅 |
| `apps/admin/shared/backoffice-shell.js` | 角色驱动顶栏/侧栏、自动加载 role 脚本、访问守卫 |
| `apps/admin/shared/backoffice.css` | bo-role-badge、bo-access-denied、bo-impersonation-banner 等 |
| `apps/admin/merchant-portal/shared/page-boot.js` | 退出回调 |
| `apps/admin/park-admin/shared/page-boot.js` | 退出回调；代管横幅改由 shell 统一处理 |

**未修改：** 用户端页面、Runtime 数据、各后台 HTML 页面结构

---

## 13. 不改动项

1. 不接真实登录/权限 API
2. 不改 Runtime 数据结构
3. 不重做 UI 视觉
4. 不删除后台页面
5. 不把前端隐藏当作真实安全

---

## 14. 风险点

1. 角色脚本异步加载可能导致极短延迟后菜单刷新
2. `localStorage` 角色可被用户手动修改（预期内，非真实安全）
3. 部分园区页仍引用 `activity_new` 为 active id，与 `activity_create` 菜单 id 需逐步对齐
4. 真实权限接入时必须后端二次校验

---

## 15. 下一步建议

1. **MERCHANT_REDEMPTION_DATA_FLOW_V1** — 核销数据闭环
2. 单页将 active 菜单 id 与 role-map 对齐
3. 平台 login 成功后写入 `loveqigu.currentRole`
4. 代管视图操作写入 `operationLogs` mock

---

## 16. 验收标记

```
ROLE_BASED_ADMIN_NAVIGATION_V1_CREATED = YES
ROLE_MAP_COMPLETE = YES
CURRENT_ROLE_RESOLUTION_READY = YES
BACKOFFICE_SHELL_ROLE_DRIVEN = YES
ROLE_BASED_TOPBAR_READY = YES
ROLE_BASED_SIDEBAR_READY = YES
MERCHANT_ADMIN_NAV_ROLE_BASED = YES
MERCHANT_STAFF_NAV_MINIMAL = YES
PARK_ADMIN_NAV_ROLE_BASED = YES
PARK_AS_PLATFORM_VIEW_BADGE_READY = YES
PLATFORM_ADMIN_NAV_ROLE_BASED = YES
PLATFORM_MORE_PORTALS_ROLE_BASED = YES
ROLE_BASED_ACCESS_GUARD_READY = YES
PLATFORM_IMPERSONATION_VIEW_BADGE_READY = YES
DO_NOT_CHANGE_RUNTIME_DATA = CONFIRMED
DO_NOT_REBUILD_PRODUCT_LOGIC = CONFIRMED
READY_FOR_MERCHANT_REDEMPTION_DATA_FLOW_V1 = YES
```
