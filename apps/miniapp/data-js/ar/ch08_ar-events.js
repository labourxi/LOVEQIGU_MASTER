module.exports = {
  "schema": "loveqigu.ar.events.v1",
  "version": "1.0.0",
  "source": "CH08_CONTENT_CANON_V1",
  "layer": "L2",
  "language_layer": "L2_PRODUCT",
  "status": "active",
  "source_ref": "docs/content/canon/CH08_CONTENT_CANON_V1.md",
  "story_ref": "data/story/ch08_chapters.json",
  "relic_ref": "data/relics/ch08_relics.json",
  "rights_ref": "data/rights/ch08_rights.json",
  "canonical_boundary": "CH08 AR Event Layer. Field experience and closure entry. No new lore. No Canon Gap fill.",
  "chapter_context": {
    "chapter_id": "ch08_field_echo_legacy",
    "chapter_code": "CH08",
    "chapter_title": "传承之路",
    "display_title": "《传承之路》"
  },
  "asset_boundary": {
    "ar_event": "Field visualization and approved closure entry; does not create 云门 state.",
    "relic": "AR output may reference Relic context; Relic progression remains deterministic from exploration.",
    "rights": "L1 redemption refs stay outside ritual closure chain.",
    "digital_collectible": "Share outputs are user-initiated; zero Relic progression effect."
  },
  "events": [
    {
      "id": "ar_ch08_field_gate_v1",
      "code": "AR_CH08_FIELD_GATE_V1",
      "name": "传承场域",
      "chapter_id": "ch08_field_echo_legacy",
      "node_id": "n1_legacy",
      "node_title": "场域·传承种子",
      "status": "available",
      "interaction": "location_gate",
      "camera_enabled": false,
      "fake_ar_enabled": true,
      "description": "记念场域·传承种子处的场域体验。传承之路是 L2 章节题名，不是新地理或可被占有的关卡。",
      "copy": "预览传承场域，不请求 live AR 权限。",
      "relic_refs": [
        "relic_ch08_legacy_badge",
        "relic_ch08_gate_imprint_g"
      ],
      "rights_refs": [],
      "digital_collectible_refs": [],
      "canonical_boundary": "Legacy field visualization only; 传承之路 is L2 chapter title, not new geography."
    },
    {
      "id": "ar_ch08_imprint_legacy_v1",
      "code": "AR_CH08_IMPRINT_LEGACY_V1",
      "name": "传承残印",
      "chapter_id": "ch08_field_echo_legacy",
      "node_id": "n1_legacy",
      "node_title": "场域·传承种子",
      "status": "available",
      "interaction": "imprint_particles",
      "camera_enabled": false,
      "fake_ar_enabled": true,
      "description": "记念场域处探索记录的传承印迹显现。残印是连接曾经存在过的证据，不是收藏数量。",
      "copy": "预览传承印迹粒子场域，不定义残印形成机制。",
      "relic_refs": [
        "relic_ch08_gate_imprint_g"
      ],
      "rights_refs": [],
      "digital_collectible_refs": [],
      "canonical_boundary": "Does not define imprint formation mechanics; album G continues from CH07."
    },
    {
      "id": "ar_ch08_shared_awareness_v1",
      "code": "AR_CH08_SHARED_AWARENESS_V1",
      "name": "共享照见",
      "chapter_id": "ch08_field_echo_legacy",
      "node_id": "n2_shared_reflection",
      "node_title": "回响镜·共享照见",
      "status": "available",
      "interaction": "awareness_prompt",
      "camera_enabled": false,
      "fake_ar_enabled": true,
      "description": "记念回响镜·共享照见处的场域体验。影响开始触及周围的人，共鸣在照见处被记存。",
      "copy": "预览共享照见场域，承接第二处觉察。",
      "relic_refs": [
        "relic_ch08_shared_mirror"
      ],
      "rights_refs": [],
      "digital_collectible_refs": [],
      "canonical_boundary": "Uses existing field context only; no new Cosmology or lore."
    },
    {
      "id": "ar_ch08_human_connection_v1",
      "code": "AR_CH08_HUMAN_CONNECTION_V1",
      "name": "连接延展场域",
      "chapter_id": "ch08_field_echo_legacy",
      "node_id": "n3_human_connection",
      "node_title": "谷里咖啡·连接延展",
      "status": "available",
      "interaction": "human_field_presence",
      "camera_enabled": false,
      "fake_ar_enabled": true,
      "description": "记念谷里咖啡·连接延展处的场域体验。一次服务、一杯咖啡、一次真实相遇，善意连接仍可在真实相遇处被照见。",
      "copy": "预览连接延展场域；权益礼遇在探索完成后于权益中心触达。",
      "relic_refs": [
        "relic_ch08_human_connection"
      ],
      "rights_refs": [
        "right_ch08_jieyuan_free_latte"
      ],
      "digital_collectible_refs": [],
      "canonical_boundary": "L1 redemption stays outside ritual chain; no medical or lineage claims."
    },
    {
      "id": "ar_ch08_legacy_guide_v1",
      "code": "AR_CH08_LEGACY_GUIDE_V1",
      "name": "集体修习引导",
      "chapter_id": "ch08_field_echo_legacy",
      "node_id": "n4_collective_practice",
      "node_title": "云间书符·集体修习",
      "status": "available",
      "interaction": "guide_sequence",
      "camera_enabled": false,
      "fake_ar_enabled": true,
      "description": "记念云间书符·集体修习处的场域体验。修习是记念觉察被记存，不是获得新力量——符者，记念也，非咒也。",
      "copy": "预览集体修习引导场域，不宣称医疗、派系或传承体系。",
      "relic_refs": [
        "relic_ch08_collective_practice"
      ],
      "rights_refs": [],
      "digital_collectible_refs": [],
      "canonical_boundary": "No medical claim, magic system, sect, or lineage; no L1 rights popup at practice node."
    },
    {
      "id": "ar_ch08_completion_v1",
      "code": "AR_CH08_COMPLETION_V1",
      "name": "传承之路·章成",
      "chapter_id": "ch08_field_echo_legacy",
      "node_id": "n5_complete",
      "node_title": "传承之路·章成",
      "status": "locked",
      "interaction": "completion_scene",
      "camera_enabled": false,
      "fake_ar_enabled": true,
      "description": "记念《传承之路》章成 closure 场域。五处觉察已齐备，世界留下传承印记，见证连接而非等级。",
      "copy": "预览章成 closure 场域，可接续分享海报生成流程。",
      "relic_refs": [
        "relic_ch08_field_legacy_seal"
      ],
      "rights_refs": [
        "right_ch08_jieyuan_cafe_discount",
        "right_ch08_share_poster"
      ],
      "digital_collectible_refs": [
        "dc_ch08_legacy_poster"
      ],
      "canonical_boundary": "Completion is not ranking, level, combat, or proof of superiority.",
      "unlock_requires": [
        "n1_legacy",
        "n2_shared_reflection",
        "n3_human_connection",
        "n4_collective_practice"
      ]
    }
  ]
};
