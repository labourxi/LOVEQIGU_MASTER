/**
 * VISUAL DIFF CHECKER — LAYOUT CHECKER
 *
 * Compares PageSpec layout definition against rendered UI output.
 *
 * UI_SPEC_LAYER_V1 §4: Every page MUST define layers.
 * VISUAL_DIFF_CHECKER §4: Layout comparison with MATCH/PARTIAL/MISMATCH.
 */

/**
 * Check layout structure type match.
 *
 * @param {string} specStructure — expected structure from PageSpec
 * @param {string} uiStructure — actual structure from rendered UI
 * @returns {string} — 'MATCH' | 'MISMATCH'
 */
function checkStructureType(specStructure, uiStructure) {
  if (!specStructure) {
    return 'MISMATCH';
  }
  if (!uiStructure) {
    return 'MISMATCH';
  }
  return specStructure === uiStructure ? 'MATCH' : 'MISMATCH';
}

/**
 * Check that all required layers from spec exist in rendered UI.
 *
 * @param {string[]} specLayers — required layer types from PageSpec
 * @param {string[]} uiLayers — actual layer types from rendered UI
 * @returns {Object} — { match: string, missing: string[], extra: string[] }
 */
function checkLayers(specLayers, uiLayers) {
  var specSet = {};
  var uiSet = {};
  var missing = [];
  var extra = [];

  if (!specLayers || !Array.isArray(specLayers)) {
    return { match: 'MISMATCH', missing: specLayers || [], extra: uiLayers || [] };
  }
  if (!uiLayers || !Array.isArray(uiLayers)) {
    return { match: 'MISMATCH', missing: specLayers, extra: [] };
  }

  for (var i = 0; i < specLayers.length; i++) {
    specSet[specLayers[i]] = true;
  }
  for (var j = 0; j < uiLayers.length; j++) {
    uiSet[uiLayers[j]] = true;
  }

  // Find missing layers (in spec but not in UI)
  for (var s = 0; s < specLayers.length; s++) {
    if (!uiSet[specLayers[s]]) {
      missing.push(specLayers[s]);
    }
  }

  // Find extra layers (in UI but not in spec)
  for (var u = 0; u < uiLayers.length; u++) {
    if (!specSet[uiLayers[u]]) {
      extra.push(uiLayers[u]);
    }
  }

  var match;
  if (missing.length === 0 && extra.length === 0) {
    match = 'MATCH';
  } else if (missing.length > 0) {
    match = 'MISMATCH';
  } else {
    match = 'PARTIAL';
  }

  return { match: match, missing: missing, extra: extra };
}

/**
 * Check layer order: spec layers should appear in same order as UI layers.
 *
 * @param {string[]} specLayers
 * @param {string[]} uiLayers
 * @returns {boolean} — true if order matches
 */
function checkLayerOrder(specLayers, uiLayers) {
  if (!specLayers || !uiLayers) return false;
  var uiIndex = 0;
  for (var i = 0; i < specLayers.length; i++) {
    // Find this spec layer in the UI layers (in order)
    var found = false;
    while (uiIndex < uiLayers.length) {
      if (uiLayers[uiIndex] === specLayers[i]) {
        found = true;
        uiIndex++;
        break;
      }
      uiIndex++;
    }
    if (!found) return false;
  }
  return true;
}

/**
 * Full layout diff check.
 *
 * @param {Object} specLayout — layout from PageSpec { structure, layers }
 * @param {Object} uiLayout — layout from rendered UI { structure, layers }
 * @returns {Object} — diff result with issues
 */
function checkLayout(specLayout, uiLayout) {
  var issues = [];

  // 1. Check structure type
  var specStructure = specLayout ? specLayout.structure : null;
  var uiStructure = uiLayout ? uiLayout.structure : null;
  var structureMatch = checkStructureType(specStructure, uiStructure);

  if (structureMatch === 'MISMATCH') {
    issues.push({
      type: 'layout',
      severity: 'high',
      description: 'Layout structure mismatch: spec="' + specStructure + '", ui="' + uiStructure + '"',
      fix_suggestion: 'Update rendered UI to use "' + specStructure + '" layout structure'
    });
  }

  // 2. Check layers
  var specLayers = specLayout ? specLayout.layers : [];
  var uiLayers = uiLayout ? uiLayout.layers : [];
  var layerResult = checkLayers(specLayers, uiLayers);

  for (var m = 0; m < layerResult.missing.length; m++) {
    issues.push({
      type: 'layout',
      severity: 'high',
      description: 'Missing required layer: "' + layerResult.missing[m] + '"',
      fix_suggestion: 'Add "' + layerResult.missing[m] + '" layer to the rendered UI'
    });
  }

  for (var e = 0; e < layerResult.extra.length; e++) {
    issues.push({
      type: 'layout',
      severity: 'low',
      description: 'Extra layer found in UI: "' + layerResult.extra[e] + '" (not in spec)',
      fix_suggestion: 'Remove "' + layerResult.extra[e] + '" layer or update PageSpec'
    });
  }

  // 3. Check layer order
  var orderMatch = checkLayerOrder(specLayers, uiLayers);
  if (!orderMatch && layerResult.missing.length === 0) {
    issues.push({
      type: 'layout',
      severity: 'medium',
      description: 'Layer order mismatch',
      fix_suggestion: 'Reorder UI layers to match spec order: ' + specLayers.join(' → ')
    });
  }

  return {
    structureMatch: structureMatch,
    layerResult: layerResult,
    orderMatch: orderMatch,
    issues: issues,
    status: issues.length === 0 ? 'MATCH' : (issues.filter(function (i) { return i.severity === 'high' || i.severity === 'critical'; }).length > 0 ? 'MISMATCH' : 'PARTIAL')
  };
}

module.exports = {
  checkLayout: checkLayout,
  checkStructureType: checkStructureType,
  checkLayers: checkLayers,
  checkLayerOrder: checkLayerOrder
};
