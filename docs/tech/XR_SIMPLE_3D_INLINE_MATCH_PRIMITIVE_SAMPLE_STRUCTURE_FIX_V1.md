# XR_SIMPLE_3D_INLINE_MATCH_PRIMITIVE_SAMPLE_STRUCTURE_FIX_V1

## Problem

Smoke Test inline xr-scene 已 ready，surface 可见，但 inline node/object 查询仍然没有稳定同步到 READY。

## Diagnosis

Primitive Sample 隔离页已通过，说明最小 GLTF 链路可行。
Smoke Test inline 结构、id 和查询策略需要对齐已验证路径，并补充更晚的诊断节奏。

## Fix

- matched_primitive_sample_structure:
- object_id_moved_to_xr_node:
- inline_scene_kept_always_mounted:
- late_diagnostics_added:
- asset_load_status_added:
- marker_added: NO
- anchor_added: NO
- texture_added: NO
- business_data_added: NO

## Expected Result

点击 Start minimal 3D render 后：

- SIMPLE_3D_INLINE_SCENE_READY = YES
- SIMPLE_3D_INLINE_OBJECT_QUERY_RESULT = FOUND
- SIMPLE_3D_OBJECT_VISIBLE = YES
- SIMPLE_3D_RENDER_STATUS = SIMPLE_3D_RENDER_READY
- SIMPLE_3D_RENDER_BLOCK_REASON = 空

