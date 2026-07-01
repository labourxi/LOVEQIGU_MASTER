// ═════════════════════════════════════════════════════════════════════
// CONTENT WORLD INJECTION PIPELINE
//
// Central injector that enriches all page data with narrative content.
// Loads world seed data and applies it to raw page data.
//
// Each page type has its own injector function that merges narrative
// fields into the page's render tree.
//
// RULE: No system language. Every output field uses mythic/narrative tone.
// ═════════════════════════════════════════════════════════════════════

var EXPLORE_WORLD = require('./explore_world_seed');
var COLLECTION_WORLD = require('./collection_world_seed');
var RIGHTS_WORLD = require('./rights_world_seed');
var MY_WORLD = require('./my_world_seed');

// ─── TOP-LEVEL INJECTOR ───
// Entry point: enrich page data with world content.
// page: 'explore' | 'collection' | 'rights' | 'my'
// rawData: the page's render tree object from buildPageData / buildXxxRenderTree
// Returns: enriched data object with narrative fields added.
function injectWorldContent(page, rawData) {
  if (!rawData || typeof rawData !== 'object') return rawData || {};
  if (!rawData.hasOwnProperty) return rawData;

  switch (page) {
    case 'explore':
      return injectExploreContent(rawData);
    case 'collection':
      return injectCollectionContent(rawData);
    case 'rights':
      return injectRightsContent(rawData);
    case 'my':
      return injectMyContent(rawData);
    default:
      return rawData;
  }
}

// ─── EXPLORE PAGE INJECTOR ───
function injectExploreContent(data) {
  // Deep copy to avoid mutating source
  var result = JSON.parse(JSON.stringify(data));

  // Enrich world state
  if (result.scenicLayers && result.scenicLayers.worldState) {
    var ws = result.scenicLayers.worldState;
    ws.atmosphere = pickNarrative(EXPLORE_WORLD.worldState.atmosphereList);
    ws.worldHint = pickNarrative(EXPLORE_WORLD.worldState.hintList);
    ws.userRole = pickNarrative(EXPLORE_WORLD.worldState.roleList);
  }

  // Enrich each rhythm item with narrative fields
  if (result.scenicLayers && result.scenicLayers.rhythmItems) {
    result.scenicLayers.rhythmItems = result.scenicLayers.rhythmItems.map(function(item) {
      var narrative = getExploreNodeNarrative(item.point_id);
      if (narrative) {
        item.storyFragment = narrative.storyFragment;
        item.symbolicMeaning = narrative.symbolicMeaning;
        item.visualHint = narrative.visualHint;
        item.arTriggerDescription = narrative.arTriggerDescription;
        item.emotionalNarrative = narrative.emotionalNarrative;
      }

      // Enrich phenomenon / emotion
      var enrichment = EXPLORE_WORLD.phenomenonEnrichments[item.point_id];
      if (enrichment) {
        item.phenomenon = enrichment.phenomenon;
        item.emotion = enrichment.emotion;
      }

      return item;
    });

    // Also enrich heroItem and secondaryItems
    if (result.scenicLayers.heroItem) {
      var heroNarrative = getExploreNodeNarrative(result.scenicLayers.heroItem.point_id);
      if (heroNarrative) {
        result.scenicLayers.heroItem.storyFragment = heroNarrative.storyFragment;
        result.scenicLayers.heroItem.emotionalNarrative = heroNarrative.emotionalNarrative;
      }
    }
    if (result.scenicLayers.secondaryItems) {
      result.scenicLayers.secondaryItems = result.scenicLayers.secondaryItems.map(function(item) {
        var n = getExploreNodeNarrative(item.point_id);
        if (n) {
          item.storyFragment = n.storyFragment;
          item.emotionalNarrative = n.emotionalNarrative;
        }
        return item;
      });
    }
    if (result.scenicLayers.contextItems) {
      result.scenicLayers.contextItems = result.scenicLayers.contextItems.map(function(item) {
        var n = getExploreNodeNarrative(item.point_id);
        if (n) {
          item.storyFragment = n.storyFragment;
          item.emotionalNarrative = n.emotionalNarrative;
        }
        return item;
      });
    }
  }

  // Enrich event summary
  if (result.eventSummary) {
    result.eventSummary.narrativeTitle = '世界正在回应你的脚步';
  }

  // Enrich network murmur
  if (result.showNetworkMurmur && !result.networkMurmur) {
    result.networkMurmur = pickNarrative(EXPLORE_WORLD.networkMurmurs);
  } else if (result.networkMurmur) {
    // Add a narrative layer
    result.networkMurmur = pickNarrative(EXPLORE_WORLD.networkMurmurs);
  }

  // V5.9.16 store data stays intact
  // But we add narrative progress descriptors
  result._narrativeProgress = getExploreProgressNarrative(
    result._storeVisitedCount || 0,
    result._storeTotalCount || 0
  );

  // World narrative flags
  result._worldContentReady = true;

  return result;
}

