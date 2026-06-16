const synthesisService = require('../../services/synthesis/synthesis-service');
const firstLightService = require('../../services/immersion/first-light-service');

const EMPTY_CELEBRATION = {
  visible: false,
  title: '',
  message: '',
  rewardName: '',
  rewardLabel: '',
  showParticles: true
};

function buildPageData() {
  const syntheses = synthesisService.getAvailableSyntheses();
  return {
    title: '信物合成',
    subtitle: '星名宿印 · 穴位经络印 · 天人合一',
    readyList: syntheses.filter((item) => item.canPerform),
    pendingList: syntheses.filter((item) => !item.done && !item.canPerform),
    doneList: syntheses.filter((item) => item.done),
    readyCount: syntheses.filter((item) => item.canPerform).length
  };
}

Page({
  data: {
    ...buildPageData(),
    celebration: { ...EMPTY_CELEBRATION },
    pendingFirstLight: null
  },

  onLoad() {
    this.refreshLists();
  },

  onShow() {
    this.refreshLists();
  },

  refreshLists() {
    this.setData(buildPageData());
  },

  onSynthesize(event) {
    const { id } = event.currentTarget.dataset;
    if (!id) {
      return;
    }
    const recipe = synthesisService.getAvailableSyntheses().find((item) => item.id === id);
    const result = synthesisService.performSynthesis(id);
    if (!result.ok) {
      wx.showToast({ title: result.message, icon: 'none' });
      return;
    }

    let pendingFirstLight = null;
    if (recipe && recipe.kind === 'mansion') {
      pendingFirstLight = firstLightService.checkFirstMansionSeal();
    } else if (recipe && recipe.kind === 'meridian') {
      pendingFirstLight = firstLightService.checkFirstMeridianSeal();
    }

    this.setData({
      pendingFirstLight,
      celebration: {
        visible: true,
        title: '合成成功',
        message: '',
        rewardName: result.reward.name,
        rewardLabel: synthesisService.REWARD_TYPE_LABELS[result.reward.reward_type] || result.reward.reward_desc,
        showParticles: true
      }
    });
    this.refreshLists();
  },

  onCelebrationClose() {
    const pending = this.data.pendingFirstLight;
    if (pending) {
      firstLightService.markShown(pending.id);
      this.setData({
        pendingFirstLight: null,
        celebration: {
          visible: true,
          title: pending.title,
          message: pending.message,
          rewardName: '',
          rewardLabel: '',
          showParticles: true
        }
      });
      return;
    }

    this.setData({
      celebration: { ...EMPTY_CELEBRATION }
    });
  },

  onOpenSeals() {
    wx.navigateTo({ url: '/pages/seals/index' });
  },

  onOpenRewards() {
    wx.navigateTo({ url: '/pages/reward-center/index' });
  }
});
