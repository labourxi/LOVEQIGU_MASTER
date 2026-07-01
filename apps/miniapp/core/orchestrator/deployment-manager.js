/**
 * ORCHESTRATOR — DEPLOYMENT MANAGER
 *
 * Handles deployment of frozen pages to the production runtime.
 *
 * ORCHESTRATOR §6: deployPage(page_id) — only frozen pages can be deployed.
 *
 * ORCHESTRATOR §5:
 *   - No page can bypass orchestrator
 *   - No direct UI creation allowed
 *   - All pages MUST go through pipeline
 *   - All outputs MUST be validated
 *   - Only PASS pages can be frozen
 */

var lifecycleManager = require('./lifecycle-manager');

/**
 * Simulated runtime storage for deployed pages.
 * In production, this would push to actual WeChat Mini Program runtime.
 */
var runtimeStore = {};

/**
 * Check if a page is frozen and ready to deploy.
 *
 * @param {string} pageId
 * @returns {boolean}
 */
function isDeployable(pageId) {
  return lifecycleManager.isPageFrozen(pageId);
}

/**
 * Deploy a frozen page to the production runtime.
 *
 * ORCHESTRATOR §6:
 *   if (!isFrozen(pageId)) throw Error("PAGE_NOT_FROZEN")
 *   pushToRuntime(pageId)
 *
 * @param {string} pageId — the page ID to deploy
 * @param {Object} ui — the final rendered UI
 * @throws {Error} — if page is not frozen
 * @returns {Object} — deployment confirmation
 */
function deployPage(pageId, ui) {
  if (!isDeployable(pageId)) {
    throw new Error('PAGE_NOT_FROZEN: "' + pageId + '" must be frozen before deployment');
  }

  var result = pushToRuntime(pageId, ui);

  return {
    status: 'DEPLOYED',
    page_id: pageId,
    deployed_at: new Date().toISOString(),
    runtime_key: result.key
  };
}

/**
 * Push a page to the production runtime.
 *
 * This is the single entry point for UI into the runtime system.
 * No UI should exist in production that didn't go through this function.
 *
 * @param {string} pageId
 * @param {Object} ui — the rendered UI descriptor
 * @returns {Object} — runtime storage info
 */
function pushToRuntime(pageId, ui) {
  var key = 'runtime_' + pageId;

  runtimeStore[key] = {
    page_id: pageId,
    ui: ui,
    deployed_at: new Date().toISOString(),
    version: '1.0.0'
  };

  return { key: key };
}

/**
 * Get a deployed page from the runtime.
 *
 * @param {string} pageId
 * @returns {Object|null} — the stored runtime entry
 */
function getDeployedPage(pageId) {
  return runtimeStore['runtime_' + pageId] || null;
}

/**
 * Get all deployed pages.
 *
 * @returns {Object} — runtime_store map
 */
function getDeployedPages() {
  return JSON.parse(JSON.stringify(runtimeStore));
}

/**
 * Clear the runtime store (for testing).
 */
function clearRuntimeStore() {
  runtimeStore = {};
}

module.exports = {
  isDeployable: isDeployable,
  deployPage: deployPage,
  pushToRuntime: pushToRuntime,
  getDeployedPage: getDeployedPage,
  getDeployedPages: getDeployedPages,
  clearRuntimeStore: clearRuntimeStore
};
