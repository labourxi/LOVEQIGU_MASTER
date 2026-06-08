# RC2_BASELINE_TAG_AND_ARCHIVE

你正在：

D:\LOVEQIGU_MASTER

背景：

LOVEQIGU 已完成：

- RC2_ACCEPTANCE_AUDIT
- RC2_ACCEPTANCE_FREEZE

状态：

RELEASE_READY = YES

---

目标：

建立 RC2 正式基线。

确保未来开发不会丢失当前已验证版本。

---

步骤1

检查 Git 仓库状态。

输出：

- 当前分支
- 当前 Commit Hash
- 是否存在未提交文件

---

步骤2

生成：

docs/RC2_BASELINE_RECORD.md

内容：

- Freeze 时间
- Git Branch
- Git Commit
- RC2状态
- RELEASE_READY状态

---

步骤3

整理归档：

docs/RC2_FREEZE_BASELINE.md

docs/RC2_FREEZE_CHANGELOG.md

docs/RC2_FREEZE_RISKS.md

docs/RC2_FREEZE_RELEASE_READINESS.md

docs/RC2_FREEZE_SUMMARY.md

docs/RC2_ACCEPTANCE_AUDIT_REPORT.md

形成：

docs/RC2_BASELINE_INDEX.md

---

步骤4

生成建议 Tag：

vRC2_FREEZE

如果仓库允许：

生成命令：

git tag vRC2_FREEZE

不要 push。

不要创建远程 Tag。

---

步骤5

生成：

docs/RC2_NEXT_PHASE_RECOMMENDATION.md

内容：

当前阶段：

RELEASE_READY

推荐下一阶段：

1. 真实手机扫码验收
2. TestFlight/灰度验证（如适用）
3. MISSION_006

按优先级排序。

---

步骤6

生成最终报告：

docs/RC2_BASELINE_ARCHIVE_REPORT.md

内容：

- 当前版本状态
- 已归档文件
- Tag建议
- 下一阶段建议

最后输出：

RC2_BASELINE_TAG_AND_ARCHIVE_COMPLETE = YES