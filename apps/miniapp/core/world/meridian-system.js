const MERIDIANS = [
  'fei',
  'da_chang',
  'wei',
  'pi',
  'xin',
  'xiao_chang',
  'pang_guang',
  'shen',
  'xin_bao',
  'san_jiao',
  'dan',
  'gan'
];

function createEmptyMeridian(def, index) {
  return {
    id: `meridian_${index}`,
    name: def,
    state: 'inactive',
    nodes: []
  };
}

function createMeridianSystem() {
  const state = MERIDIANS.map(createEmptyMeridian);
  let activeIndex = -1;
  let built = false;
  let building = null;
  const buildState = {
    meridianIndex: 0,
    nodeIndex: 0
  };

  function buildAsync(builder) {
    if (built) {
      return Promise.resolve(getSnapshot());
    }
    if (building) {
      return building;
    }

    const run = async () => {
      const yieldToNextFrame = builder && typeof builder.yieldToNextFrame === 'function'
        ? builder.yieldToNextFrame
        : () => Promise.resolve();
      for (let i = buildState.meridianIndex; i < MERIDIANS.length; i += 1) {
        const meridian = state[i];
        if (!meridian.nodes.length) {
          meridian.nodes = [];
        }
        for (let n = buildState.nodeIndex; n < 5; n += 1) {
          if (!meridian.nodes[n]) {
            meridian.nodes[n] = {
              id: `meridian_${i}_${n}`,
              name: `${MERIDIANS[i]}_${n + 1}`,
              state: 'inactive'
            };
          }
          if ((n + 1) % 2 === 0) {
            await yieldToNextFrame();
          }
        }
        buildState.nodeIndex = 0;
        buildState.meridianIndex = i + 1;
        await yieldToNextFrame();
      }
      built = true;
      return getSnapshot();
    };

    building = Promise.resolve()
      .then(run)
      .then((result) => {
        building = null;
        return result;
      })
      .catch((error) => {
        building = null;
        throw error;
      });

    return building;
  }

  function flowNext() {
    if (!built) {
      return getSnapshot();
    }
    activeIndex = (activeIndex + 1) % state.length;
    state.forEach((meridian, index) => {
      const meridianState = index < activeIndex ? 'active' : index === activeIndex ? 'flowing' : 'inactive';
      meridian.state = meridianState;
      meridian.nodes.forEach((node, nodeIndex) => {
        node.state = index < activeIndex ? 'active' : index === activeIndex && nodeIndex === 0 ? 'flowing' : 'inactive';
      });
    });
    return getSnapshot();
  }

  function getSnapshot() {
    return {
      built,
      activeIndex,
      meridians: state.map((meridian) => ({
        id: meridian.id,
        name: meridian.name,
        state: meridian.state,
        nodes: meridian.nodes.map((node) => ({ ...node }))
      }))
    };
  }

  return {
    buildAsync,
    flowNext,
    getSnapshot
  };
}

module.exports = {
  MERIDIANS,
  createMeridianSystem
};
