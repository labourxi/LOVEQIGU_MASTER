from __future__ import annotations

import json
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
DATA_DIR = ROOT / "data" / "merchant_event"
PAGES_DIR = ROOT / "pages" / "merchant-event"


def load_json(path: Path) -> Any:
    with path.open("r", encoding="utf-8") as fh:
        return json.load(fh)


def write(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")


def render_page(title: str, subtitle: str, body: str) -> str:
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
    .page {{ max-width: 1280px; margin: 0 auto; padding: 20px; }}
    .topbar {{ display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 16px; }}
    .brand h1 {{ margin: 0; font-size: 28px; }}
    .brand p {{ margin: 4px 0 0; color: var(--muted); }}
    .toolbar {{ display: flex; gap: 8px; flex-wrap: wrap; }}
    .button {{
      border: 1px solid var(--line);
      background: #fff;
      border-radius: 999px;
      padding: 8px 12px;
      cursor: pointer;
      font-size: 13px;
    }}
    .button.primary {{ background: #f2e5d4; color: var(--accent); border-color: #d7c0a8; }}
    .breadcrumbs {{ display: flex; gap: 8px; align-items: center; color: var(--muted); font-size: 13px; margin-bottom: 14px; }}
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
    .nav-link {{ display: block; padding: 9px 12px; border-radius: 12px; border: 1px solid transparent; background: rgba(255,255,255,0.7); }}
    .nav-link.active {{ border-color: #d0b897; background: #f2e5d4; color: var(--accent); font-weight: 700; }}
    .panel {{ padding: 18px; }}
    .hero {{ margin-bottom: 16px; padding-bottom: 14px; border-bottom: 1px solid var(--line); }}
    .hero h2 {{ margin: 0 0 6px; font-size: 24px; }}
    .hero p {{ margin: 0; color: var(--muted); }}
    .grid {{ display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap: 14px; }}
    .card {{
      background: rgba(255,255,255,0.9);
      border: 1px solid var(--line);
      border-radius: 14px;
      padding: 16px;
    }}
    .metric {{ grid-column: span 3; min-height: 104px; }}
    .span-4 {{ grid-column: span 4; }}
    .span-6 {{ grid-column: span 6; }}
    .span-8 {{ grid-column: span 8; }}
    .span-12 {{ grid-column: span 12; }}
    .metric .label {{ color: var(--muted); font-size: 13px; }}
    .metric .value {{ font-size: 28px; font-weight: 700; margin-top: 8px; }}
    .badge {{
      display: inline-block;
      padding: 4px 8px;
      border-radius: 999px;
      font-size: 12px;
      border: 1px solid transparent;
    }}
    .badge--neutral {{ background: #f3eadf; color: #6a5848; border-color: #dfcfbc; }}
    .badge--good {{ background: #e3f1e9; color: var(--good); border-color: #bdd9c9; }}
    .badge--warn {{ background: #fbefde; color: var(--warn); border-color: #eed0a9; }}
    .badge--bad {{ background: #f6e0db; color: var(--bad); border-color: #e9b8ad; }}
    .badge--accent {{ background: #f2e5d4; color: var(--accent); border-color: #d8c0aa; }}
    .list {{ display: grid; gap: 10px; }}
    .item {{
      border: 1px solid var(--line);
      border-radius: 12px;
      padding: 12px;
      background: rgba(255,255,255,0.7);
    }}
    .table {{ width: 100%; border-collapse: collapse; font-size: 14px; }}
    .table th, .table td {{ border-bottom: 1px solid rgba(216,198,176,0.7); padding: 10px 8px; text-align: left; vertical-align: top; }}
    .table th {{ color: var(--muted); font-size: 12px; letter-spacing: 0.05em; text-transform: uppercase; }}
    .chart {{
      height: 160px;
      border-radius: 12px;
      border: 1px dashed var(--line);
      background:
        linear-gradient(90deg, rgba(139,93,59,0.05) 1px, transparent 1px) 0 0 / 16px 16px,
        linear-gradient(180deg, rgba(139,93,59,0.05) 1px, transparent 1px) 0 0 / 16px 16px,
        linear-gradient(180deg, rgba(255,255,255,0.92), rgba(242,229,213,0.72));
    }}
    .empty, .loading {{
      border: 1px dashed var(--line);
      border-radius: 12px;
      padding: 16px;
      color: var(--muted);
      background: rgba(255,255,255,0.55);
    }}
    .hidden {{ display: none !important; }}
    @media (max-width: 1080px) {{
      .layout {{ grid-template-columns: 1fr; }}
      .sidebar {{ position: static; }}
    }}
    @media (max-width: 900px) {{
      .metric, .span-4, .span-6, .span-8, .span-12 {{ grid-column: span 12; }}
      .topbar {{ flex-direction: column; align-items: flex-start; }}
    }}
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
        <a class="button" href="./index.html">返回首页</a>
        <button class="button" onclick="history.back()">返回</button>
      </div>
    </div>
    {body}
  </div>
</body>
</html>"""


def render_index(activity: dict, points: list[dict], tasks: list[dict], relics: list[dict]) -> str:
    merchant_names = {m["merchant_id"]: m["merchant_name"] for m in load_json(DATA_DIR / "merchants.seed.json")}
    point_task_counts = {p["task_id"]: 1 for p in points}
    point_rows = "".join(
        f"<tr><td>{p['point_name']}</td><td>{merchant_names.get(p['merchant_id'], p['merchant_id'])}</td><td>{point_task_counts.get(p['task_id'], 1)}</td></tr>"
        for p in points
    )
    task_rows = "".join(
        f"<tr><td>{t['task_name']}</td><td>{t['task_type']}</td><td>{t['task_reward']}</td><td>未开始</td></tr>"
        for t in tasks
    )
    relic_cards = "".join(
        f"<div class='item'><strong>{r['relic_name']}</strong><div><span class='badge badge--accent'>{r['rarity']}</span></div><p>{r['story_snippet']}</p></div>"
        for r in relics
    )
    return render_page(
        "merchant-event",
        "爱企谷初见寻宝节活动入口",
        f"""
    <div class="hero">
      <h2>{activity['event_name']}</h2>
      <p>{activity['description']}</p>
      <div class="toolbar" style="margin-top:12px;">
        <span class="badge badge--neutral">{activity['status']}</span>
        <span class="badge badge--accent">开始时间 {activity['start_time']}</span>
        <span class="badge badge--accent">结束时间 {activity['end_time']}</span>
      </div>
    </div>
    <div class="grid">
      <section class="card span-12">
        <h3>活动头图区域</h3>
        <div class="chart"></div>
      </section>
      <section class="card span-12">
        <h3>探索点列表</h3>
        <table class="table">
          <tr><th>point_name</th><th>merchant_name</th><th>task_count</th></tr>
          {point_rows}
        </table>
      </section>
      <section class="card span-12">
        <h3>任务列表</h3>
        <table class="table">
          <tr><th>task_name</th><th>task_type</th><th>task_reward</th><th>status</th></tr>
          {task_rows}
        </table>
      </section>
      <section class="card span-12">
        <h3>信物展示</h3>
        <div class="list">{relic_cards}</div>
      </section>
      <section class="card span-12">
        <a class="button primary" href="./exploration.html">开始探索</a>
      </section>
    </div>
        """,
    )


def render_exploration(points: list[dict]) -> str:
    merchant_names = {m["merchant_id"]: m["merchant_name"] for m in load_json(DATA_DIR / "merchants.seed.json")}
    cards = "".join(
        f"<a class='item' href='./detail.html?point_id={p['point_id']}'><strong>{p['point_name']}</strong><div class='muted'>{merchant_names.get(p['merchant_id'], p['merchant_id'])}</div><div class='muted'>关联任务：{p['task_id']}</div></a>"
        for p in points
    )
    return render_page(
        "merchant-event / exploration",
        "探索点浏览页",
        f"""
    <div class="hero"><h2>探索点列表</h2><p>点击进入详情</p></div>
    <div class="grid">
      <section class="card span-12">
        <div class="list">{cards}</div>
      </section>
    </div>
        """,
    )


def render_detail(points: list[dict], tasks: list[dict], relics: list[dict], merchants: list[dict]) -> str:
    point = points[0]
    task = next((item for item in tasks if item["task_id"] == point["task_id"]), tasks[0])
    merchant = next((item for item in merchants if item["merchant_id"] == point["merchant_id"]), merchants[0])
    relic = relics[0]
    return render_page(
        "merchant-event / detail",
        "探索点详情页",
        f"""
    <div class="hero"><h2>{point['point_name']}</h2><p>关联任务 / 信物 / 商家信息</p></div>
    <div class="grid">
      <section class="card span-6">
        <h3>探索点信息</h3>
        <p><strong>point_id:</strong> {point['point_id']}</p>
        <p><strong>merchant_id:</strong> {point['merchant_id']}</p>
        <p><strong>gps_placeholder:</strong> {point['gps_placeholder']}</p>
      </section>
      <section class="card span-6">
        <h3>关联任务</h3>
        <p><strong>{task['task_name']}</strong></p>
        <p>{task['task_type']}</p>
        <p>{task['task_reward']}</p>
      </section>
      <section class="card span-6">
        <h3>关联信物</h3>
        <p><strong>{relic['relic_name']}</strong></p>
        <p>{relic['rarity']}</p>
        <p>{relic['story_snippet']}</p>
      </section>
      <section class="card span-6">
        <h3>关联商家</h3>
        <p><strong>{merchant['merchant_name']}</strong></p>
        <p>{merchant['merchant_type']}</p>
        <p>{merchant['coupon_template_id']}</p>
      </section>
    </div>
        """,
    )


def main() -> None:
    activity = load_json(DATA_DIR / "activity.seed.json")
    points = load_json(DATA_DIR / "exploration_points.seed.json")
    tasks = load_json(DATA_DIR / "tasks.seed.json")
    relics = load_json(DATA_DIR / "relics.seed.json")
    merchants = load_json(DATA_DIR / "merchants.seed.json")
    index_html = render_index(activity, points, tasks, relics)
    exploration_html = render_exploration(points)
    detail_html = render_detail(points, tasks, relics, merchants)
    write(PAGES_DIR / "index.html", index_html)
    write(PAGES_DIR / "exploration.html", exploration_html)
    write(PAGES_DIR / "detail.html", detail_html)
    print("EVENT_ENTRY_PAGE_GENERATION_PASS")


if __name__ == "__main__":
    main()
