# AR游伴 · Demo 就绪审计报告 V1

**文档 ID：** `DEMO_BLOCKER_REPORT_V1.md`  
**版本：** V1.0  
**状态：** AUDIT_SNAPSHOT  
**审计日期：** 2026-06-23  
**审计范围：** `apps/miniapp`（C 端）· `apps/admin`（B 端）· `apps/shared/data-adapter`（Mock Runtime）  
**构建门禁：** `node scripts/user_frontend/validate_build.js` → **PASS**（2026-06-23）

---

## 1. 执行摘要

| 维度 | 结论 |
|------|------|
| **投资人/景区 15 分钟 Demo** | ✅ **可演示**（单点试点主链路） |
| **全站 28 页小程序** | ⚠️ **仅约 8 页可演示**；其余为结构页/原型页/双轨遗留 |
| **B 端三端后台** | ✅ **可演示**（Mock Runtime，浏览器打开 HTML） |
| **真实 API / 生产数据** | ❌ **未接入** |
| **代码内 TODO 标记** | ✅ **miniapp 无 `TODO`/`FIXME`**（意图未完成功能通过 fallback 文案体现） |

**推荐 Demo 路径（唯一稳定闭环）：**

```text
首页 → 进入景区 → 探索地图 → ep_001 详情 → 模拟打卡
    → 显现仪（备用显现）→ 显现仪式 → 信物显现 → 完成页
    → 信物册 / 权益中心（只读）
```

**不建议在 Demo 中点击：** XR 景区渲染器入口、活动页旧链路完成任务、星图/经络占位区、数字藏品链、底部 Tab 重复点击当前页。

---

## 2. 审计方法

1. 静态：`app.json` 注册页 × 28，逐页读 `index.js` / `index.wxml`  
2. 模式扫描：`功能开发中` · `暂未开放` · `placeholder` · `skeleton` · `mock`  
3. 运行时：`validate_build.js` · adapter 冒烟链（`ep_001`）  
4. 导航：`user-bottom-nav` 组件自导航 vs 页面 `onBottomNavChange`（空实现）  
5. 数据：`user-runtime-adapter` vs `merchant-event` / `user-progress` 双轨  

---

## 3. C 端页面清单（`app.json` 注册 28 页）

### 3.1 图例

| 标记 | 含义 |
|------|------|
| 🟢 DEMO-READY | 可纳入对外 Demo 主路径 |
| 🟡 PARTIAL | 可打开，部分按钮有效或数据不同步 |
| 🟠 SKELETON | 结构/UI 在，业务为占位或仅导航 |
| 🔴 STUB | 打开后多为「功能开发中」或无效入口 |
| 📦 MOCK | 数据来自 Mock，非 API |

### 3.2 页面矩阵

