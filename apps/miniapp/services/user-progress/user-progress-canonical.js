const { patchProgress } = require('./user-progress-store');

function markNodeExplored(chapterId, nodeId) {
  if (!chapterId || !nodeId) {
    return null;
  }
  return patchProgress((progress) => {
    if (progress.canon.explored_chapter_ids.indexOf(chapterId) === -1) {
      progress.canon.explored_chapter_ids.push(chapterId);
    }
    const compositeId = `${chapterId}:${nodeId}`;
    if (progress.canon.explored_node_ids.indexOf(compositeId) === -1) {
      progress.canon.explored_node_ids.push(compositeId);
    }
    return progress;
  });
}

function completeStoryFlow(flowId) {
  if (!flowId) {
    return null;
  }
  return patchProgress((progress) => {
    if (progress.canon.completed_story_flow_ids.indexOf(flowId) === -1) {
      progress.canon.completed_story_flow_ids.push(flowId);
    }
    return progress;
  });
}

function recordRelic(relicId) {
  if (!relicId) {
    return null;
  }
  return patchProgress((progress) => {
    if (progress.canon.recorded_relic_ids.indexOf(relicId) === -1) {
      progress.canon.recorded_relic_ids.push(relicId);
    }
    return progress;
  });
}

function addSynthesis(record) {
  if (!record || typeof record !== 'object') {
    return null;
  }
  return patchProgress((progress) => {
    const rewardId = record.reward_id || record.id;
    if (!rewardId) {
      return progress;
    }
    if (progress.canon.synthesis.synthesized_ids.indexOf(rewardId) === -1) {
      progress.canon.synthesis.synthesized_ids.push(rewardId);
    }
    progress.canon.synthesis.records.push({ ...record });
    return progress;
  });
}

module.exports = {
  markNodeExplored,
  completeStoryFlow,
  recordRelic,
  addSynthesis
};

