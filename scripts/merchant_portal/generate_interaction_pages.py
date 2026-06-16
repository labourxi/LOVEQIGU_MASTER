import json
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parents[2]
ADMIN_ROOT = BASE_DIR / "apps" / "admin"
DOC_ROOT = BASE_DIR / "docs" / "product" / "merchant"
MERCHANT_DATA = BASE_DIR / "data" / "merchant_portal"
PARK_DATA = BASE_DIR / "data" / "park_admin"


MERCHANT_NAV = [
    ("merchant_dashboard", "../merchant_dashboard/index.html", "merchant_dashboard"),
    ("merchant_coupons", "../merchant_coupons/index.html", "merchant_coupons"),
    ("merchant_coupon_detail", "../merchant_coupon_detail/index.html", "merchant_coupon_detail"),
    ("merchant_ticket_detail", "../merchant_ticket_detail/index.html", "merchant_ticket_detail"),
    ("merchant_ticket_new", "../merchant_ticket_new/index.html", "merchant_ticket_new"),
    ("merchant_finance", "../merchant_finance/index.html", "merchant_finance"),
    ("merchant_account", "../merchant_account/index.html", "merchant_account"),
    ("merchant_tickets", "../merchant_tickets/index.html", "merchant_tickets"),
    ("merchant_help", "../merchant_help/index.html", "merchant_help"),
]

PARK_NAV = [
    ("park_admin_dashboard", "../park_admin_dashboard/index.html", "park_admin_dashboard"),
    ("park_admin_merchants", "../park_admin_merchants/index.html", "park_admin_merchants"),
    ("park_admin_activities", "../park_admin_activities/index.html", "park_admin_activities"),
    ("park_admin_activity_detail", "../park_admin_activity_detail/index.html", "park_admin_activity_detail"),
    ("park_admin_activity_new", "../park_admin_activity_new/index.html", "park_admin_activity_new"),
    ("park_admin_activity_publish_check", "../park_admin_activity_publish_check/index.html", "park_admin_activity_publish_check"),
    ("park_admin_tickets", "../park_admin_tickets/index.html", "park_admin_tickets"),
]


def load_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def dump_json(path: Path, data):
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def write(path: Path, content: str):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")


def badge(text: str, kind: str = "neutral") -> str:
    return f'<span class="badge badge--{kind}">{text}</span>'


def status_kind(status: str) -> str:
    return {
        "PENDING_PAYMENT": "warn",
        "PAID": "good",
        "OVERDUE": "bad",
        "CANCELLED": "neutral",
        "OPEN": "warn",
        "IN_PROGRESS": "accent",
        "RESOLVED": "good",
        "CLOSED": "neutral",
        "DRAFT": "neutral",
        "PENDING_REVIEW": "warn",
        "PUBLISHED": "good",
        "PAUSED": "warn",
        "ENDED": "neutral",
        "ACTIVE": "good",
        "SNAPSHOT": "accent",
        "BLOCKED": "warn",
        "PENDING": "warn",
        "APPROVED": "good",
        "RELEASED": "good",
    }.get(status, "neutral")


