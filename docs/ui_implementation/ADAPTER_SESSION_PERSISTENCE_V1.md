# ADAPTER_SESSION_PERSISTENCE_V1

## 1. 本轮目标

在 Phase 2 Mock Runtime 数据闭环基础上，将 `adapter-session` 从纯内存态扩展为支持 `sessionStorage` / `localStorage` 的演示层持久化，使用户探索、商家核销、园区审核、平台审查发布、内容生产等 mock 数据流在刷新页面和跨页演示时更稳定。

不接真实后端，不改 Runtime 数据结构，不重做 UI。

---

## 2. 前置依赖

| 任务 | 状态 |
|------|------|
| PHASE1_VISUAL_ACCEPTANCE_FREEZE_V1 | PASS |
| PHASE2_RUNTIME_FLOW_FREEZE_V1 | PASS |
| PHASE3_REAL_API_AND_PERMISSION_INTEGRATION_PLAN_V1 | PASS |

---

## 3. 当前 Phase 2 风险

1. Adapter session 多为内存态
2. 刷新页面后可能恢复 seed 数据
3. 跨页演示状态不稳定
4. mock 数据与旧 seed / localStorage 可能并存
5. 真实 API 替换前缺少稳定演示层

---

## 4. 持久化设计

核心对象：`LQGAdapterSessionStore`（`apps/shared/data-adapter/adapter-session.js`）

| 方法 | 说明 |
|------|------|
| `initSession(options)` | 优先读持久化，否则从 seed 初始化 |
| `getSession()` | 获取当前 session |
| `saveSession(session)` | 写入 storage + 更新 meta |
| `persistAfterWrite()` | 写操作后自动保存快捷入口 |
| `resetSession()` | 清空并从 seed 重建 |
| `clearSession()` | 仅清除 storage，不立即 seed |
| `exportSessionSnapshot()` | 导出 JSON 快照 |
| `importSessionSnapshot(snapshot)` | 校验并导入 |
| `getSessionMeta()` | 读取 meta |
| `migrateSessionIfNeeded(session)` | 版本迁移 |
| `enablePersistence(mode)` | 启用持久化 |
| `disablePersistence()` | 禁用持久化（memory） |

调试对象：`window.LQGAdapterSessionDebug`

---

## 5. 存储模式

| 模式 | 行为 |
|------|------|
| `memory` | 仅内存，适合单页快速测试 |
| `sessionStorage` | **默认**，同 tab 刷新保留 |
| `localStorage` | 跨 tab 保留，适合长演示 |

Storage Key：

- `LOVEQIGU_ADAPTER_SESSION_V1`
- `LOVEQIGU_ADAPTER_SESSION_META_V1`
- `LOVEQIGU_ADAPTER_SESSION_BACKUP_V1`（迁移失败备份）

---

## 6. Session 数据范围

持久化覆盖 `SESSION_COLLECTION_KEYS`：

**用户端：** users, userProgress, userPointStates, userRelics, arScanSessions, couponClaims

**商家核销：** merchants, merchantStaff, coupons, couponClaims, redemptions

**园区活动：** parks, activities, parkMerchants, reviewRecords, operationLogs

**平台审查发布：** reviewRecords, publishRecords, publishLogs, platformRisks

**内容生产：** explorationPoints, relics, blessingContents, arContents, artRequests, generationTasks

全局搜索索引由当前 session 动态构建，不单独持久化。

**验收：** `ADAPTER_SESSION_DATA_SCOPE_READY = YES`

---

## 7. Session Meta

```json
{
  "version": "1.0.0",
  "persistenceMode": "sessionStorage",
  "seedVersion": "PHASE2_RUNTIME_FLOW_FREEZE_V1",
  "source": "mock_adapter_session",
  "phase": "ADAPTER_SESSION_PERSISTENCE_V1"
}
```

**验收：** `ADAPTER_SESSION_META_READY = YES`

---

## 8. 初始化规则

`initSession(options)`：

1. 优先读取持久化 session
2. 存在且版本兼容则加载
3. 不存在则从 `mock-source.js` seed 初始化
4. 版本不兼容则 `migrateSessionIfNeeded`
5. 迁移失败则备份旧 session 并从 seed 初始化
6. 初始化后写入 meta
7. 不破坏现有 adapter 方法调用

**验收：** `ADAPTER_SESSION_INIT_READY = YES`

---

## 9. 保存规则

关键写操作后调用 `persistAfterWrite()` / `saveSession()`：

- 用户打卡 / AR 扫描 / 信物显现 / 礼遇领取
- 商家核销
- 园区草稿保存 / 提交发布检查
- 平台审查决策 / 发布占位
- 内容生产生成 / 提交审查

保存失败 `console.warn`，不中断页面流程。

**验收：** `ADAPTER_SESSION_AUTOSAVE_READY = YES`

---

## 10. 重置 / 清除规则

| 方法 | 行为 |
|------|------|
| `resetSession()` | 清空 storage → seed 重建 → 更新 `lastResetAt` |
| `clearSession()` | 仅清除 storage，下次 `init` 再 seed |

**验收：** `ADAPTER_SESSION_RESET_CLEAR_READY = YES`

---

## 11. 导出 / 导入规则

`exportSessionSnapshot()` 返回 `{ meta, session, exportedAt, checksum, note }`

`importSessionSnapshot(snapshot)` 校验格式 / version / 必要集合，失败不覆盖当前 session。

