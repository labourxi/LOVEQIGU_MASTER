# MINI_PROGRAM_VISUAL_MAPPING_LAYER_V1

STATUS: ACTIVE  
VERSION: V1.0  
DATE: 2026-06-16  
OWNER: LOVEQIGU PRODUCT / UI

---

## 文档定位

将 ART Canon（`ART_BIBLE` · `ART_03` · `ART_04` · `FOUR_SYMBOL`）翻译为**微信小程序可落地的视觉映射层**。

- **不替代** Canon 原文
- **不实现** ART 级全量视觉生产
- **约束** `apps/miniapp` 页面/组件/动效的上限与路径

### 依据文档（只读引用）

| 文档 | 路径 |
|------|------|
| ART_BIBLE_V1 | `docs/ART_BIBLE_V1.md` |
| ART_03_VISUAL_PHILOSOPHY_V1 | `docs/art/ART_03_VISUAL_PHILOSOPHY_V1.md` |
| ART_03A_REVELATION_PARTICLE_SYSTEM_V1 | `docs/art/ART_03A_REVELATION_PARTICLE_SYSTEM_V1.md` |
| ART_03B_TREASURE_REVELATION_TEMPLATE_V1 | `docs/art/ART_03B_TREASURE_REVELATION_TEMPLATE_V1.md` |
| ART_03C_CONNECTION_LIGHTING_TEMPLATE_V1 | `docs/art/ART_03C_CONNECTION_LIGHTING_TEMPLATE_V1.md` |
| FOUR_SYMBOL_VISUAL_SYSTEM_V1.1 | `docs/art/FOUR_SYMBOL_VISUAL_SYSTEM_V1_1.md` |
| ART_04_VISUAL_PROTOTYPE_V1 | `docs/art/ART_04_VISUAL_PROTOTYPE_V1.md` |

### 层级定义

| 层级 | 范围 | 小程序职责 |
|------|------|------------|
| **ART Canon** | 全量粒子/光场/卷轴星图/四象运动签名 | 参考语义，**不全量还原** |
| **Mapping Layer** | 语义 + 组件 + 路径 + 轻动效 | **本文件** |
| **Runtime** | `pages/*` `components/*` wxss/Canvas | 落地实现 |

**ART_BIBLE 产品气质：** 东方古籍图谱、观察与认出，非游戏/非掉落机。

**小程序全局色（L1 可引用）：**

| Role | Name | HEX |
|------|------|-----|
| Primary | 玄青 | `#203A35` |
| Secondary | 鎏金 | `#B08A3D` |
| Accent | 朱砂 | `#A74B3A` |
| Background | 宣纸白 | `#F6F1E8` |
| Support | 墨灰 | `#4C514B` |
| Support | 石绿 | `#6E8A7A` |
| Support | 陶褐 | `#8A6A4A` |

---

## 1. 星宿 → UI 组件映射

### 1.1 Canon 层级（FOUR_SYMBOL + ART_03C + ART_04 P05/P07）

| Canon 实体 | ART_03C Level | FOUR_SYMBOL 强调 | 情绪关键词 |
|------------|---------------|------------------|------------|
| 单星（角宿一等） | L1 节点点亮 | 星图·**看见** | 发现 |
| 星宿（角宿等） | L2 连接簇 | 星图·**看见** | 连接 |
| 四象（青龙等） | L3 连接域 | 四象·**恢复** | 恢复 |
| 周天/合真 | L4 整体点亮 | 合真·**统一** | 认出 |

**二十八宿归属（FOUR_SYMBOL）：** 青龙七宿 / 朱雀七宿 / 白虎七宿 / 玄武七宿 + 中宫圆核（非第五神兽）。

### 1.2 小程序 UI 组件映射

