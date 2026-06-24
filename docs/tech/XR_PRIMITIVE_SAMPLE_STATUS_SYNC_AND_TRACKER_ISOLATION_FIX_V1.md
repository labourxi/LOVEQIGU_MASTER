# XR_PRIMITIVE_SAMPLE_STATUS_SYNC_AND_TRACKER_ISOLATION_FIX_V1

## Problem

真机页面中 XR Surface 黑色区域已经可见，但状态仍显示：

- primitiveSampleMounted = NO
- primitiveRenderSurfaceVisible = NO
- primitiveSampleStatus = SAMPLE_PAGE_READY

## Diagnosis

- ready 事件或 selector 查询可能没有及时同步
- Plane Tracker 可能要求识别平面后才显示对象，干扰最小 3D 渲染基线

## Fix

- added observed surface fallback:
- added multi-stage delayed query:
- isolated plane tracker effect:
- added tracker status fields:
- added object query status:

## Status Semantics

- PRIMITIVE_SURFACE_OBSERVED:
  XR Surface 已通过运行时观测确认。

- PRIMITIVE_RENDER_READY:
  最小对象节点已确认。

- PRIMITIVE_RENDER_BLOCKED:
  Surface 可见，但对象未确认或 tracker 未 ready。

## Manual Verification Required

用户需要：

1. 打开 XR Primitive Sample
2. 等待 3-6 秒
3. 查看：
   - PRIMITIVE_RENDER_SURFACE_VISIBLE
   - PRIMITIVE_SAMPLE_STATUS
   - PRIMITIVE_OBJECT_VISIBLE
   - PRIMITIVE_BLOCK_REASON
   - PRIMITIVE_TRACKER_ENABLED
   - PRIMITIVE_TRACKER_TYPE
4. 如果 Surface 是 YES 但对象 NO，记录 block reason
5. 如果对象 YES，则下一步才允许迁移到 xr-simple-3d-frame
