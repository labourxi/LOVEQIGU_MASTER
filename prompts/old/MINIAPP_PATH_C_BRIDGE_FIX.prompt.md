# MINIAPP_PATH_C_BRIDGE_FIX

你正在：

D:\LOVEQIGU_MASTER

目标：

验证并修复 Path C 页面（Rights Center → Campaign Closure → Next Activity）的小程序模块引用问题，保证页面渲染正常，不再空白。

背景：

Path A/B 已贯通，模块桥接已修复。

当前 Path C 页面可能存在以下问题：

- 页面 index.js require 主仓库 services 路径
- 服务模块缺失或路径错误
- 页面渲染数据为空

任务要求：

1. 检查以下页面模块引用：
   - pages/rights-center/index.js
   - pages/campaign-closure/index.js
   - pages/next-activity/index.js

2. 检查对应服务桥接：
   - services/rights/rights-service.js
   - services/campaign/campaign-service.js
   - services/next-activity/next-activity-service.js

3. 修复所有 require 指向主仓库 services 的情况：
   - 所有页面 require 统一改为 apps/miniapp/services/xxx-service.js
   - 所有服务内部不得再 require 主仓库路径

4. 补齐本地服务：
   - 保证服务至少提供页面所需函数（如 getCampaigns、getNextActivity 等）
   - 返回 RC1 占位数据即可，保证页面渲染不空白

5. 验证：
   - node --check 所有 JS 文件
   - 页面加载不空白
   - 所有按钮可点击，跳转目标正常

6. 生成报告：
   docs/MINIAPP_PATH_C_BRIDGE_FIX_REPORT.md
   - 修改文件
   - 删除错误 require
   - 本地 bridge 服务说明
   - 页面渲染验证
   - 项目负责人下一步点击验收说明

最终输出：

MINIAPP_PATH_C_BRIDGE_FIX_COMPLETE = YES