| Canon 实体 | 页面 | UI 组件（现有） | 视觉角色（Mapping） | 亮度规则（03C） |
|------------|------|-----------------|---------------------|-----------------|
| 四象总览 | `pages/star-map` `view=overview` | `symbol-grid` → `symbol-card` | L3 域入口；卷轴分区，非神兽立绘 | 卡片底 20–30% → 进度填充 40–70% |
| 四象进度 | 同上 | `proto-progress-bar` / `proto-progress-fill` | 域苏醒进度条，非战力条 | 渐变，禁瞬间满亮 |
| 单象星宿列表 | `view=symbol` | `mansion-card` | L2 连接簇容器 | 簇内统一光域暗示 |
| 星宿进度 | 同上 | `mansion-progress` | L2 簇内回应 | 同上 |
| 单星节点 | 同上 | `proto-chip` + `star-chip-dot` | L1 节点；**重被看见，非新获得** | dim=25% / lit=85–100% |
| 星名文案 | 同上 | `star-chip-name` | L1 铭文层（Stone/engrave 语气） | 墨灰 + 点亮鎏金 |
| 星图仪式（事件） | `pages/lottie` | `star-activation-ritual` | P04/P05 短仪式；Canvas 轻粒子 | 六阶段压缩版 |
| 星图入口 | `pages/relic-archive` | `star-map-link` | 信物 → 天系归属跳转 | — |
| 合真预告 | `pages/heaven-human-unity` | `seal-grid` / `seal-card` | ART_04 P08：仅轮廓/留白，「尚未显现」 | 低亮度占位 |
| 天印进度 | 同上 | `heavenSeals` + `unity-link` | L3–L4 桥接 | 禁爆发庆祝 |

### 1.3 四象 × 运动签名 → 组件动效（轻量）

| 四象 | FOUR_SYMBOL 运动 | 映射到组件的行为（仅 wxss/transform） |
|------|------------------|--------------------------------------|
| 青龙 | 向上生长、螺旋展开 | `symbol-card` 进度填充 **自下而上** |
| 朱雀 | 向外扩散、绽放 | `mansion-card--focus` **轻 scale 1.02** |
| 白虎 | 向内收束 | 完成态 chip **向心 opacity 提升** |
| 玄武 | 向下沉静 | 未点亮区 **略沉底渐变** |
| 中宫 | 中心脉动 | `star-chip-dot--lit` **4–6s 呼吸 opacity** |

### 1.4 星宿组件禁止项

- 不用巨大兽头、战斗姿态、Boss 演出（FOUR_SYMBOL）
- 不用 `celebration-modal` 全屏 confetti 语义（ART_BIBLE §6 Forbidden）
- 文案禁「获得星星 / 升级」→ 用「点亮 / 认出 / 连接恢复」

---

## 2. 经络 → UI 路径映射

### 2.1 Canon 层级（ART_03C + FOUR_SYMBOL）

| Canon 实体 | ART_03C Level | 图谱强调 |
|------------|---------------|----------|
| 单穴 | L1 | 经络图·**流动** |
| 单经（心经等） | L2–L3 | 流动 + 连接 |
| 十二正经 + 奇经八脉 | L3 域 | 区域网络 |
| 人印/合真 | L4 | 统一呼吸 |

### 2.2 小程序导航路径映射

```
探索地图 pages/explore-map
    └─（探索触发/AR）─→ pages/ar-entry
                            └─ 显现完成 ─→ pages/lottie（可选仪式）
                                              └─ pages/event-complete（信物获得）
                                                    └─ pages/relic-archive（信物库）

信物库 pages/relic-archive
    ├─ meridian-map-link ─→ pages/meridian-map?view=meridian&id={经Id}
    └─ star-map-link     ─→ pages/star-map?view=symbol&id={象Id}

经络总览 pages/meridian-map（view=overview）
    ├─ 十二正经 meridian-card ──tap──→ view=meridian（经详情）
    └─ 奇经八脉 meridian-card ──tap──→ view=meridian（经详情）

经详情 view=meridian
    ├─ proto-chip + point-chip-name（穴位节点 L1）
    └─ meridian-map-back ─→ overview

合真 progress pages/heaven-human-unity
    ├─ 人印 → meridian-map（十二正经 + 奇经列表）
    └─ 天印 → star-map
```

### 2.3 经络 UI 组件映射

