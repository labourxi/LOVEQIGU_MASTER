/**
 * VISUAL INDEX V1 — 视觉系统索引
 *
 * 全系统视觉模块的注册与管理。
 * 负责按页面注入对应的视觉 CSS 和动效。
 *
 * 规则：
 *   ✔ 每个页面只加载该页的视觉模块
 *   ✔ landing 只加载 landing + motion
 *   ✔ explore 只加载 explore + relic + motion
 *   ✔ 不修改 world engine / state machine / bootstrap
 *
 * 禁止：
 *   ❌ 注入业务逻辑
 *   ❌ 修改 state
 *   ❌ 生成信物
 */

// ─── 视觉模块注册表 ───
const VISUAL_MODULES = Object.freeze({
  landing: {
    css: [
      '/system/visual/visual_tokens.css',
      '/system/visual/motion/motion_visual.css',
      '/system/visual/landing/landing_visual.css'
    ],
    description: 'Landing 页视觉：世界感（雾 + 光 + 深度）+ 单入口登录'
  },
  explore: {
    css: [
      '/system/visual/visual_tokens.css',
      '/system/visual/motion/motion_visual.css',
      '/system/visual/explore/explore_visual.css',
      '/system/visual/relic/relic_visual.css'
    ],
    description: 'Explore 页视觉：场景节点卡片 + 信物三态 + 动效'
  }
});

/**
 * 注入页面视觉模块。
 * 遍历模块注册表，将 CSS 文件以 <link> 形式注入到 <head>。
 *
 * @param {string} pageName - 'landing' | 'explore'
 */
export function injectVisualModule(pageName) {
  const module = VISUAL_MODULES[pageName];
  if (!module) {
    console.warn('[visual_index] 未知页面:', pageName);
    return;
  }

  module.css.forEach(function (cssPath) {
    // 避免重复注入
    var linkId = 'aiqigu-visual-' + cssPath.replace(/[\/\.]/g, '-');
    if (document.getElementById(linkId)) return;

    var link = document.createElement('link');
    link.id = linkId;
    link.rel = 'stylesheet';
    link.href = cssPath;
    document.head.appendChild(link);
  });

  // 设置 data-page 属性供 CSS 按页面区分
  document.body.setAttribute('data-page', pageName);

  console.log('[visual_index] 已注入 ' + pageName + ' 视觉模块 (' + module.css.length + ' CSS)');
}

/**
 * 获取页面视觉模块信息。
 * @param {string} pageName
 * @returns {object|null}
 */
export function getVisualModuleInfo(pageName) {
  return VISUAL_MODULES[pageName] || null;
}

/**
 * 获取所有已注册的视觉模块。
 * @returns {object}
 */
export function getAllVisualModules() {
  return VISUAL_MODULES;
}
