Page({
  data: {
    title: '信物档案',
    intro: '信物是故事进度资产，用于记录探索、印迹与章成结果。',
    records: [
      {
        name: '入门徽章',
        chapter: '云门初醒',
        type: '觉察信物',
        source: '云门・入门',
        status: '已记录',
        meaning: '首次探索记录的信物占位。'
      },
      {
        name: '云门残印・甲',
        chapter: '云门初醒',
        type: '残印信物',
        source: '云门・入门',
        status: '已记录',
        meaning: '印迹结构占位，不定义形成机制。'
      },
      {
        name: '初醒印记',
        chapter: '云门初醒',
        type: '章成信物',
        source: '章节完成容器',
        status: '待记录',
        meaning: '章成结果占位，等待正式 L2 数据。'
      }
    ],
    boundary: '传播资产由用户主动生成，不能替代信物记录。'
  }
});
