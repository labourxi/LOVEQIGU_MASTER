# USER_PROGRESS_STORE_AUDIT_V1

# 全项目用户状态 Store 审计 V1

```yaml
project: LOVEQIGU / AR游伴
module: User Progress Store Audit
version: V1
status: AUDIT_COMPLETE
owner: TECH
date: 2026-06-07
mode: READ_ONLY_AUDIT
constraints:
  - 禁止修改代码
  - 仅审计 + 设计提案
upstream:
  - docs/product/event/EVENT_RUNTIME_SMOKE_TEST_V1.md
  - docs/product/merchant/MERCHANT_REDEMPTION_CENTER_V1.md
```

---

## 1. 审计结论（Executive Summary）

| 指标 | 值 |
|------|-----|
| 审计页面总数 | **36**（小程序 22 · 静态 HTML 4 · Admin 24 页去重后约 10 组） |
| **有用户状态** | **8 处**（含 UI 偏好 / 沉浸里程碑 / 合成进度 / 领券 / B 端 Mock） |
| **无用户状态** | **28+ 页面**（只读 Mock 或纯导航） |
| 统一 Store | ❌ **不存在** |
| 存储键数量 | **9 个独立 key**（跨 3 种介质） |
| 活动全流程进度 | ❌ **全缺**（任务 / 信物 / 领券 / 探索节点） |

**一句话：** 当前仅有 **碎片化本地存储**——合成进度与首次觉察里程碑是 C 端最完整的写入能力；**活动参与主链路（探索→任务→信物→领券→核销）没有任何统一用户进度 Store**。

---

## 2. 审计范围与方法

### 2.1 扫描范围

| 区域 | 路径 |
|------|------|
| 微信小程序 | `apps/miniapp/` |
| 静态原型页 | `pages/` |
| 管理端 | `apps/admin/` |
| 用户 Mock 数据 | `data/user_mock/` |

### 2.2 判定标准

| 分类 | 定义 |
|------|------|
| **有用户状态** | 存在 `wx.storage` / `localStorage` / `sessionStorage` 读写，或专用 storage service 持久化用户侧数据 |
| **仅有 UI 偏好** | 持久化 Tab / 章节选择等，不改变业务进度 |
| **仅有会话态** | Admin 登录 session，非 C 端用户进度 |
| **无用户状态** | 只读静态 Mock；`setData` 仅内存；无跨会话持久化 |

---

## 3. 现有 Storage 清单

### 3.1 微信小程序（wx.storage）

| Storage Key | Service | 写入内容 | 类型 |
|-------------|---------|----------|------|
| `appName` | `app.js` | 产品名 | 元数据 |
| `dual_home_last_mode` | `home-policy-service.js` | explore / affinity 末次 Tab | UI 偏好 |
| `explore_map_selected_chapter_id` | `explore-map-chapter-picker-service.js` | 探索地图当前章节 | UI 偏好 |
| `loveqigu_synthesis_v1` | `synthesis-storage.js` | 合成记录 + synthesized_ids | **业务进度** |
| `loveqigu_first_light_v1` | `first-light-service.js` | 首次觉察里程碑时间戳 | 沉浸 UX |

### 3.2 静态 HTML（localStorage）

| Storage Key | 页面 | 写入内容 | 类型 |
|-------------|------|----------|------|
| `loveqigu_user_coupons` | `pages/rights-center/coupon-center.html` | 用户已领卡券 | **业务进度** |
| `loveqigu_coupon_history` | 同上 | 领券历史流水 | **业务进度** |

### 3.3 管理端

| Storage Key | 介质 | 页面 | 写入内容 | 类型 |
|-------------|------|------|----------|------|
| `platform_admin_logged_in` | sessionStorage | platform-admin/login | 登录标记 | 会话 |
| `platform_admin_user` | sessionStorage | platform-admin | 用户名 | 会话 |
| `platform_admin_mock_state_v1` | localStorage | reviews · publish · dashboard | 审核/发布 Mock 覆盖 | B 端 Mock |
| `merchant_redemption_mock_state_v1` | localStorage | merchant_redemptions · detail | 核销状态覆盖 | B 端 Mock |

### 3.4 架构问题

```text
┌─────────────────────────────────────────────────────────┐
│  C 端小程序          静态 HTML           B 端 Admin        │
│  5 wx keys           2 localStorage      2+ session/local │
│       ↕ 无联通              ↕ 无联通            ↕ 无联通   │
│  活动进度：全缺 · 三轨存储 · 九套 key · 无 schema 版本总线  │
└─────────────────────────────────────────────────────────┘
```

