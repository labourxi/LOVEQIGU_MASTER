# CH01–CH03 Product Acceptance Report

**Mission:** 44 · CONTENT_PRODUCT_ACCEPTANCE  
**Generated:** 2026-06-08  
**Scope:** CH01 · CH02 · CH03 — Content Layer（Story · Relic · Rights · AR · Digital Collectible Registry）  
**Method:** 只读核查 · 交叉引用验证 · 资产边界审查 · 章间连贯性审查

---

## Verdict

## **`PRODUCT_ACCEPTANCE_CH01_03 = NO`**

三章 **Story / Relic / Rights / AR** 五层工厂结构（5/6/5/6）完整且交叉引用一致；**信物 / 权益 / AR / Digital Collectible 边界合规**。  
**未通过项：** CH01 缺正式 DC 登记册 MD；CH02/CH03 `next_chapter` 仍为 `TBD`；CH01 文件命名与 DC 元数据存在标题漂移。

---

## 1. 输入文件映射

用户输入路径与实际 repo 路径对照：

| 章 | Story | Relic | Rights | AR | DC Registry |
|----|-------|-------|--------|-----|-------------|
| CH01 | `data/story/chapters.json` ⚠ | `data/relics/relics.json` ⚠ | `data/rights/rights.json` ⚠ | `data/ar/ar-events.json` ⚠ | **`docs/content/DIGITAL_COLLECTIBLE_REGISTRY_CH01.md` ✗ 不存在** |
| CH02 | `data/story/ch02_chapters.json` ✓ | `data/relics/ch02_relics.json` ✓ | `data/rights/ch02_rights.json` ✓ | `data/ar/ch02_ar-events.json` ✓ | `docs/content/DIGITAL_COLLECTIBLE_REGISTRY_CH02.md` ✓ |
| CH03 | `data/story/ch03_chapters.json` ✓ | `data/relics/ch03_relics.json` ✓ | `data/rights/ch03_rights.json` ✓ | `data/ar/ch03_ar-events.json` ✓ | `docs/content/DIGITAL_COLLECTIBLE_REGISTRY_CH03.md` ✓ |

> ⚠ CH01 沿用 RC1 命名（无 `ch01_` 前缀），与 CH02/CH03 命名约定不一致，不影响内容完整性，但影响批量工具路径预期。

---

## 2. 工厂结构完整性

| 章 | 标题 | Story 节点 | Relic | Rights | AR | 工厂 5/6/5/6 |
|----|------|----------:|------:|-------:|---:|:------------:|
| CH01 | 云间初醒 | 5 | 6 | 5 | 6 | **PASS** |
| CH02 | 山门回响 | 5 | 6 | 5 | 6 | **PASS** |
| CH03 | 再度重逢 | 5 | 6 | 5 | 6 | **PASS** |

### 2.1 节点结构（三章同构）

| 序号 | 节点类型 | CH01 | CH02 | CH03 |
|------|----------|------|------|------|
| 1 | exploration（门阈/场域 + 双 AR） | n1_gate | n1_threshold | n1_reunion |
| 2 | exploration（镜/照见） | n2_plaza | n2_mirror | n2_remember |
| 3 | exploration（谷里咖啡·人间） | n3_cafe | n3_human_echo | n3_human_reunion |
| 4 | practice（云间书符·祝禁/修习） | n4_zhuyou | n4_practice_echo | n4_practice_reunion |
| 5 | chapter_completion（章成·locked） | n5_complete | n5_complete | n5_complete |

- 五处觉察结构（`awareness_structure.total = 5`）三章一致  
- 印谱槽位（`imprint_album.total_slots = 5`）三章一致  
- 章成节点 `unlock_requires` 均覆盖前 4 节点  
- `completion.completion_mark_relic_ref` 与 n5 `relic_refs` 三章对齐  

### 2.2 印谱专辑独立性

| 章 | album_code | 残印命名 |
|----|:----------:|----------|
| CH01 | （未声明） | 云门残印·甲 |
| CH02 | B | 山门残印·乙 |
| CH03 | C | 重逢残印·丙 |

CH01 缺 `album_code` 字段（CH02/CH03 已声明 B/C）— **低优先级结构不一致**，不阻断单章内容完整性。

---

## 3. 交叉引用验证

**验证脚本：** `scripts/audit/content-product-acceptance-check.js`

| 检查项 | CH01 | CH02 | CH03 |
|--------|:----:|:----:|:----:|
| Story node → Relic | PASS | PASS | PASS |
| Story node → AR | PASS | PASS | PASS |
| AR → Relic | PASS | PASS | PASS |
| AR → Rights | PASS | PASS | PASS |
| AR → node_id 存在 | PASS | PASS | PASS |
| Rights → Relic | PASS | PASS | PASS |
| completion_mark_relic_ref | PASS | PASS | PASS |
| completion AR → DC token | PASS | PASS | PASS |
| completion AR → share_right | PASS | PASS | PASS |

