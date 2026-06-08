Page({
  data: {
    title: 'AR 入口',
    previewOnly: '占位交互，不连接真实 AR 能力。',
    entries: [
      {
        code: 'AR_GATE_OPEN_V1',
        name: '云门显现入口',
        desc: '保留入口、按钮与状态，不定义云门来源。'
      },
      {
        code: 'AR_IMPRINT_PARTICLES_V1',
        name: '印迹粒子入口',
        desc: '保留视觉预览容器，不定义残印形成机制。'
      }
    ],
    checks: [
      '无真实摄像头调用',
      '无假 AR 实现',
      '无 Canon 空白补写'
    ]
  },

  onPreview(event) {
    const { code } = event.currentTarget.dataset;

    wx.showToast({
      title: `${code} 占位`,
      icon: 'none'
    });
  }
});
