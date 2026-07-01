/**
 * V5.9.22 — AR Event Processor
 *
 * Event-driven pipeline that connects:
 *
 *   SCAN_START → SCAN_SUCCESS → EVENT_TRIGGERED → RELIC_CREATED
 *     → COLLECTIBLE_GENERATED → RIGHTS_UPDATED → COLLECTION_UPDATED
 *     → STATE_SYNCED
 *
 * RULES:
 *   - ALL state mutation happens HERE, not in pages
 *   - Pages ONLY emit events and subscribe to state changes
 *   - ONE AR event = ONE asset chain (relic + collectible + rights update)
 *   - NEVER attempt WebAssembly or Draco loading — this module is
 *     pure event wiring and MUST NOT depend on WASM at boot.
 *
 * WASM GUARD:
 *   If globalThis.__AR_WASM_DISABLED__ is true, this processor
 *   still works (it's pure event wiring). Only the AR scan page
 *   needs WASM for camera/XR features.
 */

var eventBus = require('./ar-event-bus');
var store = require('../runtime/world_runtime_store');

var PROCESSOR_INITIALIZED = false;

/**
 * Initialize the AR event processor.
 * Subscribes to all event chain stages and wires them together.
 * Called once at boot from app.js.
 */
function initArEventProcessor() {
  if (PROCESSOR_INITIALIZED) return;
  PROCESSOR_INITIALIZED = true;

  // ─── Pipeline: SCAN_START → SCAN_SUCCESS ───
  eventBus.on('SCAN_START', function(payload) {
    console.log('[EVENT_PROCESSOR] SCAN_START', payload);
    // Validate payload
    if (!payload || !payload.pointId) {
      console.warn('[EVENT_PROCESSOR] SCAN_START missing pointId');
      eventBus.emit('SCAN_FAILED', { reason: 'invalid_payload', payload: payload });
      return;
    }
    // Proceed — the AR module handles actual scanning
  });

  // ─── Pipeline: SCAN_SUCCESS → EVENT_TRIGGERED → asset chain ───
  eventBus.on('SCAN_SUCCESS', function(payload) {
    console.log('[EVENT_PROCESSOR] SCAN_SUCCESS', payload);

    if (!payload || !payload.pointId) {
      console.warn('[EVENT_PROCESSOR] SCAN_SUCCESS missing pointId');
      return;
    }

    // Emit EVENT_TRIGGERED
    eventBus.emit('EVENT_TRIGGERED', {
      source: 'SCAN_SUCCESS',
      pointId: payload.pointId,
      pointName: payload.pointName || '未知地点',
      emotion: payload.emotion || '平静',
      location: payload.location || '',
      timestamp: Date.now()
    });
  });

  // ─── Pipeline: EVENT_TRIGGERED → RELIC_CREATED → COLLECTIBLE_GENERATED ───
  eventBus.on('EVENT_TRIGGERED', function(payload) {
    console.log('[EVENT_PROCESSOR] EVENT_TRIGGERED → generating asset chain');

    // Generate the full asset chain via the store
    // store.generateAssetFromAr returns { relic, collectible, event }
    var chain = store.generateAssetFromAr({
      pointId: payload.pointId,
      pointName: payload.pointName,
      emotion: payload.emotion,
      location: payload.location
    });

    if (!chain) {
      console.warn('[EVENT_PROCESSOR] asset generation failed');
      eventBus.emit('ASSET_GENERATION_FAILED', { pointId: payload.pointId });
      return;
    }

    // Earn rights points for the AR check-in
    store.onArCheckin(payload.pointId);

    // Emit RELIC_CREATED
    eventBus.emit('RELIC_CREATED', {
      relic: chain.relic,
      pointName: payload.pointName,
      pointId: payload.pointId
    });

    // Emit COLLECTIBLE_GENERATED
    eventBus.emit('COLLECTIBLE_GENERATED', {
      collectible: chain.collectible,
      linkedRelicId: chain.relic.id
    });

    // Emit RIGHTS_UPDATED
    eventBus.emit('RIGHTS_UPDATED', {
      source: 'ar_checkin',
      pointId: payload.pointId,
      pointsEarned: 1
    });
  });

  // ─── Pipeline: COLLECTIBLE_GENERATED → COLLECTION_UPDATED ───
  eventBus.on('COLLECTIBLE_GENERATED', function(payload) {
    console.log('[EVENT_PROCESSOR] COLLECTIBLE_GENERATED → notifying collection');

    eventBus.emit('COLLECTION_UPDATED', {
      type: 'new_asset',
      collectible: payload.collectible,
      linkedRelicId: payload.linkedRelicId,
      timestamp: Date.now()
    });
  });

  // ─── Pipeline: RIGHTS_UPDATED → STATE_SYNCED ───
  eventBus.on('RIGHTS_UPDATED', function(payload) {
    console.log('[EVENT_PROCESSOR] RIGHTS_UPDATED → notifying rights system');

    eventBus.emit('STATE_SYNCED', {
      domains: ['collection', 'rights', 'explore'],
      source: 'ar_event_chain',
      payload: payload,
      timestamp: Date.now()
    });
  });

  // ─── RIGHTS_UPDATED also emits directly to rights subscribers ───
  // (handled separately so rights page can refresh)

  console.log('[EVENT_PROCESSOR] initialized — pipeline ready');
  console.log('[EVENT_PROCESSOR] registered events: SCAN_START, SCAN_SUCCESS, EVENT_TRIGGERED, RELIC_CREATED, COLLECTIBLE_GENERATED, RIGHTS_UPDATED, COLLECTION_UPDATED, STATE_SYNCED');
}

module.exports = {
  initArEventProcessor: initArEventProcessor
};
