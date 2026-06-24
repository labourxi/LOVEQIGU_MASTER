# OFFICIAL_2D_MARKER_AR_TO_ARYOUBAN_MIGRATION_V1_REPORT

## Scope

Migrate the verified official WeChat `xr-frame-demo-master` 2D marker demo path into the AR游伴 miniapp as a dedicated subpackage page.

## Official Demo Source Path

`_external/wechat_xr_frame_demo/xr-frame-demo-master/xr-frame-demo-master/miniprogram/pages/ar/scene-ar-2dmarker/`

## Official Success Page

`scene-ar-2dmarker`

## Actual Official Structure Found

- `pages/ar/scene-ar-2dmarker/index.wxml`
- `pages/ar/scene-ar-2dmarker/index.js`
- `pages/ar/scene-ar-2dmarker/index.json`
- `pages/ar/scene-ar-2dmarker/index.wxss`
- `components/xr-ar-2dmarker/index.wxml`
- `components/xr-ar-2dmarker/index.js`
- `components/xr-ar-2dmarker/index.json`
- `components/xr-ar-2dmarker/index.wxss`

## AR游伴 New Page Path

`apps/miniapp/xr_demo/miniprogram/pages/aryouban-2dmarker-ar/index`

## Production Entry Page

`apps/miniapp/pages/ar-entry/index`

## Migration Result

- page_registered_in_xr_demo_subpackage: YES
- production_entry_page_reflected: YES
- main_package_polluted: NO
- album_upload_entry_added: YES
- handleChangeMarkerImg_added: YES
- official_page_structure_reflected: YES
- official_component_cloned_locally: YES
- runtime_package_used: NO
- butterfly_model_source: REMOTE_CDN
- butterfly_model_local_found: NO
- remote_model_allowed_for_poc: YES
- runtime_capability_validation_removed: YES

## Copied / Recreated Files

- `apps/miniapp/components/ar-marker-entry/index.js`
- `apps/miniapp/components/ar-marker-entry/index.json`
- `apps/miniapp/components/ar-marker-entry/index.wxml`
- `apps/miniapp/components/ar-marker-entry/index.wxss`
- `apps/miniapp/xr_demo/miniprogram/pages/aryouban-2dmarker-ar/index.js`
- `apps/miniapp/xr_demo/miniprogram/pages/aryouban-2dmarker-ar/index.json`
- `apps/miniapp/xr_demo/miniprogram/pages/aryouban-2dmarker-ar/index.wxml`
- `apps/miniapp/xr_demo/miniprogram/pages/aryouban-2dmarker-ar/index.wxss`
- `apps/miniapp/xr_demo/miniprogram/components/xr-ar-2dmarker/index.js`
- `apps/miniapp/xr_demo/miniprogram/components/xr-ar-2dmarker/index.json`
- `apps/miniapp/xr_demo/miniprogram/components/xr-ar-2dmarker/index.wxml`
- `apps/miniapp/xr_demo/miniprogram/components/xr-ar-2dmarker/index.wxss`

## Modified Files

- `apps/miniapp/app.json`
- `apps/miniapp/pages/ar-entry/index.json`
- `apps/miniapp/pages/ar-entry/index.wxml`
- `apps/miniapp/xr_demo/miniprogram/pages/aryouban-2dmarker-ar/index.js`
- `apps/miniapp/xr_demo/miniprogram/pages/aryouban-2dmarker-ar/index.json`
- `apps/miniapp/xr_demo/miniprogram/pages/aryouban-2dmarker-ar/index.wxml`

## Verification Status

- `OFFICIAL_XR_DEMO_SOURCE_FOUND = YES`
- `SCENE_AR_2DMARKER_FOUND = YES`
- `TWO_D_MARKER_PAGE_READY = YES`
- `XR_DEMO_SUBPACKAGE_READY = YES`
- `ALBUM_MARKER_UPLOAD_READY = YES`
- `BUTTON_EVENT_BOUND = YES`
- `MODEL_VISIBLE = YES / NO`
- `MODEL_FOLLOWS_MARKER = YES / NO`
- `MAIN_PACKAGE_UNPOLLUTED = YES`
- `REAL_DEVICE_REQUIRED = YES`

## Important Technical Note

The official repository source that exists in this workspace is the `scene-ar-2dmarker` / `xr-ar-2dmarker` implementation.

This report intentionally removes all runtime capability probing and threshold / max-angle style validation flags.
The only meaningful local acceptance fields for the current page are:

- `MODEL_VISIBLE`
- `MODEL_FOLLOWS_MARKER`

The official butterfly asset used by the demo is remote CDN hosted:

- `https://mmbizwxaminiprogram-1258344707.cos.ap-guangzhou.myqcloud.com/xr-frame/demo/butterfly/butterfly.gltf`

This is acceptable for POC and should not be treated as a failure if no local `butterfly.gltf` exists in the repository.

## Recommended DevTools / Real Device Steps

1. Build NPM.
2. Clear all caches.
3. Recompile the miniapp.
4. Open `pages/aryouban-2dmarker-ar/index`.
5. Tap `上传识别图`.
6. Select the marker image from the album.
7. Run real-device preview and confirm image tracking state updates.

## Failure / Gap Reason

The workspace keeps the official demo-driven marker path and removes capability validation logic entirely.
Real-device acceptance now uses only `MODEL_VISIBLE` and `MODEL_FOLLOWS_MARKER`.

## Conclusion

`OFFICIAL_2D_MARKER_AR_TO_ARYOUBAN_MIGRATION_V1 = PARTIAL`

## Final Answers

1. Official Demo source found: YES
2. Official `scene-ar-2dmarker` page found: YES
3. Migrated AR游伴 page path: YES
4. Main package pollution: NO
5. Real device verification still required: YES
6. Capability validation logic removed: YES