| Canon 实体 | 页面 | UI 组件 | Mapping 角色 |
|------------|------|---------|--------------|
| 经络域总览 | `meridian-map` overview | `meridian-card` × 十二正经 | L3 域入口 |
| 奇经域 | 同上 | `meridian-card` × 奇经八脉 | L3 域入口 |
| 经络进度 | 同上 | `proto-progress-bar` | 流动进度，非等级条 |
| 单经详情 | `view=meridian` | `point-card` | L2 经脉容器 |
| 穴位节点 | 同上 | `proto-chip` + `star-chip-dot` | L1；流线连接用 **细线/顺序 chip**，非电流 |
| 文化说明 | 同上 | `cultural-panel` | L2 文案层（Ritual type 语气） |
| 底部 Tab | `user-bottom-nav` | `relic-archive` 等 | L1 商业导航，与仪式页分离 |

### 2.4 经络路径约束

- 强调 **流动**（03C）：点亮动效优先 **chip 顺序渐亮 / 细线延伸**，不用闪电、赛博能量束（ART_03A PARTICLE_003 Forbidden）
- 页面标题层用「人体系」，避免「经脉升级」「穴位收集完成」类游戏话术
- 产品术语：**合真**（页面 `heaven-human-unity` 对外文案统一为 **合真**，非「归真」）

---

## 3. 信物 → 卡片 UI 映射

### 3.1 Canon 边界（ART_BIBLE + ART_03B + ART_03）

| 资产类型 | Canon 定义 | 小程序页面 | 与信物关系 |
|----------|------------|------------|------------|
| **信物 Relic** | 成长轨迹 / 故事进度资产 | `relic-archive` `event-complete` | **本体** |
| **宝物 Treasure** | 景区文化印记显现（03B） | `ar-entry` `merchant-event/detail` | 显现后 **关联** 信物，≠ 信物 |
| **数字藏品** | 营销沟通资产 | `digital-collectible` | **独立**，禁止与信物混排 |

### 3.2 信物卡片 UI 映射（`pages/relic-archive`）

| Canon 状态 | UI 组件 | 视觉语义（ART_03 / ART_BIBLE） | 禁止 |
|------------|---------|-------------------------------|------|
| 已收录信物 | `relic-album-slot--owned` | 图谱册页上的 **印章/印记**；金石感 | 装备格、战力角标 |
| 印记印章 | `relic-seal` | Seal ring 形状语言 | 贴纸徽章、游戏 rarity 框 |
| 待显现 | `relic-album-slot--pending` / `--pending-teaser` | 留白 + `relic-seal--pending` 若隐若现（03C Stage01） | 锁头+「去充值」 |
| 册页分组 | `relic-chapter-head` + `relic-album-spine` | 卷轴册页（P06 东方图谱墙） | 背包分页 |
| 景区册 | `scenic-group` | 按探索场域分册 | 164 项平铺列表 |
| 当前选中 | `focused-relic-panel` | 仪式阅读态；**观察**非领取 | 弹窗奖励 |
| 折叠未现 | `relic-pending-fold` | 留白折叠；「尚未显现」 | 红点轰炸 |
| 章节进度 | `group-progress-bar` | 成长进度，非任务进度 | 每日任务条 |
| 获得页 | `event-complete` `proto-card` | 短停留后入库；P04 情绪 | 「恭喜获得」主标题 |

### 3.3 信物卡片色彩（引用 ART_BIBLE）

| 元素 | Token | 用途 |
|------|-------|------|
| 册页底 | 宣纸白 `#F6F1E8` | 主背景 |
| 标题/结构 | 玄青 `#203A35` | 册脊、章节头 |
| 已显现印记 | 鎏金 `#B08A3D` | 印章描边、名称 |
| 完成强调 | 朱砂 `#A74B3A` | 少量 seal 点缀 |
| 待显现 | 墨灰 20–30% 亮度 | 03C dormant |
| 记念文案 | 墨灰 `#4C514B` | Body type |

### 3.4 信物相关文案映射

