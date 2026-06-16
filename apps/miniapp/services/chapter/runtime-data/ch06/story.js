module.exports = {
  "schema": "loveqigu.story.chapters.v1",
  "version": "1.0.0",
  "source": "CH06_CONTENT_CANON_V1",
  "layer": "L2",
  "status": "active",
  "source_ref": "docs/content/canon/CH06_CONTENT_CANON_V1.md",
  "canonical_boundary": "CH06 Story Layer. Five-awareness chapter structure; uses registered CH06 node and relic identifiers. No new lore. No Canon Gap fill.",
  "previous_chapter_ref": "ch05_field_return",
  "chapters": [
    {
      "id": "ch06_field_completion",
      "chapter_code": "CH06",
      "title": "归位觉醒",
      "display_title": "《归位觉醒》",
      "status": "active",
      "layer": "L2",
      "language_layer": "L2_PRODUCT",
      "canonical_boundary": "Five-awareness chapter structure; independent imprint album F; continues after CH05 without new Canon history.",
      "summary": "CH06 Story Layer container. Five awareness points at field completion; witness what has already changed without new Cosmology.",
      "previous_chapter": "ch05_field_return",
      "next_chapter": "ch07_field_echo",
      "awareness_structure": {
        "type": "five_awareness",
        "label": "五处觉察",
        "total": 5
      },
      "imprint_album": {
        "label": "印谱",
        "album_code": "F",
        "total_slots": 5,
        "progress_display": "k/5"
      },
      "completion": {
        "action": "章成",
        "completion_mark": "觉醒印记",
        "completion_mark_relic_ref": "relic_ch06_field_completion_seal",
        "exploration_memorial": "归位觉醒",
        "memorial_title": "觉醒见证者"
      },
      "progress": {
        "explored_nodes": 0,
        "total_nodes": 5,
        "display": "0/5"
      },
      "nodes": [
        {
          "id": "n1_field",
          "sequence": 1,
          "awareness_index": 1,
          "title": "场域·觉醒到场",
          "node_type": "exploration",
          "status": "available",
          "language_layer": "L3_CANON_RITUAL_WORLDVIEW",
          "location_ref": "loc_gate_entry",
          "imprint_slot": 1,
          "ar_event_refs": [
            "ar_ch06_field_gate_v1",
            "ar_ch06_imprint_completion_v1"
          ],
          "relic_refs": [
            "relic_ch06_completion_badge",
            "relic_ch06_gate_imprint_f"
          ],
          "canonical_boundary": "Field presence at completion entry; 归位觉醒 is L2 chapter title, not new geography or 云门 object.",
          "completion_required": true
        },
        {
          "id": "n2_reflection",
          "sequence": 2,
          "awareness_index": 2,
          "title": "回望镜·见证",
          "node_type": "exploration",
          "status": "available",
          "language_layer": "L3_CANON_RITUAL_WORLDVIEW",
          "location_ref": "loc_central_plaza",
          "imprint_slot": 2,
          "ar_event_refs": [
            "ar_ch06_reflection_awareness_v1"
          ],
          "relic_refs": [
            "relic_ch06_reflection_mirror"
          ],
          "canonical_boundary": "Reflection awareness node; witness what has already changed; no new Cosmology.",
          "completion_required": true
        },
        {
          "id": "n3_human_completion",
          "sequence": 3,
          "awareness_index": 3,
          "title": "谷里咖啡·人间觉醒",
          "node_type": "exploration",
          "status": "available",
          "language_layer": "L3_CANON_RITUAL_WORLDVIEW",
          "location_ref": "loc_cafe_human_field",
          "imprint_slot": 3,
          "ar_event_refs": [
            "ar_ch06_human_completion_v1"
          ],
          "relic_refs": [
            "relic_ch06_human_completion"
          ],
          "rights_refs": [],
          "canonical_boundary": "Human-field completion memorial; L1 redemption stays outside ritual chain.",
          "completion_required": true
        },
        {
          "id": "n4_practice_completion",
          "sequence": 4,
          "awareness_index": 4,
          "title": "云间书符·觉醒修习",
          "node_type": "practice",
          "status": "available",
          "language_layer": "L2_PRODUCT",
          "location_ref": "loc_zhujin_entry",
          "imprint_slot": 4,
          "ar_event_refs": [
            "ar_ch06_completion_guide_v1"
          ],
          "relic_refs": [
            "relic_ch06_practice_completion"
          ],
          "canonical_boundary": "Practice memorial frame; completion remembrance only; no medical claim or new lineage.",
          "completion_required": true
        },
        {
          "id": "n5_complete",
          "sequence": 5,
          "awareness_index": 5,
          "title": "归位觉醒·章成",
          "node_type": "chapter_completion",
          "status": "locked",
          "language_layer": "L3_CANON_RITUAL_WORLDVIEW",
          "location_ref": null,
          "imprint_slot": 5,
          "ar_event_refs": [
            "ar_ch06_completion_v1"
          ],
          "relic_refs": [
            "relic_ch06_field_completion_seal"
          ],
          "canonical_boundary": "Chapter completion confirmation; completion_mark is memorial, not rank or level.",
          "completion_required": true,
          "unlock_requires": [
            "n1_field",
            "n2_reflection",
            "n3_human_completion",
            "n4_practice_completion"
          ]
        }
      ]
    }
  ]
};
