# LOVEQIGU Autopilot V1

> **文件标识**：`LOVEQIGU_AUTOPILOT_V1.md`  
> **版本**：V1.0  
> **日期**：2026-06-08  
> **状态**：Active · CHxx 内容生产线自动化  
> **Mission**：66 · `LOVEQIGU_AUTOPILOT_V1`

---

## §0 定位

Autopilot V1 自动化 **CHxx 四层 JSON + Digital Collectible 登记** 的生产线，复用 CH01→CH03 已验证工厂。

```text
[HUMAN] Content Canon 方向稿冻结
        ↓
[AUTO]  L2 Placeholder Create
        ↓
[AUTO]  Content Fill（Story / Relic / Rights / AR）
        ↓
[AUTO]  Content Audit
        ↓
[AUTO]  Chapter Linking（prev → next）
        ↓
[AUTO]  Digital Collectible Registration
        ↓
[AUTO]  Final Audit + Freeze Prep
        ↓
[HUMAN] 基线提交 / 冻结裁决
```

**Autopilot 不做：** Canon 扩写 · Lore 发明 · Gap 填补 · Git 提交（除非人工明确授权）

---

## §1 流水线阶段

| Stage | ID | 自动化 | 产出 |
|-------|-----|:------:|------|
| 1 | `CANON_CHECK` | 半自动 | 检查 `CHxx_CONTENT_CANON_V1.md` 存在 |
| 2 | `PLACEHOLDER` | **自动** | `data/story/chxx_chapters.json` 等 4 文件壳 |
| 3 | `FILL` | **自动** | 5 节点 · 6 信物 · 5 权益 · 6 AR |
| 4 | `AUDIT` | **自动** | 结构 / 跨层 / Canon / 边界 |
| 5 | `LINK` | **自动** | 上一章 `next_chapter` 接线 |
| 6 | `DC_REGISTER` | **自动** | `DIGITAL_COLLECTIBLE_REGISTRY_CHxx.md` |
| 7 | `FINAL_AUDIT` | **自动** | 含 DC 的五层终审 |
| 8 | `FREEZE_PREP` | **自动** | `CHxx_FINAL_FREEZE_REPORT.md` |
| 9 | `BASELINE_COMMIT` | **人工** | Git commit / tag |

---

## §2 人工裁决点（Human Gates）

| Gate | 触发 | Autopilot 行为 |
|------|------|----------------|
| **G-CANON** | 启动 `--run` 前 | 无 Canon 文件 → **STOP** · 通知用户 |
| **G-FILL** | Manifest 缺必填字段 | **STOP** · 通知用户补 manifest |
| **G-AUDIT-FAIL** | 审计 Fail > 0 | **STOP** · 输出报告 · 不进入 LINK/DC |
| **G-FREEZE** | Freeze Prep 完成后 | **PAUSE** · 通知用户裁决是否提交 |
| **G-NEXT-CHAPTER** | 生成新章 Canon | **STOP** · Content Canon 须人工起草 |

> V1 原则：**仅在上表节点通知用户**；其余阶段静默执行并写报告。

---

## §3 章节注册表

见 [`automation/chapters/registry.yaml`](../../automation/chapters/registry.yaml)

| CH | id | album | story file |
|----|-----|-------|------------|
| 01 | `ch01_cloud_awakening` | A | `data/story/chapters.json` |
| 02 | `ch02_mountain_gate_echo` | B | `data/story/ch02_chapters.json` |
| 03 | `ch03_field_reunion` | C | `data/story/ch03_chapters.json` |

---

## §4 执行方式

### 4.1 全章校验（只读）

```bash
python scripts/autopilot/run_chapter_autopilot.py validate --all
```

### 4.2 单章完整流水线（需 manifest + canon）

```bash
python scripts/autopilot/run_chapter_autopilot.py run --chapter 03
```

### 4.3 Ductor 编排

```bash
node scripts/ductor/run_chapter_autopilot.js
```

Workflow: [`ductor/workflows/chapter_content_autopilot.yaml`](../../ductor/workflows/chapter_content_autopilot.yaml)

---

## §5 工厂常量

| 项 | 值 |
|----|-----|
| 节点数 | 5 |
| 信物数 | 6 |
| 权益数 | 5 |
| AR 事件数 | 6 |
| 觉察结构 | five_awareness |
| 印谱 | 每章独立 A/B/C/… |

---

## §6 边界（继承 AGENTS.md）

- Relic ≠ Digital Collectible  
- Rights = L1 · 仪式链隔离  
- 禁止术语：打卡 · 成就 · 升级 · 抽卡 · 归真 · 回应 · 祝由 · 积分商城  
- 不新增神明 / 文明 / 组织 / Lore  

---

## §7 修订记录

| 版本 | 日期 | 说明 |
|------|------|------|
| V1.0 | 2026-06-08 | 首版：CHxx 八阶段 Autopilot · Mission 66 |

---

`LOVEQIGU_AUTOPILOT_V1_SPEC_COMPLETE = YES`
