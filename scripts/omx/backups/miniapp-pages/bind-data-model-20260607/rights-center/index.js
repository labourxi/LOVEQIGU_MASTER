Page({
  data: {
    title: '结缘商城',
    benefits: [
      {
        name: '咖啡兑换券',
        desc: '探索后可领取的商业权益占位。',
        state: '待领取'
      },
      {
        name: '会员中心',
        desc: '会员状态与权益说明占位。',
        state: '待接入'
      },
      {
        name: '我的卡券',
        desc: '卡券列表、核销码与使用状态占位。',
        state: '待接入'
      }
    ],
    redemption: {
      title: '兑换占位',
      copy: '当前仅展示流程容器，不连接支付、订单或核销接口。'
    }
  }
});
