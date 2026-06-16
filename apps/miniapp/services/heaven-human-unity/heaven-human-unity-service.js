const starMapService = require('../star-map/star-map-service');
const meridianMapService = require('../meridian-map/meridian-map-service');
const synthesisService = require('../synthesis/synthesis-service');

const HEAVEN_SYMBOL_TOTAL = 4;
const HUMAN_MERIDIAN_SEAL_TOTAL = 16;

function mapHeavenSeal(symbolProgressItem) {
  return {
    id: symbolProgressItem.id,
    name: symbolProgressItem.name,
    lit: symbolProgressItem.done,
    total: symbolProgressItem.total,
    litRatio: symbolProgressItem.display,
    sealed: symbolProgressItem.symbolSealDone,
    statusLabel: symbolProgressItem.symbolSealLabel
  };
}

function mapHumanSeal(item) {
  return {
    id: item.id,
    name: item.name,
    fullName: item.fullName || item.name,
    category: item.category || 'regular',
    lit: item.done,
    total: item.total,
    litRatio: item.display,
    sealed: item.done === item.total && item.total > 0,
    statusLabel: item.statusLabel
  };
}

function getHeavenHumanUnityOverview() {
  const starOverview = starMapService.getStarMapOverview();
  const meridianOverview = meridianMapService.getMeridianOverview();
  const heavenProgress = synthesisService.getHeavenSealProgress();
  const humanProgress = synthesisService.getHumanSealProgress();

  const heavenSeals = heavenProgress.symbolProgress.map(mapHeavenSeal);
  const heavenSealedCount = heavenProgress.symbolProgress.filter((item) => item.symbolSealDone).length;
  const heavenUltimateDone = heavenProgress.heavenSeal.done;

  const regularSeals = humanProgress.regularMeridians.map(mapHumanSeal);
  const extraordinarySeals = humanProgress.extraordinaryVessels.map(mapHumanSeal);
  const humanSealedCount = regularSeals.concat(extraordinarySeals).filter((item) => item.sealed).length;
  const humanUltimateDone = humanProgress.humanSeal.done;

  const unityAchieved = heavenUltimateDone === 1 && humanUltimateDone === 1;

  return {
    title: '天人合一',
    subtitle: '天印与人印总览',
    intro: '观天之道，察人之身。\n集天印与人印，方可开启天人合一。',
    heavenSealedCount,
    heavenSealTotal: HEAVEN_SYMBOL_TOTAL,
    heavenDisplay: `${heavenSealedCount} / ${HEAVEN_SYMBOL_TOTAL}`,
    heavenUltimateDisplay: heavenProgress.heavenSeal.display,
    heavenUltimateLabel: heavenProgress.heavenSeal.statusLabel,
    heavenSeals,
    humanSealedCount,
    humanSealTotal: HUMAN_MERIDIAN_SEAL_TOTAL,
    humanDisplay: `${humanSealedCount} / ${HUMAN_MERIDIAN_SEAL_TOTAL}`,
    humanUltimateDisplay: humanProgress.humanSeal.display,
    humanUltimateLabel: humanProgress.humanSeal.statusLabel,
    regularSeals,
    extraordinarySeals,
    starLitDisplay: starOverview.litDisplay,
    meridianLitDisplay: meridianOverview.litDisplay,
    unityAchieved,
    unityStatusLabel: unityAchieved ? '已达成' : '未达成',
    starMapPath: '/pages/star-map/index',
    meridianMapPath: '/pages/meridian-map/index',
    synthesisPath: '/pages/synthesis/index',
    sealsPath: '/pages/seals/index'
  };
}

module.exports = {
  getHeavenHumanUnityOverview
};
