#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Generate browser-presentable HTML pitch deck."""

import os

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
OUTPUT = os.path.join(ROOT, "docs/product/pitch/AR_YOUBAN_INVESTOR_PITCH_DECK_V1.html")

SLIDES = [
    {"type": "cover", "title": "AR游伴", "subtitle": "看见即是找回", "tag": "空间信物记忆系统 · 文旅数字化基础设施", "conclusion": "AR游伴不是 AR 展示工具，而是让真实空间留下可被记住的探索痕迹。"},
    {"type": "content", "title": "文旅体验的三重断裂", "body": ["游客：打卡一次性，离开即失联", "景区：导览静态页，现场无记忆层", "商家：核销断链，难以承接探索行为", "", "游客 ──╳── 景区 ──╳── 商家", "→ 数据孤岛 · 无记忆 · 无关系 · 无复访"], "conclusion": "游客走完一圈，景区和商家却拿不到可持续的关系资产。"},
    {"type": "content", "title": "数字化做了「上线」，没做成「在场」", "body": ["传统路径：小程序 → 图文介绍 → 优惠券 → 结束", "", "AR游伴补全：空间触发 · 仪式引导 · 信物记忆"], "conclusion": "缺口不在内容多少，而在空间现场是否产生可被记录的关系。"},
    {"type": "content", "title": "万亿文旅市场，正在从「导览」走向「在场操作系统」", "body": ["TAM · 中国文旅消费（万亿级）", "SAM · 景区/文博/城市文化点位数字化", "SOM · 空间信物 + XR 运营基础设施", "→ AR游伴切入点"], "footnote": "市场规模分层为路演框架，需以最新公开报告核验。", "conclusion": "切入文旅场域数字化中「缺失的空间记忆层」。"},
    {"type": "cards", "title": "三个确定性趋势叠加", "cards": [("政策推动", "文化数字化"), ("线下复苏", "体验经济"), ("微信生态", "小程序渗透")], "conclusion": "政策、消费与超级 App 生态为空间运营系统打开窗口期。"},
    {"type": "content", "title": "AR游伴 = 现实空间的信物记忆操作系统", "body": ["空间操作系统层：触发 · 仪式 · 信物 · 关系", "XR 感知层 | Event Bus | 运营回流层"], "conclusion": "把现实空间变成可记录、可运营、可复访的体验结构。"},
    {"type": "cards", "title": "XR 体验 × 信物系统 × 运营 CRM", "cards": [("XR 层", "识别·显现·备用"), ("信物层", "故事进度资产"), ("运营层", "景区·商家·权益")], "note": "信物 ≠ 数字藏品", "conclusion": "现场体验、记忆资产与商业运营的一体化结构。"},
    {"type": "steps", "title": "信物：用户与空间发生关系的记录", "steps": [("空间触发", "XR入口"), ("仪式引导", "探索状态"), ("信物显现", "收藏册"), ("意义沉淀", "今日回响")], "note": "信物 = 故事进度资产 · 藏品 = 传播资产", "conclusion": "可被记住、可被运营、可被回看的空间关系凭证。"},
    {"type": "steps", "title": "进入 → 探索 → 发现 → 获得信物 → 完成", "steps": [("进入景区", "xr_start_v1"), ("探索地图", "space_trail_v1"), ("发现印记", "AR显现"), ("显现信物", "relic_emerge_v1"), ("完成回响", "权益/复访")], "conclusion": "获得可被记住的探索体验，而非积分数字。"},
    {"type": "content", "title": "游客感知：克制、东方、在场", "body": ["视觉：星图·经络·宣纸·淡金", "交互：探索地图·权益中心·个人印记", "语言：探索/显现/回响/礼遇", "边界：无等级·无抽卡·无战力"], "conclusion": "东方空间美学建立文旅信任感与高级感。"},
    {"type": "content", "title": "事件驱动的 XR 运行时，UI 与 XR 解耦", "body": ["UI 层：首页·探索地图·AR入口·信物册·权益中心", "Event Bus：XR_USER_TRIGGER · RELIC_CREATED", "XR Runtime + World Engine"], "conclusion": "可复用、可降级、可运营的空间运行时。"},
    {"type": "content", "title": "真机 XR 优先，备用显现保障交付", "body": ["用户触发 → AR显现 → 成功 → 信物流程", "不支持时 → 备用显现 → 同一闭环"], "conclusion": "景区现场不可控，体验闭环不能断裂。"},
    {"type": "content", "title": "B2B2C：景区付费，商家增值，用户免费探索", "body": ["① 景区 SaaS  ② 内容生产  ③ 商家活动", "④ 运营模块  ⑤ 城市复制授权", "用户端免费探索"], "conclusion": "收入来自空间运营基础设施。"},
    {"type": "pilot", "title": "最小可验证单元：1 景区 3 点位", "conclusion": "跑通进入到信物到权益的完整商业闭环。"},
    {"type": "cards", "title": "90 天试点节奏", "cards": [("0–30天", "勘测·标定·信物"), ("31–60天", "上线·试运行"), ("61–90天", "复盘·复制")], "conclusion": "可复制的景区交付模板与数据基线。"},
    {"type": "table", "title": "每一次探索，都是可运营的关系数据", "headers": ["行为", "输出", "运营"], "rows": [["进入/探索点", "路径图谱", "路径优化"], ["AR显现", "成功率", "设备策略"], ["信物获得", "信物档案", "内容迭代"], ["权益领取", "礼遇转化", "商家协同"]], "conclusion": "信物是用户资产，行为链是景区 CRM。"},
    {"type": "cards", "title": "平台 · 景区 · 商家", "cards": [("平台", "审查·发布"), ("景区", "进度·信物"), ("商家", "核销·礼遇")], "conclusion": "驱动复购与转化的运营语言。"},
    {"type": "content", "title": "四维壁垒", "body": ["空间操作系统定位", "世界观一致性 · 工程可交付 · 商业闭环 · 非游戏化"], "conclusion": "景区可长期运营的空间记忆基础设施。"},
    {"type": "table", "title": "AR游伴 vs 传统方案", "headers": ["维度", "导览小程序", "AR外包", "AR游伴"], "rows": [["空间触发", "弱", "中", "强"], ["信物记忆", "无", "无", "核心"], ["运营后台", "弱", "无", "完整"], ["商业闭环", "券-only", "项目制", "SaaS+运营"]], "highlight": 3, "conclusion": "更完整的景区空间运营系统。"},
    {"type": "steps", "title": "从单景区到城市文化网络", "steps": [("P1", "1景区3点位"), ("P2", "1城市N景区"), ("P3", "城际信物图谱")], "conclusion": "复制 OS 与内容工厂，非一次性项目。"},
    {"type": "content", "title": "传播飞轮 × 商业飞轮", "body": ["传播：显现→分享→新客→信物", "商业：探索→信物→权益→转化→复购", "交汇：空间信物系统"], "conclusion": "传播带来新客，商业带来复购。"},
    {"type": "table", "title": "四方共赢", "headers": ["角色", "价值"], "rows": [["游客", "被记住的探索体验"], ["景区", "可运营现场+数据"], ["商家", "精准到店+转化"], ["平台", "标准化复制"]], "conclusion": "游客记忆·景区关系·商家客流·平台规模。"},
    {"type": "funding", "title": "融资轮次与用途", "conclusion": "推进到可复制的城市级空间网络。"},
    {"type": "steps", "title": "18 个月路线图", "steps": [("Q1", "单景区试点"), ("Q2", "3景区复制"), ("Q3", "城市签约"), ("Q4", "SaaS化")], "conclusion": "可交付、可验收、可复盘。"},
    {"type": "closing", "title": "看见即是找回", "subtitle": "让真实世界留下可被记住的探索痕迹", "conclusion": "寻找认同空间记忆长期价值的同行者。"},
]


