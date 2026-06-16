# DUAL_HOME_RUNTIME_VALIDATION_V1 — REPORT

**Mission:** 88 · DUAL_HOME_RUNTIME_VALIDATION_V1  
**Generated:** 2026-06-08  
**Upstream:**

- [`docs/product/dual_home/DUAL_HOME_RUNTIME_MAPPING_V1.md`](product/dual_home/DUAL_HOME_RUNTIME_MAPPING_V1.md)
- [`docs/DUAL_HOME_IMPLEMENTATION_V1_REPORT.md`](DUAL_HOME_IMPLEMENTATION_V1_REPORT.md)

---

## Verdict

**DUAL_HOME_RUNTIME_VALIDATION_PASS = YES**

**DUAL_HOME_RUNTIME_READY = YES**

| Metric | Count |
|--------|------:|
| Checks passed | 59 |
| Warnings | 1 |
| Failures | 0 |

---

## 1. Home Shell Runtime

| Check | Result |
|-------|:------:|
| Single route `pages/index/index` | PASS |
| Five mode components registered | PASS |
| Policy service + config JSON | PASS |
| `buildShellData` explore/affinity/campaign | PASS |

## 2. Runtime Mapping (V1)

| Mode | Module | Runtime Source | Status |
|------|--------|----------------|:------:|
| Explore | 当前章节 | `story-service` | PASS |
| Explore | 最近获得 | `relic-service` | PASS |
| Explore | 故事档案 | route → story-archive | PASS |
| Affinity | 活动中心 | `campaign-service` (count) | PASS |
| Affinity | 我的权益 | `rights-service` | WARN · panel 未直接绑定 |
| Affinity | 下次活动 | route → next-activity | PASS |
| Campaign | 活动预留 | `campaign_override` policy | PASS |

## 3. Policy Resolution

| Scenario | Expected | Result |
|----------|----------|:------:|
| `forced_mode: explore` | explore | PASS |
| `source: rights` | affinity | PASS |
| `source: story` | explore | PASS |
| `campaign_override: null` | tab hidden | PASS |

## 4. Navigation Registry

| Route | Registered |
|-------|:----------:|
| `/pages/campaign-closure/index` | PASS |
| `/pages/explore-map/index` | PASS |
| `/pages/next-activity/index` | PASS |
| `/pages/relic-archive/index` | PASS |
| `/pages/rights-center/index` | PASS |
| `/pages/story-archive/index` | PASS |

## 5. Repo Runtime Gate

| Gate | Result |
|------|:------:|
| `runtime-alignment-check` | YES |
| Bridge chapters (current) | 3 |
| Bridge relics | 18 |
| Bridge rights | 15 |

## 6. Warnings

- affinity panel does not yet surface rights-service data (mapping: RightsPanel)

## 7. Failures

**None.**

## 8. Compliance

| Rule | Result |
|------|:------:|
| 只读验证 · 未修改 CH01–CH07 data | PASS |
| 未修改 Canon | PASS |
| 未修改 Autopilot Pipeline | PASS |
| 单 Home Shell · 无双首页 | PASS |

## 9. Risks / Follow-ups

| ID | Item |
|----|------|
| R-001 | Runtime bridge 仍为 CH01–CH03 · Explore「当前章节」≠ CH07 active |
| R-002 | Affinity 未直接渲染 `rights-service` 列表 |
| R-003 | `campaign_feed.json` 映射文档 vs 当前 `campaign-service` 内联数据 |
| R-004 | 真机 `wx.storage` 模式记忆未在本脚本覆盖 |

---

`DUAL_HOME_RUNTIME_VALIDATION_V1_COMPLETE = YES`
