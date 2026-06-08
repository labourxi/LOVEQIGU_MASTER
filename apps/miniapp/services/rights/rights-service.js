const RIGHTS = [
  {
    id: 'right_ch01_preview',
    name: '章节预览权益',
    status: 'available',
    type: 'preview',
    redemption: {
      copy: '查看章节结构与活动入口。'
    }
  },
  {
    id: 'right_ch01_share',
    name: '章节分享权益',
    status: 'claimed',
    type: 'share',
    redemption: {
      copy: '生成分享卡并继续下一活动。'
    }
  }
];

function getAllRights() {
  return RIGHTS.map((right) => ({ ...right, redemption: right.redemption ? { ...right.redemption } : null }));
}

function getRightById(id) {
  return getAllRights().find((right) => right.id === id) || null;
}

function getRightsByType(type) {
  return getAllRights().filter((right) => right.type === type);
}

module.exports = {
  getAllRights,
  getRightById,
  getRightsByType
};
