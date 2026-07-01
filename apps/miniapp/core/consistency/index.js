/**
 * CONSISTENCY SYSTEM — Index
 *
 * Unified export for the V1.1 design consistency system.
 *
 * Usage:
 *   var consistency = require('./core/consistency');
 *   var result = consistency.checkDesignConsistency(pageA, pageB);
 *   var alignment = consistency.checkVisualAlignment(ui);
 */

var designConsistencyEngine = require('./design-consistency-engine');
var visualAlignmentChecker = require('./visual-alignment-checker');

module.exports = {
  checkDesignConsistency: designConsistencyEngine.checkDesignConsistency,
  checkPageAgainstTokens: designConsistencyEngine.checkPageAgainstTokens,
  CONSISTENCY_RULES: designConsistencyEngine.CONSISTENCY_RULES,
  checkVisualAlignment: visualAlignmentChecker.checkVisualAlignment,
  ALIGNMENT_RULES: visualAlignmentChecker.ALIGNMENT_RULES
};
