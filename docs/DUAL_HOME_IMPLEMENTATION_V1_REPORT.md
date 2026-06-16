# DUAL_HOME_IMPLEMENTATION_V1 — REPORT

**Mission:** 77 · DUAL_HOME_IMPLEMENTATION_V1  
**Generated:** 2026-06-08  
**Upstream:**

- [`docs/DUAL_HOME_PRODUCT_ARCHITECTURE_V1.md`](DUAL_HOME_PRODUCT_ARCHITECTURE_V1.md)
- [`docs/product/dual_home/DUAL_HOME_VISUAL_SYSTEM_V1.md`](product/dual_home/DUAL_HOME_VISUAL_SYSTEM_V1.md)

> 注：仓库内 `DUAL_HOME_ARCHITECTURE_V1_1` 与 `DUAL_HOME_UI_WIREFRAME_V1` 独立文件尚未落盘；实现依据上述 Architecture V1 + Visual System V1 对齐。

---

## Verdict

**`DUAL_HOME_IMPLEMENTATION_V1_COMPLETE = YES`**

**单 Home Shell · 双模式切换 · Campaign 预留 · 未改 CH01–CH06 Runtime / Canon / Autopilot**

**Re-verified:** 2026-06-08 · 实现已落盘 · `home-policy.v1.json` 已接线至 `getPolicy()`

---

## 1. 架构实现摘要

| 要求 | 实现 |
|------|------|
| 保留单 Home Shell | ✅ `pages/index/index` 仍为唯一首页路由 |
| Explore Mode | ✅ `explore-home-panel` |
| Affinity Mode | ✅ `affinity-home-panel` |
| Campaign Mode 预留 | ✅ `campaign-home-panel` + `campaign-mode-banner` |
| 顶部切换 探索｜结缘 | ✅ `home-mode-switch` |
| Admin 字段预留 | ✅ `home-policy-service` + `config/home-policy.v1.json` |

---

## 2. 已创建页面

| 页面 | 路径 | 说明 |
|------|------|------|
| Home Shell（改造） | `apps/miniapp/pages/index/index` | 唯一物理首页，内嵌双模式 |

**未新增独立首页路由** — `app.json` 首页仍为 `pages/index/index`。

---

## 3. 已创建组件

| 组件 | 路径 | 职责 |
|------|------|------|
| `home-mode-switch` | `components/home-mode-switch/` | 探索｜结缘｜活动（条件显示）切换 |
| `explore-home-panel` | `components/explore-home-panel/` | 探索模式占位 |
| `affinity-home-panel` | `components/affinity-home-panel/` | 结缘模式占位 |
| `campaign-mode-banner` | `components/campaign-mode-banner/` | 活动模式顶栏预留 |
| `campaign-home-panel` | `components/campaign-home-panel/` | 活动模式内容预留 |

---

## 4. 已创建服务

| 服务 | 路径 | 职责 |
|------|------|------|
| `home-policy-service` | `services/home/home-policy-service.js` | 模式解析 · 持久化 · Admin 字段 |
| `home-shell-service` | `services/home/home-shell-service.js` | 只读组装 Explore / Affinity 占位数据 |

### Admin 预留字段

| 字段 | 位置 | 当前值 |
|------|------|--------|
| `home_policy` | policy service / config | `dual_home_v1` |
| `default_mode` | policy service / config | `explore` |
| `forced_mode` | policy service / config | `null` |
| `campaign_override` | policy service / config | `null` |
| `experiment_group` | policy service / config | `null` |

本地持久化：`dual_home_last_mode`（探索 / 结缘）

---

## 5. 已修改路由

| 文件 | 变更 |
|------|------|
| `apps/miniapp/app.json` | **未改** — 仍仅一个首页入口 |
| `pages/index/index.*` | **改造**为 Dual Home Shell |

### Explore Mode 占位区块

