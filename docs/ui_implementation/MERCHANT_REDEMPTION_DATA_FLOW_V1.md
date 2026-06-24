# MERCHANT_REDEMPTION_DATA_FLOW_V1

## 1. 本轮目标

基于 `data-adapter` / `mock-source` / `merchant-admin-adapter` 打通商家后台卡券领取、扫码核销、核销记录、卡券统计与今日概览的数据联动（mock 内存流转，不接真实接口）。

---

## 2. 前置依赖

- `DATA_ADAPTER_LAYER_V1`
- `ROLE_BASED_ADMIN_NAVIGATION_V1`
- `apps/admin/merchant-portal/shared/merchant-adapter-boot.js`（新增）

---

## 3. Mock 数据说明

`mock-source.js` 补齐：

| 集合 | 说明 |
|------|------|
| merchants | merchant_001 爱企谷咖啡、merchant_002 探索书屋 |
| coupons | coupon_001 咖啡到店礼（300/180/72）、coupon_002 书店券 |
| couponClaims | LQG-CAFE-1001 可核销、1002 已核销、BOOK-2001 他店、过期/无效样例 |
| merchantStaff | staff_001 张店长、staff_002 小李 |

会话内变更通过 `merchant-admin-adapter` 的 `session` 对象维护，刷新页面后恢复 seed 数据。

**验收：** `MERCHANT_REDEMPTION_MOCK_DATA_READY = YES`

---

## 4. 核销状态流转规则

| 状态 | 行为 |
|------|------|
| UNUSED | 可核销 |
| USED | 不可重复核销 |
| EXPIRED | 不可核销 |
| INVALID | 不可核销 |
| 非本商家 | MERCHANT_MISMATCH |

核销成功：`UNUSED→USED`，写入 `redeemedAt` / `redeemedByStaffId`，`coupon.redeemedCount++`，重算 `redemptionRate`。

**验收：** `MERCHANT_REDEMPTION_STATUS_FLOW_READY = YES`

---

## 5. merchant-admin-adapter 方法

| 方法 | 说明 |
|------|------|
| `verifyCouponClaim(code, merchantId, staffId)` | **新增** 核销校验与内存更新 |
| `getMerchantDashboard` | 今日/累计指标、最近核销 |
| `getMerchantRedemptions` | 支持 `roleKey` + `staffId` 过滤 |
| `getMerchantRedemptionDetail` | 单条详情 |
| `getMerchantCoupons` / `getMerchantCouponDetail` | 与核销统计同步 |
| `getMerchantScanContext` | 示例码与待核销数 |
| `resetSession` | 重置 mock 会话 |

**验收：** `MERCHANT_REDEMPTION_ADAPTER_METHODS_READY = YES`

---

## 6–11. 页面接入

| 页面 | 接入方式 |
|------|----------|
| merchant_scan | `verifyCouponClaim` + 示例码快捷填入 |
| merchant_redemptions | `getMerchantRedemptions` + 角色范围 |
| merchant_redemption_detail | `getMerchantRedemptionDetail` + 详情页核销 |
| merchant_coupons / coupon_detail | `getMerchantCoupons` / `getMerchantCouponDetail` |
| merchant_dashboard | `getMerchantDashboard` 动态 KPI |

**验收：**

- `MERCHANT_SCAN_PAGE_ADAPTER_CONNECTED = YES`
- `MERCHANT_SCAN_VERIFY_ACTION_READY = YES`
- `MERCHANT_REDEMPTIONS_PAGE_ADAPTER_CONNECTED = YES`
- `MERCHANT_STAFF_REDEMPTION_SCOPE_READY = YES`
- `MERCHANT_REDEMPTION_DETAIL_READY = YES`
- `MERCHANT_COUPONS_PAGE_ADAPTER_CONNECTED = YES`
- `MERCHANT_COUPON_STATS_SYNC_READY = YES`
- `MERCHANT_DASHBOARD_ADAPTER_CONNECTED = YES`
- `MERCHANT_DASHBOARD_REDEMPTION_STATS_READY = YES`

---

## 12. 角色权限范围

| 角色 | 范围 |
|------|------|
| merchant_admin | 全店核销记录、全部卡券、dashboard 汇总 |
| merchant_staff | 仅 `redeemedByStaffId === staff_002` 的记录 |

**验收：** `MERCHANT_REDEMPTION_ROLE_SCOPE_READY = YES`

---

## 13. 状态中文化

通过 `status-map.js` `redemption` / `coupon` domain：`UNUSED`→未使用、`USED`→已核销、`MERCHANT_MISMATCH`→非本商家 等。

**验收：** `MERCHANT_REDEMPTION_STATUS_CHINESE = YES`

---

## 14. 不改动项

- 未接真实后端 / 支付 / 发票
- 未改 Runtime 数据结构
- 未改园区 / 平台后台
- `redemption-store.js` 保留未删除（scan 页已迁移至 adapter）

---

## 15. 风险点

1. Mock 会话刷新即丢失核销结果
2. `redemption-store.js` 与 adapter 短期双轨
3. 真实接口接入须后端幂等与防重复核销

---

## 16. 下一步建议

1. **PARK_ACTIVITY_REVIEW_FLOW_V1**
2. 废弃 `redemption-store.js` 或改为 adapter 代理
3. 核销成功写入 `operationLogs` mock

---

## 17. 验收标记

```
MERCHANT_REDEMPTION_DATA_FLOW_V1_CREATED = YES
MERCHANT_REDEMPTION_MOCK_DATA_READY = YES
MERCHANT_REDEMPTION_STATUS_FLOW_READY = YES
MERCHANT_REDEMPTION_ADAPTER_METHODS_READY = YES
MERCHANT_SCAN_PAGE_ADAPTER_CONNECTED = YES
MERCHANT_SCAN_VERIFY_ACTION_READY = YES
MERCHANT_REDEMPTIONS_PAGE_ADAPTER_CONNECTED = YES
MERCHANT_STAFF_REDEMPTION_SCOPE_READY = YES
MERCHANT_REDEMPTION_DETAIL_READY = YES
MERCHANT_COUPONS_PAGE_ADAPTER_CONNECTED = YES
MERCHANT_COUPON_STATS_SYNC_READY = YES
MERCHANT_DASHBOARD_ADAPTER_CONNECTED = YES
MERCHANT_DASHBOARD_REDEMPTION_STATS_READY = YES
MERCHANT_REDEMPTION_ROLE_SCOPE_READY = YES
MERCHANT_REDEMPTION_STATUS_CHINESE = YES
DO_NOT_CHANGE_RUNTIME_DATA = CONFIRMED
DO_NOT_REBUILD_PRODUCT_LOGIC = CONFIRMED
READY_FOR_PARK_ACTIVITY_REVIEW_FLOW_V1 = YES
```