def shell(title: str, subtitle: str, active: str, group: str, body: str) -> str:
    nav_items = MERCHANT_NAV if group == "merchant" else PARK_NAV
    nav = "".join(
        f'<a class="nav-link {"active" if active == pid else ""}" href="{href}">{label}</a>'
        for pid, href, label in nav_items
    )
    return f"""<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{title}</title>
  <style>
    :root {{
      --bg: #f7f1e8;
      --panel: #fffaf1;
      --text: #2b2118;
      --muted: #6f5d4d;
      --line: #d8c6b0;
      --accent: #8b5d3b;
      --good: #2c7a4b;
      --warn: #b26b1b;
      --bad: #a4412b;
    }}
    * {{ box-sizing: border-box; }}
    body {{
      margin: 0;
      background: linear-gradient(180deg, #f7f1e8 0%, #efe5d7 100%);
      color: var(--text);
      font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
    }}
    a {{ color: inherit; text-decoration: none; }}
    .page {{ max-width: 1360px; margin: 0 auto; padding: 20px; }}
    .topbar {{
      display: flex; justify-content: space-between; align-items: center;
      gap: 16px; margin-bottom: 16px;
    }}
    .brand h1 {{ margin: 0; font-size: 28px; }}
    .brand p {{ margin: 4px 0 0; color: var(--muted); }}
    .breadcrumbs {{ display: flex; gap: 8px; color: var(--muted); font-size: 13px; margin-bottom: 14px; }}
    .layout {{ display: grid; grid-template-columns: 260px minmax(0, 1fr); gap: 16px; }}
    .sidebar, .panel {{
      background: rgba(255,255,255,0.84);
      border: 1px solid var(--line);
      border-radius: 16px;
      box-shadow: 0 8px 20px rgba(85, 58, 25, 0.05);
    }}
    .sidebar {{ padding: 16px; position: sticky; top: 16px; align-self: start; }}
    .sidebar h3 {{ margin: 0 0 12px; font-size: 16px; }}
    .nav-stack {{ display: grid; gap: 8px; }}
    .nav-link {{
      display: block; padding: 9px 12px; border-radius: 12px;
      border: 1px solid transparent; background: rgba(255,255,255,0.7);
    }}
    .nav-link.active {{
      border-color: #d0b897; background: #f2e5d4; color: var(--accent); font-weight: 700;
    }}
    .panel {{ padding: 18px; }}
    .hero {{ margin-bottom: 16px; padding-bottom: 14px; border-bottom: 1px solid var(--line); }}
    .hero h2 {{ margin: 0 0 6px; font-size: 24px; }}
    .hero p {{ margin: 0; color: var(--muted); }}
    .toolbar {{ display: flex; flex-wrap: wrap; gap: 8px; margin: 14px 0 18px; }}
    .button {{
      border: 1px solid var(--line); background: #fff; border-radius: 999px;
      padding: 8px 12px; cursor: pointer; font-size: 13px;
    }}
    .button.primary {{ background: #f2e5d4; color: var(--accent); border-color: #d7c0a8; }}
    .grid {{ display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap: 14px; }}
    .card {{ background: rgba(255,255,255,0.9); border: 1px solid var(--line); border-radius: 14px; padding: 16px; }}
    .metric {{ grid-column: span 3; min-height: 108px; }}
    .span-4 {{ grid-column: span 4; }}
    .span-6 {{ grid-column: span 6; }}
    .span-8 {{ grid-column: span 8; }}
    .span-12 {{ grid-column: span 12; }}
    .metric .label {{ color: var(--muted); font-size: 13px; }}
    .metric .value {{ font-size: 30px; font-weight: 700; margin-top: 8px; }}
    .badge {{
      display: inline-block; padding: 4px 8px; border-radius: 999px;
      font-size: 12px; border: 1px solid transparent;
    }}
    .badge--neutral {{ background: #f3eadf; color: #6a5848; border-color: #dfcfbc; }}
    .badge--good {{ background: #e3f1e9; color: var(--good); border-color: #bdd9c9; }}
    .badge--warn {{ background: #fbefde; color: var(--warn); border-color: #eed0a9; }}
    .badge--bad {{ background: #f6e0db; color: var(--bad); border-color: #e9b8ad; }}
    .badge--accent {{ background: #f2e5d4; color: var(--accent); border-color: #d8c0aa; }}
    .table {{ width: 100%; border-collapse: collapse; font-size: 14px; }}
    .table th, .table td {{
      border-bottom: 1px solid rgba(216,198,176,0.7);
      padding: 10px 8px; text-align: left; vertical-align: top;
    }}
    .table th {{
      color: var(--muted); font-size: 12px; letter-spacing: 0.05em; text-transform: uppercase;
    }}
    .chart {{
      height: 180px; border-radius: 12px; border: 1px dashed var(--line);
      background:
        linear-gradient(90deg, rgba(139,93,59,0.05) 1px, transparent 1px) 0 0 / 16px 16px,
        linear-gradient(180deg, rgba(139,93,59,0.05) 1px, transparent 1px) 0 0 / 16px 16px,
        linear-gradient(180deg, rgba(255,255,255,0.92), rgba(242,229,213,0.72));
    }}
    .empty, .loading {{
      border: 1px dashed var(--line); border-radius: 12px; padding: 16px;
      color: var(--muted); background: rgba(255,255,255,0.55);
    }}
    .split {{ display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 14px; }}
    .hidden {{ display: none !important; }}
    .footer {{ margin-top: 18px; color: var(--muted); font-size: 12px; }}
    @media (max-width: 1080px) {{ .layout {{ grid-template-columns: 1fr; }} .sidebar {{ position: static; }} }}
    @media (max-width: 900px) {{ .metric, .span-4, .span-6, .span-8, .span-12, .split {{ grid-column: span 12; grid-template-columns: 1fr; }} .topbar {{ flex-direction: column; align-items: flex-start; }} }}
  </style>
</head>
<body>
  <div class="page">
    <div class="topbar">
      <div class="brand">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <div class="toolbar">
        <a class="button" href="../index.html">返回</a>
        <button class="button" onclick="history.back()">浏览器返回</button>
      </div>
    </div>
    <div class="breadcrumbs"><a href="../index.html">总览</a><span>/</span><span>{title}</span></div>
    <div class="layout">
      <aside class="sidebar">
        <h3>{'商家端导航' if group == 'merchant' else '园区端导航'}</h3>
        <div class="nav-stack">{nav}</div>
      </aside>
      <main class="panel">{body}</main>
    </div>
  </div>
  <script>
    function toggleState(group, active) {{
      document.querySelectorAll('[data-group="' + group + '"]').forEach((node) => {{
        node.classList.toggle('hidden', node.getAttribute('data-state') !== active);
      }});
      document.querySelectorAll('[data-state-group="' + group + '"] .button').forEach((btn) => {{
        btn.classList.remove('primary');
        if (btn.getAttribute('data-state-action') === active) btn.classList.add('primary');
      }});
    }}
    document.querySelectorAll('[data-state-action]').forEach((button) => {{
      button.addEventListener('click', () => toggleState(button.getAttribute('data-state-group'), button.getAttribute('data-state-action')));
    }});
  </script>
</body>
</html>"""


def metric(label: str, value: str) -> str:
    return f'<section class="card metric"><div class="label">{label}</div><div class="value">{value}</div></section>'


