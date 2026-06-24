const relicService = require('../../services/relic/relic-service');
const storyService = require('../../services/story/story-service');
const starMapService = require('../../services/star-map/star-map-service');
const meridianMapService = require('../../services/meridian-map/meridian-map-service');
const prototypeRuntime = require('../../services/prototype/prototype-runtime-service');
const userRuntime = require('../../services/user-runtime-adapter/index');
const phase1PageGuard = require('../../behaviors/phase1-page-guard');
const safeInteraction = require('../../behaviors/safe-interaction');

const COL_COUNT = 3;

const RELIC_BOUNDARY_RULE_ZH =
  '信物记念与数字藏品分离：信物是故事进度资产，数字藏品是传播资产，二者不可混用。';

function resolveBoundaryRule(boundary) {
  const rule = boundary && boundary.rule ? boundary.rule : '';
  if (!rule || /Relic records must not|Digital Collectible records/i.test(rule)) {
    return RELIC_BOUNDARY_RULE_ZH;
  }
  return rule;
}

function mapFocusedRelic(relicId) {
  if (!relicId) {
    return null;
  }
  const relic = relicService.getRelicById(relicId);
  if (!relic) {
    return null;
  }
  const chapter = storyService.getChapterById(relic.chapter_id);
  const isCollected = relic.status === 'recorded' || relic.status === 'active' || relic.status === 'placeholder';
  const starMapping = starMapService.getRelicStarMapping(relic.id);
  const meridianMapping = meridianMapService.getRelicMeridianMapping(relic.id);
  const starAliasName = relic.star_alias_name || (starMapping ? starMapping.star_alias_name : '');
  const pointAliasName = relic.point_alias_name || (meridianMapping ? meridianMapping.point_name : '');
  return {
    id: relic.id,
    name: relic.name,
    chapter: chapter ? chapter.title : relic.chapter_title || relic.chapter_id,
    nodeTitle: relic.node_title || '',
    description: relic.display_copy || relic.description || '',
    awarenessLine: relic.awareness_line || '',
    status: isCollected ? '已收录' : '待显现',
    starMapped: Boolean(starMapping),
    starAliasName,
    starMansionName: starMapping ? starMapping.mansion_name : '',
    starSymbolName: starMapping ? starMapping.symbol_name : '',
    starAliasId: relic.star_alias_id || (starMapping ? starMapping.star_alias_id : ''),
    starMapPath: starMapping ? `/pages/star-map/index?starAliasId=${starMapping.star_alias_id}` : '',
    meridianMapped: Boolean(meridianMapping),
    meridianPointName: pointAliasName ? `${pointAliasName}穴` : '',
    meridianName: meridianMapping ? meridianMapping.meridian_name : '',
    meridianPointId: relic.point_alias_id || (meridianMapping ? meridianMapping.point_id : ''),
    meridianMapPath: meridianMapping ? `/pages/meridian-map/index?pointId=${meridianMapping.point_id}` : ''
  };
}

/**
 * 按行折叠：visibleRows = ceil(ownedCount / colCount)，最多展示 visibleRows * colCount 个格位。
 */
function buildAlbumLayout(group, focusedRelic, pendingExpanded) {
  if (group.placeholder) {
    return {
      hasPlaceholder: true,
      placeholder: group.placeholder,
      colCount: COL_COUNT
    };
  }

  const relics = (group.relics || []).map((relic) => ({
    ...relic,
    collected: relic.status === '已收藏',
    highlighted: Boolean(focusedRelic && relic.id === focusedRelic.id)
  }));

  const ownedRelics = relics
    .filter((item) => item.collected)
    .sort((a, b) => Number(b.highlighted) - Number(a.highlighted));
  const pendingRelics = relics.filter((item) => !item.collected);
  const ownedCount = ownedRelics.length;
  const pendingTotal = pendingRelics.length;
  const totalRelics = group.total || relics.length;

  const base = {
    colCount: COL_COUNT,
    ownedCount,
    pendingTotal,
    totalRelics,
    pendingExpanded: Boolean(pendingExpanded)
  };

  if (ownedCount <= 0) {
    const foldedCount = pendingTotal || totalRelics;
    return {
      ...base,
      isEmptyOwned: true,
      emptyState: {
        title: '第一枚印记尚未显现',
        body: '从探索地图前往第一个探索点，完成后它会被收进这里。'
      },
      visibleSlots: [],
      teaserSlots: Array.from({ length: COL_COUNT }, (_, i) => ({
        key: `teaser-${group.scenicId}-${i}`,
        kind: 'pending-teaser',
        label: '待显现'
      })),
      foldedPendingCount: foldedCount,
      remainingPendingCount: Math.max(foldedCount - COL_COUNT, 0),
      showFold: foldedCount > 0,
      showExpandAll: foldedCount > COL_COUNT,
      expandedPendingSlots:
        pendingExpanded && pendingRelics.length
          ? pendingRelics.map((r) => ({
              kind: 'pending-full',
              key: r.id,
              label: '待显现',
              name: r.name,
              chapter: r.chapter
            }))
          : []
    };
  }

  const visibleRows = Math.ceil(ownedCount / COL_COUNT);
  const visibleSlotCount = visibleRows * COL_COUNT;
  const visibleSlots = [];

  ownedRelics.forEach((relic) => {
    visibleSlots.push({ kind: 'owned', key: relic.id, ...relic });
  });

  const pendingInGrid = Math.min(pendingTotal, visibleSlotCount - ownedCount);
  for (let i = 0; i < pendingInGrid; i += 1) {
    visibleSlots.push({
      kind: 'pending-dim',
      key: `dim-${group.scenicId}-${i}`,
      label: '待显现'
    });
  }

  const remainingPending = pendingTotal - pendingInGrid;
  const expandedPendingSlots =
    pendingExpanded && remainingPending > 0
      ? pendingRelics.slice(pendingInGrid).map((r) => ({
          kind: 'pending-full',
          key: r.id,
          label: '待显现',
          name: r.name,
          chapter: r.chapter
        }))
      : [];

  return {
    ...base,
    isEmptyOwned: false,
    emptyState: null,
    visibleSlots,
    teaserSlots: [],
    foldedPendingCount: remainingPending,
    remainingPendingCount: remainingPending,
    showFold: remainingPending > 0,
    showExpandAll: remainingPending > 0,
    expandedPendingSlots
  };
}

