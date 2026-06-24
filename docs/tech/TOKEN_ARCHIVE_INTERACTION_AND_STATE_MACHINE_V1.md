# TOKEN_ARCHIVE_INTERACTION_AND_STATE_MACHINE_V1

## 0. Document Status

- STATUS: FROZEN_FOR_IMPLEMENTATION
- OWNER: TECH / PRODUCT / ART SHARED
- PURPOSE: 统一"信物档案页"在前端交互、状态字段、待点亮队列、状态机、动画触发与边界处理上的实现口径

---

## 1. Scope

本文件仅处理以下对象：

```text
信物档案页
↓
星链档案
经络档案
↓
新获得信物点亮
历史未查看信物补播点亮
```

本文件不负责：

* 宝物本体视觉设计
* XR 页面实现
* 商家券 / 权益中心 / 业务卡券流程
* 复杂后台管理功能

---

## 2. Core Goal

信物档案页要实现的核心目标是：

```text
当用户获得新的宝物后，
其对应的"信物别名"在档案图谱中被点亮。
```

需要同时支持两类场景：

### A. 即时查看

用户刚获得宝物，立即进入档案页
→ 自动定位并播放该节点点亮动画

### B. 延后查看

用户已累计获得多个宝物，但一直未打开档案页
→ 下次进入档案页时，对多个未查看信物执行依次补播点亮

---

## 3. Page Structure Freeze

信物档案系统建议拆为三层：

```text
L1: 信物档案首页
L2: 星链档案页 / 经络档案页
L3: 节点详情层（可选）
```

---

## 4. L1 信物档案首页

### 4.1 页面职责

信物档案首页不负责直接展示完整复杂图谱，而负责：

* 展示"星链档案"入口
* 展示"经络档案"入口
* 展示最近新增待点亮数量
* 展示总收录进度
* 展示最近收录记录摘要

### 4.2 推荐信息块

#### 模块 A：档案总览

* 总收录数
* 星链已点亮数量
* 经络已点亮数量
* 待查看点亮数

#### 模块 B：星链入口

* 当前已点亮节点数 / 总节点数
* 最近新增星链信物数量
* 按钮：进入星链档案

#### 模块 C：经络入口

* 当前已点亮节点数 / 总节点数
* 最近新增经络信物数量
* 按钮：进入经络档案

#### 模块 D：最近收录

* 最近获得的宝物
* 对应信物别名
* 对应图谱类型（STAR / MERIDIAN）
* 收录时间

---

## 5. L2 星链档案页 / 经络档案页

### 5.1 页面职责

L2 页面负责：

* 呈现图谱主体
* 自动定位相关分组
* 播放点亮动画
* 展示当前队列进度
* 支持跳过 / 加速 / 回看

### 5.2 星链档案页职责

* 展示四象 / 星宿 / 星位结构
* 聚焦最近新增所在星宿
* 点亮星位节点
* 允许切换不同星宿查看整体图谱

### 5.3 经络档案页职责

* 展示经络 / 穴位结构
* 聚焦最近新增所在经络
* 点亮穴位节点
* 允许切换不同经络查看整体图谱

---

## 6. Interaction Flow Freeze

## 6.1 用户从"获得宝物"进入档案页

```text
宝物获得完成
↓
系统知道对应 tokenAliasId
↓
进入信物档案页
↓
判断 tokenSystemType
↓
跳到对应图谱页面（星链 / 经络）
↓
定位到对应节点
↓
播放点亮动画
↓
更新 archiveViewed
↓
展示收录完成状态
```

---

## 6.2 用户直接打开信物档案首页

```text
进入档案首页
↓
读取所有 archiveViewed = false 的信物记录
↓
按 STAR / MERIDIAN 分组统计
↓
展示待点亮数量
↓
用户点击进入某个体系
↓
进入对应图谱页开始补播
```

---

## 6.3 用户有多个未查看信物

