# USER_EXPLORATION_RUNTIME_FLOW_V1

## 1. 本轮目标

基于 `mock-source` / `user-app-adapter` / `merchant-admin-adapter` 打通用户端探索体验 Mock Runtime 数据闭环：首页 → 探索地图 → 探索点详情 → Mock 打卡 → AR 显现占位 → 信物显现 → 信物库 → 礼遇解锁 → 权益中心 → 商家核销联动 → 我的 / 星图 / 经络图进度同步。

不接真实后端、AR SDK、定位、扫码设备或支付。

---

## 2. 前置依赖

| 任务 | 状态 |
|------|------|
| DATA_ADAPTER_LAYER_V1 | PASS |
| ROLE_BASED_ADMIN_NAVIGATION_V1 | PASS |
| MERCHANT_REDEMPTION_DATA_FLOW_V1 | PASS |
| PARK_ACTIVITY_REVIEW_FLOW_V1 | PASS |
| PLATFORM_REVIEW_PUBLISH_FLOW_V1 | PASS |
| CONTENT_PRODUCTION_DATA_FLOW_V1 | PASS |
| USER_APP_ADAPTER_READY | YES |
| MERCHANT_ADMIN_ADAPTER_READY | YES |

---

## 3. Mock 数据说明

`mock-source.js` 新增 / 补齐：

| 集合 | 说明 |
|------|------|
| users | `user_001` 游客小游，`currentParkId=park_001`，`currentActivityId=activity_001` |
| userProgress | 用户活动级探索进度 |
| userPointStates | 探索点状态（`ep_001=AVAILABLE`，`ep_002=LOCKED`） |
| userRelics | 用户已显现信物（运行时写入） |
| arScanSessions | AR 扫描占位会话 |
| couponClaims | 补齐 `sourcePointId` / `sourceRelicId`；`claim_001` 归属 `user_001` |

`adapter-session.js` 会话内同步上述集合，并与 `couponClaims` / `coupons` 共享给商家 adapter。

**验收：** `USER_EXPLORATION_MOCK_DATA_READY = YES`

---

## 4. 用户探索状态流转规则

```
AVAILABLE → ARRIVED → CHECKED_IN → AR_SCANNED → RELIC_REVEALED → COUPON_UNLOCKED → COMPLETED
```

| 步骤 | 行为 |
|------|------|
| 开始探索 | `startExploration`：`AVAILABLE` → `ARRIVED` |
| Mock 打卡 | `mockCheckIn`：写入 `checkedInAt`，状态 `CHECKED_IN` |
| AR 扫描占位 | `startARScan`：创建 `arScanSessions`，`SCANNING` |
| 完成扫描 | `completeARScan`：`SUCCESS`，`AR_SCANNED`，触发信物显现 |
| 信物显现 | `revealRelic`：`userRelics` 写入，`RELIC_REVEALED` |
| 领取礼遇 | `unlockCoupon`：生成 / 复用 `couponClaim`，`COMPLETED` |
| 防重复 | 同一探索点不重复生成同一信物 / 卡券 |

未发布探索点（`ep_002`）不向用户端主列表暴露。

**验收：**

- `USER_EXPLORATION_STATUS_FLOW_READY = YES`
- `USER_RELIC_REVEAL_FLOW_READY = YES`
- `USER_COUPON_UNLOCK_FLOW_READY = YES`

---

## 5. user-app-adapter 方法说明

| 方法 | 说明 |
|------|------|
| `getHomeData(userId, activityId)` | 景区 / 活动 / 进度 / 信物数 / 礼遇数 / 推荐点 / 今日回响 |
| `getExploreMapData(userId, activityId)` | 已发布探索点列表 + 状态 + 绑定信物 / 礼遇 |
| `getExplorationPointDetail(pointId, userId)` | 详情 + 可执行动作标志 |
| `startExploration(pointId, userId)` | 开始探索 |
| `mockCheckIn(pointId, userId, actor)` | Mock 打卡 |
| `startARScan(pointId, userId)` | 创建 AR 扫描占位会话 |
| `completeARScan(scanSessionId, userId)` | 完成扫描并显现信物 |
| `revealRelic(pointId, userId)` | 信物显现 |
| `unlockCoupon(pointId, userId)` | 领取礼遇，写入 `couponClaims` |
| `getRelicArchive` / `getRelicDetail` | 信物库 / 详情 |
| `getRightsCenter` / `getCouponClaimDetail` | 权益中心 |
| `getProfileData` | 我的页统计 |
| `getStarMapProgress` / `getMeridianProgress` | 星图 / 经络图进度 |
| `resetSession` | 重置 mock 会话 |

会话通过 `LQGAdapterSessionStore` 与 `merchant-admin-adapter` 共享 `couponClaims`。

**验收：** `USER_APP_ADAPTER_RUNTIME_METHODS_READY = YES`

---

## 6. 首页接入说明

页面：`apps/miniapp/pages/index/`

