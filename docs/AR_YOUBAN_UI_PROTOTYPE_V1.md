# 🌿 AR游伴 UI 原型结构 V1.0

---

## 1. System Overview

AR游伴 UI consists of 4 core layers:

1. Home Exploration Layer
2. Location Detail Layer
3. AR Experience Layer
4. Artifact Memory Layer

---

## 2. Global Navigation Structure

Bottom Navigation (fixed):

- Explore（探索）
- Map（地图）
- Artifacts（信物）
- Profile（我的）

---

# 3. HOME PAGE（探索首页）

## 3.1 Page Purpose

Entry point for discovery of locations.

Not informational. Not transactional.

---

## 3.2 Layout Structure

### A. Top Area
- Minimal title: "今天你想去哪里探索？"
- Optional subtle search entry

---

### B. Main Content Area
- Recommended location cards
- Each card includes:
  - Location name
  - Subtle cultural tag
  - Soft preview image
  - "进入探索" button

---

### C. Background
- Static or slow-moving cultural texture
- Low opacity ink landscape

---

## 3.3 Interaction

- Tap card → enter Location Detail Page
- Search → filtered location list

---

# 4. LOCATION DETAIL PAGE（景点详情页）

## 4.1 Purpose

Explain cultural location and provide AR entry.

---

## 4.2 Layout Structure

### A. Header
- Location name
- Region tag

---

### B. Narrative Section
- Scroll-based cultural introduction
- Ink scroll reveal animation style

---

### C. Exploration Points
- List of AR points
- Each point:
  - Name
  - Subtle hint
  - Unlock status

---

### D. AR Entry Button
- Primary CTA: "进入AR探索"

---

## 4.3 Interaction

- Scroll reveals content progressively
- Tap AR entry → AR layer

---

# 5. AR EXPERIENCE LAYER（AR探索层）

## 5.1 Purpose

Real-world augmented discovery interface.

---

## 5.2 Layout Rules

- Camera is full background
- UI must be minimal overlay only

---

## 5.3 AR Elements

- Micro glow points
- Soft floating markers
- Low opacity interaction hints

---

## 5.4 Interaction Flow

- Detect AR marker → highlight
- Tap marker → reveal artifact
- Collect artifact → store in memory layer

---

# 6. ARTIFACT MEMORY PAGE（信物系统）

## 6.1 Purpose

Store and display user discovered artifacts.

---

## 6.2 Layout Structure

### A. Artifact Grid
- Card-based layout
- Each card:
  - Name
  - Origin location
  - Discovery time
  - Narrative description

---

### B. Artifact Detail View
- Expanded narrative view
- Cultural meaning explanation
- Location link

---

## 6.3 Rules

- NO rarity system
- NO numeric stats
- NO gamification UI

---

# 7. MAP PAGE（地球/地图层）

## 7.1 Purpose

Global visualization of exploration points.

---

## 7.2 Layout

- Interactive globe or map
- Zoom: World → Country → City
- Clickable glowing nodes

---

## 7.3 Node Types

- User nodes
- Location nodes
- Cultural memory nodes

---

# 8. PROFILE PAGE（我的）

## 8.1 Purpose

User identity + exploration history.

---

## 8.2 Layout

- User name
- Exploration history list
- Collected artifacts
- Personal contribution entries

---

# 9. SYSTEM DESIGN PRINCIPLES

- Minimal UI
- Discovery-first experience
- Low cognitive load
- Cultural narrative driven
- No gamification system
