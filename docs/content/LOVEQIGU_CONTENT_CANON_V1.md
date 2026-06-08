# LOVEQIGU Content Canon V1

> **《爱企谷 · 内容圣经 V1》**  
> **文件标识**：`LOVEQIGU_CONTENT_CANON_V1.md`  
> **版本**：V1.0  
> **日期**：2026-06-07  
> **状态**：Active · Content Engine 上游依据  
> **层级**：L1.5 · Content Canon（内容正典）  
> **性质**：**不新增世界规则 · 不填补 Canon Gap · 不创作历史**  

---

## §0 文件定位

### 0.1 本文件回答什么

本文件定义 **LOVEQIGU 内容引擎的核心驱动力**。

它把 L0 正典与 L1 世界圣经，转译为 Content Engine 各层 **唯一允许的上游依据**：

```text
L0   LOVEQIGU_WORLD_RULES_CANON_V1        世界法则（冻结 · 只读）
L0.5 CANON_GAP_REGISTRY                    空白边界
L1   LOVEQIGU_WORLD_BIBLE_V1              历史索引（Skeleton）
L1.5 LOVEQIGU_CONTENT_CANON_V1（本文件）  内容驱动力 · 四层边界
        ↓
L2   Story Layer · Relic Layer · Rights Layer · AR Event Layer
        ↓
     Content Engine YAML · Story Engine · Live Ops Engine · MiniApp 内容桥接
```

### 0.2 上位依据

| 文档 | 角色 |
|------|------|
| [`LOVEQIGU_WORLD_RULES_CANON_V1.md`](../canon/LOVEQIGU_WORLD_RULES_CANON_V1.md) | P0 正典 · 术语本质与价值边界 |
| [`CANON_GAP_REGISTRY.md`](../canon/CANON_GAP_REGISTRY.md) | 空白登记 · 禁止脑补区 |
| [`LOVEQIGU_WORLD_BIBLE_V1.md`](../world/LOVEQIGU_WORLD_BIBLE_V1.md) | L1 结构索引 · 术语树 · 产品映射 |
| [`LOVEQIGU_LANGUAGE_CONSTITUTION_V1.md`](../language/LOVEQIGU_LANGUAGE_CONSTITUTION_V1.md) | 三层语言宪法 |
| [`LOVEQIGU_TERMINOLOGY_V1.md`](../language/LOVEQIGU_TERMINOLOGY_V1.md) | 术语终稿基线（工程内以 V1 作为 **TERMINOLOGY_FINAL** 生效稿） |

> **术语说明**：仓库内尚无独立 `LOVEQIGU_TERMINOLOGY_FINAL` 文件。本 Content Canon 以 `LOVEQIGU_TERMINOLOGY_V1` + `LOVEQIGU_LANGUAGE_CONSTITUTION_V1` 作为终稿术语依据。L0 Canon 冻结文本中仍保留「归真」「回应」「祝由」「愿力」等历史写法；**内容层对外统一使用**「合真」「回响」「祝禁」「心愿值」。

### 0.3 本文件不是什么

| 不是 | 说明 |
|------|------|
| L0 正典 | 不得增删世界法则 |
| L1 历史正文 | 不得扩写纪元叙事 |
| L2 节点文案 | 不得替代 `data/chapters/*` 具体 copy |
| 营销稿 | 不得引入 Canon 未述概念 |

---

## §1 十个核心问题

以下回答 **只引用 Canon 已述部分** 与 **已登记的产品结构**；`[Canon未述·暂停]` 处明确标注，不补写。

---

### 1. 用户是谁？

**用户是探索者。**

依据 Canon《关于探索者》：

- 探索者 **不是** 游客、冒险家、收集者。
- 探索者是 **愿意重新看见、愿意重新连接、愿意学习如何去爱** 的人。

在 Content Canon 中：

| 维度 | 定义 |
|------|------|
| 身份称谓 | **探索者**（L2 产品层统一称呼） |
| 行为本质 | 与遗忘重逢，而非征服未知 |
| 产品表达 | 探索地图上的到场、觉察、记念与章成 |
| 禁止表达 | 玩家、收藏家、冲榜者、抽卡用户 |

---

### 2. 用户为什么进入 LOVEQIGU？

**因为分离时代里，人需要重新看见连接。**

依据 Canon 序章与终章：

