module.exports = {
  "schema": "loveqigu.ar.events.v1",
  "version": "1.0.0",
  "source": "LOVEQIGU_CONTENT_CANON_V1",
  "layer": "L2",
  "language_layer": "L2_PRODUCT",
  "source_ref": "docs/content/LOVEQIGU_CONTENT_CANON_V1.md",
  "story_ref": "data/story/chapters.json",
  "relic_ref": "data/relics/relics.json",
  "rights_ref": "data/rights/rights.json",
  "canonical_boundary": "AR Event Layer only. Field experience and closure entry. No new lore. No Canon Gap fill.",
  "chapter_context": {
    "chapter_id": "ch01_cloud_awakening",
    "chapter_code": "CH01",
    "chapter_title": "云间初醒",
    "display_title": "《云间初醒》"
  },
  "asset_boundary": {
    "ar_event": "Field visualization and approved closure entry; does not create 云门 state.",
    "relic": "AR output may reference Relic context; Relic progression remains deterministic from exploration.",
    "rights": "L1 redemption refs stay outside ritual closure chain.",
    "digital_collectible": "Share outputs are user-initiated; zero Relic progression effect."
  },
  "events": [
    {
      "id": "ar_gate_open_v1",
      "code": "AR_GATE_OPEN_V1",
      "name": "云门开启",
      "chapter_id": "ch01_cloud_awakening",
      "node_id": "n1_gate",
      "node_title": "云门·入门",
      "status": "available",
      "interaction": "location_gate",
      "camera_enabled": false,
      "fake_ar_enabled": true,
      "description": "记念云门·入门处的场域体验。云门是一种状态，探索点位只是云门显现之地，不是云门本身。",
      "copy": "预览云门开启场域，不请求 live AR 权限。",
      "relic_refs": [
        "relic_ch01_gate_badge",
        "relic_ch01_cloud_gate_imprint_a"
      ],
      "rights_refs": [],
      "digital_collectible_refs": [],
      "canonical_boundary": "云门 is a state, not a physical object or owned location."
    },
    {
      "id": "ar_imprint_particles_v1",
      "code": "AR_IMPRINT_PARTICLES_V1",
      "name": "残印微光",
      "chapter_id": "ch01_cloud_awakening",
      "node_id": "n1_gate",
      "node_title": "云门·入门",
      "status": "available",
      "interaction": "imprint_particles",
      "camera_enabled": false,
      "fake_ar_enabled": true,
      "description": "记念云门之外第一次探索记录的印迹显现。残印是连接曾经存在过的证据，不是收藏数量。",
      "copy": "预览印迹粒子场域，不定义残印形成机制。",
      "relic_refs": [
        "relic_ch01_cloud_gate_imprint_a"
      ],
      "rights_refs": [],
      "digital_collectible_refs": [],
      "canonical_boundary": "Does not define imprint formation mechanics."
    },
    {
      "id": "ar_plaza_awareness_v1",
      "code": "AR_PLAZA_AWARENESS_V1",
      "name": "中央场照见",
      "chapter_id": "ch01_cloud_awakening",
      "node_id": "n2_plaza",
      "node_title": "中央场·照见",
      "status": "available",
      "interaction": "awareness_prompt",
      "camera_enabled": false,
      "fake_ar_enabled": true,
      "description": "记念中央场·照见处的场域体验。照见，不是向外寻找答案，而是看见自己已与场域同在。",
      "copy": "预览中央场照见场域，承接第二处觉察。",
      "relic_refs": [
        "relic_ch01_plaza"
      ],
      "rights_refs": [],
      "digital_collectible_refs": [],
      "canonical_boundary": "Uses existing CH01 node context only; no new lore."
    },
    {
      "id": "ar_cafe_human_field_v1",
      "code": "AR_CAFE_HUMAN_FIELD_V1",
      "name": "人间道场场域",
      "chapter_id": "ch01_cloud_awakening",
      "node_id": "n3_cafe",
      "node_title": "谷里咖啡·人间道场",
      "status": "available",
      "interaction": "human_field_presence",
      "camera_enabled": false,
      "fake_ar_enabled": true,
      "description": "记念谷里咖啡·人间道场的场域体验。一次服务、一杯咖啡、一次真实相遇，都可以是连接发生的场域。",
      "copy": "预览人间道场场域；权益礼遇在探索完成后于权益中心触达。",
      "relic_refs": [
        "relic_ch01_cafe"
      ],
      "rights_refs": [
        "right_ch01_jieyuan_free_latte"
      ],
      "digital_collectible_refs": [],
      "canonical_boundary": "L1 redemption stays outside ritual chain; no medical or lineage claims."
    },
    {
      "id": "ar_zhujin_guide_v1",
      "code": "AR_ZHUJIN_GUIDE_V1",
      "name": "祝禁第一课",
      "chapter_id": "ch01_cloud_awakening",
      "node_id": "n4_zhuyou",
      "node_title": "云间书符·祝禁入门",
      "status": "available",
      "interaction": "guide_sequence",
      "camera_enabled": false,
      "fake_ar_enabled": true,
      "description": "记念云间书符·祝禁入门处的修习场域。祝禁是证实合一的入门修习——符者，记念也，非咒也。",
      "copy": "预览祝禁第一课引导场域，不宣称医疗、派系或传承。",
      "relic_refs": [
        "relic_ch01_zhujin_imprint"
      ],
      "rights_refs": [],
      "digital_collectible_refs": [],
      "canonical_boundary": "No medical claim, magic system, sect, or lineage."
    },
    {
      "id": "ar_ch01_completion_v1",
      "code": "AR_CH01_COMPLETION_V1",
      "name": "云间初醒·章成",
      "chapter_id": "ch01_cloud_awakening",
      "node_id": "n5_complete",
      "node_title": "云间初醒·章成",
      "status": "locked",
      "interaction": "completion_scene",
      "camera_enabled": false,
      "fake_ar_enabled": true,
      "description": "记念《云间初醒》章成 closure 场域。五处觉察已齐备，世界留下初醒印记，见证连接而非等级。",
      "copy": "预览章成 closure 场域，可接续分享海报生成流程。",
      "relic_refs": [
        "relic_ch01_first_awakening_seal"
      ],
      "rights_refs": [
        "right_ch01_jieyuan_cafe_discount",
        "right_ch01_share_poster"
      ],
      "digital_collectible_refs": [
        "dc_ch01_completion_poster"
      ],
      "canonical_boundary": "Completion is not ranking, level, combat, or proof of superiority.",
      "unlock_requires": [
        "n1_gate",
        "n2_plaza",
        "n3_cafe",
        "n4_zhuyou"
      ]
    }
  ]
};
