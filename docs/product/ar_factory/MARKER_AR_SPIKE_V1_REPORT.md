# MARKER_AR_SPIKE_V1_REPORT

## Scope

Audit whether the current Landmark AR P0 runtime package can truly run Marker AR in the current miniapp repository.

## Technical Input

- `LANDMARK_AR_P0_EFFECT_PROTOTYPE_V1`
- `apps/miniapp/data/runtime/ar_factory/landmark_tree_v1_p0a/runtime_package.js`
- `apps/miniapp/services/xr-marker/marker-service.js`

## What Was Added

- `apps/miniapp/services/xr-marker/marker-service.js`
- `apps/miniapp/services/xr-marker/marker-runtime.js`

## Repository Evidence

1. The runtime package is anchor-based and contains no verified `marker` runtime section.
2. The repo does not contain a verified WeChat marker runtime API such as:
   - `wx.createXRMarker`
   - `wx.createMarker`
   - `XRMarker`
   - `Marker` as a verified runtime object
3. Existing code paths can only read the runtime package and its anchor-based evidence. They do not bind a live marker to a rendered object.

## Spike Result

- `XR_CAMERA_READY = YES`
- `XR_SCENE_READY = YES`
- `MARKER_DETECTED = NO`
- `ANCHOR_CREATED = NO`
- `OBJECT_BOUND = NO`
- `WORLD_LOCKED = NO`
- `RUNTIME_MARKER_BINDING = YES`

## Current Scheme Classification

Marker Anchor Descriptor

Reason:

- The current runtime package is still `image_anchor` / descriptor-driven.
- No verified marker runtime descriptor exists in the P0 package.

## What Is Verified

- Runtime package can be read.
- Anchor descriptor data exists as static evidence.
- A mapping probe can be built on top of the runtime package.

## What Is Not Verified

- Marker detection in the live WeChat runtime.
- Anchor creation from marker detection.
- Object binding to a live marker anchor.
- World lock while moving the device.

## Acceptance Verdict

- `MARKER_AR_SPIKE_V1 = FAIL`

## Why It Fails

1. No verified marker runtime API exists in the repository.
2. The P0 runtime package does not contain a live marker contract.
3. Camera + XR Scene + model visibility do not prove marker AR.

## Distance To Dragon Effect

Still missing:

- real marker runtime detection
- marker-to-anchor lifecycle binding
- object follow behavior while moving the camera

Estimated remaining spikes after marker runtime exists: 1

## Distance To Real Scenic AR Launch

Still missing:

- verified marker runtime
- stable anchor tracking or marker anchor lock
- object/render binding in a supported device runtime

Estimated remaining spikes: 1 to establish marker runtime, then 1 additional integration spike for product binding

## Final Answers

1. Marker truly detected successfully: NO
2. Anchor truly created successfully: NO
3. XR Object truly bound: NO
4. Moving phone keeps model locked: NO
5. Distance to Dragon Effect: 1 spike after marker runtime exists
6. Distance to real scenic AR launch: at least 2 spikes total from this point

## Notes

- No runtime package schema was modified.
- No Visual Factory changes were made.
- No new gameplay, storyline, chapter, or commercial logic was added.
