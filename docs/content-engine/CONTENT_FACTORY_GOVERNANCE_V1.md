# CONTENT_FACTORY_GOVERNANCE_V1

## Objective

Create a governance layer for content factory outputs so visual assets, story records, relic records, and release records are centrally indexed.

---

## Registries

The governance layer exposes:

- Visual Asset Registry
- Story Registry
- Relic Registry
- Release Registry

These registries persist data into `runtime/registry/`.

---

## Record Shapes

### Visual Asset Registry

Required fields:

- `asset_id`
- `asset_type`
- `prompt`
- `winner_file`
- `model`
- `created_at`

### Story Registry

Required fields:

- `story_id`
- `chapter`
- `version`
- `source_task`

### Relic Registry

Required fields:

- `relic_id`
- `relic_name`
- `version`

### Release Registry

Required fields:

- `release_id`
- `asset_id`
- `review_status`
- `publish_time`

---

## Output Files

- `runtime/registry/assets.json`
- `runtime/registry/releases.json`

---

## Success Marker

CONTENT_FACTORY_GOVERNANCE_V1_COMPLETE = YES

