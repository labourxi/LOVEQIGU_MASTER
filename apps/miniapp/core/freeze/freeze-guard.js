/**
 * FREEZE GUARD — SYSTEM FREEZE ENFORCEMENT
 *
 * Runtime freeze guard that blocks all modifications to the frozen system.
 *
 * SYSTEM FREEZE §6: Global Rule Enforcement
 *   FORBIDDEN: modifying PageSpec structure, adding new pages,
 *   changing asset system, bypassing orchestrator, altering layout rules
 *
 * SYSTEM FREEZE §7: System Behavior After Freeze
 *   RETURN: "REJECTED - SYSTEM IS FROZEN. REQUIRE VERSION BUMP."
 *
 * SYSTEM FREEZE §9: VERSIONED UI OPERATING SYSTEM
 */

var crypto = require('crypto');
var fs = require('fs');
var path = require('path');

var FREEZE_REJECTION_MESSAGE = 'REJECTED - SYSTEM IS FROZEN. REQUIRE VERSION BUMP.';

var freezeState = {
  initialized: false,
  checkPassed: false
};

/**
 * Load and parse a JSON file.
 *
 * @param {string} filePath — relative to miniapp root
 * @returns {Object|null}
 */
function loadJson(filePath) {
  try {
    var resolved = resolvePath(filePath);
    var content = fs.readFileSync(resolved, 'utf-8');
    return JSON.parse(content);
  } catch (e) {
    return null;
  }
}

/**
/**
 * Resolve a path that may be relative to the WORKSPACE root (project root).
 * When running from miniapp/ dir:
 *   - docs/ paths need ../../ prefix (go up to workspace root)
 *   - core/ paths are direct (within miniapp)
 *
 * @param {string} filePath
 * @returns {string}
 */
function resolvePath(filePath) {
  // If path starts with docs/, it's relative to workspace root
  if (filePath.indexOf('docs/') === 0) {
    return path.join('..', '..', filePath);
  }
  // Otherwise it's relative to miniapp root (core/, freeze/)
  return filePath;
}

/**
 * Generate SHA256 hash of a file's contents.
 *
 * @param {string} filePath
 * @returns {string}
 */
function hashFile(filePath) {
  try {
    var resolved = resolvePath(filePath);
    var content = fs.readFileSync(resolved, 'utf-8');
    return crypto.createHash('sha256').update(content).digest('hex');
  } catch (e) {
    return 'ERROR:' + e.message;
  }
}

/**
 * Generate SHA256 hash of all .js files in a directory (sorted).
 *
 * @param {string} dirPath
 * @returns {string}
 */
function hashDirectory(dirPath) {
  try {
    var combined = '';
    var resolvedDir = resolvePath(dirPath);
    var files = fs.readdirSync(resolvedDir).sort();
    files.forEach(function (f) {
      var fullPath = path.join(resolvedDir, f);
      if (fs.statSync(fullPath).isFile() && f.endsWith('.js')) {
        combined += hashFile(path.join(dirPath, f));
      }
    });
    return crypto.createHash('sha256').update(combined).digest('hex');
  } catch (e) {
    return 'ERROR:' + e.message;
  }
}

/**
 * Initialize and run the freeze guard.
 *
 * Checks integrity of ALL frozen modules against contract_hash_registry.json.
 *
 * @returns {Object} — { passed: boolean, drift: string[] }
 */
function initializeFreezeGuard() {
  if (freezeState.initialized) {
    return { passed: freezeState.checkPassed, drift: [] };
  }

  freezeState.initialized = true;

  // Load the contract hash registry
  var registry = loadJson('core/freeze/contract_hash_registry.json');
  if (!registry) {
    freezeState.checkPassed = false;
    return { passed: false, drift: ['Cannot load contract_hash_registry.json'] };
  }

  var contracts = registry.contracts;
  if (!contracts) {
    freezeState.checkPassed = false;
    return { passed: false, drift: ['Invalid contract_hash_registry.json — missing "contracts"'] };
  }

  var drift = [];
  var keys = Object.keys(contracts);

  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var contract = contracts[key];
    var expectedHash = contract.hash;
    var actualHash = '';

    if (contract.type === 'document' && contract.path) {
      actualHash = hashFile(contract.path);
    } else if (contract.type === 'module_directory' && contract.path) {
      actualHash = hashDirectory(contract.path);
    } else if (contract.type === 'module_embedded' && contract.path) {
      actualHash = hashFile(contract.path);
    } else {
      drift.push(key + ': Unknown contract type "' + contract.type + '"');
      continue;
    }

    if (actualHash !== expectedHash) {
      drift.push(key + ': Hash MISMATCH (expected ' + expectedHash + ', got ' + actualHash + ')');
    }
  }

  freezeState.checkPassed = drift.length === 0;

  if (!freezeState.checkPassed) {
    console.error('[FREEZE_GUARD] SYSTEM DRIFT DETECTED:');
    drift.forEach(function (d) { console.error('  ' + d); });
  } else {
    console.log('[FREEZE_GUARD] All ' + keys.length + ' frozen modules verified — INTEGRITY OK');
  }

  return { passed: freezeState.checkPassed, drift: drift };
}

/**
 * Check if the freeze guard has passed integrity verification.
 *
 * @returns {boolean}
 */
function isSystemIntegrityOk() {
  if (!freezeState.initialized) {
    initializeFreezeGuard();
  }
  return freezeState.checkPassed;
}

/**
 * Reject a change request with the standard freeze rejection message.
 *
 * SYSTEM FREEZE §7:
 *   IF any change request occurs:
 *   RETURN: "REJECTED - SYSTEM IS FROZEN. REQUIRE VERSION BUMP."
 *
 * @throws {Error} — always
 */
function rejectChange() {
  throw new Error(FREEZE_REJECTION_MESSAGE);
}

/**
 * Assert that the system is frozen and no modifications are allowed.
 *
 * @param {string} [operation] — description of the attempted operation
 */
function assertFrozen(operation) {
  if (!isSystemIntegrityOk()) {
    throw new Error('[FREEZE_GUARD] SYSTEM DRIFT DETECTED — cannot verify freeze integrity');
  }

  // Return the rejection — the caller can throw or handle as needed
  return {
    allowed: false,
    message: FREEZE_REJECTION_MESSAGE,
    operation: operation || 'unspecified'
  };
}

/**
 * Verify that a page exists in the frozen pages manifest.
 *
 * @param {string} pageId
 * @returns {boolean}
 */
function isPageFrozen(pageId) {
  var manifest = loadJson('core/freeze/frozen_pages_manifest.json');
  if (!manifest || !manifest.pages) return false;
  var page = manifest.pages[pageId];
  return !!page && page.status === 'FROZEN';
}

/**
 * Get the current system version.
 *
 * @returns {Object|null}
 */
function getSystemVersion() {
  return loadJson('core/freeze/version_lock.json');
}

/**
 * Get the freeze rejection message.
 *
 * @returns {string}
 */
function getRejectionMessage() {
  return FREEZE_REJECTION_MESSAGE;
}

module.exports = {
  initializeFreezeGuard: initializeFreezeGuard,
  isSystemIntegrityOk: isSystemIntegrityOk,
  rejectChange: rejectChange,
  assertFrozen: assertFrozen,
  isPageFrozen: isPageFrozen,
  getSystemVersion: getSystemVersion,
  getRejectionMessage: getRejectionMessage
};
