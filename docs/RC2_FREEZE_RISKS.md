# RC2 Freeze Risks

Generated: 2026-06-07T23:00:00+08:00

## Current Risk List

1. Terminology migration debt remains around the Rights Center surface versus the glossary target recorded in the RC2 audit.
2. Legacy Content Engine YAML warnings remain report-only.
3. `pages/relics/` still exists on disk as an orphan legacy surface.
4. The home chapter status still shows `RC1` residue in one label.
5. Automation report snapshots can drift unless regenerated per checkpoint.

## Risk Classification

- Non-blocking for RC2 acceptance.
- Blocking only if the release policy requires warning-free terminology and repository cleanup.

## Current Status

- `PASS_WITH_WARNING`

