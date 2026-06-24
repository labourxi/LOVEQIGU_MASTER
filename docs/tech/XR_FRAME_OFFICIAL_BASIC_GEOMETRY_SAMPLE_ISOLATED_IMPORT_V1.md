# XR_FRAME_OFFICIAL_BASIC_GEOMETRY_SAMPLE_ISOLATED_IMPORT_V1

## Current Baseline

- XR_MINIMAL_RUNTIME_BASELINE_V1 = PASS_WITH_WARNING
- XR_CAMERA_PERMISSION_CHECK_V1 = PASS
- XR_CAMERA_PREVIEW_BASELINE_V1 = PASS
- XR_SIMPLE_3D_STATUS_ENUM_AND_VISIBILITY_FIX_V1 = PASS
- XR_FRAME_OFFICIAL_BASIC_GEOMETRY_SAMPLE_IMPORT_PLAN_V1 = COMPLETE

## Purpose

创建隔离页验证最小 xr-frame primitive / geometry 写法。
本阶段不修改 XR Smoke Test，不修改 xr-simple-3d-frame。

## Files Created

- primitive_sample_page_js: `apps/miniapp/xr_demo/miniprogram/pages/xr-primitive-sample/index.js`
- primitive_sample_page_json: `apps/miniapp/xr_demo/miniprogram/pages/xr-primitive-sample/index.json`
- primitive_sample_page_wxml: `apps/miniapp/xr_demo/miniprogram/pages/xr-primitive-sample/index.wxml`
- primitive_sample_page_wxss: `apps/miniapp/xr_demo/miniprogram/pages/xr-primitive-sample/index.wxss`

## App Registration

- subpackage_root: `xr_demo/miniprogram`
- page_registered: YES
- primitive_sample_url: `/xr_demo/miniprogram/pages/xr-primitive-sample/index`

## Primitive Sample

- primitive_syntax_source: `PROJECT_SCAN_NO_CONFIRMED_PRIMITIVE_SAMPLE`
- external_asset_added: NO
- marker_added: NO
- anchor_added: NO
- glb_added: NO
- texture_added: NO
- business_data_added: NO

## Status Fields

- primitiveSampleMounted:
- primitiveRenderSurfaceVisible:
- primitiveObjectVisible:
- primitiveSampleStatus:
- primitiveBlockReason:

## Manual Verification Required

用户需要：

1. 清除缓存
2. 重新编译
3. 打开 `/xr_demo/miniprogram/pages/xr-primitive-sample/index`
4. 真机扫码测试
5. 查看：
   - `PRIMITIVE_RENDER_SURFACE_VISIBLE`
   - `PRIMITIVE_OBJECT_VISIBLE`
   - `PRIMITIVE_SAMPLE_STATUS`
   - `PRIMITIVE_BLOCK_REASON`
6. 若 `PRIMITIVE_RENDER_READY`，则下一步可迁移到 `xr-simple-3d-frame`
7. 若 `BLOCKED`，记录 block reason，不修改 XR Smoke Test

## Next Step

- 如果隔离页通过：`XR_SIMPLE_3D_ACTUAL_OBJECT_RENDER_V2`
- 如果隔离页不通过：继续查官方 primitive 语法，不迁移到 `xr-simple-3d-frame`