---

## 4. 页面分类审计

### 4.1 微信小程序（`apps/miniapp/app.json` 注册 22 页）

#### ✅ 有用户状态（写入或读取持久化进度）

| 页面 | 路径 | Store / Key | 状态类型 | 说明 |
|------|------|-------------|----------|------|
| index | `pages/index/` | `dual_home_last_mode` | UI 偏好 | Tab 切换持久化 |
| explore-map | `pages/explore-map/` | `explore_map_selected_chapter_id` | UI 偏好 | 章节选择持久化 |
| synthesis | `pages/synthesis/` | `loveqigu_synthesis_v1` · `loveqigu_first_light_v1` | **业务进度** | 合成写入 + 里程碑 |
| star-map | `pages/star-map/` | `loveqigu_first_light_v1` | 沉浸 UX | 首次点亮提示 |
| meridian-map | `pages/meridian-map/` | `loveqigu_first_light_v1` | 沉浸 UX | 首次经络提示 |
| reward-center | `pages/reward-center/` | 读 `loveqigu_synthesis_v1` | 派生只读 | 解锁态来自合成记录 |
| seals | `pages/seals/` | 读 `loveqigu_synthesis_v1` | 派生只读 | 印鉴进度展示 |
| heaven-human-unity | `pages/heaven-human-unity/` | 读 synthesis + 静态信物 | 派生只读 | 天人合一看板 |

#### ❌ 无用户状态（只读 Mock / 纯导航）

| 页面 | 路径 | 数据来源 | 缺失进度 |
|------|------|----------|----------|
| ar-entry | `pages/ar-entry/` | ar-service · story-flow | 场域闭合不记录 |
| atom | `pages/atom/` | atom-service | 内容节点完成不记录 |
| lottie | `pages/lottie/` | lottie-service | 动效步不记录 |
| echo | `pages/echo/` | echo-service | 回响步不记录 |
| digital-collectible | `pages/digital-collectible/` | digital-collectible-service | 数字藏品获得不记录 |
| story-flow | `pages/story-flow/` | story-flow-service | 流程完成不记录 |
| story-archive | `pages/story-archive/` | story-service | 归档只读 |
| relic-archive | `pages/relic-archive/` | relic-service 静态 status | 信物不授予 |
| rights-center | `pages/rights-center/` | rights-service 静态 status | 明确无领取 Store |
| campaign-closure | `pages/campaign-closure/` | campaign-service | 活动记念只读 |
| next-activity | `pages/next-activity/` | next-activity-service | 只读 |
| scenic-list | `pages/scenic-list/` | prototype-runtime-service | 只读 |
| scenic-detail | `pages/scenic-detail/` | prototype-runtime-service | 只读 |
| profile | `pages/profile/` | prototype-runtime-service | 只读 |

#### ⚠️ 特殊说明：信物 / 星图「进度」为静态 Mock

- `relic-alias-service.getDefaultOwnedRelics()` 从章节模块 **静态** `status` 判定拥有（含 `placeholder`）。
- `explored_nodes` 在所有 chapter story 中恒为 **0**，无写入路径。
- 星图点亮 / 经络点亮 **不持久化**，重启后仍来自静态信物 status。

---

### 4.2 静态 HTML 原型（`pages/`）

| 页面 | 路径 | 用户状态 | 说明 |
|------|------|----------|------|
| merchant-event 入口 | `pages/merchant-event/index.html` | ❌ 无 | 生成时硬编码 |
| merchant-event 探索 | `pages/merchant-event/exploration.html` | ❌ 无 | 静态链接 |
| merchant-event 详情 | `pages/merchant-event/detail.html` | ❌ 无 | 忽略 query 参数 |
| coupon-center | `pages/rights-center/coupon-center.html` | ✅ 有 | `loveqigu_user_coupons` · `loveqigu_coupon_history` |

**断层：** 小程序 `rights-center` 无 Store；独立 HTML `coupon-center` 有领券 Store——**两页不共享状态**。

---

### 4.3 管理端（`apps/admin/`）

#### ✅ 有状态（B 端 Mock / 会话）

| 模块 | 页面 | Store | 说明 |
|------|------|-------|------|
| platform-admin | login · dashboard · reviews · publish | session + `platform_admin_mock_state_v1` | 登录 + 审核/发布 Mock 覆盖 |
| merchant-portal | merchant_redemptions · merchant_redemption_detail | `merchant_redemption_mock_state_v1` | 核销状态模拟 |

#### ❌ 无持久化用户/Mock 状态