| ✅ Mapping 文案 | ❌ 禁止 |
|----------------|---------|
| 已收录 / 待显现 / 印记册页 | 已获得 / 去领取 / 背包 |
| 合册 / 继续探索 | 一键领取 / 开宝箱 |
| 故事进度资产 | 道具 / 装备 / 奖励 |

---

## 4. 粒子 → 动效约束（小程序子集）

### 4.1 ART_03A 四层 → 小程序允许实现

| ART_03A 层 | Canon 用途 | 小程序落地方式 | 参数上限 |
|------------|------------|----------------|----------|
| L1 微光 Micro Light | 发现、AR 识别 | `star-activation-ritual` Canvas 点 / chip dot 呼吸 | ≤ **24** 点；最慢漂移 |
| L2 回响波纹 Resonance Wave | 回应、显现后 | 单圈 `border-radius` + opacity 动画 | **1** 层波纹；中速 |
| L3 连接流线 Connection Flow | 星/穴/簇连接 | chip 间 **1px 金线** wxss 渐显 | 缓慢，禁闪电 |
| L4 节点点亮 Awakening Spark | 确认点亮 | `proto-chip--lit` opacity 0.25→0.9 | 最慢；禁升级动画 |

### 4.2 统一节奏（ART_03 / ART_04C）

```
出现 → 停顿 → 展开 → 显现 → 停留 → 结束
```

| 场景 | 建议时长 | 实现 |
|------|----------|------|
| 页面转场 | 600–1200ms | navigate 前淡入淡出 |
| 星/穴点亮 | 800–1500ms | chip class 切换 + 延迟 |
| 信物显现（lottie 页） | 2–4s 总时长 | 压缩 03B 七阶段，**省略纹样全动画** |
| 祥云之门级（P01） | 6–8s | **仅 AR 独立页可选**；Tab 页不做 |
| 呼吸循环 | 4–8s | CSS `animation` scale+opacity |

### 4.3 速度规则（ART_03A）

| 粒子类型 | 小程序档位 |
|----------|------------|
| 微光 | `vx/vy < 0.03` px/frame |
| 波纹 | 单周期 ≥ **1.2s** |
| 流线 | 线段延伸 ≥ **800ms** |
| 点亮 | opacity 过渡 ≥ **600ms** |

**总原则：** 宁慢勿快；由隐到显、由暗到明；禁突然出现、瞬间爆发、高速喷射、剧烈闪烁。

### 4.4 动效与页面绑定

| 页面/组件 | 允许粒子 | 禁止 |
|-----------|----------|------|
| `star-map` | chip dot 呼吸、进度条渐变 | 全屏 Canvas 星图、celebration 粒子雨 |
| `meridian-map` | chip 顺序点亮、细线流动 | 电流/赛博束 |
| `relic-archive` | seal 淡入、fold 展开 | 掉宝光柱 |
| `star-activation-ritual` | L1–L2 轻 Canvas | 满屏粒子、Lottie 大包体未审核 |
| `celebration-modal` | **默认关闭** `show-particles` | loot burst / jackpot |
| `ar-entry` | L1 微光提示 | 03B 全七阶段重仪式 |

---

## 5. 禁止使用 ART 级复杂视觉

以下属于 **ART Canon / 视觉生产层**，小程序 **Mapping Layer 不得默认实现**。

### 5.1 场景与资产

| 禁止项 | Canon 来源 | 原因 |
|--------|------------|------|
| 全卷轴二十八宿可交互星图 Canvas | FOUR_SYMBOL Atlas | 包体/性能；用 chip 列表代替 |
| 四象神兽立绘 / 巨大兽头 / Boss 演出 | FOUR_SYMBOL §四象原则 | 违背生命状态表达 |
| 青龙/朱雀/白虎/玄武独立 3D 场景 | ART_04 + 四象 Spec | XR 分包外不承载 |
| 祥云之门 6–8s 全屏仪式（Tab 首页） | ART_04 P01 | 仅 AR/活动入口可选 |
| 宝物七阶段完整纹样展开 | ART_03B | 简化为 2–4s；纹样用静态 seal |
| 合真图全亮爆发 | ART_03C L4 / ART_04 P08 | 仅轮廓+留白 |
| 164 星/穴平铺图谱 | ART_04 P07 | 分层折叠 + chip |
| 敦煌级满幅 mural 背景 | ART_BIBLE Reference | 用宣纸纹理/渐变代替 |

