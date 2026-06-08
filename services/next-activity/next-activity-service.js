const NEXT_ACTIVITIES = [
  {
    activity_id: 'next_home',
    title: 'Home',
    copy: 'Return to the main entry surface.',
    path: '/pages/index/index'
  },
  {
    activity_id: 'next_explore_map',
    title: 'Explore Map',
    copy: 'Continue the exploration entry flow.',
    path: '/pages/explore-map/index'
  },
  {
    activity_id: 'next_story_archive',
    title: 'Story Archive',
    copy: 'Review the chapter archive and open Story Flow execution.',
    path: '/pages/story-archive/index'
  },
  {
    activity_id: 'next_rights_center',
    title: 'Rights Center',
    copy: 'Review the rights surface and open Campaign Closure.',
    path: '/pages/rights-center/index'
  },
  {
    activity_id: 'next_profile',
    title: 'Profile',
    copy: 'Return to the account summary surface.',
    path: '/pages/profile/index'
  }
];

function getAllNextActivities() {
  return NEXT_ACTIVITIES.map((item) => ({ ...item }));
}

function getNextActivityById(id) {
  return NEXT_ACTIVITIES.find((item) => item.activity_id === id) || null;
}

module.exports = {
  getAllNextActivities,
  getNextActivityById
};
