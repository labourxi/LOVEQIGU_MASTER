/**
 * REVELATION RHYTHM ENGINE — V5.4
 *
 * 仪式化体验系统核心引擎。
 * 管理信物显现的节奏、动画阶段、反馈序列。
 *
 * ─── 节奏序列 ───
 *
 * RELIC REVEAL（信物显现）:
 *   t_delay:   300-800ms  随机延迟，营造非瞬时感
 *   t_particle: 600ms      粒子聚合动画
 *   t_glow:     800ms      光晕扩散效果
 *   t_reveal:   500ms      信物显现完成
 *
 * XR ENTRY RHYTHM（XR 进入节奏）:
 *   t0:        500ms       黑场
 *   t1:       1200ms       环境生成
 *   t2:       1500ms       粒子聚合
 *   t3:       2000ms       信物显现
 *
 * ─── 使用方式 ───
 *   const rhythm = require('../../services/revelation-rhythm-engine');
 *
 *   // 信物显现
 *   rhythm.revealRelic({ pointId, relicName }, (stage) => {
 *     // stage: 'delay' | 'particle' | 'glow' | 'reveal'
 *     // stage.progress: 0-1
 *   });
 *
 *   // XR 进入节奏
 *   rhythm.enterXRRhythm((stage) => {
 *     // stage: 't0_blackout' | 't1_environment' | 't2_particle' | 't3_reveal'
 *   });
 *
 *   // 探索反馈
 *   rhythm.exploreFeedback(() => {
 *     // 返回后执行 navigate
 *   });
 */

var _seed = Date.now();

// ─── 随机工具 ───
function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDelay() {
  return randomBetween(300, 800);
}

// ─── 节拍器 ───
function metronome(stages, onTick, onComplete) {
  var cancelled = false;
  var currentIdx = 0;

  function tick() {
    if (cancelled || currentIdx >= stages.length) {
      if (typeof onComplete === 'function' && !cancelled) {
        onComplete();
      }
      return;
    }
    var stage = stages[currentIdx];
    if (typeof onTick === 'function') {
      onTick({
        name: stage.name,
        progress: 0,
        duration: stage.duration
      });
    }
    // 模拟进度（实用中可用 requestAnimationFrame）
    var progressInterval = setInterval(function () {
      var elapsed = Date.now() - _stageStart;
      var progress = Math.min(elapsed / stage.duration, 1);
      if (typeof onTick === 'function') {
        onTick({
          name: stage.name,
          progress: progress,
          duration: stage.duration
        });
      }
    }, 50);

    var _stageStart = Date.now();
    setTimeout(function () {
      clearInterval(progressInterval);
      if (typeof onTick === 'function') {
        onTick({
          name: stage.name,
          progress: 1,
          duration: stage.duration
        });
      }
      currentIdx++;
      tick();
    }, stage.duration);
  }

  setTimeout(tick, 16);

  return function cancel() {
    cancelled = true;
  };
}

// ─── 1. 信物显现（Relic Reveal） ───
function revealRelic(relicInfo, onStage) {
  var delay = randomDelay();
  var stages = [
    { name: 'delay',    duration: delay },
    { name: 'particle', duration: 600 },
    { name: 'glow',     duration: 800 },
    { name: 'reveal',   duration: 500 }
  ];

  console.log('[relic-reveal] starting reveal for:', relicInfo ? relicInfo.relicName || relicInfo.pointId : 'unknown', 'delay:', delay + 'ms');

  return metronome(stages, onStage, function () {
    console.log('[relic-reveal] complete');
  });
}

// ─── 2. XR 进入节奏（XR Rhythm） ───
var XR_RHYTHM_STAGES = Object.freeze({
  BLACKOUT:   't0_blackout',
  ENVIRONMENT: 't1_environment',
  PARTICLE:   't2_particle',
  REVEAL:     't3_reveal'
});

function enterXRRhythm(onStage) {
  var stages = [
    { name: XR_RHYTHM_STAGES.BLACKOUT,    duration: 500 },
    { name: XR_RHYTHM_STAGES.ENVIRONMENT, duration: 1200 },
    { name: XR_RHYTHM_STAGES.PARTICLE,    duration: 1500 },
    { name: XR_RHYTHM_STAGES.REVEAL,      duration: 2000 }
  ];

  console.log('[xr-rhythm] starting XR entry rhythm');
  return metronome(stages, onStage, function () {
    console.log('[xr-rhythm] XR entry rhythm complete');
  });
}

// ─── 3. 探索反馈（Exploration Feedback） ───
function exploreFeedback(options, onComplete) {
  var delay = randomBetween(300, 800);
  console.log('[explore-feedback] feedback delay:', delay + 'ms', options);

  // 触觉反馈
  if (typeof wx !== 'undefined' && wx.vibrateShort) {
    try {
      wx.vibrateShort({ type: 'medium' });
    } catch (e) {
      // vibrate not available
    }
  }

  // 延迟确认后执行回调
  setTimeout(function () {
    if (typeof onComplete === 'function') {
      onComplete();
    }
  }, delay);
}

// ─── 4. UI 轻反馈（Glow Flash） ───
function glowFlash(selector) {
  if (typeof wx === 'undefined') return;
  try {
    var query = wx.createSelectorQuery ? wx.createSelectorQuery() : null;
    if (!query) return;
    // 实际使用中通过 CSS class 切换实现
    console.log('[glow-flash] flash on:', selector);
  } catch (e) {
    // silent
  }
}

module.exports = {
  // 常量
  XR_RHYTHM_STAGES: XR_RHYTHM_STAGES,

  // 核心 API
  revealRelic: revealRelic,
  enterXRRhythm: enterXRRhythm,
  exploreFeedback: exploreFeedback,
  glowFlash: glowFlash,

  // 工具
  randomDelay: randomDelay,
  randomBetween: randomBetween
};
