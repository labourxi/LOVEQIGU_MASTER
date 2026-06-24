const starMapService = require('../../services/star-map/star-map-service');
const culturalCopyService = require('../../services/cultural/cultural-copy-service');
const userRuntime = require('../../services/user-runtime-adapter/index');
const phase1PageGuard = require('../../behaviors/phase1-page-guard');
const safeInteraction = require('../../behaviors/safe-interaction');

const EMPTY_CELEBRATION = {
  visible: false,
  title: '',
  message: '',
  rewardName: '',
  rewardLabel: '',
  showParticles: true
};

function attachMansionCulture(mansion) {
  const copy = culturalCopyService.getMansionCopy(mansion.id);
  return {
    ...mansion,
    culturalCopy: copy ? copy.text : ''
  };
}

function buildOverviewData(focusAliasId) {
  const overview = starMapService.getStarMapOverview();
  userRuntime.boot();
  const adapter = userRuntime.getAdapter();
  let progressPercent = overview.progressPercent;
  let litDisplay = overview.litDisplay;
  if (adapter) {
    const runtimeProgress = adapter.getStarMapProgress(userRuntime.getUserId(), userRuntime.getActivityId());
    if (runtimeProgress.litCount > 0) {
      progressPercent = Math.max(progressPercent, runtimeProgress.progressPercent);
      litDisplay = `${runtimeProgress.litCount}/${runtimeProgress.totalRelics || overview.litDisplay}`;
    }
  }
  return {
    view: 'overview',
    title: overview.title,
    subtitle: overview.subtitle,
    litDisplay,
    progressPercent,
    symbols: overview.symbols.map((symbol) => {
      const copy = culturalCopyService.getSymbolCopy(symbol.id);
      return {
        ...symbol,
        culturalCopy: copy ? copy.text : ''
      };
    }),
    symbolDetail: null,
    symbolCulturalCopy: '',
    focusAliasId: focusAliasId || '',
    note: '东方青龙七宿完整展示；其余三象结构已就绪，星名目录待专项补全。'
  };
}

function buildSymbolView(symbolId, focusAliasId) {
  const overview = starMapService.getStarMapOverview();
  const symbolDetail = starMapService.getSymbolDetail(symbolId, null, focusAliasId);
  if (!symbolDetail) {
    return buildOverviewData(focusAliasId);
  }
  const symbolCopy = culturalCopyService.getSymbolCopy(symbolDetail.id);
  return {
    view: 'symbol',
    title: overview.title,
    subtitle: symbolDetail.name,
    litDisplay: overview.litDisplay,
    progressPercent: overview.progressPercent,
    symbols: overview.symbols,
    symbolDetail: {
      ...symbolDetail,
      mansions: symbolDetail.mansions.map(attachMansionCulture)
    },
    symbolCulturalCopy: symbolCopy ? symbolCopy.text : '',
    focusAliasId: focusAliasId || '',
    note: symbolDetail.placeholder
      ? `${symbolDetail.short_name}象结构占位，星名目录待专项补全。`
      : `${symbolDetail.short_name}象七宿完整展示。`
  };
}

Page({
  behaviors: [phase1PageGuard, safeInteraction],
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
    const focusAliasId = options.starAliasId || '';
    if (focusAliasId) {
      const located = starMapService.getStarByAliasId(focusAliasId);
      if (located && located.symbol) {
        this.setData(buildSymbolView(located.symbol.id, focusAliasId));
        return;
      }
    }
    if (options.symbolId) {
      this.setData(buildSymbolView(options.symbolId, focusAliasId));
      return;
    }
    this.setData(buildOverviewData(focusAliasId));
  },

  refreshData() {
    const { view, symbolDetail, focusAliasId } = this.data;
    if (view === 'symbol' && symbolDetail && symbolDetail.id) {
      this.setData(buildSymbolView(symbolDetail.id, focusAliasId));
      return;
    }
    this.setData(buildOverviewData(focusAliasId));
  },

  checkFirstLight() {
    const overview = starMapService.getStarMapOverview();
    const firstLightService = require('../../services/immersion/first-light-service');
    const prompt = firstLightService.checkFirstStarLit(overview.lit);
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

  onOpenSymbol(event) {
    const { id } = event.currentTarget.dataset;
    if (!id) {
      this.showFallbackToast('功能开发中');
      return;
    }
    this.setData(buildSymbolView(id, ''));
  },

  onBackOverview() {
    this.setData(buildOverviewData(''));
  }
});
