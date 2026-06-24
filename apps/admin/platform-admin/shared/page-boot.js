(function (global) {
  function boot(active, crumbs) {
    if (!global.BackofficeShell) return;
    BackofficeShell.mount({
      portal: "platform",
      active: active,
      breadcrumbs: crumbs || [{ label: "平台运营" }],
      onLogout: function () {
        if (global.PlatformAdminMock) PlatformAdminMock.logout();
        location.href = "../login/index.html";
      }
    });
  }
  global.PlatformPageBoot = { boot: boot };
})(window);