- 通过 `user-runtime-adapter` 调用 `getHomeData`
- 展示当前活动、探索进度、信物 / 礼遇数量、推荐探索点、今日回响
- 不改 Phase 1 视觉结构

**验收：** `USER_HOME_ADAPTER_CONNECTED = YES`，`USER_HOME_PROGRESS_READY = YES`

---

## 7. 探索地图接入说明

页面：`apps/miniapp/pages/explore-map/`

- `getExploreMapData` 驱动探索点列表
- 状态中文展示（可探索 / 已打卡 / 已显现 / 已完成等）
- 仅展示已发布探索点（当前为 `ep_001`）

**验收：** `USER_EXPLORE_MAP_ADAPTER_CONNECTED = YES`，`USER_EXPLORE_POINT_STATUS_VISIBLE = YES`

---

## 8. 探索点详情接入说明

页面：`apps/miniapp/pages/merchant-event/detail/`

- `getExplorationPointDetail` + `mapDetailForPage`
- 「完成探索印记」→ `mockCheckIn`
- 「领取礼遇」→ `unlockCoupon`
- 「显现仪式」→ `ar-entry` 页

**验收：**

- `USER_POINT_DETAIL_ADAPTER_CONNECTED = YES`
- `USER_POINT_CHECKIN_ACTION_READY = YES`
- `USER_AR_SCAN_MOCK_ACTION_READY = YES`
- `USER_POINT_RELIC_REVEAL_ACTION_READY = YES`
- `USER_POINT_COUPON_UNLOCK_ACTION_READY = YES`

---

## 9. AR 扫描 / 显现占位说明

页面：`apps/miniapp/pages/ar-entry/`

Mock 流程：准备扫描 → 扫描中 → 显现完成 → 信物出现

文案使用：显现、信物、回响、探索（禁用抽卡 / SSR / 宝箱表达）

**验收：** `USER_AR_REVELATION_MOCK_FLOW_READY = YES`，`USER_AR_TERMINOLOGY_COMPLIANCE_READY = YES`

---

## 10. 信物库接入说明

页面：`apps/miniapp/pages/relic-archive/`

- `getRelicArchive` 同步已显现信物到收藏册
- 保留空位折叠规则（`buildAlbumLayout` 未改动）

**验收：**

- `USER_RELIC_ARCHIVE_ADAPTER_CONNECTED = YES`
- `USER_RELIC_ARCHIVE_PROGRESS_SYNC_READY = YES`
- `USER_RELIC_EMPTY_SLOT_COLLAPSE_PRESERVED = YES`

---

## 11. 权益中心接入说明

页面：`apps/miniapp/pages/rights-center/`

- `getRightsCenter` 展示待核销 / 已核销礼遇
- 显示核销码，可供商家 `merchant_scan` 识别

**验收：**

- `USER_RIGHTS_CENTER_ADAPTER_CONNECTED = YES`
- `USER_COUPON_CLAIM_VISIBLE = YES`
- `USER_COUPON_MERCHANT_REDEMPTION_SYNC_READY = YES`

---

## 12. 我的页面接入说明

页面：`apps/miniapp/pages/profile/`

- `getProfileData` 驱动昵称、景区 / 活动、进度、信物 / 礼遇统计、最近探索

**验收：** `USER_PROFILE_ADAPTER_CONNECTED = YES`，`USER_PROFILE_PROGRESS_SYNC_READY = YES`

---

## 13. 星图 / 经络图进度说明

页面：`apps/miniapp/pages/star-map/`、`meridian-map/`

- `getStarMapProgress` / `getMeridianProgress` 叠加进度百分比
- 不重做视觉

**验收：**

- `USER_STAR_MAP_PROGRESS_ADAPTER_CONNECTED = YES`
- `USER_MERIDIAN_PROGRESS_ADAPTER_CONNECTED = YES`

---

## 14. 商家核销联动说明

- 用户 `unlockCoupon` 写入共享 `couponClaims`
- `merchant-admin-adapter.verifyCouponClaim` 核销后 `claimStatus=USED`
- 用户权益中心 `getRightsCenter` 可读已核销状态

**验收：** `USER_TO_MERCHANT_REDEMPTION_SYNC_READY = YES`

---

## 15. 内容生产数据联动说明

- 探索点 / 信物 / 祝福 / AR 来自 `mock-source` 内容生产 seed
- 用户端仅展示已发布 / 可用内容（`ep_001` + `runtimeStatus=READY`）
- `ep_002` 草稿态不进入主列表
- 回响文案读取 `blessingContents`（`bless_001` 已定稿）

**验收：** `USER_APP_CONTENT_PRODUCTION_SYNC_READY = YES`

---

## 16. 状态中文化说明

`status-map.js` 新增 `exploration` 域：

| 英文 | 中文 |
|------|------|
| LOCKED | 未解锁 |
| AVAILABLE | 可探索 |
| CHECKED_IN | 已打卡 |
| RELIC_REVEALED | 已显现 |
| UNUSED | 待核销 |
| USED | 已核销 |

