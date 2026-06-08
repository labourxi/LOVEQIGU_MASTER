# DUCTOR_GOVERNANCE_V2_COMPATIBILITY_FIX

你正在：

D:\LOVEQIGU_MASTER

目标：

修复 Ductor 与 Governance V2 的兼容问题。

注意：

不要修改任何 Content Engine 内容。

不要生成新 Atom。

不要生成新 Token。

不要生成新 Collectible。

不要生成新 AR Event。

本次只修自动化接口。

---

# 第一步

检查：

scripts/ductor/run_content_engine_pipeline.js

定位：

parseGovernanceOutput()

相关逻辑。

---

# 第二步

检查：

scripts/governance/check_content_engine.js

确认：

Governance V2 输出格式。

包括：

PASS

FAIL

WARN

summary

findings

violations

compatibility notes

---

# 第三步

修改：

scripts/ductor/run_content_engine_pipeline.js

使其兼容：

Governance V2

要求：

1.

能够正确识别：

PASS

FAIL

WARN

---

2.

能够读取：

真实违规数量

而不是旧版 grep 结果

---

3.

当发现：

真实 FAIL

Pipeline FAIL

---

4.

当发现：

仅 WARN

Pipeline PASS_WITH_WARNING

---

# 第四步

修复：

Governance Report 中：

Warnings: 1

但：

WARN Section = None

的不一致问题。

要求：

报告统计与报告正文一致。

---

# 第五步

执行：

Ductor Pipeline Mock Run

验证：

Codex
↓
Cursor
↓
Governance V2
↓
OMX
↓
Ductor

完整链路。

---

# 第六步

生成：

docs/DUCTOR_GOVERNANCE_V2_FIX_REPORT.md

包含：

修复项

兼容项

测试结果

---

# 第七步

输出：

DUCTOR_GOVERNANCE_V2_COMPATIBILITY_FIXED = YES

并输出：

Pipeline Status

PASS
PASS_WITH_WARNING
FAIL

三选一。

---

禁止：

修改任何 Content Engine 内容文件。
