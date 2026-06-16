module.exports = {
  "schema": "loveqigu.story.chapters.v1",
  "version": "1.0.0",
  "source": "CH10_CONTENT_CANON_V1",
  "layer": "L2",
  "status": "active",
  "source_ref": "docs/content/canon/CH10_CONTENT_CANON_V1.md",
  "canonical_boundary": "CH10 Story Layer. Five-awareness chapter structure; uses registered CH10 node and relic identifiers. No new lore. No Canon Gap fill.",
  "previous_chapter_ref": "ch09_field_echo_future",
  "chapters": [
    {
      "id": "ch10_field_echo_innovation",
      "chapter_code": "CH10",
      "title": "创新之路",
      "display_title": "《创新之路》",
      "status": "active",
      "layer": "L2",
      "language_layer": "L2_PRODUCT",
      "canonical_boundary": "Five-awareness chapter structure; independent imprint album I; continues after CH09 without new Canon history.",
      "summary": "CH10 Story Layer container. Five awareness points on the innovation path; collective practice extends without new Cosmology.",
      "previous_chapter": "ch09_field_echo_future",
      "next_chapter": "TBD",
      "awareness_structure": {
        "type": "five_awareness",
        "label": "五处觉察",
        "total": 5
      },
      "imprint_album": {
        "label": "印谱",
        "album_code": "I",
        "total_slots": 5,
        "progress_display": "k/5"
      },
      "completion": {
        "action": "章成",
        "completion_mark": "创新印记",
        "completion_mark_relic_ref": "relic_ch10_field_innovation_seal",
        "exploration_memorial": "创新之路",
        "memorial_title": "创新同行者"
      },
      "progress": {
        "explored_nodes": 0,
        "total_nodes": 5,
        "display": "0/5"
      },
      "nodes": [
        {
          "id": "n1_innovation",
          "sequence": 1,
          "awareness_index": 1,
          "title": "场域·创新种子",
          "node_type": "exploration",
          "status": "available",
          "language_layer": "L3_CANON_RITUAL_WORLDVIEW",
          "location_ref": "loc_gate_entry",
          "imprint_slot": 1,
          "ar_event_refs": [
            "ar_ch10_field_gate_v1",
            "ar_ch10_imprint_innovation_v1"
          ],
          "relic_refs": [
            "relic_ch10_innovation_badge",
            "relic_ch10_gate_imprint_i"
          ],
          "canonical_boundary": "Innovation seed at field entry; 创新之路 is L2 chapter title, not new geography or 云门 object.",
          "completion_required": true
        },
        {
          "id": "n2_collective_reflection",
          "sequence": 2,
          "awareness_index": 2,
          "title": "回响镜·集体照见",
          "node_type": "exploration",
          "status": "available",
          "language_layer": "L3_CANON_RITUAL_WORLDVIEW",
          "location_ref": "loc_central_plaza",
          "imprint_slot": 2,
          "ar_event_refs": [
            "ar_ch10_collective_reflection_v1"
          ],
          "relic_refs": [
            "relic_ch10_collective_mirror"
          ],
          "canonical_boundary": "Collective reflection node; social resonance without new Cosmology.",
          "completion_required": true
        },
        {
          "id": "n3_influence_expansion",
          "sequence": 3,
          "awareness_index": 3,
          "title": "谷里咖啡·影响延展",
          "node_type": "exploration",
          "status": "available",
          "language_layer": "L3_CANON_RITUAL_WORLDVIEW",
          "location_ref": "loc_cafe_human_field",
          "imprint_slot": 3,
          "ar_event_refs": [
            "ar_ch10_influence_expansion_v1"
          ],
          "relic_refs": [
            "relic_ch10_influence_expansion"
          ],
          "rights_refs": [],
          "canonical_boundary": "Influence expansion memorial; L1 redemption stays outside ritual chain.",
          "completion_required": true
        },
        {
          "id": "n4_social_practice",
          "sequence": 4,
          "awareness_index": 4,
          "title": "云间书符·社会修习",
          "node_type": "practice",
          "status": "available",
          "language_layer": "L2_PRODUCT",
          "location_ref": "loc_zhujin_entry",
          "imprint_slot": 4,
          "ar_event_refs": [
            "ar_ch10_innovation_guide_v1"
          ],
          "relic_refs": [
            "relic_ch10_social_practice"
          ],
          "canonical_boundary": "Social practice memorial frame; remembrance only; no medical claim or new lineage.",
          "completion_required": true
        },
        {
          "id": "n5_complete",
          "sequence": 5,
          "awareness_index": 5,
          "title": "创新之路·章成",
          "node_type": "chapter_completion",
          "status": "locked",
          "language_layer": "L3_CANON_RITUAL_WORLDVIEW",
          "location_ref": null,
          "imprint_slot": 5,
          "ar_event_refs": [
            "ar_ch10_completion_v1"
          ],
          "relic_refs": [
            "relic_ch10_field_innovation_seal"
          ],
          "canonical_boundary": "Chapter completion confirmation; completion_mark is memorial, not rank or level.",
          "completion_required": true,
          "unlock_requires": [
            "n1_innovation",
            "n2_collective_reflection",
            "n3_influence_expansion",
            "n4_social_practice"
          ]
        }
      ]
    }
  ]
};
