# AR_YOUBAN_CONTENT_CANON_V1

## Status

FROZEN

## Purpose

Define the AR游伴 content asset standard library as a single canonical source for:

1. 28星宿 structure
2. 星宿 visual structure rules
3. 365穴位 meridian assignment rules
4. 经络 visual structure rules
5. Unified frozen data source definitions

## Canonical Source

This document is the content-side canonicalization layer for AR游伴.

It aligns with the frozen relic / visual canon family and should be used together with:

- `docs/product/relic_system/RELIC_CANON_V2.md`
- `docs/product/relic_system/RELIC_VISUAL_CANON_V1.md`
- `docs/product/relic_system/HEAVEN_SYSTEM_HIERARCHY_CANON_V1.md`
- `docs/product/relic_system/RELIC_CONTENT_GENERATION_CANON_V1.md`

## 1. 28星宿 Standard Definition

### 1.1 Four-Group Structure

#### 青龙七宿

- 角
- 亢
- 氐
- 房
- 心
- 尾
- 箕

#### 朱雀七宿

- 井
- 鬼
- 柳
- 星
- 张
- 翼
- 轸

#### 白虎七宿

- 奎
- 娄
- 胃
- 昴
- 毕
- 觜
- 参

#### 玄武七宿

- 斗
- 牛
- 女
- 虚
- 危
- 室
- 壁

### 1.2 Visual Structure Rules

Every constellation mansion is a visual panel, not a 3D creature.

Each mansion must contain:

- `node`
  - star dots / star points
  - minimum atomic visual unit
- `sub-graph`
  - local connection lines between nodes
  - only supports the panel's internal constellation relation
- `boundary`
  - constellation perimeter / outer contour
  - used to define the panel shape

### 1.3 Mansion States

- `dim`
  - not yet lit
- `active`
  - currently lit
- `burst`
  - completed state with glow-ring / burst emphasis

### 1.4 Canonical Display Rule

1. One mansion = one star map panel.
2. One mansion = multiple star nodes.
3. One mansion = one structural boundary.
4. One mansion must not be converted into a standalone 3D asset entity.

## 2. 365穴位 System

### 2.1 Core Rule

穴位 is logic-only.

It must not become an independent visual model.

The visual carrier for a point is the meridian path and its node marker, not a separate 3D acupoint object.

### 2.2 Meridian Classification Table

The canonical 365穴位 inventory is assigned to the standard meridian system.

#### Main Meridians

- 手太阴肺经
- 手阳明大肠经
- 足阳明胃经
- 足太阴脾经
- 手少阴心经
- 手太阳小肠经
- 足太阳膀胱经
- 足少阴肾经
- 手厥阴心包经
- 手少阳三焦经
- 足少阳胆经
- 足厥阴肝经

#### Extension Scope

If the canonical content set requires additional structural classification, it must follow the standard Chinese medicine meridian framework and remain in the canonical data source.

### 2.3 Acupoint Mapping Rule

Every acupoint in `ACUPOINT_DB` must have:

- `acupointId`
- `acupointName`
- `meridianId`
- `meridianName`
- `acupointOrder`
- `visualRole = LOGIC_ONLY`

Acupoints may only serve as:

- path nodes
- trigger nodes
- progression checkpoints

They must not be represented as standalone visual entities.

### 2.4 Meridian Classification Examples

The following examples are canonical examples of the assignment rule:

- 中府 → 手太阴肺经
- 云门 → 手太阴肺经
- 合谷 → 手阳明大肠经
- 曲池 → 手阳明大肠经
- 承泣 → 足阳明胃经

The full 365-point table must follow the same assignment rule in the canonical data source.

## 3. Meridian Visual Structure Standard

Each meridian must contain:

1. `main spline`
   - the primary visible route
2. `node`
   - acupoint markers along the route
3. `energy flow`
   - flow animation / directional particle flow
4. `activated segment`
   - highlighted section for active progress

### 3.1 Meridian Visual Rule

- Meridian = visible path
- Acupoint = path node
- Lighting / activation must flow along the path
- Meridian must not be rendered as a non-path object

### 3.2 Meridian States

- `idle`
- `flowing`
- `activated`
- `completed`

## 4. Point-Lighting Logic

### 4.1 Star Mansion System

`relic` -> `star node lit` -> `mansion complete`

### 4.2 Meridian System

`acupoint relic` -> `meridian node lit` -> `meridian complete`

### 4.3 Four Symbol System

`mansion complete` -> `four-symbol node lit` -> `four-symbol complete`

### 4.4 Artifact System

`AR trigger` -> `3D object generated`

## 5. Data Asset Freeze Rules

All content must be stored under a unified canonical source set:

- `CONSTELLATION_DB`
- `MERIDIAN_DB`
- `ACUPOINT_DB`
- `FOUR_SYMBOL_DB`
- `ARTIFACT_DB`

### 5.1 Canonical Source Requirements

Each database entry must be deterministic, versioned, and reusable by:

- runtime package
- content production
- visual generation
- AR rendering

### 5.2 Data Schema Definition

#### CONSTELLATION_DB

Fields:

- `constellationId`
- `constellationName`
- `group`
- `groupName`
- `orderInGroup`
- `nodeList`
- `boundaryRule`
- `visualStatusRule`

#### MERIDIAN_DB

Fields:

- `meridianId`
- `meridianName`
- `category`
- `acupointCount`
- `mainPathRule`
- `flowRule`
- `activationRule`

#### ACUPOINT_DB

Fields:

- `acupointId`
- `acupointName`
- `meridianId`
- `meridianName`
- `orderInMeridian`
- `visualRole = LOGIC_ONLY`

#### FOUR_SYMBOL_DB

Fields:

- `symbolId`
- `symbolName`
- `memberConstellationIds`
- `visualRule`
- `completionRule`

#### ARTIFACT_DB

Fields:

- `artifactId`
- `artifactName`
- `visualAssetType`
- `renderRule`
- `triggerRule`
- `themeBinding`

## 6. Forbidden Behavior

- Do not render 星宿 as a standalone 3D model entity.
- Do not give 穴位 an independent visual asset requirement.
- Do not turn 经络 into a non-path object.
- Do not invent random constellation structures.
- Do not break the 28 + 365 system.

## 7. Final Canonical Rule

The content system is frozen around the following responsibilities:

- 星宿 = visual structure
- 四象 = visual structure
- 经络 = visual path
- 穴位 = logic-only node
- 宝物 = 3D visual asset

If future content needs a representation decision:

- use `node` for trigger
- use `line` for meridian
- use `plane` for structure
- use `object` for treasure

## Final Output

`AR_YOUBAN_CONTENT_CANON_V1 = PASS`
