(function (global) {
  function boot(active, pageLabel, crumbsExtra) {
    if (!global.PlatformAdminMock || !PlatformAdminMock.requireAuth()) {
      throw new Error("auth");
    }
    var crumbs = [{ label: "平台运营" }, { label: "内容生产", href: "../platform_content_dashboard/index.html" }];
    if (crumbsExtra) crumbs = crumbs.concat(crumbsExtra);
    else if (pageLabel) crumbs.push({ label: pageLabel });
    if (global.PlatformPageBoot) {
      PlatformPageBoot.boot(active, crumbs);
    }
  }
  global.PlatformContentBoot = { boot: boot };
})(window);
