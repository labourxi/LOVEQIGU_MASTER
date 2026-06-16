# LOVEQIGU_LOCAL_AI_AUGMENTATION_PLAN_V1

文档编号：LOVEQIGU-MIG-003
文档状态：V1
创建目的：将 LOVEQIGU / AR游伴 项目的“整体技术搬迁”策略降级为“本地 AI 增强计划”
适用范围：LOVEQIGU_MASTER 项目仓库、ChatGPT、智谱清言、Qoder、Codex、Cursor
最高原则：不搬家，只加工具

---

## 1. 背景

LOVEQIGU / AR游伴 项目此前曾评估将部分或全部工作从网页版 ChatGPT 迁移到中国智谱清言最新大模型、本地客户端，并引入阿里 Qoder 作为本地工程执行工具。

迁移动因包括：

1. 网页版 ChatGPT 在长会话中存在明显卡顿。
2. ChatGPT 网页版对本地项目文件读取能力有限。
3. LOVEQIGU 项目已经形成大量文档、代码、数据、报告、治理文件，需要更强的本地仓库读取能力。
4. 国内工具链需要具备更好的可用性和替代方案。
5. 项目进入后台建设、活动运营、真实数据闭环和本地执行阶段，需要减少人工复制粘贴成本。

经过多轮验证后，项目确认：

整体技术搬迁复杂度过高，风险较大，不宜继续推进“完整迁移”。

---

## 2. 核心裁决

```text
FULL_TECH_MIGRATION = NO
LOCAL_AI_AUGMENTATION = YES
CHATGPT_MAIN_ARCHITECT = KEEP
QODER_LOCAL_EXECUTION = YES
CODEX_EXECUTION_CHAIN = KEEP
ZHIPU_SECONDARY_REVIEW = YES
CURSOR_VISUAL_MANUAL_REVIEW = YES
```

项目不再以“替代 ChatGPT”为目标。

新的目标是：

```text
ChatGPT 继续做主架构和主裁决
Qoder / Codex 负责本地仓库读取与受控执行
智谱清言负责中文语义审查、可行性复核和国内模型备选
Cursor 负责人工可视化检查和局部修复
```

---

## 3. 为什么不做整体技术搬迁

LOVEQIGU / AR游伴 项目不是普通代码项目，而是一个带有强正典、强术语、强审美、强治理的复合系统。

项目中存在以下高约束体系：

1. Canon 正典体系
2. Terminology 术语冻结体系
3. World Bible 世界观体系
4. Art Bible 视觉圣经体系
5. Runtime Bridge 运行时桥接体系
6. Autopilot 自动化体系
7. Content Engine 内容引擎体系
8. Visual Autopilot 视觉自动化体系
9. Admin Backoffice 后台体系
10. Merchant Portal 商家后台
11. Park Admin 景区后台
12. Platform Admin 平台后台
13. Ductor Workflow
14. OMX Workflow
15. Governance / Decision Log / Changelog

这类项目的核心风险不是“代码能不能改”，而是：

1. 模型是否会创造不存在的路径。
2. 模型是否会误判目录权限。
3. 模型是否会把只读文件当成可写文件。
4. 模型是否会误改 Canon。
5. 模型是否会污染术语。
6. 模型是否会混淆 L1 商业层与 L3 仪式层。
7. 模型是否会把“信物”和“数字藏品”混用。
8. 模型是否会把“探索”写成“任务/打卡/成就”。
9. 模型是否会把视觉系统引向仙侠、游戏、爆闪、抽卡。

因此，整体迁移成本大于收益。

---

## 4. 新战略名称

原战略：

```text
LOVEQIGU 技术搬迁
```

调整为：

```text
LOVEQIGU 本地 AI 增强计划
```

核心口号：

```text
不搬家，只加工具。
```

含义：

1. 不替换 ChatGPT 主控地位。
2. 不重建全部治理体系。
3. 不让新工具接管 Canon、Runtime、世界观、核心产品裁决。
4. 只把本地文件读取、目录审查、小范围批处理、第二意见审查等能力分流出去。
5. 最大化利用 Qoder / Codex / Cursor / 智谱清言的长处。

---

## 5. 工具链重新分工

### 5.1 ChatGPT

定位：

```text
主脑 / 主架构师 / 项目裁决者 / 复杂推理中心
```

继续负责：

1. 项目总架构判断
2. 产品路线裁决
3. Canon 相关风险判断
4. 多会话 A/B/C 协同
5. 控制码解释
6. 任务拆解
7. Qoder / Codex / Cursor 指令生成
8. 高复杂度技术方案
9. 迁移策略最终裁决
10. 用户最终决策辅助

禁止降级的职责：

1. Canon 裁决
2. World Bible 裁决
3. ART 核心审美方向裁决
4. Runtime Bridge 总控
5. 后台产品范围裁决
6. 多会话治理体系

---

### 5.2 Qoder

定位：

