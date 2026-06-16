const relicStarAliasMap = require('../../data/relic-alias/relic-star-alias-map');
const relicMeridianAliasMap = require('../../data/relic-alias/relic-meridian-alias-map');
const chapterRegistry = require('../chapter/chapter-runtime-registry');

const starByRelicId = {};
const meridianByRelicId = {};
const starByAliasId = {};
const pointById = {};

relicStarAliasMap.mappings.forEach((entry) => {
  starByRelicId[entry.relic_id] = entry;
  starByAliasId[entry.star_alias_id] = entry;
});

relicMeridianAliasMap.mappings.forEach((entry) => {
  meridianByRelicId[entry.relic_id] = entry;
  pointById[entry.point_id] = entry;
});

const OWNED_STATUSES = new Set(['recorded', 'active', 'placeholder']);

function resolveRelic(relicRef) {
  if (!relicRef) {
    return null;
  }
  if (typeof relicRef === 'string') {
    return chapterRegistry.getRelicById(relicRef);
  }
  return relicRef;
}

function isRelicOwnedForProgress(relicRef) {
  const relic = resolveRelic(relicRef);
  if (!relic) {
    return false;
  }
  return OWNED_STATUSES.has(relic.status);
}

function getDefaultOwnedRelics() {
  return chapterRegistry.getAllRelics().filter((relic) => isRelicOwnedForProgress(relic));
}

function getStarMappingByRelicId(relicId) {
  if (!relicId) {
    return null;
  }
  return starByRelicId[relicId] || null;
}

function getMeridianMappingByRelicId(relicId) {
  if (!relicId) {
    return null;
  }
  return meridianByRelicId[relicId] || null;
}

function getStarMappingByAliasId(aliasId) {
  if (!aliasId) {
    return null;
  }
  return starByAliasId[aliasId] || null;
}

function getMeridianMappingByPointId(pointId) {
  if (!pointId) {
    return null;
  }
  return pointById[pointId] || null;
}

function enrichRelic(relic) {
  if (!relic) {
    return null;
  }
  const starMapping = getStarMappingByRelicId(relic.id);
  const meridianMapping = getMeridianMappingByRelicId(relic.id);
  return {
    ...relic,
    star_alias_id: starMapping ? starMapping.star_alias_id : '',
    star_alias_name: starMapping ? starMapping.star_alias_name : '',
    point_alias_id: meridianMapping ? meridianMapping.point_id : '',
    point_alias_name: meridianMapping ? meridianMapping.point_name : ''
  };
}

function getLitStarAliasIds(ownedRelics) {
  const lit = new Set();
  (ownedRelics || []).forEach((ref) => {
    if (!isRelicOwnedForProgress(ref)) {
      return;
    }
    const relicId = typeof ref === 'string' ? ref : ref.id;
    const mapping = getStarMappingByRelicId(relicId);
    if (mapping) {
      lit.add(mapping.star_alias_id);
    }
  });
  return lit;
}

function getLitPointIds(ownedRelics) {
  const lit = new Set();
  (ownedRelics || []).forEach((ref) => {
    if (!isRelicOwnedForProgress(ref)) {
      return;
    }
    const relicId = typeof ref === 'string' ? ref : ref.id;
    const mapping = getMeridianMappingByRelicId(relicId);
    if (mapping) {
      lit.add(mapping.point_id);
    }
  });
  return lit;
}

function getMappingStats() {
  const relics = chapterRegistry.getAllRelics();
  const mappedStar = relics.filter((relic) => getStarMappingByRelicId(relic.id)).length;
  const mappedPoint = relics.filter((relic) => getMeridianMappingByRelicId(relic.id)).length;
  return {
    relicTotal: relics.length,
    starMappedCount: mappedStar,
    pointMappedCount: mappedPoint,
    starMapComplete: mappedStar === relics.length,
    pointMapComplete: mappedPoint === relics.length
  };
}

module.exports = {
  isRelicOwnedForProgress,
  getDefaultOwnedRelics,
  getStarMappingByRelicId,
  getMeridianMappingByRelicId,
  getStarMappingByAliasId,
  getMeridianMappingByPointId,
  enrichRelic,
  getLitStarAliasIds,
  getLitPointIds,
  getMappingStats,
  starMappings: relicStarAliasMap.mappings,
  meridianMappings: relicMeridianAliasMap.mappings
};
