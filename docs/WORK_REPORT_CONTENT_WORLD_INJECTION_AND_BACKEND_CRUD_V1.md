# 工作报告：内容世界注入层 + 后台探索点管理系统升级

> 项目: LOVEQIGU / AR游伴
> 日期: 2026-06-29
> 会话范围: 两个主要任务：前端叙事内容注入 + 后台全功能 CRUD 改造

---

## 第一部分：前端叙事内容注入层

### 任务描述

将 UI 从"空的系统界面"改造成"有生命力的叙事世界界面"。所有页面使用叙事语言替代系统文本。

### 创建的文件 (5)

| 文件 | 说明 |
|------|------|
| `apps/miniapp/content/world/explore_world_seed.js` | 10 个探索节点完整叙事数据：storyFragment, symbolicMeaning, visualHint, arTriggerDescription, emotionalNarrative, poemFragment + 世界状态叙事 + 网络低语 + 现象/情绪增强 |
| `apps/miniapp/content/world/collection_world_seed.js` | 8 个信物叙事 + 6 个数字藏品叙事，每个含 originStory, symbolicMeaning, emotionalNarrative, awakenReason, poemFragment + AR 事件类型描述 + 页面级叙事标题 |
| `apps/miniapp/content/world/rights_world_seed.js` | 积分叙事解释函数 + 签到/探索奖励叙事 + 5 个礼遇奖励叙事（仪式感描述、情感基调、使用场景）+ 6 个藏品奖励叙事 + 历史记录标签映射 |
| `apps/miniapp/content/world/my_world_seed.js` | 4 个统计数字叙事解释函数（探索进度、信物发现、积分积累、数字藏品）+ 6 级等级阈值（待行旅者→归真者）+ 快速操作叙事描述 |
| `apps/miniapp/content/world/inject_world_content.js` | 中央注入管线，4 个页面专用注入器。深拷贝渲染树，添加叙事字段（前缀带 `_narrative` 或 `narrative`），替换空状态文本，增强 item 数组，设置 `_worldContentReady = true` |

### 修改的文件 (7)

| 文件 | 修改内容 |
|------|----------|
| `pages/index/index.js` | 添加 injector require，initPage/refresh 调用 injectWorldContent('explore', data) |
| `pages/collection/index.js` | 添加 injector require，_refresh 调用 injectWorldContent('collection', tree) |
| `pages/rights/index.js` | 添加 injector require，buildPageData 调用 injectWorldContent('rights', tree) |
| `pages/my/index.js` | 添加 injector require，buildPageData 调用 injectWorldContent('my', tree) |
| `pages/collection/index.wxml` | 标题→narrativeTitle，副标题→narrative binding，tab 标签→narrativeLabel，3 个空状态→动态叙事绑定 |
| `pages/rights/index.wxml` | 头部→narrativeTitle/kicker/subtitle，积分单位→narrativeTitle，统计标签→叙事绑定，区块标题→叙事，空状态（3处）→叙事绑定，奖励类型→narrativeType，历史行标签→narrativeLabel |
| `pages/my/index.wxml` | 统计标签→叙事（已探访/信物印记/心愿值/数字印记），进度卡片→叙事标题+副标题，快速操作→_narrativeLabel，功能模块→_narrativeLabel，模态标题→留下印记 |

### 叙事语言替换对照

| 原文 | 替换为 |
|------|--------|
| 我的藏品世界 | 遗迹回廊 |
| 探索礼遇中心 | 礼遇回廊 |
| 探索礼遇 | 回响 |
| 可领取奖励 | 等待回响 |
| 可兑换权益 | 可兑换礼遇 |
| 已领取记录 | 已兑现的印记 |
| 功能模块 | 世界入口 |
| 编辑资料 | 留下印记 |
| 积分数量 | 心愿值 |
| 数字藏品数 | 数字印记 |
| 已获得信物 | 信物印记 |
| 已探索打卡点 | 已探访 |
| 待补/待绑定 | 叙事增强的空状态提示 |

已删除所有硬编码系统文本，改为动态叙事绑定。

---

## 第二部分：后台探索点管理系统升级

### 任务描述

将探索点管理后台从"只读状态看板"升级为"完整 CRUD + AI 批量内容生产工厂"。

### 修改的文件 (3)

| 文件 | 修改内容 | 规模 |
|------|----------|------|
| `apps/shared/data-adapter/mock-source.js` | 探索点从 2 个扩充到 **12 个**，每个含完整 story, symbolicMeaning, arTriggerDescription, emotionalNarrative, visualHint, description 字段 | +12 条目 |
| `apps/shared/data-adapter/content-production-adapter.js` | 新增 8 个 CRUD 方法 + 2 个 TASK_TYPE_LABELS + batch_import_task 队列注册 | +230 行 |
| `apps/admin/platform-admin/platform_exploration_points/index.html` | 从 86 行只读表格重写为完整生产管理 UI | 完全重写 |

### 新增的 CRUD 方法 (8)