**交叉引用错误数：0**

---

## 4. 资产边界验证

### 4.1 Relic（信物）— Story Progression

| 规则 | CH01 | CH02 | CH03 |
|------|:----:|:----:|:----:|
| `asset_class = story_progression` | PASS | PASS | PASS |
| 无 `dc_*` token 写入 relics JSON | PASS | PASS | PASS |
| `asset_boundary.rule` 声明 Relic ≠ DC | PASS | PASS | PASS |
| `forbidden_semantics` 含 rarity/level/rank 等 | PASS | PASS | PASS |
| 章成印记 `completion_mark: true` 仅 completion relic | PASS | PASS | PASS |

### 4.2 Rights（权益）— L1 Commercial

| 规则 | CH01 | CH02 | CH03 |
|------|:----:|:----:|:----:|
| `layer = L1` · `language_layer = L1_COMMERCIAL` | PASS | PASS | PASS |
| 不写入 Story 节点 `rights_refs`（仪式链外） | PASS | PASS | PASS |
| L1 结缘礼仅经 AR 触达（n3 人间节点 / n5 章成） | PASS | PASS | PASS |
| `right_*_share_poster` 声明零 Relic 进度影响 | PASS | PASS | PASS |
| `asset_boundary` 声明 Rights 不 mutate Relic | PASS | PASS | PASS |

### 4.3 AR Event — L2 Product Field

| 规则 | CH01 | CH02 | CH03 |
|------|:----:|:----:|:----:|
| `digital_collectible_refs` 仅出现在 completion AR | PASS | PASS | PASS |
| DC ref 不在 Relic / Rights JSON 实体层 | PASS | PASS | PASS |
| 人间节点 AR 引用 L1 拿铁券（仪式链外） | PASS | PASS | PASS |
| 修习节点 AR 无 L1 rights popup | PASS | PASS | PASS |
| `asset_boundary.digital_collectible` 声明零进度影响 | PASS | PASS | PASS |

### 4.4 Digital Collectible — Marketing / Communication

| 规则 | CH01 | CH02 | CH03 |
|------|:----:|:----:|:----:|
| AR completion 引用 `dc_ch0x_completion_poster` | PASS | PASS | PASS |
| 正式 Registry MD 存在 | **FAIL** | PASS | PASS |
| Registry 声明 `story_state_effect: none` | N/A | PASS | PASS |
| 不写入 `data/relics/*` | PASS | PASS | PASS |

**DC 引用仅存在于 AR 层（符合边界）：**

```text
data/ar/ar-events.json          → dc_ch01_completion_poster
data/ar/ch02_ar-events.json     → dc_ch02_completion_poster
data/ar/ch03_ar-events.json     → dc_ch03_completion_poster
```

---

## 5. 章间连贯性

| 链接 | 期望 | 实际 | 判定 |
|------|------|------|:----:|
| CH01 → CH02 | `next_chapter: ch02_mountain_gate_echo` | ✓ 已接线 | PASS |
| CH02 ← CH01 | `previous_chapter: ch01_cloud_awakening` | ✓ | PASS |
| CH03 ← CH02 | `previous_chapter: ch02_mountain_gate_echo` | ✓ | PASS |
| CH02 → CH03 | 应指向 `ch03_field_reunion` | **`next_chapter: TBD`** | **GAP** |
| CH03 → 下一章 | 待定 | **`next_chapter: TBD`** | **GAP**（预期） |

### 叙事主题递进（L2 产品层）

| 章 | 主题轴 | Canon 边界声明 |
|----|--------|----------------|
| CH01 | 初醒 · 五处觉察 | 无新 Lore |
| CH02 | 回响 · 第四法则对齐 | 无新 Cosmology |
| CH03 | 重逢 · 第三法则对齐 | 无新 Cosmology |

三章共享场域引用（`loc_gate_entry` · `loc_central_plaza` · `loc_cafe_human_field` · `loc_zhujin_entry`）一致，符合「同场域、不同觉察轴」的产品设计，未引入新地理或文明。

---

## 6. 术语合规

对 `data/story/*` · `data/relics/*` · `data/rights/*` · `data/ar/*` 扫描禁用替换项：

| 禁用项 | 扫描结果 |
|--------|:--------:|
| 打卡地图 | 未出现 |
| 积分商城 | 未出现 |
| 愿力 | 未出现（Rights 使用「心愿值」） |
| 归真 | 未出现 |
| 回应 | 未出现 |
| 祝由 | 未出现（Story/AR 使用「祝禁」） |

