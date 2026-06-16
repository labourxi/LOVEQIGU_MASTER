(function (global) {
  function boot(active, crumbs) {
    if (!global.BackofficeShell) return;
    BackofficeShell.mount({
      portal: "merchant",
      active: active,
      breadcrumbs: crumbs || [{ label: "商家工作台" }]
    });
  }
  global.MerchantPageBoot = { boot: boot };
})(window);
