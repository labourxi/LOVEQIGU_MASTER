# XR_SCENIC_POINT_EXACT_BASELINE_CLONE_NO_RENAME_FIX_V1

## Problem

scenic-point-render page opens and reports scene ready / surface visible, but selector diagnostics report scene/node/object not found.

## Decision

Stop renaming baseline ids/selectors.
Use exact primitive-sample clone as derived scenic-point renderer.

## Fix

- exact_baseline_wxml_cloned:
- exact_baseline_js_selector_logic_cloned:
- exact_baseline_wxss_cloned:
- primitive_ids_preserved:
- scenic_storage_result_added:
- marker_added: NO
- anchor_added: NO
- business_data_added: NO

## Acceptance

The derived page may still display PRIMITIVE_* fields.
This is acceptable for V1 because the goal is runtime equivalence, not naming cleanup.

Expected:

- PRIMITIVE_OBJECT_VISIBLE = YES
- PRIMITIVE_OBJECT_QUERY_RESULT = FOUND
- PRIMITIVE_SAMPLE_STATUS = PRIMITIVE_RENDER_READY

And storage:

- XR_SCENIC_POINT_RENDER_RESULT_V1.status = READY