```text
进入图谱页
↓
读取该图谱体系下全部 pending items
↓
按 collectedAt 升序排序
↓
依次播放每个节点点亮
↓
全部完成后批量标记为 archiveViewed = true
```

---

## 7. Data Model Freeze

### 7.1 宝物定义（引用，不展开）

```text
treasureId
treasureName
treasureVisualAsset
```

### 7.2 信物映射定义

```text
tokenAliasId
tokenAliasName
tokenSystemType       // STAR | MERIDIAN
tokenGroupId          // 星宿ID / 经络ID
tokenNodeId           // 星位ID / 穴位ID
tokenDisplayName
```

### 7.3 用户收录记录

```text
userTreasureRecordId
userId
treasureId
tokenAliasId
collectedAt
archiveViewed
archiveViewedAt
archiveRevealPlayed
archiveRevealPlayedAt
```

---

## 8. Frontend State Freeze

信物档案页建议至少维护以下前端状态：

### 8.1 页面基础状态

```text
archivePageReady: boolean
archiveSystemType: 'STAR' | 'MERIDIAN' | null
archiveGraphReady: boolean
archiveDataLoaded: boolean
archiveAnimationBusy: boolean
archiveError: string | ''
```

### 8.2 待点亮队列状态

```text
pendingRevealQueue: TokenArchivePendingItem[]
currentRevealIndex: number
currentRevealTokenAliasId: string | null
revealQueueTotal: number
revealQueueCompleted: number
revealQueueSkipped: boolean
```

### 8.3 图谱定位状态

```text
activeGroupId: string | null
activeNodeId: string | null
recentFocusedNodeId: string | null
autoFocusPerformed: boolean
```

### 8.4 动效控制状态

```text
revealAnimationMode: 'FULL' | 'FAST' | 'BATCH'
allowSkipReveal: boolean
userSkippedReveal: boolean
userReplayRequested: boolean
```

### 8.5 展示反馈状态

```text
archiveSummaryVisible: boolean
newlyLitNodeCount: number
lastRevealCompletedAt: string | null
```

---

## 9. Pending Queue Definition

待点亮队列定义：

```text
pendingRevealQueue =
所有满足以下条件的记录：

collected = true
archiveViewed = false
tokenSystemType = 当前档案页体系
```

建议排序规则：

```text
order by collectedAt asc
```

也就是：

```text
先拿到的，先播放
```

---

## 10. Pending Item Structure

建议前端队列项结构如下：

```text
type TokenArchivePendingItem = {
  userTreasureRecordId: string
  treasureId: string
  treasureName: string
  tokenAliasId: string
  tokenAliasName: string
  tokenDisplayName: string
  tokenSystemType: 'STAR' | 'MERIDIAN'
  tokenGroupId: string
  tokenNodeId: string
  collectedAt: string
}
```

---

## 11. State Machine Freeze

信物档案页推荐使用如下主状态机：

```text
IDLE
LOADING_DATA
READY
QUEUE_PREPARING
FOCUSING_TARGET
REVEAL_PLAYING
REVEAL_PAUSED
REVEAL_COMPLETED
SUMMARY_SHOWING
ERROR
```

---

## 12. State Machine Detail

### 12.1 IDLE

页面尚未初始化

进入条件：

* 页面刚创建

退出条件：

* 开始拉取档案数据

---

### 12.2 LOADING_DATA

拉取图谱数据、用户收录数据、待点亮队列

进入条件：

* 页面 onLoad / onShow
* 用户切换体系

成功后转移到：

* READY

失败后转移到：

* ERROR

---

### 12.3 READY

图谱已可展示，但未开始补播

进入条件：

* 数据加载成功
* 图谱可渲染

如果存在 pendingRevealQueue：

* 转入 QUEUE_PREPARING

如果没有 pendingRevealQueue：

* 直接停留 READY，供用户浏览

---

### 12.4 QUEUE_PREPARING

准备待点亮队列

动作：

* 过滤当前体系队列
* 排序
* 初始化 currentRevealIndex = 0

若队列为空：

* 转回 READY

若队列非空：

