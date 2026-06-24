# XR_AUTOMATED_ACCEPTANCE_GUARD_V1

## Purpose

Protect the accepted XR renderer flow from regression.

## Protected Accepted Flow

Normal product page
wx.navigateTo
xr-scenic-point-render
renderer reaches READY
return to normal page
read XR_SCENIC_POINT_RENDER_RESULT_V1

## Guard Scope

The guard checks:

- app.json XR page registration
- explore XR button route
- Official XR Demo not used as product XR entry
- storage key consistency
- primitive baseline preservation
- no xr-scene mixed into ordinary product page
- forbidden Marker / Anchor / ARSystem / VisionKit not introduced
- local GLTF asset size and dependency constraints

## Protected Baseline

apps/miniapp/xr_demo/miniprogram/pages/xr-primitive-sample/index

apps/miniapp/xr_demo/miniprogram/pages/xr-scenic-point-render/index

## Frozen Rule

Do not rename primitive ids/selectors inside accepted renderer pages until a separate controlled refactor proves safe.

## Current Repository Resolution

This repository currently exposes the product exploration page at:

- apps/miniapp/pages/explore-map/index

The guard resolves the first existing page from:

- apps/miniapp/pages/explore/index
- apps/miniapp/pages/explore-map/index

## Manual Verification Still Required

This guard does not replace Android real-device verification.

Manual final check remains:

1. Open explore page.
2. Tap XR.
3. Confirm it opens XR Scenic Point Render.
4. Return to explore page.
5. Confirm READY / fallback result is displayed.

## Final Output

- XR_AUTOMATED_ACCEPTANCE_GUARD_CREATED = YES
- APP_JSON_XR_PAGES_REGISTERED_CHECK_ADDED = YES
- EXPLORE_XR_ROUTE_CHECK_ADDED = YES
- STORAGE_KEY_CONSISTENCY_CHECK_ADDED = YES
- PRIMITIVE_BASELINE_PRESERVATION_CHECK_ADDED = YES
- ORDINARY_PAGE_NO_XR_SCENE_CHECK_ADDED = YES
- FORBIDDEN_XR_FEATURE_CHECK_ADDED = YES
- MODEL_ASSET_SIZE_CHECK_ADDED = YES
- BUILD_CODE_CHANGED = NO