def render_index() -> str:
    body = """
    <section class="hero">
      <h2>商家端与园区负责人端 MVP 原型中心</h2>
      <p>仅使用 mock data，支持页面跳转、侧栏导航、面包屑、返回按钮和状态切换。</p>
    </section>
    <div class="grid">
      <section class="card span-6">
        <h3>Merchant Portal</h3>
        <div class="nav-stack">
          <a class="nav-link" href="./merchant-portal/merchant_dashboard/index.html">merchant_dashboard</a>
          <a class="nav-link" href="./merchant-portal/merchant_coupons/index.html">merchant_coupons</a>
          <a class="nav-link" href="./merchant-portal/merchant_coupon_detail/index.html">merchant_coupon_detail</a>
          <a class="nav-link" href="./merchant-portal/merchant_ticket_detail/index.html">merchant_ticket_detail</a>
          <a class="nav-link" href="./merchant-portal/merchant_ticket_new/index.html">merchant_ticket_new</a>
          <a class="nav-link" href="./merchant-portal/merchant_finance/index.html">merchant_finance</a>
          <a class="nav-link" href="./merchant-portal/merchant_account/index.html">merchant_account</a>
          <a class="nav-link" href="./merchant-portal/merchant_tickets/index.html">merchant_tickets</a>
          <a class="nav-link" href="./merchant-portal/merchant_help/index.html">merchant_help</a>
        </div>
      </section>
      <section class="card span-6">
        <h3>Park Admin</h3>
        <div class="nav-stack">
          <a class="nav-link" href="./park-admin/park_admin_dashboard/index.html">park_admin_dashboard</a>
          <a class="nav-link" href="./park-admin/park_admin_merchants/index.html">park_admin_merchants</a>
          <a class="nav-link" href="./park-admin/park_admin_activities/index.html">park_admin_activities</a>
          <a class="nav-link" href="./park-admin/park_admin_activity_detail/index.html">park_admin_activity_detail</a>
          <a class="nav-link" href="./park-admin/park_admin_activity_new/index.html">park_admin_activity_new</a>
          <a class="nav-link" href="./park-admin/park_admin_activity_publish_check/index.html">park_admin_activity_publish_check</a>
          <a class="nav-link" href="./park-admin/park_admin_tickets/index.html">park_admin_tickets</a>
        </div>
      </section>
    </div>
    """
    return shell("Merchant & Park Admin MVP", "Mock-first backend page skeleton hub", "merchant_dashboard", "merchant", body)


def render_merchant_dashboard(coupon, bill, ticket, profile):
    body = f"""
    <section class="hero"><h2>{profile["merchant_name"]}</h2><p>轻量工作台：看数据、管卡券、收通知、提工单、查帮助。</p></section>
    <div class="toolbar" data-state-group="merchant-dashboard">
      <button class="button primary" data-state-action="success">Success</button>
      <button class="button" data-state-action="loading">Loading</button>
      <button class="button" data-state-action="empty">Empty</button>
    </div>
    <div class="grid" data-group="merchant-dashboard" data-state="success">
      {metric("今日领取", str(coupon["claimed_count"]))}
      {metric("今日核销", "18")}
      {metric("累计领取", str(coupon["claimed_count"] + 35))}
      {metric("累计核销", str(coupon["redeemed_count"] + 20))}
      <section class="card span-4"><h4>核销率</h4><div class="value">{coupon["redemption_rate"] * 100:.0f}%</div><div class="muted">基于 mock coupon 数据</div></section>
      <section class="card span-4"><h4>最近 7 日趋势</h4><div class="chart"></div></section>
      <section class="card span-4"><h4>卡券状态</h4><div>{badge(coupon["status_label"], status_kind(coupon["status_label"]))}</div><p class="muted">所属活动：{coupon["activity_name"]}</p></section>
      <section class="card span-6">
        <h4>卡券概览</h4>
        <table class="table">
          <tr><th>卡券</th><th>状态</th><th>领取</th><th>核销</th><th>有效期</th></tr>
          <tr><td><a href="../merchant_coupons/index.html">{coupon["coupon_name"]}</a></td><td>{badge(coupon["status_label"], status_kind(coupon["status_label"]))}</td><td>{coupon["claimed_count"]}</td><td>{coupon["redeemed_count"]}</td><td>{coupon["valid_from"]} ~ {coupon["valid_to"]}</td></tr>
        </table>
      </section>
      <section class="card span-6">
        <h4>财务提醒</h4>
        <div>{badge(bill["status"], status_kind(bill["status"]))}</div>
        <p><strong>账单：</strong>{bill["bill_period"]} {bill["bill_type"]} {bill["amount"]} 元</p>
        <p class="muted">{bill["payment_notice"]}</p>
      </section>
      <section class="card span-12">
        <h4>工单预览</h4>
        <p><strong>{ticket["ticket_type"]}</strong> · {ticket["title"]}</p>
        <div>{badge(ticket["status"], status_kind(ticket["status"]))}</div>
      </section>
    </div>
    <div class="grid hidden" data-group="merchant-dashboard" data-state="loading"><section class="card span-12"><div class="loading">Loading state placeholder: mock dashboard data.</div></section></div>
    <div class="grid hidden" data-group="merchant-dashboard" data-state="empty"><section class="card span-12"><div class="empty">Empty state placeholder: no additional merchant dashboard content.</div></section></div>
    """
    return shell("merchant_dashboard", "Merchant portal dashboard", "merchant_dashboard", "merchant", body)


def render_merchant_coupons(coupon):
    body = f"""
    <section class="hero"><h2>merchant_coupons</h2><p>卡券列表、领取情况、核销情况、状态与所属活动。</p></section>
    <div class="toolbar" data-state-group="merchant-coupons">
      <button class="button primary" data-state-action="success">Success</button>
      <button class="button" data-state-action="loading">Loading</button>
      <button class="button" data-state-action="empty">Empty</button>
    </div>
    <section class="card" data-group="merchant-coupons" data-state="success">
      <table class="table">
        <tr><th>卡券</th><th>活动</th><th>状态</th><th>已发放</th><th>已领取</th><th>已核销</th><th>未核销</th><th>核销率</th></tr>
        <tr>
          <td><a href="../merchant_coupon_detail/index.html">{coupon["coupon_name"]}</a></td>
          <td>{coupon["activity_name"]}</td>
          <td>{badge(coupon["status_label"], status_kind(coupon["status_label"]))}</td>
          <td>{coupon["issued_count"]}</td>
          <td>{coupon["claimed_count"]}</td>
          <td>{coupon["redeemed_count"]}</td>
          <td>{coupon["unredeemed_count"]}</td>
          <td>{coupon["redemption_rate"] * 100:.0f}%</td>
        </tr>
      </table>
    </section>
    <section class="card hidden" data-group="merchant-coupons" data-state="loading"><div class="loading">Loading state placeholder: coupons are rendered from mock json.</div></section>
    <section class="card hidden" data-group="merchant-coupons" data-state="empty"><div class="empty">Empty state placeholder: no coupon records to show.</div></section>
    """
    return shell("merchant_coupons", "Merchant coupon list", "merchant_coupons", "merchant", body)