// ─── COLLECTION PAGE INJECTOR ═══ CANONICAL PAGE_06/07A/07B/07C ───
// Adapted for canonical sub-view structure with relicNodes.
// relic, echo, collectible are NEVER enriched in the same pass.
function injectCollectionContent(data) {
  var result = JSON.parse(JSON.stringify(data));

  // Replace page titles from seed
  result.narrativeTitle = COLLECTION_WORLD.pageNarratives.title;
  result.narrativeSubtitle = COLLECTION_WORLD.pageNarratives.subtitle;

  // ─── CANONICAL PAGE_06: Enrich relic nodes (1-line narrative meaning) ───
  if (result.relicNodes && result.relicNodes.length) {
    result.relicNodes = result.relicNodes.map(function(item) {
      var narrative = COLLECTION_WORLD.relics[item.id];
      if (narrative) {
        // RELIC_CONTENT_DENSITY_RULE_V1: 1-line description only
        // Use symbolicMeaning as the primary narrative description
        item.description = narrative.symbolicMeaning || item.description;
        // Echo = 1 sentence philosophical response
        item.echoText = narrative.emotionalNarrative || item.echoText;
        // Store origin story for detail view
        item.originStory = narrative.originStory || '';
        item.awakenReason = narrative.awakenReason || '';
        item.poemFragment = narrative.poemFragment || '';
      } else {
        item.description = '一段被找回的连接';
        item.echoText = '尚未被触碰的回响';
      }
      return item;
    });
  }

  // ─── PAGE_07A/PAGE_07B: Enrich star/acupoint meanings ───
  // Lodge groups
  if (result.lodgeGroups && result.lodgeGroups.length) {
    result.lodgeGroups = result.lodgeGroups.map(function(group) {
      if (group.stars && group.stars.length) {
        group.stars = group.stars.map(function(star) {
          var narrative = COLLECTION_WORLD.relics[star.id];
          if (narrative) {
            star.meaning = narrative.symbolicMeaning || star.meaning || '星官';
          }
          return star;
        });
      }
      return group;
    });
  }
  // Meridian groups
  if (result.meridianGroups && result.meridianGroups.length) {
    result.meridianGroups = result.meridianGroups.map(function(group) {
      if (group.points && group.points.length) {
        group.points = group.points.map(function(point) {
          var narrative = COLLECTION_WORLD.relics[point.id];
          if (narrative) {
            point.meaning = narrative.symbolicMeaning || point.meaning || '穴位';
          }
          return point;
        });
      }
      return group;
    });
  }

  // ─── CANONICAL: Replace empty state texts ───
  if (result.emptyRelic) {
    result.emptyRelic = COLLECTION_WORLD.pageNarratives.relic.empty;
  }
  result._emptyRelicHint = COLLECTION_WORLD.pageNarratives.relic.emptyHint;

  result._worldContentReady = true;

  return result;
}

// ─── RIGHTS PAGE INJECTOR ───
function injectRightsContent(data) {
  var result = JSON.parse(JSON.stringify(data));

  // Page narratives
  result.narrativeTitle = RIGHTS_WORLD.pageNarratives.title;
  result.narrativeSubtitle = RIGHTS_WORLD.pageNarratives.subtitle;
  result.narrativeKicker = RIGHTS_WORLD.pageNarratives.kicker;

  // Points card enrichment
  if (result.pointsCard) {
    var points = result.pointsCard.currentPoints || 0;
    result.pointsCard.narrativeTitle = RIGHTS_WORLD.points.cardTitle;
    result.pointsCard.narrativeSubtitle = RIGHTS_WORLD.points.cardSubtitle;
    result.pointsCard.narrativeInterpretation = RIGHTS_WORLD.points.narrativeInterpretation(
      points,
      result.pointsCard.todayEarned || 0,
      result.pointsCard.totalEarned || 0
    );
    result.pointsCard.narrativeTodayLabel = RIGHTS_WORLD.points.todayEarned;
    result.pointsCard.narrativeTotalLabel = RIGHTS_WORLD.points.totalEarned;
    result.pointsCard.narrativeProgressLabel = RIGHTS_WORLD.points.progressLabel;
  }

  // Enrich sections
  if (result.sections && result.sections.length) {
    result.sections = result.sections.map(function(section) {
      if (section.items && section.items.length) {
        section.items = section.items.map(function(item) {
          return enrichRightsItem(item);
        });
      }
      return section;
    });
  }

  // Enrich reward feed
  if (result.rewardFeed && result.rewardFeed.length) {
    result.rewardFeed = result.rewardFeed.map(function(entry) {
      var label = getFeedNarrativeLabel(entry.type);
      if (label) {
        entry.narrativeType = label;
      }
      return entry;
    });
  }

  // Enrich reward history labels
  if (result.rewardHistory && result.rewardHistory.length) {
    result.rewardHistory = result.rewardHistory.map(function(entry) {
      var label = getHistoryNarrativeLabel(entry.label);
      if (label) {
        entry.narrativeLabel = label;
      }
      return entry;
    });
  }

  // Empty state
  if (result.emptyState) {
    result.emptyState.narrativeMessage = RIGHTS_WORLD.emptyState.message;
    result.emptyState.narrativeSubmessage = RIGHTS_WORLD.emptyState.submessage;
    result.emptyState.narrativeHint = RIGHTS_WORLD.emptyState.emptyHint;
  }

  result._worldContentReady = true;

  return result;
}

