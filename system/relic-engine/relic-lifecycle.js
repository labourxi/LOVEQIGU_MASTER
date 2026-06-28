/**
 * triggerRelic — Single function.
 * Input:  sceneId string
 * Output: mock relic object ready for UI render
 */

var _counter = 0;

function triggerRelic(sceneId) {
  _counter++;
  var now = Date.now();
  return {
    relic_id: 'relic_' + now + '_' + _counter,
    relic_name: '节点印记 · ' + (sceneId ? sceneId.slice(0, 6) : '未名'),
    material: 'jade',
    originNode: sceneId || 'unknown',
    dropReason: '探索节点完成，印记在此处显现',
    visualSeed: {
      aura: { color: 'rgba(200,162,74,0.15)', particle: '金色颗粒', intensity: 0.6 },
      entity: { baseColor: '#C8A24A', shape: 'circle', borderGlow: 'rgba(200,162,74,0.3)' },
      symbol: { char: '启', color: '#0F2A22', animation: 'relic-symbol-reveal' },
      revealSequence: { t0_particle: 200, t1_glow: 600, t2_entity: 1000, t3_symbol: 1400 }
    },
    state: 'triggered',
    generatedAt: now
  };
}

module.exports = { triggerRelic: triggerRelic };