### 5.2 动效与粒子

| 禁止项 | Canon 来源 |
|--------|------------|
| 爆炸 / 烟花 / 掉宝光柱 / 老虎机演出 | FOUR_SYMBOL · ART_03A |
| 升级 / 战力 / 胜利 / 抽卡动画 | ART_03C · ART_03A |
| 爆闪 / 震屏 / 高频闪烁 | ART_03 · ART_03B |
| 闪电 / 电流 / 赛博能量束 | ART_03A PARTICLE_003 |
| 同时叠加 3+ 粒子层 | ART_BIBLE §7 Motion restraint |
| 未压缩 Lottie >200KB 主包 | ART_04 §十四 微信约束 |

### 5.3 UI 气质

| 禁止项 | Canon 来源 |
|--------|------------|
| 游戏 HUD / 圆角胶囊按钮堆 | ART_BIBLE Shape §避免 |
| loot flash / casino shine | ART_BIBLE §2–6 |
| 霓虹 / 彩虹渐变 / 赛博朋克 | ART_03 · FOUR_SYMBOL 材质禁止 |
| 信物=数字藏品 同卡展示 | AGENTS.md 资产规则 |
| 非注册术语 | 术语注册表：探索地图、权益中心、心愿值、合真、回响、祝禁 |

### 5.4 小程序允许的最高视觉上限（红线）

```
✅ 宣纸底 + 玄青结构 + 鎏金点缀
✅ chip/seal/card 级轻动效（CSS + 小 Canvas）
✅ 单层波纹 / ≤24 微光点 / 单条流线
✅ 2–4s 短仪式（独立页）
✅ 进度条与图谱折叠结构

❌ 全屏粒子场
❌ 多阶段纹样生成动画
❌ 四象独立美术场景
❌ 任何「领奖/升级」演出
```

---

## 附录 A：页面 × Canon 速查

| 小程序页面 | 主要 Canon | Mapping 角色 |
|------------|------------|--------------|
| `explore-map` | ART_04 发现 | 探索地图入口（L1） |
| `ar-entry` | ART_03B + 03A L1 | 显现入口；轻微光 |
| `lottie` | ART_03B/C + P04 | 短仪式 |
| `event-complete` | P04 信物 | 获得页→入库 |
| `relic-archive` | P06 + ART_03 信物哲学 | 图谱墙 |
| `star-map` | FOUR_SYMBOL + 03C L1–L3 + P07 | 天之图鉴 |
| `meridian-map` | 03C 流动 + P07 人体系 | 经络图谱 |
| `heaven-human-unity` | P08 合真预告 | 轮廓留白 |
| `digital-collectible` | 营销层 | 与信物分流 |
| `rights-center` | L1 商业 | 与仪式视觉分离 |

---

## 附录 B：动效参数速查（实现参考）

```javascript
// ART_03B 宝物显现（小程序压缩版）
const TREASURE_REVEAL_MINI = {
  silence: 500,
  particleGather: 1500,
  patternExpand: 1200,   // 可静态 seal 代替全动画
  objectFadeIn: 1000,
  nameFadeIn: 600,
  hold: 2500,
  forbid: ['pop', 'flip-card', 'flash', 'coin-rain']
};

// ART_03C 连接点亮
const CONNECTION_LIGHT_MINI = {
  dormantOpacity: 0.25,
  awakeningOpacity: 0.55,
  litOpacity: 0.9,
  transitionMs: 800,
  stages: ['dormant', 'micro', 'flow', 'awaken', 'stable', 'resonance'],
  forbid: ['level-up', 'victory', 'gacha', 'power-burst']
};
```

---

## 状态

```
MINI_PROGRAM_VISUAL_MAPPING_LAYER_STATUS = DEFINED
MINI_PROGRAM_VISUAL_MAPPING_LAYER_V1 = ON_DISK
```