| # | 路由 | 可打开 | 状态 | 数据源 | 说明 |
|---|------|--------|------|--------|------|
| 1 | `pages/index/index` | ✅ | 🟢 DEMO-READY | `user-app-adapter` + `merchant-event` 降级 | 骨架屏仅 `loading` 瞬间；「进入景区」试点闭环入口 |
| 2 | `pages/explore-map/index` | ✅ | 🟢 DEMO-READY | adapter 优先 | `space_trail_v1`；可进详情/ar-entry |
| 3 | `pages/merchant-event/detail/index` | ✅ | 🟢 DEMO-READY | adapter (`runtimeMock`) | 模拟打卡 / 显现仪 / 领礼遇 |
| 4 | `pages/ar-entry/index` | ✅ | 🟢 DEMO-READY | adapter + bridge | 默认 **FALLBACK** 路径可完成显现 |
| 5 | `pages/lottie/index` | ✅ | 🟢 DEMO-READY | adapter | `revealRelic` + `relic_emerge_v1` |
| 6 | `pages/event-complete/index` | ✅ | 🟡 PARTIAL | `merchant-event` 遗留 | 完成页可展示；数据可能与 adapter 会话不完全一致 |
| 7 | `pages/relic-archive/index` | ✅ | 🟡 PARTIAL | `prototype-runtime` + adapter 合并 | 显现后可见信物；无映射的信物点星图/经络 → toast |
| 8 | `pages/rights-center/index` | ✅ | 🟡 PARTIAL | adapter | **只读展示**；无页内领取按钮（领取在详情页） |
| 9 | `pages/profile/index` | ✅ | 🟡 PARTIAL | adapter | Mock 登录/资料；底部 Tab 可用 |
| 10 | `pages/progress-center/index` | ✅ | 🟡 PARTIAL | `user-progress` + `merchant-event` | **未接 adapter**；与试点链路进度可能不一致 |
| 11 | `pages/merchant-event/index/index` | ✅ | 🟡 PARTIAL | `merchant-event` | 旧活动首页；完成任务走旧 service，非试点 adapter |
| 12 | `pages/merchant-event/exploration/index` | ✅ | 🟡 PARTIAL | `merchant-event` | 点位列表可进详情 |
| 13 | `pages/star-map/index` | ✅ | 🟠 SKELETON | `star-map-service` + 部分 adapter | 青龙象完整，其余「结构占位」 |
| 14 | `pages/meridian-map/index` | ✅ | 🟠 SKELETON | `meridian-map-service` | 多节点「结构占位」 |
| 15 | `pages/story-archive/index` | ✅ | 🟠 SKELETON | `story-service` | 只读档案；章节 `mvp_placeholder` |
| 16 | `pages/seals/index` | ✅ | 🟠 SKELETON | `synthesis-service` | 印鉴进度展示；合成未闭环 |
| 17 | `pages/synthesis/index` | ✅ | 🟠 SKELETON | synthesis | 部分交互 → 「功能开发中」 |
| 18 | `pages/scenic-list/index` | ✅ | 🟠 SKELETON | `prototype-runtime` | 景区列表原型 |
| 19 | `pages/scenic-detail/index` | ✅ | 🟠 SKELETON | prototype + merchant-event | **导航按钮** → 「即将开放」 |
| 20 | `pages/atom/index` | ✅ | 🟠 SKELETON | `atom-service` | 内容节点跳板 → 动效页 |
| 21 | `pages/digital-collectible/index` | ✅ | 🔴 STUB | digital-collectible | 营销资产边界页；非试点 |
| 22 | `pages/echo/index` | ✅ | 🔴 STUB | echo-service | refresh 失败 → 「功能开发中」 |
| 23 | `pages/campaign-closure/index` | ✅ | 🔴 STUB | campaign | 同上 |
| 24 | `pages/next-activity/index` | ✅ | 🔴 STUB | next-activity | 同上 |
| 25 | `pages/story-flow/index` | ✅ | 🔴 STUB | story-flow | 同上 |
| 26 | `pages/heaven-human-unity/index` | ✅ | 🔴 STUB | heaven-human-unity | 同上 |
| 27 | `pages/reward-center/index` | ✅ | 🟠 SKELETON | reward-center | 祝福收藏册；与「权益中心」不同模块 |
| 28 | `pages/ar-entry` 以外未注册页 | — | — | — | `xr_demo/*` **未写入 app.json** |

### 3.3 未注册但代码存在的路径

| 路径 | 问题 |
|------|------|
| `/xr_demo/miniprogram/pages/xr-scenic-point-render/index` | `explore-map` / `detail` 内「XR 渲染」按钮会跳转；**主包未注册 → navigate 失败**（已捕获并显示 fallback 文案） |
| `xr_demo` 下其余 spike 页 | 仅开发用，Demo 勿点 |

---

## 4. 按钮与交互失效清单

### 4.1 P0 — 影响主链路或明显穿帮

| ID | 位置 | 现象 | 根因 |
|----|------|------|------|
| B-01 | `explore-map` / `detail` · XR 景区渲染 | 跳转失败或 fallback 文案 | 目标页不在 `app.json` |
| B-02 | `mock-source` · `ep_002` | 探索点 **LOCKED** | 试点仅 `ep_001` 默认可探索 |
| B-03 | `app.json` · `navigationBarTitleText` | 标题乱码 `AR娓镐即` | 编码/字符串损坏 |

### 4.2 P1 — Demo 可绕过但易误触

