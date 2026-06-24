# AR游伴 · 失败恢复 SOP

**文档 ID：** `06_deployment/failure_recovery_sop.md`  
**版本：** V1.2-STABLE  
**状态：** ENGINEERING_STANDARD  
**输入：** 故障现象、`XR_STATE`、ar-entry `phase`、adapter session  
**输出：** 恢复步骤、话术、报障单、数据修复策略  

**闭环：** `USER → XR → VISUAL → SPACE → RELIC → CRM → REVENUE`  
**Runtime 引用：** `xr_state_machine.md` · `runtime_flow.md` · `visual_system_v1.md` §3.2

---

## 1. Definition（定义）

### 1.1 失败恢复目标

任何故障下保证：

```text
不断链（可继续探索）· 不白屏 · 信物可完成或安全退回 · CRM 不脏写
```

### 1.2 三域恢复

| 域 | 机制 |
|----|------|
| **XR** | `XR_FAILED` → FALLBACK / retry |
| **UI** | phase + safeNavigate + toast |
| **Data** | adapter session 幂等；丢失可重建策略 |

### 1.3 输入 / 输出

| 方向 | 内容 |
|------|------|
| **输入** | 用户报障、日志、`ticket` 字段 |
| **输出** | 恢复动作、是否 P0、CRM 影响评估 |

---

## 2. System Design（结构设计）

### 2.1 故障分级

| 级别 | 定义 | SLA |
|------|------|-----|
| P0 | 白屏、主链路不可完成信物、CRM 脏写/丢失 | 2h |
| P1 | 显现失败且无 FALLBACK 引导 | 24h |
| P2 | 单点 UI、动效缺失 | 排期 |
| P3 | 文案/视觉 | 内容迭代 |

### 2.2 恢复矩阵（总览）

| 故障 | 检测 | XR 恢复 | UI 恢复 | CRM 影响 |
|------|------|---------|---------|----------|
| XR_FAILED | bus | retry trigger / FALLBACK | phase=error | 无写 |
| ready_timeout | XR_FAILED.reason | 同上 | 备用显现 | 无写 |
| completeARScan fail | adapter | FALLBACK | retry | 无写 |
| ar:lost | ar-event-bus | 重新对准 | overlay 提示 | 无写 |
| reveal 阻塞 | adapter msg | 先 complete AR | 引导显现 | 无写 |
| safeNavigate fail | safe-interaction | — | toast | 无写 |
| app.onError | app.js | — | toast | 无写 |
| session 清空 | 进度丢失 | — | 说明+运营补录 | **见 §3.4** |

---

## 3. Flow（流程）

### 3.1 XR 失败恢复机制（step-by-step）

```text
Step 1  检测：XR_STATE=FAILED 或 emit XR_FAILED
Step 2  Visual：禁止庆祝动效（relic_emerge / xr_start 庆祝态）
Step 3  UI：ar-entry phase → error
        primaryAction=retry
        secondaryAction=complete_fallback（若 bridgeMode=FALLBACK）
Step 4  用户 tap retry：
        ar-entry-controller.trigger({ source: 'retry' })
        → 新 XR_USER_TRIGGER → IDLE→INIT…
Step 5  若 retry 仍失败：
        引导 completeARFallback
Step 6  adapter：completeARFallback → AR_SCANNED_WITH_FALLBACK
Step 7  继续 revealRelic → CRM 正常写入
Step 8  运营：记录 fallback_ratio + 机型
```

**状态参考：** `xr_state_machine.md` L-A FAILED、L-B `error`/`fallback_ready`

### 3.2 UI Fallback 机制（step-by-step）

```text
Step 1  全局：app.onError / onUnhandledRejection → toast「功能开发中」
Step 2  导航：safeNavigate 失败 →「页面暂未开放」
Step 3  ar-entry：
        bridgeMode=FALLBACK → phase=fallback_ready
        文案同 AR 语气（xr_visual_spec §2.3）
Step 4  显现完成：fallback_complete → 与 ar_complete 同 CTA「显现信物」
Step 5  lottie：正常 play relic_emerge_v1（不歧视备用路径）
Step 6  完成：event-complete toast
```

**工程锚点：**

- `utils/safe-interaction.js`  
- `apps/miniapp/app.js` onError  
- `pages/ar-entry/index.js` resolveActionUi  

### 3.3 运营响应流

```text
报障 → 填 ticket §4.1 → 查日报 fallback_ratio
     → P0：拉 R + 暂停放量
     → P1：发备用显现卡
     → 复盘写入 pilot 日报
```

### 3.4 数据丢失处理

#### 3.4.1 场景分类

| 场景 | 症状 | CRM 状态 | 处理 |
|------|------|----------|------|
| D1 小程序被杀 | 回首页进度仍在 | session 在 | 无需处理 |
| D2 清缓存 | 进度归零 | session 丢 | 运营记录 + 用户重探索 |
| D3 adapter 写一半 | 极少见 mock | 不一致 | R 查 session JSON |
| D4 reveal 重复 | 同 relic 两次 | 幂等 ok | 无需处理 |
| D5 错 user_id | 进度错人 | 脏读 | P0；修 DEFAULT_USER_ID |

#### 3.4.2 session 存储

