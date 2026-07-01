/**
 * PAGE_03_MY — 个人印记 (User Center)
 *
 * SYSTEM RULES:
 *   - PAGE_ID = 'PAGE_09_PROFILE'
 *   - Data: ALL from store.buildMyRenderTree() — NO fallback generation
 *   - Events: subscribes to STATE_SYNCED for refresh
 *   - Behaviors: edit profile, navigate to relic/rights/collection
 */

var safeInteraction = require('../../behaviors/safe-interaction');
var storeAccessor = require('../../shared/store-accessor');
var injectWorldContent = require('../../content/world/inject_world_content').injectWorldContent;

var store = null;
try { store = storeAccessor.getStore(); } catch (e) {}

var PAGE_ID = store ? store.PAGE_IDS.PROFILE : 'PAGE_09_PROFILE';

function getStore() {
  try { return storeAccessor.getStore(); } catch (e) { return null; }
}

function getInjector() {
  try { return storeAccessor.getVisualInjector(); } catch (e) { return null; }
}

function showToast(title, icon) {
  try { wx.showToast({ title: title || '', icon: icon || 'none', duration: 2000 }); } catch (e) {}
}

/**
 * Build page data EXCLUSIVELY from store.
 * SYSTEM RULE #6: No fallback renderTree in page code.
 * If store is unavailable, show minimal state that delegates to store.
 */
function buildPageData() {
  var s = getStore();
  var injector = getInjector();

  // SYSTEM RULE #6: Data MUST come from store.
  // NO locally generated renderTree allowed.
  if (!s) {
    return {
      pageId: PAGE_ID,
      loading: false,
      activeTab: 'me',
      _storeUnavailable: true,
      title: '个人中心',
      subtitle: ''
    };
  }

  var renderTree = s.buildMyRenderTree();

  // Visual tokens from injector (system layer, not page logic)
  if (injector) {
    renderTree = injector.injectVisualTokens(renderTree);
  }

  // World content injection (narrative layer)
  renderTree = injectWorldContent('my', renderTree);

  renderTree.pageId = PAGE_ID;
  renderTree.activeTab = 'me';

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

  // ─── ON_EVENT: Edit Profile ───
  onEditProfile: function(e) {
    var action = e && e.currentTarget && e.currentTarget.dataset ? e.currentTarget.dataset.action : '';
    if (action === 'relics') {
      this.safeNavigate('/pages/relics/index', { fallbackTitle: '印记中心暂未开放' });
    } else if (action === 'rights') {
      this.safeNavigate('/pages/rights/index', { fallbackTitle: '礼遇中心暂未开放' });
    } else if (action === 'collection') {
      this.safeNavigate('/pages/collection/index', { fallbackTitle: '数字藏品暂未开放' });
    } else if (action === 'profile') {
      var profile = this.data.userProfile;
      this.setData({
        showEditModal: true,
        editModalData: {
          username: profile && profile.name || '',
          bio: profile && profile.bio || ''
        }
      });
    } else {
      this.showFallbackToast('档案编辑开发中');
    }
  },

  onEditModalInput: function(e) {
    var field = e && e.currentTarget && e.currentTarget.dataset ? e.currentTarget.dataset.field : '';
    var value = e && e.detail ? e.detail.value : '';
    if (!field) return;
    var modalData = this.data.editModalData || { username: '', bio: '' };
    if (field === 'username') modalData.username = value;
    if (field === 'bio') modalData.bio = value;
    this.setData({ editModalData: modalData });
  },

  onEditModalSave: function() {
    var modalData = this.data.editModalData || {};
    var s = getStore();
    if (s) {
      s.updateUserProfile({
        username: modalData.username || '探索者·未命名',
        bio: modalData.bio || '尚未留下描述'
      });
    }
    this.setData({
      showEditModal: false,
      editModalData: { username: '', bio: '' }
    });
    this.setData(buildPageData());
    showToast('资料已更新', 'success');
  },

  onEditModalClose: function() {
    this.setData({
      showEditModal: false,
      editModalData: { username: '', bio: '' }
    });
  },

  // ─── ON_EVENT: Edit username inline ───
  onEditUsername: function() {
    var s = getStore();
    var profile = this.data.userProfile;
    if (!s) { showToast('系统暂不可用'); return; }
    var that = this;
    try {
      wx.showModal({
        title: '修改昵称',
        content: '请输入新昵称',
        editable: true,
        placeholderText: (profile && profile.name) || '探索者·未命名',
        success: function(res) {
          if (res.confirm && res.content) {
            s.updateUserProfile({ username: res.content });
            that.setData(buildPageData());
            showToast('昵称已更新', 'success');
          }
        }
      });
    } catch (e) { showToast('编辑功能暂不可用'); }
  },

  // ─── ON_EVENT: Edit bio inline ───
  onEditBio: function() {
    var s = getStore();
    var profile = this.data.userProfile;
    if (!s) { showToast('系统暂不可用'); return; }
    var that = this;
    try {
      wx.showModal({
        title: '修改简介',
        content: '请输一句话简介',
        editable: true,
        placeholderText: (profile && profile.bio) || '尚未留下描述',
        success: function(res) {
          if (res.confirm && res.content) {
            s.updateUserProfile({ bio: res.content });
            that.setData(buildPageData());
            showToast('简介已更新', 'success');
          }
        }
      });
    } catch (e) { showToast('编辑功能暂不可用'); }
  },

  // ─── ON_EVENT: Open function module ───
  onOpenModule: function(e) {
    var route = e && e.currentTarget && e.currentTarget.dataset ? e.currentTarget.dataset.route : '';
    if (route) this.safeNavigate(route, { fallbackTitle: '功能暂未开放' });
  },

  onOpenRelics: function() {
    this.safeNavigate('/pages/relics/index', { fallbackTitle: '印记中心暂未开放' });
  },

  onOpenRights: function() {
    this.safeNavigate('/pages/rights/index', { fallbackTitle: '礼遇中心暂未开放' });
  },

  onOpenExploreMap: function() {
    this.safeNavigate('/pages/index/index', { fallbackTitle: '探索地图' });
  },

  onOpenLatestRelic: function() {
    this.safeNavigate('/pages/relics/index', { fallbackTitle: '印记追溯开发中' });
  },

  onOpenLatestRight: function() {
    this.safeNavigate('/pages/rights/index', { fallbackTitle: '礼遇详情开发中' });
  },

  onOpenSettings: function(e) {
    var route = e && e.currentTarget && e.currentTarget.dataset ? e.currentTarget.dataset.route : '';
    if (route) {
      this.safeNavigate(route, { fallbackTitle: '设置页开发中' });
    } else {
      this.showFallbackToast('设置页开发中');
    }
  },

  onBottomNavChange: function() {}
});
