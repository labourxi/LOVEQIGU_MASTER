(function (global) {
  var PARK_NAMES = {
    park_001: "爱企谷",
    park_002: "爱企谷湖畔景区",
    park_003: "爱企谷森林景区",
    park_004: "爱企谷夜游景区"
  };

  function parkViewUrl(parkId) {
    return "../../park-admin/park_admin_dashboard/index.html?asPlatform=1&parkId=" + (parkId || "park_001");
  }

  function applyPlatformDelegateBanner() {
    var params = new URLSearchParams(global.location.search);
    if (params.get("asPlatform") !== "1") return;
    var parkId = params.get("parkId") || "park_001";
    try {
      global.localStorage.setItem("platform_delegate_park_id", parkId);
      global.localStorage.setItem("platform_delegate_mode", "1");
    } catch (e) { /* ignore */ }
    var content = document.querySelector(".bo-content");
    if (!content || document.getElementById("bo-platform-delegate-banner")) return;
    var banner = document.createElement("div");
    banner.id = "bo-platform-delegate-banner";
    banner.className = "bo-platform-delegate-banner";
    banner.innerHTML =
      "<strong>平台代管视图</strong> · 当前景区：" + (PARK_NAMES[parkId] || parkId) +
      ' <a href="../../platform-admin/parks/index.html">返回景区管理</a>';
    content.insertBefore(banner, content.firstChild);
  }

  global.PlatformParkView = {
    PARK_NAMES: PARK_NAMES,
    parkViewUrl: parkViewUrl,
    applyPlatformDelegateBanner: applyPlatformDelegateBanner
  };
})(window);
