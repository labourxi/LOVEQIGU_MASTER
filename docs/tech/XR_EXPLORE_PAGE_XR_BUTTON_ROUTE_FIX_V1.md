# XR_EXPLORE_PAGE_XR_BUTTON_ROUTE_FIX_V1

## Problem

Explore page XR button opened Official XR Demo Import instead of the accepted scenic-point renderer.

## Actual Explore Page

- apps/miniapp/pages/merchant-event/detail/index

## Fix

- explore_xr_button_route_fixed:
- old_official_demo_route_removed_from_explore_xr_button:
- navigate_to_scenic_point_renderer_added:
- storage_result_read_preserved:
- renderer_internals_unchanged:
- marker_added: NO
- anchor_added: NO
- business_data_added: NO

## Expected Result

Clicking XR button on explore page opens:

/xr_demo/miniprogram/pages/xr-scenic-point-render/index

After return, explore page reads:

XR_SCENIC_POINT_RENDER_RESULT_V1

## Final Output

- XR_EXPLORE_PAGE_XR_BUTTON_ROUTE_FIX_CREATED = YES
- ACTUAL_EXPLORE_PAGE_CONFIRMED = YES
- EXPLORE_XR_BUTTON_ROUTE_FIXED = YES
- OLD_OFFICIAL_DEMO_ROUTE_REMOVED_FROM_EXPLORE_XR_BUTTON = YES
- NAVIGATE_TO_SCENIC_POINT_RENDERER_ADDED = YES
- STORAGE_RESULT_READ_PRESERVED = YES
- RENDERER_INTERNALS_UNCHANGED = YES
- MARKER_ADDED = NO
- ANCHOR_ADDED = NO
- BUSINESS_DATA_ADDED = NO
