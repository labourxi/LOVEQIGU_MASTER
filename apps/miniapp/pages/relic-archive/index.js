const relicService = require('../../services/relic/relic-service');
const storyService = require('../../services/story/story-service');
const starMapService = require('../../services/star-map/star-map-service');
const meridianMapService = require('../../services/meridian-map/meridian-map-service');
const prototypeRuntime = require('../../services/prototype/prototype-runtime-service');

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
    status: isCollected ? '已收藏' : '待觉察',
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

function buildPageData(options) {
  const library = prototypeRuntime.getRelicLibrary();
  const boundary = relicService.getAssetBoundary();
  const relicId = options && options.relicId ? options.relicId : '';
  const focusedRelic = mapFocusedRelic(relicId);
  const groups = library.groups.map((group) => ({
    ...group,
    relics: group.relics.map((relic) => ({
      ...relic,
      highlighted: Boolean(focusedRelic && relic.id === focusedRelic.id)
    }))
  }));

  return {
    title: library.title,
    intro: library.intro,
    progress: library.progress,
    groups,
    boundary: resolveBoundaryRule(boundary),
    focusedRelic
  };
}

Page({
  data: buildPageData(),

  onLoad(options) {
    this.setData(buildPageData(options || {}));
  },

  onOpenScenic(event) {
    const { id } = event.currentTarget.dataset;
    if (id) {
      wx.navigateTo({ url: `/pages/scenic-detail/index?id=${id}` });
    }
  },

  onClearFocus() {
    this.setData(buildPageData());
  },

  onOpenStarMap(event) {
    const path = event.currentTarget.dataset.path;
    if (path) {
      wx.navigateTo({ url: path });
    }
  },

  onOpenMeridianMap(event) {
    const path = event.currentTarget.dataset.path;
    if (path) {
      wx.navigateTo({ url: path });
    }
  }
});
