# XR_SCENIC_POINT_RENDERER_TEMPLATE_WRAPPER_PLAN_V1

## Purpose

Plan how to wrap the accepted derived XR renderer page in product navigation without changing the renderer internals.

## Accepted Renderer

apps/miniapp/xr_demo/miniprogram/pages/xr-scenic-point-render/index

## Frozen Runtime Rule

The renderer page is accepted only with primitive-sample ids, selectors, and ready-state logic preserved.

Do not rename internal xr-frame ids/selectors in this phase.

## Product Wrapper Goal

Create a normal miniapp product page or existing product entry that can:

1. explain the XR experience to the user
2. provide a button to enter the accepted renderer page
3. use `wx.navigateTo` to open the renderer
4. read renderer result from storage after return
5. show a simple result summary
6. keep MVP product flow independent from XR failure

## Recommended Product Entry

Use an ordinary page as wrapper, such as:

- XR Smoke Test during technical validation
- future scenic point detail page during product integration
- future exploration point page during real scenic deployment

Initial recommended implementation target:

XR Smoke Test wrapper entry

because it is already technical and safe.

## Navigation Rule

Use:

```js
wx.navigateTo({
  url: '/xr_demo/miniprogram/pages/xr-scenic-point-render/index'
})
```

Do not use `switchTab`.

Do not attempt to embed `xr-scene` inside the wrapper page.

## Result Return Rule

Renderer page may write:

```js
wx.setStorageSync('XR_SCENIC_POINT_RENDER_RESULT_V1', result)
```

Wrapper page may read this result in `onShow`.

Wrapper display fields:

- XR_SCENIC_POINT_RENDER_RETURNED
- XR_SCENIC_POINT_RENDER_STATUS
- XR_SCENIC_POINT_OBJECT_VISIBLE
- XR_SCENIC_POINT_BLOCK_REASON
- XR_SCENIC_POINT_CHECKED_AT

## Failure Handling

If renderer returns BLOCKED or no result:

- do not block the main product flow
- show fallback message
- allow user to continue with normal exploration / blessing reveal
- keep XR as enhancement, not MVP blocker

## UX Copy Draft

入口标题：

景点 XR 显现

入口说明：

打开已通过真机验证的 XR 渲染页，查看景点信物的最小 3D 显现效果。

失败兜底：

当前设备暂未完成 XR 显现，可继续通过普通探索流程获得信物。

## Forbidden

This wrapper plan must not introduce:

- Marker
- Anchor
- ARSystem
- VisionKit
- external GLB
- texture
- business data binding
- selector renaming
- mixed `xr-scene` inside ordinary page
- `wx:if` around `xr-scene`

## Next Implementation Task

XR_SCENIC_POINT_RENDERER_WRAPPER_ENTRY_V1

Purpose:

Add a safe wrapper entry in XR Smoke Test that opens the accepted scenic-point renderer and reads the storage result after return.

## Final Output

- XR_SCENIC_POINT_RENDERER_TEMPLATE_WRAPPER_PLAN_CREATED = YES
- ACCEPTED_RENDERER_REFERENCED = YES
- PRODUCT_WRAPPER_ROUTE_PLANNED = YES
- STORAGE_RESULT_READ_PLANNED = YES
- FALLBACK_UX_PLANNED = YES
- RENDERER_INTERNALS_UNCHANGED = YES
- MARKER_INCLUDED = NO
- ANCHOR_INCLUDED = NO
- BUSINESS_DATA_INCLUDED = NO
- READY_FOR_WRAPPER_ENTRY_IMPLEMENTATION = YES