- 探索 **不是** 寻找未知，而是 **重新看见、重新连接、与遗忘重逢**。
- 合真纪元 **不是** 带领人们离开人间，而是帮助人们在真实人生中 **学会看见、学会去爱、学会连接**。
- 大分化之后，遗忘发生，探索因此开始。

Content Engine 驱动力：

```text
进入 → 在场域中探索 → 完成一次真实看见 → 世界留下回响 → 记念沉淀 → 可选结缘 → 继续探索
```

**不得** 用「奖励驱动」「等级驱动」「稀缺驱动」作为进入动机的主叙事。

---

### 3. 用户探索的对象是什么？

**用户探索的是：云门状态下的场域，以及连接曾经存在过的证据。**

依据 Canon《关于云门》· 第七律 · 第十律：

| 对象 | 本质 | 产品映射 |
|------|------|----------|
| **云门** | 一种状态，不是地点 | 当探索者同时看见自己、世界、连接时开启 |
| **探索点** | 云门显现之地，**不是** 云门本身 | L2 地图节点 · GPS/园区点位 |
| **残印** | 连接曾经存在过的证据 | L2 印谱结构 · 探索过程中的痕迹记存 |
| **场域** | 现实探索发生的可见边界 | L2「场域体验」· AR Entry 预览层 |

探索 **不是** 收集物件、不是解锁关卡、不是排名竞争。

`[Canon未述·暂停]`：地图全貌、文明分布、虚构地理命名 — 不得作为探索对象扩写。

---

### 4. 信物在世界中的真实含义是什么？

**信物是世界留下的回响。**

依据 Canon 第十一律（冻结文本作「信物回应连接」；内容层统一称 **回响**）：

- 信物 **不是** 奖章、战利品、等级证明。
- 当探索者完成一次 **真实的看见**，并完成一次 **真实的连接**，世界便留下一个回响。
- 这种回响，被称为 **信物**。
- 信物见证的不是 **拥有**，而是 **连接**。

Content Canon 资产定义：

| 属性 | 规则 |
|------|------|
| 层级 | L3 世界观层记念 · L2 产品结构承载 |
| 数据角色 | **故事进度资产** · Canon-driven |
| 气质 | 博物馆感 · 克制 · 觉察语 · 非战利品仓库 |
| 与残印 | 残印是证据；信物是完成看见与连接后的 **世界回响** · 不同 Canon 条款 · 不同产品位 |

---

### 5. 信物如何推动剧情？

**信物不「解锁剧情」，而是见证并记存探索进度。**

依据 World Bible §6–§7 产品映射与 L2 章结构：

| 机制 | 说明 | 层级 |
|------|------|------|
| **节点完成** | 探索记录留下 → 可能触发残印/信物回响 | L2 |
| **印谱** | 章内觉察记存结构（如 1/5）· 对齐第十律 | **L2 专有** |
| **章成** | 章内条件齐备后的确认 · 对齐第十二律 | **L2 专有** |
| **章成印记** | 章级记念信物 · 如「初醒印记」 | L2 |
| **Story Flow** | 已批准流程链上的执行与 closure | L2 · Content Engine |

推动规则：

1. 信物 **deterministic** 来自探索/章成结果，不由用户手动「制造进度」。  
2. 信物 **不** 作为商城商品、**不** 作为抽卡结果、**不** 作为战力组件。  
3. 下一节点/下一章入口由 **L2 章节配置** 决定，不由信物「升级」叙事发明。  
4. CH02+ 仅复制 CH01 工厂流程，**不** 新增 L0/L1 设定。

---

### 6. 数字藏品为什么存在？

**数字藏品是营销与传播资产，不是故事进度资产。**

依据 Information Architecture · Asset Model · Content Engine Schema：

| 维度 | 信物 Relic | 数字藏品 Digital Collectible |
|------|------------|------------------------------|
| 目的 | 故事进度记念 | 营销 · 沟通 · 分享 |
| 获得方式 | 探索/章成 **系统发放** | 用户 **主动生成/保存/分享** |
| 对印谱/章成 | **有影响** | **零影响** |
| 语言层 | L3 觉察/回响 | L2 传播 + L1 活动说明 |
| Canon 依据 | 第十一律 | 无 Canon 专有名词 · L2 产品结构 |

存在理由（产品层，非 Lore 发明）：

- 支持章成后 **分享海报、社交卡片、活动 memo** 等传播动作。  
- 支持 Campaign / Live Ops 的 **沟通触达**，不替代信物持有库。  
- 让用户 **主动** 生成可传播内容，而不把传播物写入信物进度。

