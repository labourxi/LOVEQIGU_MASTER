# AR游伴 · 试点部署 SOP

**文档 ID：** `06_deployment/pilot_deployment_sop.md`  
**版本：** V1.2-STABLE  
**状态：** ENGINEERING_STANDARD  
**输入：** 签约 SOW、3 探索点勘测、内容包、商家名单  
**输出：** 可运营小程序、Runtime 验证记录、KPI 基线、复盘报告  

**闭环：** `USER → XR → VISUAL → SPACE → RELIC → CRM → REVENUE`  
**Runtime 对齐：** `runtime_flow.md` · `event_bus_contract.md` · `xr_architecture.md`（引用）  
**故障：** `failure_recovery_sop.md`

---

## 1. Definition（定义）

### 1.1 MVU

```text
1 park_id + 3 point_id + 90 days + 5 KPIs + Runtime 门禁 PASS + Go/No-Go
```

### 1.2 部署 = Runtime 可证明

试点交付不仅是「内容上线」，必须证明：

| 链路 | 验证方式 |
|------|----------|
| XR 启动 | `XR_USER_TRIGGER` + `validate_xr_ui_decouple` PASS |
| Event Bus | 主链路 emit 无未捕获异常 |
| World Engine | 显现页可完成（AR 或 FALLBACK） |
| Visual | 三 effectId 人工可见 |
| CRM | `revealRelic` + 可选 `unlockCoupon` |
| Revenue | ≥1 核销或 CRM 对账行 |

### 1.3 角色（RACI）

| 代号 | 角色 | 职责 |
|------|------|------|
| P | 平台运营 | 审查发布、陪跑、日报 |
| K | 景区对接 | 现场、勘测、商家协调 |
| M | 商家 | 券配置、核销演练 |
| R | 研发 | validate、热修、Runtime 问题 |
| C | 内容 | 信物/显现素材 |

---

## 2. System Design（结构设计）

### 2.1 交付物清单

| ID | 交付物 | Runtime/CRM 验收 |
|----|--------|------------------|
| D1 | C 端主链路 | validate_build + validate_pilot_scene PASS |
| D2 | XR/UI 解耦 | validate_xr_ui_decouple PASS |
| D3 | 3 点发布 | `runtimeStatus=READY` + detail 可读 |
| D4 | 商家核销 | merchant-portal `USED` ≥1 |
| D5 | 复盘 | KPI + fallback_ratio + 收入对账行 |

### 2.2 成功指标（5 KPI）

| KPI | 公式 | CRM 源 |
|-----|------|--------|
| K1 探索完成率 | ≥1 信物 / 进入景区 | `userRelics` / `enter_scenic` |
| K2 信物获得率 | revealRelic / startARScan | adapter |
| K3 权益领取率 | unlockCoupon / revealRelic | couponClaims |
| K4 显现成功率 | AR 成功 / (AR+FALLBACK) | arScanSessions |
| K5 七日复访 | 再访 / 首次 | GAP（待后端） |

### 2.3 风险登记表（本批次必填）

| ID | 风险 | 概率 | 影响 | 缓解 | 负责人 |
|----|------|------|------|------|--------|
| RK-01 | XR_FAILED 高频 | 中 | K4↓ | FALLBACK 彩排 + 现场说明卡 | R |
| RK-02 | Marker 不可用 | 中 | 显现体验 | 勘测标 `fallback_only` | K+C |
| RK-03 | 弱网 | 高 | 扫描超时 | 备用显现 + 运营话术 | P |
| RK-04 | 内容未发布 | 低 | 白屏/空点 | G1 门禁 publish PASS | P |
| RK-05 | 商家未核销 | 中 | 收入论据弱 | T+49 强制演练 | M+K |
| RK-06 | session 丢失 | 低 | 进度丢失 | 见 failure_recovery §3.4 | R |
| RK-07 | 视觉动效缺失 | 低 | 体验断点 | validate_pilot_scene | R |
| RK-08 | Canon 文案冲突 | 低 | 审查阻断 | T+14 检查 | C |

---

## 3. Flow（流程）

### 3.1 总时间轴

