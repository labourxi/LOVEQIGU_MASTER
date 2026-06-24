# MINIPROGRAM_MAIN_PACKAGE_SIZE_AUDIT_AND_XR_RESIDUAL_MIGRATION_V1

## Current Context

- XR Smoke Test 已可打开
- Minimal XR scene ready 已出现
- 当前阻塞是真机预览 / 上传失败
- 需要排查主包体积、XR 残留资源、代码质量校验

## App.json Audit

- main_package_pages_count: 27
- main_package_xr_page_residual_found: NO
- main_package_xr_page_residual_list: []
- xr_subpackage_root_exists: YES
- xr_subpackage_root: xr_demo/miniprogram
- xr_smoke_test_registered: YES
- xr_official_demo_registered: YES

## Main Package Residual Scan

- main_package_xr_residual_files: []
- main_package_large_asset_files:
  - apps/miniapp/assets/ar_factory/landmark_tree_v1/alignment_overlay.png
  - apps/miniapp/assets/ar_factory/landmark_tree_v1/position_guide.png
  - apps/miniapp/assets/ar_factory/landmark_ar_poc_v1/alignment_overlay.png
  - apps/miniapp/assets/ar_factory/landmark_ar_poc_v1/position_guide.png
- main_package_unused_xr_candidates: []

## Size Estimate

- apps/miniapp/pages: 185944 bytes
- apps/miniapp/components: 35414 bytes
- apps/miniapp/assets: 6068818 bytes
- apps/miniapp/utils: 7430 bytes
- main_package_size_estimate: 6297606 bytes
- main_package_size_risk: HIGH
- top_large_files:
  - apps/miniapp/assets/ar_factory/landmark_tree_v1/alignment_overlay.png
  - apps/miniapp/assets/ar_factory/landmark_tree_v1/position_guide.png
  - apps/miniapp/assets/ar_factory/landmark_ar_poc_v1/alignment_overlay.png
  - apps/miniapp/assets/ar_factory/landmark_ar_poc_v1/position_guide.png

## Migration Actions

- pages_moved:
  - apps/miniapp/pages/xr-spike/index -> apps/miniapp/xr_demo/miniprogram/pages/xr-spike/index
  - apps/miniapp/pages/xr-frame-spike/index -> apps/miniapp/xr_demo/miniprogram/pages/xr-frame-spike/index
  - apps/miniapp/pages/xr-frame-real/index -> apps/miniapp/xr_demo/miniprogram/pages/xr-frame-real/index
- components_moved: []
- assets_moved:
  - apps/miniapp/assets/ar_factory/landmark_tree_v1_p0a/effect_preview/* -> apps/miniapp/xr_demo/miniprogram/assets/ar_factory/landmark_tree_v1_p0a/effect_preview/*
- app_json_updated: YES
- navigation_paths_updated: YES

## Do Not Touch Confirmation

- xr_smoke_test_preserved: YES
- xr_official_demo_preserved: YES
- visual_factory_untouched: YES
- content_factory_untouched: YES
- merchant_portal_untouched: YES

## Upload / Preview Recommendation

- code_quality_scan_required: YES
- compression_upload_required: YES
- hotspot_network_recommended: YES
- avoid_repeated_preview_clicks: YES

## Final Result

- main_package_ready_for_preview: NO
- blockers:
  - 主包仍保留 active AR runtime assets，主要是 `apps/miniapp/assets/ar_factory/landmark_tree_v1/*` 与 `apps/miniapp/assets/ar_factory/landmark_ar_poc_v1/*`
  - 这些资源与现有 AR Runtime 主链路有关，未在本轮强行迁移
- next_action:
  - 先跑代码质量/预览上传验证
  - 若仍失败，再单独评估 AR runtime 资源是否可继续拆分到分包或远端资源
