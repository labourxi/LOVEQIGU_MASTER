# LOVEQIGU / AR游伴
# UI SPEC LAYER V1（冻结版）

---

## 1. PURPOSE

This layer defines a machine-readable UI generation system.

It replaces natural language UI instructions with structured PageSpec.

Goal:
- Remove ambiguity for Cursor
- Enforce deterministic UI generation
- Bind layout + data + assets + behavior

---

## 2. CORE PAGE SPEC STRUCTURE

All pages MUST follow this schema:

PageSpec {
  page_id: string,
  type: string,
  layout: LayoutSpec,
  data: DataBinding,
  assets: AssetBinding,
  components: ComponentTree,
  behavior: BehaviorSpec,
  rules: RuleSet
}

---

## 3. PAGE TYPES

Supported page types:

- landing
- explore
- relic
- echo
- collection
- profile

No additional page types allowed without update of this spec.

---

## 4. LAYOUT SPEC

Layout must define structure explicitly:

layout = {
  structure: "vertical_stack | grid | layered | orbit",
  layers: [
    "background",
    "hero",
    "content",
    "action"
  ]
}

Rules:
- Every page MUST define layers
- No implicit layout allowed

---

## 5. COMPONENT TREE RULE

All UI must be defined as component tree:

Component {
  type: string,
  asset?: string,
  data?: string,
  interaction?: string,
  children?: Component[]
}

Rules:
- No UI outside component tree
- No ad-hoc layout rendering

---

## 6. DATA BINDING RULE

All data MUST bind from:

user_state

Allowed fields:

- exploration_count
- relic_count
- collectible_count
- rights_count
- region

No direct hardcoded values allowed for core stats.

---

## 7. ASSET RULE

All assets MUST use ASSET_MAP only.

Forbidden:
- direct image path usage
- unregistered assets

Allowed:
- asset_id references only

---

## 8. BEHAVIOR SPEC

Behavior must be explicitly defined:

Behavior {
  on_load: [],
  on_click: {},
  on_enter: {},
  on_exit: {}
}

No implicit interactions allowed.

---

## 9. GLOBAL RULES

- UI must strictly follow PageSpec
- No deviation in layout without spec update
- No direct image or asset usage
- No undefined components
- No non-binding data usage

---

## 10. RENDERING RULE

Cursor must:

1. Parse PageSpec
2. Build component tree
3. Bind data
4. Resolve assets via ASSET_MAP
5. Render UI

NO natural language interpretation allowed at runtime.

---

## 冻结元信息

STATUS: FROZEN
VERSION: V1
DATE: 2026-06-29
OWNER: LOVEQIGU

---

## END OF SPEC
