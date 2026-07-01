/**
 * ORCHESTRATOR — LIFECYCLE MANAGER
 *
 * Manages page lifecycle states: draft → testing → frozen.
 *
 * ORCHESTRATOR §2.6: freezePage(page_id) — freeze and lock page.
 *
 * Lifecycle:
 *   draft   → page created, in development
 *   testing → page passed diff check, under auto-fix loop
 *   frozen  → page passed final validation, immutable, deployable
 */

var registryIndex = require('./registry-index');

/**
 * Advance a page to the "testing" state.
 * Preparatory stage before freeze — allows auto-fix loop.
 *
 * @param {string} pageId
 * @returns {Object} — updated registry entry
 */
function advanceToTesting(pageId) {
  if (!registryIndex.isRegistered(pageId)) {
    throw new Error('[LIFECYCLE] Cannot advance "' + pageId + '" — page not registered');
  }

  registryIndex.updatePageStatus(pageId, 'testing');
  return registryIndex.getPageEntry(pageId);
}

/**
 * Freeze a page — marks it as production-ready.
 *
 * Once frozen:
 *   - The page cannot be modified outside the orchestrator
 *   - The page can be deployed
 *   - The page version is locked
 *
 * ORCHESTRATOR §2.6: freezePage → registerToSystemRegistry + lockPageVersion
 *
 * @param {string} pageId
 * @param {Object} ui — the final rendered UI
 * @returns {Object} — updated registry entry
 */
function freezePage(pageId, ui) {
  if (!registryIndex.isRegistered(pageId)) {
    throw new Error('[LIFECYCLE] Cannot freeze "' + pageId + '" — page not registered');
  }

  // Update UI hash with final output
  registryIndex.updatePageUiHash(pageId, ui);

  // Lock version and freeze
  registryIndex.lockPageVersion(pageId);

  return registryIndex.getPageEntry(pageId);
}

/**
 * Check if a page is in frozen state.
 *
 * @param {string} pageId
 * @returns {boolean}
 */
function isPageFrozen(pageId) {
  return registryIndex.isFrozen(pageId);
}

/**
 * Get the current lifecycle status of a page.
 *
 * @param {string} pageId
 * @returns {string|null} — "draft" | "testing" | "frozen" | null
 */
function getPageStatus(pageId) {
  var entry = registryIndex.getPageEntry(pageId);
  return entry ? entry.status : null;
}

module.exports = {
  advanceToTesting: advanceToTesting,
  freezePage: freezePage,
  isPageFrozen: isPageFrozen,
  getPageStatus: getPageStatus
};
