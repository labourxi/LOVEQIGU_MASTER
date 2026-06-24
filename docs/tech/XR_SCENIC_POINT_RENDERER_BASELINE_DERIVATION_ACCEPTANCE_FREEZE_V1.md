# XR_SCENIC_POINT_RENDERER_BASELINE_DERIVATION_ACCEPTANCE_FREEZE_V1

## Acceptance Result

XR_SCENIC_POINT_RENDERER_BASELINE_DERIVATION_PASS = YES

## Accepted Derived Page

apps/miniapp/xr_demo/miniprogram/pages/xr-scenic-point-render/index

## Source Baseline

apps/miniapp/xr_demo/miniprogram/pages/xr-primitive-sample/index

## Evidence

- PAGE_LOADED = YES
- PAGE_READY = YES
- PRIMITIVE_SAMPLE_MOUNTED = YES
- PRIMITIVE_RENDER_SURFACE_VISIBLE = YES
- PRIMITIVE_SURFACE_OBSERVED = YES
- PRIMITIVE_OBJECT_VISIBLE = YES
- PRIMITIVE_OBJECT_QUERY_RESULT = FOUND
- PRIMITIVE_SAMPLE_STATUS = PRIMITIVE_RENDER_READY
- SURFACE_BOX_QUERY_RESULT = FOUND
- SCENE_QUERY_RESULT = FOUND
- PRIMITIVE_NODE_QUERY_RESULT = FOUND
- PRIMITIVE_OBJECT_QUERY_RESULT = FOUND
- Console: PRIMITIVE_NODE_OR_OBJECT_FOUND nodeFound=true objectFound=true
- Console: PRIMITIVE_RENDER_READY_SYNCED
- Console: BLOCK_REASON_CLEARED

## Key Decision

The derived scenic-point renderer passes only after preserving primitive-sample ids, selectors, and ready-state logic.

For V1, runtime equivalence has higher priority than naming cleanup.

## Frozen Rule

Do not rename internal xr-frame ids/selectors in derived pages until a separate controlled refactor proves it does not break runtime.

## Accepted Current Limitation

The scenic-point renderer page may still display PRIMITIVE_* fields.

This is acceptable for V1.

## Demoted Failed Approach

The following approach is not accepted:

- renaming primitive selectors to scenic-point selectors before runtime pass
- requiring scenic scene/node/object all renamed and independently queried
- changing baseline id strategy during first derivation

## Next Safe Step

XR_SCENIC_POINT_RENDERER_TEMPLATE_WRAPPER_PLAN_V1

Purpose:

Plan how to wrap the accepted derived renderer in product navigation without changing the renderer internals.

Forbidden in next step:

- Marker
- Anchor
- ARSystem
- VisionKit
- external GLB
- texture
- business data binding
- selector renaming

## Final Output

- XR_SCENIC_POINT_RENDERER_BASELINE_DERIVATION_ACCEPTANCE_FREEZE_CREATED = YES
- XR_SCENIC_POINT_RENDERER_BASELINE_DERIVATION_PASS = YES
- DERIVED_PAGE_ACCEPTED = YES
- PRIMITIVE_IDS_PRESERVED_AS_RUNTIME_RULE = YES
- NAMING_CLEANUP_DEFERRED = YES
- BUILD_CODE_CHANGED = NO
