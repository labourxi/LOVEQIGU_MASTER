# CONTENT_FACTORY_DASHBOARD_V1

## Objective

Create a content factory control dashboard that aggregates asset, release, and visual pipeline health.

---

## Metrics

### 1. Asset Count

- visual
- story
- relic

### 2. Release Count

- approved
- rejected
- pending

### 3. Visual Performance

- winner count
- candidate count
- Gemini score mean

### 4. Factory Throughput

- daily generation count
- cumulative generation count

---

## Output

`runtime/dashboard/dashboard.json`

Fields:

- `asset_summary`
- `release_summary`
- `factory_summary`
- `visual_summary`

---

## Success Marker

CONTENT_FACTORY_DASHBOARD_V1_COMPLETE = YES

