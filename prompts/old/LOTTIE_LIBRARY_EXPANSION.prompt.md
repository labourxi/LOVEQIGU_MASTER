# LOTTIE_LIBRARY_EXPANSION

你正在：
D:\LOVEQIGU_MASTER

目标：
扩展 Lottie Library，添加新的动画模板和效果。

注意：
- 不修改已有 V1/V2/V3 内容
- 新增内容仅在 Lottie Library 内
- 所有生成内容必须通过：
  - Cursor 审查
  - Governance V2 校验
  - OMX 校验
  - Ductor 调度

---

生成内容：
- 5 个新的 Lottie 动画模板
- 每个模板包含动画描述、参数、循环效果和触发条件
- 文件写入：
  - CONTENT_ENGINE/LOTTIE_LIBRARY/lottie_templates_v1.yaml

---

校验：
- 检查 forbidden fields（reward, rarity, wish_value）不存在
- 检查 Canon/Terminology 一致性
- 生成 Cursor 审查报告：
  - docs/LOTTIE_LIBRARY_CURSOR_AUDIT_REPORT.md
- 生成 Governance V2 报告：
  - docs/LOTTIE_LIBRARY_GOVERNANCE_REPORT.md

---

最终输出：
LOTTIE_LIBRARY_EXPANSION_COMPLETE = YES