// ═════════════════════════════════════════════════════════════════════
// V5.9.15 — COMPONENT SAFE RENDER GUARANTEE
//
// If a component fails to resolve or render:
//   DO NOT crash the page
//   Fallback to EmptyState (safe version)
//   minimal UI renderTree
//   neutral layout mode
//
// This is the last line of defense against white screen.
// ═════════════════════════════════════════════════════════════════════

// ═════════════════════════════════════════════════════════════════════
// SAFE FALLBACK RENDER CONFIG
// ═════════════════════════════════════════════════════════════════════

var SAFE_COMPONENT_FALLBACKS = {
  'empty-state': {
    type: 'safe',
    message: '内容加载中',
    icon: 'neutral'
  },
  'user-bottom-nav': {
    // Bottom nav failure is critical — hide nav, content still shows
    activeTab: 'home',
    hidden: true
  },
  'pilot-fx-overlay': {
    // AR overlay failure — non-critical, silently skip
    hidden: true
  },
  'star-activation-ritual': {
    // Ritual animation failure — non-critical, silently skip
    hidden: true
  },
  'celebration-modal': {
    // Modal failure — non-critical, skip modal
    hidden: true
  }
};

var DEFAULT_FALLBACK = {
  type: 'unknown',
  message: '组件加载中',
  hidden: false
};

// ═════════════════════════════════════════════════════════════════════
// GET SAFE RENDER TREE
//
// Returns a minimal renderTree that guarantees safe rendering
// even when all components fail.
// ═════════════════════════════════════════════════════════════════════

function getSafeRenderTree() {
  return {
    loading: false,
    activeTab: 'home',
    kicker: '',
    title: '系统准备中',
    subtitle: '请稍后重试',
    hero: null,
    sections: [],
    background: [],
    awarenessMode: 'balanced',
    _safeFallback: true,
    _safeFallbackLevel: 1,
    _componentGuard: true
  };
}

function getMinimalRenderTree(pageName) {
  return {
    loading: false,
    activeTab: 'home',
    kicker: '探索',
    title: pageName === 'my' ? '个人中心' :
           pageName === 'rights' ? '权益中心' :
           pageName === 'relic' ? '信物' : '探索世界',
    subtitle: '正在加载',
    hero: null,
    sections: [{
      id: 'placeholder',
      title: '',
      items: []
    }],
    background: [],
    awarenessMode: 'balanced',
    _safeFallback: true,
    _safeFallbackLevel: 2,
    _componentGuard: true
  };
}

// ═════════════════════════════════════════════════════════════════════
// COMPONENT FALLBACK HANDLER
//
// Determines the safe behavior when a specific component fails.
// ═════════════════════════════════════════════════════════════════════

function getComponentFallback(componentTag, componentPath) {
  var fallback = SAFE_COMPONENT_FALLBACKS[componentTag];

  if (!fallback) {
    return {
      tag: componentTag,
      path: componentPath,
      hidden: true,
      safeMessage: '组件加载中',
      critical: false
    };
  }

  return {
    tag: componentTag,
    path: componentPath,
    hidden: fallback.hidden || false,
    safeMessage: fallback.message || '组件加载中',
    critical: componentTag === 'empty-state' || componentTag === 'user-bottom-nav'
  };
}

// ═════════════════════════════════════════════════════════════════════
// GENERATE SAFE PAGE DATA
//
// Wraps the original page data with component failure protection.
// If component resolution fails, returns a safe alternative.
// ═════════════════════════════════════════════════════════════════════

function generateSafePageData(originalRenderTree, pageName, componentFailures) {
  // If no failures, return original unchanged
  if (!componentFailures || componentFailures.length === 0) {
    return originalRenderTree;
  }

  // Check if critical components failed
  var hasCriticalFailure = false;
  for (var i = 0; i < componentFailures.length; i++) {
    var fb = getComponentFallback(componentFailures[i].tag, componentFailures[i].path);
    if (fb.critical) {
      hasCriticalFailure = true;
      break;
    }
  }

  // Critical component failure → return safe fallback renderTree
  if (hasCriticalFailure) {
    console.warn('[V5.9.15 COMPONENT GUARD] Critical component failure on ' +
      pageName + '. Using fallback renderTree.');
    return getSafeRenderTree();
  }

  // Non-critical failure → return original with error markers
  if (originalRenderTree) {
    originalRenderTree._componentGuard = true;
    originalRenderTree._componentFailures = componentFailures.map(function(f) { return f.tag; });
  }

  return originalRenderTree || getMinimalRenderTree(pageName);
}

// ═════════════════════════════════════════════════════════════════════
// CHECK COMPONENT SAFETY
//
// Verifies that the page's component dependencies can be safely loaded.
// ═════════════════════════════════════════════════════════════════════

function checkComponentSafety(pageName, usingComponents) {
  var result = {
    safe: true,
    failures: [],
    fallbackRenderTree: null
  };

  if (!usingComponents || typeof usingComponents !== 'object') {
    return result;
  }

  var tags = Object.keys(usingComponents);
  for (var i = 0; i < tags.length; i++) {
    var tag = tags[i];
    var compPath = usingComponents[tag];

    // Check for json suffix — CRITICAL failure
    if (compPath && compPath.endsWith('.json')) {
      result.safe = false;
      result.failures.push({
        tag: tag,
        path: compPath,
        reason: 'Component path ends with .json — resolution guaranteed to fail',
        critical: true
      });
    }

    // Check for single-file reference
    if (compPath && /\.\w+$/.test(compPath)) {
      result.safe = false;
      result.failures.push({
        tag: tag,
        path: compPath,
        reason: 'Single-file component reference — resolution likely to fail',
        critical: true
      });
    }
  }

  // If critical failures, generate fallback
  if (!result.safe) {
    result.fallbackRenderTree = getSafeRenderTree();
  }

  return result;
}

// ═════════════════════════════════════════════════════════════════════
// EXPORTS
// ═════════════════════════════════════════════════════════════════════

module.exports = {
  SAFE_COMPONENT_FALLBACKS: SAFE_COMPONENT_FALLBACKS,
  getSafeRenderTree: getSafeRenderTree,
  getMinimalRenderTree: getMinimalRenderTree,
  getComponentFallback: getComponentFallback,
  generateSafePageData: generateSafePageData,
  checkComponentSafety: checkComponentSafety
};
