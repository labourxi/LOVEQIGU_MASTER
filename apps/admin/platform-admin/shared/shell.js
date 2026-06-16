(function (global) {
  function bindShell(active, breadcrumbLabel, breadcrumbHref) {
    if (!global.BackofficeShell) return;
    var crumbs = [{ label: "平台运营", href: "../index.html" }];
    if (breadcrumbLabel) {
      crumbs.push({ label: breadcrumbLabel, href: breadcrumbHref || null });
    }
    BackofficeShell.mount({
      portal: "platform",
      active: active,
      breadcrumbs: crumbs,
      onLogout: function () {
        global.PlatformAdminMock.logout();
        location.href = "../login/index.html";
      }
    });
  }

  global.PlatformAdminShell = { bindShell: bindShell };
})(window);
