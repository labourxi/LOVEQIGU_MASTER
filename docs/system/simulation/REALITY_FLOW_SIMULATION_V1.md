# REALITY FLOW SIMULATION V1

## 一、目标

验证视觉操作系统在真实用户路径下是否成立。

---

## 二、核心测试路径（必须模拟）

### PATH 1：首次用户进入

流程：

Landing → Explore → AR触发 → 信物生成

验证点：

- Landing 是否足够"进入欲"
- Explore 是否承接信息
- AR 是否不会破坏体验连续性
- 信物是否具备"显现感"

**模拟结论（PATH 1）：**

| 层级 | 结论 | 说明 |
|------|------|------|
| 规范层 | PASS | STATE_0 → STATE_1 → STATE_2 链路在冻结规范中闭合 |
| Spike 还原层 | PARTIAL | `visual_landing_production_v1` Landing / Explore 符合双首页；Explore 未接 STATE_2 下游 |
| Miniapp 生产层 | PARTIAL | `ep_001` 试点链可完成显现闭环，但 `pages/index` 非 STATE_0，混合入口与信息层 |

---

### PATH 2：无AR权限用户

流程：

Landing → Explore → fallback → 信物（备用显现）

验证点：

- 是否仍成立"世界显现逻辑"
- fallback 是否破坏仪式感
- 是否出现"失败感"

**模拟结论（PATH 2）：**

| 验证点 | 结论 | 依据 |
|--------|------|------|
| 世界显现逻辑 | PASS | `ar-entry` fallback 与 AR 成功同入口 `reveal`，同 `relic_emerge_v1` |
| 仪式感 | PASS | 文案为「备用显现」，无警告红，无降级羞耻感（对齐 `xr_visual_spec`） |
| 失败感 | PASS（低） | `fallback_ready` / `fallback_complete` 保持克制，不 emit 庆祝断裂 |

---

### PATH 3：低兴趣用户快速退出

流程：

Landing → Explore（未点击AR）→ exit

验证点：

- Explore 是否仍有轻记忆点
- Landing 是否承担过重情绪负担
- 是否存在"空体验"

**模拟结论（PATH 3）：**

| 验证点 | Spike | Miniapp `index` |
|--------|-------|-----------------|
| 轻记忆点 | PASS — 诗性卡片 + 城市标签 | PARTIAL — 有回响面板，但被路径矩阵稀释 |
| Landing 情绪负担 | PASS — 极简、克制 | FAIL — 进度 / 信物 / 礼遇数值 + 双 CTA |
| 空体验 | PASS — 无信息压迫 | RISK — 多入口造成工具感空转 |

---

### PATH 4：高频探索用户

流程：

Landing → Explore → 多点探索 → 多次AR触发

验证点：

- 是否产生信息疲劳
- 是否系统变成"工具"
- 是否破坏克制感

**模拟结论（PATH 4）：**

| 验证点 | 结论 | 说明 |
|--------|------|------|
| 信息疲劳 | Spike LOW / Miniapp MEDIUM | Spike 6 卡可控；miniapp 首页 5 条路径链 + 底栏易工具化 |
| 工具化风险 | Spike PASS / Miniapp FAIL | `index` 探索路径矩阵违背 Explore 单层阅读原则 |
| 克制感 | Spike PASS | 无奖励动效、无数值标签化 |

---

## 三、系统压力测试维度

### 1. 情绪压力

- 是否过度仪式化
- 是否过度轻信息
- 是否用户无法理解入口

**评估：** Spike Landing 情绪适中；Miniapp `index` 情绪与信息混杂，入口不明确（「开始探索」vs「进入景区」双轨）。

---

### 2. 信息压力

- Explore 是否变成信息堆叠
- 卡片是否过多
- 搜索是否侵蚀结构

**评估：** Spike Explore 6 卡 + 轻搜索浮层 — 在规范内；Miniapp `index` 在 STATE_0 层承载 Explore 级信息 — **跨层违规**。

---

### 3. 交互压力

- AR是否成为唯一核心路径
- fallback是否被频繁触发
- 是否出现路径断裂

**评估：** AR 非唯一（可仅浏览 Explore）；fallback 设计连续；**断裂点**在于 Spike 未接 AR / 信物，以及 miniapp 首页未按 Visual OS 分层。

---

### 4. 视觉压力

- 是否违背"未显现 → 半显现 → 已显现"
- 是否出现视觉层级混乱

**评估：** Spike 在 STATE_0 / STATE_1 层级清晰；Miniapp `index` 同时呈现 STATE_0 仪式文案 + STATE_1 统计与路径 — **层级混乱**。

---

## 四、关键判断标准

### PASS 标准：

```text
系统仍然成立"世界显现逻辑"
```

**规范层判定：PASS** — 三大冻结文档逻辑自洽，状态机可描述全链路。

**实现层判定：PARTIAL** — 试点 AR / 信物链成立；双首页未在生产首页收敛。

---

### FAIL 标准：

```text
用户感觉这是一个产品，而不是一个正在显现的世界
```

**风险触发点：**

1. `pages/index` 进度百分比、信物数、礼遇数 — 数值化产品感
2. 探索路径五链矩阵 — 工具导航感
3. 双主 CTA — 破坏单一显现入口

**未触发点（Spike + AR 链）：** Landing 氛围、fallback 同等仪式、信物 `relic_emerge_v1` 显现感。

---

## 五、系统稳定性结论字段

* SYSTEM_FLOW_STABLE = **NO**
* LANDING_ENTRY_EFFECTIVE = **YES**（Spike 达标；生产 `index` 未达标 — 分项见 PATH 记录）
* EXPLORE_WORLD_COHERENT = **YES**
* AR_DOES_NOT_BREAK_FLOW = **YES**
* OVERALL_VISUAL_OS_VALID = **NO**

**说明：**

- **规范有效、实现未完全收敛。** Visual OS 架构成立，但生产首页与 Spike 还原页并行，未形成单一用户路径。
- 不需要回退已冻结规范；需要 **实现收敛**（将 `index` 拆为 Landing，Explore 承接信息层），非设计回退。

---

## 六、禁止事项

* 不得修改任何系统结构
* 不得新增页面
* 不得新增功能
* 不得重构 UI
* 仅允许模拟 + 评估

---

## 七、最终结论

REALITY_FLOW_SIMULATION_V1 = COMPLETE

四条路径均已完成模拟评估。发现 **规范层与实现层分裂** 为首要结构问题；体验断裂集中于 **miniapp 首页未执行双首页宪法**。AR / fallback / 信物链在试点路径下保持显现连续性，**不建议回退冻结设计**，建议后续仅做实现层对齐（超出本任务范围）。

---

## 八、模拟溯源（只读引用，未改代码）

| 资产 | 路径 | 模拟角色 |
|------|------|----------|
| Landing Spike | `apps/spikes/visual_landing_production_v1/landing.html` | STATE_0 |
| Explore Spike | `apps/spikes/visual_landing_production_v1/explore-home.html` | STATE_1 |
| 生产首页 | `apps/miniapp/pages/index/` | 混合层（待收敛） |
| AR 显现 | `apps/miniapp/pages/ar-entry/` | STATE_2 触发 |
| 冻结规范 | `docs/system/os/`, `docs/system/visual/`, `docs/ui_implementation/DUAL_HOME_SYSTEM_SPEC_V1.md` | 判定基准 |
