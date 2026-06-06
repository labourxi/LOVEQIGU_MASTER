# LOVEQIGU AI Decision Log

## AI Decision 0001

Date: 2026-06-06

Trigger: Terminology compliance scan on Mini Program user-facing copy.

Decision: Replace visible legacy terminology with the official LOVEQIGU terminology required by `AGENTS.md`.

Rationale:
- Repository rules require official terminology.
- User-facing copy must avoid deprecated or gamified terms.
- Canon consistency has priority over implementation speed.

Action:
- Updated Mini Program visible copy to use compliant terms such as `探索地图`, `信物`, `权益中心`, `心愿值`, `合真`, `回响`, and `祝禁`.

Validation:
- Mini Program terminology scan later returned no matches for the requested legacy terms.

## AI Decision 0002

Date: 2026-06-06

Trigger: `prompts/P1_MINIAPP_START.md`.

Decision: Build a simple native WeChat Mini Program page structure with placeholder data only.

Rationale:
- The prompt required native Mini Program structure and no real API integration.
- `AGENTS.md` forbids inventing lore or filling Canon gaps.
- Placeholder data can establish structure without introducing new Canon claims.

Action:
- Registered and created:
  - `pages/index/index`
  - `pages/explore-map/index`
  - `pages/relics/index`
  - `pages/rights-center/index`
  - `pages/profile/index`
  - `pages/ar-entry/index`

Validation:
- `JSON OK; ROUTES OK 6`.
- Legacy-term scan outside Canon returned no matches after later terminology work.

## AI Decision 0003

Date: 2026-06-06

Trigger: `prompts/update_docs_terminology.md`.

Decision: Apply terminology migration to non-Canon Markdown files only.

Rationale:
- The prompt requested docs terminology replacement.
- `AGENTS.md` and `LOVEQIGU_CANON_INDEX.md` freeze Canon files.
- Direct Canon edits would violate the repository rules.

Action:
- Updated Markdown files under:
  - `docs/world`
  - `docs/language`
  - `docs/architecture`
- Did not modify `docs/canon/*`.
- Preserved asset separation by correcting mechanical `信物 ≠ 信物` artifacts to `信物 ≠ 传播资产`.

Validation:
- Editable-doc scan for requested legacy terms returned no matches.
- Canon scan still reports 81 matches and is intentionally unresolved.

## AI Decision 0004

Date: 2026-06-07

Trigger: `prompts/governance_init.md`.

Decision: Initialize governance records from current workspace evidence rather than Git history.

Rationale:
- `git status` reports this workspace is not a Git repository.
- The prompt asks for actual repository history; available evidence is limited to current files, existing governance logs, and scan results.
- The prompt also restricts writes to `governance/`.

Action:
- Overwrote:
  - `governance/CHANGELOG.md`
  - `governance/AI_DECISION_LOG.md`
- Did not modify files outside `governance/`.

Validation:
- Current governance records document no-Git status, compliance scan outcomes, terminology migration, and Mini Program route validation.
