# AR游伴 · 系统边界

**文档 ID：** `02_technical/system_boundary.md`  
**版本：** V1.1-ENG  
**状态：** ENGINEERING_STANDARD  
**输入：** 需求描述、PRD、变更 PR  
**输出：** 允许/禁止判定、模块变更级别、评审 STOP 条件  

**关联：** `AGENTS.md` · `xr_architecture.md` · `system_boundary` 下游各域文档

---

## 1. Definition（定义）

### 1.1 边界文档用途

系统边界 = **可执行的责任划分表**。任何需求必须先对照本文件判定：

```text
需求 → 对照边界矩阵 → 越界则 STOP → 否则进入实现 → validate 门禁
```

### 1.2 空间事件驱动总边界

AR游伴 只交付以下闭环：

```text
USER → XR → EVENT BUS → SPACE → RELIC → CRM
```

不在闭环内的功能，默认 **不做**，除非单独开架构变更单。

### 1.3 输入 / 输出

| 方向 | 内容 |
|------|------|
| **输入** | 功能需求、模块路径、数据写目标、Canon 文案 |
| **输出** | ✅允许 / ⚠️慎改 / ❌禁止 + 责任域（XR/UI/CRM/Visual） |

---

## 2. System Design（结构设计）

### 2.1 四域责任矩阵（严格边界）

#### A. XR Runtime 负责

| 职责 | 模块 | 输出 |
|------|------|------|
| 管线生命周期 | `runtime-builder.js` | `XR_STATE`, `XR_FAILED` |
| 世界仪式逻辑 | `world-engine.js` | `RELIC_CREATED`, `STAR_LIGHTED` |
| Marker 跟踪 | `ar-marker-entry`, `ar-event-bus` | `ar:detected`, `ar:lost` |
| 设备/扫描桥接 | `ar-runtime-bridge.js` | `bridgeMode`, 权限状态 |
| 触发入口 | `ar-entry-controller.js` | `XR_USER_TRIGGER` |

**XR 不负责：**

- 写入 `userRelics` / `couponClaims`  
- 页面路由与 Tab 结构  
- 商家核销与分账  
- 信物档案 UI 文案排版  
- 商业定价  

#### B. UI Layer 负责

| 职责 | 模块 | 输出 |
|------|------|------|
| 页面与导航 | `pages/*` | 路由、Tab、`safeNavigate` |
| 用户可见状态 | `ar-entry` phase, `primaryAction` | 按钮、文案 |
| Pilot 动效 | `pilot-fx-overlay`, `pilot-visual-registry` | `xr_start_v1` 等 |
| 错误兜底 | `safe-interaction.js`, `app.onError` | toast，禁白屏 |
| 调用 adapter | `user-runtime-adapter` | 业务 API 入参 |

**UI 不负责：**

- 修改 `XR_STATE` 枚举  
- 在 `xr-scene` WXML 内 `bindtap`（validator 禁止）  
- 直接操作 `mock-source` 种子数据  
- 定义信物 Canon 叙事（仅展示 L2/L3 已审批文案）  

#### C. CRM / Data 负责

| 职责 | 模块 | 输出 |
|------|------|------|
| 用户进度 | `user-app-adapter` | `userProgress`, `userPointStates` |
| 信物实例 | `user-app-adapter.revealRelic` | `userRelics` |
| 权益领取 | `unlockCoupon` | `couponClaims` |
| 商家核销 | `merchant-admin-adapter` | `claimStatus=USED` |
| 行为统计源 | adapter 会话 | 试点 KPI 原始计数 |

**CRM 不负责：**

- Marker 姿态解算  
- `world-engine` 星宿算法  
- 3D 模型加载  
- 前端 CSS Token  

#### D. Visual 负责

| 职责 | 模块 | 输出 |
|------|------|------|
| Design Tokens | `user-phase1.wxss`, `bo-design-system.css` | 色板、字体 |
| 动效 ID 注册 | `pilot-visual-registry.js` | effectId 时长 |
| 信物/空间视觉子规范 | `03_visual/*` | 审查冻结资产 |
| 出图工厂 | `docs/art/*` | prompt、审查矩阵 |

