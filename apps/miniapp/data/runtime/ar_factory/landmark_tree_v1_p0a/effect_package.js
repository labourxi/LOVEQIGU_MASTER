module.exports = {
  "schema_id": "loveqigu.ar.effect.package.v1",
  "effect_id": "AR_EFFECT_DRAGON_IMPRINT_LITE",
  "effect_name": "龙影浮现",
  "effect_type": "dragon_imprint_lite",
  "source_poc": "landmark_tree_v1",
  "source_images": [
    "data/ar_factory/poc/landmark_tree_v1/tree_full.jpg",
    "data/ar_factory/poc/landmark_tree_v1/tree_near.jpg",
    "data/ar_factory/poc/landmark_tree_v1/tree_far.jpg",
    "data/ar_factory/poc/landmark_tree_v1/tree_left45.jpg",
    "data/ar_factory/poc/landmark_tree_v1/tree_right45.jpg",
    "data/ar_factory/poc/landmark_tree_v1/tree_trunk.jpg",
    "data/ar_factory/poc/landmark_tree_v1/position_a.jpg",
    "data/ar_factory/poc/landmark_tree_v1/position_b.jpg"
  ],
  "source_runtime_package_id": "loveqigu.ar.runtime.runtime_package.v1",
  "anchor_binding": {
    "anchor_type": "image_anchor",
    "anchor_ref": "data/ar_factory/poc/landmark_tree_v1_p0a/anchor.json",
    "anchor_quality_ref": "data/ar_factory/poc/landmark_tree_v1_p0a/anchor_quality.json",
    "anchor_score": 0.6148,
    "reference_image": "tree_trunk.jpg"
  },
  "preview_assets": [
    {
      "asset_type": "position_guide",
      "asset_uri": "data/ar_factory/poc/landmark_tree_v1_p0a/position_guide.png"
    },
    {
      "asset_type": "alignment_overlay",
      "asset_uri": "data/ar_factory/poc/landmark_tree_v1_p0a/alignment_overlay.png"
    },
    {
      "asset_type": "dragon_imprint_overlay",
      "asset_uri": "/assets/ar_factory/landmark_tree_v1_p0a/effect_preview/dragon_imprint_overlay.webp"
    },
    {
      "asset_type": "dragon_energy_flow",
      "asset_uri": "/assets/ar_factory/landmark_tree_v1_p0a/effect_preview/dragon_energy_flow.webp"
    },
    {
      "asset_type": "dragon_head_reveal",
      "asset_uri": "/assets/ar_factory/landmark_tree_v1_p0a/effect_preview/dragon_head_reveal.webp"
    },
    {
      "asset_type": "azure_dragon_seal",
      "asset_uri": "/assets/ar_factory/landmark_tree_v1_p0a/effect_preview/azure_dragon_seal.webp"
    },
    {
      "asset_type": "preview_sheet",
      "asset_uri": "/assets/ar_factory/landmark_tree_v1_p0a/effect_preview/preview_sheet.webp"
    }
  ],
  "preview_sheet": "/assets/ar_factory/landmark_tree_v1_p0a/effect_preview/preview_sheet.webp",
  "render_layers": [
    "trunk_overlay",
    "dragon_scale_glow",
    "cyan_dragon_arc",
    "azure_dragon_seal"
  ],
  "runtime_binding": {
    "ar_entity_ref": "ar_entity",
    "ar_effect_ref": "ar_effect",
    "ar_runtime_flow_ref": "ar_runtime_flow",
    "activity_binding_ref": "activity_binding"
  },
  "visual_factory_binding": {
    "automation_level": "L2",
    "task_id": "vf_ancient_tree_dragon_imprint_lite",
    "exploration_point": "爱企谷古树",
    "effect_type": "dragon_imprint_lite",
    "art_requirement_ref": "apps/admin/modules/visual-factory/generated/art_requirement.json",
    "prompt_ref": "apps/admin/modules/visual-factory/generated/prompt.md",
    "queue_ref": "apps/admin/modules/visual-factory/generated/generation_queue.json"
  },
  "diagnostic": {
    "real_image_input": true,
    "real_image_anchor_ready": true,
    "anchor_score": 0.6148,
    "notes": "Dragon imprint lite prototype built from real image landmark_tree_v1 evidence and visual factory L2 prompt generation."
  },
  "created_at": "2026-06-18T17:00:25+08:00"
};
