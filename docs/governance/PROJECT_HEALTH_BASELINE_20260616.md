# PROJECT_HEALTH_BASELINE_V1

# 项目健康基线 · 2026-06-16

```yaml
batch: PROJECT_HEALTH_BASELINE_V1
baseline_date: 2026-06-16
executor: Cursor
post_recovery: DOCUMENT_RECOVERY_BATCH_V1
output_file: docs/governance/PROJECT_HEALTH_BASELINE_20260616.md
```

---

## 1. 项目文件统计

统计范围：`docs/` · `assets/` · `registry/` · `data/` · `runtime/`

| 目录 | 文件数 |
|------|--------|
| `docs/` | 598 |
| `assets/` | 116 |
| `registry/` | 1 |
| `data/` | 103 |
| `runtime/` | 17 |
| **合计** | **835** |

```yaml
TOTAL_FILE_COUNT: 835
```

---

## 2. 索引统计

### 索引存在性

| 索引 | 路径 | 状态 |
|------|------|------|
| ADMIN_INDEX_V1 | `docs/admin/ADMIN_INDEX_V1.md` | FOUND · ACTIVE |
| ACTIVITY_INDEX_V1 | `docs/activity/ACTIVITY_INDEX_V1.md` | FOUND · ACTIVE |
| ART_INDEX_V1 | `docs/art/ART_INDEX_V1.md` | FOUND · ACTIVE (V1.3) |
| WORLD_CANON_INDEX_V1 | `docs/product/world/WORLD_CANON_INDEX_V1.md` | FOUND · ACTIVE |
| AR_PRODUCT_INDEX_V1 | `docs/product/ar/AR_PRODUCT_INDEX_V1.md` | FOUND · ACTIVE |

### CURRENT_ACTIVE 文档指针（按索引）

| 索引 | ACTIVE_DOCUMENT_COUNT |
|------|----------------------|
| ADMIN_INDEX_V1 | 6 |
| ACTIVITY_INDEX_V1 | 2 |
| AR_PRODUCT_INDEX_V1 | 1 |
| ART_INDEX_V1 | 1 |
| WORLD_CANON_INDEX_V1 | 2 |
| **合计** | **12** |

```yaml
ACTIVE_DOCUMENT_COUNT: 12
```

#### ADMIN_INDEX_V1 · CURRENT_ACTIVE

- `ADMIN_OPERATION_VISUAL_SYSTEM_V1` (FROZEN)
- `ADMIN_UI_COMPONENT_LIBRARY_V1` (FROZEN)
- `ADMIN_OPERATION_DASHBOARD_SPEC_V1.1` (REVIEW)
- `ADMIN_HIGH_FIDELITY_UI_V1` (FROZEN)
- `ADMIN_VISUAL_ASSET_PACK_V1` (FROZEN)
- `ADMIN_REAL_SCREEN_PROTOTYPE_V1` (FROZEN)

#### ACTIVITY_INDEX_V1 · CURRENT_ACTIVE

- `ACTIVITY_BLESSING_VISUAL_GUIDELINE_V1` (FROZEN)
- `ACTIVITY_VISUAL_ASSET_PACK_V1` (FROZEN)

#### AR_PRODUCT_INDEX_V1 · CURRENT_ACTIVE

- `AR_INTERACTION_ARCHITECTURE_V1.1` (FROZEN)

#### ART_INDEX_V1 · Current Active

- `FOUR_SYMBOL_VISUAL_SYSTEM_V1.1` (ACTIVE · Frozen YES · Current Active YES)

#### WORLD_CANON_INDEX_V1 · Active / Frozen

- `FOUR_SYMBOL_VISUAL_SYSTEM_V1.1` (ACTIVE · Frozen YES · Current Active YES)
- `VISUAL_AUTOPILOT_PIPELINE_V1` (ACTIVE · Frozen YES · Governance Layer)

---

## 3. Registry 统计

文件：`registry/runtime_registry.json`

```yaml
schema: loveqigu.runtime_registry.v1
batch: DOCUMENT_RECOVERY_BATCH_V1
updated_at: 2026-06-16T12:00:00Z
REGISTERED_DOCUMENT_COUNT: 16
ACTIVE_DOCUMENT_COUNT: 13
INDEX_ENTRIES: 4
```

