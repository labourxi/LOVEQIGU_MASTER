const MERIDIAN_GROUPS = [
  { meridianId: 'lung', meridianName: '手太阴肺经' },
  { meridianId: 'large_intestine', meridianName: '手阳明大肠经' },
  { meridianId: 'stomach', meridianName: '足阳明胃经' },
  { meridianId: 'spleen', meridianName: '足太阴脾经' },
  { meridianId: 'heart', meridianName: '手少阴心经' },
  { meridianId: 'small_intestine', meridianName: '手太阳小肠经' },
  { meridianId: 'bladder', meridianName: '足太阳膀胱经' },
  { meridianId: 'kidney', meridianName: '足少阴肾经' },
  { meridianId: 'pericardium', meridianName: '手厥阴心包经' },
  { meridianId: 'triple_burner', meridianName: '手少阳三焦经' },
  { meridianId: 'gallbladder', meridianName: '足少阳胆经' },
  { meridianId: 'liver', meridianName: '足厥阴肝经' }
];

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function createPathNode(meridianName, index) {
  return {
    id: `${meridianName}-node-${index + 1}`,
    label: `${meridianName}#${index + 1}`,
    state: 'inactive'
  };
}

function createMeridian(definition, index) {
  return {
    id: definition.meridianId,
    name: definition.meridianName,
    order: index + 1,
    state: 'inactive',
    flowCount: 0,
    nodes: [createPathNode(definition.meridianName, 0), createPathNode(definition.meridianName, 1), createPathNode(definition.meridianName, 2)]
  };
}

function createMeridianSystem() {
  const meridians = MERIDIAN_GROUPS.map(createMeridian);
  let activeIndex = -1;

  function getCurrent() {
    return activeIndex >= 0 ? meridians[activeIndex] : null;
  }

  function flowNext(payload = {}) {
    if (activeIndex >= 0) {
      const previous = meridians[activeIndex];
      previous.state = 'active';
      previous.nodes.forEach((node) => {
        node.state = 'active';
      });
    }

    activeIndex = (activeIndex + 1) % meridians.length;
    const current = meridians[activeIndex];
    current.state = 'flowing';
    current.flowCount += 1;
    current.nodes.forEach((node, idx) => {
      node.state = idx < 2 ? 'flowing' : 'inactive';
    });

    return getSnapshot(payload);
  }

  function getSnapshot(payload = {}) {
    const current = getCurrent();
    return {
      kind: 'meridian',
      activeMeridianId: current ? current.id : '',
      activeMeridianName: current ? current.name : '',
      activeMeridianState: current ? current.state : 'inactive',
      summary: current
        ? `当前经络：${current.name}，流动次数 ${current.flowCount}`
        : '经络待流动',
      meridians: clone(meridians),
      payload
    };
  }

  function reset() {
    activeIndex = -1;
    meridians.forEach((meridian) => {
      meridian.state = 'inactive';
      meridian.flowCount = 0;
      meridian.nodes.forEach((node) => {
        node.state = 'inactive';
      });
    });
  }

  return {
    flowNext,
    getSnapshot,
    reset
  };
}

module.exports = {
  MERIDIAN_GROUPS,
  createMeridianSystem
};