**验收：** `USER_EXPLORATION_STATUS_CHINESE = YES`

---

## 17. 不改动项

- 不接真实 API / AR SDK / 定位 / 微信登录 / 支付
- 不改 `apps/miniapp/data/runtime/` 结构
- 不重做用户端 UI / 商家后台主流程
- Mock 打卡 ≠ 真实线下打卡；信物 ≠ 数字藏品

---

## 18. 风险点

| 风险 | 说明 |
|------|------|
| 会话不持久 | 刷新页面恢复 seed；符合 Phase 2 mock 约定 |
| 双数据源 | 小程序部分页仍保留 merchant-event 回退路径 |
| 探索点 ID | 运行时使用 `ep_001`，与旧 seed `point_entrance_plaza` 通过 bridge 映射 |

---

## 19. 下一步建议

1. `PHASE2_RUNTIME_FLOW_FREEZE_V1` 冻结本轮 mock 闭环
2. 统一探索点 ID 至内容生产 ID
3. 小程序构建打包 shared adapter 路径
4. 浏览器 HTML 原型页接入 `user-adapter-boot.js`

---

## 20. 验收标记

```
USER_EXPLORATION_RUNTIME_FLOW_V1_CREATED = YES
USER_EXPLORATION_MOCK_DATA_READY = YES
USER_EXPLORATION_STATUS_FLOW_READY = YES
USER_RELIC_REVEAL_FLOW_READY = YES
USER_COUPON_UNLOCK_FLOW_READY = YES
USER_APP_ADAPTER_RUNTIME_METHODS_READY = YES
USER_HOME_ADAPTER_CONNECTED = YES
USER_HOME_PROGRESS_READY = YES
USER_EXPLORE_MAP_ADAPTER_CONNECTED = YES
USER_EXPLORE_POINT_STATUS_VISIBLE = YES
USER_POINT_DETAIL_ADAPTER_CONNECTED = YES
USER_POINT_CHECKIN_ACTION_READY = YES
USER_AR_SCAN_MOCK_ACTION_READY = YES
USER_POINT_RELIC_REVEAL_ACTION_READY = YES
USER_POINT_COUPON_UNLOCK_ACTION_READY = YES
USER_AR_REVELATION_MOCK_FLOW_READY = YES
USER_AR_TERMINOLOGY_COMPLIANCE_READY = YES
USER_RELIC_ARCHIVE_ADAPTER_CONNECTED = YES
USER_RELIC_ARCHIVE_PROGRESS_SYNC_READY = YES
USER_RELIC_EMPTY_SLOT_COLLAPSE_PRESERVED = YES
USER_RIGHTS_CENTER_ADAPTER_CONNECTED = YES
USER_COUPON_CLAIM_VISIBLE = YES
USER_COUPON_MERCHANT_REDEMPTION_SYNC_READY = YES
USER_PROFILE_ADAPTER_CONNECTED = YES
USER_PROFILE_PROGRESS_SYNC_READY = YES
USER_STAR_MAP_PROGRESS_ADAPTER_CONNECTED = YES
USER_MERIDIAN_PROGRESS_ADAPTER_CONNECTED = YES
USER_TO_MERCHANT_REDEMPTION_SYNC_READY = YES
USER_APP_CONTENT_PRODUCTION_SYNC_READY = YES
USER_EXPLORATION_STATUS_CHINESE = YES
VISUAL_LANDING_INDEX_UPDATED = YES
DO_NOT_CHANGE_RUNTIME_DATA = CONFIRMED
DO_NOT_REBUILD_PRODUCT_LOGIC = CONFIRMED
READY_FOR_PHASE2_RUNTIME_FLOW_FREEZE_V1 = YES
```

---

## 关键文件

| 文件 | 变更 |
|------|------|
| `apps/shared/data-adapter/mock-source.js` | 用户探索 mock 数据 |
| `apps/shared/data-adapter/adapter-session.js` | 会话扩展 |
| `apps/shared/data-adapter/status-map.js` | exploration 域 |
| `apps/shared/data-adapter/user-app-adapter.js` | 全量 runtime 方法 |
| `apps/shared/data-adapter/merchant-admin-adapter.js` | 共享会话 |
| `apps/shared/data-adapter/user-adapter-boot.js` | 浏览器加载器 |
| `apps/miniapp/services/user-runtime-adapter/index.js` | 小程序 bridge |
| `apps/miniapp/pages/index/` 等 | 页面接入 |

---

## 建议人工浏览器验收路径

1. 首页 → 确认活动 / 进度 / 推荐点
2. 探索地图 → `ep_001` 中文状态 → 进入详情
3. 详情 → Mock 打卡 → 显现仪式 → 完成扫描 → 领取礼遇
4. 信物库 → 新信物出现，空位折叠保留
5. 权益中心 → 核销码可见
6. 商家 `merchant_scan` → 输入核销码 → 核销成功
7. 权益中心回看 → 已核销
8. 我的 / 星图 / 经络图 → 进度更新