**硬性边界**：`Relic != Digital Collectible` · 不得共享 progression logic。

---

### 7. AR 事件为什么存在？

**AR 事件是「看见开启道路」的产品化场域体验层。**

依据 Canon 第七律 · 第四律 ·《关于云门》：

- 觉察是合真的起点；**看见** 让遗忘显现、让真实浮现。  
- 世界是一面 **回响之镜**；探索是 **参与世界**，不是征服世界。  
- 探索点位是云门显现之地，用于支持 **在场域中被看见**。

AR Event Layer 职责：

| 职责 | 说明 |
|------|------|
| 场域可视化 | 把探索点位的「在场」转为可感知体验 |
| 仪式入口 | Story Flow / 探索链上的 closure 节点 |
| 表达边界 | 预览/场域体验 · 不请求违背产品合规的权限叙事 |
| 禁止 | 战力展示 · 抽卡式 AR · 改运/预言/医疗暗示 |

AR 事件 **不创造** 云门，只 **承接** 已开启的探索状态；**不** 替代 L2 节点 JSON 为内容源。

---

### 8. 回响机制的意义是什么？

**回响是探索完成后，世界对真实看见与连接的回应。**

依据 Canon 第四律 · 第八律 · 第十一律（内容层称 **回响**，冻结 Canon 作「回应」）：

| 层面 | 意义 |
|------|------|
| 世界观 | 连接从未断开；回响让连接 **重新被看见** |
| 仪式 | 探索动作结束后的 **closure moment** · 非商业 moment |
| 产品 | Echo Layer：AR Event → Echo → Digital Collectible 的批准 closure 链 |
| 语言 | L3：「世界留下回响」· 禁止 L3 弹窗混用积分/成就/稀有度 |

回响 **不是** 社交点赞数，**不是** 排行榜反馈，**不是** 商城促销弹窗。

Content Engine 中 `Echo` 记录只引用 **已批准的 CH01 回响路径**；不得发明新 Lore 回响类型。

---

### 9. 合真的意义是什么？

**合真是归位，是想起，不是获得。**

依据 Canon 第十二律（冻结文本「归真即归位」；术语终稿统一 **合真**）· 第一律 · 序章：

- 合真 **不是** 成为更伟大的人、不是掌握更多力量、不是逃离现实。  
- 合真是 **重新想起、重新连接、重新归位** — 归位于本真、连接、合一。  
- 本真 **未曾失去**，只是暂时被遮蔽；合真 **不是获得**，而是 **想起**。

Content Canon 对产品层的约束：

| 场景 | 合真如何出现 | 禁止 |
|------|--------------|------|
| 合真之路（L2） | 修习/里程碑/章成进度的产品名称 | 写成「升级路线」 |
| 章成 moment（L3） | 觉察语 · 记念 · 归位感 | 积分+成就+称号混排 |
| 商业层（L1） | **不得** 出现「合真」作为主促销语 | 把合真卖成会员权益 |

---

### 10. 完成一章之后，用户获得什么？

**用户获得的是：记念、印谱完成、章成确认，以及可选的结缘触达 — 不是「更强」或「更多物」。**

> 说明：本问在工程语境中对应 **章成**（chapter completion），而非预写「五个完整章节」的终局奖励。当前已定义 exemplar 为 **CH01《云间初醒》· 五处觉察**。CH02+ 结构 **[Canon未述·暂停]** 的具体叙事，不得在本层发明。

依据 CH01 L2 结构与 TERMINOLOGY 终稿，**章成后** 用户可见获得：

| 获得物 | 层级 | 性质 |
|--------|------|------|
| **章成印记**（如「初醒印记」） | L3/L2 | 信物 · 章级记念 |
| **探索记念**（如「云间初醒」） | L2 | 探索档案条目 · 非「成就」 |
| **记念称号**（如「初醒者」） | L2 | 记念称号 · 非等级 |
| **印谱完成** | L2 | 本章觉察结构点亮 |
| **心愿值记存** | L1/L2 过渡 | 仅在账户明细/商城语境 · **不得** 占 L3 弹窗主视觉 |
| **结缘礼资格** | L1 | 如咖啡券 · 商城/卡券 · 与仪式链分离 |
| **分享入口** | L2 | 生成分享海报 → **数字藏品** 流程 · 非自动写入信物库 |

章成后 **不自动** 获得：

