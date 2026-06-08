Page({
  data: {
    title: 'LOVEQIGU',
    heroImage: '/assets/images/home-hero.jpg',
    chapter: {
      name: '云门初醒',
      status: 'RC1 状态',
      copy: '保留可见入口，继续在现有场域中完成探索。'
    },
    entries: [
      { label: '探索地图', desc: '查看区域、节点与 AR 入口', path: '/pages/explore-map/index' },
      { label: '信物档案', desc: '查看已获得的故事进度资产', path: '/pages/relic-archive/index' },
      { label: '故事档案', desc: '查看章节结构与占位内容', path: '/pages/story-archive/index' },
      { label: '结缘商城', desc: '进入商业权益与卡券区域', path: '/pages/rights-center/index' }
    ],
    summary: [
      { value: '5', label: '探索点' },
      { value: '6', label: '信物位' },
      { value: '2', label: 'AR 预览' }
    ],
    notices: [
      { title: '内容边界', desc: '当前页面只使用已登记的产品结构，不补写 Canon 空白。' },
      { title: '资产边界', desc: '信物用于故事进度展示，传播资产由用户主动生成。' }
    ]
  },

  onOpenPage(event) {
    const { path } = event.currentTarget.dataset;

    wx.navigateTo({
      url: path
    });
  }
});