function enrichGroup(group, focusedRelic, expandState) {
  const pendingExpanded = expandState && typeof expandState === 'object' ? expandState[group.scenicId] : false;
  const album = buildAlbumLayout(group, focusedRelic, pendingExpanded);
  return {
    ...group,
    album,
    pendingExpanded: Boolean(pendingExpanded)
  };
}

function applyRuntimeArchive(library) {
  userRuntime.boot();
  const adapter = userRuntime.getAdapter();
  if (!adapter) return library;
  const archive = adapter.getRelicArchive(userRuntime.getUserId(), userRuntime.getActivityId());
  const collected = archive.collected || [];
  if (!collected.length) {
    return {
      ...library,
      progress: {
        ...library.progress,
        runtimeSync: true,
        adapterCollected: 0
      }
    };
  }
  const groups = library.groups.map((group) => {
    const relics = (group.relics || []).map((relic) => ({ ...relic }));
    collected.forEach((cr) => {
      const idx = relics.findIndex((r) => r.id === cr.id || r.name === cr.name);
      if (idx >= 0) {
        relics[idx] = { ...relics[idx], status: '已收藏', collected: true };
      } else if (group.scenicId === 'scenic_aiqiugu') {
        relics.unshift({
          id: cr.id,
          name: cr.name,
          chapter: cr.chapter || cr.node || '',
          status: '已收藏',
          collected: true
        });
      }
    });
    return { ...group, relics };
  });
  return {
    ...library,
    groups,
    progress: {
      ...library.progress,
      runtimeSync: true,
      adapterCollected: collected.length
    }
  };
}

function buildPageData(options, expandState) {
  const library = applyRuntimeArchive(prototypeRuntime.getRelicLibrary());
  const boundary = relicService.getAssetBoundary();
  const relicId = options && options.relicId ? options.relicId : '';
  const focusedRelic = mapFocusedRelic(relicId);
  const groups = library.groups.map((group) => enrichGroup(group, focusedRelic, expandState));

  return {
    activeTab: 'relic',
    title: library.title,
    intro: library.intro,
    progress: library.progress,
    groups,
    boundary: resolveBoundaryRule(boundary),
    focusedRelic,
    colCount: COL_COUNT
  };
}

Page({
  behaviors: [phase1PageGuard, safeInteraction],
  data: buildPageData(),

  onLoad(options) {
    this.expandState = {};
    this.focusRelicId = (options && options.relicId) || '';
    this.setData(buildPageData(options || {}, this.expandState));
  },

  onClearFocus() {
    this.focusRelicId = '';
    this.setData(buildPageData({}, this.expandState));
  },

  onOpenStarMap(event) {
    const path = event.currentTarget.dataset.path;
    if (!path) {
      this.showFallbackToast('功能开发中');
      return;
    }
    this.safeNavigate(path, {
      fallbackTitle: '页面暂未开放'
    });
  },

  onOpenMeridianMap(event) {
    const path = event.currentTarget.dataset.path;
    if (!path) {
      this.showFallbackToast('功能开发中');
      return;
    }
    this.safeNavigate(path, {
      fallbackTitle: '页面暂未开放'
    });
  },

  onOpenRelic(event) {
    const { relicId } = event.currentTarget.dataset;
    if (relicId) {
      this.focusRelicId = relicId;
      this.setData(buildPageData({ relicId }, this.expandState));
    }
  },

  onSlotTap(event) {
    const { kind, relicId } = event.currentTarget.dataset;
    if (kind === 'owned' && relicId) {
      this.onOpenRelic(event);
      return;
    }
    this.showFallbackToast('功能开发中');
  },

  onTogglePending(event) {
    const { id } = event.currentTarget.dataset;
    if (!id) {
      return;
    }
    this.expandState[id] = !this.expandState[id];
    const options = this.focusRelicId ? { relicId: this.focusRelicId } : {};
    this.setData(buildPageData(options, this.expandState));
  },

  onContinueExplore() {
    this.safeNavigate('/pages/explore-map/index', {
      fallbackTitle: '探索地图暂未开放'
    });
  },

  onBottomNavChange() {}
});