- 新文明/新势力/新历史解释  
- 战力、境界、稀有度  
- 数字藏品自动入库（须用户主动生成）  
- 未在 L2 JSON 登记的 Canon 空白填充  

下一行动作（产品层）：继续探索 · 查看我的信物 · 前往合真之路 · 可选进入结缘商城 — 均须走 **已有路由**，不发明新世界观节点。

---

## §2 CONTENT_CANON · 四层定义

以下四层是 Content Engine 的 **唯一上游语义层**。所有 YAML、服务桥接、页面 intro 不得违背本节边界。

---

### 2.1 Story Layer（故事层）

**职责**：组织 **用户经历什么** — 章节、节点、Story Flow、时间线、档案视图。

| 字段 | 规则 |
|------|------|
| 内容源 | L2 `data/chapters/*` · Story Engine YAML |
| Canon 对齐 | 第三律（探索即重逢）· 终章（人间中的看见与爱） |
| 允许 | 章结构 · 节点文案 · 用户旅程 · 只读档案 |
| 禁止 | 新纪元事件 · 新组织 · 新神明 · 预写 UNDECLARED 历史 |

**核心对象**：Chapter · Node · Story Flow · Story Archive · Timeline

---

### 2.2 Relic Layer（信物层）

**职责**：承载 **故事进度资产** — 信物、残印、印谱、章成印记。

| 字段 | 规则 |
|------|------|
| Canon 对齐 | 第十律（残印）· 第十一律（信物/回响）· 第十二律（合真/归位） |
| 允许 | 觉察信物 · 残印信物 · 章成信物 · 印谱进度 |
| 禁止 | 战利品语义 · 稀有度 · 抽卡 · 与 Digital Collectible 混库 |

**核心对象**：Relic · Imprint · Imprint Album（印谱）· Chapter Completion Mark

**发放原则**：探索/章成 deterministic · 博物馆气质 · 觉察语可选

---

### 2.3 Rights Layer（权益层）

**职责**：承载 **商业与结缘功能** — 与仪式链 **隔离**。

| 字段 | 规则 |
|------|------|
| 语言层 | **L1 商业层** |
| 术语 | 结缘商城 · 卡券 · 核销 · 会员 · 结缘礼 |
| Canon 对齐 | 第八律（爱使连接）仅作价值边界，**不**写入促销弹窗 |
| 允许 | 权益列表 · Campaign Closure · 兑换/领取/核销流程占位 |
| 禁止 | 云门/觉察语/合真作为主促销 · 信物当商品卖 |

**核心对象**：Right · Campaign · Coupon · Redemption · Next Activity（回流入口）

**入口原则**：只在「我的」或独立 Tab / Rights Center 出现；**不插入** Path A/B 仪式 closure 主链。

---

### 2.4 AR Event Layer（AR 事件层）

**职责**：承载 **场域体验与 closure 入口** — 看见道路的产品化层。

| 字段 | 规则 |
|------|------|
| Canon 对齐 | 第七律 · 第四律 ·《关于云门》 |
| 允许 | 探索地图 AR 预览 · Story Flow closure · fake/preview AR |
| 禁止 | .live 改运 · 医疗暗示 · 相机权限滥用叙事 · 新增 AR 类型 Lore |

**核心对象**：AR Event · AR Entry · Atom（表达单元引用）· Lottie（动效模板）

**Closure 模式**：

| 模式 | 路径 |
|------|------|
| Path A · 探索 | AR Entry → Atom → Lottie → Echo → Digital Collectible → Next Activity |
| Path B · Story Flow | AR Entry (story-flow) → Echo → Digital Collectible |
| Path C · Live Ops | Rights Center → Campaign Closure → Next Activity |

---

### 2.5 支撑层（非独立 Canon 层，但受本文件约束）

| 层 | 职责 | 边界 |
|----|------|------|
| **Echo Layer** | 仪式 closure · 世界回响 moment | L3 · 无商业混说 |
| **Digital Collectible Layer** | 传播/营销资产 | 零进度影响 |
| **Atom / Lottie Layer** | 表达单元与动效模板 | 只引用已批准 CH01 refs · 不改 Canon |
| **Live Ops Layer** | 季节/活动/template | 只引用已有 Story Flow / AR / Echo / DC refs |

---

## §3 语言与术语 Compliance

Content Engine 生成与 MiniApp 桥接 **必须** 遵守：

### 3.1 强制术语（TERMINOLOGY_FINAL = V1）

