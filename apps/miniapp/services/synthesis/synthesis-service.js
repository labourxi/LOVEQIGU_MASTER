const starSynthesisRules = require('../../data/synthesis/star-synthesis-rules');
const symbolSynthesisRules = require('../../data/synthesis/symbol-synthesis-rules');
const heavenSealRules = require('../../data/synthesis/heaven-seal-rules');
const meridianSynthesisRules = require('../../data/synthesis/meridian-synthesis-rules');
const humanSealRules = require('../../data/synthesis/human-seal-rules');
const starMapService = require('../star-map/star-map-service');
const meridianMapService = require('../meridian-map/meridian-map-service');
const synthesisStorage = require('./synthesis-storage');

const REWARD_TYPE_LABELS = {
  cultural_experience: '东方文化体验资格',
  physical_relic: '实体信物资格',
  certificate: '高阶体验资格'
};

function buildRecipeIndex() {
  const recipes = [];
  starSynthesisRules.mansion_rules.forEach((rule) => {
    recipes.push({ ...rule, kind: 'mansion' });
  });
  symbolSynthesisRules.symbol_rules.forEach((rule) => {
    recipes.push({ ...rule, kind: 'symbol' });
  });
  recipes.push({ ...heavenSealRules.heaven_rule, kind: 'heaven' });
  meridianSynthesisRules.meridian_rules.forEach((rule) => {
    recipes.push({ ...rule, kind: 'meridian' });
  });
  recipes.push({ ...humanSealRules.human_rule, kind: 'human' });
  return recipes;
}

const RECIPES = buildRecipeIndex();
const RECIPE_BY_ID = {};
RECIPES.forEach((recipe) => {
  RECIPE_BY_ID[recipe.id] = recipe;
});

function getLitStarIds() {
  const litStars = starMapService.getLitStarsByOwnedRelics();
  return new Set(litStars.map((item) => item.alias_id));
}

function getLitPointIds() {
  const litPoints = meridianMapService.getLitPointsByOwnedRelics();
  return new Set(litPoints.map((item) => item.point_id));
}

function evaluateRecipe(recipe) {
  const rewardId = recipe.reward_relic.id;
  const alreadyDone = synthesisStorage.hasSynthesized(rewardId);
  if (alreadyDone) {
    return {
      ready: false,
      done: true,
      statusLabel: '已合成',
      missing: []
    };
  }

  const missing = [];
  if (recipe.kind === 'mansion') {
    const litStars = getLitStarIds();
    recipe.required_stars.forEach((starId, index) => {
      if (!litStars.has(starId)) {
        missing.push({
          type: 'star',
          id: starId,
          name: recipe.required_star_names[index] || starId
        });
      }
    });
  } else if (recipe.kind === 'symbol') {
    recipe.required_mansion_seals.forEach((sealId, index) => {
      if (!synthesisStorage.hasSynthesized(sealId)) {
        missing.push({
          type: 'mansion_seal',
          id: sealId,
          name: recipe.required_mansion_names[index] || sealId
        });
      }
    });
  } else if (recipe.kind === 'heaven') {
    recipe.required_symbol_seals.forEach((sealId, index) => {
      if (!synthesisStorage.hasSynthesized(sealId)) {
        missing.push({
          type: 'symbol_seal',
          id: sealId,
          name: recipe.required_symbol_names[index] || sealId
        });
      }
    });
  } else if (recipe.kind === 'meridian') {
    const litPoints = getLitPointIds();
    recipe.required_points.forEach((pointId, index) => {
      if (!litPoints.has(pointId)) {
        missing.push({
          type: 'point',
          id: pointId,
          name: recipe.required_point_names[index] || pointId
        });
      }
    });
  } else if (recipe.kind === 'human') {
    recipe.required_meridian_seals.forEach((sealId, index) => {
      if (!synthesisStorage.hasSynthesized(sealId)) {
        missing.push({
          type: 'meridian_seal',
          id: sealId,
          name: recipe.required_meridian_names[index] || sealId
        });
      }
    });
  }

  const ready = missing.length === 0;
  return {
    ready,
    done: false,
    statusLabel: ready ? '已满足' : '未满足',
    missing
  };
}

