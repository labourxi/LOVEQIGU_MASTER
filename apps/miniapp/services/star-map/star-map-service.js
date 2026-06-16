const starCatalog = require('../../data/star-map/star-catalog');
const relicAliasService = require('../relic-alias/relic-alias-service');

function getDefaultOwnedRelics() {
  return relicAliasService.getDefaultOwnedRelics();
}

function getLitAliasIds(ownedRelics) {
  return relicAliasService.getLitStarAliasIds(ownedRelics);
}

function decorateStar(star, litAliasIds, focusAliasId) {
  const lit = litAliasIds.has(star.alias_ref);
  return {
    id: star.id,
    name: star.name,
    alias_ref: star.alias_ref,
    lit,
    statusLabel: lit ? '已点亮' : '未发现',
    focused: Boolean(focusAliasId && star.alias_ref === focusAliasId)
  };
}

function decorateMansion(mansion, litAliasIds, focusAliasId) {
  const stars = mansion.stars.map((star) => decorateStar(star, litAliasIds, focusAliasId));
  const litCount = stars.filter((star) => star.lit).length;
  const total = stars.length;
  return {
    id: mansion.id,
    name: mansion.name,
    stars,
    lit: litCount,
    total,
    litRatio: `${litCount}/${total}`,
    progressPercent: total ? Math.round((litCount / total) * 100) : 0,
    focused: Boolean(focusAliasId && stars.some((star) => star.focused))
  };
}

function decorateSymbol(symbol, litAliasIds, focusAliasId) {
  const mansions = symbol.mansions.map((mansion) => decorateMansion(mansion, litAliasIds, focusAliasId));
  const lit = mansions.reduce((sum, mansion) => sum + mansion.lit, 0);
  const total = symbol.star_count;
  return {
    id: symbol.id,
    name: symbol.name,
    short_name: symbol.short_name,
    direction: symbol.direction,
    placeholder: Boolean(symbol.placeholder),
    mansions,
    lit,
    total,
    litRatio: `${lit}/${total}`,
    progressPercent: total ? Math.round((lit / total) * 100) : 0
  };
}

function getStarMapOverview(ownedRelics) {
  const resolvedOwned = ownedRelics || getDefaultOwnedRelics();
  const litAliasIds = getLitAliasIds(resolvedOwned);
  const symbols = starCatalog.symbols.map((symbol) => {
    const decorated = decorateSymbol(symbol, litAliasIds);
    return {
      id: decorated.id,
      name: decorated.name,
      short_name: decorated.short_name,
      direction: decorated.direction,
      placeholder: decorated.placeholder,
      lit: decorated.lit,
      total: decorated.total,
      litRatio: decorated.litRatio,
      progressPercent: decorated.progressPercent,
      mansionCount: decorated.mansions.length
    };
  });
  const lit = symbols.reduce((sum, symbol) => sum + symbol.lit, 0);
  const total = starCatalog.total_stars;
  return {
    title: '我的星图',
    subtitle: '天体系 · 四象二十八宿',
    total,
    lit,
    litDisplay: `${lit}/${total}`,
    progressPercent: total ? Math.round((lit / total) * 100) : 0,
    symbols
  };
}

function getSymbolList(ownedRelics) {
  return getStarMapOverview(ownedRelics).symbols;
}

function getSymbolDetail(symbolId, ownedRelics, focusAliasId) {
  const symbol = starCatalog.symbols.find((entry) => entry.id === symbolId);
  if (!symbol) {
    return null;
  }
  const resolvedOwned = ownedRelics || getDefaultOwnedRelics();
  const litAliasIds = getLitAliasIds(resolvedOwned);
  return decorateSymbol(symbol, litAliasIds, focusAliasId);
}

function getMansionDetail(mansionId, ownedRelics, focusAliasId) {
  const resolvedOwned = ownedRelics || getDefaultOwnedRelics();
  const litAliasIds = getLitAliasIds(resolvedOwned);
  for (let i = 0; i < starCatalog.symbols.length; i += 1) {
    const symbol = starCatalog.symbols[i];
    const mansion = symbol.mansions.find((entry) => entry.id === mansionId);
    if (mansion) {
      const decoratedMansion = decorateMansion(mansion, litAliasIds, focusAliasId);
      return {
        symbol: {
          id: symbol.id,
          name: symbol.name,
          short_name: symbol.short_name,
          placeholder: Boolean(symbol.placeholder)
        },
        mansion: decoratedMansion
      };
    }
  }
  return null;
}

function getStarByAliasId(aliasId, ownedRelics) {
  if (!aliasId) {
    return null;
  }
  const resolvedOwned = ownedRelics || getDefaultOwnedRelics();
  const litAliasIds = getLitAliasIds(resolvedOwned);
  for (let si = 0; si < starCatalog.symbols.length; si += 1) {
    const symbol = starCatalog.symbols[si];
    for (let mi = 0; mi < symbol.mansions.length; mi += 1) {
      const mansion = symbol.mansions[mi];
      const star = mansion.stars.find((entry) => entry.alias_ref === aliasId);
      if (star) {
        return {
          star: decorateStar(star, litAliasIds, aliasId),
          mansion: {
            id: mansion.id,
            name: mansion.name
          },
          symbol: {
            id: symbol.id,
            name: symbol.name,
            short_name: symbol.short_name,
            placeholder: Boolean(symbol.placeholder)
          },
          relicMapping: relicAliasService.getStarMappingByAliasId(aliasId)
        };
      }
    }
  }
  return null;
}

function getRelicStarMapping(relicId) {
  return relicAliasService.getStarMappingByRelicId(relicId);
}

function getLitStarsByOwnedRelics(ownedRelics) {
  const resolvedOwned = ownedRelics || getDefaultOwnedRelics();
  const litAliasIds = getLitAliasIds(resolvedOwned);
  const stars = [];
  starCatalog.symbols.forEach((symbol) => {
    symbol.mansions.forEach((mansion) => {
      mansion.stars.forEach((star) => {
        if (litAliasIds.has(star.alias_ref)) {
          stars.push({
            alias_id: star.alias_ref,
            star_name: star.name,
            mansion_id: mansion.id,
            mansion_name: mansion.name,
            symbol_id: symbol.id,
            symbol_name: symbol.name
          });
        }
      });
    });
  });
  return stars;
}

module.exports = {
  getStarMapOverview,
  getSymbolList,
  getSymbolDetail,
  getMansionDetail,
  getStarByAliasId,
  getRelicStarMapping,
  getLitStarsByOwnedRelics
};
