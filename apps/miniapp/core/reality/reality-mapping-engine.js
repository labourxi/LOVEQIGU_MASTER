/**
 * REALITY MAPPING ENGINE — V6
 *
 * Maps digital world nodes to physical real-world locations.
 *
 * V6 §1: mapPhysicalWorld(worldNodes) → physicalNodes
 *
 * Each world node gets:
 *   - geo_location (latitude, longitude)
 *   - real_world_anchor flag
 *   - interaction_radius (5-50 meters)
 *   - trigger_type (AR | NFC | GPS | QR)
 *   - linked_world_node reference
 *
 * V6 §6: World ↔ Reality Binding Rule:
 *   Each V5 world node MUST have physical mapping OR AR trigger OR geo anchor.
 *   Otherwise node is INVALID.
 */

/**
 * Simulated physical locations mapped to known LOVEQIGU geography (Aigugu).
 * Each entry defines a real-world point for a world region theme.
 */
var PHYSICAL_LOCATIONS = {
  birth_and_origin:       { lat: 31.2304, lng: 121.4737, name: 'Origin Point' },
  guardianship:           { lat: 31.2350, lng: 121.4780, name: 'Guardian Station' },
  purification:           { lat: 31.2400, lng: 121.4700, name: 'Crystal Confluence' },
  transformation:         { lat: 31.2280, lng: 121.4800, name: 'Ember Gate' },
  hidden_knowledge:       { lat: 31.2450, lng: 121.4650, name: 'Moonstone Nook' },
  cosmic_wisdom:          { lat: 31.2500, lng: 121.4850, name: 'Observatory Point' },
  completion:             { lat: 31.2200, lng: 121.4900, name: 'Eternal Garden' },
  awakening:              { lat: 31.2600, lng: 121.4600, name: 'First Light' },
  journey:                { lat: 31.2700, lng: 121.4550, name: 'Nebula Passage' },
  discovery:              { lat: 31.2800, lng: 121.4500, name: 'Starfall Field' },
  connection:             { lat: 31.2550, lng: 121.4750, name: 'Orbit Ring' },
  unity:                  { lat: 31.2150, lng: 121.4950, name: 'Cosmic Core' },
  origin:                 { lat: 31.2380, lng: 121.4680, name: 'First Memory' },
  resonance:              { lat: 31.2420, lng: 121.4630, name: 'Echo Hall' },
  introspection:          { lat: 31.2480, lng: 121.4580, name: 'Reflection Pool' },
  preservation:           { lat: 31.2520, lng: 121.4530, name: 'Forgotten Archive' },
  memory_of_time:         { lat: 31.2350, lng: 121.4650, name: 'Past Fragment' },
  current_moment:         { lat: 31.2300, lng: 121.4600, name: 'Present Flow' },
  possibility:            { lat: 31.2250, lng: 121.4550, name: 'Future Echo' },
  convergence:            { lat: 31.2200, lng: 121.4500, name: 'Time Knot' },
  timelessness:           { lat: 31.2150, lng: 121.4450, name: 'Eternal Now' }
};

/**
 * Simulated default Aigugu center point.
 */
var AIGUGU_CENTER = { lat: 31.2350, lng: 121.4737 };

/**
 * Get a physical location for a given theme.
 * Falls back to a deterministic offset from Aigugu center.
 *
 * @param {string} theme — region/narrative theme
 * @param {number} nodeIndex — index for distribution
 * @returns {Object} — { lat, lng, name }
 */
function getLocationForTheme(theme, nodeIndex) {
  if (PHYSICAL_LOCATIONS[theme]) {
    return PHYSICAL_LOCATIONS[theme];
  }
  // Generate deterministic location from center + offset
  var offset = (nodeIndex || 0) * 0.002;
  return {
    lat: AIGUGU_CENTER.lat + offset,
    lng: AIGUGU_CENTER.lng + offset * 0.5,
    name: theme + '_point_' + (nodeIndex || 0)
  };
}

/**
 * Select trigger type based on node type and world capabilities.
 *
 * @param {string} nodeType — exploration | relic | echo | AR_event
 * @param {Object} worldRules — from world brain
 * @returns {string[]} — trigger types
 */
function selectTriggerTypes(nodeType, worldRules) {
  var triggers = [];

  switch (nodeType) {
    case 'AR_event':
      if (worldRules.has_ar) {
        triggers.push('GPS', 'Camera');
      }
      break;
    case 'relic':
      triggers.push('GPS');
      if (worldRules.has_ar) {
        triggers.push('NFC');
      }
      triggers.push('QR');
      break;
    case 'echo':
      triggers.push('GPS');
      triggers.push('QR');
      break;
    case 'exploration':
    default:
      triggers.push('GPS');
      break;
  }

  return triggers;
}

