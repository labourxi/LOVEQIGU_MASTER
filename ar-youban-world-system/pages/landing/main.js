/**
 * LANDING MAIN — 世界入口页面
 *
 * 只保留 CTA 点击视觉增强。
 * 所有 world 初始化逻辑已迁移至 /system/bootstrap/bootstrap.js
 *
 * 所有副作用延迟至 main() 执行，不在 import 时触发。
 */

import { getBootstrapResult } from '../../system/bootstrap/bootstrap.js';

function main() {
  // 确认 bootstrap 已完成（缓存检查，非初始化）
  const result = getBootstrapResult();

  // 仅保留视觉漂移动画（纯 UI，非 world 初始化）
  const starTracks = document.querySelector('.world-layer__star-tracks');
  let driftPhase = 0;

  function bindLandingVisualDrift() {
    driftPhase += 0.0035;

    if (starTracks) {
      starTracks.style.transform =
        'translate(' + (Math.sin(driftPhase) * 0.9) + '%, ' + (Math.cos(driftPhase * 0.8) * 0.4) + '%)';
    }

    requestAnimationFrame(bindLandingVisualDrift);
  }

  if (document.body && document.body.getAttribute('data-page') === 'landing') {
    requestAnimationFrame(bindLandingVisualDrift);
  }
}

main();
