# PLATFORM_GLOBAL_SEARCH_ACTION_BUTTON_FIX_V1

## 1. 问题说明

平台超管后台顶部已有全局搜索输入框，占位文案为「搜索景区 / 商家 / 活动 / 卡券」，但缺少可点击的「搜索」按钮。用户不清楚如何触发搜索，仅靠输入时隐式展示结果，交互不完整。

**本轮目标：** 补齐搜索按钮、点击/回车触发、结果面板、空状态提示，并保证顶栏不横向溢出。

---

## 2. 搜索按钮补齐说明

顶栏搜索区域结构调整为：

```
[搜索输入框] [搜索按钮]
```

| 元素 | 类名 | 说明 |
|------|------|------|
| 容器 | `bo-global-search` | 相对定位，承载输入栏与下拉面板 |
| 输入栏 | `bo-global-search-bar` | flex 横向排列 |
| 输入框 | `bo-global-search-input` | 占位：搜索景区 / 商家 / 活动 / 卡券 / 探索点 / 信物 / AR内容 |
| 按钮 | `bo-global-search-button` | 文案「搜索」；小屏显示「搜」 |
| 面板 | `bo-global-search-panel` | 结果下拉浮层 |

按钮样式：深绿主色（`var(--primary)`），与温润米白 / 深绿 / 暖金体系一致，非红色、非蓝白 SaaS 风格。

**修改文件：** `apps/admin/shared/backoffice-shell.js`（顶栏 HTML 生成）

**验收：** `PLATFORM_GLOBAL_SEARCH_BUTTON_VISIBLE = YES`

---

## 3. 点击触发规则

1. 点击「搜索」按钮 → 执行搜索并展开结果面板
2. 关键词为空时 → 面板显示轻提示：「请输入景区、商家、活动、卡券、探索点、信物或 AR 内容关键词。」
3. 关键词 1 字以上 → 展示匹配结果（最多 8 条）
4. 点击输入框外部 → 关闭结果浮层

**修改文件：** `apps/admin/platform-admin/shared/platform-global-search.js`

**验收：** `PLATFORM_GLOBAL_SEARCH_CLICK_TRIGGER_READY = YES`

---

## 4. Enter 触发规则

1. 输入框内按 `Enter` → 与点击搜索按钮等效
2. `Enter` 阻止默认行为，避免意外表单提交
3. `Escape` → 关闭面板并失焦

**验收：** `PLATFORM_GLOBAL_SEARCH_ENTER_TRIGGER_READY = YES`

---

## 5. 搜索范围

Mock 索引覆盖 9 类对象（`platform-global-search.js` → `INDEX`）：

| # | 类型 | 示例 |
|---|------|------|
| 1 | 景区 | 爱企谷 |
| 2 | 商家 | 爱企谷咖啡 |
| 3 | 活动 | 爱企谷初见寻宝节 |
| 4 | 卡券 | 咖啡到店礼 |
| 5 | 探索点 | 入口广场 |
| 6 | 信物 | 初见印记 |
| 7 | 祝福内容 | 入口显现祝福 |
| 8 | AR内容 | 入口显现仪式 |
| 9 | 美术需求单 | 初见印记视觉 |

**验收：** `PLATFORM_GLOBAL_SEARCH_CONTENT_OBJECTS_READY = YES`

---

## 6. 搜索结果展示规则

每条结果包含：

1. **类型标签**（`bo-global-search-type`）
2. **名称**（`bo-global-search-title`）
3. **所属关系 / 摘要** + **状态** + **操作入口**（`bo-global-search-meta` / `bo-global-search-action`）

规则：

- 输入 1 字以上自动展示候选（`input` 事件）
- 默认最多 **8** 条；超出显示「查看更多结果（N）」按钮，点击展开全部
- 无匹配 → 「未找到相关结果，请尝试输入景区、商家、活动、卡券、探索点、信物或 AR 内容名称。」
- 清空输入 → 隐藏面板

