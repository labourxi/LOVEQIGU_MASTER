# EVENT_LIFECYCLE_ENGINE_V1_REPORT

## Status Diagram

```text
DRAFT -> SUBMITTED -> PARK_REVIEW -> PLATFORM_REVIEW -> APPROVED -> PUBLISHED -> RUNNING -> FINISHED -> ARCHIVED
                                  \-> REJECTED
```

## Status Notes

- `DRAFT`: activity is being prepared
- `SUBMITTED`: merchant submitted for review
- `PARK_REVIEW`: park-side review in progress
- `PLATFORM_REVIEW`: platform-side review in progress
- `APPROVED`: approved for publish
- `PUBLISHED`: published but not yet running
- `RUNNING`: active
- `FINISHED`: ended
- `ARCHIVED`: archived after completion
- `REJECTED`: rejected during review

## Transition Rules

- `DRAFT -> SUBMITTED`
- `SUBMITTED -> PARK_REVIEW`
- `PARK_REVIEW -> PLATFORM_REVIEW`
- `PLATFORM_REVIEW -> APPROVED / REJECTED`
- `APPROVED -> PUBLISHED`
- `PUBLISHED -> RUNNING`
- `RUNNING -> FINISHED`
- `FINISHED -> ARCHIVED`

## Mock Cases

- normal publish path: `DRAFT -> ... -> ARCHIVED`
- rejection path: `PLATFORM_REVIEW -> REJECTED`
- end path: `RUNNING -> FINISHED -> ARCHIVED`

## Validation Result

- `python -m py_compile scripts/event_lifecycle/lifecycle_engine.py scripts/event_lifecycle/validate_lifecycle.py` passed
- `python scripts/event_lifecycle/validate_lifecycle.py` output `LIFECYCLE_VALIDATION_PASS`

## Next Suggestions

- keep lifecycle data separate from API/runtime/release layers
- if the flow later becomes mutable, add a dedicated audit log rather than expanding the schema

`EVENT_LIFECYCLE_ENGINE_V1_COMPLETE = YES`
