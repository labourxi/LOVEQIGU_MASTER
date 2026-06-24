const safeInteraction = require('../utils/safe-interaction');

module.exports = Behavior({
  methods: {
    showFallbackToast(title) {
      safeInteraction.showFallbackToast(title);
    },

    safeNavigate(url, options) {
      return safeInteraction.safeNavigate(url, options);
    },

    safeTap(handler, options) {
      return safeInteraction.safeTap(handler, options);
    }
  }
});
