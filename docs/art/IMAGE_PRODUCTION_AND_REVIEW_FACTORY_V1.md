# IMAGE_PRODUCTION_AND_REVIEW_FACTORY_V1

## 0. Status

- STATUS: FACTORY_WORKFLOW_DEFINED
- PURPOSE: 建立 LOVEQIGU / AR游伴 出图与评审生产线
- SCOPE: Prompt 生产、模型分发、结果回收、评审、修订、冻结、索引登记
- API_EXECUTION: NOT_INCLUDED_IN_V1
- REAL_IMAGE_GENERATION: MANUAL_OR_EXTERNAL_TOOL

## 1. Current Conclusion

当前项目已有视觉方向，但尚未形成稳定出图工厂。

本文件冻结 V1 生产线：

```text
视觉需求
↓
出图任务单
↓
Prompt Pack
↓
多模型出图
↓
结果回收
↓
评审矩阵
↓
选定 / 修订 / 淘汰
↓
最终冻结
↓
索引登记
```

## 2. Factory Roles

### 2.1 Product Owner

职责：

* 确认要做什么视觉资产
* 确认使用场景
* 确认是否进入下一轮修订
* 最终批准 PASS

### 2.2 Art Director

职责：

* 把产品需求转成视觉方向
* 编写 Prompt
* 控制风格一致性
* 判断是否符合东方图谱 / 古籍 / 星链 / 经络方向

### 2.3 Image Tools

候选工具：

* ChatGPT image generation
* Gemini
* 豆包
* Seedream
* Minimax
* 其它后续接入工具

V1 规则：

```text
工具可以人工使用
不得默认认为 API 自动执行
```

### 2.4 Reviewer

职责：

* 按统一评审表打分
* 记录优点、问题、修订方向
* 给出 PASS / REVISE / REJECT

## 3. Standard Production Flow

### Step 1: Image Task Brief

每次出图前必须先定义：

* 资产名称
* 使用页面
* 使用场景
* 画面主题
* 必须出现元素
* 禁止元素
* 视觉风格
* 输出比例
* 是否需要透明背景
* 是否需要后续动效拆层

### Step 2: Prompt Pack

每个任务至少包含：

* Master Prompt
* ChatGPT Prompt
* Gemini Prompt
* 豆包 Prompt
* Negative Prompt
* Revision Prompt
* Naming Rule

### Step 3: Image Generation

V1 支持人工分发。

出图时必须记录：

* 工具名称
* Prompt 版本
* 生成时间
* 图片编号
* 原图文件名
* 是否进入评审

### Step 4: Review Matrix

每张图按以下维度评审：

* 东方气质
* 古籍 / 星图 / 经络感
* 是否符合产品功能
* 是否避免禁忌元素
* 可落地性
* 可动效化
* 前端可拆解性
* 用户直观理解度
* 是否适合继续修订

### Step 5: Decision

评审结论只能是：

```text
PASS
REVISE
REJECT
REFERENCE_ONLY
```

### Step 6: Final Freeze

被选中的图必须记录：

* Final Asset Name
* Final Version
* Source Prompt
* Tool Used
* Accepted Reason
* Known Limitations
* Next Use
* Storage Path

## 4. Global Visual Rules

### Required

* 东方图谱感
* 克制留白
* 古籍纸本气质
* 低饱和
* 柔和流光
* 星点 / 节点 / 线条可控
* 可拆层
* 可前端实现

### Forbidden

* 五角星
* 政治符号
* 亮金爆炸
* 金属徽章贴面
* 强科幻 HUD
* 霓虹游戏 UI
* 抽卡稀有奖励感
* 医学教材风
* 过度真实人体器官
* 复杂不可控背景

## 5. Asset Naming Rule

文件命名建议：

```text
<system>_<subject>_<asset_type>_<tool>_<version>.<ext>
```

示例：

```text
star_chain_jiaosu_minimal_chatgpt_v01.png
meridian_baihui_node_doubao_v01.png
treasure_lotus_seal_gemini_v01.png
```

## 6. Directory Rule

建议目录：

```text
docs/art/assets/raw/
docs/art/assets/review/
docs/art/assets/final/
docs/art/assets/reference/
docs/art/prompts/
docs/art/reviews/
```

V1 只建立文档规则，不强制移动已有图片。

## 7. Review Scoring

每项 1–5 分：

* Style Fit
* Cultural Fit
* Product Fit
* Technical Usability
* Motion Potential
* Clarity
* Risk Control

总分建议：

```text
28+ = PASS candidate
21–27 = REVISE
<21 = REJECT
```

## 8. Revision Rule

如果 REVISE，必须明确：

* 保留什么
* 删除什么
* 强化什么
* 降低什么
* 下一轮 Prompt 怎么改

禁止只写：

```text
不好看
再东方一点
再高级一点
```

必须写具体方向。

## 9. Freeze Rule

最终冻结图必须满足：

* 符合视觉方向
* 无禁忌元素
* 用户能理解
* 可落地到页面
* 可拆分或可转成前端动效
* 已记录 Prompt 和评审结论

## 10. V1 Limitations

本 V1 不包含：

* API 自动出图
* API Key 管理
* 图片自动下载
* 图片自动评分
* 自动 OCR
* 自动上传 CDN
* 自动生成 Lottie

这些可在 V2 做。

## 11. Next Recommended Factory Upgrade

IMAGE_FACTORY_API_BATCH_RUNNER_PLAN_V1

用途：

规划后续是否接入 Gemini / 豆包 / Seedream API 批量出图。

## 12. Final Output

* IMAGE_PRODUCTION_FACTORY_DEFINED = YES
* IMAGE_REVIEW_MATRIX_DEFINED = YES
* IMAGE_PROMPT_PACK_DEFINED = YES
* IMAGE_FREEZE_RULE_DEFINED = YES
* API_AUTOMATION_INCLUDED = NO
* READY_FOR_VISUAL_BATCH_PRODUCTION = YES
