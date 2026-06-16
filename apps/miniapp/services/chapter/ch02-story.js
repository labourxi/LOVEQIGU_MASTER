module.exports = {
  "schema": "loveqigu.story.chapters.v1",
  "version": "1.0.0",
  "source": "CH02_CONTENT_CANON_V1",
  "layer": "L2",
  "status": "active",
  "source_ref": "docs/content/CH02_CONTENT_CANON_V1.md",
  "canonical_boundary": "CH02 Story Layer. Five-awareness chapter structure; uses registered CH02 node and relic identifiers. No new lore. No Canon Gap fill.",
  "previous_chapter_ref": "ch01_cloud_awakening",
  "chapters": [
    {
      "id": "ch02_mountain_gate_echo",
      "chapter_code": "CH02",
      "title": "山门回响",
      "display_title": "《山门回响》",
      "status": "active",
      "layer": "L2",
      "language_layer": "L2_PRODUCT",
      "canonical_boundary": "Five-awareness chapter structure; independent imprint album B; continues after CH01 without new Canon history.",
      "summary": "山门场域五处觉察，回响认取与记念确认。",
      "previous_chapter": "ch01_cloud_awakening",
      "next_chapter": "ch03_field_reunion",
      "awareness_structure": {
        "type": "five_awareness",
        "label": "五处觉察",
        "total": 5
      },
      "imprint_album": {
        "label": "印谱",
        "album_code": "B",
        "total_slots": 5,
        "progress_display": "k/5"
      },
      "completion": {
        "action": "章成",
        "completion_mark": "回响印记",
        "completion_mark_relic_ref": "relic_ch02_mountain_echo_seal",
        "exploration_memorial": "山门回响",
        "memorial_title": "回响辨认者"
      },
      "progress": {
        "explored_nodes": 0,
        "total_nodes": 5,
        "display": "0/5"
      },
      "nodes": [
        {
          "id": "n1_threshold",
          "sequence": 1,
          "awareness_index": 1,
          "title": "门阈·到场",
          "node_type": "exploration",
          "status": "available",
          "language_layer": "L3_CANON_RITUAL_WORLDVIEW",
          "location_ref": "loc_gate_entry",
          "imprint_slot": 1,
          "ar_event_refs": [
            "ar_ch02_threshold_gate_v1",
            "ar_ch02_imprint_echo_v1"
          ],
          "relic_refs": [
            "relic_ch02_threshold_badge",
            "relic_ch02_gate_imprint_b"
          ],
          "canonical_boundary": "Threshold presence at gate field; 山门 is L2 chapter title for threshold, not new geography or 云门 object.",
          "completion_required": true
        },
        {
          "id": "n2_mirror",
          "sequence": 2,
          "awareness_index": 2,
          "title": "回响镜·辨认",
          "node_type": "exploration",
          "status": "available",
          "language_layer": "L3_CANON_RITUAL_WORLDVIEW",
          "location_ref": "loc_central_plaza",
          "imprint_slot": 2,
          "ar_event_refs": [
            "ar_ch02_mirror_awareness_v1"
          ],
          "relic_refs": [
            "relic_ch02_mirror_echo"
          ],
          "canonical_boundary": "Echo mirror awareness node; fourth law alignment only; no new Cosmology.",
          "completion_required": true
        },
        {
          "id": "n3_human_echo",
          "sequence": 3,
          "awareness_index": 3,
          "title": "谷里咖啡·人间回响",
          "node_type": "exploration",
          "status": "available",
          "language_layer": "L3_CANON_RITUAL_WORLDVIEW",
          "location_ref": "loc_cafe_human_field",
          "imprint_slot": 3,
          "ar_event_refs": [
            "ar_ch02_human_echo_v1"
          ],
          "relic_refs": [
            "relic_ch02_human_echo"
          ],
          "rights_refs": [],
          "canonical_boundary": "Human-field echo memorial; L1 redemption stays outside ritual chain.",
          "completion_required": true
        },
        {
          "id": "n4_practice_echo",
          "sequence": 4,
          "awareness_index": 4,
          "title": "云间书符·记念修习",
          "node_type": "practice",
          "status": "available",
          "language_layer": "L2_PRODUCT",
          "location_ref": "loc_zhujin_entry",
          "imprint_slot": 4,
          "ar_event_refs": [
            "ar_ch02_echo_guide_v1"
          ],
          "relic_refs": [
            "relic_ch02_practice_echo"
          ],
          "canonical_boundary": "Practice memorial frame; echo recognition only; no medical claim or new lineage.",
          "completion_required": true
        },
        {
          "id": "n5_complete",
          "sequence": 5,
          "awareness_index": 5,
          "title": "山门回响·章成",
          "node_type": "chapter_completion",
          "status": "locked",
          "language_layer": "L3_CANON_RITUAL_WORLDVIEW",
          "location_ref": null,
          "imprint_slot": 5,
          "ar_event_refs": [
            "ar_ch02_completion_v1"
          ],
          "relic_refs": [
            "relic_ch02_mountain_echo_seal"
          ],
          "canonical_boundary": "Chapter completion confirmation; completion_mark is memorial, not rank or level.",
          "completion_required": true,
          "unlock_requires": [
            "n1_threshold",
            "n2_mirror",
            "n3_human_echo",
            "n4_practice_echo"
          ]
        }
      ]
    }
  ]
};
