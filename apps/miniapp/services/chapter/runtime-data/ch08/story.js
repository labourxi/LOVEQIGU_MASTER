module.exports = {
  "schema": "loveqigu.story.chapters.v1",
  "version": "1.0.0",
  "source": "CH08_CONTENT_CANON_V1",
  "layer": "L2",
  "status": "active",
  "source_ref": "docs/content/canon/CH08_CONTENT_CANON_V1.md",
  "canonical_boundary": "CH08 Story Layer. Five-awareness chapter structure; uses registered CH08 node and relic identifiers. No new lore. No Canon Gap fill.",
  "previous_chapter_ref": "ch07_field_echo",
  "chapters": [
    {
      "id": "ch08_field_echo_legacy",
      "chapter_code": "CH08",
      "title": "传承之路",
      "display_title": "《传承之路》",
      "status": "active",
      "layer": "L2",
      "language_layer": "L2_PRODUCT",
      "canonical_boundary": "Five-awareness chapter structure; imprint album G continues after CH07 without new Canon history.",
      "summary": "CH08 Story Layer container. Five awareness points on the legacy path; influence extends beyond self without new Cosmology.",
      "previous_chapter": "ch07_field_echo",
      "next_chapter": "ch09_field_echo_future",
      "awareness_structure": {
        "type": "five_awareness",
        "label": "五处觉察",
        "total": 5
      },
      "imprint_album": {
        "label": "印谱",
        "album_code": "G",
        "total_slots": 5,
        "progress_display": "k/5"
      },
      "completion": {
        "action": "章成",
        "completion_mark": "传承印记",
        "completion_mark_relic_ref": "relic_ch08_field_legacy_seal",
        "exploration_memorial": "传承之路",
        "memorial_title": "传承同行者"
      },
      "progress": {
        "explored_nodes": 0,
        "total_nodes": 5,
        "display": "0/5"
      },
      "nodes": [
        {
          "id": "n1_legacy",
          "sequence": 1,
          "awareness_index": 1,
          "title": "场域·传承种子",
          "node_type": "exploration",
          "status": "available",
          "language_layer": "L3_CANON_RITUAL_WORLDVIEW",
          "location_ref": "loc_gate_entry",
          "imprint_slot": 1,
          "ar_event_refs": [
            "ar_ch08_field_gate_v1",
            "ar_ch08_imprint_legacy_v1"
          ],
          "relic_refs": [
            "relic_ch08_legacy_badge",
            "relic_ch08_gate_imprint_g"
          ],
          "canonical_boundary": "Legacy seed at field entry; 传承之路 is L2 chapter title, not new geography or 云门 object.",
          "completion_required": true
        },
        {
          "id": "n2_shared_reflection",
          "sequence": 2,
          "awareness_index": 2,
          "title": "回响镜·共享照见",
          "node_type": "exploration",
          "status": "available",
          "language_layer": "L3_CANON_RITUAL_WORLDVIEW",
          "location_ref": "loc_central_plaza",
          "imprint_slot": 2,
          "ar_event_refs": [
            "ar_ch08_shared_awareness_v1"
          ],
          "relic_refs": [
            "relic_ch08_shared_mirror"
          ],
          "canonical_boundary": "Shared reflection node; influence reaches others; no new Cosmology.",
          "completion_required": true
        },
        {
          "id": "n3_human_connection",
          "sequence": 3,
          "awareness_index": 3,
          "title": "谷里咖啡·连接延展",
          "node_type": "exploration",
          "status": "available",
          "language_layer": "L3_CANON_RITUAL_WORLDVIEW",
          "location_ref": "loc_cafe_human_field",
          "imprint_slot": 3,
          "ar_event_refs": [
            "ar_ch08_human_connection_v1"
          ],
          "relic_refs": [
            "relic_ch08_human_connection"
          ],
          "rights_refs": [],
          "canonical_boundary": "Human connection extended memorial; L1 redemption stays outside ritual chain.",
          "completion_required": true
        },
        {
          "id": "n4_collective_practice",
          "sequence": 4,
          "awareness_index": 4,
          "title": "云间书符·集体修习",
          "node_type": "practice",
          "status": "available",
          "language_layer": "L2_PRODUCT",
          "location_ref": "loc_zhujin_entry",
          "imprint_slot": 4,
          "ar_event_refs": [
            "ar_ch08_legacy_guide_v1"
          ],
          "relic_refs": [
            "relic_ch08_collective_practice"
          ],
          "canonical_boundary": "Collective practice memorial frame; remembrance only; no medical claim or new lineage.",
          "completion_required": true
        },
        {
          "id": "n5_complete",
          "sequence": 5,
          "awareness_index": 5,
          "title": "传承之路·章成",
          "node_type": "chapter_completion",
          "status": "locked",
          "language_layer": "L3_CANON_RITUAL_WORLDVIEW",
          "location_ref": null,
          "imprint_slot": 5,
          "ar_event_refs": [
            "ar_ch08_completion_v1"
          ],
          "relic_refs": [
            "relic_ch08_field_legacy_seal"
          ],
          "canonical_boundary": "Chapter completion confirmation; completion_mark is memorial, not rank or level.",
          "completion_required": true,
          "unlock_requires": [
            "n1_legacy",
            "n2_shared_reflection",
            "n3_human_connection",
            "n4_collective_practice"
          ]
        }
      ]
    }
  ]
};
