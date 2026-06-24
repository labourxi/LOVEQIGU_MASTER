# XR_SCENIC_POINT_SELECTOR_ALIGNMENT_WITH_PRIMITIVE_SAMPLE_FIX_V1

## Problem

Derived scenic-point renderer page opens and reports scene ready / surface visible, but selector diagnostics report scene/node/object not found.

## Diagnosis

The accepted xr-primitive-sample baseline passes with node/object FOUND.
The derived page likely has mismatched WXML ids or selector strategy.

## Fix

- compared_against_primitive_sample:
- selector_ids_aligned:
- node_or_object_ready_rule_applied:
- ready_not_overwritten_by_blocked:
- storage_publish_preserved:
- marker_added: NO
- anchor_added: NO
- business_data_added: NO

## Expected Result

Android real-device / DevTools connected run should show:

- XR_SCENIC_POINT_SURFACE_VISIBLE = YES
- XR_SCENIC_POINT_OBJECT_VISIBLE = YES
- XR_SCENIC_POINT_OBJECT_QUERY_RESULT = FOUND
- XR_SCENIC_POINT_RENDER_STATUS = READY
- XR_SCENIC_POINT_BLOCK_REASON = 空
