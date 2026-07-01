/**
 * FREEZE SYSTEM — Index
 *
 * Unified export for the system freeze subsystem.
 *
 * Usage:
 *   var freeze = require('./core/freeze');
 *   freeze.initializeFreezeGuard();
 *   freeze.assertFrozen('modify_page_structure');
 */

var freezeGuard = require('./freeze-guard');

module.exports = {
  initializeFreezeGuard: freezeGuard.initializeFreezeGuard,
  isSystemIntegrityOk: freezeGuard.isSystemIntegrityOk,
  rejectChange: freezeGuard.rejectChange,
  assertFrozen: freezeGuard.assertFrozen,
  isPageFrozen: freezeGuard.isPageFrozen,
  getSystemVersion: freezeGuard.getSystemVersion,
  getRejectionMessage: freezeGuard.getRejectionMessage
};
