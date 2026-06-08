const arService = require('../../services/ar/ar-service');
const storyFlowService = require('../../services/story/story-flow-service');

function mapEntries() {
  return arService.getAllArEvents().map((event) => ({
    code: event.code,
    name: event.name,
    desc: event.copy,
    cameraEnabled: event.camera_enabled,
    fakeArEnabled: event.fake_ar_enabled
  }));
}

function buildModeData(options = {}) {
  const context = options.context || 'explore';
  const flowId = options.flowId || '';
  const flow = flowId ? storyFlowService.getStoryFlowById(flowId) : null;

  if (context === 'story-flow') {
    return {
      context,
      flowId,
      title: 'AR Event Closure',
      previewOnly: flow
        ? `Story Flow execution closes through ${flow.title} and hands off to Echo.`
        : 'Story Flow execution closes through the approved AR Event closure path.',
      modeLabel: 'Story Flow',
      modeCopy: 'Continue the closure path into Echo.',
      actionLabel: 'Open Echo',
      actionPath: '/pages/echo/index'
    };
  }

  return {
    context: 'explore',
    flowId: '',
    title: 'AR Entry',
    previewOnly: 'Preview-only AR entry that stays inside the approved miniapp route set.',
    modeLabel: 'Path A',
    modeCopy: 'Continue the exploration path into Atom.',
    actionLabel: 'Open Atom',
    actionPath: '/pages/atom/index'
  };
}

function buildPageData(options = {}) {
  return {
    ...buildModeData(options),
    entries: mapEntries(),
    checks: [
      'No camera permission is requested',
      'No live AR runtime is invoked',
      'No Canon is added'
    ]
  };
}

Page({
  data: buildPageData(),

  onLoad(options = {}) {
    this.setData(buildPageData(options));
  },

  onPreview(event) {
    const { code } = event.currentTarget.dataset;
    const arEvent = arService.getArEventByCode(code);

    wx.showToast({
      title: `${arEvent ? arEvent.code : code} preview`,
      icon: 'none'
    });
  },

  onContinue() {
    wx.navigateTo({
      url: this.data.actionPath
    });
  }
});
