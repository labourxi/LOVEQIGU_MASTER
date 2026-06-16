const meridianCatalog = require('../../data/meridian-map/meridian-catalog');
const relicAliasService = require('../relic-alias/relic-alias-service');

function getDefaultOwnedRelics() {
  return relicAliasService.getDefaultOwnedRelics();
}

function getLitPointIds(ownedRelics) {
  return relicAliasService.getLitPointIds(ownedRelics);
}

function decoratePoint(point, litPointIds, focusPointId) {
  const lit = litPointIds.has(point.id);
  return {
    id: point.id,
    name: point.name,
    lit,
    statusLabel: lit ? '已点亮' : '未发现',
    focused: Boolean(focusPointId && point.id === focusPointId)
  };
}

function decorateMeridian(meridian, litPointIds, focusPointId) {
  const points = meridian.points.map((point) => decoratePoint(point, litPointIds, focusPointId));
  const litCount = points.filter((point) => point.lit).length;
  const total = points.length;
  const completed = total > 0 && litCount === total;
  return {
    id: meridian.id,
    name: meridian.name,
    short_name: meridian.short_name,
    category: meridian.category,
    placeholder: Boolean(meridian.placeholder),
    points,
    lit: litCount,
    total,
    litRatio: `${litCount}/${total}`,
    progressPercent: total ? Math.round((litCount / total) * 100) : 0,
    completed,
    focused: Boolean(focusPointId && points.some((point) => point.focused))
  };
}

function summarizeMeridian(meridian, litPointIds) {
  const decorated = decorateMeridian(meridian, litPointIds);
  return {
    id: decorated.id,
    name: decorated.name,
    short_name: decorated.short_name,
    category: decorated.category,
    placeholder: decorated.placeholder,
    lit: decorated.lit,
    total: decorated.total,
    litRatio: decorated.litRatio,
    progressPercent: decorated.progressPercent,
    completed: decorated.completed
  };
}

function getMeridianOverview(ownedRelics) {
  const resolvedOwned = ownedRelics || getDefaultOwnedRelics();
  const litPointIds = getLitPointIds(resolvedOwned);
  const regularMeridians = meridianCatalog.regular_meridians.map((meridian) =>
    summarizeMeridian(meridian, litPointIds)
  );
  const extraordinaryVessels = meridianCatalog.extraordinary_vessels.map((meridian) =>
    summarizeMeridian(meridian, litPointIds)
  );
  const allSummaries = regularMeridians.concat(extraordinaryVessels);
  const lit = allSummaries.reduce((sum, meridian) => sum + meridian.lit, 0);
  const total = meridianCatalog.total_points;
  const completedMeridians = allSummaries.filter((meridian) => meridian.completed).length;
  const meridianCount = meridianCatalog.meridian_count;

  return {
    title: '我的经络图',
    subtitle: '人体系 · 十二正经与奇经八脉',
    total,
    lit,
    litDisplay: `${lit}/${total}`,
    progressPercent: total ? Math.round((lit / total) * 100) : 0,
    meridianCount,
    completedMeridians,
    completedDisplay: `${completedMeridians}/${meridianCount}`,
    regularMeridians,
    extraordinaryVessels
  };
}

function getMeridianList(ownedRelics) {
  return getMeridianOverview(ownedRelics).regularMeridians.concat(
    getMeridianOverview(ownedRelics).extraordinaryVessels
  );
}

function getMeridianDetail(meridianId, ownedRelics, focusPointId) {
  const meridian = meridianCatalog.meridians.find((entry) => entry.id === meridianId);
  if (!meridian) {
    return null;
  }
  const resolvedOwned = ownedRelics || getDefaultOwnedRelics();
  const litPointIds = getLitPointIds(resolvedOwned);
  return decorateMeridian(meridian, litPointIds, focusPointId);
}

function getPointById(pointId, ownedRelics) {
  if (!pointId) {
    return null;
  }
  const resolvedOwned = ownedRelics || getDefaultOwnedRelics();
  const litPointIds = getLitPointIds(resolvedOwned);
  for (let i = 0; i < meridianCatalog.meridians.length; i += 1) {
    const meridian = meridianCatalog.meridians[i];
    const point = meridian.points.find((entry) => entry.id === pointId);
    if (point) {
      return {
        point: decoratePoint(point, litPointIds, pointId),
        meridian: {
          id: meridian.id,
          name: meridian.name,
          short_name: meridian.short_name,
          category: meridian.category,
          placeholder: Boolean(meridian.placeholder)
        },
        relicMapping: relicAliasService.getMeridianMappingByPointId(pointId)
      };
    }
  }
  return null;
}

function getRelicMeridianMapping(relicId) {
  return relicAliasService.getMeridianMappingByRelicId(relicId);
}

function getLitPointsByOwnedRelics(ownedRelics) {
  const resolvedOwned = ownedRelics || getDefaultOwnedRelics();
  const litPointIds = getLitPointIds(resolvedOwned);
  const points = [];
  meridianCatalog.meridians.forEach((meridian) => {
    meridian.points.forEach((point) => {
      if (litPointIds.has(point.id)) {
        points.push({
          point_id: point.id,
          point_name: point.name,
          meridian_id: meridian.id,
          meridian_name: meridian.name
        });
      }
    });
  });
  return points;
}

module.exports = {
  getMeridianOverview,
  getMeridianList,
  getMeridianDetail,
  getPointById,
  getRelicMeridianMapping,
  getLitPointsByOwnedRelics
};
