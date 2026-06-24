# TOKEN_ARCHIVE_DATA_SCHEMA_AND_API_CONTRACT_V1

## 0. Document Status

- STATUS: FROZEN_FOR_IMPLEMENTATION
- OWNER: TECH / PRODUCT SHARED
- PURPOSE: 冻结宝物、信物别名、图谱节点、用户收录记录、待点亮队列、档案查看写回、前后端 API 契约与错误处理规则

---

## 1. Core Principle

本系统正式采用以下关系：

```text
用户打卡获得宝物
↓
宝物绑定信物别名
↓
信物别名映射到星链 / 经络图谱节点
↓
用户进入信物档案页
↓
系统读取未查看队列
↓
节点点亮
↓
写回 archiveViewed
```

冻结原则：

```text
掉落物 = 宝物
信物 = 宝物对应的别名 / 图谱节点身份
信物档案 = 节点点亮与收录进度页面
```

---

## 2. Entity Overview

核心实体共 5 类：

```text
1. TreasureDefinition        宝物定义
2. TokenAliasDefinition      信物别名定义
3. ArchiveGraphNode          图谱节点定义
4. UserTreasureRecord        用户获得记录
5. TokenArchiveRevealRecord  档案点亮播放记录
```

---

## 3. TreasureDefinition

### 3.1 Purpose

定义一个可掉落、可收藏、可展示的宝物。

宝物是实体化资产，具备名称、形态、视觉资源、来源说明。

### 3.2 Schema

```text
treasureId: string
treasureName: string
treasureType: string
treasureVisualAssetId: string
treasureVisualAssetType: 'IMAGE' | 'GLTF' | 'SPRITE' | 'PLACEHOLDER'
rarity: 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'NONE'
description: string
sourceType: 'EXPLORE_POINT' | 'EVENT' | 'MANUAL_GRANT' | 'SYSTEM'
isActive: boolean
createdAt: string
updatedAt: string
```

### 3.3 Example

```json
{
  "treasureId": "treasure_lotus_seal_001",
  "treasureName": "莲花印",
  "treasureType": "SEAL",
  "treasureVisualAssetId": "asset_lotus_seal_v1",
  "treasureVisualAssetType": "GLTF",
  "rarity": "COMMON",
  "description": "一枚带有莲纹的古朴印记。",
  "sourceType": "EXPLORE_POINT",
  "isActive": true,
  "createdAt": "2026-06-20T00:00:00.000Z",
  "updatedAt": "2026-06-20T00:00:00.000Z"
}
```

---

## 4. TokenAliasDefinition

### 4.1 Purpose

定义宝物对应的信物别名。

信物别名不是宝物本体，而是宝物映射到星链 / 经络图谱中的节点身份。

### 4.2 Schema

```text
tokenAliasId: string
tokenAliasName: string
tokenDisplayName: string
tokenSystemType: 'STAR' | 'MERIDIAN'
tokenGroupId: string
tokenNodeId: string
description: string
isActive: boolean
createdAt: string
updatedAt: string
```

### 4.3 Example: Star

```json
{
  "tokenAliasId": "token_star_jiaosu_001",
  "tokenAliasName": "角宿一",
  "tokenDisplayName": "角宿一（室女座 α，Spica）",
  "tokenSystemType": "STAR",
  "tokenGroupId": "star_group_jiaosu",
  "tokenNodeId": "star_node_jiaosu_001",
  "description": "角宿中的第一颗星位。",
  "isActive": true,
  "createdAt": "2026-06-20T00:00:00.000Z",
  "updatedAt": "2026-06-20T00:00:00.000Z"
}
```

### 4.4 Example: Meridian

```json
{
  "tokenAliasId": "token_meridian_baihui",
  "tokenAliasName": "百会穴",
  "tokenDisplayName": "百会穴",
  "tokenSystemType": "MERIDIAN",
  "tokenGroupId": "meridian_group_du",
  "tokenNodeId": "meridian_node_baihui",
  "description": "经络图谱中的百会节点。",
  "isActive": true,
  "createdAt": "2026-06-20T00:00:00.000Z",
  "updatedAt": "2026-06-20T00:00:00.000Z"
}
```

---

## 5. TreasureTokenBinding

### 5.1 Purpose

定义宝物与信物别名之间的绑定关系。

一个宝物 V1 阶段默认绑定一个信物别名。

后续如需扩展为一个宝物绑定多个信物，必须另起 V2 文档。

### 5.2 Schema

