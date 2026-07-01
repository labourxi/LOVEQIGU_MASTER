// ═══════════════════════════════════════════
// V5.9.16 — RELIC CENTER (Enriched)
//
// Product-level UX:
// - Golden/bronze/shadow frame system
// - Visual border container for each relic
// - Name, origin point, acquisition time, rarity badge
// - Empty state with framed placeholders
// ═══════════════════════════════════════════

var safeInteraction = require('../../behaviors/safe-interaction');
var storeAccessor = require('../../shared/store-accessor');

function getStore() {
  try { return storeAccessor.getStore(); } catch (e) { return null; }
}

function getInjector() {
  try { return storeAccessor.getVisualInjector(); } catch (e) { return null; }
}

function buildPageData() {
  var store = getStore();
  var injector = getInjector();

  var renderTree;
  if (store) {
    renderTree = store.buildRelicRenderTree();
  } else {
    renderTree = {
      loading: false,
      activeTab: 'relic',
      title: '信物录',
      subtitle: '已发现 0/0',
      progress: { collected: 0, total: 0 },
      groups: [],
      colCount: 2,
      boundary: null
    };
  }

  // Inject visual tokens
  if (injector) {
    renderTree = injector.injectVisualTokens(renderTree);
  }

  // Legacy fields for WXML compatibility
  renderTree.activeTab = 'relic';
  renderTree.totalCount = renderTree.progress ? renderTree.progress.total : 0;
  renderTree.hasRelics = renderTree.groups && renderTree.groups.length > 0;

  // Assign frame classes to each group and item
  if (renderTree.groups) {
    for (var g = 0; g < renderTree.groups.length; g++) {
      var group = renderTree.groups[g];
      for (var i = 0; i < group.items.length; i++) {
        group.items[i].frameClass = group.items[i].frameClass || 'relic-frame--shadow';
        group.items[i].frameLabel = group.items[i].frameLabel || '游离残响';
      }
    }
  }

  return renderTree;
}

Page({
  behaviors: [safeInteraction],

  data: buildPageData(),

  onLoad: function() {
    this.setData(buildPageData());
  },

  onShow: function() {
    this.setData(buildPageData());
  },

  onRelicTap: function(e) {
    this.showFallbackToast('印记追溯开发中');
  },

  onBottomNavChange: function() {}
});
