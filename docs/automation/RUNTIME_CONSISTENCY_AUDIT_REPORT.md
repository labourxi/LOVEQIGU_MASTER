# Runtime Consistency Audit — RUNTIME_CONSISTENCY_AUDIT_REPORT

**Mission:** RUNTIME_CONSISTENCY_AUDIT  
**Generated:** 2026-06-08  
**Scope:** CH01 · CH02 · CH03 — Content Layer ↔ MiniApp Runtime Layer

---

## Verdict

## **`LOVEQIGU_RUNTIME_READY = NO`**

CH03 已在 MiniApp Runtime 完整可发现；**CH01 为 RC1 stub 与 Content 不一致**；**CH02 在 Runtime 完全不可发现**。三章尚未在同一 Runtime 层面对齐。

---

## 1. 审计方法

| 层 | 路径 | 角色 |
|----|------|------|
| **Content Layer** | `data/story/*` · `data/relics/*` · `data/rights/*` · `data/ar/*` · DC Registry MD | L2 正式数据 |
| **MiniApp Runtime** | `apps/miniapp/services/*` | 页面调用层 |
| **Root Runtime** | `services/*`（Node） | 仅 CH01 接 data JSON |

验证 API：

- `getAllChapters()` / `getChapterById(id)`
- `getAllRelics()` / `getRelicsByChapterId(id)`
- `getAllRights()`
- `getAllArEvents()`
- `getAllDigitalCollectibles()` / `getDigitalCollectibleById(token)`

---

## 2. 总览矩阵

### 2.1 Content Layer（L2 正式）

| 章 | Story 节点 | Relic | Rights | AR | DC 登记 |
|----|----------:|------:|-------:|---:|:-------:|
| CH01 | 5 | 6 | 5 | 6 | `dc_ch01_completion_poster`（AR ref） |
| CH02 | 5 | 6 | 5 | 6 | `dc_ch02_completion_poster` ✓ Registry |
| CH03 | 5 | 6 | 5 | 6 | `dc_ch03_completion_poster` ✓ Registry |

**Content Layer：三章均已 Fill · 工厂 5/6/5/6 对齐**

### 2.2 MiniApp Runtime（`apps/miniapp/services/*`）

| 章 | Story | Relic | Rights | AR | DC 可调用 |
|----|:-----:|:-----:|:------:|:--:|:---------:|
| CH01 | ⚠ stub | ⚠ stub | ⚠ stub | ⚠ stub | ✗ |
| CH02 | ✗ | ✗ | ✗ | ✗ | ✗ |
| CH03 | ✓ | ✓ | ✓ | ✓ | ✓ |

### 2.3 Root Runtime（`services/*` Node）

| 章 | Story | Relic | Rights | AR |
|----|:-----:|:-----:|:------:|:--:|
| CH01 | ✓ data | ✓ data | ✓ data | ✓ data |
| CH02 | ✗ | ✗ | ✗ | ✗ |
| CH03 | ✗（仅 `ch03-runtime-service.js` 独立模块） | — | — | — |

---

## 3. 分层详审

### 3.1 Story Runtime

| 检查 | CH01 | CH02 | CH03 |
|------|:----:|:----:|:----:|
| `getChapterById(id)` 可发现 | ✓ | **✗** | ✓ |
| 节点数 = Content | **3 ≠ 5** | **0 ≠ 5** | **5 = 5** |
| 标题与 Content 一致 | **云门初醒 ≠ 云间初醒** | — | ✓ 再度重逢 |
| Bridge 模块 | 无（内联 stub） | 无 | `ch03-runtime-bridge.js` |

`getAllChapters()` 返回：**2 章**（`ch01_cloud_awakening` · `ch03_field_reunion`）— **缺 CH02**

### 3.2 Relic Runtime

| 检查 | CH01 | CH02 | CH03 |
|------|:----:|:----:|:----:|
| `getRelicsByChapterId(id)` 数量 | **3 ≠ 6** | **0 ≠ 6** | **6 = 6** |
| ID 与 Content 对齐 | **✗**（stub IDs） | **✗** | **✓** |
| `getAllRelics()` 含本章 | 部分 | 否 | 是 |

`getAllRelics()` 总数：**9**（3 stub + 6 CH03）— 期望全三章 **18**

### 3.3 Rights Runtime

| 检查 | CH01 | CH02 | CH03 |
|------|:----:|:----:|:----:|
| 按 `chapter_id` 可发现 | **0**（stub 无 chapter_id） | **0** | **5** |
| 数量 vs Content | **2 ≠ 5** | **0 ≠ 5** | **5 = 5** |

