const { createStarSystem } = require('./star-system.js');
const { createMeridianSystem } = require('./meridian-system.js');

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function createWorldEngine(options = {}) {
  const eventBus = options.eventBus;
  if (!eventBus || typeof eventBus.on !== 'function' || typeof eventBus.emit !== 'function') {
    throw new Error('createWorldEngine requires a valid event bus');
  }

  const starSystem = createStarSystem();
  const meridianSystem = createMeridianSystem();
  const artifactHistory = [];
  const offList = [];
  let arState = 'IDLE';
  let lastSourceEvent = '';

  function pushArtifact(payload = {}) {
    const entry = {
      artifactId: `artifact-${artifactHistory.length + 1}`,
      artifactName: '宝物实体',
      type: '3d_model',
      trigger: 'relic_spawn',
      state: 'visible',
      payload
    };
    artifactHistory.unshift(entry);
    artifactHistory.splice(5);
  }

  function getArtifactSnapshot() {
    const latest = artifactHistory[0] || null;
    return {
      kind: 'artifact',
      latestArtifactId: latest ? latest.artifactId : '',
      latestArtifactName: latest ? latest.artifactName : '',
      latestTrigger: latest ? latest.trigger : '',
      history: clone(artifactHistory),
      summary: latest ? `最新宝物：${latest.artifactName}` : '宝物等待触发'
    };
  }

  function emitUpdate(reason, payload) {
    lastSourceEvent = reason;
    eventBus.emit('world:updated', getSnapshot(payload));
  }

  offList.push(eventBus.on('ar:detected', (payload) => {
    arState = 'DETECTED';
    lastSourceEvent = 'ar:detected';
  }));
  offList.push(eventBus.on('ar:active', (payload) => {
    arState = 'ACTIVE';
    lastSourceEvent = 'ar:active';
  }));
  offList.push(eventBus.on('ar:lost', (payload) => {
    arState = 'LOST';
    lastSourceEvent = 'ar:lost';
  }));
  offList.push(eventBus.on('star_light', (payload) => {
    starSystem.lightNext(payload);
    emitUpdate('star_light', payload);
  }));
  offList.push(eventBus.on('meridian_flow', (payload) => {
    meridianSystem.flowNext(payload);
    emitUpdate('meridian_flow', payload);
  }));
  offList.push(eventBus.on('relic_spawn', (payload) => {
    pushArtifact(payload);
    emitUpdate('relic_spawn', payload);
  }));

  function getSnapshot(payload = {}) {
    const star = starSystem.getSnapshot(payload);
    const meridian = meridianSystem.getSnapshot(payload);
    const artifact = getArtifactSnapshot();
    return {
      arState,
      lastSourceEvent,
      star,
      meridian,
      artifact,
      summary: `AR:${arState} | Star:${star.activeMansionName || 'none'} | Meridian:${meridian.activeMeridianName || 'none'} | Artifact:${artifact.latestArtifactName || 'none'}`
    };
  }

  function destroy() {
    offList.forEach((off) => {
      if (typeof off === 'function') {
        off();
      }
    });
    offList.length = 0;
  }

  return {
    getSnapshot,
    destroy
  };
}

module.exports = {
  createWorldEngine
};