```text
本地仓库读取助手 / 工程执行 Agent / 小范围受控修改工具
```

适合承担：

1. 项目目录扫描
2. 本地文件树生成
3. 术语命中统计
4. 重复文件检查
5. 空文件检查
6. 路径校准
7. JSON 文件格式检查
8. 小范围精准替换
9. 生成执行报告
10. 输出 diff 或变更清单

不适合承担：

1. Canon 修改
2. 世界观扩写
3. 核心产品裁决
4. 视觉哲学判断
5. Runtime 发布
6. 数据库结构重构
7. 登录、支付、权限等高风险模块修改
8. 未经授权的批量代码重构

Qoder 规则：

```text
Qoder 是手术刀，不是主治医生。
```

---

### 5.3 Codex

定位：

```text
既有自动化执行链 / 稳定批处理工具 / Qoder 对照组
```

继续负责：

1. 执行已有 Prompt
2. 生成目录树
3. 跑只读审查
4. 执行低风险受控写入
5. 生成文档和报告
6. 作为 Qoder 的备用执行工具

Codex 规则：

```text
Codex 适合执行清晰指令，不负责重新定义项目方向。
```

---

### 5.4 智谱清言

定位：

```text
中文语义审查副驾驶 / 国内模型备选 / 文档复核工具
```

适合承担：

1. 中文长文档理解
2. 术语审查
3. 文化表达复核
4. 视觉 Prompt 中文化
5. 可行性评估
6. 国内工具链替代建议
7. 第二意见审查
8. 本地客户端可用性测试

不适合承担：

1. 项目总控
2. Canon 最终裁决
3. Runtime 发布裁决
4. 自动创造路径
5. 直接指挥 Qoder 大规模写入
6. 单独决定世界观扩写

智谱清言规则：

```text
智谱清言可以审查和补充，但不做最终裁决。
```

---

### 5.5 Cursor

定位：

```text
人工可视化检查工具 / 局部代码编辑器 / 最后确认界面
```

适合承担：

1. 查看文件结构
2. 人工确认 diff
3. 小范围手动修改
4. 页面样式检查
5. 代码局部修复
6. 对 Qoder / Codex 输出进行复核

Cursor 规则：

```text
Cursor 适合看得见的局部修复，不适合无边界 Agent 扫全仓。
```

---

## 6. 本地 AI 增强的三类必要能力

### 6.1 本地文件读取

必要性：高
风险：低
结论：必须做

适用任务：

1. 目录树生成
2. 文件扫描
3. 文档索引检查
4. 路径校准
5. 重复文件检查
6. 空文件检查
7. 未登记文件检查
8. 数据结构统计
9. JSON Schema 对照
10. 报告生成

推荐工具：

```text
Qoder / Codex / Cursor
```

---

### 6.2 低风险受控写入

必要性：中高
风险：中低
结论：可以做，但必须受控

适用任务：

1. 指定文件内的精准替换
2. 新增迁移报告
3. 新增审查报告
4. 新增索引补充文件
5. 低风险 mock 数据修正
6. 明确范围内的 JSON 文案微调

必须满足：

1. 有明确文件清单
2. 有明确替换文本
3. 禁止顺手修改其它文件
4. 禁止格式化整个项目
5. 禁止重排字段
6. 必须生成报告
7. 必须可回滚
8. 必须人工验收

---

### 6.3 中文副审查

必要性：中
风险：中
结论：保留，但不主导

适用任务：

1. 智谱清言审查术语
2. 智谱清言复核中文文案
3. 智谱清言评估视觉 Prompt
4. 智谱清言做迁移报告第二意见
5. 智谱清言评估国内工具链可用性

限制：

1. 不允许智谱清言单独决定工程写入。
2. 不允许智谱清言单独修改 Canon。
3. 不允许智谱清言单独扩写世界观。
4. 不允许智谱清言直接接管 Runtime。
5. 智谱清言输出必须经 ChatGPT / 项目 owner 裁决。

---

## 7. 禁止迁移的核心权限

以下权限不得迁移给 Qoder、Codex、智谱清言或 Cursor：

1. Canon 修改权
2. World Bible 修改权
3. Terminology Final 修改权
4. ART 核心审美裁决权
5. Runtime 发布权
6. 数据库结构重构权
7. 登录鉴权重构权
8. 支付相关修改权
9. 活动正式发布权
10. 商业规则最终裁决权
11. 多会话治理体系裁决权
12. 项目品牌定位裁决权

---

## 8. 标准工作流

### 8.1 只读审查流程

```text
用户提出问题
↓
ChatGPT 生成 Qoder / Codex 只读指令
↓
Qoder / Codex 本地读取仓库
↓
输出报告到 docs/migration/ 或 docs/audit/
↓
用户上传报告
↓
ChatGPT 审查报告
↓
必要时交给智谱清言做第二意见
↓
ChatGPT 给出最终裁决
```

---

### 8.2 受控写入流程

