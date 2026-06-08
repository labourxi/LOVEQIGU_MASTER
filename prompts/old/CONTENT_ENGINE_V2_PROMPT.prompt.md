# LOVEQIGU_CONTENT_ENGINE_V2_BATCH_GENERATION

你现在在 LOVEQIGU_MASTER/CONTENT_ENGINE 目录。

任务：

1. 批量生成内容文件，保持与 V1 Atom 库规范一致：

### Atom

* 生成 20 个新 Atom（EMOTION / SYMBOL / RITUAL）
* 每个 Atom 包含：

  * id
  * category
  * title
  * description
  * emotion
  * symbol
  * ritual
  * reward.wish_value
  * tags
  * rarity
  * status

### 信物 Token

* 生成 10 个新信物
* 每个信物包含：

  * token_id
  * name
  * theme
  * meaning
  * material
  * story_use
  * ar_effect
  * rarity
  * emotion_link
  * symbol_link
  * ritual_link

### 数字藏品 Collectible

* 生成 5 个新数字藏品
* 每个藏品包含：

  * collectible_id
  * name
  * activity
  * rarity
  * theme
  * share_text
  * visual_asset
  * emotion_link
  * unlock_condition

### AR Event

* 生成 10 个新 AR 事件
* 每个事件包含：

  * event_id
  * title
  * story_stage
  * trigger
  * visual
  * lottie
  * particle
  * audio
  * interaction
  * reward.wish_value
  * reward.token_unlock
  * reward.collectible_unlock
  * next_event

2. 新生成文件保存到对应目录：

* ATOM_LIBRARY/
* TOKEN_LIBRARY/
* COLLECTIBLE_LIBRARY/
* AR_EVENT_LIBRARY/

3. 保留已有文件内容，不覆盖。

4. 输出批量生成报告：

* 已生成的 Atom 文件数
* 已生成的信物文件数
* 已生成的数字藏品文件数
* 已生成的 AR事件文件数

5. 输出标识：

```
LOVEQIGU_CONTENT_ENGINE_V2_COMPLETE = YES
```

约束：

* 信物 = 剧情推进资产
* 数字藏品 = 营销传播资产
* 二者禁止混用
* 使用：心愿值、合真、回响、祝禁
* 禁止：愿力、归真、回应、祝由
