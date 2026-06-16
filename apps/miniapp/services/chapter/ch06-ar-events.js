module.exports = {
  "schema": "loveqigu.ar.events.v1",
  "version": "1.0.0",
  "source": "CH06_CONTENT_CANON_V1",
  "layer": "L2",
  "language_layer": "L2_PRODUCT",
  "status": "active",
  "source_ref": "docs/content/canon/CH06_CONTENT_CANON_V1.md",
  "story_ref": "data/story/ch06_chapters.json",
  "relic_ref": "data/relics/ch06_relics.json",
  "rights_ref": "data/rights/ch06_rights.json",
  "canonical_boundary": "CH06 AR Event Layer. Field experience and closure entry. No new lore. No Canon Gap fill.",
  "chapter_context": {
    "chapter_id": "ch06_field_completion",
    "chapter_code": "CH06",
    "chapter_title": "归位觉醒",
    "display_title": "《归位觉醒》"
  },
  "asset_boundary": {
    "ar_event": "Field visualization and approved closure entry; does not create 云门 state.",
    "relic": "AR output may reference Relic context; Relic progression remains deterministic from exploration.",
    "rights": "L1 redemption refs stay outside ritual closure chain.",
    "digital_collectible": "Share outputs are user-initiated; zero Relic progression effect."
  },
  "events": [
    {
      "id": "ar_ch06_field_gate_v1",
      "code": "AR_CH06_FIELD_GATE_V1",
      "name": "觉醒场域",
      "chapter_id": "ch06_field_completion",
      "node_id": "n1_field",
      "node_title": "场域·觉醒到场",
      "status": "available",
      "interaction": "location_gate",
      "camera_enabled": false,
      "fake_ar_enabled": true,
      "description": "记念场域·觉醒到场处的场域体验。归位觉醒是 L2 章节题名，不是新地理或可被占有的关卡。",
      "copy": "预览觉醒场域，不请求 live AR 权限。",
      "relic_refs": [
        "relic_ch06_completion_badge",
        "relic_ch06_gate_imprint_f"
      ],
      "rights_refs": [],
      "digital_collectible_refs": [],
      "canonical_boundary": "Field completion visualization only; 归位觉醒 is L2 chapter title, not new geography."
    },
    {
      "id": "ar_ch06_imprint_completion_v1",
      "code": "AR_CH06_IMPRINT_COMPLETION_V1",
      "name": "觉醒残印",
      "chapter_id": "ch06_field_completion",
      "node_id": "n1_field",
      "node_title": "场域·觉醒到场",
      "status": "available",
      "interaction": "imprint_particles",
      "camera_enabled": false,
      "fake_ar_enabled": true,
      "description": "记念场域处探索记录的觉醒印迹显现。残印是连接曾经存在过的证据，不是收藏数量。",
      "copy": "预览觉醒印迹粒子场域，不定义残印形成机制。",
      "relic_refs": [
        "relic_ch06_gate_imprint_f"
      ],
      "rights_refs": [],
      "digital_collectible_refs": [],
      "canonical_boundary": "Does not define imprint formation mechanics; album F independent from prior chapters."
    },
    {
      "id": "ar_ch06_reflection_awareness_v1",
      "code": "AR_CH06_REFLECTION_AWARENESS_V1",
      "name": "回望镜见证",
      "chapter_id": "ch06_field_completion",
      "node_id": "n2_reflection",
      "node_title": "回望镜·见证",
      "status": "available",
      "interaction": "awareness_prompt",
      "camera_enabled": false,
      "fake_ar_enabled": true,
      "description": "记念回望镜·见证处的场域体验。不是获得新的答案，而是看见已经发生的改变。",
      "copy": "预览回望镜见证场域，承接第二处觉察。",
      "relic_refs": [
        "relic_ch06_reflection_mirror"
      ],
      "rights_refs": [],
      "digital_collectible_refs": [],
      "canonical_boundary": "Uses existing field context only; no new Cosmology or lore."
    },
    {
      "id": "ar_ch06_human_completion_v1",
      "code": "AR_CH06_HUMAN_COMPLETION_V1",
      "name": "人间觉醒场域",
      "chapter_id": "ch06_field_completion",
      "node_id": "n3_human_completion",
      "node_title": "谷里咖啡·人间觉醒",
      "status": "available",
      "interaction": "human_field_presence",
      "camera_enabled": false,
      "fake_ar_enabled": true,
      "description": "记念谷里咖啡·人间觉醒处的场域体验。一次服务、一杯咖啡、一次真实相遇，连接仍可在真实相遇处被照见。",
      "copy": "预览人间觉醒场域；权益礼遇在探索完成后于权益中心触达。",
      "relic_refs": [
        "relic_ch06_human_completion"
      ],
      "rights_refs": [
        "right_ch06_jieyuan_free_latte"
      ],
      "digital_collectible_refs": [],
      "canonical_boundary": "L1 redemption stays outside ritual chain; no medical or lineage claims."
    },
    {
      "id": "ar_ch06_completion_guide_v1",
      "code": "AR_CH06_COMPLETION_GUIDE_V1",
      "name": "觉醒修习引导",
      "chapter_id": "ch06_field_completion",
      "node_id": "n4_practice_completion",
      "node_title": "云间书符·觉醒修习",
      "status": "available",
      "interaction": "guide_sequence",
      "camera_enabled": false,
      "fake_ar_enabled": true,
      "description": "记念云间书符·觉醒修习处的场域体验。修习是记念觉察被记存，不是获得新力量——符者，记念也，非咒也。",
      "copy": "预览觉醒修习引导场域，不宣称医疗、派系或传承。",
      "relic_refs": [
        "relic_ch06_practice_completion"
      ],
      "rights_refs": [],
      "digital_collectible_refs": [],
      "canonical_boundary": "No medical claim, magic system, sect, or lineage; no L1 rights popup at practice node."
    },
    {
      "id": "ar_ch06_completion_v1",
      "code": "AR_CH06_COMPLETION_V1",
      "name": "归位觉醒·章成",
      "chapter_id": "ch06_field_completion",
      "node_id": "n5_complete",
      "node_title": "归位觉醒·章成",
      "status": "locked",
      "interaction": "completion_scene",
      "camera_enabled": false,
      "fake_ar_enabled": true,
      "description": "记念《归位觉醒》章成 closure 场域。五处觉察已齐备，世界留下觉醒印记，见证连接而非等级。",
      "copy": "预览章成 closure 场域，可接续分享海报生成流程。",
      "relic_refs": [
        "relic_ch06_field_completion_seal"
      ],
      "rights_refs": [
        "right_ch06_jieyuan_cafe_discount",
        "right_ch06_share_poster"
      ],
      "digital_collectible_refs": [
        "dc_ch06_completion_poster"
      ],
      "canonical_boundary": "Completion is not ranking, level, combat, or proof of superiority.",
      "unlock_requires": [
        "n1_field",
        "n2_reflection",
        "n3_human_completion",
        "n4_practice_completion"
      ]
    }
  ]
};
