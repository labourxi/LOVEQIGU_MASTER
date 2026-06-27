/**
 * LANDING — 登录页逻辑（V2 视觉版）
 *
 * 职责：
 *   ✔ 仅保留微信登录按钮
 *   ✔ 登录成功后调用 bootstrap()
 *   ✔ 启动世界动效
 *
 * 禁止：
 *   ❌ world初始化
 *   ❌ scene加载
 *   ❌ UI点击扩展
 *   ❌ 不得修改 world engine / state machine
 */

(function () {
  'use strict';

  var loginBtn = document.getElementById('login-btn');
  var errorMsg = document.getElementById('error-msg');

  // ─── 启动世界动效（从 motion.js 加载，纯视觉，无业务逻辑） ───
  (function initWorldMotion() {
    import('../../system/visual/motion.js').then(function (motion) {
      motion.startMotion(function () {
        motion.updateFog();
        motion.updateLight();
        motion.updateStars();
      });
      console.log('[landing] 世界动效已启动');
    }).catch(function () {
      // motion 不可用时静默降级
    });
  })();

  /**
   * 微信登录处理函数。
   * 登录成功后跳转至 explore 页。
   */
  window.handleLogin = function () {
    loginBtn.classList.add('loading');
    errorMsg.textContent = '';

    simulateWxLogin()
      .then(function (result) {
        if (result.success) {
          window.location.href = '../explore/explore.html?userId=' + encodeURIComponent(result.userId);
        } else {
          throw new Error(result.error || '登录失败');
        }
      })
      .catch(function (err) {
        loginBtn.classList.remove('loading');
        errorMsg.textContent = '登录失败: ' + err.message;
      });
  };

  /**
   * 模拟微信登录。
   */
  function simulateWxLogin() {
    return new Promise(function (resolve) {
      setTimeout(function () {
        var userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
        resolve({ success: true, userId: userId, error: null });
      }, 1200);
    });
  }

  console.log('[landing] 页面已加载，等待用户登录');
})();
