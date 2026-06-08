Page({
  data: {
    progress: {
      chapter: '云门初醒',
      explored: 2,
      total: 5,
      note: '个人探索进度，仅记录自己的旅程。'
    },
    regions: [
      {
        name: '爱企谷园区',
        desc: '当前 MVP 的探索容器，只承载已登记节点。',
        status: '开放探索'
      },
      {
        name: '后续场域',
        desc: '保留区域容器，等待正式 L2 数据接入。',
        status: '待接入'
      }
    ],
    locations: [
      {
        name: '云门・入门',
        region: '爱企谷园区',
        state: '已发现',
        copy: '主入口探索点，连接首次场域体验。'
      },
      {
        name: '中央场・照见',
        region: '爱企谷园区',
        state: '已发现',
        copy: '中央场域探索点，保留节点内容占位。'
      },
      {
        name: '人间书符・祝祐入门',
        region: '爱企谷园区',
        state: '待探索',
        copy: '修习入口占位，不扩写祝祐正文。'
      }
    ]
  },

  onOpenAr() {
    wx.navigateTo({
      url: '/pages/ar-entry/index'
    });
  }
});