### 注册表索引块

| 索引 ID | 路径 |
|---------|------|
| AR_FACTORY_INDEX_V1 | `docs/tech/ar_factory/AR_FACTORY_INDEX_V1.md` |
| ADMIN_INDEX_V1 | `docs/admin/ADMIN_INDEX_V1.md` |
| ACTIVITY_INDEX_V1 | `docs/activity/ACTIVITY_INDEX_V1.md` |
| AR_PRODUCT_INDEX_V1 | `docs/product/ar/AR_PRODUCT_INDEX_V1.md` |

> 注：`ART_INDEX_V1` · `WORLD_CANON_INDEX_V1` 尚未纳入 `runtime_registry.json` 索引块。

### Active 文档分布

| 模块 | 数量 |
|------|------|
| Admin | 6 |
| Activity | 2 |
| AR Product | 1 |
| AR Factory | 3 |
| Superseded (inactive) | 3 |

---

## 4. 恢复批次检查

批次：`DOCUMENT_RECOVERY_BATCH_V1`

| 文件 | 状态 |
|------|------|
| `docs/activity/visual/ACTIVITY_BLESSING_VISUAL_GUIDELINE_V1.md` | PASS |
| `docs/activity/visual/ACTIVITY_VISUAL_ASSET_PACK_V1.md` | PASS |
| `docs/admin/design_system/ADMIN_UI_COMPONENT_LIBRARY_V1.md` | PASS |
| `docs/admin/visual/ADMIN_HIGH_FIDELITY_UI_V1.md` | PASS |
| `docs/admin/visual/ADMIN_VISUAL_ASSET_PACK_V1.md` | PASS |
| `docs/admin/prototype/ADMIN_REAL_SCREEN_PROTOTYPE_V1.md` | PASS |

```yaml
DOCUMENT_RECOVERY_BATCH_V1: PASS
RECOVERED_FILES_VERIFIED: 6/6
```

---

## 5. 当前活跃体系

### CURRENT_ADMIN_SYSTEM

```text
东方运营控制台（Oriental Operations Console）
├── ADMIN_OPERATION_VISUAL_SYSTEM_V1        [FROZEN] · 视觉宪法
├── ADMIN_UI_COMPONENT_LIBRARY_V1           [FROZEN] · 组件库
├── ADMIN_HIGH_FIDELITY_UI_V1               [FROZEN] · 高保真 UI
├── ADMIN_VISUAL_ASSET_PACK_V1              [FROZEN] · 视觉资产包
├── ADMIN_REAL_SCREEN_PROTOTYPE_V1          [FROZEN] · 真机屏原型
└── ADMIN_OPERATION_DASHBOARD_SPEC_V1.1     [REVIEW] · 仪表盘规格
```

### CURRENT_ACTIVITY_SYSTEM

```text
福文化活动系统
├── ACTIVITY_BLESSING_VISUAL_GUIDELINE_V1   [FROZEN] · 活动视觉规范
└── ACTIVITY_VISUAL_ASSET_PACK_V1           [FROZEN] · 8 类活动资产库
```

### CURRENT_AR_SYSTEM

```text
AR 产品 + AR Factory
├── AR_INTERACTION_ARCHITECTURE_V1.1          [FROZEN] · C 端 AR 交互架构
├── LANDMARK_AR_AUTOGEN_PIPELINE_V1.1         [FROZEN] · 地标 AR 自动生成流水线
└── AR_FACTORY_RUNTIME_SCHEMA_V1.1            [FROZEN] · 运行时 Schema
```

### CURRENT_ART_SYSTEM

```text
ART 主链 + 四象视觉权威
├── ART_BIBLE_V1 → ART_02 → ART_03 → ART_03A/B/C → ART_04
└── FOUR_SYMBOL_VISUAL_SYSTEM_V1.1            [Current Active · ART_CORE_CANON]
```

---

## 6. Workspace 状态

### Index Status

| 项 | 状态 | 说明 |
|----|------|------|
| 文件系统索引 | PASS | 835 个目标目录文件可访问 |
| Cursor Codebase Index | MANUAL | 需通过 Command Palette → `Cursor: Reindex Workspace` 手动触发 |
| 恢复文档可检索 | PASS | 6/6 恢复文件已在工作区落盘 |

