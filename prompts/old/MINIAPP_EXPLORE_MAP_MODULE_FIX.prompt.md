# MINIAPP_EXPLORE_MAP_MODULE_FIX

你正在：

D:\LOVEQIGU_MASTER

背景：

已完成：

docs/MINIAPP_REQUIRE_PATH_AUDIT_REPORT.md

审计结论：

真实报错文件：

apps/miniapp/pages/explore-map/index.js

当前引用：

../../../../services/story/story-service

运行后实际解析到：

LOVEQIGU_MASTER/apps/services/story/story-service

该路径不存在。

真实存在文件：

services/story/story-service.js

以及：

apps/miniapp/services/story/story-service.js

审计已确认：

当前 require 路径错误。

---

任务目标：

修复 explore-map 页面模块引用。

消除：

can not find module

错误。

恢复：

探索地图页面正常渲染。

---

执行步骤

步骤1

打开：

apps/miniapp/pages/explore-map/index.js

检查：

story-service

ar-service

的 require 路径。

---

步骤2

不要猜测路径。

使用实际存在的文件。

优先使用：

apps/miniapp/services/

桥接服务。

即：

apps/miniapp/services/story/story-service.js

apps/miniapp/services/ar/ar-service.js

---

步骤3

修复：

story-service

ar-service

引用路径。

要求：

从：

apps/miniapp/pages/explore-map/index.js

能够正确解析。

---

步骤4

检查：

story-service.js

是否成功加载。

检查：

ar-service.js

是否成功加载。

---

步骤5

执行：

微信小程序语法检查。

确认：

explore-map

不再出现：

can not find module

错误。

---

步骤6

验证：

探索地图页面能够显示：

- 当前章节
- 探索区域
- 已发现地点
- AR预览按钮

即使真实数据为空。

页面不得空白。

---

步骤7

如果服务数据为空：

增加安全 fallback 数据。

要求：

仅用于 RC1 验收显示。

不得修改 Canon。

不得新增世界观。

不得新增组织、神系、历史。

---

输出报告：

docs/MINIAPP_EXPLORE_MAP_MODULE_FIX_REPORT.md

内容：

- 修改文件
- 修改前路径
- 修改后路径
- 模块加载结果
- 页面渲染结果
- 是否消除 module error

最后输出：

MINIAPP_EXPLORE_MAP_MODULE_FIX_COMPLETE = YES