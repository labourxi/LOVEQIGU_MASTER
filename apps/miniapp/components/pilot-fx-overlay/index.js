const { getEffectConfig, isKnownEffect } = require('../../services/pilot/pilot-visual-registry');

Component({
  properties: {
    effectId: {
      type: String,
      value: ''
    },
    label: {
      type: String,
      value: ''
    },
    visible: {
      type: Boolean,
      value: false
    }
  },

  data: {
    playing: false
  },

  methods: {
    play(effectId, options = {}) {
      if (!isKnownEffect(effectId)) {
        return Promise.resolve(false);
      }
      if (this.data.playing) {
        return Promise.resolve(false);
      }

      const config = getEffectConfig(effectId);
      const durationMs = options.durationMs || (config && config.durationMs) || 1200;
      const label = options.label || (config && config.label) || '';

      this.setData({
        playing: true,
        visible: true,
        effectId,
        label
      });

      return new Promise((resolve) => {
        this._playTimer = setTimeout(() => {
          this.setData({
            playing: false,
            visible: false,
            effectId: '',
            label: ''
          });
          resolve(true);
        }, durationMs);
      });
    },

    stop() {
      if (this._playTimer) {
        clearTimeout(this._playTimer);
        this._playTimer = null;
      }
      this.setData({
        playing: false,
        visible: false,
        effectId: '',
        label: ''
      });
    }
  },

  detached() {
    this.stop();
  }
});