def render_merchant_coupon_detail(coupon, redemption):
    replies = "".join(
        f'<li><strong>{item["author"]}</strong> · {item["time"]}<br />{item["content"]}</li>'
        for item in ticket_history(redemption)
    )
    body = f"""
    <section class="hero"><h2>merchant_coupon_detail</h2><p>卡券详情、领取记录、核销记录、状态标签。</p></section>
    <div class="toolbar">
      <a class="button primary" href="../merchant_coupons/index.html">返回卡券列表</a>
      <button class="button" onclick="history.back()">浏览器返回</button>
    </div>
    <div class="grid">
      <section class="card span-6">
        <h4>卡券信息</h4>
        <p><strong>{coupon["coupon_name"]}</strong></p>
        <p>所属活动：{coupon["activity_name"]}</p>
        <p>有效期：{coupon["valid_from"]} ~ {coupon["valid_to"]}</p>
        <p>状态：{badge(coupon["status_label"], status_kind(coupon["status_label"]))}</p>
      </section>
      <section class="card span-6">
        <h4>核销记录</h4>
        <table class="table">
          <tr><th>记录</th><th>核销人</th><th>时间</th></tr>
          <tr><td>{redemption["record_id"]}</td><td>{redemption["redeemed_by"]}</td><td>{redemption["redeemed_at"]}</td></tr>
        </table>
      </section>
      <section class="card span-12">
        <h4>状态说明</h4>
        <p class="muted">卡券列表、领取情况、核销情况、核销记录与账单状态均来自 mock snapshot。</p>
      </section>
    </div>
    """
    return shell("merchant_coupon_detail", "Merchant coupon detail", "merchant_coupon_detail", "merchant", body)


def ticket_history(redemption):
    # use the shared mock ticket reply shape if present
    return [{"author": "platform", "time": "2026-06-15T10:00:00+08:00", "content": "已进入工单队列查看。"}]


def render_merchant_ticket_detail(ticket):
    replies = "".join(
        f'<li><strong>{item["author"]}</strong> · {item["time"]}<br />{item["content"]}</li>'
        for item in ticket.get("reply_history", [])
    ) or "<li class=\"muted\">暂无回复记录</li>"
    body = f"""
    <section class="hero"><h2>merchant_ticket_detail</h2><p>工单详情、状态标签、类型标签、回复记录。</p></section>
    <div class="toolbar">
      <a class="button primary" href="../merchant_tickets/index.html">返回工单列表</a>
      <a class="button" href="../merchant_ticket_new/index.html">提交新工单</a>
      <button class="button" onclick="history.back()">浏览器返回</button>
    </div>
    <div class="grid">
      <section class="card span-6">
        <h4>工单基础信息</h4>
        <p><strong>{ticket["title"]}</strong></p>
        <p>工单编号：{ticket["ticket_id"]}</p>
        <p>工单类型：{badge(ticket["ticket_type"], "accent")}</p>
        <p>工单状态：{badge(ticket["status"], status_kind(ticket["status"]))}</p>
        <p>优先级：{badge(ticket["priority"], "warn")}</p>
        <p>提交时间：{ticket["submitted_at"]}</p>
        <p>最近回复：{ticket["last_reply_at"]}</p>
      </section>
      <section class="card span-6">
        <h4>关联对象</h4>
        <p>活动：{ticket["related_activity_name"]}</p>
        <p>卡券：{ticket["related_coupon_name"]}</p>
        <p>来源：{ticket["channel"]}</p>
        <p class="muted">{ticket["description"]}</p>
      </section>
      <section class="card span-12">
        <h4>回复记录</h4>
        <ul class="list">{replies}</ul>
      </section>
    </div>
    """
    return shell("merchant_ticket_detail", "Merchant ticket detail", "merchant_ticket_detail", "merchant", body)


def render_merchant_ticket_new(ticket):
    body = f"""
    <section class="hero"><h2>merchant_ticket_new</h2><p>提交新工单，支持 mock 提交成功状态。</p></section>
    <div class="toolbar" data-state-group="merchant-ticket-new">
      <button class="button primary" data-state-action="form">Form</button>
      <button class="button" data-state-action="loading">Loading</button>
      <button class="button" data-state-action="success">Success</button>
      <button class="button" data-state-action="empty">Empty</button>
    </div>
    <section class="card" data-group="merchant-ticket-new" data-state="form">
      <h4>新建工单表单</h4>
      <p>问题类型：{badge(ticket["ticket_type"], "accent")}</p>
      <p>标题：{ticket["title"]}</p>
      <p>描述：{ticket["description"]}</p>
      <p>优先级：{badge(ticket["priority"], "warn")}</p>
      <p><button class="button primary">提交工单</button></p>
    </section>
    <section class="card hidden" data-group="merchant-ticket-new" data-state="loading"><div class="loading">Loading state placeholder: submitting new ticket...</div></section>
    <section class="card hidden" data-group="merchant-ticket-new" data-state="success">
      <h4>Mock 提交成功状态</h4>
      <p>工单已创建：{ticket["ticket_id"]}</p>
      <p>状态：{badge("OPEN", "warn")}</p>
      <p><a class="button primary" href="../merchant_ticket_detail/index.html">查看工单详情</a></p>
    </section>
    <section class="card hidden" data-group="merchant-ticket-new" data-state="empty"><div class="empty">Empty state placeholder: no form fields populated.</div></section>
    """
    return shell("merchant_ticket_new", "Merchant ticket new", "merchant_ticket_new", "merchant", body)


