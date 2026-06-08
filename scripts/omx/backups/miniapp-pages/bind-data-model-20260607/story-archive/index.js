Page({
  data: {
    title: '故事档案',
    timeline: [
      {
        phase: '进入',
        chapter: '云门初醒',
        status: '结构就绪',
        copy: '首页进入探索地图，开启个人旅程。'
      },
      {
        phase: '探索',
        chapter: '云门初醒',
        status: '节点占位',
        copy: 'n1 到 n5 保留节点容器，等待正式内容数据。'
      },
      {
        phase: '档案',
        chapter: '后续章节',
        status: '待接入',
        copy: '只保留章节容器，不预写未来内容。'
      }
    ],
    archiveRules: [
      '按章节归档',
      '按个人旅程展示',
      '不补写 Canon 空白'
    ]
  }
});
