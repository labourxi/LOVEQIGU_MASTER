# MINIAPP_AR_ENTRY_MODULE_FIX

你正在：

D:\LOVEQIGU_MASTER

背景：

项目负责人正在微信开发者工具进行 RC1 验收。

当前状态：

explore-map 页面已经可以正常渲染。

但点击 AR 预览后，ar-entry 页面报错：

Error:
can not find module

require args is:

../../../../services/ar/ar-service

错误页面：

apps/miniapp/pages/ar-entry/index

---

任务目标：

修复 ar-entry 页面及其本地服务桥接中的 ar-service 模块引用错误。

---

执行步骤：

1. 搜索全仓：

../../../../services/ar/ar-service

2. 找出所有仍然引用该错误路径的文件。

3. 重点检查：

apps/miniapp/pages/ar-entry/index.js

apps/miniapp/services/ar/ar-service.js

以及其它 miniapp 页面。

4. 将 miniapp 页面中的 ar-service 引用统一改为可在小程序内解析的本地路径：

../../services/ar/ar-service

5. 如果 apps/miniapp/services/ar/ar-service.js 内部仍然 require 外部主仓库路径，则删除外部 require，改成本地 RC1 安全实现。

至少导出：

getAllArEvents

getArEventById

并保证：

ar-entry 页面可以正常显示 AR 现场内容。

6. 不修改 Canon。

7. 不修改 World Bible。

8. 不修改 YAML 资产。

9. 不新增神系、文明、组织、历史。

10. 不修改 Story Engine / Live Ops Engine。

11. 只修 miniapp 本地运行桥接层和页面引用。

---

最低显示要求：

ar-entry 页面必须显示：

- AR现场
- AR事件列表或预览信息
- 进入 Atom 按钮
- 返回探索地图按钮或继续流程按钮

页面不得空白。

---

验证：

1. node --check 检查所有修改 JS 文件。

2. 确认全仓不再存在：

../../../../services/ar/ar-service

3. 确认 ar-entry 页面能加载本地 ar-service。

4. 生成报告：

docs/MINIAPP_AR_ENTRY_MODULE_FIX_REPORT.md

报告包含：

- 修改文件
- 删除的错误 require
- 本地 fallback 数据说明
- ar-entry 页面渲染结果
- 项目负责人下一步点击验收说明

最后输出：

MINIAPP_AR_ENTRY_MODULE_FIX_COMPLETE = YES