### Git Status

| 项 | 数值 |
|----|------|
| 变更条目总数 | 429 |
| 未跟踪 (??) | 364 |
| 已修改 (M) | 60 |
| 已删除 (D) | 5 |
| 工作区状态 | **DIRTY** |

> 大量 `docs/` · `apps/admin/` · `registry/` · `data/` 内容尚未提交。恢复批次文件处于未提交状态。

### Workspace Sync Status

| 项 | 状态 |
|----|------|
| 磁盘 ↔ 工作区 | SYNCED |
| 工作区 ↔ Git 远程 | OUT_OF_SYNC（本地大量未提交变更） |
| Registry ↔ 索引 | PARTIAL（ART / WORLD 索引未入 registry） |

---

## 7. 风险评估

### P0

| # | 风险项 | 影响 | 建议 |
|---|--------|------|------|
| P0-1 | Git 工作区高度脏（429 条变更） | 恢复成果与大量文档/代码无版本锚点，存在再次丢失风险 | 尽快分批 commit · 优先 `registry/` + 恢复文档 + 索引 |
| P0-2 | Registry 覆盖率偏低（16/598 docs 文件） | 多数文档未纳入运行时注册表，Agent 检索可能遗漏 | 扩展 `runtime_registry.json` 或建立自动同步脚本 |

### P1

| # | 风险项 | 影响 | 建议 |
|---|--------|------|------|
| P1-1 | `ADMIN_OPERATION_DASHBOARD_SPEC_V1.1` 仍为 REVIEW | 后台仪表盘规格未冻结，与已冻结 UI 链存在状态落差 | 安排冻结审查 |
| P1-2 | `ART_INDEX_V1` · `WORLD_CANON_INDEX_V1` 未入 registry 索引块 | 跨模块索引不一致 | 下一批次注册表扩展 |
| P1-3 | `ART_04_VISUAL_PROTOTYPE_V1` 扩展名 WARN (.txt) | ART 主链末端文件格式异常 | 核查并修正文件扩展名 |
| P1-4 | Cursor 索引需手动重建 | Agent 语义搜索可能引用恢复前旧索引 | 执行 Reindex Workspace |

### P2

| # | 风险项 | 影响 | 建议 |
|---|--------|------|------|
| P2-1 | 无 `.cursorignore` | 索引可能扫描冗余构建产物 | 按需创建排除规则 |
| P2-2 | `PROJECT_CONTEXT_REGISTRY_V1` 更新于 2026-06-10 | 项目协调索引可能滞后于当前文档树 | 刷新 PROJECT_CONTEXT 系列 |
| P2-3 | `prompts/old/ART_INDEX_V1.md` 与 `docs/art/ART_INDEX_V1.md` 并存 | 可能误导 Agent 加载旧索引 | 明确仅 `docs/art/` 为权威路径 |

---

## 8. 健康评分

### 评分明细

| 维度 | 权重 | 得分 | 说明 |
|------|------|------|------|
| 文件完整性 | 20% | 18 | 835 文件可访问 · 恢复批次 6/6 PASS |
| 索引健康 | 25% | 22 | 5 索引齐全 · 12 CURRENT_ACTIVE 指针 |
| Registry 健康 | 20% | 14 | 16 注册 · 13 active · 覆盖率待提升 |
| 恢复验证 | 20% | 20 | DOCUMENT_RECOVERY_BATCH_V1 全通过 |
| Workspace / Git | 15% | 8 | 磁盘同步 OK · Git 高度脏 · 索引需手动重建 |
| **合计** | **100%** | **82** | |

```yaml
PROJECT_HEALTH_SCORE: 82
PROJECT_HEALTH_STATUS: PASS
```

> PASS 判定：恢复文档齐全 · 索引与注册表可用 · 存在 P0/P1 风险但不阻断基线建立。

---

## 9. 基线快照摘要

```yaml
baseline_date: 2026-06-16
total_files: 835
index_active_documents: 12
registry_documents: 16
registry_active_documents: 13
recovery_batch: PASS
git_dirty_entries: 429
health_score: 82
health_status: PASS
```

---

## 验收

```
PROJECT_HEALTH_BASELINE_V1_COMPLETE = YES
STATUS = PASS
```
