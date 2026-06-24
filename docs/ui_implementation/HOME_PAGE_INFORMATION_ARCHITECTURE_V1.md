# AR游伴 · 首页信息架构 V1

**任务 ID：** `HOME_PAGE_REDESIGN_V1`  
**文档 ID：** `ui_implementation/HOME_PAGE_INFORMATION_ARCHITECTURE_V1.md`  
**版本：** V1.0  
**状态：** DESIGN_FREEZE_CANDIDATE  
**主题：** 看见即是找回  
**参考：** `ART_02_DUAL_HOME_VISUAL_SYSTEM_V1`（Explorer Home）· `LOVEQIGU_INFORMATION_ARCHITECTURE_V1` §1 · 术语 `T-HOME-002`  
**弃用：** 当前 `pages/index` 实现（功能矩阵版 · 判定为失败版本）

---

## 1. 设计目标

### 1.1 三秒法则（进入首页后）

| 秒数 | 用户问题 | 首页必须回答 | 承载区块 |
|------|----------|--------------|----------|
| 0–1 | **我是谁** | 你是正在这片场域行走的探索者 | Hero 身份行 |
| 1–2 | **我在哪里** | 你在 `{park_name}` · 当前活动 `{activity_name}` | Hero 场域行 |
| 2–3 | **我要做什么** | **开始探索** — 沿星点前行，找回信物 | Hero 唯一主 CTA |

### 1.2 唯一主目标

```text
首页主目标 = 开始探索（1 个 Primary CTA）
```

禁止与主 CTA 同屏竞争的操作：

- 信物档案入口  
- 权益中心入口  
- 功能导航矩阵（探索路径 / 多宫格）  
- 第二个主按钮（如「进入景区」与「开始探索」并存）

### 1.3 探索欲机制

| 机制 | 区块 | 作用 |
|------|------|------|
| 未完成感 | 探索进度 | 点亮数 < 总数 → 想补齐 |
| 具体下一步 | 今日推荐 | 明确「下一个去哪」 |
| 已获得奖赏预览 | 最近获得 | 证明探索有价值 → 想再获得 |
| 情绪锚点 | Hero 标语 | 「看见即是找回」建立场域仪式感 |

### 1.4 首次用户应理解的闭环（不靠首页链接教会）

```text
1 去探索   → 主 CTA → 探索地图 → 单点闭环
2 找信物   → 推荐区 + 进度区文案暗示
3 回档案看 → 底部 Tab「信物」（非首页入口）
```

---

## 2. 与历史首版对齐

| 首版元素 | 本版落点 | 说明 |
|----------|----------|------|
| 看见即是找回 | Hero 主标语 | L2/L3 品牌句 |
| 留在足迹里 | Hero 副标语行 1 | `T-HOME-002` |
| 收藏世界 | Hero 副标语行 2 | `T-HOME-002` |
| Explorer Home | 整页定位 | 非营销首页 A |
| 继续探索 CTA | 唯一主按钮 | 文案：开始探索 |

**不回归：** 首页 A 的功能说明区、商家权益霸屏、多 CTA 营销结构。

---

## 3. 首页结构树

```text
pages/index（Explorer Home · 重设计 V1）
│
├── [L0] 页面容器 user-phase1-page
│
├── [L1] Hero 区（首屏 · 固定语义顺序）
│   ├── 品牌字标          AR游伴
│   ├── 主标语            看见即是找回
│   ├── 副标语            留在足迹里 · 收藏世界
│   ├── 身份行            探索者 · {nickname | 游客}
│   ├── 场域行            {park_name} · {activity_short_name}
│   ├── 主 CTA            [ 开始探索 ]  → explore-map（+ pilotScene）
│   └── 次信息（可选一行） 定位状态 / 天气（V1 可 GAP）
│
├── [L2] 今日推荐（单卡 · 非列表矩阵）
│   ├── 区标题            今日推荐
│   ├── 探索点卡          {point_name} · {location_hint}
│   ├── 获得暗示          可获得 · {relic_name}
│   └── 次 CTA            [ 前往探索 ]  → merchant-event/detail?pointId=
│
├── [L3] 探索进度（轻量 · 非仪表盘）
│   ├── 区标题            探索进度
│   ├── 进度条/星点       {lit}/{total} 探索点已点亮
│   ├── 一句状态          {next_hint}
│   └── 可点击整区        → explore-map（与主 CTA 同目的地，非第二主按钮）
│
├── [L4] 最近获得（回响预览 · 非档案入口）
│   ├── 区标题            最近获得
│   ├── 有信物            {relic_name} · {story_snippet_one_line}
│   └── 空状态            完成第一次探索，印记会留在这里
│   └── 交互              整卡可点 → relic-archive（次要 · 文本链语气）
│
├── [L5] 登录条（仅未登录 · 页底 Hero 下或进度下）
│   └── 一行 + 按钮        Mock 登录 / 微信登录（V1 mock）
│
└── [L6] 底部导航（全局 · 非首页内容）
    └── user-bottom-nav    首页 | 探索 | 信物 | 权益 | 我的
```

**首屏可见（一屏内）：** L1 Hero 全量 + L2 今日推荐标题与卡片上沿。  
**L3/L4：** 首屏下缘露出一截，暗示可滚动与未完成进度。