| ID | 位置 | 现象 | 根因 |
|----|------|------|------|
| B-04 | `relic-archive` · 待显现格子 `onSlotTap` | toast「功能开发中」 | 未收录信物不可点（符合设计，但像坏按钮） |
| B-05 | `relic-archive` · 星图/经络 | 无 `dataset.path` 时 toast | 信物无 star/meridian 映射 |
| B-06 | `scenic-detail` · 导航 | 「导航功能即将开放」 | 未实现 |
| B-07 | `progress-center` | 统计与试点会话不一致 | 未读 `user-app-adapter` session |
| B-08 | `merchant-event/index` · 完成任务 | 走旧 `completeTask`，与 adapter 进度分裂 | 双轨运行时 |
| B-09 | `user-bottom-nav` · 当前 Tab 再点 | toast「已在当前页面」 | 预期行为，演示时勿重复点 |
| B-10 | `rights-center` | 无「领取」CTA | 领取仅在 `detail` `unlockCoupon` |

### 4.3 P2 — 原型页内失效（勿纳入 Demo）

| 页面组 | 典型失效 |
|--------|----------|
| echo / atom / campaign-closure / next-activity / story-flow / heaven-human-unity | `onLoad` 或 `onNavigate` 无 path → 「功能开发中」 |
| star-map / meridian-map | 占位星域/穴位不可交互 |
| digital-collectible | 故意与信物分离的营销壳 |

### 4.4 全局兜底（非 Bug，Demo 需知）

| 机制 | 文件 | 行为 |
|------|------|------|
| `safeNavigate` 失败 | `utils/safe-interaction.js` | toast「页面暂未开放」 |
| 未捕获异常 | `app.js` onError | toast「功能开发中」 |
| refresh 异常 | 各页 `refresh()` catch | toast「功能开发中」 |

---

## 5. 骨架屏 / 占位 UI

| 类型 | 位置 | 说明 |
|------|------|------|
| **加载骨架** | `index/index.wxml` · `home-skeleton` | 仅 `loading=true` 时；正常 refresh 后消失 |
| **核销码占位** | `rights-center` · `rights-qr-placeholder` | 文案「到店出示 · 核销码占位」 |
| **星图/经络占位** | `star-map` / `meridian-map` WXML | 「结构占位」「待专项补全」 |
| **信物册占位格** | `relic-archive` | `placeholder` 组/待显现 teaser |
| **Marker 占位资源** | `ar-marker-entry` | `qinglong_placeholder` 默认 marker 名 |
| **首页加载态** | `home-xr-launch-overlay` | 进入景区时短暂显示，非整页骨架 |

**结论：** 无「整页永久骨架」；占位主要为 **次级功能** 与 **加载态**。

---

## 6. 假数据（Mock）版图

### 6.1 统一 Mock 源

| 层 | 路径 | 用途 |
|----|------|------|
| **主数据** | `apps/shared/data-adapter/mock-source.js` | 景区/点/信物/券/用户进度 |
| **会话** | `adapter-session.js` | 小程序 `sessionStorage` 持久化探索状态 |
| **C 端桥** | `miniapp/services/user-runtime-adapter/` | 默认 `user_001` · `activity_001` |
| **B 端** | 各 `*-adapter-boot.js` | 同 `mock-source` |
| **遗留 C 端** | `merchant-event` · `user-progress` · `user-frontend` | 旧活动引擎，与 adapter **并行** |

### 6.2 关键 Mock 事实（影响 Demo 话术）

| 字段 | 值 | 影响 |
|------|-----|------|
| 默认用户 | `user_001` | 无真实微信登录 |
| 默认景区 | `park_001` 爱企谷 | 单景区 |
| 可探索点 | `ep_001` AVAILABLE；`ep_002` **LOCKED** | Demo 只能稳定跑通 1 点 |
| 显现模式 | `startARScan` → 常返回 `bridgeMode=FALLBACK` | 需演示备用显现，非真 AR |
| 预置券 | `claim_001` 已存在 `user_001` | 权益中心可能已有礼遇 |
| 登录 | `loginMock` 按钮 | 非微信 OAuth |

### 6.3 双轨数据风险

```text
试点主链路：user-runtime-adapter → user-app-adapter → session
旧活动页：  merchant-event / user-progress → 本地 store

同一 Demo 内：
  · detail / ar-entry / lottie  → adapter 进度 ✅
  · progress-center / event-complete（部分字段）→ 旧 service ⚠️
```

