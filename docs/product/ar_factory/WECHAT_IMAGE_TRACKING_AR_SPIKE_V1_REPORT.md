# WECHAT_IMAGE_TRACKING_AR_SPIKE_V1_REPORT

## Scope

Audit whether the repository contains a verified WeChat `xr-frame` Image Tracking runtime path that can bind a real image target to an XR object and keep it world-locked.

## What Was Checked

- `apps/miniapp/xr_demo/miniprogram/pages/`
- `apps/miniapp/services/`
- `apps/miniapp/data/runtime/ar_factory/`
- `docs/`

## Repository Evidence

1. The repository contains XR camera and AR preview probes.
2. The repository contains marker-style and anchor-style descriptor probes.
3. The repository does **not** contain a verified official `packages/xr-frame/examples/ar-marker` source tree.
4. The repository does **not** contain a verified `xr-ar-tracker type="image"` runtime page.
5. The repository does **not** contain a verified `xr-ar-anchor` or live `createAnchor` image-tracking implementation.

## What Was Not Verified

- `IMAGE_TRACKER_READY`
- `IMAGE_TARGET_CONFIGURED`
- `IMAGE_DETECTED`
- `ANCHOR_CREATED`
- `OBJECT_BOUND_TO_ANCHOR`
- `WORLD_LOCKED`

## Conclusion

`WECHAT_IMAGE_TRACKING_AR_SPIKE_V1 = FAIL`

Reason:

- No verified official image-tracking example was present in the repository.
- No repository evidence proves a live `xr-ar-tracker type="image"` runtime path.
- Current runtime assets are descriptor-based probes, not a confirmed live image-tracking implementation.

## Current Scheme Classification

`MARKER_ANCHOR_DESCRIPTOR`

Reason:

- The repository evidence only proves descriptor mapping and preview probes.
- It does not prove a live image target runtime or a stable world lock.

## Direct Answers

1. Official `ar-marker` sample found: NO
2. `xr-ar-tracker type="image"` successfully integrated: NO
3. WeChat backend image library required: YES, if the official image-tracking runtime is used
4. Real device verification still required: YES

## Distance To Target Effect Paths

### To Dragon / Golden Dragon / Phoenix Effect

Still missing:

- a verified live image-tracking runtime page
- a confirmed image target configuration flow
- a real anchor/object binding loop in device runtime
- world-lock stability proof on motion

## Minimal Next Step

Acquire or restore the verified official WeChat `xr-frame` Image Tracking example source, then wire a controlled miniapp page against that sample before any product integration.

