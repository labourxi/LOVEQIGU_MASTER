module.exports = {
  "schema": "loveqigu.story.chapters.v1",
  "version": "1.0.0",
  "source": "LOVEQIGU_CONTENT_CANON_V1",
  "layer": "L2",
  "canonical_boundary": "Story Layer only. CH01 exemplar. No new lore. No Canon Gap fill.",
  "source_ref": "docs/content/LOVEQIGU_CONTENT_CANON_V1.md",
  "chapters": [
    {
      "id": "ch01_cloud_awakening",
      "chapter_code": "CH01",
      "title": "云间初醒",
      "display_title": "《云间初醒》",
      "status": "active",
      "layer": "L2",
      "language_layer": "L2_PRODUCT",
      "canonical_boundary": "Five-awareness chapter structure only; uses registered CH01 node and relic identifiers.",
      "summary": "云间初醒五处探索觉察，引向章成确认。",
      "next_chapter": "ch02_mountain_gate_echo",
      "awareness_structure": {
        "type": "five_awareness",
        "label": "五处觉察",
        "total": 5
      },
      "imprint_album": {
        "label": "印谱",
        "album_code": "A",
        "total_slots": 5,
        "progress_display": "k/5"
      },
      "completion": {
        "action": "章成",
        "completion_mark": "初醒印记",
        "completion_mark_relic_ref": "relic_ch01_first_awakening_seal",
        "exploration_memorial": "云间初醒",
        "memorial_title": "初醒者"
      },
      "progress": {
        "explored_nodes": 0,
        "total_nodes": 5,
        "display": "0/5"
      },
      "nodes": [
        {
          "id": "n1_gate",
          "sequence": 1,
          "awareness_index": 1,
          "title": "云门·入门",
          "node_type": "exploration",
          "status": "available",
          "language_layer": "L3_CANON_RITUAL_WORLDVIEW",
          "location_ref": "loc_gate_entry",
          "imprint_slot": 1,
          "ar_event_refs": [
            "ar_gate_open_v1",
            "ar_imprint_particles_v1"
          ],
          "relic_refs": [
            "relic_ch01_gate_badge",
            "relic_ch01_cloud_gate_imprint_a"
          ],
          "canonical_boundary": "First exploration record at the gate threshold; no new Canon.",
          "completion_required": true
        },
        {
          "id": "n2_plaza",
          "sequence": 2,
          "awareness_index": 2,
          "title": "中央场·照见",
          "node_type": "exploration",
          "status": "available",
          "language_layer": "L3_CANON_RITUAL_WORLDVIEW",
          "location_ref": "loc_central_plaza",
          "imprint_slot": 2,
          "ar_event_refs": [
            "ar_plaza_awareness_v1"
          ],
          "relic_refs": [
            "relic_ch01_plaza"
          ],
          "canonical_boundary": "Central plaza awareness node; uses existing CH01 context only.",
          "completion_required": true
        },
        {
          "id": "n3_cafe",
          "sequence": 3,
          "awareness_index": 3,
          "title": "谷里咖啡·人间道场",
          "node_type": "exploration",
          "status": "available",
          "language_layer": "L3_CANON_RITUAL_WORLDVIEW",
          "location_ref": "loc_cafe_human_field",
          "imprint_slot": 3,
          "ar_event_refs": [
            "ar_cafe_human_field_v1"
          ],
          "relic_refs": [
            "relic_ch01_cafe"
          ],
          "rights_refs": [],
          "canonical_boundary": "Human-field exploration node; L1 redemption stays outside ritual chain.",
          "completion_required": true
        },
        {
          "id": "n4_zhuyou",
          "sequence": 4,
          "awareness_index": 4,
          "title": "云间书符·祝禁入门",
          "node_type": "practice",
          "status": "available",
          "language_layer": "L2_PRODUCT",
          "location_ref": "loc_zhujin_entry",
          "imprint_slot": 4,
          "ar_event_refs": [
            "ar_zhujin_guide_v1"
          ],
          "relic_refs": [
            "relic_ch01_zhujin_imprint"
          ],
          "canonical_boundary": "祝禁 introductory practice frame; no medical claim or new lineage.",
          "completion_required": true
        },
        {
          "id": "n5_complete",
          "sequence": 5,
          "awareness_index": 5,
          "title": "云间初醒·章成",
          "node_type": "chapter_completion",
          "status": "locked",
          "language_layer": "L3_CANON_RITUAL_WORLDVIEW",
          "location_ref": null,
          "imprint_slot": 5,
          "ar_event_refs": [
            "ar_ch01_completion_v1"
          ],
          "relic_refs": [
            "relic_ch01_first_awakening_seal"
          ],
          "canonical_boundary": "Chapter completion confirmation; completion_mark is memorial, not rank or level.",
          "completion_required": true,
          "unlock_requires": [
            "n1_gate",
            "n2_plaza",
            "n3_cafe",
            "n4_zhuyou"
          ]
        }
      ]
    }
  ]
};
