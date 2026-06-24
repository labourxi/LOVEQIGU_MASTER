const heavenHumanUnityService = require('../../services/heaven-human-unity/heaven-human-unity-service');
const safeInteraction = require('../../behaviors/safe-interaction');

function buildPageData() {
  const overview = heavenHumanUnityService.getHeavenHumanUnityOverview();
  return {
    title: overview.title,
    subtitle: overview.subtitle,
    intro: overview.intro,
    heavenDisplay: overview.heavenDisplay,
    heavenSeals: overview.heavenSeals,
    humanDisplay: overview.humanDisplay,
    regularSeals: overview.regularSeals,
    extraordinarySeals: overview.extraordinarySeals,
    unityStatusLabel: overview.unityStatusLabel,
    unityAchieved: overview.unityAchieved,
    starMapPath: overview.starMapPath,
    meridianMapPath: overview.meridianMapPath
  };
}

Page({
  behaviors: [safeInteraction],
  data: buildPageData(),

  onLoad() {
    this.setData(buildPageData());
  },

  onShow() {
    this.setData(buildPageData());
  },

  onOpenPage(event) {
    const { path } = event.currentTarget.dataset;
    if (!path) {
      this.showFallbackToast('功能开发中');
      return;
    }
    this.safeNavigate(path);
  }
});