**L2 JSON Content Layer 术语：PASS**

### 6.1 标题漂移（登记层 · 非 JSON Content）

| 位置 | 文本 | 问题 |
|------|------|------|
| `CONTENT_ENGINE/TOKEN_LIBRARY/digital_collectibles_v1.yaml` | 云**门**初醒分享海报 | 与 Story 标题「云**间**初醒」不一致 |
| `DIGITAL_COLLECTIBLE_REGISTRY_CH02.md` §2 对照表 | CH01 name = 云**门**初醒分享海报 | 同上 · 登记文档漂移 |

> 漂移位于 YAML / Registry 文档，**不在** `data/*` JSON Story Content 内。验收标记为 **W-002 标题漂移**，建议后续登记册对齐时修正（本次不修改内容）。

---

## 7. 未通过项与警告

### 7.1 Blockers（阻断 PRODUCT_ACCEPTANCE）

| ID | 章 | 严重度 | 描述 |
|----|-----|:------:|------|
| **B-001** | CH01 | Blocker | **`docs/content/DIGITAL_COLLECTIBLE_REGISTRY_CH01.md` 不存在** — AR `ar_ch01_completion_v1` 已引用 `dc_ch01_completion_poster`，但无与 CH02/CH03 同级的 L2 DC 登记册；仅 `CONTENT_ENGINE/TOKEN_LIBRARY/digital_collectibles_v1.yaml` 有占位条目 |

### 7.2 Warnings（不单独阻断，但影响「完整连贯」判定）

| ID | 章 | 严重度 | 描述 |
|----|-----|:------:|------|
| W-001 | CH02 | Warning | `next_chapter: TBD` — 未显式接线至 CH03（尽管 CH03 `previous_chapter` 已指向 CH02） |
| W-002 | CH01 | Warning | DC YAML / CH02 Registry 对照表使用「云门初醒」而非正式「云间初醒」 |
| W-003 | CH01 | Warning | 文件命名无 `ch01_` 前缀，与 CH02/CH03 批量路径约定不一致 |
| W-004 | CH01 | Warning | `imprint_album` 缺 `album_code`（CH02=B · CH03=C 已声明） |

---

## 8. 分章验收摘要

| 章 | 5/6/5/6 | 交叉引用 | 资产边界 | DC 登记 | 章间连贯 | 分章判定 |
|----|:-------:|:--------:|:--------:|:-------:|:--------:|:--------:|
| CH01 | PASS | PASS | PASS | **FAIL** | PASS（→CH02） | **CONDITIONAL** |
| CH02 | PASS | PASS | PASS | PASS | PARTIAL（←CH01 ✓ · →TBD） | **CONDITIONAL** |
| CH03 | PASS | PASS | PASS | PASS | PARTIAL（←CH02 ✓ · →TBD） | **CONDITIONAL** |

---

## 9. 合规声明

| 项 | 结果 |
|----|:----:|
| 本验收仅只读检查 | PASS |
| 未修改 Canon | PASS |
| 未修改 Story Content（`data/*` JSON） | PASS |
| 未修改 JS / Runtime | PASS |
| Relic ≠ Digital Collectible 边界 | PASS |
| L1 Rights 与 L3 Ritual 链分离 | PASS |

---

## 10. 关闭 PRODUCT_ACCEPTANCE 的建议（Out of Scope · 未执行）

1. **创建 `DIGITAL_COLLECTIBLE_REGISTRY_CH01.md`** — 对齐 CH02/CH03 登记结构；修正 DC 名称为「云间初醒分享海报」  
2. **CH02 `next_chapter`** — 接线 `ch03_field_reunion`（Story Content 变更 · 需单独 Content Mission）  
3. **CH01 文件命名统一** — 可选 `ch01_*` 别名或 registry 路径映射  
4. **CH01 `imprint_album.album_code: A`** — 与 B/C 结构对齐  

---

## 11. 结论

| 问题 | 答案 |
|------|------|
| 三章 Content 工厂 5/6/5/6 是否完整？ | **是** |
| 交叉引用是否一致？ | **是** |
| 信物 / 权益 / AR / DC 边界是否合规？ | **是**（DC 仅 CH01 登记册缺失） |
| 章间连贯性是否完整？ | **部分** — CH01→CH02 已通；CH02→CH03 未在 CH02 story 显式声明 |
| **`PRODUCT_ACCEPTANCE_CH01_03`** | **`NO`** |

**阻断根因：** B-001 — CH01 Digital Collectible 正式登记册缺失。

---

`CONTENT_PRODUCT_ACCEPTANCE_COMPLETE = YES`
