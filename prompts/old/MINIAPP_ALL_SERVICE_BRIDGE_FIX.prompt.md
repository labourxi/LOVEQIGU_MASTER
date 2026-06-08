# MINIAPP_ALL_SERVICE_BRIDGE_FIX

你正在：

D:\LOVEQIGU_MASTER

背景：

项目负责人正在微信开发者工具进行 RC1 真机/模拟器验收。

当前问题：

小程序页面陆续出现 can not find module 错误。

已经修复过 explore-map 的 story-service / ar-service。

但现在新的错误出现：

页面进入空白。

控制台报错：

Error:
can not find module

require args is:

../../../../services/story/story-flow-service

说明：

miniapp 内仍然存在页面或桥接服务在引用主仓库 services 路径。

---

任务目标：

一次性修复 apps/miniapp 内所有 service bridge 路径问题。

不要再只修单个页面。

---

执行范围：

apps/miniapp/

重点检查：

apps/miniapp/pages/

apps/miniapp/services/

---

步骤1：

全仓搜索 apps/miniapp 内所有：

../../../../services/

../../../services/

../../services/

services/

require(

import

输出所有命中位置。

---

步骤2：

找出所有 miniapp 页面中直接 require 主仓库服务的地方。

包括但不限于：

story-service

story-flow-service

ar-service

atom-service

lottie-service

echo-service

digital-collectible-service

campaign-service

next-activity-service

---

步骤3：

原则：

miniapp 页面不得直接引用主仓库根目录 services。

miniapp 页面只能引用：

apps/miniapp/services/

下的本地桥接服务。

---

步骤4：

检查并修复所有 apps/miniapp/services/ 下的桥接服务文件。

要求：

桥接服务不得再 require：

../../../../services/

../../../services/

或任何指向主仓库根目录 services 的路径。

桥接服务必须改为 miniapp 本地 RC1 安全实现。

---

步骤5：

至少确保以下服务存在并能被页面加载：

apps/miniapp/services/story/story-service.js

apps/miniapp/services/story/story-flow-service.js

apps/miniapp/services/ar/ar-service.js

apps/miniapp/services/atom/atom-service.js

apps/miniapp/services/lottie/lottie-service.js

apps/miniapp/services/echo/echo-service.js

apps/miniapp/services/digital-collectible/digital-collectible-service.js

apps/miniapp/services/campaign/campaign-service.js

apps/miniapp/services/next-activity/next-activity-service.js

---

步骤6：

每个服务必须导出页面需要调用的函数。

如果不确定页面调用了哪些函数：

读取对应页面 index.js。

然后在本地服务中补齐同名函数。

函数返回 RC1 验收用 fallback 数据。

---

步骤7：

最低页面保障：

以下页面不得因 require 报错而空白：

pages/explore-map/index

pages/ar-entry/index

pages/atom/index

pages/lottie/index

pages/echo/index

pages/digital-collectible/index

pages/next-activity/index

pages/story-archive/index

pages/story-flow/index

pages/rights-center/index

pages/campaign-closure/index

---

步骤8：

禁止：

修改 Canon

修改 World Bible

修改 YAML 资产

新增世界观

新增组织

新增文明

新增神系

新增历史

删除页面

删除已有资产

---

步骤9：

验证：

1. node --check 所有修改的 JS 文件

2. apps/miniapp 内不得再出现：

../../../../services/

../../../services/

指向主仓库 services 的 require

3. 所有关键页面的 index.js 均可 require 成功

4. 所有关键服务文件存在

5. 所有关键服务导出页面所需函数

---

步骤10：

生成报告：

docs/MINIAPP_ALL_SERVICE_BRIDGE_FIX_REPORT.md

报告包含：

- 修复的页面
- 修复的服务
- 删除的错误 require 路径
- 新增/补齐的本地 bridge 服务
- node --check 结果
- 仍需项目负责人点击验收的页面列表

最后输出：

MINIAPP_ALL_SERVICE_BRIDGE_FIX_COMPLETE = YES