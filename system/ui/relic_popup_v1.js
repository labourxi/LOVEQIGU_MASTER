/**
 * RELIC POPUP V1 — 信物空间覆盖层（V2 空间化版）
 *
 * 信物不是卡片，不是弹窗 — 是"空间中的显现"。
 * 使用 relic_spatial.css 中的 .relic-overlay 和 .relic-manifestation。
 *
 * 展示内容：
 *   - relic_name（信物名称）
 *   - source_node（来源场景）
 *   - visual_stage（0-3 光点）
 *   - 状态动画（reveal / burst）
 *
 * 约束：
 *   ❌ UI不能生成信物
 *   ❌ UI不能管理state
 *   ❌ UI不能绕过relic_engine
 *   ❌ 不使用卡片/弹窗/按钮 UI
 */

// ─── 覆盖层状态 ───
let overlayActive = false;

/**
 * 获取或创建覆盖层容器。
 * @returns {HTMLElement}
 */
function getOverlayContainer() {
  var container = document.getElementById('aiqigu-relic-overlay');
  if (container) return container;

  container = document.createElement('div');
  container.id = 'aiqigu-relic-overlay';
  container.className = 'relic-overlay';
  container.style.display = 'none';
  document.body.appendChild(container);
  return container;
}

/**
 * 展示信物显现（空间覆盖层）。
 *
 * @param {object} relicData
 * @param {string} relicData.relic_name
 * @param {string} [relicData.source_node]
 * @param {string} [relicData.state]
 * @param {number} [relicData.visual_stage]
 * @param {string} [relicData.brand]
 * @param {string} [relicData.animation]
 * @param {string} [relicData.message]
 */
export function showRelic(relicData) {
  var container = getOverlayContainer();
  var stateClass = '';
  if (relicData.state === 'COLLECTED') stateClass = 'state-collected';
  else if (relicData.state === 'ACTIVE') stateClass = 'state-active';
  else stateClass = 'state-locked';

  var stage = typeof relicData.visual_stage === 'number' ? Math.min(relicData.visual_stage, 4) : 0;
  var animClass = relicData.animation === 'burst' ? 'state-collected' : 'state-active';

  // 构建阶段光点
  var stageDots = '<div class="relic-manifestation__stages">';
  for (var i = 0; i < 4; i++) {
    stageDots += '<div class="relic-manifestation__stage-dot' + (i < stage ? ' active' : '') + '"></div>';
  }
  stageDots += '</div>';

  var extraMsg = relicData.message ? '<div style="margin-top:12px;font-family:var(--font-serif);font-size:0.65rem;letter-spacing:0.1em;color:rgba(148,168,198,0.35);">' + relicData.message + '</div>' : '';

  container.innerHTML = [
    '<div class="relic-overlay__bg" onclick="window.__relicOverlayClose()"></div>',
    '<div class="relic-overlay__focus">',
    '  <div class="relic-manifestation ' + animClass + '">',
    '    <div class="relic-manifestation__light-ring"></div>',
    '    <div class="relic-manifestation__content">',
    '      <div class="relic-manifestation__title">' + (relicData.brand || '印记') + '</div>',
    '      <div class="relic-manifestation__name">' + (relicData.relic_name || '未知信物') + '</div>',
    '      <div class="relic-manifestation__source">' + (relicData.source_node || '') + '</div>',
          stageDots,
    '      ' + extraMsg,
    '    </div>',
    '  </div>',
    '</div>'
  ].join('');

  container.style.display = 'flex';
  overlayActive = true;

  window.__relicOverlayClose = function () {
    closePopup();
  };
}

/**
 * 展示收集确认（光消退入空间）。
 *
 * @param {string} relicId
 */
export function showCollectConfirm(relicId) {
  var container = getOverlayContainer();

  container.innerHTML = [
    '<div class="relic-overlay__bg" onclick="window.__relicOverlayClose()"></div>',
    '<div class="relic-overlay__focus">',
    '  <div class="relic-manifestation state-collected">',
    '    <div class="relic-manifestation__light-ring"></div>',
    '    <div class="relic-manifestation__content">',
    '      <div class="relic-collect-confirm">',
    '        <div class="relic-collect-confirm__icon">◆</div>',
    '        <div class="relic-collect-confirm__text">印记已归于空间</div>',
    '        <div class="relic-collect-confirm__id">' + relicId + '</div>',
    '        <div style="margin-top:16px;font-family:var(--font-serif);font-size:0.7rem;letter-spacing:0.15em;color:rgba(148,168,198,0.3);cursor:pointer;" onclick="window.__relicOverlayClose()">轻触继续</div>',
    '      </div>',
    '    </div>',
    '  </div>',
    '</div>'
  ].join('');

  container.style.display = 'flex';
  overlayActive = true;

  window.__relicOverlayClose = function () {
    closePopup();
  };
}

/**
 * 展示错误覆盖。
 *
 * @param {object} errorData
 * @param {string} errorData.title
 * @param {string} errorData.message
 */
export function showError(errorData) {
  var container = getOverlayContainer();

  container.innerHTML = [
    '<div class="relic-overlay__bg" onclick="window.__relicOverlayClose()"></div>',
    '<div class="relic-overlay__focus">',
    '  <div class="relic-manifestation state-error">',
    '    <div class="relic-manifestation__content">',
    '      <div class="relic-manifestation__name" style="color:rgba(248,160,160,0.5);font-size:1rem;">' + (errorData.title || '') + '</div>',
    '      <div class="relic-manifestation__source" style="color:rgba(248,160,160,0.3);">' + (errorData.message || '') + '</div>',
    '      <div style="margin-top:20px;font-family:var(--font-serif);font-size:0.7rem;letter-spacing:0.15em;color:rgba(148,168,198,0.3);cursor:pointer;" onclick="window.__relicOverlayClose()">轻触关闭</div>',
    '    </div>',
    '  </div>',
    '</div>'
  ].join('');

  container.style.display = 'flex';
  overlayActive = true;

  window.__relicOverlayClose = function () {
    closePopup();
  };
}

/**
 * 关闭覆盖层。
 */
export function closePopup() {
  var container = document.getElementById('aiqigu-relic-overlay');
  if (container) {
    container.style.display = 'none';
    container.innerHTML = '';
  }
  overlayActive = false;
  window.__relicOverlayClose = null;
}

/**
 * 检查覆盖层是否正在展示。
 * @returns {boolean}
 */
export function isPopupVisible() {
  return overlayActive;
}

/**
 * 注入 relic 覆盖层基础样式（如果未通过 <link> 加载）。
 */
export function injectPopupStyles() {
  if (document.getElementById('aiqigu-relic-overlay-styles')) return;
  var link = document.createElement('link');
  link.id = 'aiqigu-relic-overlay-styles';
  link.rel = 'stylesheet';
  link.href = '../../system/visual/relic/relic_spatial.css';
  document.head.appendChild(link);
}