// ─── MY PAGE INJECTOR ───
function injectMyContent(data) {
  var result = JSON.parse(JSON.stringify(data));

  // Stat interpretations
  if (result.stats) {
    var s = result.stats;
    var visited = s.exploredPoints || 0;
    var totalPoints = s.totalPoints || 0;
    var relicCount = s.relicCount || 0;
    var totalRelics = s.relics || 0; // note: "relics" is the legacy alias for totalRelics
    var collectibleCount = s.collectibles || 0;

    result.stats._narrativeProgress = MY_WORLD.statNarratives.exploreProgress(visited, totalPoints);
    result.stats._narrativeRelic = MY_WORLD.statNarratives.relicInterpretation(relicCount, totalRelics > 0 ? totalRelics : relicCount);
    result.stats._narrativePoints = MY_WORLD.statNarratives.pointsInterpretation(result.stats.points || 0);
    result.stats._narrativeCollectibles = MY_WORLD.statNarratives.collectibleInterpretation(collectibleCount);
    result.stats._level = MY_WORLD.statNarratives.levelNarrative(visited);
  }

  // Profile enrichment
  if (result.userProfile) {
    var visitedCount = (result.stats && result.stats.exploredPoints) || 0;
    var relicCount = (result.stats && result.stats.relicCount) || 0;

    // Generate bio suggestion if bio is default
    if (!result.userProfile.bio || result.userProfile.bio === '尚未留下描述') {
      result.userProfile._narrativeBio = MY_WORLD.statNarratives.bioSuggestion(visitedCount, relicCount);
    }

    // Level narrative
    result.userProfile._narrativeLevel = MY_WORLD.statNarratives.levelNarrative(visitedCount);

    // If name is default
    if (!result.userProfile.name || result.userProfile.name === '探索者·未命名') {
      result.userProfile._narrativeName = MY_WORLD.defaultProfile.name;
    }
  }

  // Quick actions enrichment
  if (result.quickActions && result.quickActions.length) {
    result.quickActions = result.quickActions.map(function(action) {
      var narrative = getQuickActionNarrative(action.id);
      if (narrative) {
        action._narrativeLabel = narrative.label;
        action._narrativeDescription = narrative.description;
      }
      return action;
    });
  }

  // Function modules enrichment
  if (result.functionModules && result.functionModules.length) {
    result.functionModules = result.functionModules.map(function(mod) {
      var narrative = getFunctionModuleNarrative(mod.id);
      if (narrative) {
        mod._narrativeLabel = narrative.label;
        mod._narrativeDescription = narrative.description;
      }
      return mod;
    });
  }

  // Recent points enrichment
  if (result.recentPoints && result.recentPoints.length) {
    result.recentPoints = result.recentPoints.map(function(point) {
      if (point.status === '已完成') {
        point._narrativeStatus = '足迹已留';
      } else {
        point._narrativeStatus = '等待踏足';
      }
      return point;
    });
  }

  // Empty state
  if (result.emptyState) {
    result.emptyState.narrativeMessage = MY_WORLD.emptyState.message;
    result.emptyState.narrativeSubmessage = MY_WORLD.emptyState.submessage;
    result.emptyState.narrativeHint = MY_WORLD.emptyState.emptyHint;
  }

  // Section labels
  result._narrativeSectionStats = MY_WORLD.sections.stats;
  result._narrativeSectionRecent = MY_WORLD.sections.recentActivity;
  result._narrativeSectionActions = MY_WORLD.sections.quickActions;

  result._worldContentReady = true;

  return result;
}

// ═════════════════════════════════════════════════════════════════════
// HELPERS
// ═════════════════════════════════════════════════════════════════════

// Get narrative for an explore node by point_id
function getExploreNodeNarrative(pointId) {
  if (!pointId) return null;
  var nodes = EXPLORE_WORLD.nodes;
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i].pointId === pointId) return nodes[i];
  }
  return null;
}

// Pick a random item from an array
function pickNarrative(arr) {
  if (!arr || !arr.length) return '';
  return arr[Math.floor(Math.random() * arr.length)];
}

