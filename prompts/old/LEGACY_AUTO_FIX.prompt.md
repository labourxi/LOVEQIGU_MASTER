# LEGACY_AUTO_FIX

你正在：

D:\LOVEQIGU_MASTER

目标：

自动修复 LEGACY_CLEANUP_INVENTORY 中标记为 Auto Fix Candidates 的违规项。

规则：

1. 只修改 LEGACY 内容，不触碰 V3 / AR V2 / Lottie / Digital Collectible 内容。
2. 修复的对象：
   - Atom Violations (Group A)
   - Relic Token Violations (Group A)
3. 不新增内容，不修改 Canon。
4. 修复后，生成：
   - docs/LEGACY_AUTO_FIX_REPORT.md
   - 更新 CONTENT_ENGINE 对应 YAML 文件
5. 保持 Governance / Cursor / OMX / Ductor 自动化兼容。
6. 最终输出：
   LEGACY_AUTO_FIX_COMPLETE = YES