def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def render_slide(i, slide):
    n = i + 1
    cls = slide["type"]
    parts = [f'<section class="slide slide--{cls}" data-index="{n}">']
    parts.append('<div class="slide__frame">')
    parts.append('<div class="slide__stars"><span></span><span></span><span></span></div>')
    parts.append(f'<div class="slide__num">{n:02d}</div>')

    if cls == "cover":
        parts.append(f'<h1 class="slide__brand">{esc(slide["title"])}</h1>')
        parts.append(f'<p class="slide__slogan">{esc(slide["subtitle"])}</p>')
        parts.append(f'<p class="slide__tag">{esc(slide["tag"])}</p>')
        parts.append('<p class="slide__meta">LOVEQIGU / ARYOUBAN · 2026</p>')
    elif cls == "closing":
        parts.append(f'<h1 class="slide__brand">{esc(slide["title"])}</h1>')
        parts.append(f'<p class="slide__slogan">{esc(slide["subtitle"])}</p>')
        parts.append('<div class="slide__contact"><p>联系人：[姓名]</p><p>邮箱：[email]</p><p>微信：[二维码]</p></div>')
    else:
        parts.append(f'<h2 class="slide__title">{esc(slide["title"])}</h2>')
        if cls == "content":
            parts.append('<div class="slide__body">')
            for line in slide.get("body", []):
                parts.append(f"<p>{esc(line)}</p>")
            parts.append("</div>")
            if slide.get("footnote"):
                parts.append(f'<p class="slide__footnote">{esc(slide["footnote"])}</p>')
        elif cls == "cards":
            parts.append('<div class="slide__cards">')
            for t, b in slide.get("cards", []):
                parts.append(f'<div class="card"><h3>{esc(t)}</h3><p>{esc(b)}</p></div>')
            parts.append("</div>")
            if slide.get("note"):
                parts.append(f'<p class="slide__note">{esc(slide["note"])}</p>')
        elif cls == "steps":
            parts.append('<div class="slide__steps">')
            for a, b in slide.get("steps", []):
                parts.append(f'<div class="step"><div class="step__dot"></div><h3>{esc(a)}</h3><p>{esc(b)}</p></div>')
            parts.append("</div>")
            if slide.get("note"):
                parts.append(f'<p class="slide__note">{esc(slide["note"])}</p>')
        elif cls == "table":
            parts.append('<table class="slide__table"><thead><tr>')
            for h in slide["headers"]:
                parts.append(f"<th>{esc(h)}</th>")
            parts.append("</tr></thead><tbody>")
            hi = slide.get("highlight")
            for row in slide["rows"]:
                parts.append("<tr>")
                for ci, cell in enumerate(row):
                    c = ' class="hi"' if hi is not None and ci == hi else ""
                    parts.append(f"<td{c}>{esc(cell)}</td>")
                parts.append("</tr>")
            parts.append("</tbody></table>")
        elif cls == "pilot":
            parts.append('<div class="pilot-map"><div class="pilot-map__center">爱企谷</div><div class="pilot-map__nodes"><div>点位A<br>入口仪式</div><div>点位B<br>核心信物</div><div>点位C<br>商家礼遇</div></div></div>')
            parts.append('<p class="slide__note">验证：完成率·信物率·权益率·复访率·传播素材</p>')
        elif cls == "funding":
            parts.append('<div class="funding"><div class="funding__box"><p>轮次：种子轮/Pre-A</p><p>金额：[ ] 万元</p><p>估值：[ ] 万元</p></div><ul class="funding__bars"><li><b>40%</b> 产品与技术</li><li><b>30%</b> 景区试点</li><li><b>20%</b> 内容与运营</li><li><b>10%</b> 合规基建</li></ul></div>')

    parts.append(f'<p class="slide__conclusion">结论 · {esc(slide["conclusion"])}</p>')
    parts.append('<div class="slide__brandmark">AR游伴 · ARYOUBAN</div>')
    parts.append("</div></section>")
    return "\n".join(parts)