---

## 7. TODO / 未完成功能（无注释 TODO）

代码库 `apps/miniapp` **无** `TODO` / `FIXME` 注释。  
未完成功能通过以下方式标记：

| 方式 | 示例 |
|------|------|
| toast 文案 | 「功能开发中」「页面暂未开放」「即将开放」 |
| 页面 intro | star-map「待专项补全」 |
| 章节状态 | `mvp_placeholder` / `placeholder` |
| 后台文案 | `Mock Runtime` · `发布占位` |
| 文档 GAP | `d7_return_rate` 待后端 |

---

## 8. B 端后台（`apps/admin`）

| 端 | 入口 | 可打开 | 数据 | Demo 用途 |
|----|------|--------|------|-----------|
| 平台 | `platform-admin/login` → dashboard | ✅ | Mock | 审查/发布流程演示 |
| 景区 | `park-admin/park_admin_dashboard` | ✅ | Mock | 活动/商家视图 |
| 商家 | `merchant-portal/merchant_scan` | ✅ | Mock | **核销** `LQG-CAFE-1001` 等 |

**限制：** 全部 `Mock Runtime`；发布/回滚多为占位按钮；无真实上线。

---

## 9. Demo Blocker 分级

### 9.1 阻断级（修复前勿对外承诺「全站可点」）

| ID | 项 | 建议修复 |
|----|-----|----------|
| **BL-01** | 仅 1 探索点可完整闭环 | 勘测前固定讲 `ep_001`；或解锁 `ep_002` mock |
| **BL-02** | XR 渲染按钮失败 | Demo 脚本删除该按钮路径，或注册 xr_demo 子包 |
| **BL-03** | 导航栏标题乱码 | 修正 `app.json` `navigationBarTitleText` → `AR游伴` |
| **BL-04** | 双轨进度 | Demo 只走 adapter 路径；勿进 `merchant-event/index` 完成任务 |

### 9.2 可接受（试点 Demo 说明即可）

| ID | 项 |
|----|-----|
| AC-01 | 备用显现代替真 AR |
| AC-02 | 权益中心只读 + 详情页领取 |
| AC-03 | 星图/经络/故事线占位 |
| AC-04 | 全库 Mock 数据 |
| AC-05 | 清缓存丢进度（session 级） |

---

## 10. 推荐 Demo 脚本（10 分钟 · 照读照点）

```text
[0:00] 微信开发者工具 → apps/miniapp → 编译
[0:30] 首页：说明「爱企谷试点」→ 点「进入景区」（动效）
[1:30] 探索地图：星点 → ep_001「入口广场」→ 详情
[2:30] 详情：「模拟打卡」→「进入显现仪」
[3:30] 显现仪：「开始」→「备用显现」→ 完成
[4:30] 自动/手动进显现仪式 →「完成显现」→ 信物显现动效
[5:30] 完成页：商业 toast
[6:00] 底部 Tab「信物」：确认「初见印记」类条目
[7:00] Tab「权益」：已领取礼遇（核销码占位文案可说明）
[8:00] （可选）浏览器打开 merchant-portal 核销 LQG-CAFE-1001
[9:00] （可选）platform-admin 展示审查/发布 Mock
[10:00] 结束：强调「行为链数据已写入 Mock CRM」
```

**勿点：** XR 景区渲染、活动页批量完成任务、数字藏品、echo 链、scenic-detail 导航。

---

## 11. 验证命令（发布 Demo 前）

```bash
cd d:\LOVEQIGU_MASTER
node scripts/user_frontend/validate_build.js
node scripts/user_frontend/validate_pilot_scene_product.js
```

**人工：** 执行 §10 脚本 1 遍；确认 `revealRelic` 后信物册有记录。

---

## 12. 附录 · 主链路 adapter 冒烟

```text
checkIn CHECKED_IN
start FALLBACK
complete AR_SCANNED_WITH_FALLBACK
relic true relic_001
coupon true LQG-CAFE-1001
```

---

## 13. 变更记录

| 版本 | 日期 | 说明 |
|------|------|------|
| V1.0 | 2026-06-23 | 首版 Demo 就绪审计 |

---

*本报告为快照；代码变更后请重跑 §11 并更新页面矩阵。*