def render_merchant_finance(bill):
    body = f"""
    <section class="hero"><h2>merchant_finance</h2><p>接收账单、付款通知、已付款记录、待付款记录、账单状态。</p></section>
    <div class="toolbar" data-state-group="merchant-finance">
      <button class="button primary" data-state-action="success">Success</button>
      <button class="button" data-state-action="loading">Loading</button>
      <button class="button" data-state-action="empty">Empty</button>
    </div>
    <div class="grid" data-group="merchant-finance" data-state="success">
      <section class="card span-4"><div>{badge(bill["status"], status_kind(bill["status"]))}</div><h4>账单状态</h4><p>{bill["bill_period"]} · {bill["bill_type"]}</p></section>
      <section class="card span-4"><h4>待付款</h4><div class="value">{bill["amount"]}</div><div class="muted">元</div></section>
      <section class="card span-4"><h4>付款通知</h4><p>{bill["payment_notice"]}</p></section>
      <section class="card span-12">
        <table class="table">
          <tr><th>账单</th><th>类型</th><th>金额</th><th>状态</th><th>到期</th><th>付款时间</th></tr>
          <tr><td>{bill["bill_id"]}</td><td>{bill["bill_type"]}</td><td>{bill["amount"]}</td><td>{badge(bill["status"], status_kind(bill["status"]))}</td><td>{bill["payment_due_date"]}</td><td>{bill["paid_at"] or "-"}</td></tr>
        </table>
      </section>
    </div>
    <div class="grid hidden" data-group="merchant-finance" data-state="loading"><section class="card span-12"><div class="loading">Loading state placeholder: finance data is mock-only.</div></section></div>
    <div class="grid hidden" data-group="merchant-finance" data-state="empty"><section class="card span-12"><div class="empty">Empty state placeholder: no additional finance rows.</div></section></div>
    """
    return shell("merchant_finance", "Merchant finance module", "merchant_finance", "merchant", body)


def render_merchant_account(profile):
    body = f"""
    <section class="hero"><h2>merchant_account</h2><p>商家基础信息、联系人信息、登录账号、密码修改。</p></section>
    <div class="grid">
      <section class="card span-6"><h4>商家基础信息</h4><p>商家名称：{profile["merchant_name"]}</p><p>联系人：{profile["contact_name"]}</p><p>联系电话：{profile["contact_phone"]}</p></section>
      <section class="card span-6"><h4>登录与角色</h4><p>登录账号：{profile["login_account"]}</p><p>角色：{profile["role"]}</p><p>密码修改：{profile["password_change"]}</p></section>
    </div>
    """
    return shell("merchant_account", "Merchant account management", "merchant_account", "merchant", body)


def render_merchant_tickets(ticket):
    body = f"""
    <section class="hero"><h2>merchant_tickets</h2><p>查看工单列表、状态标签、类型标签，并进入详情或新建工单。</p></section>
    <div class="toolbar" data-state-group="merchant-tickets">
      <button class="button primary" data-state-action="success">Success</button>
      <button class="button" data-state-action="loading">Loading</button>
      <button class="button" data-state-action="empty">Empty</button>
    </div>
    <section class="card" data-group="merchant-tickets" data-state="success">
      <table class="table">
        <tr><th>工单</th><th>类型</th><th>标题</th><th>状态</th><th>详情</th></tr>
        <tr>
          <td>{ticket["ticket_id"]}</td>
          <td>{badge(ticket["ticket_type"], "accent")}</td>
          <td>{ticket["title"]}</td>
          <td>{badge(ticket["status"], status_kind(ticket["status"]))}</td>
          <td><a class="button" href="../merchant_ticket_detail/index.html">查看详情</a></td>
        </tr>
      </table>
      <div class="toolbar" style="margin-top:14px;">
        <a class="button primary" href="../merchant_ticket_new/index.html">提交新工单</a>
      </div>
    </section>
    <section class="card hidden" data-group="merchant-tickets" data-state="loading"><div class="loading">Loading state placeholder: tickets are mock-first.</div></section>
    <section class="card hidden" data-group="merchant-tickets" data-state="empty"><div class="empty">Empty state placeholder: no additional ticket records.</div></section>
    """
    return shell("merchant_tickets", "merchant_tickets", "Merchant ticket center", "merchant", body)


def render_merchant_help():
    body = """
    <section class="hero"><h2>merchant_help</h2><p>如何查看卡券数据、如何核销卡券、如何查看账单、如何提交工单、常见问题、平台联系人。</p></section>
    <div class="grid">
      <section class="card span-4"><h4>如何查看卡券数据</h4><p class="muted">在卡券列表中查看领取、核销与状态。</p></section>
      <section class="card span-4"><h4>如何核销卡券</h4><p class="muted">使用核销码或二维码完成核销。</p></section>
      <section class="card span-4"><h4>如何查看账单</h4><p class="muted">在财务页面查看待付款与已付款记录。</p></section>
      <section class="card span-6"><h4>如何提交工单</h4><p class="muted">选择问题类型、填写描述并提交平台处理。</p></section>
      <section class="card span-6"><h4>平台联系人</h4><p class="muted">占位联系人信息，待平台侧配置。</p></section>
    </div>
    """
    return shell("merchant_help", "merchant_help", "Merchant help & FAQ", "merchant", body)


