module.exports = {
  "schema": "loveqigu.ar.events.v1",
  "version": "1.0.0",
  "source": "CH02_CONTENT_CANON_V1",
  "layer": "L2",
  "language_layer": "L2_PRODUCT",
  "status": "active",
  "source_ref": "docs/content/CH02_CONTENT_CANON_V1.md",
  "story_ref": "data/story/ch02_chapters.json",
  "relic_ref": "data/relics/ch02_relics.json",
  "rights_ref": "data/rights/ch02_rights.json",
  "canonical_boundary": "CH02 AR Event Layer. Field experience and closure entry. No new lore. No Canon Gap fill.",
  "chapter_context": {
    "chapter_id": "ch02_mountain_gate_echo",
    "chapter_code": "CH02",
    "chapter_title": "山门回响",
    "display_title": "《山门回响》"
  },
  "asset_boundary": {
    "ar_event": "Field visualization and approved closure entry; does not create 云门 state.",
    "relic": "AR output may reference Relic context; Relic progression remains deterministic from exploration.",
    "rights": "L1 redemption refs stay outside ritual closure chain.",
    "digital_collectible": "Share outputs are user-initiated; zero Relic progression effect."
  },
  "events": [
    {
      "id": "ar_ch02_threshold_gate_v1",
      "code": "AR_CH02_THRESHOLD_GATE_V1",
      "name": "门阈场域",
      "chapter_id": "ch02_mountain_gate_echo",
      "node_id": "n1_threshold",
      "node_title": "门阈·到场",
      "status": "available",
      "interaction": "location_gate",
      "camera_enabled": false,
      "fake_ar_enabled": true,
      "description": "记念门阈·到场处的场域体验。门阈是觉察开启的阈值场域，不是云门本身，也不是可被占有的关卡。",
      "copy": "预览门阈场域，不请求 live AR 权限。",
      "relic_refs": [
        "relic_ch02_threshold_badge",
        "relic_ch02_gate_imprint_b"
      ],
      "rights_refs": [],
      "digital_collectible_refs": [],
      "canonical_boundary": "Threshold field visualization only; 山门 is L2 chapter title, not new geography."
    },
    {
      "id": "ar_ch02_imprint_echo_v1",
      "code": "AR_CH02_IMPRINT_ECHO_V1",
      "name": "回响残印",
      "chapter_id": "ch02_mountain_gate_echo",
      "node_id": "n1_threshold",
      "node_title": "门阈·到场",
      "status": "available",
      "interaction": "imprint_particles",
      "camera_enabled": false,
      "fake_ar_enabled": true,
      "description": "记念门阈处探索记录的回响印迹显现。残印是连接曾经存在过的证据，不是收藏数量。",
      "copy": "预览回响印迹粒子场域，不定义残印形成机制。",
      "relic_refs": [
        "relic_ch02_gate_imprint_b"
      ],
      "rights_refs": [],
      "digital_collectible_refs": [],
      "canonical_boundary": "Does not define imprint formation mechanics; album B independent from CH01."
    },
    {
      "id": "ar_ch02_mirror_awareness_v1",
      "code": "AR_CH02_MIRROR_AWARENESS_V1",
      "name": "回响镜辨认",
      "chapter_id": "ch02_mountain_gate_echo",
      "node_id": "n2_mirror",
      "node_title": "回响镜·辨认",
      "status": "available",
      "interaction": "awareness_prompt",
      "camera_enabled": false,
      "fake_ar_enabled": true,
      "description": "记念回响镜·辨认处的场域体验。世界是一面回响之镜，探索不是向前夺取，而是辨认连接如何被记存。",
      "copy": "预览回响镜辨认场域，承接第二处觉察。",
      "relic_refs": [
        "relic_ch02_mirror_echo"
      ],
      "rights_refs": [],
      "digital_collectible_refs": [],
      "canonical_boundary": "Fourth law alignment only; no new Cosmology or lore."
    },
    {
      "id": "ar_ch02_human_echo_v1",
      "code": "AR_CH02_HUMAN_ECHO_V1",
      "name": "人间回响场域",
      "chapter_id": "ch02_mountain_gate_echo",
      "node_id": "n3_human_echo",
      "node_title": "谷里咖啡·人间回响",
      "status": "available",
      "interaction": "human_field_presence",
      "camera_enabled": false,
      "fake_ar_enabled": true,
      "description": "记念谷里咖啡·人间回响处的场域体验。一次服务、一杯咖啡、一次真实相遇，连接的回响仍可被记存。",
      "copy": "预览人间回响场域；权益礼遇在探索完成后于权益中心触达。",
      "relic_refs": [
        "relic_ch02_human_echo"
      ],
      "rights_refs": [
        "right_ch02_jieyuan_free_latte"
      ],
      "digital_collectible_refs": [],
      "canonical_boundary": "L1 redemption stays outside ritual chain; no medical or lineage claims."
    },
    {
      "id": "ar_ch02_echo_guide_v1",
      "code": "AR_CH02_ECHO_GUIDE_V1",
      "name": "记念修习引导",
      "chapter_id": "ch02_mountain_gate_echo",
      "node_id": "n4_practice_echo",
      "node_title": "云间书符·记念修习",
      "status": "available",
      "interaction": "guide_sequence",
      "camera_enabled": false,
      "fake_ar_enabled": true,
      "description": "记念云间书符·记念修习处的场域体验。修习是辨认回响被记存，不是获得新力量——符者，记念也，非咒也。",
      "copy": "预览记念修习引导场域，不宣称医疗、派系或传承。",
      "relic_refs": [
        "relic_ch02_practice_echo"
      ],
      "rights_refs": [],
      "digital_collectible_refs": [],
      "canonical_boundary": "No medical claim, magic system, sect, or lineage; no L1 rights popup at practice node."
    },
    {
      "id": "ar_ch02_completion_v1",
      "code": "AR_CH02_COMPLETION_V1",
      "name": "山门回响·章成",
      "chapter_id": "ch02_mountain_gate_echo",
      "node_id": "n5_complete",
      "node_title": "山门回响·章成",
      "status": "locked",
      "interaction": "completion_scene",
      "camera_enabled": false,
      "fake_ar_enabled": true,
      "description": "记念《山门回响》章成 closure 场域。五处觉察已齐备，世界留下回响印记，见证连接而非等级。",
      "copy": "预览章成 closure 场域，可接续分享海报生成流程。",
      "relic_refs": [
        "relic_ch02_mountain_echo_seal"
      ],
      "rights_refs": [
        "right_ch02_jieyuan_cafe_discount",
        "right_ch02_share_poster"
      ],
      "digital_collectible_refs": [
        "dc_ch02_completion_poster"
      ],
      "canonical_boundary": "Completion is not ranking, level, combat, or proof of superiority.",
      "unlock_requires": [
        "n1_threshold",
        "n2_mirror",
        "n3_human_echo",
        "n4_practice_echo"
      ]
    }
  ]
};
