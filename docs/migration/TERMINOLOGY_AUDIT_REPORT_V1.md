# TERMINOLOGY_AUDIT_REPORT_V1

# 术语合规只读审查报告 V1

```yaml
audit_id: QODER_READ_ONLY_AUDIT_V1
audit_date: 2026-06-16
scope:
  - data/story/
  - data/relics/
  - data/ar/
  - data/rights/
reference: LOVEQIGU_TERMINOLOGY_V1
mode: READ_ONLY
files_scanned: 46
```

---

## 1. 扫描范围

| 目录 | JSON 文件数 | 说明 |
|------|-------------|------|
| `data/story/` | 13 | chapters · ch02–ch10 · generated/* |
| `data/relics/` | 13 | relics.json · ch02–ch10 · generated/* |
| `data/ar/` | 10 | ar-events.json · ch02–ch10 |
| `data/rights/` | 10 | rights.json · ch02–ch10 |
| **合计** | **46** | 未扫描 `apps/miniapp/data/` · `docs/canon/` · `CONTENT_ENGINE/` |

**说明**：`data/` 下无 `ch01_*.json`（ch01 仅存在于 `apps/miniapp/data/` · 不在本次 scope）。

---

## 2. 违禁词扫描摘要

| 违禁词 / 违规类型 | 命中文件数 | 命中次数（约） |
|-------------------|------------|----------------|
| 任务中心 | 0 | 0 |
| 打卡 | 0 | 0 |
| 成就 | 0 | 0 |
| 称号 | 0 | 0 |
| 成长 | 0 | 0 |
| 获得 | 29 | 38 |
| L1/L3 混合（探索记念 + 心愿值同句） | 10 | 10 |
| 心愿值 +（字面加号句式） | 0 | 0 |

`data/story/`：**零命中** · 术语合规。

---

## 3. 违规明细

### 3.1 「获得」· L3 语境禁词残留（否定句式）

语境为 L3 仪式/信物/AR 描述 · 虽为「不是获得…」否定结构 · 仍含禁词 **获得** · 建议改写为不含「获得」的否定表达。

| 文件路径 | 违禁词/违规类型 | 原始文案片段 | 建议替换/拆分方案 | 所在层级 |
|----------|-----------------|--------------|-------------------|----------|
| `data/relics/ch02_relics.json` | 获得（L3 禁词残留） | `…不是获得新力量。` | 改为「不是向外索取新力量，而是辨认回响被记存」或「世界留下回响，而非新力量」 | L3 |
| `data/relics/ch03_relics.json` | 获得（L3 禁词残留） | `…不是获得新力量。` | 同上 · 保留「想起连接曾被记存」主句 | L3 |
| `data/relics/ch04_relics.json` | 获得（L3 禁词残留） | `…不是获得新力量。` | 同上 | L3 |
| `data/relics/ch05_relics.json` | 获得（L3 禁词残留） | `…不是获得新力量。` | 同上 | L3 |
| `data/relics/ch06_relics.json` | 获得（L3 禁词残留） | `不是获得新的答案，而是看见已经发生的改变。` | 改为「不是向外求答案，而是看见已经发生的改变」 | L3 |
| `data/relics/ch06_relics.json` | 获得（L3 禁词残留） | `awareness_line`: 同上 | 与 description 同步改写 | L3 |
| `data/relics/ch06_relics.json` | 获得（L3 禁词残留） | `…不是获得新力量。` | 同 ch02 方案 | L3 |
| `data/relics/ch07_relics.json` | 获得（L3 禁词残留） | `…不是获得新力量。` | 同 ch02 方案 | L3 |
| `data/relics/ch08_relics.json` | 获得（L3 禁词残留） | `…不是获得新力量。` | 同 ch02 方案 | L3 |
| `data/relics/ch09_relics.json` | 获得（L3 禁词残留） | `…不是获得新力量。` | 同 ch02 方案 | L3 |
| `data/relics/ch10_relics.json` | 获得（L3 禁词残留） | `…不是获得新力量。` | 同 ch02 方案 | L3 |
| `data/ar/ch02_ar-events.json` | 获得（L3 禁词残留） | `…不是获得新力量——符者，记念也，非咒也。` | 同 relics 改写 · 保留符者句 | L3 |
| `data/ar/ch03_ar-events.json` | 获得（L3 禁词残留） | `…不是获得新力量——…` | 同上 | L3 |
| `data/ar/ch04_ar-events.json` | 获得（L3 禁词残留） | `…不是获得新力量——…` | 同上 | L3 |
| `data/ar/ch05_ar-events.json` | 获得（L3 禁词残留） | `…不是获得新力量——…` | 同上 | L3 |
| `data/ar/ch06_ar-events.json` | 获得（L3 禁词残留） | `不是获得新的答案，而是看见已经发生的改变。` | 同 ch06 relics | L3 |
| `data/ar/ch06_ar-events.json` | 获得（L3 禁词残留） | `…不是获得新力量——…` | 同 ch02 方案 | L3 |
| `data/ar/ch07_ar-events.json` | 获得（L3 禁词残留） | `…不是获得新力量——…` | 同上 | L3 |
| `data/ar/ch08_ar-events.json` | 获得（L3 禁词残留） | `…不是获得新力量——…` | 同上 | L3 |
| `data/ar/ch09_ar-events.json` | 获得（L3 禁词残留） | `…不是获得新力量——…` | 同上 | L3 |
| `data/ar/ch10_ar-events.json` | 获得（L3 禁词残留） | `…不是获得新力量——…` | 同上 | L3 |

---

### 3.2 「获得」· L1 商业语境（领取限制）

字段多为 `description` · 条目类型为结缘礼/券 · 建议 L1 使用「领取」而非「获得」。

| 文件路径 | 违禁词/违规类型 | 原始文案片段 | 建议替换/拆分方案 | 所在层级 |
|----------|-----------------|--------------|-------------------|----------|
| `data/rights/rights.json` | 获得 | `同账号仅可获得一次。` | `同账号仅可领取一次。` | L1 |
| `data/rights/ch02_rights.json` | 获得 | `同账号仅可获得一次。` | 同上 | L1 |
| `data/rights/ch03_rights.json` | 获得 | `同账号仅可获得一次。` | 同上 | L1 |
| `data/rights/ch04_rights.json` | 获得 | `同账号仅可获得一次。` | 同上 | L1 |
| `data/rights/ch05_rights.json` | 获得 | `同账号仅可获得一次。` | 同上 | L1 |
| `data/rights/ch06_rights.json` | 获得 | `同账号仅可获得一次。` | 同上 | L1 |
| `data/rights/ch07_rights.json` | 获得 | `同账号仅可获得一次。` | 同上 | L1 |
| `data/rights/ch08_rights.json` | 获得 | `同账号仅可获得一次。` | 同上 | L1 |
| `data/rights/ch09_rights.json` | 获得 | `同账号仅可获得一次。` | 同上 | L1 |
| `data/rights/ch10_rights.json` | 获得 | `同账号仅可获得一次。` | 同上 | L1 |

---

### 3.3 L1/L3 语言层级混合（心愿值 + 世界观词汇同句）

同一句同时出现 **探索记念**（L3）与 **心愿值**（L1）· 违反 L1/L3 拆分原则 · 无字面「心愿值 +」但属同类违规。

| 文件路径 | 违禁词/违规类型 | 原始文案片段 | 建议替换/拆分方案 | 所在层级 |
|----------|-----------------|--------------|-------------------|----------|
| `data/rights/rights.json` | L1/L3 混合 | `探索记念与心愿值记存达成后，可在结缘商城…` | **拆句**：L3「探索记念已达成」+ L1「心愿值记存已满足，可在权益中心…」 | L1+L3 |
| `data/rights/ch02_rights.json` | L1/L3 混合 | `《山门回响》探索记念与心愿值记存达成后…` | 同上 | L1+L3 |
| `data/rights/ch03_rights.json` | L1/L3 混合 | `《再度重逢》探索记念与心愿值记存达成后…` | 同上 | L1+L3 |
| `data/rights/ch04_rights.json` | L1/L3 混合 | `《田野初醒》探索记念与心愿值记存达成后…` | 同上 | L1+L3 |
| `data/rights/ch05_rights.json` | L1/L3 混合 | `《场域归位》探索记念与心愿值记存达成后…` | 同上 | L1+L3 |
| `data/rights/ch06_rights.json` | L1/L3 混合 | `《归位觉醒》探索记念与心愿值记存达成后…` | 同上 | L1+L3 |
| `data/rights/ch07_rights.json` | L1/L3 混合 | `《回响之路》探索记念与心愿值记存达成后…` | 同上 | L1+L3 |
| `data/rights/ch08_rights.json` | L1/L3 混合 | `《传承之路》探索记念与心愿值记存达成后…` | 同上 | L1+L3 |
| `data/rights/ch09_rights.json` | L1/L3 混合 | `《未来之约》探索记念与心愿值记存达成后…` | 同上 | L1+L3 |
| `data/rights/ch10_rights.json` | L1/L3 混合 | `《创新之路》探索记念与心愿值记存达成后…` | 同上 | L1+L3 |

**备注**：同文件 `redemption.copy` 中「你已积累足够心愿值…」为 **纯 L1** · 无 L3 词汇 · **不记为违规**。

---

## 4. 未命中项（合规）

以下违禁词在 scope 内 **零命中**：

```text
任务中心 · 打卡 · 成就 · 称号 · 成长 · 心愿值 +（字面句式）
```

`data/story/` 全部 13 个 JSON 文件：**无违规**。

`data/relics/relics.json` · `data/ar/ar-events.json` · `data/story/chapters.json` · `data/*/generated/*.json`：**无违规**。

---

## 5. 审查结论

```yaml
overall_result: PASS_WITH_FINDINGS
total_violations: 48
critical_paths:
  - data/relics/ch0*_relics.json  # L3 获得禁词残留
  - data/ar/ch0*_ar-events.json   # L3 获得禁词残留
  - data/rights/ch0*_rights.json  # L1 获得 + L1/L3 混合
  - data/rights/rights.json
recommended_action: TERMINOLOGY_MIGRATION_BATCH_V1
priority: P1
```

---

## 6. 变更确认

本次审查 **仅新增**：

- `docs/migration/TERMINOLOGY_AUDIT_REPORT_V1.md`
- `docs/migration/QODER_EXECUTION_LOG.md`

**未修改** `data/` 下任何 JSON 文件。
