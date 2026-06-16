#!/usr/bin/env python3
"""CH09 Content Fill — placeholder → active."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SOURCE_REF = "docs/content/canon/CH09_CONTENT_CANON_V1.md"
CHAPTER_ID = "ch09_field_echo_future"
TITLE = "未来之约"


def load(rel: str) -> dict:
    return json.loads((ROOT / rel).read_text(encoding="utf-8"))


def save(rel: str, data: dict) -> None:
    (ROOT / rel).write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def fill_story() -> None:
    data = load("data/story/ch09_chapters.json")
    data["status"] = "active"
    data["source_ref"] = SOURCE_REF
    data["canonical_boundary"] = (
        "CH09 Story Layer. Five-awareness chapter structure; uses registered CH09 node and relic identifiers. "
        "No new lore. No Canon Gap fill."
    )
    ch = data["chapters"][0]
    ch["status"] = "active"
    ch["canonical_boundary"] = (
        "Five-awareness chapter structure; independent imprint album H; continues after CH08 without new Canon history."
    )
    ch["summary"] = (
        "CH09 Story Layer container. Five awareness points on the future path; "
        "influence becomes visible without new Cosmology."
    )
    save("data/story/ch09_chapters.json", data)


def fill_relics() -> None:
    data = load("data/relics/ch09_relics.json")
    data["status"] = "active"
    data["source_ref"] = SOURCE_REF
    data["canonical_boundary"] = (
        "CH09 Relic Layer. Story progression assets. Independent album H. "
        "No rarity, rank, level, or equipment semantics."
    )
    save("data/relics/ch09_relics.json", data)


def fill_rights() -> None:
    data = load("data/rights/ch09_rights.json")
    data["status"] = "active"
    data["source_ref"] = SOURCE_REF
    data["canonical_boundary"] = (
        "CH09 Rights Layer. Commercial and jieyuan functions isolated from ritual chain. "
        "No new lore. No Canon Gap fill."
    )
    updates = {
        "right_ch09_structure_preview": {
            "description": f"记念《{TITLE}》章节结构入口。用于查看探索动线与结缘商城入口，不承载云门仪式链。",
            "canonical_boundary": "Preview only; no Canon expansion; no ritual-chain insertion.",
        },
        "right_ch09_jieyuan_free_latte": {
            "description": "记念连接延伸探索完成后，可在结缘商城领取免费拿铁结缘礼。探索完成后可免费领取，同账号仅可获得一次。",
            "canonical_boundary": "L1 redemption only; separated from L3 relic future at n3_extended_connections.",
        },
        "right_ch09_jieyuan_cafe_discount": {
            "description": f"记念《{TITLE}》探索记念与心愿值记存达成后，可在结缘商城查看咖啡五折券等结缘礼。",
            "canonical_boundary": "Commercial follow-up only; not a chapter rank reward or Relic substitute.",
        },
        "right_ch09_share_poster": {
            "description": f"记念《{TITLE}》章成后，可生成分享海报。传播资产由用户主动生成，不写入信物持有库。",
            "canonical_boundary": "Routes to Digital Collectible flow; zero Relic progression effect.",
        },
        "right_ch09_coupon_wallet": {
            "description": "记念结缘商城中的卡券持有入口。用于查看已领取结缘礼与核销状态，不替代信物档案。",
            "canonical_boundary": "Account surface only; isolated from Relic archive and ritual chain.",
            "redemption": {"enabled": False, "surface": "我的卡券", "copy": "卡券列表占位，未连接真实核销数据。"},
        },
    }
    for right in data["rights"]:
        patch = updates.get(right["id"], {})
        right.update(patch)
    save("data/rights/ch09_rights.json", data)


def fill_ar() -> None:
    data = load("data/ar/ch09_ar-events.json")
    data["status"] = "active"
    data["source_ref"] = SOURCE_REF
    data["canonical_boundary"] = (
        "CH09 AR Event Layer. Field experience and closure entry. No new lore. No Canon Gap fill."
    )
    save("data/ar/ch09_ar-events.json", data)


def write_dc_registry() -> None:
    path = ROOT / "docs/content/DIGITAL_COLLECTIBLE_REGISTRY_CH09.md"
    path.write_text(
        """# Digital Collectible Registry — CH09

> **文件标识**：`DIGITAL_COLLECTIBLE_REGISTRY_CH09.md`  
> **版本**：V1.0  
> **日期**：2026-06-08  
> **状态**：Active · CH09 Digital Collectible 登记册  
> **层级**：L2 · Marketing / Communication Asset Registry  
> **性质**：**传播资产登记 · 不进入 Story Progression · 不替代 Relic / Rights**

---

## §1 登记实体 — `dc_ch09_future_poster`

| 字段 | 值 |
|------|-----|
| **token_id** | `dc_ch09_future_poster` |
| **name** | 未来之约分享海报 |
| **display_name** | 《未来之约》章成分享海报 |
| **asset_type** | `DIGITAL_COLLECTIBLE` |
| **asset_role** | `marketing_asset` |
| **subtype** | `share_poster` |
| **story_state_effect** | **`none`** |
| **relic_progression_effect** | **`none`** |
| **affects_章成_logic** | **`false`** |
| **chapter_id** | `ch09_field_echo_future` |

> AR ref: `ar_ch09_completion_v1` · Routes via `right_ch09_share_poster` · 不写入信物库。

---

`DIGITAL_COLLECTIBLE_REGISTRY_CH09_COMPLETE = YES`
""",
        encoding="utf-8",
    )


if __name__ == "__main__":
    fill_story()
    fill_relics()
    fill_rights()
    fill_ar()
    write_dc_registry()
    print("CH09 content fill complete")
