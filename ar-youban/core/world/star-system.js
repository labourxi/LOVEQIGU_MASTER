const STAR_GROUPS = [
  { groupId: 'qinglong', groupName: '青龙', names: ['角', '亢', '氐', '房', '心', '尾', '箕'] },
  { groupId: 'zhuque', groupName: '朱雀', names: ['井', '鬼', '柳', '星', '张', '翼', '轸'] },
  { groupId: 'baihu', groupName: '白虎', names: ['奎', '娄', '胃', '昴', '毕', '觜', '参'] },
  { groupId: 'xuanwu', groupName: '玄武', names: ['斗', '牛', '女', '虚', '危', '室', '壁'] }
];

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function createNode(mansionName, index) {
  return {
    id: `${mansionName}-node-${index + 1}`,
    label: `${mansionName}#${index + 1}`,
    state: 'dim'
  };
}

function createMansion(groupId, groupName, name, orderInGroup) {
  return {
    id: `${groupId}-${name}`,
    name,
    groupId,
    groupName,
    orderInGroup,
    state: 'dim',
    boundary: `${groupId}-boundary`,
    nodes: [createNode(name, 0), createNode(name, 1), createNode(name, 2)]
  };
}

function createStarSystem() {
  const mansions = [];
  STAR_GROUPS.forEach((group) => {
    group.names.forEach((name, index) => {
      mansions.push(createMansion(group.groupId, group.groupName, name, index + 1));
    });
  });

  let activeIndex = -1;

  function getActiveMansion() {
    return activeIndex >= 0 ? mansions[activeIndex] : null;
  }

  function lightNext(payload = {}) {
    if (activeIndex >= 0) {
      const previous = mansions[activeIndex];
      previous.state = 'complete';
      previous.nodes.forEach((node) => {
        node.state = 'complete';
      });
    }

    activeIndex = (activeIndex + 1) % mansions.length;
    const current = mansions[activeIndex];
    current.state = 'active';
    current.nodes.forEach((node, idx) => {
      node.state = idx === 0 ? 'active' : 'dim';
    });

    return getSnapshot(payload);
  }

  function getSnapshot(payload = {}) {
    const active = getActiveMansion();
    const completedCount = mansions.filter((mansion) => mansion.state === 'complete').length;
    const activeGroup = active ? active.groupName : '未点亮';
    return {
      kind: 'star',
      activeMansionId: active ? active.id : '',
      activeMansionName: active ? active.name : '',
      activeGroupName: activeGroup,
      completedCount,
      totalCount: mansions.length,
      summary: active
        ? `当前星宿：${active.groupName} · ${active.name}，已完成 ${completedCount}/${mansions.length}`
        : '星宿待点亮',
      mansions: clone(mansions),
      payload
    };
  }

  function reset() {
    activeIndex = -1;
    mansions.forEach((mansion) => {
      mansion.state = 'dim';
      mansion.nodes.forEach((node) => {
        node.state = 'dim';
      });
    });
  }

  return {
    lightNext,
    getSnapshot,
    reset
  };
}

module.exports = {
  STAR_GROUPS,
  createStarSystem
};

