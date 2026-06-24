# XR_SIMPLE_3D_V2_PAGE_LEVEL_DIAGNOSTICS_FALLBACK_V1

## Problem

Smoke Test 中 simple3dFrameMounted = YES，但 simple3dEventReceived = NO，最终 timeout。

## Diagnosis

组件事件可能没有穿透，或 xr-frame renderer 组件内部事件不可被普通页面接收。

## Fix

- page_level_host_added:
- page_level_component_id_added:
- page_level_selector_diagnostics_added:
- manual_page_diagnostics_button_added:
- auto_multi_stage_page_diagnostics_added:
- event_bridge_preserved:

## Expected Result

点击 Start minimal 3D render 后，5 秒内必须得到：

- SIMPLE_3D_RENDER_READY

或明确阻断：

- SIMPLE_3D_INTERNAL_NODE_NOT_QUERYABLE_FROM_PAGE
- SIMPLE_3D_HOST_NOT_FOUND
- SIMPLE_3D_OBJECT_QUERY_NOT_FOUND

