/**
 * WORLD EVENT TRACKER — V5.7 Relic Drop Engine
 *
 * Tracks world events that may trigger relic drops.
 * Events come from three sources:
 *   1. Node completion (exploration point visited + completed)
 *   2. Path progress (chain of nodes completed)
 *   3. World events (festival / seasonal / special)
 *
 * This is the INPUT layer of the Drop Engine.
 * It does NOT generate relics — it only tracks events.
 */

// ─── Event type constants ───
const EVENT_TYPE = Object.freeze({
  NODE_COMPLETE: 'node_complete',
  PATH_PROGRESS: 'path_progress',
  WORLD_EVENT: 'world_event'
});

// ─── Internal event log ───
let eventLog = [];
let completedNodeIds = [];
let activeWorldEvents = [];

const WORLD_EVENT_SCHEDULE = Object.freeze([
  { id: 'festival_mid_autumn',  type: 'festival',   name: '中秋游园',    trigger_nodes: 0,  cooldown_days: 0 },
  { id: 'season_autumn',        type: 'seasonal',   name: '秋日企谷',    trigger_nodes: 0,  cooldown_days: 0 },
  { id: 'event_explorer_bonus', type: 'special',    name: '探索者加成',  trigger_nodes: 5,  cooldown_days: 1 }
]);

// ─── Max log size ───
const MAX_LOG_SIZE = 200;

/**
 * Initialize the event tracker.
 * @returns {{ ok: boolean, completedCount: number, activeEvents: number }}
 */
function initTracker() {
  eventLog = [];
  completedNodeIds = [];
  activeWorldEvents = [];
  return {
    ok: true,
    completedCount: 0,
    activeEvents: 0
  };
}

/**
 * Record a node completion event.
 *
 * @param {string} nodeId — the completed scenic point id
 * @param {object} [meta] — optional metadata (userId, timestamp, result)
 * @returns {object} { ok, triggered, event }
 */
function recordNodeComplete(nodeId, meta) {
  if (!nodeId) {
    return { ok: false, triggered: false, event: null, error: 'missing_node_id' };
  }

  // Deduplicate
  if (completedNodeIds.indexOf(nodeId) >= 0) {
    return { ok: true, triggered: false, event: null, note: 'already_completed' };
  }

  completedNodeIds.push(nodeId);

  var event = {
    type: EVENT_TYPE.NODE_COMPLETE,
    nodeId: nodeId,
    timestamp: Date.now(),
    completedCount: completedNodeIds.length,
    meta: meta || {}
  };

  appendLog(event);
  return { ok: true, triggered: true, event: event };
}

/**
 * Record a path progress event — triggered when completed nodes
 * reach certain milestones.
 *
 * @param {number} [completedCount] — override count (auto if not provided)
 * @returns {object} { ok, triggered, event, milestones }
 */
function recordPathProgress(completedCount) {
  var count = (typeof completedCount === 'number') ? completedCount : completedNodeIds.length;

  // Check milestones: 3, 5, 7 completed nodes
  var milestones = [];
  if (count >= 3) milestones.push('chain_3');
  if (count >= 5) milestones.push('chain_5');
  if (count >= 7) milestones.push('chain_7');

  if (milestones.length === 0) {
    return { ok: true, triggered: false, event: null, milestones: [] };
  }

  var event = {
    type: EVENT_TYPE.PATH_PROGRESS,
    completedCount: count,
    milestones: milestones,
    timestamp: Date.now()
  };

  appendLog(event);
  return { ok: true, triggered: true, event: event, milestones: milestones };
}

/**
 * Record a world event.
 *
 * @param {string} eventType — 'festival' | 'seasonal' | 'special'
 * @param {string} eventId — unique event identifier
 * @param {object} [meta] — optional metadata
 * @returns {object} { ok, triggered, event }
 */
function recordWorldEvent(eventType, eventId, meta) {
  if (!eventType || !eventId) {
    return { ok: false, triggered: false, event: null, error: 'missing_event_type_or_id' };
  }

  // Check if this event is already active
  var existing = activeWorldEvents.filter(function (e) { return e.eventId === eventId; });
  if (existing.length > 0) {
    return { ok: true, triggered: false, event: null, note: 'event_already_active' };
  }

  var event = {
    type: EVENT_TYPE.WORLD_EVENT,
    eventType: eventType,
    eventId: eventId,
    timestamp: Date.now(),
    meta: meta || {}
  };

  activeWorldEvents.push({ eventId: eventId, eventType: eventType, activatedAt: Date.now() });
  appendLog(event);
  return { ok: true, triggered: true, event: event };
}

/**
 * Check if a completed node should trigger a path-progress event.
 * Called automatically after each recordNodeComplete.
 *
 * @returns {object} { triggered, milestones }
 */
function checkPathProgress() {
  return recordPathProgress();
}

/**
 * Get the list of completed node IDs.
 * @returns {string[]}
 */
function getCompletedNodes() {
  return completedNodeIds.slice();
}

/**
 * Get the count of completed nodes.
 * @returns {number}
 */
function getCompletedCount() {
  return completedNodeIds.length;
}

/**
 * Get active world events.
 * @returns {Array}
 */
function getActiveWorldEvents() {
  return activeWorldEvents.slice();
}

/**
 * Get the full event log.
 * @returns {Array}
 */
function getEventLog() {
  return eventLog.slice();
}

/**
 * Reset tracker (for testing).
 */
function resetTracker() {
  eventLog = [];
  completedNodeIds = [];
  activeWorldEvents = [];
}

/**
 * Append to event log with size cap.
 * @param {object} entry
 */
function appendLog(entry) {
  eventLog.push(entry);
  if (eventLog.length > MAX_LOG_SIZE) {
    eventLog = eventLog.slice(-MAX_LOG_SIZE);
  }
}

module.exports = {
  EVENT_TYPE: EVENT_TYPE,
  initTracker: initTracker,
  recordNodeComplete: recordNodeComplete,
  recordPathProgress: recordPathProgress,
  recordWorldEvent: recordWorldEvent,
  checkPathProgress: checkPathProgress,
  getCompletedNodes: getCompletedNodes,
  getCompletedCount: getCompletedCount,
  getActiveWorldEvents: getActiveWorldEvents,
  getEventLog: getEventLog,
  resetTracker: resetTracker,
  WORLD_EVENT_SCHEDULE: WORLD_EVENT_SCHEDULE
};
