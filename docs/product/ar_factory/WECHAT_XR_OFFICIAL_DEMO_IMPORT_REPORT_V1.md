# WECHAT_XR_OFFICIAL_DEMO_IMPORT_REPORT_V1

## Official Demo Source

- GitHub: [https://github.com/dtysky/xr-frame-demo](https://github.com/dtysky/xr-frame-demo)
- Official docs: [https://developers.weixin.qq.com/miniprogram/dev/framework/xr-frame/](https://developers.weixin.qq.com/miniprogram/dev/framework/xr-frame/)

## Imported Modules

- `miniprogram/components/common/share-behavior.js`
- `miniprogram/components/xr-ar-camera/`
- `miniprogram/components/template/xr-template-arPreview/`

## Import Strategy

- Imported the official demo behavior and component logic into an isolated local area:
  - `apps/miniapp/xr_demo/miniprogram/`
- Added a dedicated page wrapper:
  - `apps/miniapp/pages/xr-frame-official-demo/index`
- Kept the existing AR runtime / factory / release chain untouched.

## New Files

- `apps/miniapp/xr_demo/miniprogram/components/common/share-behavior.js`
- `apps/miniapp/xr_demo/miniprogram/components/xr-ar-camera/index.js`
- `apps/miniapp/xr_demo/miniprogram/components/xr-ar-camera/index.json`
- `apps/miniapp/xr_demo/miniprogram/components/xr-ar-camera/index.wxml`
- `apps/miniapp/xr_demo/miniprogram/components/xr-ar-camera/index.wxss`
- `apps/miniapp/xr_demo/miniprogram/components/template/xr-template-arPreview/index.js`
- `apps/miniapp/xr_demo/miniprogram/components/template/xr-template-arPreview/index.json`
- `apps/miniapp/xr_demo/miniprogram/components/template/xr-template-arPreview/index.wxml`
- `apps/miniapp/xr_demo/miniprogram/components/template/xr-template-arPreview/index.wxss`
- `apps/miniapp/pages/xr-frame-official-demo/index.js`
- `apps/miniapp/pages/xr-frame-official-demo/index.json`
- `apps/miniapp/pages/xr-frame-official-demo/index.wxml`
- `apps/miniapp/pages/xr-frame-official-demo/index.wxss`

## Modified Files

- `apps/miniapp/app.json`

## Run Entry

- WeChat Developer Tools page: `pages/xr-frame-official-demo/index`

## DevTools Validation Steps

1. Open WeChat Developer Tools.
2. Clear all caches.
3. Recompile the miniapp.
4. Open `pages/xr-frame-official-demo/index`.
5. Switch between Camera Demo and AR Preview Demo.
6. Check whether `XR_FRAME_EXISTS` / `XR_SCENE_READY` / `XR_RENDER_READY` become `YES` in the current runtime.

## Real Device Validation Steps

1. Install the miniapp on a supported device.
2. Open `pages/xr-frame-official-demo/index`.
3. Verify camera and XR scene boot on device.
4. Confirm whether the official demo renders the AR preview path.

## Verification Result

- `XR_FRAME_EXISTS = NO`
- `XR_SCENE_READY = NO`
- `XR_RENDER_READY = NO`
- `MARKER_AR_READY = NO`
- `RUNTIME_TO_XR_COMPATIBLE = NO`

## Why It Is Not PASS

1. The repository now contains the official demo source import, but the current runtime still does not expose a verified XR-Frame API.
2. The miniapp project does not declare a confirmed XR plugin or SDK dependency in its config.
3. Marker AR source could not be fully wired from the current repository evidence.

## Failure Classification

- `D. 需要真机验证`
- `E. 接入方式未知`
- `F. 代码实现失败`

## Official Demo Notes

- The official repository README states the demo set requires:
  - WeChat Nightly devtools
  - latest client
  - base library `2.27.1`
- The official repo contains:
  - `xr-ar-camera`
  - `xr-template-arPreview`
  - marker / glTF / basic / particle examples

## Recommended Next Step

1. Confirm the exact XR-Frame SDK / plugin packaging method for the current miniapp runtime.
2. If the SDK is available, wire the official demo page into a true runtime host instead of a wrapper page.
3. Then evaluate marker AR separately.

## Final Conclusion

- `WECHAT_XR_OFFICIAL_DEMO_IMPORT_V1 = PARTIAL`

