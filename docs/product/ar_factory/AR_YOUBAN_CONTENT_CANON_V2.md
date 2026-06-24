# AR_YOUBAN_CONTENT_CANON_V2

## Status

FROZEN

## Purpose

Freeze the final content canonical source for AR游伴.

This document defines the stable content rules for:

1. 28星宿系统
2. 四象系统
3. 365穴位经络归属系统
4. 经络视觉结构标准
5. 宝物 3D 资产系统
6. Unified canonical data source

This document is a frozen content source, not a runtime implementation note.

---

## 1. 28星宿系统

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

### 1.2 Star Mansion Visual Definition

Every star mansion is a visual structure, not a 3D creature.

Each mansion must be represented as a panel containing:

- `node`
  - star points
  - the smallest visible star units
- `sub-graph`
  - local connection lines between nodes
  - only for the internal structure of the mansion
- `boundary`
  - outer contour of the mansion panel
  - used to define the constellation frame

### 1.3 Star Mansion States

- `dim`
  - not yet lit
- `active`
  - currently lit
- `complete`
  - completed state with glow / burst emphasis

### 1.4 Visual UI Rules

- One mansion = one visual panel.
- One mansion = multiple star nodes.
- One mansion = one boundary shape.
- One mansion must never become a standalone 3D asset.
- A mansion completion may show glow, pulse, or burst ring effects.

---

## 2. 四象系统

### 2.1 Four-Symbol Structure

四象是 28 星宿的聚合层。

- 青龙 = 角、亢、氐、房、心、尾、箕
- 朱雀 = 井、鬼、柳、星、张、翼、轸
- 白虎 = 奎、娄、胃、昴、毕、觜、参
- 玄武 = 斗、牛、女、虚、危、室、壁

### 2.2 Four-Symbol Visual Rule

- 四象必须是视觉结构。
- 四象必须承接其成员星宿的完成状态。
- 星宿全部点亮后，四象节点点亮。
- 四象节点点亮时必须支持级联动画。

### 2.3 Four-Symbol States

- `idle`
- `active`
- `complete`

---

## 3. 365穴位经络归属系统

### 3.1 Core Rule

365 穴位全部归属经络系统。

穴位不做独立视觉设计。

穴位不做 3D 实体建模。

穴位只作为经络路径上的逻辑节点与触发点。

### 3.2 Meridian Classification Principle

The meridian system follows the standard Chinese medicine meridian framework.

The canonical meridian set is:

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

### 3.3 Acupoint Affiliation Rule

Each acupoint must belong to exactly one meridian.

Each acupoint entry in `ACUPOINT_DB` must contain:

- `acupointId`
- `acupointName`
- `meridianId`
- `meridianName`
- `acupointOrder`
- `visualRole = LOGIC_ONLY`

### 3.4 Canonical Meaning of the 365 Set

The full 365 acupoints are frozen in the canonical data source.

This document freezes the rule and structure:

- every acupoint is a meridian node
- every acupoint has a unique meridian affiliation
- no acupoint may be promoted to an independent visual object

The exact table belongs to the canonical database layer and must remain deterministic and versioned.

---

## 4. Meridian Visual Structure Standard

Each meridian must contain:

1. `main spline`
   - the primary visible route
2. `node`
   - acupoint markers along the route
3. `energy flow`
   - directional particle flow along the path
4. `activated segment`
   - highlighted segment for active progress

### 4.1 Meridian Visual Rule

- Meridian = visible path
- Acupoint = path node
- Lighting / activation must flow along the path
- Meridian must never be rendered as a non-path object

### 4.2 Meridian States

- `idle`
- `flowing`
- `activated`
- `completed`

---

## 5. 宝物系统

### 5.1 Core Definition

宝物是 3D 视觉资产。

宝物必须可用于 AR 触发、显现、展示与成长表达。

### 5.2 GLTF Asset Standard

The canonical 3D asset format is GLTF.

An artifact entry in `ARTIFACT_DB` must contain:

- `artifactId`
- `artifactName`
- `visualAssetType`
- `renderRule`
- `triggerRule`
- `themeBinding`

### 5.3 AR Spawn Rule

AR 触发后，宝物可被生成并挂载为可见 3D 实体。

### 5.4 Animation Standard

Accepted artifact animation states:

- `idle`
- `appear`
- `glow`

---

## 6. Core Lighting Logic

### 6.1 Star System

信物 -> 星位点亮 -> 星宿完成

### 6.2 Meridian System

穴位信物 -> 经络节点点亮 -> 经络完成

### 6.3 Four-Symbol System

星宿完成 -> 四象点亮 -> 四象完成

### 6.4 Artifact System

AR 触发 -> 宝物生成

---

## 7. Unified Canonical Data Source

All content must be frozen into the following canonical structures:

- `CONSTELLATION_DB`
- `MERIDIAN_DB`
- `ACUPOINT_DB`
- `FOUR_SYMBOL_DB`
- `ARTIFACT_DB`

### 7.1 CONSTELLATION_DB

Fields:

- `constellationId`
- `constellationName`
- `group`
- `groupName`
- `orderInGroup`
- `nodeList`
- `boundaryRule`
- `visualStatusRule`

### 7.2 MERIDIAN_DB

Fields:

- `meridianId`
- `meridianName`
- `category`
- `acupointCount`
- `mainPathRule`
- `flowRule`
- `activationRule`

### 7.3 ACUPOINT_DB

Fields:

- `acupointId`
- `acupointName`
- `meridianId`
- `meridianName`
- `orderInMeridian`
- `visualRole = LOGIC_ONLY`

### 7.4 FOUR_SYMBOL_DB

Fields:

- `symbolId`
- `symbolName`
- `memberConstellationIds`
- `visualRule`
- `completionRule`

### 7.5 ARTIFACT_DB

Fields:

- `artifactId`
- `artifactName`
- `visualAssetType`
- `renderRule`
- `triggerRule`
- `themeBinding`

---

## 8. Strong Constraints

- Star mansions must not become 3D entities.
- Acupoints must not become independent visual designs.
- Meridians must not become non-path objects.
- No new constellation structure may be invented outside the frozen 28 + 365 system.
- No new worldview layer may be introduced through this document.

---

## 9. Final Canonical Rule

The frozen content hierarchy is:

- 星宿 = visual design required
- 四象 = visual design required
- 经络 = visual path required
- 穴位 = logic-only node
- 宝物 = 3D visual asset

Representation mapping:

- `node` = 穴位 / 星位
- `line` = 经络
- `plane` = 星宿 / 四象
- `object` = 宝物

---

## 10. Freeze Result

CONTENT_FREEZE_STATUS = PASS