**验收：**

- `PLATFORM_GLOBAL_SEARCH_RESULT_PANEL_READY = YES`
- `PLATFORM_GLOBAL_SEARCH_EMPTY_STATE_READY = YES`

---

## 7. 跳转规则

所有 `href` 指向已存在页面，详情页未实现时使用列表页 + query 参数：

| 类型 | 跳转目标 |
|------|----------|
| 景区 | `park-admin/park_admin_dashboard/?asPlatform=1&parkId=` 或 `parks/?parkId=` |
| 商家 | `park-admin/park_admin_merchants/?asPlatform=1&parkId=&merchantId=` |
| 活动 | `activities/?activityId=` |
| 卡券 | `coupons/?couponId=` |
| 探索点 | `platform_exploration_points/?pointId=` |
| 信物 | `platform_relics/?relicId=` |
| 祝福内容 | `platform_blessing_content/?contentId=` |
| AR内容 | `platform_ar_content/?arId=` |
| 美术需求单 | `platform_art_requests/?requestId=` |

操作文案示例：进入园区视图、查看商家、查看探索点、查看AR 等。

**验收：** `PLATFORM_GLOBAL_SEARCH_RESULT_NAVIGABLE = YES`

---

## 8. 响应式与顶栏溢出

| 规则 | 实现 |
|------|------|
| 输入框可缩短 | `flex: 1 1 auto; min-width: 0` |
| 搜索按钮不被挤没 | `flex-shrink: 0` |
| 小屏按钮文案 | `≤900px` 显示「搜」 |
| 顶栏不横向滚动 | `bo-topnav--platform { overflow-x: hidden }` |
| 搜索区最大宽度 | `max-width: min(480px, 100%)` |

**验收：** `PLATFORM_GLOBAL_SEARCH_NO_TOPBAR_OVERFLOW = YES`

---

## 9. 不改动项

1. 不接真实搜索接口
2. 不改 Runtime 数据结构
3. 不改权限底层逻辑
4. 不引入大型搜索库
5. 不影响商家后台 / 园区后台（搜索仅 `portal === "platform"` 时渲染）

**验收：**

- `DO_NOT_CHANGE_RUNTIME_DATA = CONFIRMED`
- `DO_NOT_REBUILD_PRODUCT_LOGIC = CONFIRMED`

---

## 10. 修改文件清单

| 文件 | 变更 |
|------|------|
| `apps/admin/shared/backoffice-shell.js` | 搜索栏 + 按钮 HTML |
| `apps/admin/shared/backoffice.css` | 按钮、输入栏 flex、响应式、结果项布局 |
| `apps/admin/platform-admin/shared/platform-global-search.js` | 触发逻辑、INDEX 补齐、面板渲染 |

---

## 11. 验收标记

```
PLATFORM_GLOBAL_SEARCH_ACTION_BUTTON_FIX_V1_CREATED = YES
PLATFORM_GLOBAL_SEARCH_BUTTON_VISIBLE = YES
PLATFORM_GLOBAL_SEARCH_CLICK_TRIGGER_READY = YES
PLATFORM_GLOBAL_SEARCH_ENTER_TRIGGER_READY = YES
PLATFORM_GLOBAL_SEARCH_CONTENT_OBJECTS_READY = YES
PLATFORM_GLOBAL_SEARCH_RESULT_PANEL_READY = YES
PLATFORM_GLOBAL_SEARCH_EMPTY_STATE_READY = YES
PLATFORM_GLOBAL_SEARCH_RESULT_NAVIGABLE = YES
PLATFORM_GLOBAL_SEARCH_NO_TOPBAR_OVERFLOW = YES
DO_NOT_CHANGE_RUNTIME_DATA = CONFIRMED
DO_NOT_REBUILD_PRODUCT_LOGIC = CONFIRMED
READY_FOR_PLATFORM_ADMIN_BROWSER_REVIEW_CONTINUE = YES
```