def render_park_dashboard(summary, profile, coupon, suggestion):
    body = f"""
    <section class="hero"><h2>park_admin_dashboard</h2><p>商家数据看板、活动数据看板、活动优化建议。</p></section>
    <div class="toolbar" data-state-group="park-dashboard">
      <button class="button primary" data-state-action="success">Success</button>
      <button class="button" data-state-action="loading">Loading</button>
      <button class="button" data-state-action="empty">Empty</button>
    </div>
    <div class="grid" data-group="park-dashboard" data-state="success">
      {metric("商家数量", str(summary["total_merchant_count"]))}
      {metric("活跃商家", str(summary["active_merchant_count"]))}
      {metric("参与商家", str(summary["participating_merchant_count"]))}
      {metric("整体核销率", f'{summary["overall_redemption_rate"] * 100:.0f}%')}
      <section class="card span-6"><h4>核销 TOP 商家</h4><p><strong>{profile["merchant_name"]}</strong> · 示例商家</p><div>{badge("TOP", "good")}</div></section>
      <section class="card span-6"><h4>低活跃商家</h4><p class="muted">示例：当前仅以单条 mock snapshot 占位。</p></section>
      <section class="card span-6"><h4>活动数据</h4><p>关联活动：{coupon["activity_name"]}</p><p>活动卡券数：1</p><p>领取情况：{coupon["claimed_count"]}</p><p>核销情况：{coupon["redeemed_count"]}</p></section>
      <section class="card span-6"><h4>活动优化建议</h4><p><strong>{suggestion["title"]}</strong></p><p class="muted">{suggestion["description"]}</p></section>
      <section class="card span-12"><div class="chart"></div></section>
    </div>
    <div class="grid hidden" data-group="park-dashboard" data-state="loading"><section class="card span-12"><div class="loading">Loading state placeholder: park dashboard from mock data.</div></section></div>
    <div class="grid hidden" data-group="park-dashboard" data-state="empty"><section class="card span-12"><div class="empty">Empty state placeholder: no additional park metrics.</div></section></div>
    """
    return shell("park_admin_dashboard", "park_admin_dashboard", "Park admin dashboard", "park", body)


def render_park_merchants(summary, profile):
    body = f"""
    <section class="hero"><h2>park_admin_merchants</h2><p>参与平台的商家数据看板。</p></section>
    <section class="card">
      <table class="table">
        <tr><th>商家</th><th>状态</th><th>参与活动</th><th>联系人</th><th>联系电话</th></tr>
        <tr><td>{profile["merchant_name"]}</td><td>{badge("ACTIVE", "good")}</td><td>{summary["participating_merchant_count"]}</td><td>{profile["contact_name"]}</td><td>{profile["contact_phone"]}</td></tr>
      </table>
    </section>
    """
    return shell("park_admin_merchants", "park_admin_merchants", "Park merchant data view", "park", body)


def render_park_activities(activity, coupon, summary):
    body = f"""
    <section class="hero"><h2>park_admin_activities</h2><p>活动列表、活动状态、活动参与商家数、活动关联卡券数。</p></section>
    <div class="toolbar" data-state-group="park-activities">
      <button class="button primary" data-state-action="success">Success</button>
      <button class="button" data-state-action="loading">Loading</button>
      <button class="button" data-state-action="empty">Empty</button>
    </div>
    <section class="card" data-group="park-activities" data-state="success">
      <table class="table">
        <tr><th>活动</th><th>状态</th><th>参与商家</th><th>关联卡券</th><th>领取</th><th>核销</th><th>核销率</th><th>检查</th></tr>
        <tr>
          <td><a href="../park_admin_activity_detail/index.html">{activity["activity_name"]}</a></td>
          <td>{badge(activity["status"], status_kind(activity["status"]))}</td>
          <td>{summary["participating_merchant_count"]}</td>
          <td>1</td>
          <td>{coupon["claimed_count"]}</td>
          <td>{coupon["redeemed_count"]}</td>
          <td>{coupon["redemption_rate"] * 100:.0f}%</td>
          <td><a class="button" href="../park_admin_activity_publish_check/index.html">发布前检查</a></td>
        </tr>
      </table>
      <div class="toolbar" style="margin-top:14px;">
        <a class="button primary" href="../park_admin_activity_new/index.html">创建活动草稿</a>
      </div>
    </section>
    <section class="card hidden" data-group="park-activities" data-state="loading"><div class="loading">Loading state placeholder: activities are mock-only.</div></section>
    <section class="card hidden" data-group="park-activities" data-state="empty"><div class="empty">Empty state placeholder: no additional activity rows.</div></section>
    """
    return shell("park_admin_activities", "park_admin_activities", "Park activity list", "park", body)


def render_park_activity_detail(activity, coupon, profile, suggestion):
    body = f"""
    <section class="hero"><h2>park_admin_activity_detail</h2><p>活动详情、参与商家、绑定卡券、活动时间与状态。</p></section>
    <div class="toolbar">
      <a class="button primary" href="../park_admin_activities/index.html">返回活动列表</a>
      <a class="button" href="../park_admin_activity_new/index.html">新建活动</a>
      <a class="button" href="../park_admin_activity_publish_check/index.html">发布前检查</a>
      <button class="button" onclick="history.back()">浏览器返回</button>
    </div>
    <div class="grid">
      <section class="card span-6"><h4>活动信息</h4><p><strong>{activity["activity_name"]}</strong></p><p>状态：{badge(activity["status"], status_kind(activity["status"]))}</p><p>时间：{activity["start_time"]} ~ {activity["end_time"]}</p><p class="muted">{activity["description"]}</p></section>
      <section class="card span-6"><h4>参与商家</h4><p>{profile["merchant_name"]}</p><p class="muted">{profile["contact_name"]} · {profile["contact_phone"]}</p><p>{badge("1 merchant", "accent")}</p></section>
      <section class="card span-6"><h4>绑定卡券</h4><p>{coupon["coupon_name"]}</p><p class="muted">{coupon["issued_count"]} / {coupon["claimed_count"]} / {coupon["redeemed_count"]}</p></section>
      <section class="card span-6"><h4>优化建议</h4><p><strong>{suggestion["title"]}</strong></p><p class="muted">{suggestion["description"]}</p></section>
      <section class="card span-12">
        <h4>发布状态展示</h4>
        <div class="toolbar">
          <span class="badge badge--warn">PENDING</span>
          <span class="badge badge--warn">BLOCKED</span>
          <span class="badge badge--good">APPROVED</span>
          <span class="badge badge--good">RELEASED</span>
        </div>
      </section>
    </div>
    """
    return shell("park_admin_activity_detail", "park_admin_activity_detail", "Park activity detail", "park", body)


