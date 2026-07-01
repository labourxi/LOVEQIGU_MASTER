/**
 * UI_CONTRACT_V0.5 — Soft Visual System
 *
 * This is a runtime-verifiable reference, NOT an enforcement module.
 * It documents the visual structure contract so developers can audit
 * pages against the agreed layout rules.
 *
 * Violations should be reported as warnings, not block rendering.
 */

const CONTRACT_VERSION = '0.5';

const VISUAL_PRINCIPLES = {
  ONE_WORLD_RULE: '所有页面必须像同一个世界',
  CENTER_GRAVITY_RULE: '所有关键内容必须向中心收敛',
  LOW_DENSITY_RULE: '单屏信息密度 ≤ 5个核心元素',
  DEPTH_LAYER_RULE: 'UI分3层: A世界背景, B内容主体, C行为入口',
  NO_GRID_DOMINATION_RULE: '禁止纯网格卡片UI（除收藏页）',
};

const PAGE_LAYOUT_CONTRACTS = {
  PAGE_EXPLORE: {
    layers: ['WorldBackground', 'Content', 'Action'],
    structure: ['TOP:世界状态标题', 'CENTER:当前节点', 'AROUND:10节点环形分布', 'BOTTOM:进度条'],
    rules: ['不允许列表', '不允许卡片墙'],
  },
  PAGE_AR_CAPTURE: {
    layers: ['CameraFullscreen', 'Overlay'],
    structure: ['CENTER:对准提示环', 'TOP:当前信物名称', 'BOTTOM:触发提示+状态'],
    successState: ['光扩散动画', '信物生成提示', '回响闪现(1句)'],
    rules: ['UI必须最少化存在感'],
  },
  PAGE_06_MY_RELICS: {
    layers: ['WorldOrbitSystem'],
    structure: ['CENTER:当前主信物(放大)', 'ORBIT:已获得信物(环形轨道)', 'RIGHT PANEL:回响文本(1句)'],
    rules: ['禁止卡片列表', '必须天体结构', '每个信物必须有位置'],
  },
  PAGE_07_COLLECTION: {
    layers: ['GalleryWall-ControlledGrid'],
    structure: ['TOP:分类切换(仅:活动/全部)', 'CENTER:用户拍摄记录(卡片,统一模板)'],
    rules: ['可以grid', '不能混信物系统', '不能出现成长语义'],
  },
  PAGE_08_RIGHTS: {
    layers: ['Points', 'Redeemable', 'History'],
    structure: ['TOP:当前积分', 'CENTER:可兑换权益列表(卡片)', 'BOTTOM:历史记录'],
    rules: ['UI必须清晰交易结构', '禁止叙事化设计'],
  },
  PAGE_09_PROFILE: {
    layers: ['Header', 'Stats', 'Settings'],
    structure: ['TOP:用户头像+名称', 'CENTER:简介(1句)+统计信息(≤3项)', 'BOTTOM:设置入口'],
    rules: ['轻量信息结构', '禁止复杂模块化'],
  },
  PAGE_07C_RELIC_DETAIL: {
    layers: ['SingleFocus', 'Echo', 'Origin'],
    structure: ['CENTER:单一信物(最大化)', 'BELOW:回响(1句)', 'BELOW:获得路径(AR来源)'],
    rules: ['绝对单焦点页面', '禁止列表/禁止切换'],
  },
};

const COMPONENT_RULES = {
  CARD: 'only used in collection page, fixed radius, no shadow stacking',
  NODE: 'circular representation only, must support orbit layout',
  CTA: 'AR button is ONLY high-emphasis element',
  TEXT: 'max 2 hierarchy per screen',
};

const SPACING_SYSTEM = ['8px', '12px', '16px', '24px', '32px'];

const MOTION_RULES = {
  preferred: 'reveal-based animation',
  standard: 'fade + drift',
  special: 'AR-triggered burst only',
  rule: 'no aggressive animation, motion must feel natural/breath-like',
};

const FORBIDDEN = [
  'dashboard-style UI',
  'heavy card grids (except collection)',
  'gamification UI',
  'multi-tab semantic mixing',
  'equal-weight modules in one screen',
];

function validatePage(pageType, renderTree) {
  var contract = PAGE_LAYOUT_CONTRACTS[pageType];
  if (!contract) return { valid: true, warnings: [] };

  var warnings = [];

  // Check density: count top-level render nodes
  if (renderTree) {
    var keys = Object.keys(renderTree).filter(function (k) {
      return Array.isArray(renderTree[k]);
    });
    var totalItems = keys.reduce(function (sum, k) { return sum + renderTree[k].length; }, 0);
    if (totalItems > 10) {
      warnings.push('[UI Contract V0.5] [LOW_DENSITY] ' + pageType + ' has ' + totalItems + ' items, consider reducing');
    }
  }

  return { valid: warnings.length === 0, warnings: warnings };
}

module.exports = {
  VERSION: CONTRACT_VERSION,
  VISUAL_PRINCIPLES: VISUAL_PRINCIPLES,
  PAGE_LAYOUT_CONTRACTS: PAGE_LAYOUT_CONTRACTS,
  COMPONENT_RULES: COMPONENT_RULES,
  SPACING_SYSTEM: SPACING_SYSTEM,
  MOTION_RULES: MOTION_RULES,
  FORBIDDEN: FORBIDDEN,
  validatePage: validatePage,
};
