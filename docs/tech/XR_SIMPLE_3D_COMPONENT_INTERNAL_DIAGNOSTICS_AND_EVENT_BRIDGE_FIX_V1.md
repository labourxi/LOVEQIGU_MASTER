# XR_SIMPLE_3D_COMPONENT_INTERNAL_DIAGNOSTICS_AND_EVENT_BRIDGE_FIX_V1

## Problem

Smoke Test 页面可查询到：

- simple3d_host = FOUND
- simple3d_component = FOUND

但无法从页面查询组件内部：

- surface_box = NOT_FOUND
- scene = NOT_FOUND
- node = NOT_FOUND
- object = NOT_FOUND

同时组件事件未回传，最终 timeout。

## Diagnosis

页面层无法可靠查询 renderer="xr-frame" 自定义组件内部节点。
必须由 xr-simple-3d-frame 组件内部执行 selector 诊断并通过事件回传。

## Fix

- component_internal_diagnostics_added:
- multi_stage_internal_diagnostics_added:
- simple3dmounted_event_forced:
- simple3dready_event_forced_when_node_or_object_found:
- simple3dblocked_event_forced_when_not_found:
- smoke_test_internal_event_fields_added:
- timeout_does_not_override_ready:

## Expected Result

点击 Start minimal 3D render 后，5 秒内必须收到：

- simple3dmounted
- simple3dready 或 simple3dblocked

如果组件内部 node/object FOUND：

- SIMPLE_3D_OBJECT_VISIBLE = YES
- SIMPLE_3D_RENDER_STATUS = SIMPLE_3D_RENDER_READY
- SIMPLE_3D_RENDER_BLOCK_REASON = 空