| 方法 | 说明 | 参数 |
|------|------|------|
| `createExplorationPoint(data, actor)` | 创建新探索点，自动生成 ID，默认 DRAFT 状态 | data(对象), actor(对象) |
| `updateExplorationPoint(pointId, patch, actor)` | 部分更新，merge-safe，只允许写白名单字段 | pointId, patch, actor |
| `deleteExplorationPoint(pointId, actor)` | 软删除，status = "DELETED" | pointId, actor |
| `hardDeleteExplorationPoint(pointId, actor)` | 硬删除，从数组中移除 | pointId, actor |
| `getExplorationPointList(filter)` | 列表查询，支持 activityId/status/parkId/query 过滤，自动过滤 DELETED | filter(对象) |
| `batchImportExplorationPoints(pointsArray, actor)` | 批量导入，逐条 create + 错误收集 + 注册 batch_import_task | pointsArray, actor |
| `exportExplorationPoints()` | 导出所有探索点（JSON 格式） | 无 |
| `generateExplorationPointsBatch(theme, count)` | AI 批量生成 10 个模板探索点，含完整叙事字段 | theme, count |

### mock 数据扩充 (2→12)

| 编号 | ID | 名称 | 场景类型 | 状态 |
|------|----|------|----------|------|
| 1 | ep_001 | 四象入口 | 入口签到 | PUBLISHED |
| 2 | ep_002 | 雾林 | 自然探索 | PUBLISHED |
| 3 | ep_003 | 石径 | 自然探索 | PUBLISHED |
| 4 | ep_004 | 回声台 | 互动体验 | PUBLISHED |
| 5 | ep_005 | 祈愿台 | 文化体验 | PUBLISHED |
| 6 | ep_006 | 残卷阁 | 文化体验 | PUBLISHED |
| 7 | ep_007 | 星痕池 | 自然探索 | PUBLISHED |
| 8 | ep_008 | 风语桥 | 自然探索 | PUBLISHED |
| 9 | ep_009 | 旧忆碑林 | 文化体验 | DRAFT |
| 10 | ep_010 | 归真之门 | 终点仪式 | DRAFT |
| 11 | ep_011 | 湖畔观景台 | 入口签到 | DRAFT |
| 12 | ep_012 | 林间小径 | 自然探索 | DRAFT |

所有点均无空字段。

### 后台管理页面功能

| 功能 | 交互方式 |
|------|----------|
| 搜索 | 文本框输入关键词，按名称/描述搜索 |
| 状态筛选 | 下拉框：全部/草稿/已发布 |
| 新建探索点 | "+ 新建探索点"按钮 → 编辑弹窗（9个字段） |
| 编辑探索点 | 每行"编辑"按钮 → 编辑弹窗（回填当前数据） |
| 查看详情 | 每行"查看"按钮 → alert 显示完整信息 |
| 删除探索点 | 每行"删除"按钮 → 确认对话框 → 硬删除 |
| AI 生成 10 个点 | "AI 生成 10 个点"按钮 → 主题输入 → 预览弹窗 → 确认导入 |
| 批量导入 JSON | "批量导入 JSON"按钮 → 文件选择器 → 解析 → 导入 |
| 导出当前数据 | "导出当前数据"按钮 → 下载 JSON 文件 |
| 信物占位 | 每行"信物"按钮 |
| 祝福文案 | 每行"祝福"按钮 |
| AR 占位 | 每行"AR"按钮 |
| 美术需求 | 每行"美术"按钮 |
| 提交审查 | 每行"审查"按钮 |

### 创建的文件 (1)

| 文件 | 说明 |
|------|------|
| `apps/miniapp/data/world_seed_v2.js` | 后台与小程序同步桥接层。包含全部 10 个标准探索点结构种子数据。管理员可从后台导出 JSON 后转换注入此文件 |

### 技术架构图

```
平台管理员浏览器
    │
    ├── platform_exploration_points/index.html
    │   (完整 CRUD + AI批处理 + 导入导出UI)
    │
    ├── shared/data-adapter/content-production-adapter.js
    │   (create / update / delete / list / batchImport / export / AIGenerate)
    │
    ├── shared/data-adapter/mock-source.js
    │   (12个探索点种子的数据源)
    │
    ├── shared/data-adapter/adapter-session.js
    │   (sessionStorage 持久化，刷新不丢失)
    │
    ├── admin/modules/visual-factory/generation-queue.js
    │   (生成任务队列，注册 batch_import_task)
    │
    └── apps/miniapp/data/world_seed_v2.js
        (后台 → 小程序的同步桥接文件)
```

### 接受标准检查

- [x] 探索点完全 CRUD（创建/编辑/删除/查询）
- [x] AI 批量生成可用（10个模板 + 预览 + 确认导入）
- [x] 后台成为生产系统（不是只查看器）
- [x] 数据同步到小程序的桥梁已建立
- [x] 无空白字段（全部 12 个点均完全填充）
- [x] 10+ 个完全填充的节点就绪（12个）

---

## 文件清单总结

### 新建 (6 个文件)

```
apps/miniapp/content/world/explore_world_seed.js
apps/miniapp/content/world/collection_world_seed.js
apps/miniapp/content/world/rights_world_seed.js
apps/miniapp/content/world/my_world_seed.js
apps/miniapp/content/world/inject_world_content.js
apps/miniapp/data/world_seed_v2.js
```

### 修改 (10 个文件)

```
apps/miniapp/pages/index/index.js
apps/miniapp/pages/collection/index.js
apps/miniapp/pages/rights/index.js
apps/miniapp/pages/my/index.js
apps/miniapp/pages/collection/index.wxml
apps/miniapp/pages/rights/index.wxml
apps/miniapp/pages/my/index.wxml
apps/shared/data-adapter/content-production-adapter.js
apps/shared/data-adapter/mock-source.js
apps/admin/platform-admin/platform_exploration_points/index.html
```