CSS = """
:root {
  --ink: #263a34;
  --paper: #f4f1eb;
  --gold: #b68a3d;
  --gray: #6b7280;
  --line: #c9b896;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { height: 100%; background: #1a2421; font-family: "Microsoft YaHei", "PingFang SC", sans-serif; color: var(--ink); }
.deck { height: 100vh; overflow: hidden; position: relative; }
.slide { display: none; height: 100vh; padding: 32px 48px; }
.slide.active { display: flex; align-items: center; justify-content: center; }
.slide--cover, .slide--closing { background: var(--ink); color: var(--paper); }
.slide--cover .slide__frame, .slide--closing .slide__frame,
.slide:not(.slide--cover):not(.slide--closing) .slide__frame {
  width: min(1100px, 96vw); height: min(620px, 88vh); position: relative;
  border-top: 4px solid var(--gold); padding: 40px 48px 56px;
}
.slide:not(.slide--cover):not(.slide--closing) .slide__frame { background: var(--paper); box-shadow: 0 24px 80px rgba(0,0,0,.35); }
.slide--cover .slide__frame, .slide--closing .slide__frame { background: transparent; box-shadow: none; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.slide__stars { position: absolute; top: 20px; right: 28px; display: flex; gap: 10px; align-items: center; }
.slide__stars span { width: 8px; height: 8px; border-radius: 50%; background: var(--gold); display: block; }
.slide__stars::before { content: ""; width: 28px; height: 1px; background: var(--line); order: 2; }
.slide__stars span:nth-child(2) { order: 3; }
.slide__stars span:nth-child(3) { order: 4; }
.slide__num { position: absolute; top: 18px; left: 28px; font-size: 12px; color: var(--gray); letter-spacing: .12em; }
.slide--cover .slide__num, .slide--closing .slide__num { color: var(--line); }
.slide__brand { font-size: clamp(42px, 6vw, 64px); font-weight: 600; letter-spacing: .08em; }
.slide__slogan { font-size: clamp(24px, 3vw, 36px); color: var(--gold); margin-top: 16px; }
.slide__tag, .slide__meta { color: var(--line); margin-top: 20px; font-size: 16px; }
.slide__title { font-size: clamp(26px, 3.2vw, 34px); font-weight: 600; padding-bottom: 12px; border-bottom: 3px solid var(--gold); display: inline-block; margin-bottom: 28px; }
.slide__body p { font-size: 17px; line-height: 1.75; color: var(--ink); margin-bottom: 8px; }
.slide__footnote, .slide__note { font-size: 13px; color: var(--gray); margin-top: 16px; }
.slide__cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 8px; }
.card { background: #fff; border: 1px solid var(--line); border-radius: 12px; padding: 20px; }
.card h3 { font-size: 16px; margin-bottom: 8px; color: var(--ink); }
.card p { font-size: 14px; color: var(--gray); line-height: 1.6; }
.slide__steps { display: flex; gap: 12px; margin-top: 12px; flex-wrap: wrap; }
.step { flex: 1; min-width: 120px; text-align: center; position: relative; }
.step__dot { width: 14px; height: 14px; border-radius: 50%; background: var(--gold); margin: 0 auto 10px; }
.step h3 { font-size: 15px; margin-bottom: 6px; }
.step p { font-size: 13px; color: var(--gray); }
.slide__table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 14px; }
.slide__table th { background: var(--ink); color: var(--paper); padding: 10px 12px; text-align: left; }
.slide__table td { padding: 10px 12px; border-bottom: 1px solid var(--line); }
.slide__table tr:nth-child(even) td { background: rgba(255,255,255,.6); }
.slide__table td.hi { color: var(--gold); font-weight: 600; }
.pilot-map { margin-top: 20px; text-align: center; }
.pilot-map__center { display: inline-block; background: var(--ink); color: var(--paper); padding: 14px 36px; border-radius: 8px; margin-bottom: 28px; }
.pilot-map__nodes { display: flex; justify-content: space-around; gap: 16px; }
.pilot-map__nodes div { background: #fff; border: 1px solid var(--gold); border-radius: 10px; padding: 16px; font-size: 14px; line-height: 1.5; min-width: 120px; }
.funding { display: grid; grid-template-columns: 1fr 1.2fr; gap: 32px; margin-top: 12px; }
.funding__box { background: #fff; border: 1px solid var(--gold); border-radius: 12px; padding: 24px; font-size: 16px; line-height: 2; }
.funding__bars { list-style: none; font-size: 15px; line-height: 2.2; }
.funding__bars b { display: inline-block; width: 42px; color: var(--gold); }
.slide__contact { margin-top: 32px; font-size: 16px; line-height: 2; color: var(--line); }
.slide__conclusion { position: absolute; right: 48px; bottom: 36px; left: 48px; text-align: right; font-size: 12px; color: var(--gray); }
.slide--cover .slide__conclusion, .slide--closing .slide__conclusion { color: var(--line); }
.slide__brandmark { position: absolute; left: 48px; bottom: 36px; font-size: 11px; color: var(--gray); letter-spacing: .06em; }
.slide--cover .slide__brandmark, .slide--closing .slide__brandmark { color: rgba(255,255,255,.35); }
.nav { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); display: flex; gap: 12px; z-index: 99; }
.nav button { background: rgba(38,58,52,.85); color: var(--paper); border: 1px solid var(--line); padding: 8px 18px; border-radius: 20px; cursor: pointer; font-size: 13px; }
.nav button:hover { background: var(--gold); color: var(--ink); }
.hint { position: fixed; top: 12px; left: 50%; transform: translateX(-50%); color: rgba(255,255,255,.45); font-size: 12px; z-index: 99; }
@media print { .nav, .hint { display: none; } .slide { display: flex !important; page-break-after: always; height: auto; min-height: 100vh; } }
"""

