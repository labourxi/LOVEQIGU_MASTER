(function (global) {
  function boot(active, crumbs) {
    if (!global.BackofficeShell) return;
    BackofficeShell.mount({
      portal: "merchant",
      active: active,
      breadcrumbs: crumbs || [{ label: "商家工作台" }],
      onLogout: function () {
        try { global.localStorage.removeItem("loveqigu.currentRole"); } catch (e) { /* ignore */ }
        global.location.href = "../../index.html";
      }
    });
  }
  global.MerchantPageBoot = { boot: boot };
})(window);
