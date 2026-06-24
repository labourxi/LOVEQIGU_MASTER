# XR_FRAME_PRIMITIVE_SYNTAX_DISCOVERY_V1

## Current Baseline

- xr_minimal_runtime_baseline_v1: PASS_WITH_WARNING
- camera_permission_check_v1: PASS
- camera_preview_baseline_v1: PASS
- simple_3d_status_enum_fix_v1: PASS

## Current Blocker

- simple_3d_actual_object_render_result: BLOCKED
- block_reason: XR_SIMPLE_GEOMETRY_TAG_NOT_AVAILABLE

## Project Scan Result

- project_xr_primitive_sample_found: NO
- project_xr_primitive_sample_paths:
  - `apps/miniapp/xr_demo/miniprogram/components/xr-smoke-frame/index.wxml`
  - `apps/miniapp/xr_demo/miniprogram/components/xr-simple-3d-frame/index.wxml`
  - `apps/miniapp/xr_demo/miniprogram/pages/xr-frame-official-demo/index.wxml`
  - `apps/miniapp/xr_demo/miniprogram/components/template/xr-template-arPreview/index.js`
- project_xr_tags_found:
  - `xr-frame`
  - `xr-scene`
  - `xr-node`
  - `xr-camera`
  - `Transform`
  - `getXrFrameSystem`
- project_xr_asset_patterns_found:
  - `gltf`
  - `glb`
  - `position_guide`
  - `anchor`
  - `preview-model`

## Official Demo Sample Check

- official_demo_basic_geometry_sample_found: NO
- official_demo_sample_paths:
  - `apps/miniapp/xr_demo/miniprogram/pages/xr-frame-official-demo/index.wxml`
  - `apps/miniapp/xr_demo/miniprogram/components/xr-ar-camera/index.js`
  - `apps/miniapp/xr_demo/miniprogram/components/template/xr-template-arPreview/index.js`

## Candidate Syntax Schemes

### Scheme 1

- scheme_name: `official_basic_geometry_sample_import`
- required_tags:
  - `xr-frame`
  - `xr-scene`
  - `xr-node`
  - confirmed geometry/primitive tags from official sample
- external_asset_required: NO
- risk: HIGH
- files_to_modify:
  - `apps/miniapp/xr_demo/miniprogram/pages/xr-smoke-test/index.js`
  - `apps/miniapp/xr_demo/miniprogram/pages/xr-smoke-test/index.wxml`
  - `apps/miniapp/xr_demo/miniprogram/components/xr-simple-3d-frame/index.js`
  - `apps/miniapp/xr_demo/miniprogram/components/xr-simple-3d-frame/index.wxml`
- expected_result: real minimal object becomes observable only after a verified primitive syntax is imported

### Scheme 2

- scheme_name: `runtime_node_probe_only`
- required_tags:
  - `xr-frame`
  - `xr-scene`
  - `xr-node`
- external_asset_required: NO
- risk: LOW
- files_to_modify:
  - `apps/miniapp/xr_demo/miniprogram/components/xr-simple-3d-frame/index.js`
  - `apps/miniapp/xr_demo/miniprogram/components/xr-simple-3d-frame/index.wxml`
- expected_result: selector/runtime confirmation only; no actual visible primitive object

### Scheme 3

- scheme_name: `unverified_primitive_tag_probe`
- required_tags:
  - `xr-cube`
  - `xr-sphere`
  - `xr-plane`
  - `xr-mesh`
  - `xr-material`
  - `xr-light`
- external_asset_required: NO
- risk: HIGH
- files_to_modify:
  - `apps/miniapp/xr_demo/miniprogram/components/xr-simple-3d-frame/index.wxml`
- expected_result: only if the runtime confirms one of these tags compiles in the current miniapp environment

## Not Recommended

- direct_glb_import: NO
- large_texture_import: NO
- full_official_demo_import: NO
- marker_anchor_now: NO
- unverified_xr_cube_or_sphere_tags: NO

## Recommendation

- recommended_next_task: `XR_FRAME_OFFICIAL_BASIC_GEOMETRY_SAMPLE_IMPORT_PLAN_V1`
- reason: the repository does not contain a verified primitive/geometry sample, so the next safe step is to plan importing only the official basic geometry sample rather than guessing unsupported tags