```text
bindingId: string
treasureId: string
tokenAliasId: string
bindingType: 'PRIMARY'
isActive: boolean
createdAt: string
updatedAt: string
```

### 5.3 Frozen Rule

```text
V1: one treasure -> one tokenAlias
```

禁止在 V1 中实现复杂多映射，避免档案点亮逻辑混乱。

---

## 6. ArchiveGraphNode

### 6.1 Purpose

定义星链 / 经络中的一个可点亮节点。

### 6.2 Schema

```text
nodeId: string
systemType: 'STAR' | 'MERIDIAN'
groupId: string
nodeName: string
nodeDisplayName: string
nodeIndex: number
positionX: number
positionY: number
positionZ?: number
connectedNodeIds: string[]
isVisible: boolean
createdAt: string
updatedAt: string
```

### 6.3 Star Node Example

```json
{
  "nodeId": "star_node_jiaosu_001",
  "systemType": "STAR",
  "groupId": "star_group_jiaosu",
  "nodeName": "角宿一",
  "nodeDisplayName": "角宿一（Spica）",
  "nodeIndex": 1,
  "positionX": 120,
  "positionY": 80,
  "connectedNodeIds": ["star_node_jiaosu_002"],
  "isVisible": true,
  "createdAt": "2026-06-20T00:00:00.000Z",
  "updatedAt": "2026-06-20T00:00:00.000Z"
}
```

### 6.4 Meridian Node Example

```json
{
  "nodeId": "meridian_node_baihui",
  "systemType": "MERIDIAN",
  "groupId": "meridian_group_du",
  "nodeName": "百会",
  "nodeDisplayName": "百会穴",
  "nodeIndex": 1,
  "positionX": 180,
  "positionY": 40,
  "connectedNodeIds": ["meridian_node_qiangjian"],
  "isVisible": true,
  "createdAt": "2026-06-20T00:00:00.000Z",
  "updatedAt": "2026-06-20T00:00:00.000Z"
}
```

---

## 7. UserTreasureRecord

### 7.1 Purpose

记录用户已经获得的宝物，以及该宝物对应的信物别名是否已在档案页完成点亮查看。

### 7.2 Schema

```text
userTreasureRecordId: string
userId: string
treasureId: string
tokenAliasId: string
sourceExplorePointId: string | null
sourceEventId: string | null
collected: boolean
collectedAt: string
archiveViewed: boolean
archiveViewedAt: string | null
archiveRevealPlayed: boolean
archiveRevealPlayedAt: string | null
createdAt: string
updatedAt: string
```

### 7.3 Example

```json
{
  "userTreasureRecordId": "utr_001",
  "userId": "user_001",
  "treasureId": "treasure_lotus_seal_001",
  "tokenAliasId": "token_star_jiaosu_001",
  "sourceExplorePointId": "point_loveqigu_entrance",
  "sourceEventId": null,
  "collected": true,
  "collectedAt": "2026-06-20T12:00:00.000Z",
  "archiveViewed": false,
  "archiveViewedAt": null,
  "archiveRevealPlayed": false,
  "archiveRevealPlayedAt": null,
  "createdAt": "2026-06-20T12:00:00.000Z",
  "updatedAt": "2026-06-20T12:00:00.000Z"
}
```

---

## 8. TokenArchiveRevealRecord

### 8.1 Purpose

记录一次点亮播放行为。

该记录可用于调试、回放、埋点、异常修复。

### 8.2 Schema

```text
revealRecordId: string
userId: string
userTreasureRecordId: string
tokenAliasId: string
tokenSystemType: 'STAR' | 'MERIDIAN'
tokenGroupId: string
tokenNodeId: string
revealStatus: 'PENDING' | 'PLAYING' | 'COMPLETED' | 'SKIPPED' | 'FAILED'
startedAt: string | null
completedAt: string | null
failReason: string | null
createdAt: string
updatedAt: string
```

### 8.3 Frozen Rule

V1 可以不持久化每一次动画播放记录，但前端状态与日志中必须保留等价信息。

如果后台成本允许，建议持久化。

---

## 9. Pending Reveal Queue Query

### 9.1 Query Rule

待点亮队列查询规则：

```text
collected = true
archiveViewed = false
tokenSystemType = requested system type
order by collectedAt asc
```

### 9.2 Meaning

```text
已经获得
但还没在信物档案页看过点亮动画
```

---

## 10. Pending Reveal Queue API

### 10.1 Endpoint

```text
GET /api/token-archive/pending-reveals
```

