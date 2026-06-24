(function (global) {
  function boot(active, crumbs) {
    if (!global.BackofficeShell) return;
    BackofficeShell.mount({
      portal: "park",
      active: active,
      breadcrumbs: crumbs || [{ label: "园区管理" }],
      onLogout: function () {
        try { global.localStorage.removeItem("loveqigu.currentRole"); } catch (e) { /* ignore */ }
        global.location.href = "../../index.html";
      }
    });
  }
  global.ParkPageBoot = { boot: boot };
})(window);
