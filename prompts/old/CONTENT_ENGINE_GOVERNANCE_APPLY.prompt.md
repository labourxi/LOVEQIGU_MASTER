# LOVEQIGU_CONTENT_ENGINE_GOVERNANCE_APPLY

你正在：

D:\LOVEQIGU_MASTER

任务：

将 Governance V1 实际应用到 CONTENT_ENGINE。

不要新增内容。

不要生成新的 Atom。

不要生成新的信物。

不要生成新的数字藏品。

本次只治理。

---

# 第一步

扫描：

CONTENT_ENGINE/

全部 YAML 文件。

---

# 第二步

生成：

docs/CONTENT_ENGINE_GOVERNANCE_REPORT.md

包含：

1. Atom数量
2. Token数量
3. Collectible数量
4. AR Event数量

---

# 第三步

检查违规字段

检查：

rarity

reward

wish_value

tier

level

grade

rank

如果存在：

列入报告。

不要自动删除。

---

# 第四步

建立治理规则文件

创建：

governance/content_engine_rules.yaml

内容：

* 信物属于剧情系统
* 数字藏品属于传播系统
* 禁止混用
* 禁止剧情依赖数字藏品
* 禁止数字藏品解锁章节
* Canon优先级最高
* Terminology必须通过检查

---

# 第五步

建立自动校验脚本

创建：

scripts/governance/check_content_engine.js

功能：

扫描：

CONTENT_ENGINE/

发现：

rarity
reward
level
grade
rank

输出：

PASS

或

FAIL

---

# 第六步

执行校验

运行：

node scripts/governance/check_content_engine.js

---

# 第七步

输出报告

最后输出：

CONTENT_ENGINE_GOVERNANCE_APPLIED = YES

以及：

发现违规数：

X

修复数：

Y

未修复数：

Z

不要修改现有内容。

只建立治理能力。
