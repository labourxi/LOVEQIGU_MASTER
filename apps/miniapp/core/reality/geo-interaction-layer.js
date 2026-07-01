/**
 * GEO-INTERACTION LAYER — V6
 *
 * Detects user position relative to physical world nodes and manages
 * proximity-based triggers.
 *
 * V6 §2: detectUserPosition(userGPS, worldNodes) → activeNodes
 *
 * V6 §4: AR Trigger System Enhancement:
 *   - GPS proximity trigger
 *   - Camera recognition trigger
 *   - QR scan trigger
 *   - Time-based trigger
 *
 * V6 §5: User Real-World Loop:
 *   Walk → Detect → Trigger → Experience → Record → Evolve World
 */

/**
 * Haversine distance calculation between two GPS coordinates.
 *
 * @param {number} lat1
 * @param {number} lng1
 * @param {number} lat2
 * @param {number} lng2
 * @returns {number} — distance in meters
 */
function haversineDistance(lat1, lng1, lat2, lng2) {
  var R = 6371000; // Earth's radius in meters
  var toRad = function (deg) { return deg * Math.PI / 180; };

  var dLat = toRad(lat2 - lat1);
  var dLng = toRad(lng2 - lng1);
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
          Math.sin(dLng / 2) * Math.sin(dLng / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Detect which physical nodes are within range of a user's GPS position.
 *
 * V6 §2: For each physical node, if distance < node.radius, node is active.
 *
 * @param {Object} userGPS — { lat, lng }
 * @param {Object[]} physicalNodes — from reality-mapping-engine
 * @returns {Object[]} — active nodes within range, each with distance
 */
function detectUserPosition(userGPS, physicalNodes) {
  if (!userGPS || userGPS.lat === undefined || userGPS.lng === undefined) {
    throw new Error('[GEO_INTERACTION] User GPS position is required (lat, lng)');
  }
  if (!physicalNodes || !Array.isArray(physicalNodes)) {
    throw new Error('[GEO_INTERACTION] Physical nodes array is required');
  }

  var activeNodes = [];

  physicalNodes.forEach(function (pn) {
    if (!pn.geo_location || pn.geo_location.lat === undefined) return;

    var distance = haversineDistance(
      userGPS.lat, userGPS.lng,
      pn.geo_location.lat, pn.geo_location.lng
    );

    var radius = pn.interaction_radius || 30;

    if (distance <= radius) {
      activeNodes.push({
        node: pn,
        distance_meters: Math.round(distance * 100) / 100,
        within_radius: true,
        trigger_type: pn.trigger_type,
        linked_world_node: pn.linked_world_node
      });
    }
  });

  // Sort by distance (nearest first)
  activeNodes.sort(function (a, b) {
    return a.distance_meters - b.distance_meters;
  });

  return activeNodes;
}

/**
 * Supported trigger types for AR-based interaction.
 *
 * V6 §4:
 *   - GPS proximity trigger
 *   - Camera recognition trigger
 *   - QR scan trigger
 *   - Time-based trigger
 */
var TRIGGER_TYPES = {
  GPS_PROXIMITY: 'GPS_PROXIMITY',
  CAMERA_RECOGNITION: 'CAMERA_RECOGNITION',
  QR_SCAN: 'QR_SCAN',
  TIME_BASED: 'TIME_BASED'
};

/**
 * Trigger definitions with requirements and effects.
 */
var TRIGGER_DEFINITIONS = {
  GPS_PROXIMITY: {
    requirement: 'distance < interaction_radius',
    effects: ['unlock_node', 'notify_user', 'activate_ar']
  },
  CAMERA_RECOGNITION: {
    requirement: 'camera enabled + AR capability',
    effects: ['unlock_relic', 'activate_echo', 'show_ar_overlay']
  },
  QR_SCAN: {
    requirement: 'QR code present at location + scan',
    effects: ['unlock_relic', 'unlock_echo', 'update_world_state']
  },
  TIME_BASED: {
    requirement: 'time_of_day matches node schedule + within radius',
    effects: ['activate_special_event', 'unlock_time_gated_content', 'world_state_evolution']
  }
};

/**
 * Process a trigger event and return the effects.
 *
 * V6 §4: When triggered → unlock relic / activate echo / update world state.
 *
 * @param {string} triggerType — one of TRIGGER_TYPES
 * @param {Object} physicalNode — the physical node being triggered
 * @param {Object} userContext — { userGPS, isCameraEnabled, hasAR, timestamp }
 * @returns {Object} — trigger result
 */
function processTrigger(triggerType, physicalNode, userContext) {
  if (!triggerType || !TRIGGER_DEFINITIONS[triggerType]) {
    return { success: false, error: 'Unknown trigger type: ' + triggerType };
  }
  if (!physicalNode) {
    return { success: false, error: 'Physical node is required' };
  }

  var triggerDef = TRIGGER_DEFINITIONS[triggerType];
  var effects = [];

  // Check requirements
  switch (triggerType) {
    case TRIGGER_TYPES.GPS_PROXIMITY:
      if (!userContext || !userContext.userGPS) {
        return { success: false, error: 'GPS position required for proximity trigger' };
      }
      var distance = haversineDistance(
        userContext.userGPS.lat, userContext.userGPS.lng,
        physicalNode.geo_location.lat, physicalNode.geo_location.lng
      );
      if (distance > (physicalNode.interaction_radius || 30)) {
        return { success: false, error: 'Too far from node (' + Math.round(distance) + 'm)' };
      }
      effects = triggerDef.effects;
      break;

    case TRIGGER_TYPES.CAMERA_RECOGNITION:
      if (!userContext || !userContext.isCameraEnabled) {
        return { success: false, error: 'Camera not enabled' };
      }
      effects = triggerDef.effects;
      break;

    case TRIGGER_TYPES.QR_SCAN:
      if (!userContext || !userContext.qrScanned) {
        return { success: false, error: 'QR code not scanned' };
      }
      effects = triggerDef.effects;
      break;

    case TRIGGER_TYPES.TIME_BASED:
      if (!userContext || !userContext.timestamp) {
        return { success: false, error: 'Timestamp required for time-based trigger' };
      }
      effects = triggerDef.effects;
      break;

    default:
      return { success: false, error: 'Unhandled trigger type' };
  }

  return {
    success: true,
    trigger_type: triggerType,
    physical_node_id: physicalNode.id,
    linked_world_node: physicalNode.linked_world_node,
    effects: effects,
    timestamp: userContext ? (userContext.timestamp || new Date().toISOString()) : new Date().toISOString()
  };
}

/**
 * Simulate the User Real-World Loop.
 *
 * V6 §5: Walk → Detect → Trigger → Experience → Record → Evolve World
 *
 * @param {Object} userGPS — { lat, lng }
 * @param {Object[]} physicalNodes — all physical world nodes
 * @param {Object} userContext — { isCameraEnabled, hasAR, timestamp }
 * @returns {Object} — { walked: number, detected: Object[], triggered: Object[], evolved: boolean }
 */
function simulateUserLoop(userGPS, physicalNodes, userContext) {
  var log = [];

  // Step 1: Walk (simulated — user is at position)
  log.push({ step: 'WALK', position: userGPS, timestamp: new Date().toISOString() });

  // Step 2: Detect
  var detectedNodes = detectUserPosition(userGPS, physicalNodes);
  log.push({ step: 'DETECT', count: detectedNodes.length, nodes: detectedNodes.map(function (n) { return n.linked_world_node; }) });

  // Step 3: Trigger
  var triggered = [];
  if (detectedNodes.length > 0) {
    detectedNodes.forEach(function (dn) {
      var triggerResult = processTrigger(TRIGGER_TYPES.GPS_PROXIMITY, dn.node, userContext);
      if (triggerResult.success) {
        triggered.push(triggerResult);
      }
    });
  }
  log.push({ step: 'TRIGGER', count: triggered.length });

  // Step 4: Experience (simulated)
  log.push({ step: 'EXPERIENCE', content: triggered.length > 0 ? 'AR overlay activated' : 'Exploring environment' });

  // Step 5: Record (simulated)
  log.push({ step: 'RECORD', events: triggered.length + ' events recorded' });

  // Step 6: Evolve World
  var evolved = triggered.length > 0;
  log.push({ step: 'EVOLVE', world_updated: evolved });

  return {
    walked: true,
    detected: detectedNodes,
    triggered: triggered,
    loop_log: log,
    evolved: evolved
  };
}

module.exports = {
  detectUserPosition: detectUserPosition,
  processTrigger: processTrigger,
  simulateUserLoop: simulateUserLoop,
  haversineDistance: haversineDistance,
  TRIGGER_TYPES: TRIGGER_TYPES,
  TRIGGER_DEFINITIONS: TRIGGER_DEFINITIONS
};