/**
 * Calculate interaction radius based on node type.
 *
 * @param {string} nodeType
 * @returns {number} — radius in meters
 */
function getInteractionRadius(nodeType) {
  switch (nodeType) {
    case 'AR_event': return 15;
    case 'relic':    return 10;
    case 'echo':     return 20;
    case 'exploration': return 50;
    default:         return 30;
  }
}

/**
 * Map digital world nodes to physical real-world locations.
 *
 * V6 §1: Each world node gets geo_location, real_world_anchor,
 *        interaction_radius, trigger_type, linked_world_node.
 *
 * V6 §3: Physical Node Network — nodes exist in REAL SPACE.
 *
 * @param {Object[]} worldNodes — array of V5 world nodes
 *        Each node: { id, location, type, state, connections, reward }
 * @param {Object} worldBrain — from V5 world brain engine
 * @returns {Object[]} — array of physical nodes
 */
function mapPhysicalWorld(worldNodes, worldBrain) {
  if (!worldNodes || !Array.isArray(worldNodes)) {
    throw new Error('[REALITY_MAP] World nodes array is required');
  }

  var rules = worldBrain ? worldBrain.world_rules : { has_ar: false, has_relics: true, has_echoes: true };

  var physicalNodes = worldNodes.map(function (node, index) {
    var theme = 'unknown';
    // Try to extract theme from node's reward or connections
    if (node.reward && node.reward.name) {
      theme = node.reward.name.split('_')[0];
    }

    var location = getLocationForTheme(theme, index);
    var triggerTypes = selectTriggerTypes(node.type, rules);
    var radius = getInteractionRadius(node.type);

    var physicalNode = {
      id: 'phys_' + node.id,
      type: node.type,
      geo_location: {
        lat: location.lat,
        lng: location.lng,
        name: location.name
      },
      real_world_anchor: true,
      interaction_radius: radius,
      trigger_type: triggerTypes,
      linked_world_node: node.id,

      // V6 §3: Physical Node Network
      physical_trigger: {
        gps: triggerTypes.indexOf('GPS') !== -1,
        qr: triggerTypes.indexOf('QR') !== -1,
        camera: triggerTypes.indexOf('Camera') !== -1,
        nfc: triggerTypes.indexOf('NFC') !== -1
      },

      // V6 §6: Validation
      _validation: {
        has_physical_mapping: true,
        has_ar_trigger: triggerTypes.indexOf('Camera') !== -1 || triggerTypes.indexOf('GPS') !== -1,
        has_geo_anchor: true,
        is_valid: true
      }
    };

    return physicalNode;
  });

  return physicalNodes;
}

/**
 * Validate that all world nodes have real-world bindings.
 *
 * V6 §6: Each V5 world node MUST have physical mapping OR AR trigger OR geo anchor.
 *
 * @param {Object[]} physicalNodes — output of mapPhysicalWorld
 * @returns {Object} — { valid: number, invalid: number, nodes: Object[] }
 */
function validateRealityBinding(physicalNodes) {
  var valid = 0;
  var invalid = 0;

  var validated = physicalNodes.map(function (pn) {
    var hasMapping = pn.real_world_anchor === true;
    var hasArTrigger = pn.physical_trigger ? (pn.physical_trigger.camera || pn.physical_trigger.gps) : false;
    var hasGeoAnchor = pn.geo_location && pn.geo_location.lat !== undefined;

    var isValid = hasMapping || hasArTrigger || hasGeoAnchor;

    if (isValid) valid++;
    else invalid++;

    return {
      id: pn.id,
      linked_world_node: pn.linked_world_node,
      geo_location: pn.geo_location,
      is_valid: isValid,
      reasons: {
        has_physical_mapping: hasMapping,
        has_ar_trigger: hasArTrigger,
        has_geo_anchor: hasGeoAnchor
      }
    };
  });

  return { valid: valid, invalid: invalid, nodes: validated };
}

module.exports = {
  mapPhysicalWorld: mapPhysicalWorld,
  validateRealityBinding: validateRealityBinding,
  getLocationForTheme: getLocationForTheme,
  selectTriggerTypes: selectTriggerTypes,
  getInteractionRadius: getInteractionRadius,
  PHYSICAL_LOCATIONS: PHYSICAL_LOCATIONS,
  AIGUGU_CENTER: AIGUGU_CENTER
};
