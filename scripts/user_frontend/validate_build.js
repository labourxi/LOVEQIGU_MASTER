const userFrontend = require('../../apps/miniapp/services/user-frontend');
const userProgress = require('../../apps/miniapp/services/user-progress');
const merchantEventService = require('../../apps/miniapp/services/merchant-event');
const arFactory = require('../../apps/miniapp/services/ar-factory');
const { run: validateXrUiDecouple } = require('./validate_xr_ui_decouple');
const { run: validateProductionUiStability } = require('./validate_production_ui_stability');
const { run: validatePilotSceneProduct } = require('./validate_pilot_scene_product');

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function run() {
  if (!validateXrUiDecouple()) {
    throw new Error('XR UI decouple validation failed');
  }
  if (!validateProductionUiStability({ skipXrDecouple: true })) {
    throw new Error('Production UI stability validation failed');
  }
  if (!validatePilotSceneProduct()) {
    throw new Error('Pilot scene product validation failed');
  }

  userProgress.resetForTest();
  userFrontend.logoutMock();
  if (typeof merchantEventService.ensureReadyAsync === 'function') {
    await merchantEventService.ensureReadyAsync();
  }
  if (typeof userFrontend.ensureReadyAsync === 'function') {
    await userFrontend.ensureReadyAsync();
  }
  if (typeof arFactory.ensureReadyAsync === 'function') {
    await arFactory.ensureReadyAsync();
  }

  const beforeLogin = userFrontend.readState();
  assert(!beforeLogin.logged_in, 'expected logged out state');

  const afterLogin = userFrontend.loginMock({ nick_name: '测试游客', user_id: 'mock_user_001' });
  assert(afterLogin.logged_in, 'expected mock login success');
  assert(afterLogin.user.nick_name === '测试游客', 'expected nickname to persist');

  const landing = userFrontend.buildJourneySummary();
  assert(landing.activity && landing.activity.event_name, 'expected activity summary');
  assert(Array.isArray(landing.quickActions) && landing.quickActions.length >= 4, 'expected quick actions');

  const firstPoint = merchantEventService.getActivityOverview(merchantEventService.ACTIVITY_ID).points[0];
  assert(firstPoint && firstPoint.task_id, 'expected first point with task');

  const afterTask = merchantEventService.completeTask(
    merchantEventService.ACTIVITY_ID,
    firstPoint.task_id
  );
  assert(afterTask.stats.completedTaskCount >= 1, 'expected task completion');
  assert(afterTask.stats.ownedRelicCount >= 1, 'expected relic grant after task completion');

  const unlockedCoupon = afterTask.coupons.find((item) => item.status === 'AVAILABLE');
  if (unlockedCoupon) {
    const afterClaim = merchantEventService.claimCoupon(
      merchantEventService.ACTIVITY_ID,
      unlockedCoupon.coupon_id
    );
    assert(
      afterClaim.coupons.some((item) => item.coupon_id === unlockedCoupon.coupon_id && item.status === 'CLAIMED'),
      'expected coupon claim to persist'
    );
  }

  const nav = userFrontend.buildBottomNav('map');
  assert(nav.activeKey === 'map', 'expected active nav key');
  assert(nav.items.some((item) => item.path === '/pages/explore-map/index'), 'expected explore nav item');

  const arBridge = arFactory.getBridgeStatus();
  assert(arBridge.ready, 'expected local AR runtime bridge to be ready');
  assert(
    typeof arBridge.position_guide === 'string' && arBridge.position_guide.includes('position_guide.png'),
    'expected AR position guide asset path'
  );
  assert(
    typeof arBridge.alignment_overlay === 'string' && arBridge.alignment_overlay.includes('alignment_overlay.png'),
    'expected AR alignment overlay asset path'
  );

  console.log('USER_FRONTEND_BUILD_PASS');
}

try {
  Promise.resolve(run()).catch((err) => {
    console.error('USER_FRONTEND_BUILD_FAIL');
    console.error(err && err.stack ? err.stack : err.message);
    process.exitCode = 1;
  });
} catch (err) {
  console.error('USER_FRONTEND_BUILD_FAIL');
  console.error(err && err.stack ? err.stack : err.message);
  process.exitCode = 1;
}
