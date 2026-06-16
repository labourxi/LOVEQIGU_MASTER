const NEXT_ACTIVITIES = [
  {
    activity_id: 'next_home',
    title: '首页',
    copy: '返回主入口页面。',
    path: '/pages/index/index'
  },
  {
    activity_id: 'next_explore_map',
    title: '探索地图',
    copy: '继续探索入口流程。',
    path: '/pages/explore-map/index'
  },
  {
    activity_id: 'next_story_archive',
    title: '故事档案',
    copy: '查看章节档案并进入故事流程。',
    path: '/pages/story-archive/index'
  },
  {
    activity_id: 'next_rights_center',
    title: '权益中心',
    copy: '查看权益展示并进入活动记念。',
    path: '/pages/rights-center/index'
  }
];

function getAllNextActivities() {
  return NEXT_ACTIVITIES.map((item) => ({ ...item }));
}

function getNextActivityById(id) {
  return getAllNextActivities().find((item) => item.activity_id === id) || null;
}

module.exports = {
  getAllNextActivities,
  getNextActivityById
};
