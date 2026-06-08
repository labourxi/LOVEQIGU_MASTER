# LOVEQIGU Core MVP Build

Objective:

Build the first complete LOVEQIGU MiniApp MVP using the approved Canon, World Bible, Terminology, Information Architecture, AGENTS.md and OMX rules.

Read first:

- AGENTS.md
- docs/canon/*
- docs/world/*
- docs/language/*
- docs/architecture/*
- governance/*

Pages:

1. explore-map
2. rights-center
3. relic-archive
4. story-archive
5. ar-entry

Requirements:

Explore Map

- show exploration regions
- show discovered locations
- show exploration progress
- no ranking
- no levels
- no SSR language
- personal journey only

Rights Center

- commercial layer only
- benefits display
- redemption placeholder
- no ritual language

Relic Archive

- show Relic records
- Relic is story progression asset
- must not be described as marketing asset

Story Archive

- timeline style
- chapter style
- archive style

AR Entry

- prepare AR_GATE_OPEN_V1 entry
- prepare AR_IMPRINT_PARTICLES_V1 entry
- placeholder interaction only
- no fake AR implementation

Global Requirements

- responsive WXML
- WXSS polished layout
- JSON valid
- route registration valid

Compliance

Run:

node scripts/omx/run_omx_checks.js

Must achieve:

4 checks run
4 passed
0 violations

Logging

Create:

docs/MVP_BUILD_REPORT.md

Include:

- files created
- files modified
- route changes
- OMX result
- unresolved gaps

Rules

Never invent Canon.
Never fill Canon gaps.
Report missing information instead.

Do not modify governance files.