JS = """
let cur = 0;
const slides = document.querySelectorAll('.slide');
function show(i) {
  cur = Math.max(0, Math.min(i, slides.length - 1));
  slides.forEach((s, j) => s.classList.toggle('active', j === cur));
}
document.getElementById('prev').onclick = () => show(cur - 1);
document.getElementById('next').onclick = () => show(cur + 1);
document.onkeydown = (e) => {
  if (e.key === 'ArrowRight' || e.key === ' ') show(cur + 1);
  if (e.key === 'ArrowLeft') show(cur - 1);
};
show(0);
"""


def generate():
    slides_html = "\n".join(render_slide(i, s) for i, s in enumerate(SLIDES))
    html = f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AR游伴 · 商业路演</title>
<style>{CSS}</style>
</head>
<body>
<div class="hint">← → 或空格切换幻灯片 · 共 {len(SLIDES)} 页</div>
<main class="deck">
{slides_html}
</main>
<nav class="nav">
  <button type="button" id="prev">上一页</button>
  <button type="button" id="next">下一页</button>
</nav>
<script>{JS}</script>
</body>
</html>"""
    os.makedirs(os.path.dirname(OUTPUT), exist_ok=True)
    with open(OUTPUT, "w", encoding="utf-8") as f:
        f.write(html)
    return OUTPUT


if __name__ == "__main__":
    print(f"HTML_PITCH_GENERATED: {generate()}")
