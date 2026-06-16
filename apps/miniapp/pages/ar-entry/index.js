const arService = require('../../services/ar/ar-service');
const starRitualService = require('../../services/star-ritual-service');
const storyFlowService = require('../../services/story/story-flow-service');

function isEnabledFlag(value) {
  const normalized = String(value || '').toLowerCase();
  return normalized === '1' || normalized === 'true' || normalized === 'yes';
}

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
      title: '鍦哄煙闂悎',
      previewOnly: flow
        ? `鏁呬簨娴佺▼缁?${flow.title} 闂悎锛岄殢鍚庤繘鍏ュ洖鍝嶆楠ゃ€?`
        : '鏁呬簨娴佺▼缁忓凡鎵瑰噯鍦哄煙浣撻獙璺緞闂悎銆?',
      modeLabel: '鏁呬簨娴佺▼',
      modeCopy: '缁х画杩涘叆鍥炲搷姝ラ銆?',
      actionLabel: '杩涘叆鍥炲搷',
      actionPath: '/pages/echo/index'
    };
  }

  return {
    context: 'explore',
    flowId: '',
    title: '鍦哄煙鍏ュ彛',
    previewOnly: '棰勮鍦哄煙鍏ュ彛锛屼繚鎸佸湪宸叉敞鍐岄〉闈㈣寖鍥村唴銆?',
    modeLabel: '鎺㈢储璺緞',
    modeCopy: '缁х画杩涘叆鍐呭鑺傜偣姝ラ銆?',
    actionLabel: '杩涘叆鍐呭鑺傜偣',
    actionPath: '/pages/atom/index'
  };
}

function buildRitualPreviewData(options = {}) {
  const summary = starRitualService.buildPreviewSummary();
  return {
    enabled: true,
    title: summary.title,
    subtitle: summary.subtitle,
    copy: summary.copy,
    assetMode: summary.assetMode,
    timelineCount: Array.isArray(summary.timeline) ? summary.timeline.length : 0,
    demoLabel: '仅在查询参数命中时显示，便于验证 ART-02 的 Canvas + Lottie 混合预览。',
    visible: isEnabledFlag(options.previewStarRitual) || isEnabledFlag(options.art02Preview),
    autoplay: isEnabledFlag(options.autoplayStarRitual),
    targetIndex: Number.isInteger(Number(options.starTargetIndex)) ? Number(options.starTargetIndex) : 2
  };
}

function buildPageData(options = {}) {
  return {
    ...buildModeData(options),
    entries: mapEntries(),
    checks: [
      '不请求相机权限',
      '不调用真实场域运行时',
      '不新增世界观内容'
    ],
    showStarRitualPreview: isEnabledFlag(options.previewStarRitual) || isEnabledFlag(options.art02Preview),
    ritualPreview: buildRitualPreviewData(options),
    ritualPreviewState: '待启动'
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
      title: `${arEvent ? arEvent.name : code} 预览`,
      icon: 'none'
    });
  },

  onContinue() {
    wx.navigateTo({
      url: this.data.actionPath
    });
  },

  onStartStarRitualPreview() {
    const preview = this.selectComponent('#starRitualPreview');
    if (!preview) {
      wx.showToast({
        title: '预览组件未就绪',
        icon: 'none'
      });
      return;
    }

    preview.startPreview();
    this.setData({
      ritualPreviewState: '运行中'
    });
  },

  onResetStarRitualPreview() {
    const preview = this.selectComponent('#starRitualPreview');
    if (!preview) {
      return;
    }

    preview.resetPreview();
    this.setData({
      ritualPreviewState: '待启动'
    });
  },

  onStarRitualComplete() {
    this.setData({
      ritualPreviewState: '已完成'
    });
    wx.showToast({
      title: '星图点亮完成',
      icon: 'none'
    });
  }
});
