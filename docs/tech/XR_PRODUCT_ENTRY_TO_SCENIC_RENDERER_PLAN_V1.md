# XR_PRODUCT_ENTRY_TO_SCENIC_RENDERER_PLAN_V1

## Purpose

Plan how future product pages should safely open the accepted scenic-point XR renderer without making XR a blocker for the product flow.

## Accepted Technical Flow

Normal miniapp page
wx.navigateTo
xr-scenic-point-render
renderer reaches READY
return to normal page
read storage result

## Accepted Renderer

apps/miniapp/xr_demo/miniprogram/pages/xr-scenic-point-render/index

## Accepted Result Storage

XR_SCENIC_POINT_RENDER_RESULT_V1

## Recommended First Product Entry

Use a future scenic point detail page or exploration point page as the first real product wrapper.

Recommended candidate:

apps/miniapp/pages/explore/index
or a future standalone scenic-point-detail page

This phase only plans the wrapper. Do not connect it yet.

## Product Entry UX

入口标题：

景点 XR 显现

入口说明：

打开景点信物的 3D 显现页，完成一次轻量 XR 查看。

按钮文案：

查看 XR 显现

READY 后文案：

XR 显现已完成，可继续领取或查看信物。

失败兜底文案：

当前设备暂未完成 XR 显现，可继续通过普通探索流程获得信物。

## Product State Mapping

When renderer result is READY:

- xrRenderReturned = true
- xrRenderStatus = READY
- xrObjectVisible = true
- allow continue to token / blessing reveal

When renderer result is BLOCKED / UNKNOWN / missing:

- xrRenderReturned = true
- xrRenderStatus = fallback
- xrObjectVisible = false
- show fallback copy
- still allow continue to token / blessing reveal

## MVP Rule

XR must not block:

- exploration completion
- token reveal
- blessing reveal
- user progress saving
- normal product navigation

XR is enhancement only.

## Forbidden

Do not introduce in this phase:

- Marker
- Anchor
- ARSystem
- VisionKit
- external GLB
- texture
- business data binding
- dynamic model switching
- renderer selector renaming
- embedded xr-scene in ordinary product page

## Safe Implementation Strategy

Phase 1:

Add product wrapper entry only.

Phase 2:

Read storage result after return.

Phase 3:

Show READY / fallback state.

Phase 4:

Only after stable wrapper acceptance, plan controlled model replacement.

Phase 5:

Only after model replacement pass, consider Marker / Anchor separately.

## Next Implementation Task

XR_PRODUCT_ENTRY_TO_SCENIC_RENDERER_WRAPPER_V1

Purpose:

Add a non-blocking product entry from a safe ordinary page to the accepted scenic-point renderer.

## Final Output

- XR_PRODUCT_ENTRY_TO_SCENIC_RENDERER_PLAN_CREATED = YES
- ACCEPTED_RENDERER_REFERENCED = YES
- PRODUCT_ENTRY_FLOW_PLANNED = YES
- MVP_NON_BLOCKING_RULE_DEFINED = YES
- FALLBACK_UX_DEFINED = YES
- MARKER_INCLUDED = NO
- ANCHOR_INCLUDED = NO
- BUSINESS_DATA_INCLUDED = NO
- READY_FOR_PRODUCT_WRAPPER_IMPLEMENTATION = YES
- BUILD_CODE_CHANGED = NO
