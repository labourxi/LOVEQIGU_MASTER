# XR_SIMPLE_3D_RENDERER_RESULT_RETURN_FIX_V1

## Problem

Independent Simple 3D Renderer page can be opened and shows a black XR surface, but Smoke Test sometimes returns with:

- `SIMPLE_3D_RENDER_REQUESTED = YES`
- `SIMPLE_3D_RENDER_SOURCE = dedicated_renderer_page`
- `SIMPLE_3D_RENDERER_PAGE_OPENED = YES`
- `SIMPLE_3D_EVENT_RECEIVED = NO`
- `SIMPLE_3D_OBJECT_VISIBLE = NO`

## Fix

- `renderer_page_opened`: YES
- `black_xr_surface_visible`: YES
- `event_channel_may_not_return`: YES
- `storage_result_fallback_enforced`: YES
- `on_unload_result_publish_added`: YES
- `smoke_test_on_show_storage_read_added`: YES

## Expected Behavior

- Renderer page writes started state immediately
- Renderer page writes scene-ready state when ready event fires
- Renderer page writes final result on unload
- Smoke Test reads the latest dedicated renderer result on `onShow`