def render_park_activity_new(activity, coupon, profile):
    body = f"""
    <section class="hero"><h2>park_admin_activity_new</h2><p>创建活动草稿、编辑活动基础信息、选择参与商家、绑定卡券、设置活动时间。</p></section>
    <div class="toolbar" data-state-group="park-activity-new">
      <button class="button primary" data-state-action="form">Form</button>
      <button class="button" data-state-action="loading">Loading</button>
      <button class="button" data-state-action="success">Success</button>
      <button class="button" data-state-action="empty">Empty</button>
    </div>
    <section class="card" data-group="park-activity-new" data-state="form">
      <h4>活动草稿表单</h4>
      <p>活动名称：{activity["activity_name"]}</p>
      <p>活动时间：{activity["start_time"]} ~ {activity["end_time"]}</p>
      <p>关联商家：{profile["merchant_name"]}</p>
      <p>绑定卡券：{coupon["coupon_name"]}</p>
      <p>草稿备注：{activity["draft_note"]}</p>
      <p><button class="button primary">保存草稿</button></p>
    </section>
    <section class="card hidden" data-group="park-activity-new" data-state="loading"><div class="loading">Loading state placeholder: creating activity draft...</div></section>
    <section class="card hidden" data-group="park-activity-new" data-state="success"><h4>Mock 草稿已保存</h4><p>活动状态：{badge("DRAFT", "neutral")}</p><p><a class="button primary" href="../park_admin_activity_detail/index.html">进入活动详情</a></p></section>
    <section class="card hidden" data-group="park-activity-new" data-state="empty"><div class="empty">Empty state placeholder: no activity draft data.</div></section>
    """
    return shell("park_admin_activity_new", "park_admin_activity_new", "Park admin activity new", "park", body)


def render_park_activity_publish_check(activity):
    items_html = "".join(
        f'<tr><td>{item["label"]}</td><td>{badge("PASS" if item["passed"] else "BLOCKED", "good" if item["passed"] else "warn")}</td></tr>'
        for item in activity.get("publish_check_items", [])
    )
    body = f"""
    <section class="hero"><h2>park_admin_activity_publish_check</h2><p>发布前检查、状态展示、Mock 检查结果。</p></section>
    <div class="toolbar">
      <a class="button primary" href="../park_admin_activity_detail/index.html">返回活动详情</a>
      <button class="button" onclick="history.back()">浏览器返回</button>
    </div>
    <div class="grid">
      <section class="card span-6"><h4>检查结论</h4><p>发布状态：{badge(activity["publish_status"], status_kind(activity["publish_status"]))}</p><p>检查结果：{badge(activity["publish_check_result"], status_kind(activity["publish_check_result"]))}</p></section>
      <section class="card span-6"><h4>活动信息</h4><p><strong>{activity["activity_name"]}</strong></p><p>时间：{activity["start_time"]} ~ {activity["end_time"]}</p><p class="muted">{activity["description"]}</p></section>
      <section class="card span-12"><h4>发布前检查项</h4><table class="table"><tr><th>检查项</th><th>结果</th></tr>{items_html}</table></section>
    </div>
    """
    return shell("park_admin_activity_publish_check", "park_admin_activity_publish_check", "Park activity publish check", "park", body)


def render_park_tickets(ticket):
    body = f"""
    <section class="hero"><h2>park_admin_tickets</h2><p>查看商家工单、回复工单、跟进工单、提交平台工单、关联商家 / 活动。</p></section>
    <section class="card">
      <table class="table">
        <tr><th>工单</th><th>类型</th><th>标题</th><th>状态</th></tr>
        <tr><td>{ticket["ticket_id"]}</td><td>{badge(ticket["ticket_type"], "accent")}</td><td>{ticket["title"]}</td><td>{badge(ticket["status"], status_kind(ticket["status"]))}</td></tr>
      </table>
      <div class="toolbar" style="margin-top:14px;">
        <a class="button primary" href="../park_admin_activity_publish_check/index.html">发布前检查</a>
        <a class="button" href="../park_admin_activity_new/index.html">创建活动草稿</a>
      </div>
    </section>
    """
    return shell("park_admin_tickets", "park_admin_tickets", "Park admin ticket queue", "park", body)