**Visual 不负责：**

- 探索状态机转移条件  
- adapter 字段定义  
- Event Bus 事件名  
- 后台权限模型  

### 2.2 跨域协作点（唯一合法接口）

| 从 | 到 | 接口 | 禁止替代 |
|----|-----|------|----------|
| UI | XR | `ar-entry-controller.trigger` → bus | 页面 require builder |
| UI | CRM | `user-runtime-adapter.*` | 页面改 session 数组 |
| XR | UI | bus 事件 + 页面 phase | 直接 setData 他页 |
| CRM | B端 | shared adapter 同 session | duplicate mock |
| Visual | UI | CSS class + effectId | 内联改 adapter 逻辑 |

### 2.3 模块变更级别

| 级别 | 模块 | 变更要求 |
|------|------|----------|
| **不改** | Canon 冻结文档 | 仅 Canon 流程 |
| **慎改** | `xr-event-bus`, `runtime-builder`, `world-engine` | 架构评审 + `validate_xr_*` |
| **可改** | `pages/*`, `pilot/*`, `mock-source`, `user-app-adapter` 业务方法 | PR + validate_build |
| **随试点迭代** | `pilot-scene-flow`, 动效分支 | 视觉审查 |

### 2.4 产品边界（不做清单）

| ID | 排除项 | 原因 |
|----|--------|------|
| B-01 | 抽卡 / 等级 / 战力 | 非空间运营品类 |
| B-02 | C 端虚拟道具付费 | 商业模式边界 |
| B-03 | 自动分账 / POS | MVP 无支付链 |
| B-04 | 复杂会员 CRM | 仅行为链报表 |
| B-05 | Canon 外扩写 | AGENTS.md |
| B-06 | 信物=数字藏品 UI | 资产混用 |
| B-07 | 打卡地图命名 | 术语违规 |

### 2.5 资产边界表

| 资产 | 存储 | UI 模块 | 禁止 |
|------|------|---------|------|
| Relic 信物 | `userRelics` | `relic-archive`, `lottie` | NFT/藏品文案 |
| Digital Collectible | `digital-collectible` 服务 | 营销页 | 与信物同页同 ID |
| Coupon 礼遇 | `couponClaims` | `rights-center` | 积分商城 |

---

## 3. Flow（流程）

### 3.1 需求评审流

```text
Step 1  提交 PRD（含 park_id / point_id / adapter_method）
Step 2  对照 §2.1 四域矩阵 —— 是否单域可完成？
Step 3  若跨域 —— 列出合法接口（§2.2）
Step 4  若命中 §2.4 —— STOP，回报冲突
Step 5  若慎改模块 —— 架构评审会议
Step 6  更新 feature_spec + 本文件（若边界变更）
Step 7  实现 + validate 门禁
```

### 3.2 缺陷分级与域归属

| 现象 | 归属域 | 首要查阅 |
|------|--------|----------|
| 白屏 | UI | `failure_recovery_sop` |
| XR_FAILED | XR | `xr_state_machine` |
| revealRelic 失败 | CRM/adapter | `relic_data_model` |
| 动效不播 | Visual | `visual_system_v1` |
| 核销失败 | CRM/B端 | `merchant-admin-adapter` |

### 3.3 数据写入裁决流

```text
谁写入 userRelics？
  → 仅 user-app-adapter.revealRelic
  → bridge / world-engine / pages 均禁止

谁写入 userPointStates？
  → user-app-adapter 各探索方法
  → 禁止页面直写
```

---

## 4. Data Model（数据模型）

### 4.1 边界判定 JSON（自动化 PR 自检）

