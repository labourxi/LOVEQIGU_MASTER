const shareGuard = require('../utils/share-guard');

module.exports = Behavior({
  pageLifetimes: {
    show() {
      shareGuard.suppressUserFacingShareMenus();
    }
  }
});
