# XR_FRAME_OFFICIAL_BASIC_GEOMETRY_SAMPLE_IMPORT_PLAN_V1

## Current Baseline

- XR_MINIMAL_RUNTIME_BASELINE_V1 = PASS_WITH_WARNING
- XR_CAMERA_PERMISSION_CHECK_V1 = PASS
- XR_CAMERA_PREVIEW_BASELINE_V1 = PASS
- XR_SIMPLE_3D_STATUS_ENUM_AND_VISIBILITY_FIX_V1 = PASS
- XR_FRAME_PRIMITIVE_SYNTAX_DISCOVERY_V1 = COMPLETE

## Current Blocker

- XR_SIMPLE_3D_ACTUAL_OBJECT_RENDER_V1 = BLOCKED
- block_reason = XR_SIMPLE_GEOMETRY_TAG_NOT_AVAILABLE
- project_xr_primitive_sample_found = NO
- official_demo_basic_geometry_sample_found_in_repo = NO

## Import Goal

- minimal primitive object
- no marker
- no anchor
- no glb
- no texture
- no business data
- no external large asset

## Candidate Sources

- wechat xr-frame official sample
- xr-frame-demo scene-basic / primitive sample
- official docs minimal mesh / primitive example

## Import Strategy

### Step 1: Isolated Sample Page

- proposed_page: `apps/miniapp/xr_demo/miniprogram/pages/xr-primitive-sample/index`
- files_to_create:
  - `apps/miniapp/xr_demo/miniprogram/pages/xr-primitive-sample/index.js`
  - `apps/miniapp/xr_demo/miniprogram/pages/xr-primitive-sample/index.json`
  - `apps/miniapp/xr_demo/miniprogram/pages/xr-primitive-sample/index.wxml`
  - `apps/miniapp/xr_demo/miniprogram/pages/xr-primitive-sample/index.wxss`
- purpose:
  - only run the official basic geometry sample
  - do not affect XR Smoke Test
  - do not affect Camera Preview
  - do not affect Official XR Demo
- acceptance:
  - `primitive_sample_page_opened = YES`
  - `primitive_render_surface_visible = YES`
  - `primitive_object_visible = YES`
  - `external_asset_added = NO`
  - `no_marker = YES`
  - `no_anchor = YES`
  - `no_glb = YES`
  - `no_texture = YES`
  - `build_pass = YES`

### Step 2: Real Device Verification

- `primitive_sample_page_opened = YES`
- `primitive_object_visible = YES`
- `external_asset_added = NO`
- `build_pass = YES`

### Step 3: Promote to xr-simple-3d-frame

- promotion_condition: isolated sample passes on real device with zero external assets
- target_component: `apps/miniapp/xr_demo/miniprogram/components/xr-simple-3d-frame/`
- target_status:
  - `SIMPLE_3D_OBJECT_VISIBLE = YES`
  - `SIMPLE_3D_RENDER_STATUS = SIMPLE_3D_RENDER_READY`
  - `SIMPLE_3D_RENDER_BLOCK_REASON = ''`

## Candidate Schemes

### Scheme A: Isolated Official Scene Basic Import

- description:
  - create an isolated page dedicated to the official basic geometry sample
  - use it to validate the runtime's minimal xr-frame primitive syntax
- files:
  - `apps/miniapp/xr_demo/miniprogram/pages/xr-primitive-sample/index.js`
  - `apps/miniapp/xr_demo/miniprogram/pages/xr-primitive-sample/index.json`
  - `apps/miniapp/xr_demo/miniprogram/pages/xr-primitive-sample/index.wxml`
  - `apps/miniapp/xr_demo/miniprogram/pages/xr-primitive-sample/index.wxss`
  - `apps/miniapp/app.json`
- benefits:
  - isolates risk from XR Smoke Test
  - allows real device proof before promoting syntax
  - keeps existing baselines intact
- risks:
  - official sample may still depend on syntax not supported by current runtime
  - may require iterative trimming of sample features
- acceptance:
  - page opens on real device
  - primitive object visible
  - no external asset added
  - build and code quality remain green

### Scheme B: Extract Minimal Primitive Fragment

- description:
  - extract only the smallest confirmed primitive fragment from the isolated sample into `xr-simple-3d-frame`
  - promote only after scheme A passes
- files:
  - `apps/miniapp/xr_demo/miniprogram/components/xr-simple-3d-frame/index.js`
  - `apps/miniapp/xr_demo/miniprogram/components/xr-simple-3d-frame/index.json`
  - `apps/miniapp/xr_demo/miniprogram/components/xr-simple-3d-frame/index.wxml`
  - `apps/miniapp/xr_demo/miniprogram/components/xr-simple-3d-frame/index.wxss`
- benefits:
  - keeps the smoke test surface as the canonical AR baseline
  - avoids carrying the full official demo structure forward
- risks:
  - fragment may still be incompatible if imported before real-device verification
  - can regress to blocked if sample assumptions are wrong
- prerequisite:
  - scheme A must pass on real device first

## Risk Control

- do_not_modify_xr_smoke_test_directly: YES
- do_not_replace_xr_simple_3d_frame_before_sample_pass: YES
- do_not_import_full_official_demo: YES
- do_not_add_glb_texture_marker_anchor: YES
- keep_code_quality_gate_passed: YES

## Recommended Next Task

- `XR_FRAME_OFFICIAL_BASIC_GEOMETRY_SAMPLE_ISOLATED_IMPORT_V1`