| 使用 | 禁止使用 |
|------|----------|
| 探索地图 | 打卡地图 |
| 结缘商城 / 商城 | 积分商城（用户可见） |
| 心愿值 | 愿力 |
| 合真 | 归真（内容层） |
| 回响 | 回应（内容层） |
| 祝禁 | 祝由 |
| 合真之路 | 任务中心 |
| 探索记念 | 成就 |
| 记念称号 | 称号（单独作等级暗示时） |
| 场域体验 | AR打卡 |

### 3.2 三层语言铁律

1. **分层不混说**：同一屏不得混用 L1/L2/L3 两层以上主导语义。  
2. **仪式无商业**：信物回响 · 章成 · 云门 moment 禁止积分/成就/稀有度。  
3. **商业无 Lore 扩写**：结缘商城禁止引入 Canon Gap 内容。

---

## §4 资产边界速查

```text
Relic（信物）
  ├── 故事进度资产
  ├── Canon-driven
  ├── 驱动印谱 / 章成 / 探索档案
  └── 页面：我的信物 · 信物档案 · 数字藏馆（图鉴）

Digital Collectible（数字藏品）
  ├── 营销 / 传播资产
  ├── 用户主动生成
  ├── 零进度影响
  └── 页面：分享海报 · 社交卡片 · Campaign memo

Rights（权益）
  ├── L1 商业层
  ├── 与仪式链隔离
  └── 页面：结缘商城 · Campaign Closure
```

---

## §5 Canon Gap 合规

编写或生成任何 Content Engine 内容前，**必须先查** [`CANON_GAP_REGISTRY.md`](../canon/CANON_GAP_REGISTRY.md)。

| 状态 | Content Canon 行为 |
|------|-------------------|
| DEFINED | 可引用、可转述 |
| PARTIAL | 仅引用已述部分 |
| UNDECLARED | 标注 `[Canon未述·暂停]` · 不得生成正文 |
| FORBIDDEN | **禁止任何层级编写** |

**禁止填补的典型 Gap**：宇宙起源 · 创世神 · 神明体系 · 前文明 · 地图全貌 · 云门创造者 · 新势力。

---

## §6 下游消费规则

| 消费者 | 必须 |
|--------|------|
| Content Engine YAML | 字段语义对齐 §2 四层 · 资产边界 §4 |
| Story Engine | Story Flow 只引用已批准 closure_path |
| Live Ops Engine | Campaign 只引用已有 story_flow_ref |
| MiniApp services | 占位数据不得混 Relic / Digital Collectible |
| Cursor / Governance | 冲突时修改 L2+，**不修改 L0** |
| OMX / Terminology | 用户可见 copy 走 TERMINOLOGY V1 |

---

## §7 输出限制

### 7.1 不得

- 新增神、文明、组织、创世神话、历史事件  
- 填补 Canon Gap  
- 把信物写成战利品/装备  
- 把数字藏品写入印谱/章成逻辑  
- 在仪式链插入商业主视觉  
- 用 Content Canon 覆盖 L0 冻结条文  

### 7.2 允许

- 把 Canon 已述本质转译为四层驱动力  
- 标注 L2 产品结构（印谱、章成、合真之路）  
- 引用 CH01 已登记节点与流程  
- 为 Content Engine 提供上游边界与验收标准  

---

## §8 修订记录

| 版本 | 日期 | 说明 |
|------|------|------|
| V1.0 | 2026-06-07 | 首版：回答十个核心问题；定义 Story / Relic / Rights / AR Event 四层 CONTENT_CANON |

---

## 关联文档

| 文档 | 关系 |
|------|------|
| [`LOVEQIGU_CANON_INDEX.md`](../canon/LOVEQIGU_CANON_INDEX.md) | 层级索引 |
| [`LOVEQIGU_INFORMATION_ARCHITECTURE_V1.md`](../architecture/LOVEQIGU_INFORMATION_ARCHITECTURE_V1.md) | IA · 资产二分 |
| [`CONTENT_ATOM_SCHEMA.yaml`](../../CONTENT_ENGINE/CONTENT_ATOM_SCHEMA.yaml) | Atom 字段规则 |
| [`RC2_ACCEPTANCE_AUDIT_REPORT.md`](../RC2_ACCEPTANCE_AUDIT_REPORT.md) | MiniApp 旅程验收 |

---

*内容引擎只转述已批准的世界，不发明新的世界。*

`LOVEQIGU_CONTENT_CANON_V1_COMPLETE = YES`
