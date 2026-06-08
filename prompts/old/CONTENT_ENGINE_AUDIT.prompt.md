# LOVEQIGU_CONTENT_ENGINE 审计与补全

你现在在 LOVEQIGU_MASTER/CONTENT_ENGINE 目录。

任务：

1. 扫描 CONTENT_ENGINE 目录下的现有文件和子目录：

   * CONTENT_ATOM_SCHEMA.yaml
   * AR_EVENT_TEMPLATE.yaml
   * TOKEN_TEMPLATE.yaml
   * COLLECTIBLE_TEMPLATE.yaml
   * ATOM_LIBRARY/
   * TOKEN_LIBRARY/
   * COLLECTIBLE_LIBRARY/
   * AR_EVENT_LIBRARY/

2. 列出缺失的文件或目录。

3. 对缺失的 YAML 文件，生成符合 V1 模板的初始内容：

   * Atom：至少 10 个基础原子（EMOTION/ SYMBOL/ RITUAL）
   * 信物：至少 5 个
   * 数字藏品：至少 3 个
   * AR事件：至少 5 个

4. 保留已有文件内容，不覆盖。

5. 输出最终审计报告：

   * 已存在文件
   * 已创建文件
   * 缺失但未创建文件（如有）

6. 最终输出：

```text
LOVEQIGU_CONTENT_ENGINE_AUDIT_COMPLETE = YES
```

约束：

* 信物 = 剧情推进资产
* 数字藏品 = 营销传播资产
* 禁止混用
* 使用心愿值、合真、回响、祝禁
* 不使用愿力、归真、回应、祝由