```text
T+0   Kickoff + Runtime 基线验证
T+1   勘测启动（A 点）
T+7   勘测完成 + G1 数据门禁
T+14  信物 Canon 检查
T+21  mock-source 录入 50%
T+30  Phase 1 门禁
T+35  审查提交
T+42  发布 + Runtime 冒烟
T+49  商家绑定
T+56  彩排（含 FALLBACK + 三动效）
T+60  Go/No-Go
T+61  对外试运行
T+75  中期快照
T+90  复盘 + 收入对账
```

---

### 3.2 T+0 当日（人可照做）

| 步骤 | 动作 | 谁 | 产出 | Runtime 检查 |
|------|------|-----|------|--------------|
| 1 | 建群 `AR游伴-{park}-试点` | P | 群 | — |
| 2 | 对齐 SOW：3×point_id、M1–M4 | P+K | 签字页 | — |
| 3 | 分配 `ep_001`…`ep_003` | P | ID 表 | — |
| 4 | 开通 park/merchant 账号 | P | 账号单 | 后台可登录 |
| 5 | 克隆仓库，打开 `apps/miniapp` | R | — | 开发者工具编译 |
| 6 | 运行 validate | R | 日志截图 | 见 §3.2.1 |
| 7 | 人工：首页→进入景区→地图 | R+P | 通过/缺陷单 | `XR_USER_TRIGGER` |

#### 3.2.1 T+0 命令（复制执行）

```bash
cd d:\LOVEQIGU_MASTER
node scripts/user_frontend/validate_build.js
node scripts/user_frontend/validate_pilot_scene_product.js
node scripts/user_frontend/validate_xr_ui_decouple.js
node scripts/user_frontend/validate_production_ui_stability.js
```

**通过标准：** 均输出 PASS；任一 FAIL → 当日不对外承诺，登记 RK-07。

---

### 3.3 T+1（勘测日 1）

| 步骤 | 动作 | 谁 |
|------|------|-----|
| 1 | 到 A 点拍照、GPS、测网速 | K |
| 2 | 评估 Marker：`marker_feasible` | K+R |
| 3 | 填勘测表 §4.1 | K |
| 4 | 若 Marker 差：标 `fallback_only=true` | K |

---

### 3.4 T+7（勘测周结束 · 门禁 G1）

| 步骤 | 动作 | 谁 | Runtime 检查 |
|------|------|-----|--------------|
| 1 | 完成 B、C 点勘测 | K | 3 份勘测表 |
| 2 | 降级策略签字 | K+P | AR/FALLBACK 确认 |
| 3 | 信物工作坊：冻结 relic_id | C+P | 不进 Canon 缺口 |
| 4 | mock-source 录入 3 点 | R | `getExplorationPointDetail` ×3 |
| 5 | Node 单点闭环 | R | §3.4.1 脚本 PASS |
| 6 | **G1 会议** | P | 勾选 §3.4.2 |

#### 3.4.1 T+7 adapter 冒烟（复制）

```bash
node -e "
require('./apps/shared/data-adapter/mock-source.js');
require('./apps/shared/data-adapter/status-map.js');
require('./apps/shared/data-adapter/adapter-session.js');
require('./apps/shared/data-adapter/ar-runtime-bridge.js');
require('./apps/shared/data-adapter/user-app-adapter.js');
var g=global;
g.LQGAdapterSessionStore.initSession({mockSource:g.LQGMockSource,mode:'memory'});
var a=g.LQGUserAppAdapter, u='user_001', p='ep_001';
a.mockCheckIn(p,u);
var s=a.startARScan(p,u);
var d=s.bridgeMode==='FALLBACK'?a.completeARFallback(s.scanSessionId,u):a.completeARScan(s.scanSessionId,u);
console.log('scan',d.ok,d.status);
console.log('relic',a.revealRelic(p,u).ok);
"
```

#### 3.4.2 G1 勾选

- [ ] 3×勘测表  
- [ ] 3×`getExplorationPointDetail` ok  
- [ ] adapter 冒烟 PASS  
- [ ] `fallback_only` 点已备说明卡  

---

### 3.5 T+42 发布日（Runtime 冒烟）

