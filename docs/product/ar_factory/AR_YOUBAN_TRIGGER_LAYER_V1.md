# AR_YOUBAN_TRIGGER_LAYER_V1

## Purpose

Add a business-layer semantic trigger wrapper on top of the existing `ar-marker-entry` component without touching `xr-frame` runtime internals.

## Event Mapping Table

| Runtime State | Semantic Hook | Business Events | Meaning |
| --- | --- | --- | --- |
| DETECTED | `onMarkerDetected()` | `relic_spawn` | Marker recognized and target is present |
| RENDERING | `onModelAppear()` | `story_progress` | Model becomes visible in the AR scene |
| LOST | `onMarkerLost()` | `quest_update` | Marker lost and scene should clear |

## Trigger Handler File

`apps/miniapp/services/ar-marker-trigger-layer/index.js`

## Current Component

`apps/miniapp/components/ar-marker-entry/index`

## Example Invocation

```xml
<ar-marker-entry
  bind:relic_spawn="onRelicSpawn"
  bind:story_progress="onStoryProgress"
  bind:quest_update="onQuestUpdate"
  bind:markerdetected="onMarkerDetected"
  bind:modelappear="onModelAppear"
  bind:markerlost="onMarkerLost"
/>
```

```js
Page({
  onRelicSpawn(e) {
    console.log('relic_spawn', e.detail);
  },
  onStoryProgress(e) {
    console.log('story_progress', e.detail);
  },
  onQuestUpdate(e) {
    console.log('quest_update', e.detail);
  },
  onMarkerDetected(e) {
    console.log('onMarkerDetected', e.detail);
  },
  onModelAppear(e) {
    console.log('onModelAppear', e.detail);
  },
  onMarkerLost(e) {
    console.log('onMarkerLost', e.detail);
  }
});
```

## Notes

- This layer only wraps business semantics.
- It does not modify `xr-frame` core logic.
- It keeps the door open for future themed asset switching such as Qinglong, Golden Dragon, or Phoenix at the business layer.
- The runtime state is intentionally limited to:
  - `DETECTED`
  - `RENDERING`
  - `LOST`

## Acceptance

- `triggerEvent("relic_spawn")` available
- `triggerEvent("story_progress")` available
- `triggerEvent("quest_update")` available
- `xr-frame` core untouched
- business layer only