`getAllRights()` 总数：**7**（2 stub + 5 CH03）— 期望 **15**

### 3.4 AR Runtime

| 检查 | CH01 | CH02 | CH03 |
|------|:----:|:----:|:----:|
| 按 `chapter_id` 可发现 | **0**（stub 无 chapter_id） | **0** | **6** |
| 数量 vs Content | **2 ≠ 6** | **0 ≠ 6** | **6 = 6** |
| `getArEventById` 覆盖 Content IDs | **部分** | **否** | **是** |

`getAllArEvents()` 总数：**8**（2 stub + 6 CH03）— 期望 **18**

### 3.5 Digital Collectible Runtime

| 检查 | CH01 | CH02 | CH03 |
|------|:----:|:----:|:----:|
| `getDigitalCollectibleById(dc_ch0x_completion_poster)` | **✗** | **✗** | **✓** |
| `getDigitalCollectibleByChapterId(id)` | **0** | **0** | **1** |
| 与 AR `digital_collectible_refs` 对齐 | **✗** | **✗** | **✓** |

`getAllDigitalCollectibles()` 总数：**6**（5 通用 DCE v2 + 1 CH03）— 缺 CH01/CH02 章成海报

---

## 4. Content → Runtime 可发现性

```text
Content Layer          MiniApp Runtime          状态
─────────────────────────────────────────────────────
CH01 L2 (5/6/5/6)  →   RC1 stub (3/3/2/2)       DRIFT
CH02 L2 (5/6/5/6)  →   未接入                    MISSING
CH03 L2 (5/6/5/6)  →   ch03-runtime-bridge      OK
```

| 章 | 五层均可发现 | 判定 |
|----|:------------:|------|
| CH01 | **否** | DRIFT — 存在但不一致 |
| CH02 | **否** | MISSING — 完全不可发现 |
| CH03 | **是** | PASS |

---

## 5. API 汇总

| API | 当前计数 | 三章 Content 期望 | 差距 |
|-----|--------:|------------------:|-----:|
| `getAllChapters()` | 2 | 3 | −1 |
| `getAllRelics()` | 9 | 18 | −9 |
| `getAllRights()` | 7 | 15 | −8 |
| `getAllArEvents()` | 8 | 18 | −10 |
| `getAllDigitalCollectibles()` | 6 | 3 章成 DC + 通用池 | CH01/CH02 DC 缺失 |

---

## 6. 根因

| # | 根因 |
|---|------|
| R1 | MiniApp 仍保留 **RC1 内联 stub**，未桥接 `data/story/chapters.json` 等 CH01 正式 L2 |
| R2 | **无 CH02 runtime bridge**（Autopilot 开放项） |
| R3 | 仅 **CH03** 实现 `apps/miniapp/services/chapter/ch03-runtime-bridge.js` 模式 |
| R4 | Root `services/*` 仅 require CH01 单章 JSON，无多章 registry |
| R5 | Digital Collectible 服务以 **DCE v2 通用池** 为主，章级 `dc_ch01/ch02_completion_poster` 未注册 |

---

## 7. 建议修复顺序（Out of Scope · 未执行）

1. **CH01 Runtime Re-bridge** — stub → `data/story/chapters.json` 等（或 `ch01-runtime-bridge.js`）  
2. **CH02 Runtime Enrichment** — 复制 CH03 bridge 模式  
3. **统一 Chapter Registry Runtime** — `getAllChapters()`  driven by `automation/chapters/registry.yaml`  
4. **DC 章级登记** — 注册 `dc_ch01_completion_poster` · `dc_ch02_completion_poster`  
5. **Root services 多章化** — 或废弃 root stub，MiniApp bridge 为唯一 Runtime  

---

## 8. 合规说明

| 项 | 结果 |
|----|:----:|
| 本审计仅只读检查 | PASS |
| 未修改 Content Layer | PASS |
| 未修改 Runtime 代码 | PASS |

---

## 9. 结论

| 问题 | 答案 |
|------|------|
| 三章是否全部可在 Runtime 调用？ | **否** — 仅 CH03 完整；CH01 漂移；CH02 缺失 |
| Content → Runtime 是否全部可发现？ | **否** |
| **`LOVEQIGU_RUNTIME_READY`** | **`NO`** |

---

`RUNTIME_CONSISTENCY_AUDIT_COMPLETE = YES`
