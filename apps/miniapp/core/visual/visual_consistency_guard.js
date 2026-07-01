// ═════════════════════════════════════════════════════════════════════
// V5.9.2 — VISUAL CONSISTENCY GUARD
//
// FROZEN — No structural changes allowed after V5.8 baseline.
//
// This file defines the locked visual engine API and enforces that
// ALL UI rendering flows through a single renderTree source.
//
// Core principle:
//   UI MUST ONLY consume renderTree. No direct state access, no
//   inline style computation, no layout branching in WXML.
//
// NOTE (PAGE_CONTRACT_V1):
//   As of V5.9.25, the explore page delegates ALL data generation to
//   store.buildExploreRenderTree(). The functions below are retained
//   as frozen schema documentation only and are no longer active.
// ═════════════════════════════════════════════════════════════════════

module.exports = {
  // LEGACY: These functions have been migrated to
  // world_runtime_store.js → buildExploreRenderTree()
  // They remain only as frozen reference documentation.
  schema: null
};