function mapRecipeToSynthesis(recipe) {
  const evaluation = evaluateRecipe(recipe);
  const requirements = [];

  if (recipe.kind === 'mansion') {
    recipe.required_star_names.forEach((name) => {
      requirements.push({ name, type: 'star' });
    });
  } else if (recipe.kind === 'symbol') {
    recipe.required_mansion_names.forEach((name) => {
      requirements.push({ name, type: 'mansion_seal' });
    });
  } else if (recipe.kind === 'heaven') {
    recipe.required_symbol_names.forEach((name) => {
      requirements.push({ name, type: 'symbol_seal' });
    });
  } else if (recipe.kind === 'meridian') {
    recipe.required_point_names.forEach((name) => {
      requirements.push({ name, type: 'point' });
    });
  } else if (recipe.kind === 'human') {
    recipe.required_meridian_names.forEach((name) => {
      requirements.push({ name, type: 'meridian_seal' });
    });
  }

  return {
    id: recipe.id,
    kind: recipe.kind,
    title: recipe.reward_relic.name,
    reward: {
      ...recipe.reward_relic,
      reward_type_label: REWARD_TYPE_LABELS[recipe.reward_relic.reward_type] || recipe.reward_relic.reward_desc
    },
    requirements,
    requirementLabels: requirements.map((item) => item.name),
    ready: evaluation.ready,
    done: evaluation.done,
    statusLabel: evaluation.statusLabel,
    missing: evaluation.missing,
    canPerform: evaluation.ready && !evaluation.done
  };
}

function getAvailableSyntheses() {
  return RECIPES.map(mapRecipeToSynthesis);
}

function canSynthesize(id) {
  const recipe = RECIPE_BY_ID[id];
  if (!recipe) {
    return false;
  }
  const evaluation = evaluateRecipe(recipe);
  return evaluation.ready && !evaluation.done;
}

function performSynthesis(id) {
  const recipe = RECIPE_BY_ID[id];
  if (!recipe || !canSynthesize(id)) {
    return {
      ok: false,
      message: '暂不满足合成条件'
    };
  }

  synthesisStorage.addSynthesis({
    reward_id: recipe.reward_relic.id,
    reward_name: recipe.reward_relic.name,
    reward_type: recipe.reward_relic.reward_type,
    recipe_id: recipe.id
  });

  return {
    ok: true,
    message: `已获得${recipe.reward_relic.name}`,
    reward: recipe.reward_relic
  };
}

function getHeavenSealProgress() {
  const symbolRules = symbolSynthesisRules.symbol_rules;
  const symbolProgress = symbolRules.map((rule) => {
    const total = rule.required_mansion_seals.length;
    const done = rule.required_mansion_seals.filter((sealId) => synthesisStorage.hasSynthesized(sealId)).length;
    const symbolSealDone = synthesisStorage.hasSynthesized(rule.reward_relic.id);
    return {
      id: rule.symbol_id,
      name: `${rule.symbol_short_name}印`,
      done,
      total,
      display: `${done}/${total}`,
      symbolSealDone,
      symbolSealLabel: symbolSealDone ? '已合成' : '未合成'
    };
  });

  const heavenDone = synthesisStorage.hasSynthesized(heavenSealRules.heaven_rule.reward_relic.id) ? 1 : 0;

  return {
    symbolProgress,
    heavenSeal: {
      id: 'heaven',
      name: '天印',
      done: heavenDone,
      total: 1,
      display: `${heavenDone}/1`,
      statusLabel: heavenDone ? '已合成' : '未合成'
    }
  };
}

function getHumanSealProgress() {
  const meridianRules = meridianSynthesisRules.meridian_rules;
  const regular = [];
  const extraordinary = [];

  meridianRules.forEach((rule) => {
    const done = synthesisStorage.hasSynthesized(rule.reward_relic.id) ? 1 : 0;
    const item = {
      id: rule.meridian_id,
      name: rule.reward_relic.name,
      fullName: rule.meridian_name,
      category: rule.category,
      done,
      total: 1,
      display: `${done}/1`,
      statusLabel: done ? '已合成' : '未合成'
    };
    if (rule.category === 'extraordinary') {
      extraordinary.push(item);
    } else {
      regular.push(item);
    }
  });

  const humanDone = synthesisStorage.hasSynthesized(humanSealRules.human_rule.reward_relic.id) ? 1 : 0;

  return {
    regularMeridians: regular,
    extraordinaryVessels: extraordinary,
    humanSeal: {
      id: 'human',
      name: '人印',
      done: humanDone,
      total: 1,
      display: `${humanDone}/1`,
      statusLabel: humanDone ? '已合成' : '未合成'
    }
  };
}

module.exports = {
  getAvailableSyntheses,
  canSynthesize,
  performSynthesis,
  getHeavenSealProgress,
  getHumanSealProgress,
  REWARD_TYPE_LABELS
};