| 模块 | 页面 | 说明 |
|------|------|------|
| merchant-portal | dashboard · coupons · coupon_detail · tickets · ticket_* · finance · account · help | 只读 fetch Mock |
| park-admin | 全部 7 页 | 只读 Mock，无 localStorage |

---

## 5. 汇总矩阵

### 5.1 按业务域

| 业务域 | 有 Store | 无 Store | 完成度 |
|--------|----------|----------|--------|
| UI 偏好（Tab / 章节） | ✅ | — | 100% Mock |
| 沉浸里程碑（首次觉察） | ✅ | — | 100% Mock |
| 信物合成 / 印鉴 | ✅ | — | 80%（合成写入；信物本体不授予） |
| 探索节点进度 | — | ❌ | 0% |
| 故事流 / AR 闭合 | — | ❌ | 0% |
| Canon 信物收集 | — | ❌ | 0%（静态 placeholder） |
| 权益 / 卡券领取 | ⚠️ HTML only | 小程序 ❌ | 15% |
| 活动任务进度 | — | ❌ | 0% |
| 商家核销（C→B） | B 端 Mock | C 端 ❌ | 30% |
| 平台审核 / 发布 | B 端 Mock | — | Mock only |

### 5.2 计数

| 类别 | 数量 |
|------|------|
| 有业务进度写入 | **3**（synthesis · coupon-center HTML · merchant redemption B 端） |
| 有 UI / UX 偏好写入 | **3**（home mode · chapter picker · first-light） |
| 只读派生（读 Store 不写） | **3**（reward-center · seals · heaven-human-unity） |
| 完全无 Store | **22+** |

---

## 6. 关键缺口（Gap）

| ID | 缺口 | 影响 |
|----|------|------|
| G01 | 无统一 `user_id` / 会话标识 | 无法跨端关联 |
| G02 | 活动进度（task / point / relic / coupon）无 Store | E2E 流程不可走通 |
| G03 | 小程序 vs HTML 双轨权益存储分裂 | 领券状态不一致 |
| G04 | C 端领券 vs B 端核销无 `coupon_code` 总线 | 核销 Mock 孤立 |
| G05 | 信物 status 仅静态模块，无 runtime grant | 星图/合成输入虚假 |
| G06 | story-flow 六步链无 completion bitmap | 闭合演示不可复盘 |
| G07 | 九套 key 无 schema 版本与迁移策略 | 未来 API 同步困难 |

---

## 7. 统一 Store 设计提案

> **设计原则：** 单一 Schema · 分区命名 · 现有 key 兼容迁移 · C/B 端职责分离 · Mock-first 可演进 API。

### 7.1 顶层 Schema

```yaml
schema: loveqigu.user_progress.v1
version: "1.0.0"
user_id: "user_local_{device}"      # Mock 阶段本地生成；上线后替换 openid
updated_at: ISO8601
```

**物理存储策略（Mock 阶段）：**

| 端 | 介质 | 主 Key |
|----|------|--------|
| 小程序 | `wx.storage` | `loveqigu_user_progress_v1` |
| 静态 HTML 原型 | `localStorage` | 同上（JSON 结构一致） |
| B 端 Admin | 保持独立 Mock key | 不并入 C 端 Store |

### 7.2 分区结构

```json
{
  "schema": "loveqigu.user_progress.v1",
  "version": "1.0.0",
  "user_id": "user_local_xxx",
  "updated_at": "2026-06-07T12:00:00+08:00",

  "ui": {
    "dual_home_last_mode": "explore",
    "explore_map_selected_chapter_id": "ch01_threshold"
  },

  "immersion": {
    "first_light_milestones": {
      "first_star": 1710000000000,
      "first_point": null
    }
  },

  "canon": {
    "chapters": {
      "ch01_threshold": {
        "explored_node_ids": [],
        "completed_flow_ids": [],
        "recorded_relic_ids": []
      }
    },
    "synthesis": {
      "synthesized_ids": [],
      "records": []
    }
  },

  "event": {
    "active_activity_id": "activity_loveqigu_first_event_v1",
    "activities": {
      "activity_loveqigu_first_event_v1": {
        "entered_at": null,
        "completed_point_ids": [],
        "completed_task_ids": [],
        "granted_relic_ids": [],
        "coupons": [
          {
            "coupon_id": "coupon_loveqigu_cafe_01",
            "coupon_code": "LQG-CAFE-1001",
            "status": "CLAIMED",
            "claimed_at": null,
            "redeemed_at": null
          }
        ]
      }
    }
  },

  "rights": {
    "items": [
      {
        "right_id": "right_ch01_jieyuan_free_latte",
        "status": "locked",
        "claimed_at": null
      }
    ]
  }
}
```