---

## 4. 区块规格

### 4.1 Hero 区域

| 属性 | 值 |
|------|-----|
| 优先级 | P0 · 首屏 60% 视觉权重 |
| 主 CTA 数量 | **1** |
| 主 CTA 文案 | 开始探索 |
| 主 CTA 行为 | `onStartExplore` → `explore-map` + `pilotScene=explore` + 可选 `XR_USER_TRIGGER` |
| 删除 | 「进入景区」独立按钮、统计三 pill 主视觉、功能链接区 |

**数据输入：**

```json
{
  "park_name": "爱企谷",
  "activity_name": "爱企谷初见寻宝节",
  "user_display": "探索者",
  "location_status": "in_park | unknown"
}
```

### 4.2 今日推荐区域

| 属性 | 值 |
|------|-----|
| 卡片数量 | **1**（禁止轮播多卡主视觉） |
| 数据源 | `getHomeData.recommendedPoint` 或 `getExploreMapData` 中 `next` 点 |
| 次 CTA | 「前往探索」→ `detail?pointId=` |
| 禁止 | 多探索点列表、商家券列表 |

### 4.3 探索进度区域

| 属性 | 值 |
|------|-----|
| 展示 | `completedPoints / totalPoints` + 细线星点轨 |
| 文案 | L2 产品层，无等级/战力 |
| 点击 | 等同进入探索地图（辅助热区，非第二主按钮样式） |
| 数据源 | `userProgress.progressPercent` · `collectedRelicIds.length` |

### 4.4 最近获得区域

| 属性 | 值 |
|------|-----|
| 有数据 | 展示 `journey.latestRelic` 或 `userRelics[last]` |
| 无数据 | 空状态引导（见文案文档） |
| 性质 | **预览**，不是「我的信物」频道入口标题 |
| 跳转 | 弱链接 → `relic-archive`（可选）；主路径仍靠 Tab |

### 4.5 底部导航

| 属性 | 值 |
|------|-----|
| 组件 | `user-bottom-nav`（保持不变） |
| 首页职责 | 不提供与 Tab 重复的宫格入口 |
| Tab 承担 | 信物档案、权益中心、我的 |

---

## 5. 页面状态机

```text
                    ┌─────────────┐
                    │   LOADING   │
                    │ home-skeleton│
                    └──────┬──────┘
                           │ adapter ready
                           ▼
              ┌────────────────────────┐
              │        READY           │
              ├────────────┬───────────┤
              │ FIRST_VISIT│ RETURNING │
              │ 最近获得空 │ 最近获得有 │
              └────────────┴───────────┘
                           │
              主 CTA tap   ▼
                    explore-map
```

| 状态 | Hero | 今日推荐 | 进度 | 最近获得 |
|------|------|----------|------|----------|
| FIRST_VISIT | 全量 | 推荐 ep_001 | 0/N | 空状态 |
| RETURNING | 全量 | 下一个未点亮点 | k/N | 最新信物 |
| LOADING | skeleton | 隐藏 | 隐藏 | 隐藏 |

---

## 6. 路由与事件（实现约束）

| 用户动作 | 路由 | 事件 / 动效 |
|----------|------|-------------|
| 开始探索 | `/pages/explore-map/index?pilotScene=explore` | 可选 `xr_start_v1` + `XR_USER_TRIGGER` |
| 前往探索 | `/pages/merchant-event/detail/index?pointId=` | — |
| 点击进度区 | 同开始探索 | — |
| 点击最近获得卡 | `/pages/relic-archive/index` | 无全屏动效 |
| Tab 信物 | 底部导航 | 离开首页 |

**删除的路由绑定（首页内）：**

- `onOpenRelicArchive` / `onOpenRightsCenter` / `onOpenActivity` / `onOpenProfile` 独立入口  
- `user-path-links` 整块 WXML  

---

## 7. 与失败版本对比

| 失败版本（当前） | V1 重设计 |
|------------------|-----------|
| 开始探索 + 进入景区 双 CTA | 仅「开始探索」 |
| 探索路径 5 链矩阵 | 删除 |
| 三统计 pill 抢 Hero | 收入进度区，缩小 |
| 今日回响独立模块 | 合并入「最近获得」 |
| 活动页/印鉴/祝福册入口 | 删除或 Tab/后置 |
| 工具后台导航感 | 场域叙事 + 单一行动 |

---

## 8. 验收清单

- [ ] 3 秒内可读出：身份 / 场域 / 开始探索  
- [ ] 首屏仅 **1** 个 Primary 按钮样式  
- [ ] 无「信物档案」「权益中心」文字链或宫格  
- [ ] 有推荐下一步 + 进度未完成感 + 最近获得或空状态  
- [ ] 底部 Tab 可到达信物册（用户学会「回档案看」）  
- [ ] 文案符合 `TERMINOLOGY_REGISTRY_V1`（探索地图、权益中心、信物）  

---

## 9. 关联文档

- `HOME_PAGE_COPYWRITING_V1.md`  
- `HOME_PAGE_WIREFRAME_V1.md`  
- `HOME_PAGE_VISUAL_BLOCKS_V1.md`  
- `03_visual/spatial_visual_language.md`  

---

*首页信息架构 V1 · HOME_PAGE_REDESIGN_V1*
