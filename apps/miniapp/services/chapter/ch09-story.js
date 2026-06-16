module.exports = {
  "schema": "loveqigu.story.chapters.v1",
  "version": "1.0.0",
  "source": "CH09_CONTENT_CANON_V1",
  "layer": "L2",
  "status": "active",
  "source_ref": "docs/content/canon/CH09_CONTENT_CANON_V1.md",
  "canonical_boundary": "CH09 Story Layer. Five-awareness chapter structure; uses registered CH09 node and relic identifiers. No new lore. No Canon Gap fill.",
  "previous_chapter_ref": "ch08_field_echo_legacy",
  "chapters": [
    {
      "id": "ch09_field_echo_future",
      "chapter_code": "CH09",
      "title": "未来之约",
      "display_title": "《未来之约》",
      "status": "active",
      "layer": "L2",
      "language_layer": "L2_PRODUCT",
      "canonical_boundary": "Five-awareness chapter structure; independent imprint album H; continues after CH08 without new Canon history.",
      "summary": "未来之约五处觉察，影响开始可见。",
      "previous_chapter": "ch08_field_echo_legacy",
      "next_chapter": "ch10_field_echo_innovation",
      "awareness_structure": {
        "type": "five_awareness",
        "label": "五处觉察",
        "total": 5
      },
      "imprint_album": {
        "label": "印谱",
        "album_code": "H",
        "total_slots": 5,
        "progress_display": "k/5"
      },
      "completion": {
        "action": "章成",
        "completion_mark": "未来印记",
        "completion_mark_relic_ref": "relic_ch09_field_future_seal",
        "exploration_memorial": "未来之约",
        "memorial_title": "未来同行者"
      },
      "progress": {
        "explored_nodes": 0,
        "total_nodes": 5,
        "display": "0/5"
      },
      "nodes": [
        {
          "id": "n1_future",
          "sequence": 1,
          "awareness_index": 1,
          "title": "场域·未来种子",
          "node_type": "exploration",
          "status": "available",
          "language_layer": "L3_CANON_RITUAL_WORLDVIEW",
          "location_ref": "loc_gate_entry",
          "imprint_slot": 1,
          "ar_event_refs": [
            "ar_ch09_field_gate_v1",
            "ar_ch09_imprint_future_v1"
          ],
          "relic_refs": [
            "relic_ch09_future_badge",
            "relic_ch09_gate_imprint_h"
          ],
          "canonical_boundary": "Future seed at field entry; 未来之约 is L2 chapter title, not new geography or 云门 object.",
          "completion_required": true
        },
        {
          "id": "n2_collective_echo",
          "sequence": 2,
          "awareness_index": 2,
          "title": "回响镜·集体回响",
          "node_type": "exploration",
          "status": "available",
          "language_layer": "L3_CANON_RITUAL_WORLDVIEW",
          "location_ref": "loc_central_plaza",
          "imprint_slot": 2,
          "ar_event_refs": [
            "ar_ch09_collective_echo_v1"
          ],
          "relic_refs": [
            "relic_ch09_collective_echo_mirror"
          ],
          "canonical_boundary": "Collective echo node; social resonance without new Cosmology.",
          "completion_required": true
        },
        {
          "id": "n3_extended_connections",
          "sequence": 3,
          "awareness_index": 3,
          "title": "谷里咖啡·连接延伸",
          "node_type": "exploration",
          "status": "available",
          "language_layer": "L3_CANON_RITUAL_WORLDVIEW",
          "location_ref": "loc_cafe_human_field",
          "imprint_slot": 3,
          "ar_event_refs": [
            "ar_ch09_extended_connections_v1"
          ],
          "relic_refs": [
            "relic_ch09_extended_connections"
          ],
          "rights_refs": [],
          "canonical_boundary": "Extended connections memorial; L1 redemption stays outside ritual chain.",
          "completion_required": true
        },
        {
          "id": "n4_social_impact",
          "sequence": 4,
          "awareness_index": 4,
          "title": "云间书符·社会影响",
          "node_type": "practice",
          "status": "available",
          "language_layer": "L2_PRODUCT",
          "location_ref": "loc_zhujin_entry",
          "imprint_slot": 4,
          "ar_event_refs": [
            "ar_ch09_future_guide_v1"
          ],
          "relic_refs": [
            "relic_ch09_social_impact"
          ],
          "canonical_boundary": "Social impact memorial frame; remembrance only; no medical claim or new lineage.",
          "completion_required": true
        },
        {
          "id": "n5_complete",
          "sequence": 5,
          "awareness_index": 5,
          "title": "未来之约·章成",
          "node_type": "chapter_completion",
          "status": "locked",
          "language_layer": "L3_CANON_RITUAL_WORLDVIEW",
          "location_ref": null,
          "imprint_slot": 5,
          "ar_event_refs": [
            "ar_ch09_completion_v1"
          ],
          "relic_refs": [
            "relic_ch09_field_future_seal"
          ],
          "canonical_boundary": "Chapter completion confirmation; completion_mark is memorial, not rank or level.",
          "completion_required": true,
          "unlock_requires": [
            "n1_future",
            "n2_collective_echo",
            "n3_extended_connections",
            "n4_social_impact"
          ]
        }
      ]
    }
  ]
};
