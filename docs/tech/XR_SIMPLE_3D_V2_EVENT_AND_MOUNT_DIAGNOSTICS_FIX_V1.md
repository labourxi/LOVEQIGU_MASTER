# XR_SIMPLE_3D_V2_EVENT_AND_MOUNT_DIAGNOSTICS_FIX_V1

## Problem

Smoke Test 中 Start minimal 3D render 已触发，但页面停留在：

- simple3dRenderRequested = YES
- simple3dObjectVisible = NO
- simple3dRenderBlockReason = empty

说明组件没有回传 simple3dready / simple3dblocked 最终事件，或者组件未挂载到页面可见区域。

## Fix

- simple3d_frame_mounted_state_added:
- simple3dmounted_event_added:
- simple3d_auto_diagnostics_added:
- simple3d_ready_event_bridge_confirmed:
- simple3d_blocked_event_bridge_confirmed:
- simple3d_event_timeout_added:

## Expected Result

用户点击 Start minimal 3D render 后，5 秒内必须进入以下之一：

- SIMPLE_3D_RENDER_READY
- SIMPLE_3D_RENDER_BLOCKED

不得停在 pending 或 requested-only 状态。

## Manual Verification Required

用户需要：

1. 打开 XR Smoke Test
2. 点击 Start camera preview baseline
3. 确认 CAMERA_PREVIEW_STATUS = CAMERA_PREVIEW_READY
4. 点击 Start minimal 3D render
5. 查看：
   - SIMPLE_3D_FRAME_MOUNTED
   - SIMPLE_3D_EVENT_RECEIVED
   - SIMPLE_3D_LAST_EVENT_TYPE
   - SIMPLE_3D_RENDER_STATUS
   - SIMPLE_3D_RENDER_BLOCK_REASON
6. XR Surface 不消失
7. 页面不崩溃