**验收：** `ADAPTER_SESSION_IMPORT_EXPORT_READY = YES`

---

## 12. 迁移兼容规则

`migrateSessionIfNeeded`：补齐缺失集合与 meta；失败备份至 `LOVEQIGU_ADAPTER_SESSION_BACKUP_V1`。

**验收：** `ADAPTER_SESSION_MIGRATION_READY = YES`

---

## 13. 各 Adapter Autosave 接入

| Adapter | 写操作 | 验收 |
|---------|--------|------|
| user-app-adapter | startExploration, mockCheckIn, startARScan, completeARScan, revealRelic, unlockCoupon | USER_APP_SESSION_AUTOSAVE_READY |
| merchant-admin-adapter | verifyCouponClaim | MERCHANT_SESSION_AUTOSAVE_READY |
| park-admin-adapter | saveParkActivityDraft, submitParkActivityReview | PARK_SESSION_AUTOSAVE_READY |
| platform-admin-adapter | submitReviewDecision, publishTarget | PLATFORM_SESSION_AUTOSAVE_READY |
| content-production-adapter | generate*, submitContentReview | CONTENT_PRODUCTION_SESSION_AUTOSAVE_READY |

---

## 14. Debug 工具说明

Console 可用：

```javascript
LQGAdapterSessionDebug.printSummary();
LQGAdapterSessionDebug.export();
LQGAdapterSessionDebug.reset();
LQGAdapterSessionDebug.clear();
LQGAdapterSessionDebug.setMode("localStorage");
LQGAdapterSessionDebug.import(snapshot);
```

**验收：** `ADAPTER_SESSION_DEBUG_TOOLS_READY = YES`

---

## 15. README 更新说明

`apps/shared/data-adapter/README.md` 已追加 **Adapter Session Persistence** 章节。

**验收：** `ADAPTER_SESSION_README_UPDATED = YES`

---

## 16. 禁止事项

1. 页面不得直接读写 localStorage / sessionStorage
2. 页面不得绕过 adapter-session
3. 页面不得直接改 mock-source
4. 不得把 storage 当真实数据库

**验收：** `NO_DIRECT_PAGE_STORAGE_ACCESS = CONFIRMED`

---

## 17. 人工验收路径

### 用户探索

首页 → 探索点 → Mock 打卡 → AR 显现 → 领取礼遇 → **刷新** → 信物库 / 权益中心 / 我的进度保留

### 商家核销

复制核销码 → merchant_scan 核销 → **刷新** → 核销记录保留 → 用户权益中心显示已核销

### 平台审查发布

提交审查 → 通过 → 发布 → **刷新** → 状态保留

### 园区活动

草稿 → 勾选声明 → 提交检查 → **刷新** → 草稿 / 日志保留

### 内容生产

生成信物 / 祝福 / AR / 美术需求 → **刷新** → 绑定与任务保留

### Debug

`LQGAdapterSessionDebug.printSummary()` / `reset()` / `export()`

---

## 18. 不改动项

- 不接真实 API / 登录 / 权限 / AR / 核销 / 发布
- 不改 Runtime 数据结构
- 不重做各端 UI
- 不引入新框架

---

## 19. 风险点

1. Node / 小程序环境无 sessionStorage，自动降级 memory
2. 旧页面 legacy mock store 可能仍并存
3. localStorage 容量有限，不适合大规模数据
4. 持久化仍为 mock 演示层，不等于真实后端

---

## 20. 下一步建议

进入 **AUTH_ROLE_IDENTITY_PLAN_V1**：规划真实登录、角色身份与服务端权限校验。

---

## 21. 验收标记

```
ADAPTER_SESSION_PERSISTENCE_V1_CREATED = YES
ADAPTER_SESSION_DATA_SCOPE_READY = YES
ADAPTER_SESSION_META_READY = YES
ADAPTER_SESSION_INIT_READY = YES
ADAPTER_SESSION_AUTOSAVE_READY = YES
ADAPTER_SESSION_RESET_CLEAR_READY = YES
ADAPTER_SESSION_IMPORT_EXPORT_READY = YES
ADAPTER_SESSION_MIGRATION_READY = YES
USER_APP_SESSION_AUTOSAVE_READY = YES
MERCHANT_SESSION_AUTOSAVE_READY = YES
PARK_SESSION_AUTOSAVE_READY = YES
PLATFORM_SESSION_AUTOSAVE_READY = YES
CONTENT_PRODUCTION_SESSION_AUTOSAVE_READY = YES
ADAPTER_SESSION_DEBUG_TOOLS_READY = YES
ADAPTER_SESSION_README_UPDATED = YES
NO_DIRECT_PAGE_STORAGE_ACCESS = CONFIRMED
DO_NOT_CHANGE_RUNTIME_DATA = CONFIRMED
DO_NOT_REBUILD_PRODUCT_LOGIC = CONFIRMED
ADAPTER_SESSION_PERSISTENCE_V1_READY = YES
READY_FOR_AUTH_ROLE_IDENTITY_PLAN_V1 = YES
```

---

## 关键文件

| 文件 | 变更 |
|------|------|
| `adapter-session.js` | 持久化层全量实现 |
| `user-app-adapter.js` 等 | autosave 接入 |
| `index.js` | initSession on boot |
| `*-adapter-boot.js` | 加载 adapter-session + init |
| `user-runtime-adapter/index.js` | initSession |
| `README.md` | 持久化章节 |
