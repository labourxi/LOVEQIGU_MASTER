# AR_RELIC_SYSTEM_V3

## Status

FROZEN

## Purpose

Define the AR relic visualization stack as a layered system so product and runtime teams use the same rendering responsibilities.

## Layer Rules

### 1. 星宿系统

- Status: `VISUAL_REQUIRED`
- Role: structural visual layer for star mansion grouping

### 2. 四象系统

- Status: `VISUAL_REQUIRED`
- Role: structural visual layer for four-symbol grouping

### 3. 经络系统

- Status: `VISUAL_REQUIRED`
- Role: visualized path layer

### 4. 穴位系统

- Status: `LOGIC_ONLY`
- Role: logical node layer only
- Usage: path node / trigger node

### 5. 宝物系统

- Status: `3D_VISUAL_REQUIRED`
- Role: 3D asset rendering layer

## Core Mapping

- `node` = 穴位 / 星位
  - trigger node
  - logic entry point
- `line` = 经络
  - visual path
  - flow connection
- `plane` = 星宿 / 四象
  - structure map
  - grouping layer
- `object` = 宝物
  - 3D asset
  - visible rendered object

## Rendering Priority

1. `object` must be renderable as a 3D asset.
2. `line` must be visually present for meridian progression.
3. `plane` must provide structural context for star mansion / four-symbol grouping.
4. `node` must remain logic-only and act as a trigger.

## Accepted Behavior

- Node can trigger progression.
- Line can visualize flow.
- Plane can organize structure.
- Object can render the relic itself.

## Forbidden Behavior

- Do not turn 穴位 into a visual asset requirement.
- Do not collapse 星宿 / 四象 into logic-only state.
- Do not remove 经络 visual path representation.
- Do not reduce 宝物 to a pure logic marker.

## Implementation Boundary

This document defines system semantics only.

It does not change:

- runtime package schema
- visual factory runtime
- release logic
- marker / anchor runtime

## Relationship To Existing Systems

This system sits above the existing relic / visual / runtime layers and should be used as the shared interpretation rule for future AR entry pages.

## Final Rule

If a future AR page needs to choose a layer responsibility:

- use `node` for trigger
- use `line` for meridian
- use `plane` for structure
- use `object` for treasure rendering