// Get explore progress narrative
function getExploreProgressNarrative(visited, total) {
  if (total === 0) return '世界尚未被丈量';
  var ratio = visited / total;
  if (ratio === 0) return '尚未踏出第一步';
  if (ratio < 0.3) return '足迹初现，世界正在苏醒';
  if (ratio < 0.6) return '行至中途，世界的脉络逐渐清晰';
  if (ratio < 1) return '即将圆满，归途的光已在眼前';
  return '全部走过——世界向你展示了它的全部面貌';
}

// Enrich a single rights item (coupon, reward, or collectible claim)
function enrichRightsItem(item) {
  if (!item) return item;

  // Check if it's a coupon
  var couponNarrative = RIGHTS_WORLD.coupons[item.id];
  if (couponNarrative) {
    item.narrativeName = couponNarrative.ritualName;
    item.narrativeDescription = couponNarrative.ritualDescription;
    item.narrativeTone = couponNarrative.emotionalTone;
    item.narrativeScenario = couponNarrative.usageScenario;
    item.narrativeSource = couponNarrative.narrativeSource;
    return item;
  }

  // Check if it's a collectible reward
  var collectibleNarrative = RIGHTS_WORLD.collectibleRewards[item.id];
  if (collectibleNarrative) {
    item.narrativeName = collectibleNarrative.ritualName;
    item.narrativeDescription = collectibleNarrative.ritualDescription;
    item.narrativeTone = collectibleNarrative.emotionalTone;
    item.narrativeScenario = collectibleNarrative.usageScenario;
    return item;
  }

  // Check if it's check-in reward
  if (item.id === 'reward_checkin_daily') {
    var checkIn = RIGHTS_WORLD.checkIn;
    item.narrativeName = checkIn.name;
    item.narrativeDescription = item.status === 'claimed' ? checkIn.claimedDescription : checkIn.description;
    item.narrativeMeta = item.status === 'claimed' ? checkIn.claimedMeta : checkIn.meta;
    return item;
  }

  // Check if it's exploration reward
  if (item.id === 'reward_explore_001') {
    var exploreReward = RIGHTS_WORLD.explorationReward;
    item.narrativeName = exploreReward.name;
    item.narrativeDescription = exploreReward.description;
    item.narrativeMeta = exploreReward.meta;
    return item;
  }

  // Generic fallback
  item.narrativeName = item.name || item.title || '';
  item.narrativeDescription = item.description || '';
  return item;
}

// Get feed narrative label
function getFeedNarrativeLabel(type) {
  if (!type) return null;
  if (type.indexOf('探索') >= 0) return RIGHTS_WORLD.feedNarratives.exploreEarn;
  if (type.indexOf('领取') >= 0) return RIGHTS_WORLD.feedNarratives.claimRedeem;
  if (type.indexOf('兑换') >= 0) return RIGHTS_WORLD.feedNarratives.couponUse;
  if (type.indexOf('系统') >= 0) return RIGHTS_WORLD.feedNarratives.systemGrant;
  return null;
}

// Get history narrative label
function getHistoryNarrativeLabel(label) {
  if (!label) return null;
  if (label.indexOf('当前') >= 0) return RIGHTS_WORLD.historyLabels.current;
  if (label.indexOf('今日') >= 0) return RIGHTS_WORLD.historyLabels.today;
  if (label.indexOf('累计') >= 0) return RIGHTS_WORLD.historyLabels.total;
  if (label.indexOf('已领取') >= 0 || label.indexOf('已使用') >= 0) return RIGHTS_WORLD.historyLabels.claimed;
  return null;
}

// Get quick action narrative
function getQuickActionNarrative(actionId) {
  switch (actionId) {
    case 'edit-profile': return MY_WORLD.quickActions.editProfile;
    case 'view-relics': return MY_WORLD.quickActions.viewRelics;
    case 'view-rights': return MY_WORLD.quickActions.viewRights;
    case 'view-collection': return MY_WORLD.quickActions.viewCollection;
    default: return null;
  }
}

// Get function module narrative
function getFunctionModuleNarrative(moduleId) {
  switch (moduleId) {
    case 'module-explore': return MY_WORLD.functionModules.exploreRecord;
    case 'module-relics': return MY_WORLD.functionModules.relicArchive;
    case 'module-rights': return MY_WORLD.functionModules.rightsCenter;
    case 'module-collection': return MY_WORLD.functionModules.collection;
    default: return null;
  }
}

// ─── EXPORTS ───
module.exports = {
  injectWorldContent: injectWorldContent,
  injectExploreContent: injectExploreContent,
  injectCollectionContent: injectCollectionContent,
  injectRightsContent: injectRightsContent,
  injectMyContent: injectMyContent
};
