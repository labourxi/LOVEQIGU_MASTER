# XR_PRODUCT_ENTRY_TO_SCENIC_RENDERER_ACCEPTANCE_FREEZE_V1

## Acceptance Result

XR_PRODUCT_ENTRY_TO_SCENIC_RENDERER_WRAPPER_PASS = YES

MERCHANT_EVENT_DETAIL_XR_ENTRY_PASS = YES

ANDROID_REAL_DEVICE_PRODUCT_XR_FLOW_PASS = YES

## Accepted Product Entry

apps/miniapp/pages/merchant-event/detail/index

## Accepted Renderer

apps/miniapp/xr_demo/miniprogram/pages/xr-scenic-point-render/index

## Verified Flow

Product scenic point detail page
 tap 景点 / XR
 open XR Scenic Point Render
 renderer reaches READY
 return to product page
 product page reads XR_SCENIC_POINT_RENDER_RESULT_V1
 product page displays READY result

## Evidence

- XR_RENDER_RETURNED = YES
- XR_RENDER_STATUS = READY
- XR_OBJECT_VISIBLE = YES
- XR_BLOCK_REASON = -
- XR_CHECKED_AT = 2026-06-20T14:13:28.904Z

## UX Evidence

- 景点 XR 显现
- XR 显现已完成，可继续领取或查看信物。

## Technical Conclusion

A real product page can safely open the accepted XR renderer and read the READY result after return.

XR remains an enhancement layer and does not block normal exploration, token, blessing, or progress flows.

## Frozen Rules

- Product pages must not embed xr-scene directly.
- Product pages should use wx.navigateTo to open accepted renderer pages.
- Renderer pages must preserve accepted primitive ids/selectors.
- Storage key remains XR_SCENIC_POINT_RENDER_RESULT_V1.
- XR failure must not block product flow.

## Not Included

- Marker
- Anchor
- ARSystem
- VisionKit
- external GLB
- texture
- dynamic model switching
- business data binding

## Next Recommended Task

XR_PRODUCT_XR_FLOW_CLEANUP_AND_INDEX_UPDATE_V1

Purpose:

Clean up temporary debug wording if needed, update indexes, and record the accepted product XR flow without modifying the accepted renderer internals.

## Final Output

- XR_PRODUCT_ENTRY_TO_SCENIC_RENDERER_ACCEPTANCE_FREEZE_CREATED = YES
- XR_PRODUCT_ENTRY_TO_SCENIC_RENDERER_WRAPPER_PASS = YES
- MERCHANT_EVENT_DETAIL_XR_ENTRY_PASS = YES
- ANDROID_REAL_DEVICE_PRODUCT_XR_FLOW_PASS = YES
- STORAGE_RESULT_RETURN_ACCEPTED = YES
- PRODUCT_FLOW_NON_BLOCKING_CONFIRMED = YES
- RENDERER_INTERNALS_UNCHANGED = YES
- BUILD_CODE_CHANGED = NO