### 10.2 Request

```json
{
  "userId": "user_001",
  "tokenSystemType": "STAR"
}
```

### 10.3 Response

```json
{
  "success": true,
  "data": {
    "tokenSystemType": "STAR",
    "queueTotal": 2,
    "items": [
      {
        "userTreasureRecordId": "utr_001",
        "treasureId": "treasure_lotus_seal_001",
        "treasureName": "莲花印",
        "tokenAliasId": "token_star_jiaosu_001",
        "tokenAliasName": "角宿一",
        "tokenDisplayName": "角宿一（室女座 α，Spica）",
        "tokenSystemType": "STAR",
        "tokenGroupId": "star_group_jiaosu",
        "tokenNodeId": "star_node_jiaosu_001",
        "collectedAt": "2026-06-20T12:00:00.000Z"
      }
    ]
  },
  "error": null
}
```

---

## 11. Mark Archive Viewed API

### 11.1 Endpoint

```text
POST /api/token-archive/mark-viewed
```

### 11.2 Request

```json
{
  "userId": "user_001",
  "completedRecordIds": ["utr_001", "utr_002"],
  "viewedAt": "2026-06-20T12:10:00.000Z",
  "markMode": "COMPLETED"
}
```

### 11.3 markMode

```text
COMPLETED = 动画正常播放完成
SKIPPED = 用户跳过动画，但节点已快速点亮
PARTIAL = 只完成部分记录
```

### 11.4 Response

```json
{
  "success": true,
  "data": {
    "updatedCount": 2,
    "completedRecordIds": ["utr_001", "utr_002"],
    "viewedAt": "2026-06-20T12:10:00.000Z"
  },
  "error": null
}
```

---

## 12. Archive Overview API

### 12.1 Endpoint

```text
GET /api/token-archive/overview
```

### 12.2 Request

```json
{
  "userId": "user_001"
}
```

### 12.3 Response

```json
{
  "success": true,
  "data": {
    "totalCollected": 8,
    "starCollected": 5,
    "meridianCollected": 3,
    "pendingRevealTotal": 2,
    "pendingStarRevealTotal": 1,
    "pendingMeridianRevealTotal": 1,
    "recentRecords": [
      {
        "userTreasureRecordId": "utr_001",
        "treasureName": "莲花印",
        "tokenDisplayName": "角宿一（室女座 α，Spica）",
        "tokenSystemType": "STAR",
        "collectedAt": "2026-06-20T12:00:00.000Z",
        "archiveViewed": false
      }
    ]
  },
  "error": null
}
```

---

## 13. Archive Graph API

### 13.1 Endpoint

```text
GET /api/token-archive/graph
```

### 13.2 Request

```json
{
  "userId": "user_001",
  "tokenSystemType": "STAR"
}
```

### 13.3 Response

```json
{
  "success": true,
  "data": {
    "tokenSystemType": "STAR",
    "groups": [
      {
        "groupId": "star_group_jiaosu",
        "groupName": "角宿",
        "groupDisplayName": "角宿",
        "nodes": [
          {
            "nodeId": "star_node_jiaosu_001",
            "nodeDisplayName": "角宿一（Spica）",
            "positionX": 120,
            "positionY": 80,
            "connectedNodeIds": ["star_node_jiaosu_002"],
            "collected": true,
            "archiveViewed": false,
            "pendingReveal": true
          }
        ]
      }
    ]
  },
  "error": null
}
```

---

## 14. Frontend Mock Contract

在真实 API 未接入前，前端 Mock Runtime 必须提供等价数据：

```text
mockTreasureDefinitions
mockTokenAliasDefinitions
mockArchiveGraphNodes
mockUserTreasureRecords
mockPendingRevealQueue
```

Mock 数据必须覆盖：

```text
1. 单个 STAR 待点亮
2. 多个 STAR 待点亮
3. 单个 MERIDIAN 待点亮
4. STAR + MERIDIAN 同时有待点亮
5. 无待点亮
6. 节点映射缺失
```

---

## 15. Error Codes

建议错误码：

```text
TOKEN_ARCHIVE_USER_NOT_FOUND
TOKEN_ARCHIVE_GRAPH_NOT_FOUND
TOKEN_ARCHIVE_NODE_NOT_FOUND
TOKEN_ARCHIVE_TOKEN_ALIAS_NOT_FOUND
TOKEN_ARCHIVE_TREASURE_NOT_FOUND
TOKEN_ARCHIVE_RECORD_NOT_FOUND
TOKEN_ARCHIVE_MARK_VIEWED_FAILED
TOKEN_ARCHIVE_PENDING_QUEUE_EMPTY
TOKEN_ARCHIVE_NODE_MAPPING_MISSING
TOKEN_ARCHIVE_INVALID_SYSTEM_TYPE
```

