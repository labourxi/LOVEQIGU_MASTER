# XR_PRODUCT_XR_FLOW_CLEANUP_AND_INDEX_UPDATE_V1

## Purpose

Clean up and index the accepted product XR flow after Android real-device product acceptance.

## Accepted Product XR Flow

Product scenic point detail page
 tap 景点 / XR
 open XR Scenic Point Render
 renderer reaches READY
 return to product page
 product page reads XR_SCENIC_POINT_RENDER_RESULT_V1
 product page displays READY result

## Accepted Product Entry

apps/miniapp/pages/merchant-event/detail/index

## Accepted Renderer

apps/miniapp/xr_demo/miniprogram/pages/xr-scenic-point-render/index

## Accepted Storage Key

XR_SCENIC_POINT_RENDER_RESULT_V1

## Acceptance Evidence

- XR_RENDER_RETURNED = YES
- XR_RENDER_STATUS = READY
- XR_OBJECT_VISIBLE = YES
- XR_BLOCK_REASON = -
- XR_CHECKED_AT = 2026-06-20T14:13:28.904Z

## Cleanup Result

- product_copy_cleaned:
- mojibake_removed:
- debug_status_preserved_as_lightweight_acceptance_status:
- navigate_to_renderer_preserved:
- storage_result_read_preserved:
- renderer_internals_unchanged:

## Frozen Rules

- Product pages must not embed xr-scene directly.
- Product pages must use wx.navigateTo to open accepted renderer pages.
- Renderer pages must preserve accepted primitive ids/selectors.
- Storage key remains XR_SCENIC_POINT_RENDER_RESULT_V1.
- XR failure must not block exploration, token reveal, blessing reveal, user progress saving, or normal product navigation.
- Official XR Demo must not be used as the product XR entry.
- Android real-device manual verification remains required after XR flow changes.

## Not Included

- Marker
- Anchor
- ARSystem
- VisionKit
- external GLB
- texture
- dynamic model switching
- business data binding

## Known Warning

The automated guard may warn that test.gltf contains buffer.uri.

This is acceptable only while the URI is local and not an external HTTP dependency.

## Index Update

INDEX_FILE_FOUND = NO
INDEX_UPDATE_SKIPPED = YES

## Next Recommended Task

XR_SCENIC_RENDERER_MODEL_REPLACEMENT_PLAN_V1

Purpose:

Plan how to replace the minimal test.gltf with a controlled small scenic-point token model without modifying the accepted renderer architecture.

## Final Output

- XR_PRODUCT_XR_FLOW_CLEANUP_AND_INDEX_UPDATE_CREATED = YES
- PRODUCT_XR_FLOW_INDEXED = SKIPPED_NO_INDEX
- PRODUCT_COPY_CLEANED = YES
- MOJIBAKE_REMOVED = YES
- NAVIGATE_TO_RENDERER_PRESERVED = YES
- STORAGE_RESULT_READ_PRESERVED = YES
- RENDERER_INTERNALS_UNCHANGED = YES
- XR_AUTOMATED_ACCEPTANCE_GUARD_PASS = YES
- BUILD_PASS = YES
