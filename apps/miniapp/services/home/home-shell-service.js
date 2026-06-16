/**
 * Dual Home shell — read-only placeholders from existing runtime services.
 * Does not mutate CH01–CH06 bridges or Canon data.
 */

const storyService = require('../story/story-service');
const relicService = require('../relic/relic-service');
const campaignService = require('../campaign/campaign-service');
const starMapService = require('../star-map/star-map-service');
const meridianMapService = require('../meridian-map/meridian-map-service');
const heavenHumanUnityService = require('../heaven-human-unity/heaven-human-unity-service');
const synthesisService = require('../synthesis/synthesis-service');
const rewardCenterService = require('../reward/reward-center-service');
const prototypeRuntime = require('../prototype/prototype-runtime-service');

function getCurrentChapter() {
  const chapters = storyService.getAllChapters();
  if (!chapters.length) {
    return {
      id: 'placeholder',
      title: '当前章节',
      display_title: '《当前章节》',
      status: '占位',
      copy: '章节进度占位，待后续接入。',
      progress: { display: '0/5' },
      path: '/pages/explore-map/index'
    };
  }

  const chapter = chapters[chapters.length - 1];
  return {
    id: chapter.id,
    title: chapter.title,
    display_title: chapter.display_title || `《${chapter.title}》`,
    status: chapter.status || 'active',
    copy: chapter.summary || '继续在现有场域中完成探索。',
    progress: chapter.progress || { display: '0/5' },
    path: `/pages/explore-map/index?chapterId=${chapter.id}`
  };
}

function getRecentRelics(limit) {
  const max = limit || 3;
  return relicService
    .getAllRelics()
    .slice(0, max)
    .map((relic) => ({
      id: relic.id,
      name: relic.name,
      node_title: relic.node_title || '',
      status: relic.status || 'unrecorded',
      path: `/pages/relic-archive/index?relicId=${relic.id}`
    }));
}

function getRelicSummary() {
  const count = relicService.getAllRelics().length;
  return {
    count,
    label: `已获得信物 ${count} 件`,
    path: '/pages/relic-archive/index'
  };
}

function getStarMapSummary() {
  const overview = starMapService.getStarMapOverview();
  return {
    litDisplay: overview.litDisplay,
    label: '我的星图',
    desc: `四象二十八宿 · 已点亮 ${overview.litDisplay}`,
    path: '/pages/star-map/index'
  };
}

function getMeridianMapSummary() {
  const overview = meridianMapService.getMeridianOverview();
  return {
    litDisplay: overview.litDisplay,
    label: '我的经络图',
    desc: `十二正经 · 已点亮 ${overview.litDisplay}`,
    path: '/pages/meridian-map/index'
  };
}

function getUnitySummary() {
  const overview = heavenHumanUnityService.getHeavenHumanUnityOverview();
  return {
    label: '天人合一',
    heavenDisplay: overview.heavenDisplay,
    humanDisplay: overview.humanDisplay,
    statusLabel: overview.unityStatusLabel,
    desc: `天印 ${overview.heavenDisplay} · 人印 ${overview.humanDisplay}`,
    path: '/pages/heaven-human-unity/index'
  };
}

function getSynthesisSummary() {
  const readyList = synthesisService.getAvailableSyntheses().filter((item) => item.canPerform);
  return {
    label: '信物合成',
    readyCount: readyList.length,
    desc: readyList.length ? `${readyList.length} 项可合成` : '暂无可合成项',
    path: '/pages/synthesis/index'
  };
}

function getRewardSummary() {
  const center = rewardCenterService.getRewardCenter();
  const unlockedCount = center.categories.reduce(
    (sum, category) => sum + category.items.filter((item) => item.unlocked).length,
    0
  );
  return {
    label: '我的祝福收藏册',
    desc: unlockedCount ? `${unlockedCount} 项待领取` : '完成合真后解锁祝福收藏',
    path: '/pages/reward-center/index'
  };
}

function buildExplorePanel() {
  const chapter = getCurrentChapter();
  const recentRelics = getRecentRelics(3);
  const relicSummary = getRelicSummary();
  const starMapSummary = getStarMapSummary();
  const meridianMapSummary = getMeridianMapSummary();
  const unitySummary = getUnitySummary();
  const synthesisSummary = getSynthesisSummary();
  const rewardSummary = getRewardSummary();
  const prototype = prototypeRuntime.getHomeDashboard();

  return {
    chapter,
    recentRelics,
    relicSummary,
    starMapSummary,
    meridianMapSummary,
    unitySummary,
    synthesisSummary,
    rewardSummary,
    prototype,
    primaryAction: {
      label: '继续探索',
      path: '/pages/explore-map/index'
    },
    sections: [
      {
        id: 'current_chapter',
        label: '当前章节',
        type: 'chapter_card'
      },
      {
        id: 'explore_map',
        label: '探索地图',
        desc: '查看区域、节点与 AR 入口',
        path: '/pages/explore-map/index'
      },
      {
        id: 'recent_relics',
        label: '最近获得',
        desc: '故事进度资产回顾',
        path: '/pages/relic-archive/index'
      },
      {
        id: 'story_archive',
        label: '故事档案',
        desc: '查看章节结构与记念内容',
        path: '/pages/story-archive/index'
      }
    ]
  };
}

function buildAffinityPanel() {
  const campaigns = campaignService.getAllCampaigns();

  return {
    primaryAction: {
      label: '查看权益',
      path: '/pages/rights-center/index'
    },
    featured: {
      title: '本期推荐',
      copy: '权益礼遇与活动推荐占位，不含强促销文案。',
      path: '/pages/rights-center/index'
    },
    sections: [
      {
        id: 'featured',
        label: '本期推荐',
        desc: '当前权益礼遇与推荐活动',
        path: '/pages/rights-center/index'
      },
      {
        id: 'my_rights',
        label: '我的权益',
        desc: '卡券、权益礼遇与核销状态',
        path: '/pages/rights-center/index'
      },
      {
        id: 'activity_center',
        label: '活动中心',
        desc: '运营活动与记念入口',
        path: '/pages/campaign-closure/index'
      },
      {
        id: 'next_activity',
        label: '下次活动',
        desc: '下一场活动预告与回访',
        path: '/pages/next-activity/index'
      }
    ],
    campaignCount: campaigns.length
  };
}

function buildCampaignReserved(policy) {
  return {
    visible: Boolean(policy.campaign_override),
    title: policy.campaign_override ? policy.campaign_override.title : '活动模式',
    copy: policy.campaign_override
      ? policy.campaign_override.copy
      : '活动模式预留 — 后台开启后将展示。',
    status: 'reserved'
  };
}

function buildShellData(policy) {
  return {
    explore: buildExplorePanel(),
    affinity: buildAffinityPanel(),
    campaign: buildCampaignReserved(policy)
  };
}

module.exports = {
  buildShellData,
  buildExplorePanel,
  buildAffinityPanel,
  buildCampaignReserved
};
