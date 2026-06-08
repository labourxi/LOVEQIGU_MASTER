# 违规字段统计

统计依据：`scripts/governance/check_content_engine.js` 的大小写敏感逐行扫描规则。

| 字段 | 次数 | 说明 |
|---|---:|---|
| `rarity` | 38 | 主要出现在 `not_applicable` 或边界说明中，但字段本身仍会引入稀缺、收藏、排序联想。 |
| `reward` | 39 | 主要出现在 Atom、AR Event、模板和说明字段中，容易把 L1/L2 产品结果误读为 L3 仪式收益。 |
| `wish_value` | 32 | 当前多为 `0`，但仍把账户数值字段带入故事、仪式或世界观内容结构。 |
| `level` | 6 | 多数为否定边界语句，但词面仍触发升级、层级或能力证明联想。 |
| `rank` | 2 | 出现在边界说明中，仍需避免排序、优劣或身份高低语义。 |
| `grade` | 0 | 当前未出现。 |
| `tier` | 0 | 当前未出现。 |

总计：117。

# 文件统计

| 文件分类 | 次数 | 风险说明 |
|---|---:|---|
| `ATOM_LIBRARY` | 69 | Atom 是内容生成基础单元，`reward`、`wish_value`、`rarity` 高密度出现会放大后续内容继承风险。 |
| `TOKEN_LIBRARY` | 13 | 主要集中在 Relic / 信物相关 token，需严格保持“故事进展资产”定义，避免被理解为营销收藏或等级凭证。 |
| `COLLECTIBLE_LIBRARY` | 7 | Digital Collectible 可作为传播资产，但不应承担故事推进、稀缺排序或权益证明语义。 |
| `AR_EVENT_LIBRARY` | 25 | AR Event 与用户行为和场景触发相关，`reward`、`wish_value` 容易混入产品奖励或账户数值语言。 |

补充统计：根目录模板中另有 3 次，分别为 `COLLECTIBLE_TEMPLATE.yaml` 2 次、`TOKEN_TEMPLATE.yaml` 1 次。四个库合计 114 次，根目录模板 3 次，共 117 次。

# 风险等级

## high risk

- `reward` 出现在 Atom 与 AR Event 中：高风险。建议改为 `result`、`outcome` 或 `record_result`，并按语言层分别约束，不把 L1/L2 产品结果写成 L3 仪式收益。
- `wish_value` 出现在故事、仪式、AR Event 结构中：高风险。建议从 L3 内容结构移除；如确需账户字段，仅在 L1/L2 账务或产品记录中使用 `wish_value_delta`，并与心愿值账户模型绑定。
- `rarity` 出现在 Relic / 信物或 Atom 结构中：高风险。建议移除；如需展示分组，使用 `display_group` 或 `archive_group`，不得表达稀缺、强弱、等级或优劣。

## medium risk

- `level` 与 `rank` 出现在否定边界说明中：中风险。语义意图是合规的，但扫描器按词面治理。建议改写为“不作为优劣凭证”“不作为身份高低依据”等不含治理字段的边界语句。
- 根目录模板中的 `reward`：中风险。当前用于禁止性说明，但模板会影响未来内容生成。建议改为 `game_mechanic_framing` 或直接描述“不得使用游戏化收益措辞”。
- Digital Collectible 相关 `rarity`：中风险。Digital Collectible 是传播资产，不等同于 Relic / 信物。建议使用 `communication_group`、`campaign_group` 或 `presentation_group`，避免稀缺和排序。

## low risk

- `rarity: not_applicable` 与 `wish_value: 0`：低即时风险。当前值已被中和，但字段仍会在复制和扩展时制造治理负担，建议后续清理。
- `grade` 与 `tier`：低风险。当前计数为 0，后续只需保持规则监控。

# 修复建议

- 先处理 `ATOM_LIBRARY`，因为该分类占 69 次，是后续内容继承的主要风险源。
- 再处理 `AR_EVENT_LIBRARY`，优先移除或替换 `reward` 与 `wish_value`。
- Relic / 信物只保留故事进展与 Canon 驱动语义，不使用 `rarity`、`rank`、`level`。
- Digital Collectible 只保留传播和营销资产语义，不绑定故事推进，也不与 Relic / 信物混用。
- 模板中的否定说明也应避开治理字段，避免新内容复制出同类违规字段。

本报告仅分析与建议，未修改 `CONTENT_ENGINE` 现有内容。

GOVERNANCE_117_ANALYSIS_COMPLETE = YES
