# MINIAPP BIND REPORT

Scope: `apps/miniapp/pages/`

## Pages Covered

- `explore-map`
- `rights-center`
- `relic-archive`
- `story-archive`
- `ar-entry`

## Binding Result

All requested MiniApp pages already existed in the repository and were verified as bound to the shared local service layer:

- `explore-map` -> `story-service`, `ar-service`
- `rights-center` -> `rights-service`, `campaign-service`
- `relic-archive` -> `relic-service`, `story-service`
- `story-archive` -> `story-service`, `story-flow-service`
- `ar-entry` -> `ar-service`, `story-flow-service`

## Configuration

- `apps/miniapp/app.json` includes all requested routes.
- `apps/miniapp/project.config.json` parses successfully as JSON.

## Backups

Fresh backups were created under:

- `scripts/omx/backups/miniapp-pages/generate-miniapp-pages-20260608/`

This backup set contains the requested page directories and the two MiniApp config files:

- `app.json`
- `project.config.json`

## Validation

- Route registration: `PASS`
- JSON syntax: `PASS`
- Terminology compliance: `PASS`
  - No forbidden legacy terms were found in the scoped page files.
- Canon constraints: `PASS`
  - No new Canon, organizations, civilizations, gods, or historical events were introduced.
- Shared service binding: `PASS`
  - The requested pages resolve to the local `apps/miniapp/services/*` layer.

## Notes

- No additional page generation was required because the requested page set already existed and was already wired to the local MiniApp service bridge.
- The work was limited to validation, backup capture, and report generation.

`MINIAPP_BIND_REPORT_COMPLETE = YES`
