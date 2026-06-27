/**
 * EXPLORE — 探索页逻辑（V2 视觉版）
 *
 * 职责：
 *   ✔ 首次加载时调用 bootstrap()（唯一入口）
 *   ✔ 渲染 scene_map_v1（使用 node_renderer_v1）
 *   ✔ 接入 click_router_v1（使用 interaction_engine_v1）
 *
 * 禁止：
 *   ❌ 自己生成信物
 *   ❌ 自己维护 state
 *   ❌ 自己初始化 world（由 bootstrap 完成）
 *   ❌ 不得修改 world engine / state machine
 */

(function () {
  'use strict';

  var bootstrapLoaded = false;
  var interactionEngine = null;

  async function initExplorePage() {
    console.log('[explore] 页面加载，开始初始化...');

    var urlParams = new URLSearchParams(window.location.search);
    var userId = urlParams.get('userId') || 'anonymous';

    try {
      // 1. 启动世界动效（motion.js，纯视觉）
      try {
        var motionModule = await import('../../system/visual/motion.js');
        motionModule.startMotion(function () {
          motionModule.updateFog();
          motionModule.updateLight();
          motionModule.updateStars();
        });
        motionModule.bindExploreCardMotion();
      } catch (_) { /* 静默降级 */ }

      // 2. 加载 bootstrap（唯一 world 初始化入口）
      var bootstrapModule = await import('../../system/bootstrap/bootstrap.js');
      var bootstrapResult = bootstrapModule.bootstrap(userId);

      if (!bootstrapResult || !bootstrapResult.success) {
        showPageError('世界加载失败: ' + (bootstrapResult ? bootstrapResult.error : '未知错误'));
        return;
      }

      bootstrapLoaded = true;
      console.log('[explore] bootstrap 完成 — ' + bootstrapResult.session.relicCount + ' 个信物已就绪');

      // 3. 初始化交互引擎（UI 层）
      var interactionModule = await import('../../system/ui/interaction_engine_v1.js');
      interactionEngine = interactionModule.initInteractionEngine('explore-page', userId);

      if (!interactionEngine) {
        showPageError('交互引擎初始化失败');
        return;
      }

      // 4. 渲染场景节点
      var sceneContainer = document.getElementById('scene-container');
      interactionEngine.renderNodes(sceneContainer);

      // 5. 绑定全局点击处理器
      interactionEngine.bindGlobalClickHandler(sceneContainer);

      // 6. 更新进度
      updateProgress();

      // 7. 弹窗关闭后刷新进度
      observePopupClose();

      console.log('[explore] 探索页面就绪 — 7 个场景节点等待探索');

    } catch (e) {
      console.error('[explore] 初始化失败:', e);
      showPageError('系统初始化失败: ' + e.message);
    }
  }

  function updateProgress() {
    if (!interactionEngine) return;
    var progress = interactionEngine.getProgress();
    var el = document.getElementById('progress-text');
    var bar = document.getElementById('progress-bar');
    if (el) el.textContent = progress.collected + ' / ' + progress.total;
    if (bar) bar.style.width = progress.percentage + '%';
  }

  function observePopupClose() {
    var target = document.getElementById('aiqigu-relic-popup-v1');
    if (!target) return;
    var observer = new MutationObserver(function () {
      if (target.style.display === 'none') updateProgress();
    });
    observer.observe(target, { attributes: true, attributeFilter: ['style'] });
  }

  function showPageError(msg) {
    var container = document.getElementById('scene-container');
    if (container) {
      container.innerHTML = '<div style="text-align:center;padding:60px 20px;color:rgba(248,160,160,0.8);font-family:var(--font-serif);">' +
        '<div style="font-size:36px;margin-bottom:16px;">⚠</div>' +
        '<div style="font-size:0.82rem;letter-spacing:0.1em;">' + msg + '</div>' +
        '<button onclick="location.reload()" style="margin-top:20px;padding:8px 24px;border-radius:999px;border:1px solid rgba(255,255,255,0.15);background:transparent;color:rgba(228,236,248,0.7);font-family:var(--font-serif);cursor:pointer;">重新加载</button>' +
        '</div>';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initExplorePage);
  } else {
    initExplorePage();
  }
})();
