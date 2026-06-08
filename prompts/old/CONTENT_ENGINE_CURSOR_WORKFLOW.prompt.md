# LOVEQIGU_CONTENT_ENGINE_CURSOR_WORKFLOW

你现在在 D:\LOVEQIGU_MASTER。

目标：

1. 将 Cursor 审查机制嵌入 Content Engine 的 Ductor 和 OMX Workflow。
2. 定义节点触发条件：

   * 初次落地（V1/V2 内容生成完成后）
   * 批量生成（V3 扩展内容完成后）
   * 工作流执行后（Ductor / OMX 完成）
   * 定期维护（每周一次自动触发）
3. Cursor 审查内容：

   * 扫描 Atom / Token / Collectible / AR Event YAML 文件
   * 校验 Governance 规则
   * 检查字段完整性和格式
   * 标记违规或潜在问题
4. 输出报告：

   * Markdown / JSON
   * PASS / FAIL / WARN
   * 标记 LOVEQIGU_CONTENT_ENGINE_CURSOR_AUDIT_COMPLETE = YES
5. 在 Ductor / OMX Workflow 中增加触发节点：

   * 所有新生成或更新内容必须经过 Cursor 审查节点
   * Cursor 审查通过后才能继续后续自动化流程
6. 可选：

   * 对低风险违规给出修复建议
   * 高风险问题需人工确认，不自动修复
7. 输出执行日志：

   * 审查时间
   * 审查文件数量
   * 发现问题统计
   * 完成标识

最终输出标识：

```text
LOVEQIGU_CONTENT_ENGINE_CURSOR_WORKFLOW_READY = YES
```
