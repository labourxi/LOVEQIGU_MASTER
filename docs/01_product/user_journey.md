# AR游伴 · 用户旅程

**文件 ID：** `01_product/user_journey.md`  
**版本：** V1 初稿  
**状态：** DRAFT  

---

## 1. 概念定义

用户旅程是游客在**真实空间**中完成探索并留下**信物记忆**的路径，不是任务列表刷积分。

| 原则 | 说明 |
|------|------|
| 导航优先 | 探索地图是主入口，AR 不是首页全部 |
| 仪式节奏 | 显现前中后分阶段，不一次性弹奖励 |
| 可降级 | AR 失败走备用，旅程不断 |
| 非游戏化 | 无等级/抽卡/战力 |

---

## 2. 结构说明

### 2.1 六层交互（冻结）

来源：`AR_INTERACTION_ARCHITECTURE_V1.1.md`

```text
1. Location Navigation  探索地图导航
2. Point Approach       抵达探索点
3. Exploration Action   打卡/纪要
4. Revelation           显现（AR/备用）
5. Relic Archive        信物收录
6. Completion           权益/回响/复访
```

### 2.2 页面映射

| 层 | 页面 |
|----|------|
| 1 | explore-map |
| 2–3 | merchant-event/detail |
| 4 | ar-entry → lottie |
| 5 | relic-archive |
| 6 | rights-center · event-complete |

---

## 3. 流程说明

### 3.1 状态机

```text
AVAILABLE → ARRIVED → CHECKED_IN → AR_SCANNED → RELIC_REVEALED → COUPON_UNLOCKED → COMPLETED
```

### 3.2 试点动效阶段

| 阶段 | 动效 ID | 页面 |
|------|---------|------|
| 进入 | xr_start_v1 | index |
| 探索 | space_trail_v1 | explore-map |
| 信物 | relic_emerge_v1 | lottie |

### 3.3 情绪曲线（产品）

```text
克制入场 → 路径展开 → 发现印记 → 显现张力 → 信物沉淀 → 礼遇延续 → 回响复访
```

---

## 4. 示例

**场景：周末游客首次到访**

1. 扫码打开小程序 → 首页见景区名与进度  
2. 点击「进入景区」→ 动效 → 探索地图  
3. 推荐点「前往打卡」→ 探索纪要 → 进入显现  
4. 完成显现 → 显现信物 → 完成页「你已完成一次探索体验」  
5. 权益中心查看礼遇 → 我的查看印记  

---

## 5. 可执行说明

### 验收 Walkthrough

```bash
# 工程门禁
node scripts/user_frontend/validate_build.js
```

人工路径：index → explore-map → detail → ar-entry → lottie → event-complete → rights → profile

### 断点排查

| 症状 | 检查 |
|------|------|
| 白屏 | app.onError · page refresh try/catch |
| 按钮无反应 | safeInteraction behavior |
| 显现卡住 | adapter.startARScan / FALLBACK |
| 无信物 | revealRelic 前置状态 |

---

*上游：`USER_EXPLORATION_RUNTIME_FLOW_V1.md`*
