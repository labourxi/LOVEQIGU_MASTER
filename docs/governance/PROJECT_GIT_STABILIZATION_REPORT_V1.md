# PROJECT_GIT_STABILIZATION_REPORT_V1

```yaml
batch: PROJECT_GIT_STABILIZATION_V1
baseline_date: 2026-06-16
baseline_tag: PROJECT_BASELINE_20260616
executor: Cursor
```

---

## 1. 变更审计（审计前）

| 类别 | 数量 |
|------|------|
| 变更条目总数 | 429 |
| 未跟踪 (??) | 364 |
| 已修改 (M) | 60 |
| 已删除 (D) | 5 |

### 按顶层目录分布

| 目录 | 条目数 |
|------|--------|
| docs/ | 218 |
| apps/ | 95 |
| data/ | 46 |
| prompts/ | 35 |
| scripts/ | 17 |
| 其他 | 18 |

---

## 2. 五批提交记录

| # | 批次 | Commit | 文件数 | 说明 |
|---|------|--------|--------|------|
| 1 | **Governance** | `67b0896` | 1256 | registry · health baseline · miniapp 平台 · orchestrator · scripts · `.cursorignore` |
| 2 | **Admin** | `6c68ba7` | 88 | `docs/admin/` · `apps/admin/` 全栈后台 |
| 3 | **Activity** | `6d81df7` | 62 | merchant-event · event_lifecycle · park/merchant 数据 |
| 4 | **AR** | `d7491bd` | 29 | AR 数据 · runtime · `docs/activity/` 恢复文档 · ar-entry |
| 5 | **ART** | `0e2c949` | 430 | art canon · assets · star-map · meridian · lottie 等 |
| + | 补充 | `e1644c2` | 17 | platform_admin 数据 · merchant_portal 脚本（批次遗漏补交） |

```text
Governance → Admin → Activity → AR → ART → Supplement
```

---

## 3. .cursorignore

已创建：`.cursorignore`

排除项包括：

- `node_modules/` · 构建产物 · Python 缓存
- `apps/miniapp/.cloudbase/`
- `data/relics/generated/` · `data/story/generated/`
- OMX / Ductor 本地输出
- `.git_batch_*.txt` 临时列表

---

## 4. Tag

```yaml
tag: PROJECT_BASELINE_20260616
type: annotated
points_to: be7fbf2
message: PROJECT_BASELINE_20260616: post-recovery git stabilization baseline
verified: YES
```

---

## 5. 稳定化后 Git 状态

| 指标 | 审计前 | 审计后 |
|------|--------|--------|
| GIT_DIRTY_ENTRIES | 429 | **1** |
| 未提交批次文件 | — | 0（已清理） |
| 保留未跟踪 | — | `docs/beiwang/` 备忘 1 条（非基线资产） |

```yaml
GIT_DIRTY_ENTRIES: 1
GIT_DIRTY_STATUS: PASS (< 50)
```

---

## 6. 恢复批次验证

`DOCUMENT_RECOVERY_BATCH_V1` 恢复文档均已纳入提交：

| 文件 | 提交 |
|------|------|
| `ACTIVITY_BLESSING_VISUAL_GUIDELINE_V1.md` | `d7491bd` |
| `ACTIVITY_VISUAL_ASSET_PACK_V1.md` | `d7491bd` |
| `ADMIN_UI_COMPONENT_LIBRARY_V1.md` | `6c68ba7` |
| `ADMIN_HIGH_FIDELITY_UI_V1.md` | `6c68ba7` |
| `ADMIN_VISUAL_ASSET_PACK_V1.md` | `6c68ba7` |
| `ADMIN_REAL_SCREEN_PROTOTYPE_V1.md` | `6c68ba7` |
| `registry/runtime_registry.json` | `67b0896` |

---

## 7. 风险评估

### P1

| 项 | 说明 |
|----|------|
| 补充提交 `e1644c2` | platform_admin / merchant_portal 原应归入 Activity 批次，已补交 |
| `docs/admin/LOVEQIGU_MASTER.lnk` | Windows 快捷方式已纳入 Admin 提交，跨平台克隆需注意 |

### P2

| 项 | 说明 |
|----|------|
| `docs/beiwang/` 未纳入基线 | 个人备忘，保留未跟踪 |
| Tag 未 push | 本地 tag 已创建，远程同步需手动 `git push --tags` |

---

## 8. 验收

| 验收项 | 结果 |
|--------|------|
| 五批提交完成 | PASS |
| `.cursorignore` 存在 | PASS |
| `PROJECT_BASELINE_20260616` tag 存在 | PASS |
| `GIT_DIRTY_ENTRIES < 50` | PASS (1) |

```yaml
PROJECT_GIT_STABILIZATION_V1_COMPLETE: YES
PROJECT_BASELINE_20260616: EXISTS
STATUS: PASS
```
