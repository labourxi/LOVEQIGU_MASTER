/**
 * AR Scan Page — AR 扫描层
 *
 * V5.9.22 — Event-driven AR scan.
 *
 * RULES:
 *   - DO NOT directly create relic / update UI / update collection
 *   - ONLY emit events to the event bus
 *   - Event processor handles all downstream state mutations
 *
 * FLOW:
 *   onScanStart() → emit SCAN_START
 *   onScanSuccess() → emit SCAN_SUCCESS
 *   onScanFail() → emit SCAN_FAILED
 */

var eventBus = require('../../core/event/ar-event-bus');

Page({
  data: {
    scanning: false,
    result: null,
    error: null,
    pointName: ''
  },

  onLoad(options) {
    console.log('[ar-scan] onLoad', options);

    // Extract point info from navigation params
    var pointId = options && (options.pointId || options.scene);
    var pointName = options && options.pointName;

    this.setData({
      pointId: pointId || 'unknown',
      pointName: pointName || ''
    });

    // Auto-start scan if pointId provided
    if (pointId) {
      this.onScanStart();
    }
  },

  onUnload() {
    console.log('[ar-scan] onUnload');
  },

  /**
   * Start AR scan.
   * Emits SCAN_START — no direct mutations.
   */
  onScanStart() {
    if (this.data.scanning) return;
    this.setData({ scanning: true, error: null });

    console.log('[ar-scan] scan start — point:', this.data.pointId);

    // Emit SCAN_START — event processor handles the rest
    eventBus.emit('SCAN_START', {
      pointId: this.data.pointId,
      pointName: this.data.pointName,
      timestamp: Date.now()
    });

    // Simulate scan success after brief delay (TODO: replace with real XR scan)
    var that = this;
    setTimeout(function() {
      that.onScanSuccess();
    }, 1500);
  },

  /**
   * AR scan success.
   * Emits SCAN_SUCCESS — event processor generates relic + collectible + rights.
   * DO NOT directly create assets here.
   */
  onScanSuccess() {
    console.log('[ar-scan] scan success — emitting SCAN_SUCCESS');

    eventBus.emit('SCAN_SUCCESS', {
      pointId: this.data.pointId,
      pointName: this.data.pointName || '探索点',
      emotion: '平静',
      location: this.data.pointName || '',
      timestamp: Date.now()
    });

    this.setData({
      scanning: false,
      result: 'success'
    });

    // Show brief success feedback, then navigate back
    var that = this;
    setTimeout(function() {
      wx.navigateBack();
    }, 1000);
  },

  /**
   * AR scan failure.
   * Emits SCAN_FAILED.
   */
  onScanFail(reason) {
    console.warn('[ar-scan] scan failed:', reason);

    eventBus.emit('SCAN_FAILED', {
      pointId: this.data.pointId,
      reason: reason || 'unknown',
      timestamp: Date.now()
    });

    this.setData({
      scanning: false,
      error: reason || '扫描失败'
    });
  },

  onClose() {
    wx.navigateBack();
  }
});
