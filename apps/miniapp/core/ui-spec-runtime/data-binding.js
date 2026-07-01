/**
 * UI SPEC RUNTIME — DATA BINDING ENGINE
 *
 * Binds PageSpec data fields from user_state.
 * UI_SPEC_LAYER_V1 §6: All data MUST bind from user_state.
 * No hardcoded values allowed for core stats.
 */

/**
 * Allowed data source keys from user_state.
 * UI_SPEC_LAYER_V1 §6: Only these fields are allowed.
 */
var ALLOWED_STATE_KEYS = {
  exploration_count: true,
  relic_count: true,
  collectible_count: true,
  rights_count: true,
  region: true
};

var _stateResolver = null;

/**
 * Set a custom state resolver function.
 * The resolver receives a field key and returns its value.
 *
 * @param {Function} resolverFn — function(key) => value
 */
function setStateResolver(resolverFn) {
  _stateResolver = resolverFn;
}

/**
 * Resolve a single data binding from state.
 * Falls back to the raw key if resolver not set (dev mode).
 *
 * @param {string} key — the state field name
 * @returns {*} — resolved value
 * @throws — if key is not in ALLOWED_STATE_KEYS
 */
function resolveFromState(key) {
  // Check key is allowed
  if (!ALLOWED_STATE_KEYS[key]) {
    throw new Error(
      '[DATA_BINDING] DISALLOWED_STATE_KEY: "' + key + '". ' +
      'Allowed: ' + Object.keys(ALLOWED_STATE_KEYS).join(', ')
    );
  }

  if (_stateResolver) {
    return _stateResolver(key);
  }

  // Dev mode fallback — return key name as placeholder
  console.warn('[DATA_BINDING] No state resolver set — using placeholder for:', key);
  return 0;
}

/**
 * Bind all data spec fields from state.
 *
 * @param {Object} dataSpec — { field_name: "state_key", ... }
 * @returns {Object} — { field_name: resolved_value, ... }
 * @throws — if any binding fails
 */
function bindData(dataSpec) {
  if (!dataSpec || typeof dataSpec !== 'object') {
    throw new Error('[DATA_BINDING] dataSpec must be an object');
  }

  var result = {};
  var keys = Object.keys(dataSpec);

  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var stateKey = dataSpec[key];

    // If the value is a recognized state key, resolve it
    if (typeof stateKey === 'string' && ALLOWED_STATE_KEYS[stateKey]) {
      result[key] = resolveFromState(stateKey);
    } else if (typeof stateKey === 'function') {
      // Support inline resolver for computed values
      result[key] = stateKey();
    } else {
      // Direct value passthrough (allowed for labels, titles, etc.)
      result[key] = stateKey;
    }
  }

  return result;
}

module.exports = {
  bindData: bindData,
  resolveFromState: resolveFromState,
  setStateResolver: setStateResolver,
  ALLOWED_STATE_KEYS: ALLOWED_STATE_KEYS
};
