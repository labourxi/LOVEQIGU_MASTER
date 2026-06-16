module.exports = {
  "schema": "loveqigu.story.chapters.v1",
  "version": "1.0.0",
  "source": "CH03_CONTENT_CANON_V1",
  "layer": "L2",
  "status": "active",
  "source_ref": "docs/content/CH03_CONTENT_CANON_V1.md",
  "canonical_boundary": "CH03 Story Layer. Five-awareness chapter structure; uses registered CH03 node and relic identifiers. No new lore. No Canon Gap fill.",
  "previous_chapter_ref": "ch02_mountain_gate_echo",
  "chapters": [
    {
      "id": "ch03_field_reunion",
      "chapter_code": "CH03",
      "title": "再度重逢",
      "display_title": "《再度重逢》",
      "status": "active",
      "layer": "L2",
      "language_layer": "L2_PRODUCT",
      "canonical_boundary": "Five-awareness chapter structure; independent imprint album C; continues after CH02 without new Canon history.",
      "summary": "CH03 Story Layer container. Five exploration awareness points at field reunion; third-law remembrance and memorial confirmation.",
      "previous_chapter": "ch02_mountain_gate_echo",
      "next_chapter": "ch04_field_awakening",
      "awareness_structure": {
        "type": "five_awareness",
        "label": "五处觉察",
        "total": 5
      },
      "imprint_album": {
        "label": "印谱",
        "album_code": "C",
        "total_slots": 5,
        "progress_display": "k/5"
      },
      "completion": {
        "action": "章成",
        "completion_mark": "重逢印记",
        "completion_mark_relic_ref": "relic_ch03_reunion_seal",
        "exploration_memorial": "再度重逢",
        "memorial_title": "重逢记念者"
      },
      "progress": {
        "explored_nodes": 0,
        "total_nodes": 5,
        "display": "0/5"
      },
      "nodes": [
        {
          "id": "n1_reunion",
          "sequence": 1,
          "awareness_index": 1,
          "title": "场域·重逢到场",
          "node_type": "exploration",
          "status": "available",
          "language_layer": "L3_CANON_RITUAL_WORLDVIEW",
          "location_ref": "loc_gate_entry",
          "imprint_slot": 1,
          "ar_event_refs": [
            "ar_ch03_reunion_gate_v1",
            "ar_ch03_imprint_reunion_v1"
          ],
          "relic_refs": [
            "relic_ch03_reunion_badge",
            "relic_ch03_gate_imprint_c"
          ],
          "canonical_boundary": "Field presence at reunion entry; 再度重逢 is L2 chapter title for third-law reunion, not new geography or 云门 object.",
          "completion_required": true
        },
        {
          "id": "n2_remember",
          "sequence": 2,
          "awareness_index": 2,
          "title": "重逢镜·想起",
          "node_type": "exploration",
          "status": "available",
          "language_layer": "L3_CANON_RITUAL_WORLDVIEW",
          "location_ref": "loc_central_plaza",
          "imprint_slot": 2,
          "ar_event_refs": [
            "ar_ch03_reunion_awareness_v1"
          ],
          "relic_refs": [
            "relic_ch03_reunion_mirror"
          ],
          "canonical_boundary": "Reunion remembrance node; third law alignment only; no new Cosmology.",
          "completion_required": true
        },
        {
          "id": "n3_human_reunion",
          "sequence": 3,
          "awareness_index": 3,
          "title": "谷里咖啡·人间重逢",
          "node_type": "exploration",
          "status": "available",
          "language_layer": "L3_CANON_RITUAL_WORLDVIEW",
          "location_ref": "loc_cafe_human_field",
          "imprint_slot": 3,
          "ar_event_refs": [
            "ar_ch03_human_reunion_v1"
          ],
          "relic_refs": [
            "relic_ch03_human_reunion"
          ],
          "rights_refs": [],
          "canonical_boundary": "Human-field reunion memorial; L1 redemption stays outside ritual chain.",
          "completion_required": true
        },
        {
          "id": "n4_practice_reunion",
          "sequence": 4,
          "awareness_index": 4,
          "title": "云间书符·重逢修习",
          "node_type": "practice",
          "status": "available",
          "language_layer": "L2_PRODUCT",
          "location_ref": "loc_zhujin_entry",
          "imprint_slot": 4,
          "ar_event_refs": [
            "ar_ch03_reunion_guide_v1"
          ],
          "relic_refs": [
            "relic_ch03_practice_reunion"
          ],
          "canonical_boundary": "Practice memorial frame; reunion remembrance only; no medical claim or new lineage.",
          "completion_required": true
        },
        {
          "id": "n5_complete",
          "sequence": 5,
          "awareness_index": 5,
          "title": "再度重逢·章成",
          "node_type": "chapter_completion",
          "status": "locked",
          "language_layer": "L3_CANON_RITUAL_WORLDVIEW",
          "location_ref": null,
          "imprint_slot": 5,
          "ar_event_refs": [
            "ar_ch03_completion_v1"
          ],
          "relic_refs": [
            "relic_ch03_reunion_seal"
          ],
          "canonical_boundary": "Chapter completion confirmation; completion_mark is memorial, not rank or level.",
          "completion_required": true,
          "unlock_requires": [
            "n1_reunion",
            "n2_remember",
            "n3_human_reunion",
            "n4_practice_reunion"
          ]
        }
      ]
    }
  ]
};
