(function (global) {
  function boot(active, crumbs) {
    if (!global.BackofficeShell) return;
    BackofficeShell.mount({
      portal: "park",
      active: active,
      breadcrumbs: crumbs || [{ label: "园区管理" }]
    });
  }
  global.ParkPageBoot = { boot: boot };
})(window);