| 区块 | 跳转 |
|------|------|
| 当前章节 | 内嵌卡片 + Runtime 只读 |
| 探索地图 | `/pages/explore-map/index` |
| 最近获得 | 信物列表占位 → `/pages/relic-archive/index` |
| 故事档案 | `/pages/story-archive/index` |
| 主按钮 | 继续探索 → 探索地图 |

### Affinity Mode 占位区块

| 区块 | 跳转 |
|------|------|
| 本期推荐 | `/pages/rights-center/index` |
| 我的权益 | `/pages/rights-center/index` |
| 活动中心 | `/pages/campaign-closure/index` |
| 下次活动 | `/pages/next-activity/index` |
| 主按钮 | 查看权益 → 权益中心 |

---

## 6. 新增状态管理

| 状态 | 存储 | 说明 |
|------|------|------|
| `activeMode` | Page `data` | `explore` · `affinity` · `campaign` |
| `policy` | Page `data` | Admin policy 对象 |
| `showCampaignTab` | Page `data` | `campaign_override` 非空时显示活动 Tab |
| `dual_home_last_mode` | `wx.storage` | 回访用户模式记忆 |
| `explore` / `affinity` / `campaign` | Page `data` | Shell 占位 payload |

模式解析顺序：`forced_mode` → query/source → last mode → `default_mode`

---

## 7. 合规边界

| 规则 | 结果 |
|------|:----:|
| 未修改 CH01–CH06 Runtime bridges | PASS |
| 未修改 `data/story|relics|rights|ar/*` | PASS |
| 未修改 Canon | PASS |
| 未修改 Autopilot Pipeline | PASS |
| 术语：探索地图 / 权益中心 / 结缘 | PASS |
| 禁止积分商城 / 打卡地图文案 | PASS |
| Relic ≠ Digital Collectible 边界声明保留 | PASS |

---

## 8. 未完成事项

1. **远程 Admin 下发** — 本地 `config/home-policy.v1.json` 已接线；Live Ops / Admin API 待接  
2. **Campaign Mode 完整 UI** — 仅预留 Tab + Banner + Panel；需 `campaign_override` 结构与主题资产  
3. **首次进入双选引导** — Architecture 建议的 ambiguous source 双选层尚未实现  
4. **底部统一导航** — Visual System 要求「首页 / 地图 / 我的」TabBar，当前仍用页面内跳转  
5. **KPI 埋点** — 继续探索率 / 权益查看率等未接入  
6. **A/B `experiment_group`** — 字段已预留，分流逻辑未实现  
7. **DUAL_HOME_ARCHITECTURE_V1_1 / WIREFRAME 落盘** — 上游文档待同步至 repo

---

## 9. 风险项

| ID | 风险 | 严重度 | 缓解 |
|----|------|:------:|------|
| R-001 | Runtime 仅桥接 CH01–CH03，Explore「当前章节」可能显示最后一章而非用户真实进度 | 中 | 后续 Runtime Bridge 扩展 CH04–CH06，不改 Canon |
| R-002 | `campaign_override` 未接后台，活动 Tab 默认不可见，易遗漏联调 | 低 | Admin 接好后以 sandbox 验收 |
| R-003 | 模式记忆与 deep link 优先级需在真机回归 | 中 | 补充 query `?mode=affinity&source=rights` 测试用例 |
| R-004 | 无 TabBar 时「地图 / 我的」入口分散在各子页 | 低 | V1.1 统一底栏 |
| R-005 | Affinity 区块多个入口指向同一权益页，可能显得重复 | 低 | 待 Wireframe 细化差异化卡片 |

---

## 10. 文件清单

```
apps/miniapp/
  config/home-policy.v1.json
  services/home/home-policy-service.js
  services/home/home-shell-service.js
  components/home-mode-switch/
  components/explore-home-panel/
  components/affinity-home-panel/
  components/campaign-mode-banner/
  components/campaign-home-panel/
  pages/index/index.js|wxml|wxss|json  (modified)
```

---

**`DUAL_HOME_IMPLEMENTATION_V1_COMPLETE = YES`**
