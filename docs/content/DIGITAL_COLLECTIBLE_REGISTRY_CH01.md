# Digital Collectible Registry — CH01

> **文件标识**：`DIGITAL_COLLECTIBLE_REGISTRY_CH01.md`  
> **版本**：V1.0  
> **日期**：2026-06-08  
> **状态**：Active · CH01 Digital Collectible 登记册  
> **层级**：L2 · Marketing / Communication Asset Registry  
> **触发**：`PRODUCT_ACCEPTANCE_REMEDIATION` B-001  
> **性质**：**传播资产登记 · 不进入 Story Progression · 不替代 Relic / Rights**

---

## §0 文件定位

本文件登记 **CH01《云间初醒》** 章级 Digital Collectible 实体。

```text
CH01 AR Event Layer（ar_ch01_completion_v1）
        ↓ digital_collectible_refs
DIGITAL_COLLECTIBLE_REGISTRY_CH01（本文件）
        ↓ user-initiated generate
分享页 / 数字藏馆（传播面 · 非信物库）
```

### 资产边界（全局）

| 是 | 不是 |
|----|------|
| Digital Collectible · 营销与传播资产 | Relic · 信物 · 故事进度资产 |
| 用户主动生成的 Share Poster | Rights · L1 Commercial 实体本身 |
| 章成后可触达的分享输出 | Story Progression 输入或输出 |
| L2 产品传播层 | 章成判定条件 · 印谱进度 · 信物持有 |

> Relic ≠ Digital Collectible。本登记册 **不得** 写入 `data/relics/*`， **不得** 影响 `data/story/chapters.json` 章成逻辑。

---

## §1 登记实体

### `dc_ch01_completion_poster`

| 字段 | 值 |
|------|-----|
| **token_id** | `dc_ch01_completion_poster` |
| **name** | 云间初醒分享海报 |
| **display_name** | 《云间初醒》章成分享海报 |
| **asset_type** | `DIGITAL_COLLECTIBLE` |
| **asset_role** | `marketing_asset` |
| **subtype** | `share_poster` |
| **language_layer** | `L2_PRODUCT_COMMUNICATION` |
| **status** | `registered` · `placeholder_pending_visual_spec` |

#### 章节上下文

| 字段 | 值 |
|------|-----|
| `chapter_id` | `ch01_cloud_awakening` |
| `chapter_code` | `CH01` |
| `chapter_title` | 云间初醒 |
| `display_title` | 《云间初醒》 |

#### 来源与触达

| 字段 | 值 |
|------|-----|
| `source_context` | CH01 completion share flow · 章成 closure 后可接续的分享流程 |
| `user_action` | `generate_share_poster` |
| `communication_role` | User-generated share poster for social distribution |
| `generation_trigger` | 用户主动 · 非自动 · 非章成必需步骤 |

#### 跨层引用（只读路由）

| 层 | 引用 ID | 关系 |
|----|---------|------|
| AR Event | `ar_ch01_completion_v1` | `digital_collectible_refs` · closure 场域可路由至分享流程 |
| Rights | `right_ch01_share_poster` | L1 分享资格 · 路由入口 · **不是** 本资产定义 |
| Story | `n5_complete` | 章成节点上下文 · **不参与** 章成判定 |
| Relic | `relic_ch01_first_awakening_seal` | 章成印记为 **独立** Story 资产 · 海报 **不写入** 信物持有库 |

#### 进度与章成影响

| 字段 | 值 |
|------|-----|
| `story_state_effect` | **`none`** |
| `relic_progression_effect` | **`none`** |
| `imprint_album_effect` | **`none`** |
| `chapter_completion_required` | **`false`** |
| `affects_章成_logic` | **`false`** |

> 章成 = Story Layer 五处觉察齐备 + 探索者主动确认。  
> 分享海报生成 **发生在章成之后**，**不是** 章成条件，**不** 改变印谱 A 或信物状态。

#### 传播内容方向（非最终视觉稿）

| 维度 | 方向 |
|------|------|
| 主题 | 初醒记念 · 觉察开启 |
| 气质 | 博物馆感 · 克制 · 记念语 |
| 禁止 | 稀有度 · 等级 · 排行榜 · 战力 · 抽卡 · 成就 |

#### Canonical Boundary

```text
Digital Collectible share poster only.
Marketing and communication asset.
Does not create, unlock, or mutate Relic state.
Does not substitute Rights redemption or ritual closure.
Does not affect chapter completion logic or imprint album A progress.
Zero Story Progression effect.
```

#### Forbidden Semantics

- `rarity` · `level` · `rank` · `grade` · `equipment`
- `achievement` · `trophy` · `loot` · `collectible_count_as_progression`
- Relic-equivalent framing · Rights-equivalent framing

---

## §2 与 CH02 对照

| 字段 | CH01 | CH02 |
|------|------|------|
| token_id | `dc_ch01_completion_poster` | `dc_ch02_completion_poster` |
| name | 云间初醒分享海报 | 山门回响分享海报 |
| chapter_id | `ch01_cloud_awakening` | `ch02_mountain_gate_echo` |
| AR ref | `ar_ch01_completion_v1` | `ar_ch02_completion_v1` |
| Rights route | `right_ch01_share_poster` | `right_ch02_share_poster` |
| story_state_effect | none | none |

---

## §3 合规声明

| 规则 | 结果 |
|------|:----:|
| Digital Collectible = Marketing Asset | PASS |
| Share Poster subtype | PASS |
| 不属于 Relic | PASS |
| 不属于 Rights | PASS |
| 不进入 Story Progression | PASS |
| 不影响章成逻辑 | PASS |
| 不新增 Lore · 不填 Canon Gap | PASS |

---

## §4 修订记录

| 版本 | 日期 | 说明 |
|------|------|------|
| V1.0 | 2026-06-08 | 首版：登记 `dc_ch01_completion_poster` · 关闭 B-001 |

---

## 关联文档

| 文档 | 关系 |
|------|------|
| [`LOVEQIGU_CONTENT_CANON_V1.md`](LOVEQIGU_CONTENT_CANON_V1.md) | 章节方向上位 |
| [`DIGITAL_COLLECTIBLE_REGISTRY_CH02.md`](DIGITAL_COLLECTIBLE_REGISTRY_CH02.md) | 同级登记结构参照 |
| `data/ar/ar-events.json` | AR 引用源 |
| `data/rights/rights.json` | L1 分享路由 |
| `CONTENT_ENGINE/TOKEN_LIBRARY/digital_collectibles_v1.yaml` | YAML 库同步源 |

---

`DIGITAL_COLLECTIBLE_REGISTRY_CH01_COMPLETE = YES`