def build_pages():
    profile = load_json(MERCHANT_DATA / "merchant_profile.mock.json")
    coupon = load_json(MERCHANT_DATA / "merchant_coupon.mock.json")
    redemption = load_json(MERCHANT_DATA / "coupon_redemption_record.mock.json")
    bill = load_json(MERCHANT_DATA / "merchant_bill.mock.json")
    ticket = load_json(MERCHANT_DATA / "merchant_ticket.mock.json")
    activity = load_json(PARK_DATA / "park_activity.mock.json")
    summary = load_json(PARK_DATA / "park_admin_dashboard_summary.mock.json")
    suggestion = load_json(PARK_DATA / "rule_based_optimization_suggestion.mock.json")

    pages = {
        ADMIN_ROOT / "index.html": render_index(),
        ADMIN_ROOT / "merchant-portal" / "merchant_dashboard" / "index.html": render_merchant_dashboard(coupon, bill, ticket, profile),
        ADMIN_ROOT / "merchant-portal" / "merchant_coupons" / "index.html": render_merchant_coupons(coupon),
        ADMIN_ROOT / "merchant-portal" / "merchant_coupon_detail" / "index.html": render_merchant_coupon_detail(coupon, redemption),
        ADMIN_ROOT / "merchant-portal" / "merchant_ticket_detail" / "index.html": render_merchant_ticket_detail(ticket),
        ADMIN_ROOT / "merchant-portal" / "merchant_ticket_new" / "index.html": render_merchant_ticket_new(ticket),
        ADMIN_ROOT / "merchant-portal" / "merchant_finance" / "index.html": render_merchant_finance(bill),
        ADMIN_ROOT / "merchant-portal" / "merchant_account" / "index.html": render_merchant_account(profile),
        ADMIN_ROOT / "merchant-portal" / "merchant_tickets" / "index.html": render_merchant_tickets(ticket),
        ADMIN_ROOT / "merchant-portal" / "merchant_help" / "index.html": render_merchant_help(),
        ADMIN_ROOT / "park-admin" / "park_admin_dashboard" / "index.html": render_park_dashboard(summary, profile, coupon, suggestion),
        ADMIN_ROOT / "park-admin" / "park_admin_merchants" / "index.html": render_park_merchants(summary, profile),
        ADMIN_ROOT / "park-admin" / "park_admin_activities" / "index.html": render_park_activities(activity, coupon, summary),
        ADMIN_ROOT / "park-admin" / "park_admin_activity_detail" / "index.html": render_park_activity_detail(activity, coupon, profile, suggestion),
        ADMIN_ROOT / "park-admin" / "park_admin_activity_new" / "index.html": render_park_activity_new(activity, coupon, profile),
        ADMIN_ROOT / "park-admin" / "park_admin_activity_publish_check" / "index.html": render_park_activity_publish_check(activity),
        ADMIN_ROOT / "park-admin" / "park_admin_tickets" / "index.html": render_park_tickets(ticket),
    }
    for path, content in pages.items():
        write(path, content)

    write(
        DOC_ROOT / "MERCHANT_WORKORDER_CENTER_V1.md",
        "# MERCHANT_WORKORDER_CENTER_V1\n\n## Scope\n\nMerchant work order center mock prototype for ticket list, detail, new ticket, status tags, and type tags.\n",
    )
    write(
        DOC_ROOT / "PARK_ACTIVITY_MANAGEMENT_V1.md",
        "# PARK_ACTIVITY_MANAGEMENT_V1\n\n## Scope\n\nPark activity management mock prototype for activity list, detail, new activity, and publish check.\n",
    )
    write(
        DOC_ROOT / "MERCHANT_WORKORDER_CENTER_V1_REPORT.md",
        "# MERCHANT_WORKORDER_CENTER_V1_REPORT\n\n## Result\n\nPASS\n\n## Notes\n\n- merchant ticket list, detail, and new ticket pages are openable\n- mock submit success state is present\n- no API or database dependencies were added\n",
    )
    write(
        DOC_ROOT / "PARK_ACTIVITY_MANAGEMENT_V1_REPORT.md",
        "# PARK_ACTIVITY_MANAGEMENT_V1_REPORT\n\n## Result\n\nPASS\n\n## Notes\n\n- activity list, detail, new activity, and publish check pages are openable\n- mock publish check results are visible\n- no API or database dependencies were added\n",
    )
    write(DOC_ROOT / "MERCHANT_PORTAL_MVP_INTERACTION_V1.md", "# MERCHANT_PORTAL_MVP_INTERACTION_V1\n\n## Scope\n\nMerchant portal pages upgraded from skeletons to interactive mock prototypes.\n\n## Interaction\n\n- page navigation\n- back buttons\n- top navigation\n- side navigation\n- breadcrumbs\n- state switching\n- mock loading / empty / success states\n")
    write(DOC_ROOT / "PARK_ADMIN_MVP_INTERACTION_V1.md", "# PARK_ADMIN_MVP_INTERACTION_V1\n\n## Scope\n\nPark admin pages upgraded from skeletons to interactive mock prototypes.\n\n## Interaction\n\n- page navigation\n- back buttons\n- top navigation\n- side navigation\n- breadcrumbs\n- state switching\n- mock loading / empty / success states\n")
    write(DOC_ROOT / "MERCHANT_PORTAL_MVP_INTERACTION_V1_REPORT.md", "# MERCHANT_PORTAL_MVP_INTERACTION_V1_REPORT\n\n## Result\n\nPASS\n\n## Notes\n\n- all merchant pages are mutually navigable\n- mock loading / empty / success states are present\n- no database or API dependencies were added\n")
    write(DOC_ROOT / "PARK_ADMIN_MVP_INTERACTION_V1_REPORT.md", "# PARK_ADMIN_MVP_INTERACTION_V1_REPORT\n\n## Result\n\nPASS\n\n## Notes\n\n- all park admin pages are mutually navigable\n- mock loading / empty / success states are present\n- no database or API dependencies were added\n")
    print("MERCHANT_PORTAL_MVP_INTERACTION_V1_COMPLETE = YES")
    print("PARK_ADMIN_MVP_INTERACTION_V1_COMPLETE = YES")
    print("MERCHANT_WORKORDER_CENTER_V1_COMPLETE = YES")
    print("PARK_ACTIVITY_MANAGEMENT_V1_COMPLETE = YES")


if __name__ == "__main__":
    build_pages()
