/**
 * ORCHESTRATOR — REGISTRY INDEX
 *
 * Manages the page registry that tracks all page lifecycle states.
 *
 * ORCHESTRATOR §4: All pages MUST be registered.
 *
 * Registry format:
 *   {
 *     page_id: {
 *       version: string,
 *       status: "draft" | "testing" | "frozen",
 *       spec_hash: string,
 *       ui_hash: string,
 *       created_at: string,
 *       updated_at: string
 *     }
 *   }
 */

var crypto = require('crypto');

var REGISTRY_PATH = null; // Set by initRegistry
var inMemoryRegistry = {};

var VALID_STATUSES = ['draft', 'testing', 'frozen'];

/**
 * Initialize the registry (in-memory, path can be set for persistence).
 *
 * @param {string} [registryPath] — optional file path for registry
 */
function initRegistry(registryPath) {
  REGISTRY_PATH = registryPath || null;
  inMemoryRegistry = {};
}

/**
 * Generate a hash from an object.
 *
 * @param {string} prefix — hash prefix label
 * @param {Object} obj — object to hash
 * @returns {string} — hex hash
 */
function generateHash(prefix, obj) {
  var json = JSON.stringify(obj || {});
  var hash = crypto.createHash('sha256').update(json).digest('hex').substring(0, 12);
  return prefix + '_' + hash;
}

/**
 * Check if a page is registered.
 *
 * @param {string} pageId — the page ID to check
 * @returns {boolean}
 */
function isRegistered(pageId) {
  return !!inMemoryRegistry[pageId];
}

/**
 * Get the registry entry for a page.
 *
 * @param {string} pageId
 * @returns {Object|null}
 */
function getPageEntry(pageId) {
  return inMemoryRegistry[pageId] || null;
}

/**
 * Register a new page in the registry.
 * Sets status to "draft".
 *
 * @param {string} pageId — unique page identifier
 * @param {Object} spec — the PageSpec
 * @param {Object} [ui] — the rendered UI output
 * @returns {Object} — the registry entry
 */
function registerPage(pageId, spec, ui) {
  var now = new Date().toISOString();

  inMemoryRegistry[pageId] = {
    version: '1.0.0',
    status: 'draft',
    spec_hash: generateHash('spec', spec),
    ui_hash: generateHash('ui', ui || {}),
    created_at: now,
    updated_at: now
  };

  return inMemoryRegistry[pageId];
}

/**
 * Update the status of a registered page.
 *
 * @param {string} pageId
 * @param {string} newStatus — "draft" | "testing" | "frozen"
 * @throws {Error} — if page is not registered or status is invalid
 */
function updatePageStatus(pageId, newStatus) {
  if (!isRegistered(pageId)) {
    throw new Error('[REGISTRY] Page "' + pageId + '" is not registered');
  }
  if (VALID_STATUSES.indexOf(newStatus) === -1) {
    throw new Error('[REGISTRY] Invalid status "' + newStatus + '". Allowed: ' + VALID_STATUSES.join(', '));
  }

  inMemoryRegistry[pageId].status = newStatus;
  inMemoryRegistry[pageId].updated_at = new Date().toISOString();
}

/**
 * Update the UI hash for a registered page.
 *
 * @param {string} pageId
 * @param {Object} ui — the rendered UI output
 */
function updatePageUiHash(pageId, ui) {
  if (!isRegistered(pageId)) return;

  inMemoryRegistry[pageId].ui_hash = generateHash('ui', ui || {});
  inMemoryRegistry[pageId].updated_at = new Date().toISOString();
}

/**
 * Freeze a page (set status to "frozen").
 *
 * @param {string} pageId
 * @throws {Error} — if page is not registered
 */
function freezePage(pageId) {
  updatePageStatus(pageId, 'frozen');
}

/**
 * Lock a page version — increments version and freezes.
 *
 * @param {string} pageId
 */
function lockPageVersion(pageId) {
  if (!isRegistered(pageId)) return;

  var entry = inMemoryRegistry[pageId];
  // Increment minor version
  var parts = entry.version.split('.').map(Number);
  parts[2] = (parts[2] || 0) + 1;
  entry.version = parts.join('.');

  freezePage(pageId);
}

/**
 * Check if a page is frozen.
 *
 * @param {string} pageId
 * @returns {boolean}
 */
function isFrozen(pageId) {
  var entry = inMemoryRegistry[pageId];
  return !!entry && entry.status === 'frozen';
}

/**
 * Get the full registry dump.
 *
 * @returns {Object}
 */
function dumpRegistry() {
  return JSON.parse(JSON.stringify(inMemoryRegistry));
}

module.exports = {
  initRegistry: initRegistry,
  isRegistered: isRegistered,
  getPageEntry: getPageEntry,
  registerPage: registerPage,
  updatePageStatus: updatePageStatus,
  updatePageUiHash: updatePageUiHash,
  freezePage: freezePage,
  lockPageVersion: lockPageVersion,
  isFrozen: isFrozen,
  dumpRegistry: dumpRegistry
};