* 转入 FOCUSING_TARGET

---

### 12.5 FOCUSING_TARGET

准备对当前队列项进行自动定位

动作：

* 读取当前 pending item
* 定位其 groupId / nodeId
* 滚动 / 缩放 / 聚焦到目标节点

成功后：

* 转入 REVEAL_PLAYING

失败后：

* 记录 block reason
* 跳过该项并继续下一项，或进入 ERROR（看失败级别）

---

### 12.6 REVEAL_PLAYING

播放当前节点点亮动画

动作：

* 启动节点点亮
* 等待动画结束回调
* 标记当前项 revealAnimationPlayed = true

结束后：

* 若还有下一项，回到 FOCUSING_TARGET
* 若已完成全部项，转入 REVEAL_COMPLETED

---

### 12.7 REVEAL_PAUSED

用于：

* 用户手动暂停
* 页面切后台
* 中断恢复

恢复后：

* 回到 REVEAL_PLAYING

---

### 12.8 REVEAL_COMPLETED

全部点亮动画播放完成

动作：

* 批量提交 archiveViewed = true
* 记录 archiveViewedAt
* 统计 newlyLitNodeCount

之后：

* 转入 SUMMARY_SHOWING

---

### 12.9 SUMMARY_SHOWING

展示本次档案收录结果总结

示例：

* 本次新增点亮 3 个节点
* 星链新增 2 个
* 经络新增 1 个

关闭后：

* 进入 READY

---

### 12.10 ERROR

发生异常

处理原则：

* 图谱能展示则尽量展示
* 单个节点失败不应阻断整页
* 允许跳过点亮，仅保留已收录状态

---

## 13. Animation Strategy Freeze

### 13.1 单个点亮

适用：

* 队列长度 = 1

策略：

* 完整动画
* 自动聚焦
* 完整名称提示
* 完整结束反馈

---

### 13.2 小批量点亮

适用：

* 队列长度 2 ~ 5

策略：

* 每个节点完整播放
* 动画间可缩短停顿
* 允许用户点击"跳过剩余动画"

---

### 13.3 中批量点亮

适用：

* 队列长度 6 ~ 15

策略：

* 前 3 个完整播放
* 后续使用快速点亮模式
* 结尾给统一汇总

---

### 13.4 大批量点亮

适用：

* 队列长度 > 15

策略：

* 不逐个完整演出
* 使用"批量归档点亮"
* 优先展示分组级结果
* 仍需保留"本次新增节点列表"

---

## 14. Visual Feedback Freeze

### 14.1 节点未获得

* 低亮 / 暗置
* 可见但不强调

### 14.2 节点已获得但未查看

* 可在进入页前显示为"待点亮态"
* 与完全未获得做轻微区分

### 14.3 节点点亮中

* 节点发光增强
* 可伴随流光 / 脉冲 / 标签浮现

### 14.4 节点已点亮

* 稳定常亮
* 可点击查看详情
* 不再重复当作"未查看"

---

## 15. Summary Panel Freeze

点亮完成后建议出现简短总结卡片：

```text
本次档案更新完成
新增点亮：3
星链新增：2
经络新增：1
最近点亮：角宿一 / 百会 / 井宿三
```

按钮建议：

* 继续查看图谱
* 查看宝物收藏
* 返回探索页

---

## 16. Edge Case Freeze

### 16.1 节点映射缺失

场景：

* treasure 已获得
* tokenNodeId 缺失或错误

策略：

* 不崩页面
* 记入异常日志
* 该项进入 failedRevealItems
* 汇总页提示"部分收录待校准"

---

### 16.2 图谱数据未就绪

场景：

* 图谱资源未加载完成
* 页面切换过快

策略：

* 进入 LOADING_DATA 重试
* 设置最大重试次数
* 超限后进入 ERROR + 只展示文本摘要

---

### 16.3 用户中途退出页面

场景：

* 点亮播放到一半离开

策略建议二选一：

#### 策略 A（推荐）

