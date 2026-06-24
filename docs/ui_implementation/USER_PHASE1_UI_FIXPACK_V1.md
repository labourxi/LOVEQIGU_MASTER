# USER_PHASE1_UI_FIXPACK_V1

## 1. 真机问题总结

本轮真机测试确认三类核心问题成立：

| 问题 | 表现 | 优先级 |
|------|------|--------|
| 中文乱码 | 活动名、探索点、信物、任务奖励等显示为乱码字符 | P0 |
| 工具软件感 | 页面以白卡片 + 统计面板 + 列表堆叠为主，缺乏文化韵味 | P0 |
| 方向偏差 | 探索地图像标签集合；权益中心像卡券后台列表 | P0 |

---

## 2. 乱码原因排查结论

**根因：源数据已损坏（非渲染过程损坏）**

- `apps/miniapp/data/merchant_event/*.seed.js` 中文字段以错误编码保存（UTF-8 内容被当作 Latin-1/GBK 解读后再次写入）
- 同目录下对应的 `*.seed.json` 文件中文正常
- `merchant-event-service.js` 通过 `require('*.seed.js')` 加载数据，导致全链路展示乱码

**修复方式：**

- 将 7 个 `.seed.js` 文件内容与对应 `.seed.json` 对齐，统一为 UTF-8 正常中文
- 未改动 JSON 字段结构、ID、绑定关系

**修复文件：**

- `activity.seed.js`
- `exploration_points.seed.js`
- `tasks.seed.js`
- `relics.seed.js`
- `merchants.seed.js`
- `coupon_templates.seed.js`
- `bindings.seed.js`

---

## 3. 已修复页面清单

| 页面 | 路径 | 修复内容 |
|------|------|----------|
| 首页 | `pages/index/` | 情绪引导首屏、路径链接替代模块网格、减少卡片堆叠 |
| 探索地图 | `pages/explore-map/` | 图谱头部 + 星点路径 + 时间轴列表；移除任务进度卡片区 |
| 权益中心 | `pages/rights-center/` | 三区结构（可用 / 推荐 / 使用方式）；单面板多行替代重复白卡 |
| 我的信物 | `pages/relic-archive/` | 收藏册装帧、印记网格质感强化 |
| 探索点详情 | `pages/scenic-detail/` | 卷轴叙事流替代多块独立卡片 |
| 我的 | `pages/profile/` | 减少后台信息块感，_echo 面板承载活动摘要 |
| 底部导航 | `components/user-bottom-nav/` | fixed + 安全区 + 轻字形符号 |

---

## 4. 各页面视觉纠偏说明

### 探索地图（最高优先级）

- **前：** proto-hero 统计三格 + 标签式图谱 + 独立卡片列表 + 任务进度表
- **后：** `atlas-header` 文化引导文案 + 弱统计一行；`atlas-canvas` 垂直星点路径；`atlas-timeline` 时间轴式探索印记；移除任务进度区块

### 权益中心（第二优先级）

- **前：** 活动概览卡 + N 张可领取卡 + N 张已领取卡 + 说明卡（典型优惠券工具页）
- **后：** 探索礼遇 Hero + 两个 `rights-gift-panel`（可用 / 推荐）+ 虚线引导说明区；每区多行合并于同一面板

### 首页

- **前：** 功能入口四宫格 + 多张 proto-card
- **后：** 卷轴感首屏 + 引导诗 + 单条推荐卷轴 + 路径链接列表 + 回响留白区

### 我的信物

- **前：** 普通网格卡片
- **后：** `relic-album-wrap` 册页装帧 + 金石印记圆印 + 已获得/待现质感差异

### 探索点详情

- **前：** 故事 / 信物 / AR / 权益各一块独立白卡
- **后：** `scenic-scroll-flow` 单卷轴内分段叙事，礼遇弱化嵌入

---

## 5. 是否减少重复卡片 / 工具感

| 页面 | 减少前（约） | 减少后（约） | 结论 |
|------|-------------|-------------|------|
| explore-map | 1 hero 统计 + N 点卡 + N 任务卡 | 1 头部 + 1 图谱 + 时间轴 | YES |
| rights-center | 3 区 × 每权益 1 卡 | 2 面板 + 1 说明区 | YES |
| index | 4 模块卡 + 2 信息卡 | 1 推荐卷 + 路径列表 + 回响 | YES |
| scenic-detail | 4–5 独立白卡 | 1 卷轴流 | YES |

---

## 6. 是否修复中文乱码

**YES** — 全部 `merchant_event/*.seed.js` 中文已与 JSON 源对齐；页面静态文案无乱码残留。

---

## 7. 风险点

| 风险 | 说明 |
|------|------|
| 本地缓存 | 真机若缓存旧 progress，文案来自 seed 已修复，但用户进度数据不变 |
| 时间轴在小屏 | 探索点较多时图谱区纵向较长，需真机确认滚动体验 |
| 权益数据稀疏 | 未领取时「当前可用」为空态，属预期 |
| wxss 格式 | `user-phase1.wxss` 部分空行较多，不影响编译 |

---

## 8. 下一步建议

1. **第二轮真机回归**：重点看探索地图图谱感、权益中心是否仍像卡券工具
2. **merchant-event/detail** 对齐同一视觉语言
3. **seed 单一源**：长期建议 service 只读 `.json` 或构建时从 JSON 生成 JS，避免双文件漂移
4. **轻量背景纹理**：可选宣纸纹理图（注意包体）

---

## 9. 验收标记

```
USER_PHASE1_UI_FIXPACK_V1_CREATED = YES
USER_PHASE1_GARBLED_TEXT_FIXED = YES
USER_PHASE1_TOOL_LIKE_UI_REDUCED = YES
USER_PHASE1_CULTURAL_VISUAL_ENHANCED = YES
DO_NOT_CHANGE_RUNTIME_DATA = CONFIRMED
DO_NOT_REBUILD_PRODUCT_LOGIC = CONFIRMED
READY_FOR_SECOND_REAL_DEVICE_REVIEW = YES
```

---

*文档版本：V1 · 2026-06-16 · 承接 USER_FRONTEND_VISUAL_IMPLEMENTATION_PLAN_V1 真机反馈*
