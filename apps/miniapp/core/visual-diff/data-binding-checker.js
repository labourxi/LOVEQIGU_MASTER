/**
 * VISUAL DIFF CHECKER — DATA BINDING CHECKER
 *
 * Validates that rendered UI data originates from user_state.
 *
 * UI_SPEC_LAYER_V1 §6: All data MUST bind from user_state.
 * VISUAL_DIFF_CHECKER §6: INVALID_BINDING / HARDCODE_DETECTED errors.
 */

var ALLOWED_STATE_KEYS = {
  exploration_count: true,
  relic_count: true,
  collectible_count: true,
  rights_count: true,
  region: true
};

/**
 * Check if a data binding value is hardcoded (not from user_state).
 * A value is "hardcoded" if it's a known label string, not if it's a number
 * (numbers correctly come from state resolution).
 *
 * @param {*} value — the bound data value
 * @returns {boolean} — true if appears hardcoded
 */
function isLikelyHardcoded(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === 'number') return false; // numbers are valid state-resolved values
  if (typeof value === 'string') {
    // Known label text that should come from state
    var labels = ['探索点', '信物', '藏品', '权益', '已探索', '未解锁', '可探索'];
    for (var i = 0; i < labels.length; i++) {
      if (value.indexOf(labels[i]) !== -1) return true;
    }
  }
  return false;
}

/**
 * Check a single data binding.
 *
 * @param {string} fieldName — the field name in the data spec
 * @param {*} specValue — the value from PageSpec (expected state key or literal)
 * @param {*} uiValue — the value from rendered UI
 * @returns {Object|null} — issue or null if valid
 */
function checkSingleBinding(fieldName, specValue, uiValue) {
  // If spec says this comes from user_state
  if (typeof specValue === 'string' && ALLOWED_STATE_KEYS[specValue]) {
    // This is a core stat — must be resolved, not hardcoded
    if (isLikelyHardcoded(uiValue)) {
      return {
        type: 'data',
        severity: 'high',
        description: 'HARDCODE_DETECTED: field "' + fieldName + '" bound from "' + specValue + '" but UI shows hardcoded value "' + uiValue + '"',
        fix_suggestion: 'Bind "' + fieldName + '" from user_state.' + specValue + ' instead of using a literal value'
      };
    }
    return null;
  }

  // If spec has a non-state literal value, UI should match
  if (typeof specValue === 'string' || typeof specValue === 'number') {
    if (uiValue !== undefined && uiValue !== specValue) {
      return {
        type: 'data',
        severity: 'medium',
        description: 'Value mismatch for field "' + fieldName + '": spec="' + specValue + '", ui="' + uiValue + '"',
        fix_suggestion: 'Update UI to show "' + specValue + '" or update PageSpec to match'
      };
    }
  }

  return null;
}

/**
 * Full data binding diff check.
 *
 * @param {Object} specData — data binding spec from PageSpec
 * @param {Object} uiData — resolved data from rendered UI
 * @returns {Object} — diff result with issues
 */
function checkDataBindings(specData, uiData) {
  var issues = [];

  if (!specData || typeof specData !== 'object') {
    issues.push({
      type: 'data',
      severity: 'critical',
      description: 'PageSpec has no data bindings defined',
      fix_suggestion: 'UI_SPEC_LAYER_V1 §6: All data MUST bind from user_state'
    });
    return { status: 'FAIL', issues: issues, bindingCount: 0 };
  }

  if (!uiData || typeof uiData !== 'object') {
    issues.push({
      type: 'data',
      severity: 'critical',
      description: 'Rendered UI has no data',
      fix_suggestion: 'Ensure renderer produces data bindings'
    });
    return { status: 'FAIL', issues: issues, bindingCount: 0 };
  }

  var checkedCount = 0;
  var specKeys = Object.keys(specData);

  for (var i = 0; i < specKeys.length; i++) {
    var key = specKeys[i];
    var specValue = specData[key];
    var uiValue = uiData[key];

    var issue = checkSingleBinding(key, specValue, uiValue);
    if (issue) {
      issues.push(issue);
    }
    checkedCount++;
  }

  // Check for extra keys in UI data not in spec
  var uiKeys = Object.keys(uiData);
  for (var j = 0; j < uiKeys.length; j++) {
    if (specKeys.indexOf(uiKeys[j]) === -1) {
      issues.push({
        type: 'data',
        severity: 'low',
        description: 'Extra data field in UI: "' + uiKeys[j] + '" (not in spec)',
        fix_suggestion: 'Add "' + uiKeys[j] + '" to PageSpec data bindings or remove from UI'
      });
    }
  }

  return {
    status: issues.filter(function (i) { return i.severity === 'critical' || i.severity === 'high'; }).length > 0
      ? 'FAIL'
      : (issues.length > 0 ? 'WARN' : 'PASS'),
    issues: issues,
    bindingCount: checkedCount
  };
}

module.exports = {
  checkDataBindings: checkDataBindings,
  checkSingleBinding: checkSingleBinding,
  isLikelyHardcoded: isLikelyHardcoded,
  ALLOWED_STATE_KEYS: ALLOWED_STATE_KEYS
};