* 仅在全部成功播放后才标记 archiveViewed = true
* 中途退出则保持未查看，下次继续补播

#### 策略 B

* 已播放完成的逐个写入 viewed
* 未播放的不写入

正式推荐：

```text
优先采用策略 B
```

因为它更接近真实进度，不会导致已经看过的又被重复补播。

---

### 16.4 用户主动点击跳过

场景：

* 用户不想看完整动画

策略：

* 停止剩余动画
* 剩余节点直接快速点亮
* 统一标记 viewed
* 显示汇总结果

---

### 16.5 多体系混合未查看

场景：

* 用户同时有星链与经络未查看记录

策略：

* 首页分别显示数量
* 进入哪个体系，先播哪个体系
* 不强行在同一页面混播

---

## 17. Tech Logging Freeze

建议为档案页增加以下日志埋点（可先 console / debug）：

```text
TOKEN_ARCHIVE_PAGE_OPEN
TOKEN_ARCHIVE_DATA_LOADED
TOKEN_ARCHIVE_QUEUE_PREPARED
TOKEN_ARCHIVE_TARGET_FOCUSED
TOKEN_ARCHIVE_REVEAL_STARTED
TOKEN_ARCHIVE_REVEAL_COMPLETED
TOKEN_ARCHIVE_REVEAL_SKIPPED
TOKEN_ARCHIVE_QUEUE_ALL_DONE
TOKEN_ARCHIVE_VIEWED_SYNC_SUCCESS
TOKEN_ARCHIVE_VIEWED_SYNC_FAIL
TOKEN_ARCHIVE_NODE_MAPPING_MISSING
```

---

## 18. API / Backend Suggestion

### 18.1 拉取档案总览

返回：

* 星链已点亮数量
* 经络已点亮数量
* 待点亮数量
* 最近新增记录

### 18.2 拉取某体系待点亮队列

参数：

* userId
* tokenSystemType

返回：

* pendingRevealQueue

### 18.3 提交查看完成

参数：

* userId
* completedRecordIds[]
* viewedAt

---

## 19. Implementation Priority

建议开发优先级如下：

### P1

* 数据结构冻结
* 待点亮队列逻辑
* 单节点点亮
* viewed 写回

### P2

* 多节点补播
* 跳过 / 加速
* 汇总面板

### P3

* 节点详情层
* 回看功能
* 更复杂的图谱缩放与导航

---

## 20. Minimal Implementable Version

如果先做最小可运行版本，至少应包含：

```text
1. 信物档案首页
2. 星链档案页
3. 经络档案页
4. pendingRevealQueue 逻辑
5. 自动定位当前节点
6. 单个 / 多个依次点亮
7. archiveViewed 回写
8. 汇总结果面板
```

---

## 21. Final Freeze

本文件正式冻结以下核心技术判断：

```text
信物档案页必须维护 pendingRevealQueue
信物点亮应有专门状态机
必须支持单个点亮与多个补播
多个补播必须按 collectedAt 升序依次执行
用户跳过动画时，剩余节点要快速点亮并写回 viewed
星链与经络分别补播，不混在同一页同时自动播放
中途退出应尽量保留已播放进度，推荐逐项写回 viewed
```

---

## 22. Final Output

* TOKEN_ARCHIVE_PAGE_STRUCTURE_DEFINED = YES
* TOKEN_ARCHIVE_FRONTEND_STATE_DEFINED = YES
* TOKEN_ARCHIVE_PENDING_QUEUE_DEFINED = YES
* TOKEN_ARCHIVE_STATE_MACHINE_DEFINED = YES
* TOKEN_ARCHIVE_SINGLE_REVEAL_DEFINED = YES
* TOKEN_ARCHIVE_MULTI_REVEAL_DEFINED = YES
* TOKEN_ARCHIVE_SKIP_AND_BATCH_RULE_DEFINED = YES
* TOKEN_ARCHIVE_EDGE_CASE_RULE_DEFINED = YES
* TOKEN_ARCHIVE_IMPLEMENTATION_READY = YES
