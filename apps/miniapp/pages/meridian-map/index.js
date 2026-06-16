const meridianMapService = require('../../services/meridian-map/meridian-map-service');
const culturalCopyService = require('../../services/cultural/cultural-copy-service');

const EMPTY_CELEBRATION = {
  visible: false,
  title: '',
  message: '',
  rewardName: '',
  rewardLabel: '',
  showParticles: true
};

function buildOverviewData(focusPointId) {
  const overview = meridianMapService.getMeridianOverview();
  return {
    view: 'overview',
    title: overview.title,
    subtitle: overview.subtitle,
    litDisplay: overview.litDisplay,
    completedDisplay: overview.completedDisplay,
    progressPercent: overview.progressPercent,
    regularMeridians: overview.regularMeridians,
    extraordinaryVessels: overview.extraordinaryVessels,
    meridianDetail: null,
    meridianCulturalCopy: '',
    focusPointId: focusPointId || '',
    note: '手太阴肺经、手阳明大肠经、足阳明胃经完整展示；其余经络与奇经结构已就绪，穴位目录待专项补全。'
  };
}

function buildMeridianView(meridianId, focusPointId) {
  const overview = meridianMapService.getMeridianOverview();
  const meridianDetail = meridianMapService.getMeridianDetail(meridianId, null, focusPointId);
  if (!meridianDetail) {
    return buildOverviewData(focusPointId);
  }
  const copy = culturalCopyService.getMeridianCopy(meridianDetail.id);
  return {
    view: 'meridian',
    title: overview.title,
    subtitle: meridianDetail.name,
    litDisplay: overview.litDisplay,
    completedDisplay: overview.completedDisplay,
    progressPercent: overview.progressPercent,
    regularMeridians: overview.regularMeridians,
    extraordinaryVessels: overview.extraordinaryVessels,
    meridianDetail,
    meridianCulturalCopy: copy ? copy.text : '',
    focusPointId: focusPointId || '',
    note: meridianDetail.placeholder
      ? `${meridianDetail.short_name}结构占位，穴位目录待专项补全。`
      : `${meridianDetail.name}穴位完整展示。`
  };
}

Page({
  data: {
    ...buildOverviewData(),
    celebration: { ...EMPTY_CELEBRATION }
  },

  onLoad(options) {
    this.applyRouteOptions(options || {});
  },

  onShow() {
    this.refreshData();
    this.checkFirstLight();
  },

  applyRouteOptions(options) {
    const focusPointId = options.pointId || '';
    if (focusPointId) {
      const located = meridianMapService.getPointById(focusPointId);
      if (located && located.meridian) {
        this.setData(buildMeridianView(located.meridian.id, focusPointId));
        return;
      }
    }
    if (options.meridianId) {
      this.setData(buildMeridianView(options.meridianId, focusPointId));
      return;
    }
    this.setData(buildOverviewData(focusPointId));
  },

  refreshData() {
    const { view, meridianDetail, focusPointId } = this.data;
    if (view === 'meridian' && meridianDetail && meridianDetail.id) {
      this.setData(buildMeridianView(meridianDetail.id, focusPointId));
      return;
    }
    this.setData(buildOverviewData(focusPointId));
  },

  checkFirstLight() {
    const overview = meridianMapService.getMeridianOverview();
    const firstLightService = require('../../services/immersion/first-light-service');
    const prompt = firstLightService.checkFirstPointLit(overview.lit);
    if (!prompt || this.data.celebration.visible) {
      return;
    }
    firstLightService.markShown(prompt.id);
    this.setData({
      celebration: {
        visible: true,
        title: prompt.title,
        message: prompt.message,
        rewardName: '',
        rewardLabel: '',
        showParticles: true
      }
    });
  },

  onCelebrationClose() {
    this.setData({
      celebration: { ...EMPTY_CELEBRATION }
    });
  },

  onOpenMeridian(event) {
    const { id } = event.currentTarget.dataset;
    if (!id) {
      return;
    }
    this.setData(buildMeridianView(id, ''));
  },

  onBackOverview() {
    this.setData(buildOverviewData(''));
  }
});