```text
ChatGPT 明确批准写入
↓
限定文件范围
↓
限定替换内容
↓
限定禁止事项
↓
Qoder / Codex 执行
↓
生成变更报告
↓
用户上传报告
↓
ChatGPT 验收
↓
必要时 Cursor 人工查看 diff
↓
通过后进入下一阶段
```

---

### 8.3 智谱清言副审查流程

```text
ChatGPT 输出主判断
↓
用户交给智谱清言复核
↓
智谱清言输出第二意见
↓
用户带回 ChatGPT
↓
ChatGPT 做最终校准
↓
决定是否执行
```

---

## 9. 当前推荐执行边界

允许优先执行：

1. docs/migration/ 下新增迁移报告
2. 目录树生成
3. 路径校准
4. 术语只读审查
5. JSON 数据只读审查
6. 低风险 L1 文案精准替换
7. 迁移日志生成
8. 工具链分工文档生成

暂缓执行：

1. L3 仪式文案批量重写
2. L1/L3 混合句结构拆分
3. apps/miniapp 代码批量替换
4. CONTENT_ENGINE 改造
5. Runtime Bridge 改造
6. Orchestrator 改造
7. Visual Autopilot 改造

禁止执行：

1. Canon 改写
2. World Bible 改写
3. Terminology Final 重定义
4. 数据库结构重构
5. 登录鉴权修改
6. 支付相关修改
7. 发布流程修改
8. 无边界全仓格式化
9. 无授权批量重命名
10. 无授权删除文件

---

## 10. 当前已验证结果

当前已验证：

1. Codex 可以成功生成 LOVEQIGU_MASTER_TREE.txt。
2. 项目目录树已证明 LOVEQIGU_MASTER 是多模块复合工程。
3. 智谱清言可以理解项目哲学和术语风险，但存在路径幻觉风险。
4. Qoder 可以完成只读术语审查。
5. Qoder 的 TERMINOLOGY_AUDIT_REPORT_V1 证明只读审查流程可行。
6. 受控写入尚需小范围验证。
7. 不宜直接进入大规模迁移或大规模术语重写。

---

## 11. 下一阶段建议

下一阶段不再推进“技术搬迁”，而是推进以下最小增强：

### 11.1 增强任务一：迁移文档冻结

新增本文件：

```text
docs/migration/LOVEQIGU_LOCAL_AI_AUGMENTATION_PLAN_V1.md
```

用途：

1. 冻结“不搬家，只加工具”的策略。
2. 明确工具链角色。
3. 限定 Qoder / Codex / 智谱清言权限。
4. 防止后续再次误入整体迁移。

---

### 11.2 增强任务二：Phase 1 受控写入验证

建议后续单独执行：

```text
TERMINOLOGY_MIGRATION_BATCH_V1_PHASE1_L1_RIGHTS_ONLY
```

范围：

```text
仅 data/rights/ 下 10 个 JSON 文件
```

目标：

```text
同账号仅可获得一次。
↓
同账号仅可领取一次。
```

该任务应作为 Qoder 受控写入能力的第一次正式验证。

---

### 11.3 增强任务三：智谱清言副审查模板

后续可新增：

```text
docs/migration/ZHIPU_SECONDARY_REVIEW_TEMPLATE_V1.md
```

用途：

1. 规定提交给智谱清言的上下文格式。
2. 要求智谱清言不得创造路径。
3. 要求智谱清言只基于真实目录树和上传文件判断。
4. 要求智谱清言输出“建议”而非“裁决”。

---

## 12. 验收标准

本文件创建后，验收标准如下：

1. 文件存在于 `docs/migration/LOVEQIGU_LOCAL_AI_AUGMENTATION_PLAN_V1.md`。
2. 未修改任何已有代码文件。
3. 未修改任何 data 文件。
4. 未修改 docs/canon/。
5. 未修改 docs/world/。
6. 未修改 CONTENT_ENGINE/。
7. 未修改 apps/。
8. 未修改 governance/AI_DECISION_LOG.md。
9. 未修改 governance/CHANGELOG.md。
10. 文档明确写入“不搬家，只加工具”。
11. 文档明确 ChatGPT 保持主控。
12. 文档明确 Qoder / Codex / 智谱清言 / Cursor 的边界。
13. 文档明确禁止整体迁移。
14. 文档明确下一阶段只做本地 AI 增强。

---

## 13. 最终结论

LOVEQIGU / AR游伴 项目不应进行完整技术搬迁。

正确方向是：

```text
保留 ChatGPT 主控
引入 Qoder 本地仓库读取与小范围执行
保留 Codex 已有执行链
使用智谱清言做中文审查与国内模型备选
使用 Cursor 做人工可视化检查
```

最终策略：

```text
不搬家，只加工具。
```

本文件作为 LOVEQIGU 技术搬迁会话的阶段性裁决文档，后续所有涉及智谱清言、Qoder、Codex、Cursor 的工具链扩展，均应以本文件为边界参考。
