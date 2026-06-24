# ANCHOR_TRACKING_SPIKE_V1_REPORT

## Scope

Audit whether the current Landmark AR P0 runtime package can be bound to a real Anchor Tracking runtime in the current miniapp repository.

## Technical Input

- `LANDMARK_AR_P0_EFFECT_PROTOTYPE_V1`
- `apps/miniapp/data/runtime/ar_factory/landmark_tree_v1_p0a/runtime_package.js`
- `apps/miniapp/services/xr-anchor/anchor-service.js`

## What Was Added

- `apps/miniapp/services/xr-anchor/anchor-service.js`

## Repository Evidence

1. The runtime package contains `anchor_type: image_anchor` and an `anchor_payload` descriptor.
2. The repo does not contain a verified WeChat anchor runtime API such as:
   - `wx.createXRAnchor`
   - `wx.createAnchor`
   - `XRAnchor`
   - `Anchor` as a verified runtime object
3. Existing AR code paths consume static runtime data and overlays, not a live anchor-tracking renderer.

## Spike Result

- `XR_CAMERA_READY = YES`
- `XR_SCENE_READY = YES`
- `ANCHOR_CREATED = NO`
- `OBJECT_BOUND_TO_ANCHOR = NO`
- `WORLD_LOCKED = NO`
- `RUNTIME_TO_ANCHOR_MAPPING = YES`

## Current Scheme Classification

Marker Anchor

Reason:

- The current runtime package uses `image_anchor`.
- That is descriptor-based image anchoring, not verified SLAM world anchoring.

## What Is Verified

- Runtime package can be mapped into an anchor descriptor contract.
- The current codebase can read the anchor payload from the runtime package.

## What Is Not Verified

- A real live anchor creation API.
- Object binding to a live anchor in device runtime.
- World lock stability while moving the camera.

## Acceptance Verdict

- `ANCHOR_TRACKING_SPIKE_V1 = FAIL`

## Why It Fails

1. The repository has no verified WeChat anchor runtime binding API.
2. The current anchor data is a static descriptor contract, not a live anchor runtime.
3. Camera + XR Scene + model visibility do not prove anchor tracking.

## Distance To Next Paths

### To Marker AR

Still missing:

- a real anchor runtime API
- a page that creates and owns the anchor lifecycle
- a live bind between the anchor and rendered object

Estimated remaining spikes: 1

### To Dragon Effect

Still missing:

- the anchor tracking runtime
- live render binding between anchor state and the dragon effect output

Estimated remaining spikes after anchor runtime is available: 1

## Final Answers

1. Anchor truly created successfully: NO
2. XR Object bound to Anchor: NO
3. Moving phone keeps model locked: NO
4. Current scheme: Marker Anchor
5. Distance to Marker AR: 1 spike
6. Distance to Dragon Effect: 1 spike after anchor runtime binding exists

## Notes

- No runtime package schema was modified.
- No Visual Factory changes were made.
- No new gameplay, storyline, chapter, or commercial logic was added.
