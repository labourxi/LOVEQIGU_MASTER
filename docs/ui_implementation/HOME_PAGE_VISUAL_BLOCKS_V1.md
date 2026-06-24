# AR游伴 · 首页视觉区块决策 V1

**任务 ID：** `HOME_PAGE_REDESIGN_V1`  
**文档 ID：** `ui_implementation/HOME_PAGE_VISUAL_BLOCKS_V1.md`  
**版本：** V1.0  
**依据：** `HOME_PAGE_INFORMATION_ARCHITECTURE_V1.md` · `03_visual/visual_system_v1.md` · `spatial_visual_language.md`

---

## 1. 决策总表

| 区块 / 元素 | 决策 | 首屏 | 说明 |
|-------------|------|------|------|
| Hero 品牌字标 | **保留** | ✅ | AR游伴 |
| Hero 主标语「看见即是找回」 | **保留** | ✅ | 核心主题 |
| Hero 副标语「留在足迹里/收藏世界」 | **保留** | ✅ | 首版回归 |
| Hero 身份 + 场域行 | **保留** | ✅ | 三秒法则 |
| Hero 主 CTA「开始探索」 | **保留** | ✅ | 唯一 Primary |
| Hero 次引导语一行 | **保留** | ✅ | 探索欲 |
| 按钮「进入景区」 | **删除** | — | 与主 CTA 重复 |
| 统计三 pill（进度/信物/礼遇） | **删除主视觉** | — | 数据并入「探索进度」 |
| 区块「探索路径」链接矩阵 | **删除** | — | 功能堆叠 |
| 链接「我的信物」 | **删除** | — | 改 Tab |
| 链接「权益中心」 | **删除** | — | 改 Tab |
| 链接「活动页」 | **删除** | — | 后置 |
| 链接「个人中心」 | **删除** | — | 改 Tab |
| 今日推荐单卡 | **保留** | ✅ | 探索欲 |
| 探索进度轨 | **保留** | 部分 | 未完成感 |
| 最近获得 | **保留** | 滚动 | 回响预览 |
| 独立「今日回响」模块 | **删除** | — | 并入最近获得 |
| 登录面板大卡 | **后置/缩小** | 滚动 | 一行登录条 |
| 首页骨架 loading | **保留** | 瞬时 | 非长期占位 |
| XR 启动全屏 overlay | **后置** | — | 仅 CTA 后短暂显示 |
| pilot-fx-overlay | **保留** | 触发时 | 开始探索后 |
| user-bottom-nav | **保留** | ✅ | 档案/权益入口 |
| 首页 onOpenSeals / RewardCenter | **删除绑定** | — | 非试点路径 |

---

## 2. 保留区块 · 视觉规格

### 2.1 Hero

| 属性 | 规格 |
|------|------|
| 背景 | `--paper`，可选极淡经纬线 SVG 15% 透明度 |
| 主标语 | `--ink`，宋体/霞鹜系，居中 |
| 副标语 | `--gray`，两行，字距略宽 |
| 主 CTA | `.user-primary-cta` 满宽，圆角 12rpx，无第二并列按钮 |
| 装饰 | 可选右上 3 星点细线（与 pitch 母版一致） |
| 禁止 | 宝箱、徽章、积分数字主视觉 |

### 2.2 今日推荐

| 属性 | 规格 |
|------|------|
| 卡片 | 纸底 + `--line` 描边 1px，或墨底 6% 透明 |
| 角标 | `--gold` 小标签「推荐前行」 |
| 次 CTA | ghost，描边 `--ink`，高度 < Primary 20% |
| 动效 | 无自动轮播 |

### 2.3 探索进度

| 属性 | 规格 |
|------|------|
| 星点轨 | `explore-node--dim` / `--lit` / `--next`（见 spatial_visual_language） |
| 数字 | L2，14–15pt，非_dashboard 大屏 |
| 热区 | 整卡可点，无按钮外观 |
| 留白 | 与上下区块间距 32rpx |

### 2.4 最近获得

| 属性 | 规格 |
|------|------|
| 空状态 | 虚线框或淡墨底，无插画宝箱 |
| 有信物 | 信物名 `--ink` + 回响一句 `--gray` |
| 弱链接 | 「查看印记 ›」12pt，非按钮 |
| 禁止 | 信物册网格、NFT 样式 |

