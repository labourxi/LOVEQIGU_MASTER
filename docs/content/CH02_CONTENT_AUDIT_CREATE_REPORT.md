# CH02 CONTENT AUDIT — CREATE_REPORT

**Mission:** CH02_CONTENT_AUDIT  
**Generated:** 2026-06-08  
**Scope:** CH02 four-layer JSON  
**Upstream:** [`CH02_CONTENT_CANON_V1.md`](CH02_CONTENT_CANON_V1.md)

---

## Verdict

## **`PASS_WITH_WARNING`**

| Metric | Count |
|--------|------:|
| Checks passed | 37 |
| Warnings | 3 |
| Failures | 0 |

---

## 1. JSON 结构完整性

| File | JSON Valid | Schema | Layer Fields | Status |
|------|:----------:|:------:|:------------:|:------:|
| `data/story/ch02_chapters.json` | PASS | `loveqigu.story.chapters.v1` | chapter shell + 5 nodes | **PASS** |
| `data/relics/ch02_relics.json` | PASS | `loveqigu.relics.v1` | 6 relics + asset_boundary | **PASS** |
| `data/rights/ch02_rights.json` | PASS | `loveqigu.rights.v1` | 5 rights + relic_refs_all | **PASS** |
| `data/ar/ch02_ar-events.json` | PASS | `loveqigu.ar.events.v1` | 6 events + asset_boundary | **PASS** |

### Story 结构检查

| Check | Result |
|-------|:------:|
| Chapter ID `ch02_mountain_gate_echo` | PASS |
| 五处觉察 `total: 5` | PASS |
| 印谱 B · `total_slots: 5` | PASS |
| 节点序列 1–5 连续 | PASS |
| 章成字段齐备 (`completion_mark` / `relic_ref` / `memorial`) | PASS |
| `previous_chapter: ch01_cloud_awakening` | PASS |

### 工厂对齐（CH01 exemplar）

| 维度 | CH01 | CH02 | Result |
|------|:----:|:----:|:------:|
| 节点数 | 5 | 5 | PASS |
| 信物数 | 6 | 6 | PASS |
| AR 事件数 | 6 | 6 | PASS |
| 权益数 | 5 | 5 | PASS |
| n1 双信物 + 双 AR | ✓ | ✓ | PASS |
| n4 practice · 无 rights AR | ✓ | ✓ | PASS |
| n5 locked + unlock_requires | ✓ | ✓ | PASS |

---

## 2. 跨层引用一致性

| Check | Result |
|-------|:------:|
| Story → Relic 全部 `relic_refs` 可解析 | PASS |
| Story → AR 全部 `ar_event_refs` 可解析 | PASS |
| Relic ↔ Story 双向引用一致 | PASS |
| AR ↔ Story 双向引用一致 | PASS |
| AR → Relic `relic_refs` 可解析 | PASS |
| AR → Rights `rights_refs` 可解析 | PASS |
| `completion_mark_relic_ref` → `relic_ch02_mountain_echo_seal` | PASS |
| `rights.relic_refs_all` = 全部 6 信物 | PASS |
| 各 right `relic_refs` 覆盖完整信物集 | PASS |
| 无 orphan relic | PASS |
| 无 orphan AR event | PASS |
| 章成 memorial 与 seal relic 字段对齐 | PASS |

### 引用矩阵

| Node | Relics | AR Events |
|------|--------|-----------|
| `n1_threshold` | 2 | 2 |
| `n2_mirror` | 1 | 1 |
| `n3_human_echo` | 1 | 1 |
| `n4_practice_echo` | 1 | 1 |
| `n5_complete` | 1 | 1 |

---

## 3. Canon 遵守

| Rule | Evidence | Result |
|------|----------|:------:|
| 核心觉察：连接的回响 · 记存与辨认 | 节点/信物 copy 对齐第四律、第十一律 | PASS |
| 山门 = L2 阈值称呼 · 非新地理 · 非云门本体 | `canonical_boundary` + AR copy 明确 | PASS |
| 独立印谱 B · 不跨章合并 | `album_code: B` · 残印·乙 | PASS |
| 复制 CH01 工厂 · 无世界观续集 | 同 location_ref 复用 · 无新历史 | PASS |
| 信物 = 故事进度资产 | 全部 `asset_class: story_progression` | PASS |
| 禁止稀有度/等级/装备语义 | 全部 `forbidden_semantics` 齐备 | PASS |
| AR 不创造云门 · 预览优先 | 全部 `camera_enabled: false` | PASS |
| n4 修习位无 L1 权益弹窗 | `ar_ch02_echo_guide_v1` rights_refs 为空 | PASS |
| 不新增 Lore / 不填 Canon Gap | 仅复用已登记场域与产品结构 | PASS |

### 术语扫描

| 禁止词 | 结果 |
|--------|:------:|
| 打卡 · 成就 · 升级 · 抽卡 · 积分商城 | 未出现 |
| 归真 · 回应 · 祝由 · 愿力 | 未出现 |
| `等级` | 仅出现于否定语境「见证连接而非等级」 |

---

## 4. 资产边界检查

### Relic Layer

| Check | Result |
|-------|:------:|
| Relic ≠ Digital Collectible 边界声明 | PASS |
| 无 rarity / level / rank / equipment 字段 | PASS |
| 全部 L2 · story_progression | PASS |
| 章成印记 `completion_mark: true` 仅 n5 seal | PASS |

### Rights Layer

| Check | Result |
|-------|:------:|
| L1 层 · `language_layer: L1_COMMERCIAL` | PASS |
| 权益不伪装章成奖励 | PASS |
| 结缘礼与仪式链分离 | PASS |
| `redemption.enabled: false`（占位） | PASS |

### AR Event Layer

| Check | Result |
|-------|:------:|
| 场域预览 · closure 入口职责 | PASS |
| L1 rights 仅挂 n3 / n5 completion | PASS |
| 修习位 AR 无 rights_refs | PASS |

### Digital Collectible 边界

| Check | Result |
|-------|:------:|
| DC ref 仅出现于章成 AR | PASS |
| DC 不写入信物持有库（copy 声明） | PASS |
| **`dc_ch02_completion_poster` 实体未登记** | **WARN** |

---

## 5. Warnings

| ID | Severity | Finding |
|----|----------|---------|
| W-001 | Low | `dc_ch02_completion_poster` 被 `ar_ch02_completion_v1` 引用，但 repo 内无 Digital Collectible 实体登记（与 CH01 `dc_ch01_completion_poster` 同类已知缺口） |
| W-002 | Low | CH01 `data/story/chapters.json` 的 `next_chapter` 仍为 `TBD`，上游 CH01→CH02 接线未完成 |
| W-003 | Info | CH02 `next_chapter: TBD` — CH03+ Canon 未述 · 符合 Canon 暂停边界 |

**Warnings 不构成 FAIL** — 四层 JSON 内部引用完整，Canon 边界合规。

---

## 6. Failures

**None.**

---

## 7. Recommended Follow-ups（Out of Scope）

1. 登记 `dc_ch02_completion_poster` 于 Digital Collectible 层  
2. 更新 CH01 `next_chapter` → `ch02_mountain_gate_echo`  
3. MiniApp / services 加载 `ch02_*` 运行时桥接  

---

`CH02_CONTENT_AUDIT_COMPLETE = YES`