| 环境 | 机制 |
|------|------|
| 小程序 | `adapter-session` sessionStorage |
| Node 测试 | `mode: 'memory'` |

#### 3.4.3 丢失后恢复步骤（人可照做）

```text
Step 1  确认用户 user_id（试点默认 user_001）
Step 2  问用户最后完成点 ep_???
Step 3  研发导出 session（或让用户重走，MVP 可接受）
Step 4  若需补录（仅试点特批）：
        按 runtime_flow 顺序调用 mockCheckIn → complete* → revealRelic
        禁止直接改 userRelics 数组跳过 AR 门禁（破坏验收真实性）
Step 5  记录 ticket resolution=D2_manual_replay
```

#### 3.4.4 防脏写规则

- 仅 `revealRelic` / `unlockCoupon` 写 `userRelics` / `couponClaims`  
- `world-engine` / bridge **不得** 写 CRM  
- 重复 `revealRelic` 幂等返回已有行  

### 3.5 研发热修流

```text
复现 → 记录 XR_STATE + phase + bridgeMode
     → 修 → validate_build + validate_xr_ui_decouple
     → 体验版 → 运营通知
```

---

## 4. Data Model（数据模型）

### 4.1 报障单

```json
{
  "ticket_id": "INC-001",
  "severity": "P0",
  "park_id": "park_001",
  "point_id": "ep_001",
  "user_id": "user_001",
  "device": "iPhone 14",
  "network": "4G",
  "symptom": "xr_failed_after_enter",
  "xr_state": "FAILED",
  "phase": "error",
  "bridge_mode": "FALLBACK",
  "crm_impact": "none",
  "resolution": "",
  "resolved": false
}
```

### 4.2 XR_FAILED payload（对账）

```json
{
  "state": "FAILED",
  "reason": "ready_timeout",
  "source": "index_enter_scenic"
}
```

### 4.3 现场话术（L2）

| 场景 | 话术 |
|------|------|
| AR 不可用 | 「请使用备用显现完成探索，信物同样有效。」 |
| 加载失败 | 「请稍后再试，或返回探索地图。」 |
| 进度丢失 | 「请重新探索；试点期间可联系工作人员协助。」 |
| 已完成 | 「你已完成一次探索体验。」 |

### 4.4 CRM 影响评估

```json
{
  "ticket_id": "INC-001",
  "crm_impact": "none | replay_required | manual_fix",
  "affected_tables": [],
  "kpi_impact": false
}
```

---

## 5. Example（示例）

### 5.1 XR_FAILED @ 进入景区

```text
用户：点进入景区闪一下
运营：
  1. 能否进探索地图？能 → 引导单点备用显现
  2. 记录机型、微信版本
研发：
  1. 查 XR_FAILED.reason
  2. 若 ready_timeout：确认 FALLBACK 可 complete
  3. 不必修到 AR 必成功；须修到信物可完成
```

### 5.2 completeARScan 连续失败

```text
phase=error → 用户 retry 1 次
仍失败 → 运营引导备用显现卡
completeARFallback → revealRelic → 记 fallback_ratio
```

### 5.3 清缓存进度丢失

```text
crm_impact=replay_required
用户重走 ep_001（约 5–10 分钟）
试点不承诺跨设备同步（GAP：后端账号体系）
```

### 5.4 Node 验证 FALLBACK 闭环

```bash
node -e "
require('./apps/shared/data-adapter/mock-source.js');
require('./apps/shared/data-adapter/status-map.js');
require('./apps/shared/data-adapter/adapter-session.js');
require('./apps/shared/data-adapter/ar-runtime-bridge.js');
require('./apps/shared/data-adapter/user-app-adapter.js');
var g=global;
g.LQGAdapterSessionStore.initSession({mockSource:g.LQGMockSource,mode:'memory'});
var a=g.LQGUserAppAdapter,u='user_001',p='ep_001';
a.mockCheckIn(p,u);
var s=a.startARScan(p,u);
var f=a.completeARFallback(s.scanSessionId,u);
console.log('fallback ok',f.ok,f.pointState.status);
console.log('relic ok',a.revealRelic(p,u).ok);
"
```

---

## 6. Execution Notes（执行说明）

### 6.1 工程防线清单

| 防线 | 路径 |
|------|------|
| 导航 | `safe-interaction.js` |
| 全局异常 | `app.js` |
| FALLBACK | `ar-entry` + adapter |
| UI 解耦 | `validate_xr_ui_decouple.js` |
| 稳定 | `validate_production_ui_stability.js` |

### 6.2 现场物料

- 备用显现说明卡 × 探索点数  
- 运营电话/群  
- 本 SOP 打印 §3.1–3.2  

### 6.3 试点关联

- 彩排必含 FALLBACK：`pilot_deployment_sop.md` T+56  
- RK-01/03/06 对照风险表  
- 收入谈判：`fallback_ratio` 高时说明「信物闭环未断」  

### 6.4 禁止

- 以 `RELIC_CREATED` 代替 `revealRelic` 记 KPI  
- 直接改 mock session 跳过显现门禁（除 P0 特批并记录）  
- AR 失败时播放 `relic_emerge_v1`  

---

*失败恢复 SOP V1.2-STABLE · Batch 2*
