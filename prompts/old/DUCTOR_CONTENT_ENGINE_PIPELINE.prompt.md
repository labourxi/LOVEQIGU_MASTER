# DUCTOR_CONTENT_ENGINE_PIPELINE

你正在：

D:\LOVEQIGU_MASTER

目标：

将 Content Engine 自动化流程正式接入 Ductor。

注意：

不要新增内容。

不要生成新的 Atom。

不要生成新的 Token。

不要生成新的 Collectible。

不要生成新的 AR Event。

本次只建立调度能力。

---

第一步

检查：

ductor/

当前目录结构。

输出：

现有 Workflow 列表。

---

第二步

创建：

ductor/workflows/content_engine_pipeline.yaml

定义：

Stage 1

Content Scan

执行：

scripts/cursor/run_content_audit.js

---

Stage 2

Governance Check

执行：

scripts/governance/check_content_engine.js

---

Stage 3

OMX Check

执行：

scripts/omx/run_omx_checks.js

---

Stage 4

Report

汇总：

docs/

中的：

* CONTENT_ENGINE_CURSOR_AUDIT_REPORT.md
* CONTENT_ENGINE_GOVERNANCE_REPORT.md

生成：

docs/CONTENT_ENGINE_PIPELINE_REPORT.md

---

第三步

创建：

docs/DUCTOR_PIPELINE_DESIGN.md

内容：

说明：

Content Engine Pipeline

执行顺序：

Codex
↓
Cursor
↓
Governance
↓
OMX
↓
Ductor Report

---

第四步

执行一次模拟运行

不要修改内容。

只验证：

流程是否能串联。

---

第五步

输出：

DUCTOR_CONTENT_ENGINE_PIPELINE_READY = YES

并输出：

Workflow Count

Pipeline Status

PASS / FAIL
