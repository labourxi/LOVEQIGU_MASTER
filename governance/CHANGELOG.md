# LOVEQIGU_MASTER Changelog

## 2026-06-07

### Governance Initialization

- Initialized this changelog from actual workspace state, existing governance logs, `AGENTS.md`, compliance scans, and current Mini Program files.
- Confirmed this workspace is not currently a Git repository; no commit history is available through `git status` or `git diff`.
- Preserved the rule that writes for this task are limited to `governance/`.

### Compliance Snapshot

- `AGENTS.md` is present and defines documentation as source of truth.
- Knowledge priority is: `docs/canon/*`, `docs/world/*`, `docs/language/*`, `docs/architecture/*`, then source code.
- Canon files remain frozen and were not modified by this governance task.
- Scan of `docs/world`, `docs/language`, `docs/architecture`, and `apps/miniapp` for requested legacy terms returned no matches.
- Scan of `docs/canon` still reports 81 legacy-term matches; these are unresolved because Canon files are frozen by repository rules.

### Terminology Migration

- Existing `governance/TERMINOLOGY_MIGRATION_LOG.md` records a docs terminology migration:
  - Markdown files scanned under `docs/`: 7
  - Editable files processed: 4
  - Canon files skipped: 3
  - Total replacements made: 268
- Recorded replacements include:
  - `归真` to `合真`
  - `愿力` to `心愿值`
  - `祝由` to `祝禁`
  - `回应` to `回响`
  - `积分商城` to `权益中心`

### Mini Program Structure

- `apps/miniapp/app.json` registers 6 native WeChat Mini Program pages.
- Present page routes:
  - `pages/index/index`
  - `pages/explore-map/index`
  - `pages/relics/index`
  - `pages/rights-center/index`
  - `pages/profile/index`
  - `pages/ar-entry/index`
- Validation command result: `JSON OK; ROUTES OK 6`.

### Current Scope

- `apps/miniapp` contains the implemented Mini Program skeleton and compliant placeholder pages.
- `docs/` contains Canon, World Bible, Language, Terminology, and IA documents.
- `governance/` contains audit and decision records.
- `apps/admin`, `apps/h5`, `services/*`, `scripts`, `omx`, and `ductor` remain structural placeholders unless populated later.

## 2026-06-06

### LOVEQIGU_MASTER Initialization

- LOVEQIGU_MASTER workspace initialized.
- Canon, World Bible, Language Constitution, Terminology, and IA documents imported under `docs/`.
- `AGENTS.md` established as repository operating rules.
- WeChat Mini Program skeleton created under `apps/miniapp`.
- Home page and local hero image asset created.
- Governance terminology migration log created.

### Status

P0 knowledge foundation and first Mini Program structure are present. Canon gaps remain unfilled by design.
