# MINIAPP_STORY_SERVICE_BRIDGE_FIX

你正在：

D:\LOVEQIGU_MASTER

背景：

项目负责人正在微信开发者工具进行 RC1 验收。

当前错误仍然存在：

页面：

apps/miniapp/pages/explore-map/index

错误：

Error: can not find module

require args is

../../../../services/story/story-service

最新截图显示：

错误栈已经进入：

apps/miniapp/services/story/story-service.js

说明：

explore-map 已经能找到 miniapp 本地 story-service。

但是：

apps/miniapp/services/story/story-service.js

内部仍然 require 了错误的外部路径：

../../../../services/story/story-service

导致页面继续空白。

---

任务目标：

修复 miniapp 本地 story-service 桥接文件。

要求：

不要再让：

apps/miniapp/services/story/story-service.js

require 外部主仓库的 services/story/story-service。

改为小程序本地安全实现。

---

执行步骤：

1. 打开：

apps/miniapp/services/story/story-service.js

2. 检查里面是否存在：

require('../../../../services/story/story-service')

或类似外部路径 require。

3. 删除该外部 require。

4. 在本文件内直接提供 RC1 验收可用的安全数据服务。

至少导出：

getAllChapters

getNodesByChapterId

并确保：

explore-map/index.js 当前调用不会报错。

---

最低数据要求：

getAllChapters() 返回至少 1 个 chapter：

字段包括：

id
title
progress.explored_nodes
progress.total_nodes

getNodesByChapterId(chapterId) 返回至少 3 个探索节点：

字段包括：

id
title
status
ar_event_refs
relic_refs

其中至少 1 个节点包含 ar_event_refs。

---

要求：

1. 不修改 Canon

2. 不修改 World Bible

3. 不新增世界观

4. 不新增神系、文明、组织、历史

5. 不修改 YAML 资产

6. 不修改 Content Engine / Story Engine / Live Ops Engine

7. 只修 miniapp 本地运行桥接层

---

同时检查：

apps/miniapp/services/ar/ar-service.js

如果它内部也 require 外部主仓库路径：

../../../../services/ar/ar-service

则同样改为 miniapp 本地安全实现。

至少导出：

getAllArEvents

getArEventById

并保证：

explore-map 页面能够获得 AR Event 数据。

---

验证：

1. node --check 检查所有修改的 JS 文件

2. 检查：

apps/miniapp/pages/explore-map/index.js

能够 require：

../../services/story/story-service

../../services/ar/ar-service

3. 检查：

apps/miniapp/services/story/story-service.js

不再包含：

../../../../services/story/story-service

4. 检查：

apps/miniapp/services/ar/ar-service.js

不再包含：

../../../../services/ar/ar-service

5. 生成报告：

docs/MINIAPP_STORY_SERVICE_BRIDGE_FIX_REPORT.md

报告包含：

- 修改文件
- 删除的外部 require
- 本地 fallback 数据说明
- 验证结果
- 项目负责人下一步点击验收说明

最后输出：

MINIAPP_STORY_SERVICE_BRIDGE_FIX_COMPLETE = YES