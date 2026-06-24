# XR_PRIMITIVE_SAMPLE_SELECTOR_DIAGNOSTICS_V1

## Problem

真机肉眼可见黑色 XR Surface 区域，但状态仍显示：

- primitiveSampleMounted = NO
- primitiveRenderSurfaceVisible = NO
- primitiveSurfaceObserved = NO
- primitiveSampleStatus = SAMPLE_PAGE_READY

## Diagnosis Goal

确认问题是：

- WXML id 不一致
- selectorQuery 查询失败
- xr-frame 内部节点不可查询
- object 节点未挂载
- surface 容器可见但 object 未确认

## Implementation

- surface_box_id_added: YES
- scene_id_added: YES
- primitive_node_id_added: YES
- primitive_object_id_added: YES
- selector_diagnostics_added: YES
- manual_diagnostics_button_added: YES
- multi_stage_auto_diagnostics_added: YES

## Status Semantics

- PRIMITIVE_SURFACE_OBSERVED:
  表示外层 XR Surface 容器已通过 selector + 尺寸确认。

- PRIMITIVE_RENDER_READY:
  表示 primitive object 或承载节点已通过 selector 确认。

- PRIMITIVE_RENDER_BLOCKED:
  表示 Surface 或 Object 查询失败，并有明确 block reason。

## Manual Verification Required

用户需要：

1. 打开 XR Primitive Sample
2. 等待 6 秒
3. 点击运行 Primitive 节点诊断
4. 查看：
   - SURFACE_BOX_QUERY_RESULT
   - SCENE_QUERY_RESULT
   - PRIMITIVE_NODE_QUERY_RESULT
   - PRIMITIVE_OBJECT_QUERY_RESULT
   - PRIMITIVE_SAMPLE_STATUS
   - PRIMITIVE_BLOCK_REASON
