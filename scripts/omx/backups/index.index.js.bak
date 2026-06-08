Page({
  data: {
    title: '爱企谷',
    heroImage: '/assets/images/home-hero.png',
    homeModes: [
      { name: 'World Entry', text: '进入世界', desc: '从城市探索计划开始，理解爱企谷的探索路径。' },
      { name: 'Explorer Dashboard', text: '探索者首页', desc: '查看探索入口、信物和个人探索记录。' }
    ],
    entries: [
      { label: '探索地图', desc: '查看场域与探索点', path: '/pages/explore-map/index' },
      { label: '我的信物', desc: '查看故事进度资产', path: '/pages/relics/index' },
      { label: '场域体验', desc: '进入 AR 占位能力', path: '/pages/ar-entry/index' },
      { label: '权益中心', desc: '管理商业权益', path: '/pages/rights-center/index' }
    ],
    summary: [
      { value: '5', label: '探索点' },
      { value: '6', label: '信物位' },
      { value: '2', label: 'AR 入口' }
    ],
    notices: [
      { title: '信物独立入库', desc: '信物只承载故事进度，不参与传播资产流程。' },
      { title: '探索档案', desc: '个人记录进入探索档案，只呈现自己的探索历程。' }
    ]
  },

  onOpenPage(event) {
    const { path } = event.currentTarget.dataset;

    wx.navigateTo({
      url: path
    });
  }
});
