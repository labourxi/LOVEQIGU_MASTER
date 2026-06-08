# CONTENT_ENGINE_GOVERNANCE_V2

你正在：

D:\LOVEQIGU_MASTER

目标：

修复和优化 Content Engine Governance 脚本到 V2。

---

步骤：

1. 扫描所有 CONTENT_ENGINE 文件：

ATOM_LIBRARY, TOKEN_LIBRARY, COLLECTIBLE_LIBRARY, AR_EVENT_LIBRARY

2. 校验字段：

* 信物 Token：禁止 rarity、禁止 reward，允许存在其他模板字段
* 数字藏品 Collectible：允许 presentation_tier、允许 reward / wish_value
* Atom：禁止 reward 或 rarity
* AR Event：reward 字段区分信物/数字藏品奖励，next_event 链接完整

3. 修改 Governance 校验逻辑（脚本）：

* scripts/governance/check_content_engine.js → V2
* 修正误判逻辑
* 增加 Cursor 审查兼容性
* 输出报告 docs/CONTENT_ENGINE_GOVERNANCE_V2_REPORT.md

4. 不修改内容文件，只修改 Governance 脚本

5. 输出标识：

```text
CONTENT_ENGINE_GOVERNANCE_V2_COMPLETE = YES
```

6. 保留旧版本脚本备份（scripts/governance/check_content_engine_v1.js.bak）
