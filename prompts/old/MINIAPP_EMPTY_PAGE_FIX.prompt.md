# MINIAPP_EMPTY_PAGE_FIX

你正在：

D:\LOVEQIGU_MASTER

目标：

修复 LOVEQIGU 微信小程序中：

首页点击按钮后进入空白页面

的问题。

本次任务面向非技术负责人验收。

要求：

项目负责人不需要看代码。
项目负责人只负责点击、截图、反馈。

---

检查范围：

apps/miniapp/

重点检查：

app.json

pages/index/

pages/explore-map/

pages/ar-entry/

pages/atom/

pages/lottie/

pages/echo/

pages/digital-collectible/

pages/next-activity/

pages/story-archive/

pages/story-flow/

pages/rights-center/

pages/campaign-closure/

---

检查内容：

1. app.json 中所有页面是否正确注册

2. 首页所有按钮是否绑定正确跳转

3. 每个目标页面是否存在：

index.js

index.wxml

index.wxss

index.json

4. 每个页面是否至少能渲染可见内容

5. 每个页面是否有安全 fallback data

6. 如果服务数据为空，页面不能空白

7. 如果服务 require 失败，页面不能空白

8. 如果真实数据未接入，页面显示 RC1 占位内容

---

修复要求：

1. 不修改 Canon

2. 不修改 World Bible

3. 不新增世界观

4. 不新增神系、文明、组织、历史

5. 不破坏已有服务

6. 不删除已有页面

7. 不删除已有资产

8. 不改变信物/数字藏品边界

---

对所有关键页面增加：

- 页面标题
- 简短说明
- RC1 状态标签
- 下一步按钮
- 返回首页按钮或继续流程按钮

---

重点页面最低显示要求：

explore-map：

必须显示：

探索地图
探索区域
已发现地点
AR 预览按钮

---

ar-entry：

必须显示：

AR现场
扫描/预览入口
进入 Atom 按钮

---

atom：

必须显示：

内容原子
当前发现
进入 Lottie 按钮

---

lottie：

必须显示：

Lottie 动效
动效说明
进入回响按钮

---

echo：

必须显示：

回响
回响内容
获得数字藏品按钮

---

digital-collectible：

必须显示：

数字藏品
藏品名称
进入下一活动按钮

---

next-activity：

必须显示：

下一活动
活动说明
返回首页按钮

---

story-archive：

必须显示：

故事档案
Story Flow 入口

---

story-flow：

必须显示：

Story Flow
AR Event 入口

---

rights-center：

必须显示：

权益中心
Campaign Closure 入口

---

campaign-closure：

必须显示：

活动完成
下一活动入口

---

完成后执行：

1. npm / node 语法检查，如项目已有脚本则使用已有脚本

2. 检查 app.json 页面注册

3. 检查所有关键页面文件存在

4. 检查所有关键页面 wxml 非空

5. 检查首页按钮跳转目标存在

---

生成报告：

docs/MINIAPP_EMPTY_PAGE_FIX_REPORT.md

报告内容包括：

- 修复页面列表
- 修复按钮列表
- 新增 fallback 内容说明
- 未修复问题
- 给项目负责人使用的点击验收清单

---

最终输出：

MINIAPP_EMPTY_PAGE_FIX_COMPLETE = YES