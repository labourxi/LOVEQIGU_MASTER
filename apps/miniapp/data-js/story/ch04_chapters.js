module.exports = {
  "schema": "loveqigu.story.chapters.v1",
  "version": "1.0.0",
  "source": "CH04_CONTENT_CANON_V1",
  "layer": "L2",
  "status": "active",
  "source_ref": "docs/content/CH04_CONTENT_CANON_V1.md",
  "canonical_boundary": "CH04 Story Layer. Five-awareness chapter structure; uses registered CH04 node and relic identifiers. No new lore. No Canon Gap fill.",
  "previous_chapter_ref": "ch03_field_reunion",
  "chapters": [
    {
      "id": "ch04_field_awakening",
      "chapter_code": "CH04",
      "title": "田野初醒",
      "display_title": "《田野初醒》",
      "status": "active",
      "layer": "L2",
      "language_layer": "L2_PRODUCT",
      "canonical_boundary": "Five-awareness chapter structure; independent imprint album D; continues after CH03 without new Canon history.",
      "summary": "田野初醒五处觉察，记念确认，不新增世界观内容。",
      "previous_chapter": "ch03_field_reunion",
      "next_chapter": "ch05_field_return",
      "awareness_structure": {
        "type": "five_awareness",
        "label": "五处觉察",
        "total": 5
      },
      "imprint_album": {
        "label": "印谱",
        "album_code": "D",
        "total_slots": 5,
        "progress_display": "k/5"
      },
      "completion": {
        "action": "章成",
        "completion_mark": "初醒印记",
        "completion_mark_relic_ref": "relic_ch04_field_awakening_seal",
        "exploration_memorial": "田野初醒",
        "memorial_title": "初醒记念者"
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
          "title": "场域·初醒到场",
          "node_type": "exploration",
          "status": "available",
          "language_layer": "L3_CANON_RITUAL_WORLDVIEW",
          "location_ref": "loc_gate_entry",
          "imprint_slot": 1,
          "ar_event_refs": [
            "ar_ch04_field_gate_v1",
            "ar_ch04_imprint_awakening_v1"
          ],
          "relic_refs": [
            "relic_ch04_awakening_badge",
            "relic_ch04_gate_imprint_d"
          ],
          "canonical_boundary": "Field presence at awakening entry; 田野初醒 is L2 chapter title, not new geography or 云门 object.",
          "completion_required": true
        },
        {
          "id": "n2_awakening",
          "sequence": 2,
          "awareness_index": 2,
          "title": "初醒镜·照见",
          "node_type": "exploration",
          "status": "available",
          "language_layer": "L3_CANON_RITUAL_WORLDVIEW",
          "location_ref": "loc_central_plaza",
          "imprint_slot": 2,
          "ar_event_refs": [
            "ar_ch04_awakening_awareness_v1"
          ],
          "relic_refs": [
            "relic_ch04_awakening_mirror"
          ],
          "canonical_boundary": "Awakening awareness node; uses existing field context only; no new Cosmology.",
          "completion_required": true
        },
        {
          "id": "n3_human_awakening",
          "sequence": 3,
          "awareness_index": 3,
          "title": "谷里咖啡·人间初醒",
          "node_type": "exploration",
          "status": "available",
          "language_layer": "L3_CANON_RITUAL_WORLDVIEW",
          "location_ref": "loc_cafe_human_field",
          "imprint_slot": 3,
          "ar_event_refs": [
            "ar_ch04_human_awakening_v1"
          ],
          "relic_refs": [
            "relic_ch04_human_awakening"
          ],
          "rights_refs": [],
          "canonical_boundary": "Human-field awakening memorial; L1 redemption stays outside ritual chain.",
          "completion_required": true
        },
        {
          "id": "n4_practice_awakening",
          "sequence": 4,
          "awareness_index": 4,
          "title": "云间书符·初醒修习",
          "node_type": "practice",
          "status": "available",
          "language_layer": "L2_PRODUCT",
          "location_ref": "loc_zhujin_entry",
          "imprint_slot": 4,
          "ar_event_refs": [
            "ar_ch04_awakening_guide_v1"
          ],
          "relic_refs": [
            "relic_ch04_practice_awakening"
          ],
          "canonical_boundary": "Practice memorial frame; awakening remembrance only; no medical claim or new lineage.",
          "completion_required": true
        },
        {
          "id": "n5_complete",
          "sequence": 5,
          "awareness_index": 5,
          "title": "田野初醒·章成",
          "node_type": "chapter_completion",
          "status": "locked",
          "language_layer": "L3_CANON_RITUAL_WORLDVIEW",
          "location_ref": null,
          "imprint_slot": 5,
          "ar_event_refs": [
            "ar_ch04_completion_v1"
          ],
          "relic_refs": [
            "relic_ch04_field_awakening_seal"
          ],
          "canonical_boundary": "Chapter completion confirmation; completion_mark is memorial, not rank or level.",
          "completion_required": true,
          "unlock_requires": [
            "n1_field",
            "n2_awakening",
            "n3_human_awakening",
            "n4_practice_awakening"
          ]
        }
      ]
    }
  ]
};
