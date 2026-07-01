// ═══════════════════════════════════════════════════════
// MY_PAGE_DIAGNOSTIC
// 粘贴到微信开发者工具 Console 运行
// ═══════════════════════════════════════════════════════

console.log('=== MY PAGE DIAGNOSTIC ===');

try {
  var app = getApp();
  console.log('[1] App globalData keys:', Object.keys(app.globalData));
  console.log('[2] worldRuntimeStore:', app.globalData.worldRuntimeStore ? 'present' : 'NULL');
  
  var store = app.globalData.worldRuntimeStore;
  if (store) {
    console.log('[3] store.buildMyRenderTree:', typeof store.buildMyRenderTree);
    var tree = store.buildMyRenderTree();
    console.log('[4] RenderTree keys:', Object.keys(tree));
    console.log('[5] stats:', JSON.stringify(tree.stats));
    console.log('[6] quickActions count:', tree.quickActions ? tree.quickActions.length : 0);
    console.log('[7] functionModules count:', tree.functionModules ? tree.functionModules.length : 0);
    console.log('[8] settings count:', tree.settings ? tree.settings.length : 0);
    console.log('[9] userProfile:', JSON.stringify(tree.userProfile));
  } else {
    console.log('[3] Store is NULL — check app.js bootWorldRuntimeStore()');
  }
  
  // Check current page data
  var pages = getCurrentPages();
  console.log('[10] Current pages:', pages.length);
  for (var i = 0; i < pages.length; i++) {
    var p = pages[i];
    if (p.route && p.route.indexOf('/my/') !== -1) {
      console.log('[11] Found my page:', p.route);
      console.log('[12] page.data.stats:', JSON.stringify(p.data.stats));
      console.log('[13] page.data.quickActions:', p.data.quickActions ? p.data.quickActions.length : 'missing');
      console.log('[14] page.data.functionModules:', p.data.functionModules ? p.data.functionModules.length : 'missing');
      console.log('[15] page.data.settings:', p.data.settings ? p.data.settings.length : 'missing');
      console.log('[16] page.data.userProfile:', JSON.stringify(p.data.userProfile));
    }
  }
  
  // FORCE FIX: override page data with store data
  if (store && pages.length > 0) {
    for (var i = 0; i < pages.length; i++) {
      if (pages[i].route && pages[i].route.indexOf('/my/') !== -1) {
        console.log('\n*** FORCE REFRESH: Injecting store data into page ***');
        var newData = store.buildMyRenderTree();
        newData.activeTab = 'me';
        newData.hasRelics = newData.stats && newData.stats.relicCount > 0;
        newData.relicCount = newData.stats ? newData.stats.relicCount : 0;
        newData.hasRights = newData.stats && newData.stats.rights > 0;
        newData.rightsCount = newData.stats ? newData.stats.rights : 0;
        pages[i].setData(newData);
        console.log('FORCE REFRESH COMPLETE — check the page now!');
      }
    }
  }
} catch(e) {
  console.error('DIAGNOSTIC ERROR:', e.message);
}