| 步骤 | 动作 | Runtime 验证 |
|------|------|--------------|
| 1 | platform-admin 发布 activity | `publishStatus=PUBLISHED` |
| 2 | 体验版小程序 | 冷启动 |
| 3 | 进入景区 | `xr_start_v1` + bus trigger |
| 4 | 单点全流程 | CHECKED_IN→revealRelic |
| 5 | FALLBACK 路径 | `completeARFallback` ok |
| 6 | 记录 fallback_ratio | 日报 |

**Event Bus 冒烟：** 进入景区与显现页无未处理 rejection；`XR_FAILED` 若有，须可 FALLBACK 完成。

---

### 3.6 T+56 彩排（30min · 含 Runtime）

```text
[0-5]   validate_build 再跑
[5-8]   进入景区 → 确认 xr_start_v1 + 地图
[8-12]  ep_001 AR 路径（或 FALLBACK）
[12-15] relic_emerge_v1 + 信物册
[15-18] 权益领取
[18-22] ep_002 FALLBACK 专项
[22-25] 断网重试 → failure_recovery 话术
[25-30] 填缺陷表 + RK 更新
```

---

### 3.7 T+60 Go/No-Go

**Go 条件（全部）：**

- [ ] validate_build + pilot_scene PASS  
- [ ] 人工 10/10（§5.1）  
- [ ] 商家核销演练 ≥1  
- [ ] 无开放 P0  
- [ ] fallback_ratio 已记录（不阻断，但写入复盘）  

**No-Go：** 延期对外，不承诺客流转化。

---

### 3.8 T+61 起每日运营

| 时刻 | 动作 |
|------|------|
| 09:00 | 设备抽检 |
| 12:00 | 日报 §4.2 + fallback_count |
| 17:00 | 缺陷同步 |
| 20:00 | P0 热修确认 |

---

## 4. Data Model（数据模型）

### 4.1 勘测表

```json
{
  "point_id": "ep_001",
  "point_name": "入口广场",
  "gps": { "lat": 31.23, "lng": 121.47 },
  "marker_feasible": true,
  "fallback_only": false,
  "network": "4G",
  "lighting": "outdoor",
  "merchant_id": "merchant_001",
  "relic_id": "relic_001",
  "runtime_notes": "ar_001 READY"
}
```

### 4.2 日报快照

```json
{
  "date": "2026-06-23",
  "park_id": "park_001",
  "enter_scenic": 0,
  "relic_count": 0,
  "benefit_count": 0,
  "fallback_count": 0,
  "xr_failed_count": 0,
  "p0_incidents": 0,
  "validate_build": "PASS"
}
```

### 4.3 Runtime 验证记录

```json
{
  "date": "2026-06-23",
  "checks": {
    "validate_build": true,
    "validate_pilot_scene": true,
    "validate_xr_ui_decouple": true,
    "adapter_smoke": true,
    "manual_10_10": false
  }
}
```

---

## 5. Example（示例）

### 5.1 人工 10/10 清单

| # | 操作 | 预期 |
|---|------|------|
| 1 | 冷启动 | 首页可点 |
| 2 | 进入景区 | xr_start + 地图 |
| 3 | Tab 五栏 | 无死链 |
| 4 | 打卡 | CHECKED_IN |
| 5 | 显现 | AR 或 FALLBACK |
| 6 | 信物 | relic-archive 有记录 |
| 7 | 权益 | 券或空态 |
| 8 | 完成页 | 商业 toast |
| 9 | FALLBACK 专测 | 信物仍获得 |
| 10 | 重进 | 进度保留 |

### 5.2 复盘目录

```markdown
# {park} 90天复盘
1. SOW 与模块交付
2. KPI 表
3. fallback_ratio / XR_FAILED 分布
4. CRM→收入对账（business_model §4.3）
5. 风险 RK 关闭情况
6. 二期范围
```

---

## 6. Execution Notes（执行说明）

- T+55 后仅 P0 热修；新点走变更单  
- 故障：`failure_recovery_sop.md`  
- 商业对账：`business_model.md` §2.4  
- world-engine 行为问题：记 bus 日志，不阻断 CRM 以 adapter 为准  

---

*试点 SOP V1.2-STABLE · Batch 2*
