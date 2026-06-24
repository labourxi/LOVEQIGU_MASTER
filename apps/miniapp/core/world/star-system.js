const QUADRANTS = [
  { id: 'qinglong', name: 'Qinglong', mansions: ['jiao', 'kang', 'di', 'fang', 'xin', 'wei', 'ji'] },
  { id: 'zhuque', name: 'Zhuque', mansions: ['jing', 'gui', 'liu', 'xing', 'zhang', 'yi', 'zhen'] },
  { id: 'baihu', name: 'Baihu', mansions: ['kui', 'lou', 'wei', 'mao', 'bi', 'zi', 'shen'] },
  { id: 'xuanwu', name: 'Xuanwu', mansions: ['dou', 'niu', 'nv', 'xu', 'wei', 'shi', 'bi'] }
];

function createEmptyQuadrant(quadrant) {
  return {
    id: quadrant.id,
    name: quadrant.name,
    state: 'dim',
    mansions: []
  };
}

function createStarSystem() {
  const state = QUADRANTS.map(createEmptyQuadrant);
  let activeIndex = -1;
  let built = false;
  let building = null;
  const buildState = {
    quadrantIndex: 0,
    mansionIndex: 0,
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
      const chunkSize = 2;
      const yieldToNextFrame = builder && typeof builder.yieldToNextFrame === 'function'
        ? builder.yieldToNextFrame
        : () => Promise.resolve();
      for (let q = buildState.quadrantIndex; q < QUADRANTS.length; q += 1) {
        const quadrantDef = QUADRANTS[q];
        const quadrant = state[q];
        for (let m = buildState.mansionIndex; m < quadrantDef.mansions.length; m += 1) {
          if (!quadrant.mansions[m]) {
            quadrant.mansions[m] = {
              id: `${quadrantDef.id}_${m}`,
              name: quadrantDef.mansions[m],
              state: 'dim',
              nodes: []
            };
          }
          for (let n = buildState.nodeIndex; n < 3; n += 1) {
            if (!quadrant.mansions[m].nodes[n]) {
              quadrant.mansions[m].nodes[n] = {
                id: `${quadrantDef.id}_${m}_${n}`,
                state: 'dim'
              };
            }
            if ((n + 1) % chunkSize === 0) {
              await yieldToNextFrame();
            }
          }
          buildState.nodeIndex = 0;
          if ((m + 1) % chunkSize === 0) {
            await yieldToNextFrame();
          }
        }
        buildState.mansionIndex = 0;
        buildState.quadrantIndex = q + 1;
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

  function lightNext() {
    if (!built) {
      return getSnapshot();
    }
    activeIndex = (activeIndex + 1) % state.length;
    state.forEach((quadrant, qIndex) => {
      const quadrantState = qIndex < activeIndex ? 'complete' : qIndex === activeIndex ? 'active' : 'dim';
      quadrant.state = quadrantState;
      quadrant.mansions.forEach((mansion, mIndex) => {
        const mansionState = qIndex < activeIndex ? 'complete' : qIndex === activeIndex && mIndex === 0 ? 'active' : 'dim';
        mansion.state = mansionState;
        mansion.nodes.forEach((node, nIndex) => {
          node.state = qIndex < activeIndex ? 'complete' : qIndex === activeIndex && mIndex === 0 && nIndex === 0 ? 'active' : 'dim';
        });
      });
    });
    return getSnapshot();
  }

  function getSnapshot() {
    return {
      built,
      activeIndex,
      quadrants: state.map((quadrant) => ({
        id: quadrant.id,
        name: quadrant.name,
        state: quadrant.state,
        mansions: quadrant.mansions.map((mansion) => ({
          id: mansion.id,
          name: mansion.name,
          state: mansion.state,
          nodes: mansion.nodes.map((node) => ({ ...node }))
        }))
      }))
    };
  }

  return {
    buildAsync,
    lightNext,
    getSnapshot
  };
}

module.exports = {
  QUADRANTS,
  createStarSystem
};
