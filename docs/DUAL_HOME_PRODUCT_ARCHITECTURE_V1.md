# DUAL_HOME_PRODUCT_ARCHITECTURE_V1

Generated: 2026-06-08

## Verdict

`DUAL_HOME_PRODUCT_ARCHITECTURE_V1_COMPLETE = YES`

## 1. Why Dual Home Exists

LOVEQIGU already carries two different user intents that should not be forced through one blended home surface:

- exploration intent: `Path A` and `Path B`
- commercial / activity intent: `Path C`

These intents use different language layers, different entry logic, and different success measures.

If they are mixed into one undifferentiated home:

- L1 commercial language starts to crowd out L2 exploration entry
- L2/L3 exploration copy starts to leak into commercial surfaces
- first-time users lose a clear route into the product
- returning users lose a reliable return path to the mode they actually want

Dual home solves that by separating:

- a `探索首页` surface for exploration-driven behavior
- a `结缘首页` surface for rights / campaign-driven behavior

This matches the existing language constitution and the current IA direction that keeps commercial surfaces out of the ritual chain.

## 2. Dual Home Definition

This V1 recommends a **single physical home shell with two logical home modes**.

That is the safest choice for the current repo state because:

- the app already has one primary entry route
- the existing miniapp routes are stable
- the repo already treats home as a stateful entry surface rather than a pure content page
- no code changes are required to define the architecture

### Logical modes

| Mode | Primary intent | Current product meaning |
|---|---|---|
| `探索首页` | explore, continue, observe, collect | Path A / Path B entry |
| `结缘首页` | rights, campaign, redeem, return | Path C entry |

### Implementation stance

- keep one home shell
- expose two modes inside it
- preserve a permanent switch between the two modes
- do not hide any core function behind settings

## 3. User Model

### 3.1 探索型用户

Core goal:
- continue chapter progress
- enter the exploration map
- review story and asset flow

Core behavior:
- opens the home for exploration
- expects immediate access to the map and chapter continuation

Core entry:
- `探索首页`

### 3.2 活动型用户

Core goal:
- view rights
- respond to campaigns
- reach the next activity state quickly

Core behavior:
- follows a campaign or rights entry
- expects a direct commercial or activity surface

Core entry:
- `结缘首页`

### 3.3 回访用户

Core goal:
- resume the last mode without friction

Core behavior:
- returns from a deep link, notification, or bookmark
- expects the app to remember the last useful home mode

Core entry:
- last-used mode by default
- always keep a manual switch available

### 3.4 首次进入用户

Core goal:
- understand what this product is without being overloaded

Core behavior:
- needs a low-friction default
- may not yet know whether they want exploration or campaign intent

Core entry:
- use source-based default first
- fall back to a two-choice choice surface only when the source is ambiguous

## 4. Path Attribution

### Recommended ownership

| Path | Belongs to | Reason |
|---|---|---|
| `Path A` | `探索首页` | exploration map -> AR -> Atom -> Lottie -> Echo -> Digital Collectible -> Next Activity is the core exploration closure chain |
| `Path B` | `探索首页` | story archive / story flow are still L2/L3 exploration behavior, not commercial intent |
| `Path C` | `结缘首页` | rights center / campaign closure / next activity is the commercial and activity lane |

### Why Path B stays with exploration

Path B is not a second commercial home. It is a story closure lane:

- Story Archive
- Story Flow
- AR Event
- Echo
- Digital Collectible

That is still exploration behavior and should stay under the same exploration mode as Path A.

### Why Path C gets the commercial home

Path C is the only current path whose center of gravity is:

- rights
- campaigns
- redemption / next activity

That belongs in the commercial lane and must stay separated from ritual exploration copy.

## 5. First Entry Mechanism

### Recommended strategy: hybrid

Use a hybrid entry policy:

1. source-based default
2. first-launch choice only when the source is ambiguous
3. persistent home-mode memory after the first decision

### Source-based default

If the user arrives from:

- story / chapter context
- AR / exploration content
- content share
- saved exploration bookmark

default to `探索首页`.

If the user arrives from:

- rights / coupon / campaign context
- activity notification
- redemption-related share

default to `结缘首页`.

### Ambiguous first entry

If the source does not imply a clear mode, show a minimal two-choice entry:

- 进入探索
- 进入结缘

This is better than a hard modal because it:

- makes the product intent explicit
- keeps the choice visible
- avoids locking the user into the wrong lane

## 6. Switching Mechanism

Switching must be permanently available.

### Requirements

- visible from both home modes
- one tap to switch
- no hidden settings dependency
- no dead-end mode
- no forced reset of the user's entire journey context

### Recommended behavior

- keep the current mode as the default return target
- allow an explicit switch action in the home shell
- preserve the user’s last mode in local preference
- still honor direct deep links when a specific path is requested

### What not to do

- do not hide one home behind a menu
- do not force a role-based lockout
- do not make the user re-decide every session
- do not mix L1 commercial messages into L2/L3 exploration headers

## 7. Expansion Strategy

This V1 should be expandable without reopening the core split.

### Future Path D

Recommended home:
- `结缘首页`

Likely expansion type:
- live ops
- campaign variations
- coupon / rights extensions
- next activity variants

Reason:
- these are commercial / activity objects, not exploration narrative objects

### Future Path E

Recommended home:
- `探索首页`

Likely expansion type:
- exploration special
- AR expansion
- offline or regional activity
- chapter extension

Reason:
- these are still exploration-intent surfaces and belong to the exploration lane

### Expansion rule

If a new path needs a different language layer, it must not be forced into the wrong home.

- L1 content stays in the commercial lane
- L2 exploration content stays in the exploration lane
- L3 ritual content stays inside approved exploration closures

## 8. Recommendation

Adopt this V1 architecture:

- one physical home shell
- two logical home modes
- `探索首页` for `Path A` and `Path B`
- `结缘首页` for `Path C`
- source-based default entry
- persistent user-controlled switching
- reserved slots for future `Path D` and `Path E`

### Why this is the right V1

- it matches the current repo state
- it respects the language constitution
- it preserves the separation between exploration and commerce
- it supports the current Path A/B/C closure model
- it leaves room for future expansion without redefining the product

## 9. Constraints

- no Canon changes
- no code changes
- no UI mockups in this document
- no new lore
- no new route requirements

## 10. References

- [LOVEQIGU_INFORMATION_ARCHITECTURE_V1.md](./architecture/LOVEQIGU_INFORMATION_ARCHITECTURE_V1.md)
- [LOVEQIGU_LANGUAGE_CONSTITUTION_V1.md](./language/LOVEQIGU_LANGUAGE_CONSTITUTION_V1.md)
- [LOVEQIGU_TERMINOLOGY_V1.md](./language/LOVEQIGU_TERMINOLOGY_V1.md)
- [LOVEQIGU_PROJECT_RELEASE_READINESS_REPORT.md](./LOVEQIGU_PROJECT_RELEASE_READINESS_REPORT.md)
- [RC2_ACCEPTANCE_AUDIT_REPORT.md](./RC2_ACCEPTANCE_AUDIT_REPORT.md)