```json
{
  "$schema": "aryouban.boundary.check.v1",
  "requirement_id": "REQ-XXX",
  "touches": {
    "xr_runtime": false,
    "ui_pages": true,
    "crm_adapter": true,
    "visual_only": false
  },
  "writes": {
    "userRelics": false,
    "userPointStates": true,
    "xr_state": false
  },
  "violations": [],
  "verdict": "ALLOW"
}
```

### 4.2 需求判定表（样例）

| 需求 | XR | UI | CRM | Visual | 判定 |
|------|----|----|-----|--------|------|
| 首页加抽卡 | — | — | — | — | ❌ B-01 |
| 新 pilot 动效 | — | ✓ | — | ✓ | ✅ |
| 改星宿点亮算法 | ✓ | — | — | — | ⚠️ 慎改 |
| 新探索点 mock 数据 | — | — | ✓ | — | ✅ |
| 信物页 NFT 文案 | — | ✓ | — | ✓ | ❌ B-06 |
| 新增 revealRelic 字段 | — | — | ✓ | — | ✅ + schema 文档 |

### 4.3 接口归属 schema

```json
{
  "method": "revealRelic",
  "owner_domain": "CRM",
  "module": "user-app-adapter.js",
  "callers": ["pages/lottie", "user-runtime-adapter"],
  "must_not_call_from": ["ar-runtime-bridge", "world-engine"]
}
```

---

## 5. Example（示例）

### 5.1 ✅ 允许：新增探索点 ep_003

```text
域：CRM (mock-source) + UI (map 展示)
接口：getExplorationPointDetail('ep_003')
不写：runtime-builder
判定：ALLOW
```

### 5.2 ⚠️ 慎改：缩短 XR ready 超时

```text
域：XR (runtime-builder)
影响：XR_FAILED 频率、FALLBACK 比例
判定：REVIEW + 试点 KPI 对比
```

### 5.3 ❌ 禁止：completeARScan 内自动 revealRelic

```text
违反：CRM 写入只能经 revealRelic 显式步骤
违反：用户仪式相位（lottie）被跳过
判定：STOP
```

### 5.4 ❌ 禁止：world-engine 写 couponClaims

```text
违反：§2.2 跨域接口表
判定：STOP
```

### 5.5 ✅ 允许：ar-entry 增加 error phase 文案

```text
域：UI + Visual (L2 文案)
不写：adapter 状态枚举
判定：ALLOW
```

---

## 6. Execution Notes（执行说明）

### 6.1 验证门禁

```bash
node scripts/user_frontend/validate_production_ui_stability.js
node scripts/user_frontend/validate_xr_ui_decouple.js
node scripts/user_frontend/validate_build.js
```

### 6.2 PR 模板勾选（复制到 PR 描述）

```markdown
## 边界自检
- [ ] 未越界 §2.4 不做清单
- [ ] 信物与 digital_collectible 未混用
- [ ] userRelics 仅经 revealRelic 写入
- [ ] 未在 xr-scene 内 bindtap
- [ ] 慎改模块已架构评审（如适用）
- [ ] 术语：探索地图 / 权益中心 / 回响
```

### 6.3 与 AGENTS.md 关系

| AGENTS 规则 | 本文件落地 |
|-------------|------------|
| 不扩写 Canon | §2.4 B-05 |
| 信物 ≠ 藏品 | §2.5 |
| 术语替换 | §2.4 B-07 |
| 文档优先于代码冲突 | 标 GAP + issue |

### 6.4 域负责人（试点默认）

| 域 | 默认负责人 |
|----|------------|
| XR | 研发 R |
| UI | 研发 R + 设计 C |
| CRM | 研发 R + 运营 P |
| Visual | 设计 C + 内容 |

### 6.5 关联文档

| 主题 | 文件 |
|------|------|
| 运行时序 | `runtime_flow.md` |
| XR 细节 | `xr_architecture.md` |
| 信物 schema | `relic_data_model.md` |
| 失败恢复 | `failure_recovery_sop.md` |
| 视觉接入 | `visual_system_v1.md` §4.4 |

---

*系统边界 V1.1-ENG · Batch 1*
