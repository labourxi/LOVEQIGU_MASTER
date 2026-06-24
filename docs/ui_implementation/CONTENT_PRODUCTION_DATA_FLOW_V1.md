# CONTENT_PRODUCTION_DATA_FLOW_V1

## 1. 本轮目标

基于 `mock-source` / `content-production-adapter` / 共享 `adapter-session` / `platform-admin-adapter` 打通内容生产线 mock 数据闭环，覆盖探索点、信物、祝福内容、AR 内容、美术需求单、生成任务的生成、绑定、提交审查与发布状态回写。

不接真实 AI / AR 服务、不改 Runtime 数据结构、不做真实发布。

## 2. 前置依赖

| 依赖项 | 状态 |
|--------|------|
| DATA_ADAPTER_LAYER_V1 | PASS |
| PLATFORM_REVIEW_PUBLISH_FLOW_V1 | PASS |
| CONTENT_PRODUCTION_REVIEW_PUBLISH_SYNC_READY | YES |

## 3. Mock 数据说明

`mock-source.js` 扩展：

- **explorationPoints**：`blessingContentId`、`artRequestId`、`reviewStatus`、`publishStatus`、`runtimeStatus`
- **relics**：`artStatus`、`runtimeStatus`
- **blessingContents**：`contentType`（blessing/revelation/echo/claim_hint/explore_hint）、`runtimeStatus`
- **arContents**：`arType`（scan/revelation_ritual 等）、`runtimeStatus`
- **artRequests**：`reviewStatus`、`arContentId`
- **generationTasks**：标准 `taskType` 枚举

共享 session 通过 `adapter-session.js` 与园区 / 平台审查发布数据同源。

## 4. 内容生产状态流转规则

```
DRAFT → GENERATED → PENDING_REVIEW → APPROVED → READY_TO_PUBLISH → PUBLISHED
                              ↘ NEED_INFO / BLOCKED / REJECTED（不可发布）
```

生成任务：`PENDING` → `PROCESSING` → `GENERATED` → `PENDING_REVIEW` → …

## 5. 绑定关系说明

探索点 ↔ 信物 ↔ 祝福内容 ↔ AR 内容 ↔ 美术需求单，通过 `relicId` / `blessingContentId` / `arContentId` / `artRequestId` 字段互相关联。生成方法自动回写绑定。

## 6. content-production-adapter 方法说明

| 方法 | 说明 |
|------|------|
| `getContentProductionDashboard()` | 生产总览统计 |
| `getExplorationPoints` / `getExplorationPointDetail` | 探索点 |
| `generateRelicPlaceholder` | 生成信物占位 |
| `generateBlessingContent` | 生成祝福文案候选 |
| `generateARPlaceholder` | 生成 AR 占位 |
| `generateArtRequest` | 创建美术需求单 |
| `submitContentReview` | 提交平台审查 |
| `getRelics` / `getBlessingContents` / `getARContents` / … | 各对象列表与详情 |
| `getGenerationTasks` | 生成任务 |
| `buildSearchIndex` | 全局搜索索引 |

Boot：`apps/admin/platform-admin/shared/content-production-boot.js`

## 7–13. 页面接入说明

| 页面 | 接入 |
|------|------|
| `platform_content_dashboard` | KPI、待补齐、近期任务 |
| `platform_exploration_points` | 生成 + 提交审查操作 |
| `platform_relics` | 审查 / 发布状态同步 + 数字藏品边界提示 |
| `platform_blessing_content` | 术语合规 + 审查提交 |
| `platform_ar_content` | AR 绑定规则 + 审查 / 发布 |
| `platform_art_requests` | 复制 Prompt + 标记已生成 + 审查 |
| `platform_generation_tasks` | 任务列表 + 日志查看 |

## 14. 平台审查 / 发布中心联动

`submitContentReview` 写入共享 `reviewRecords`；平台 `submitReviewDecision` / `publishTarget` 结果通过 `enrichReviewPublish` 回写内容生产页面。

## 15. 全局搜索联动

`platform-global-search.js` 合并 `buildSearchIndex()` 动态结果，支持探索点、信物、祝福、AR、美术需求、生成任务。

## 16. 角色权限范围

- `platform_admin`：完整内容生产线
- `park_admin` / `merchant_admin`：不可访问平台内容生产全局管理

## 17. 状态中文化

`status-map.js` content 域扩展 `PENDING_GENERATION`、`PENDING_BINDING`、`BOUND` 等。

## 18. 不改动项

- 不接真实 AI / 图片 / AR 服务
- 不改 Runtime 真实数据
- 信物 ≠ 数字藏品（页面保留提示）
- 不重做 UI 视觉

## 19. 风险点

1. Session 内存态，刷新重置
2. Mock 生成为即时占位，非异步任务
3. 全局搜索静态 INDEX 与动态 INDEX 可能重复条目

## 20. 下一步建议

1. **USER_EXPLORATION_RUNTIME_FLOW_V1**：用户侧探索 Runtime mock
2. 生成任务异步模拟（setTimeout 状态推进）
3. sessionStorage 持久化便于演示

## 21. 验收标记

```
CONTENT_PRODUCTION_DATA_FLOW_V1_CREATED = YES
CONTENT_PRODUCTION_MOCK_DATA_READY = YES
CONTENT_PRODUCTION_STATUS_FLOW_READY = YES
CONTENT_PRODUCTION_BINDING_FLOW_READY = YES
CONTENT_PRODUCTION_ADAPTER_METHODS_READY = YES
CONTENT_DASHBOARD_ADAPTER_CONNECTED = YES
CONTENT_DASHBOARD_STATS_READY = YES
EXPLORATION_POINTS_PAGE_ADAPTER_CONNECTED = YES
EXPLORATION_POINT_GENERATE_ACTIONS_READY = YES
RELICS_PAGE_ADAPTER_CONNECTED = YES
RELIC_REVIEW_PUBLISH_STATUS_SYNC_READY = YES
RELIC_NOT_DIGITAL_COLLECTIBLE_RULE_VISIBLE = YES
BLESSING_CONTENT_PAGE_ADAPTER_CONNECTED = YES
BLESSING_CONTENT_REVIEW_PUBLISH_SYNC_READY = YES
BLESSING_TERMINOLOGY_COMPLIANCE_READY = YES
AR_CONTENT_PAGE_ADAPTER_CONNECTED = YES
AR_CONTENT_REVIEW_PUBLISH_STATUS_SYNC_READY = YES
AR_CONTENT_BINDING_RULE_VISIBLE = YES
ART_REQUESTS_PAGE_ADAPTER_CONNECTED = YES
ART_REQUEST_PROMPT_COPY_READY = YES
ART_REQUEST_REVIEW_FLOW_READY = YES
GENERATION_TASKS_PAGE_ADAPTER_CONNECTED = YES
GENERATION_TASKS_WRITE_AND_DISPLAY_READY = YES
CONTENT_TO_PLATFORM_REVIEW_FLOW_READY = YES
CONTENT_TO_PLATFORM_PUBLISH_FLOW_READY = YES
GLOBAL_SEARCH_CONTENT_PRODUCTION_SYNC_READY = YES
CONTENT_PRODUCTION_ROLE_SCOPE_READY = YES
CONTENT_PRODUCTION_STATUS_CHINESE = YES
DO_NOT_CHANGE_RUNTIME_DATA = CONFIRMED
DO_NOT_REBUILD_PRODUCT_LOGIC = CONFIRMED
READY_FOR_USER_EXPLORATION_RUNTIME_FLOW_V1 = YES
```
