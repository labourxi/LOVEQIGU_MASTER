(function (global) {
  var PAGE_SIZE = 10;

  var ACTIVITY_MERCHANTS = {
    activity_001: [
      {
        id: "m001", name: "爱企谷咖啡", category: "咖啡饮品", participateStatus: "ACTIVE",
        contact: "张三", phone: "138****0000",
        coupons: [
          { name: "咖啡到店礼", content: "到店享 8 折礼遇", issued: 300, claimed: 180, redeemed: 72, validUntil: "2026-06-30", status: "生效中" },
          { name: "甜品体验礼", content: "满 30 减 5", issued: 100, claimed: 42, redeemed: 16, validUntil: "2026-06-30", status: "生效中" }
        ]
      },
      {
        id: "m002", name: "探索书屋", category: "书店文创", participateStatus: "WARNING",
        contact: "李四", phone: "138****0001",
        coupons: [
          { name: "书店阅读体验券", content: "到店领取书签礼", issued: 120, claimed: 86, redeemed: 12, validUntil: "2026-06-30", status: "生效中" }
        ]
      },
      {
        id: "m003", name: "在地茶舍", category: "茶饮轻食", participateStatus: "INACTIVE",
        contact: "王五", phone: "138****0002",
        coupons: [
          { name: "茶席体验礼", content: "指定茶品第二杯半价", issued: 80, claimed: 24, redeemed: 0, validUntil: "2026-06-30", status: "生效中" }
        ]
      },
      {
        id: "m004", name: "初见花坊", category: "花艺生活", participateStatus: "EXCELLENT",
        contact: "赵六", phone: "138****0003",
        coupons: [
          { name: "花束到店礼", content: "满 88 减 15", issued: 60, claimed: 38, redeemed: 14, validUntil: "2026-06-30", status: "生效中" }
        ]
      },
      {
        id: "m005", name: "谷味小厨", category: "餐饮", participateStatus: "NORMAL",
        contact: "钱七", phone: "138****0004",
        coupons: [
          { name: "午餐协作礼", content: "套餐 9 折", issued: 150, claimed: 52, redeemed: 14, validUntil: "2026-06-30", status: "生效中" }
        ]
      },
      {
        id: "m006", name: "手作工坊", category: "文创体验", participateStatus: "WARNING",
        contact: "孙八", phone: "138****0005",
        coupons: [
          { name: "手作体验券", content: "体验课立减 20 元", issued: 90, claimed: 64, redeemed: 8, validUntil: "2026-06-30", status: "生效中" }
        ]
      },
      {
        id: "m007", name: "亲子乐园角", category: "亲子娱乐", participateStatus: "ACTIVE",
        contact: "周九", phone: "138****0006",
        coupons: [
          { name: "亲子探索礼", content: "入场伴手礼一份", issued: 200, claimed: 96, redeemed: 28, validUntil: "2026-06-30", status: "生效中" }
        ]
      },
      {
        id: "m008", name: "艺廊空间", category: "艺术展览", participateStatus: "NORMAL",
        contact: "吴十", phone: "138****0007",
        coupons: [
          { name: "观展礼遇", content: "免费导览预约", issued: 70, claimed: 32, redeemed: 10, validUntil: "2026-06-30", status: "生效中" }
        ]
      },
      {
        id: "m009", name: "轻食沙拉站", category: "轻食餐饮", participateStatus: "EXCELLENT",
        contact: "郑一", phone: "138****0008",
        coupons: [
          { name: "健康轻食礼", content: "沙拉碗 85 折", issued: 110, claimed: 58, redeemed: 22, validUntil: "2026-06-30", status: "生效中" }
        ]
      },
      {
        id: "m010", name: "复古杂货铺", category: "零售杂货", participateStatus: "WARNING",
        contact: "王二", phone: "138****0009",
        coupons: [
          { name: "杂货到店礼", content: "满 50 减 8", issued: 95, claimed: 70, redeemed: 9, validUntil: "2026-06-30", status: "生效中" }
        ]
      },
      {
        id: "m011", name: "音乐角落", category: "演艺休闲", participateStatus: "PENDING",
        contact: "李三", phone: "138****0010",
        coupons: [
          { name: "演出预约礼", content: "指定场次减 10 元", issued: 50, claimed: 0, redeemed: 0, validUntil: "2026-06-30", status: "待确认" }
        ]
      },
      {
        id: "m012", name: "旧物再生馆", category: "环保文创", participateStatus: "WITHDRAWN",
        contact: "张四", phone: "138****0011",
        coupons: [
          { name: "环保体验券", content: "手作材料包 9 折", issued: 40, claimed: 18, redeemed: 6, validUntil: "2026-06-30", status: "已退出" }
        ]
      }
    ]
  };

  var STATUS_LABEL = {
    ACTIVE: { label: "活跃", cls: "badge-success" },
    EXCELLENT: { label: "表现较好", cls: "badge-success" },
    NORMAL: { label: "正常", cls: "badge-neutral" },
    WARNING: { label: "需关注", cls: "badge-warning" },
    INACTIVE: { label: "未活跃", cls: "badge-neutral" },
    PENDING: { label: "待确认", cls: "badge-warning" },
    WITHDRAWN: { label: "已退出", cls: "badge-neutral" }
  };

  function aggregateCoupons(merchant) {
    var issued = 0, claimed = 0, redeemed = 0;
    merchant.coupons.forEach(function (c) {
      issued += c.issued;
      claimed += c.claimed;
      redeemed += c.redeemed;
    });
    var rate = claimed > 0 ? Math.round((redeemed / claimed) * 100) : 0;
    return { issued: issued, claimed: claimed, redeemed: redeemed, rate: rate };
  }

  function deriveStatus(merchant) {
    if (merchant.participateStatus === "WITHDRAWN") return "WITHDRAWN";
    if (merchant.participateStatus === "PENDING") return "PENDING";
    if (merchant.participateStatus === "INACTIVE") return "INACTIVE";
    var agg = aggregateCoupons(merchant);
    if (agg.rate >= 30) return "EXCELLENT";
    if (agg.claimed >= 50 && agg.rate < 15) return "WARNING";
    if (agg.rate < 10) return "WARNING";
    if (agg.rate >= 10 && agg.rate < 30) return merchant.participateStatus === "WARNING" ? "WARNING" : "NORMAL";
    return merchant.participateStatus || "ACTIVE";
  }

  function statusBadge(code) {
    var s = STATUS_LABEL[code] || STATUS_LABEL.NORMAL;
    return '<span class="badge ' + s.cls + '">' + s.label + "</span>";
  }

  function maskPhone(phone) {
    return phone || "—";
  }

  function getMerchants(activityId) {
    return (ACTIVITY_MERCHANTS[activityId] || ACTIVITY_MERCHANTS.activity_001).slice();
  }

  function getSummary(activityId) {
    var merchants = getMerchants(activityId);
    var couponCount = 0;
    var totalRate = 0;
    var rateCount = 0;
    merchants.forEach(function (m) {
      couponCount += m.coupons.length;
      var agg = aggregateCoupons(m);
      if (agg.claimed > 0) {
        totalRate += agg.rate;
        rateCount++;
      }
    });
    var avgRate = rateCount > 0 ? Math.round(totalRate / rateCount) : 0;
    return {
      merchantCount: merchants.length,
      couponCount: couponCount,
      avgRate: avgRate
    };
  }

  function renderCouponLines(coupons, maxVisible) {
    maxVisible = maxVisible || 3;
    var visible = coupons.slice(0, maxVisible);
    var hidden = coupons.length - visible.length;
    var html = '<ul class="bo-merchant-coupon-list">';
    visible.forEach(function (c) {
      var rate = c.claimed > 0 ? Math.round((c.redeemed / c.claimed) * 100) : 0;
      html +=
        "<li><span class=\"bo-merchant-coupon-list__name\">" + c.name + "</span>" +
        "｜" + c.content +
        "｜发放 " + c.issued + "｜领取 " + c.claimed + "｜核销 " + c.redeemed +
        "｜核销率 " + rate + "%" +
        "｜<span class=\"badge badge-neutral\">" + c.status + "</span></li>";
    });
    if (hidden > 0) {
      html += '<li class="bo-merchant-coupon-list__more">另有 ' + hidden + " 张卡券（Mock 折叠）</li>";
    }
    html += "</ul>";
    return html;
  }

  function renderMerchantCard(merchant) {
    var statusCode = deriveStatus(merchant);
    var agg = aggregateCoupons(merchant);
    return (
      '<article class="bo-merchant-participant-card">' +
        '<div class="bo-merchant-participant-card__main">' +
          '<div class="bo-merchant-participant-card__left">' +
            '<div class="bo-merchant-participant-card__name">' + merchant.name + "</div>" +
            '<div class="bo-merchant-participant-card__meta">' + merchant.category + " · " + merchant.contact + " · " + maskPhone(merchant.phone) + "</div>" +
          "</div>" +
          '<div class="bo-merchant-participant-card__center">' +
            '<div class="bo-merchant-participant-card__label">卡券内容</div>' +
            renderCouponLines(merchant.coupons) +
            '<div class="bo-merchant-participant-card__valid">有效期至 ' + (merchant.coupons[0] ? merchant.coupons[0].validUntil : "—") + "</div>" +
          "</div>" +
          '<div class="bo-merchant-participant-card__right">' +
            '<div class="bo-merchant-participant-card__stats">' +
              '<div><span class="k">发放</span><span class="v">' + agg.issued + "</span></div>" +
              '<div><span class="k">领取</span><span class="v">' + agg.claimed + "</span></div>" +
              '<div><span class="k">核销</span><span class="v">' + agg.redeemed + "</span></div>" +
              '<div><span class="k">核销率</span><span class="v">' + agg.rate + "%</span></div>" +
            "</div>" +
            '<div class="bo-merchant-participant-card__status">' + statusBadge(statusCode) + "</div>" +
          "</div>" +
        "</div>" +
        '<div class="bo-merchant-participant-card__actions">' +
          '<a class="btn" href="../park_admin_merchants/index.html">查看商家数据</a>' +
          '<a class="btn" href="../park_admin_tickets/index.html">提交协作工单</a>' +
        "</div>" +
      "</article>"
    );
  }

  function renderPanel(container, options) {
    if (!container) return;
    options = options || {};
    var activityId = options.activityId || "activity_001";
    var page = options.page || 1;
    var merchants = getMerchants(activityId);
    var summary = getSummary(activityId);
    var totalPages = Math.max(1, Math.ceil(merchants.length / PAGE_SIZE));
    if (page > totalPages) page = totalPages;
    var start = (page - 1) * PAGE_SIZE;
    var pageMerchants = merchants.slice(start, start + PAGE_SIZE);

    var html =
      '<div class="bo-merchant-panel">' +
        '<div class="bo-merchant-panel__summary">' +
          "参与商家 " + summary.merchantCount + " 家 · 卡券 " + summary.couponCount + " 组 · 平均核销率 " + summary.avgRate + "%" +
        "</div>" +
        '<div class="bo-merchant-panel__list">' +
          pageMerchants.map(renderMerchantCard).join("") +
        "</div>";

    if (merchants.length > PAGE_SIZE) {
      html +=
        '<div class="bo-merchant-panel__pager">' +
          '<span class="bo-merchant-panel__pager-info">第 ' + page + " / " + totalPages + " 页 · 每页 " + PAGE_SIZE + " 家</span>" +
          '<div class="bo-merchant-panel__pager-actions">';
      if (page > 1) {
        html += '<button class="btn" type="button" data-merchant-page="' + (page - 1) + '">上一页</button>';
      }
      if (page < totalPages) {
        html += '<button class="btn" type="button" data-merchant-page="' + (page + 1) + '">下一页</button>';
      }
      html += "</div></div>";
    }

    html += "</div>";
    container.innerHTML = html;

    container.querySelectorAll("[data-merchant-page]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var nextPage = parseInt(btn.getAttribute("data-merchant-page"), 10);
        renderPanel(container, { activityId: activityId, page: nextPage });
        if (options.onPageChange) options.onPageChange(nextPage);
      });
    });
  }

  function getPageData(activityId, pagination) {
    var page = (pagination && pagination.page) || 1;
    var merchants = getMerchants(activityId);
    var totalPages = Math.max(1, Math.ceil(merchants.length / PAGE_SIZE));
    if (page > totalPages) page = totalPages;
    var start = (page - 1) * PAGE_SIZE;
    return {
      items: merchants.slice(start, start + PAGE_SIZE),
      total: merchants.length,
      page: page,
      pageSize: PAGE_SIZE,
      totalPages: totalPages,
      summary: getSummary(activityId)
    };
  }

    var el = typeof selector === "string" ? document.querySelector(selector) : selector;
    renderPanel(el, options);
    return el;
  }

  global.ParkActivityMerchants = {
    PAGE_SIZE: PAGE_SIZE,
    getMerchants: getMerchants,
    getPageData: getPageData,
    getSummary: getSummary,
    deriveStatus: deriveStatus,
    statusBadge: statusBadge,
    renderPanel: renderPanel,
    mountPanel: mountPanel
  };
})(window);