### 7.3 Service 层设计（提案，未实现）

```text
apps/miniapp/services/user-progress/
├── user-progress-store.js      # read / write / migrate / normalize
├── user-progress-canonical.js  # canon 域 mutation API
├── user-progress-event.js      # event 域 mutation API
├── user-progress-rights.js     # rights 域 mutation API
└── user-progress-migrate.js    # 从旧 key 一次性迁移
```

**核心 API（示意）：**

```javascript
// 统一读写
readProgress() → UserProgressV1
writeProgress(patch) → UserProgressV1
patchProgress(domain, mutator) → UserProgressV1

// Canon 域
markNodeExplored(chapterId, nodeId)
completeStoryFlow(flowId)
recordRelic(relicId)
addSynthesis(record)          // 兼容现有 synthesis-storage

// Event 域（爱企谷初见寻宝节）
enterActivity(activityId)
completeTask(activityId, taskId)
grantEventRelic(activityId, relicId)
claimCoupon(activityId, couponId) → { coupon_code }

// Rights 域
claimRight(rightId)
markRightRedeemed(rightId)
```

### 7.4 旧 Key 迁移映射

| 旧 Key | 新路径 | 动作 |
|--------|--------|------|
| `dual_home_last_mode` | `ui.dual_home_last_mode` | 首次启动 migrate |
| `explore_map_selected_chapter_id` | `ui.explore_map_selected_chapter_id` | migrate |
| `loveqigu_synthesis_v1` | `canon.synthesis` | migrate（保留 schema 字段） |
| `loveqigu_first_light_v1` | `immersion.first_light_milestones` | migrate |
| `loveqigu_user_coupons` | `event.activities.*.coupons` | merge by coupon_id |
| `loveqigu_coupon_history` | `event.activities.*.coupon_history` | append-only log |

迁移完成后旧 key 可保留只读 fallback 一个版本周期。

### 7.5 C ↔ B 联通设计

```text
C 端 claimCoupon()
    → 写入 event.activities.*.coupons[].coupon_code
    → （Phase-2 API）POST 创建 merchant_redemption 记录

B 端 MerchantRedemptionMock.updateStatus(coupon_code)
    → （Phase-2）回写 C 端 coupon.status = VERIFIED
```

**关联字段：** `coupon_code` + `user_id` + `activity_id`

### 7.6 与现有模块关系

| 现有模块 | 统一 Store 后角色 |
|----------|------------------|
| `synthesis-storage.js` | 变为 `user-progress-store` 的 canon.synthesis 适配器 |
| `first-light-service.js` | 变为 immersion 域适配器 |
| `explore-map-chapter-picker-service.js` | 变为 ui 域适配器 |
| `home-policy-service.js` | 变为 ui 域适配器 |
| `redemption-store.js` | B 端独立；通过 coupon_code 与 event 域对齐 |
| `rights-service.js` | 读静态模板 + 覆盖 `rights.items[].status` |
| `relic-service.js` | 读静态 Canon + 覆盖 `canon.chapters.*.recorded_relic_ids` |

### 7.7 禁止事项（设计约束）

- **不**把 B 端审核 Mock 并入 C 端 Store
- **不**把 Content Layer / Canon 源文件当作 Store 写入目标
- **不**混用 Relic 与 Digital Collectible 进度字段
- 术语遵循 Language Constitution：权益中心 · 探索地图 · 信物 · 回响

---

## 8. 实施优先级（建议）

| 阶段 | 内容 | 解除 Blocker |
|------|------|--------------|
| P0 | `user-progress-store.js` + migrate 旧 4 key | 基础设施 |
| P0 | event 域：enter / completeTask / grantRelic / claimCoupon | B04 · B05 |
| P1 | canon 域：markNodeExplored / recordRelic / completeStoryFlow | 探索闭环 |
| P1 | rights 域 + 小程序 rights-center 接入 | B05 |
| P2 | coupon_code → merchant redemption 联通 | B06 真实解除 |
| P2 | API sync layer（POST 写 + GET 读覆盖） | B01 |

---

## 9. 完成确认

```yaml
USER_PROGRESS_STORE_AUDIT_V1_COMPLETE: YES
total_storage_keys_found: 9
pages_with_user_state: 8
pages_without_user_state: 28+
unified_store_exists: NO
unified_store_design: PROPOSED
recommended_primary_key: loveqigu_user_progress_v1
```
