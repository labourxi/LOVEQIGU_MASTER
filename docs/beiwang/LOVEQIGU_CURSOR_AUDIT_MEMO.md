
# LOVEQIGU_CURSOR 审查需求备忘录

## 1️⃣ 目的
记录 Cursor 在 LOVEQIGU 内容系统中的角色与职责，确保在未来生成内容时能正确安排审查节点和流程。

## 2️⃣ 角色定位
- **Cursor**：LOVEQIGU 内容系统的“全面审查者”
- **职责**：
  1. 扫描 Content Engine 所有 YAML 文件（Atom、Token、Collectible、AR Event）
  2. 校验 Governance 规则（信物/数字藏品分离、字段规范、禁止混用）
  3. 输出审计报告（Markdown/JSON）
  4. 标记审查完成状态
  5. 在 Ductor / OMX Workflow 中嵌入审查节点
  6. 可定期触发，确保系统持续合规

## 3️⃣ 审查节点
1. **初次落地（V1/V2）**
2. **批量生成（V3及以后扩展）**
3. **工作流触发（Ductor / OMX 执行后）**
4. **定期维护**（自动或计划任务）

## 4️⃣ 审查内容与规范
- **信物 Token**：禁止 `rarity`，`reward.wish_value` 改名 `result.wish_value_delta`
- **数字藏品 Collectible**：允许 `presentation_tier` 展示稀有度
- **Atom**：必须遵守 category、emotion、symbol、ritual；禁止 reward 或 rarity
- **AR Event**：reward 字段区分信物/数字藏品奖励，next_event 链接完整
- **文件规范**：存在性、命名、YAML 格式、字段完整性

## 5️⃣ 审查输出
- Markdown / JSON 报告
- PASS / FAIL / WARN
- 违规字段、缺失文件、重复文件、建议修复
- 标记：

```
LOVEQIGU_CONTENT_ENGINE_CURSOR_AUDIT_COMPLETE = YES
```

## 6️⃣ 触发与执行方式
- **Codex / Ductor / OMX** 工作流节点触发
- **手动触发**：Node 脚本 `run_content_audit.js`
- **定期触发**：定时任务（如 cron 或 Windows Task Scheduler）

## 7️⃣ 备注
- 所有生成的内容文件必须经过 Cursor 审查后才能落地
- 审查报告可作为自动化生成、发布或修复的依据
- Governance 规则必须随系统更新及时更新 Cursor 校验逻辑

## Cursor Trigger Policy
Cursor只在以下情况启动：

1. Mission里程碑完成

2. Release前

3. Governance发现异常

4. OMX发现异常

其余时间保持静默