---

## 16. Error Handling Rules

### 16.1 pending queue 为空

不视为错误。

返回：

```json
{
  "success": true,
  "data": {
    "queueTotal": 0,
    "items": []
  },
  "error": null
}
```

### 16.2 节点映射缺失

不应导致整页崩溃。

处理：

```text
跳过该节点
记录 failed item
汇总页提示部分收录待校准
```

### 16.3 mark viewed 部分失败

允许部分成功。

返回：

```json
{
  "success": false,
  "data": {
    "updatedCount": 1,
    "completedRecordIds": ["utr_001"],
    "failedRecordIds": ["utr_002"]
  },
  "error": {
    "code": "TOKEN_ARCHIVE_MARK_VIEWED_FAILED",
    "message": "部分记录写回失败"
  }
}
```

---

## 17. Viewed Writeback Rule

正式采用逐项写回优先策略：

```text
每个节点点亮完成后，可将该节点对应 userTreasureRecord 标记为 archiveViewed = true。
```

原因：

* 用户中途退出时，不会重复播放已经看过的节点
* 更符合真实观看进度
* 支持 partial completion

推荐：

```text
动画完成一个，写回一个
跳过剩余时，批量写回剩余
```

---

## 18. Skip Animation Rule

当用户点击跳过：

```text
1. 停止逐个动画
2. 剩余节点快速点亮
3. 批量 mark viewed
4. 展示汇总面板
```

markMode：

```text
SKIPPED
```

---

## 19. Data Consistency Rule

### 19.1 不允许重复生成同一宝物记录

同一个用户对同一 treasureId 的重复获得，需要明确策略：

V1 推荐：

```text
同一 treasureId 可重复获得，但同一 tokenAliasId 只点亮一次。
```

如果重复获得：

```text
生成 treasure history
不重复点亮 token node
```

### 19.2 tokenAlias 点亮幂等

mark viewed 必须幂等。

同一个 userTreasureRecordId 被重复提交时：

```text
不报错
返回 alreadyViewed = true
```

---

## 20. Minimal Backend Tables

如使用数据库，可拆为：

```text
treasure_definitions
token_alias_definitions
treasure_token_bindings
archive_graph_nodes
user_treasure_records
token_archive_reveal_records
```

如果 MVP 阶段简化，可先合并为：

```text
user_treasure_records
token_alias_map
archive_graph_mock
```

---

## 21. Minimal Frontend Implementation

前端最小实现只需要：

```text
1. 读取 archive overview
2. 读取 graph
3. 读取 pending queue
4. 播放节点点亮
5. mark viewed
6. 更新本地 collected / archiveViewed 状态
```

---

## 22. API Naming Freeze

正式冻结以下命名：

```text
treasure
tokenAlias
tokenArchive
pendingRevealQueue
archiveViewed
archiveViewedAt
archiveRevealPlayed
markViewed
```

避免使用：

```text
dropToken
tokenItemAsTreasure
collectibleSignal
mysteryItem
```

---

## 23. Final Freeze

本文件冻结以下判断：

```text
宝物和信物别名必须分表 / 分实体理解
用户获得记录必须绑定 treasureId 与 tokenAliasId
信物档案页必须通过 archiveViewed 判断是否需要点亮
pendingRevealQueue 必须按 collectedAt 升序
markViewed 必须支持单项、批量、跳过、部分成功
tokenAlias 点亮必须幂等
节点映射缺失不得导致整页崩溃
```

---

## 24. Final Output

* TOKEN_ARCHIVE_DATA_SCHEMA_DEFINED = YES
* TREASURE_SCHEMA_DEFINED = YES
* TOKEN_ALIAS_SCHEMA_DEFINED = YES
* USER_TREASURE_RECORD_SCHEMA_DEFINED = YES
* PENDING_REVEAL_QUEUE_API_DEFINED = YES
* MARK_VIEWED_API_DEFINED = YES
* ARCHIVE_OVERVIEW_API_DEFINED = YES
* ARCHIVE_GRAPH_API_DEFINED = YES
* ERROR_CODES_DEFINED = YES
* VIEWED_WRITEBACK_RULE_DEFINED = YES
* IMPLEMENTATION_READY = YES