### 2.5 底部导航

| 属性 | 规格 |
|------|------|
| 组件 | `user-bottom-nav` 现有 token |
| 首页 Tab | 不高亮其它频道入口 |

---

## 3. 删除区块 · 原因与迁移

| 删除项 | 原因 | 用户路径迁移 |
|--------|------|--------------|
| `user-path-links` 五链矩阵 | 后台导航感 · 违反单主目标 | Tab：探索/信物/权益/我的 |
| `onEnterScenic` 独立按钮 | 与开始探索重复 | 合并进 `onStartExplore`（内可保留 XR trigger + 动效） |
| `user-hero-stats` 三 pill | 抢 Hero · 工具感 | 探索进度区一行数字 |
| `user-echo-panel` 独立 | 与最近获得重复 | 最近获得 |
| `login-panel` 大卡 | 抢首屏 | 页底登录条 |
| `proto-section` 活动入口 | 非主路径 | 探索地图内或二期 |
| 首页推荐多卡列表 | 信息堆叠 | 单卡今日推荐 |

---

## 4. 后置解锁区块

| 区块 | 解锁条件 | 展示位置 |
|------|----------|----------|
| 微信真实登录 | OAuth 接入 | Hero 下登录条 |
| 定位/天气一行 | LBS API | Hero 场域行下 |
| 多景区切换 | 多 `park_id` 上线 | 场域行右侧 chevron → scenic-list |
| 节庆活动横幅 | 运营配置 | **不在首页**；探索地图顶 |
| 权益待领取提示 | `unlockCoupon` 后 | **不在首页**；权益 Tab 角标 |
| 印鉴 / 祝福收藏册 | 合成系统 MVP | 我的 Tab 内 |
| XR 景区渲染入口 | xr_demo 注册 | **不在首页**；探索点详情 |

---

## 5. 动效与视觉绑定

| 触发 | 动效 | 区块 |
|------|------|------|
| 开始探索 tap | `xr_start_v1`（可选） | Hero CTA 后全屏 overlay |
| 进入探索地图 | `space_trail_v1` | explore-map onLoad |
| 首页本身 | 无自动播放庆祝动效 | — |

见 `03_visual/visual_system_v1.md` §3.2 事件映射。

---

## 6. 实现映射（`pages/index`）

### 6.1 WXML 删除清单

```text
- user-path-links 整块
- home-ar-cta（进入景区按钮）
- user-hero-stats（或移入进度子组件）
- user-echo-panel
- login-panel 大卡（改 login-strip）
- proto-section 内活动/多入口
```

### 6.2 WXML 新增清单

```text
+ hero-v1（字标/标语/身份/场域/单CTA/引导）
+ recommend-card-v1（单卡）
+ progress-track-v1（星点轨+文案）
+ recent-relic-v1（空/有态）
+ login-strip-v1（条件渲染）
```

### 6.3 JS 行为合并

```text
onStartExplore():
  1. optional entry.trigger({ source: 'index_enter_scenic' })
  2. optional runPilotStageEffect(ENTER)
  3. safeNavigate(explore-map?pilotScene=explore&focusPointId=...)

删除独立 onEnterScenic 为第二按钮；可保留为 onStartExplore 内部步骤。
```

---

## 7. 验收 · 视觉扫视测试

| # | 测试 | 通过标准 |
|---|------|----------|
| 1 | 5 秒扫视 | 仅记住「开始探索」一个主行动 |
| 2 | 新用户 | 能说出要去地图找信物 |
| 3 | 回访用户 | 看见进度与最近获得，想补齐 |
| 4 | 负面 | 无人说「像后台」「像工具箱」 |
| 5 | 负面 | 首屏无「权益中心」「信物档案」字样入口 |

---

## 8. 关联资产

| 资产 | 路径 |
|------|------|
| 样式 | `apps/miniapp/styles/user-phase1.wxss` |
| 页面 | `apps/miniapp/pages/index/` |
| 动效 | `components/pilot-fx-overlay` |
| 设计冻结参考 | `docs/art/ART_02_DUAL_HOME_VISUAL_SYSTEM_V1.md` |

---

*首页视觉区块 V1 · HOME_PAGE_REDESIGN_V1*
