const pilotSceneFlow = require('../services/pilot/pilot-scene-flow');
const visualRegistry = require('../services/pilot/pilot-visual-registry');

module.exports = Behavior({
  data: {
    pilotSceneStage: '',
    pilotSceneHint: '',
    pilotSceneActive: false
  },

  methods: {
    initPilotSceneFromOptions(options) {
      const stage = pilotSceneFlow.parseStage(options || {});
      if (!stage) {
        this.setData({
          pilotSceneStage: '',
          pilotSceneHint: '',
          pilotSceneActive: false
        });
        return '';
      }
      this.setData({
        pilotSceneStage: stage,
        pilotSceneHint: pilotSceneFlow.getStageHint(stage),
        pilotSceneActive: true
      });
      return stage;
    },

    async runPilotStageEffect(stage, options) {
      const resolvedStage = stage || this.data.pilotSceneStage;
      if (!resolvedStage) {
        return false;
      }
      try {
        return await pilotSceneFlow.runStageEffect(this, resolvedStage, options);
      } catch (error) {
        console.error('[pilot-scene] effect failed', error);
        visualRegistry.safeToast('功能开发中');
        return false;
      }
    },

    appendPilotSceneUrl(url, stage) {
      return pilotSceneFlow.appendPilotQuery(url, stage || this.data.pilotSceneStage);
    },

    markPilotStageComplete(stage) {
      return pilotSceneFlow.markStageComplete(stage || this.data.pilotSceneStage);
    },

    showPilotCommercialComplete() {
      pilotSceneFlow.markPilotExperienceComplete();
      pilotSceneFlow.showCommercialCompleteToast();
    }
  }
});
