module.exports = {
  "schema_id": "loveqigu.ar.runtime.runtime_package.v1",
  "ar_entity": {
    "ar_id": "landmark_tree_v1_p0a",
    "exploration_point_id": "ancient_tree_exploration_point",
    "status": "draft",
    "ar_type": "landmark_ar",
    "reveal_type": "trace_reveal",
    "runtime_version": "AR_FACTORY_RUNTIME_SCHEMA_V1.1",
    "created_at": "2026-06-18T17:00:25+08:00",
    "updated_at": "2026-06-18T17:00:25+08:00",
    "effect_ref": "AR_EFFECT_DRAGON_IMPRINT_LITE"
  },
  "ar_effect": {
    "effect_id": "AR_EFFECT_DRAGON_IMPRINT_LITE",
    "effect_name": "龙影浮现",
    "effect_type": "dragon_imprint_lite",
    "duration_seconds": 4,
    "auto_disperse_seconds": 5,
    "anchor_score": 0.6148,
    "anchor_ref": "data/ar_factory/poc/landmark_tree_v1_p0a/anchor.json",
    "preview_assets": [
      "/xr_demo/miniprogram/assets/ar_factory/landmark_tree_v1_p0a/effect_preview/dragon_imprint_overlay.webp",
      "/xr_demo/miniprogram/assets/ar_factory/landmark_tree_v1_p0a/effect_preview/dragon_energy_flow.webp",
      "/xr_demo/miniprogram/assets/ar_factory/landmark_tree_v1_p0a/effect_preview/dragon_head_reveal.webp",
      "/xr_demo/miniprogram/assets/ar_factory/landmark_tree_v1_p0a/effect_preview/azure_dragon_seal.webp"
    ],
    "preview_overlay": "/xr_demo/miniprogram/assets/ar_factory/landmark_tree_v1_p0a/effect_preview/dragon_imprint_overlay.webp",
    "render_layers": [
      "trunk_overlay",
      "dragon_scale_glow",
      "cyan_dragon_arc",
      "azure_dragon_seal"
    ]
  },
  "ar_guidance": {
    "standing_guide": {
      "guide_uri": "data/ar_factory/poc/landmark_tree_v1_p0a/position_guide.png",
      "rule_params": {
        "arrival_radius_m": 30
      }
    },
    "scan_guide": {
      "guide_uri": "data/ar_factory/poc/landmark_tree_v1_p0a/position_guide.png",
      "hint_text": "请将古树轮廓与参考轮廓对齐。"
    },
    "alignment_overlay": {
      "overlay_uri": "/xr_demo/miniprogram/assets/ar_factory/landmark_tree_v1_p0a/effect_preview/dragon_imprint_overlay.webp",
      "contour_uri": "data/ar_factory/poc/landmark_tree_v1_p0a/alignment_overlay.png",
      "alignment_threshold": 0.72,
      "hint_text": "请将古树树干与参考轮廓重合，触发龙影浮现。",
      "alignment_success_text": "对准成功，龙影已浮现。"
    }
  },
  "anchor": {
    "anchor_type": "image_anchor",
    "anchor_payload": {
      "descriptor_uri": "data/ar_factory/poc/landmark_tree_v1_p0a/anchor.json",
      "detector": "opencv_orb_akaze_real_image",
      "feature_count": 93235,
      "score": 0.6148
    }
  },
  "navigation_binding": {
    "latitude": 31.23,
    "longitude": 121.47,
    "arrival_radius_m": 30,
    "distance": null,
    "eta": null,
    "nearby_points_ref": []
  },
  "activity_binding": {
    "activity_id": "loveqigu_first_event_case_v1",
    "blessing_stamp": {
      "stamp_id": "blessing_stamp_landmark_tree_v1_p0a",
      "grant_on_completion": true
    },
    "activity_progress": {
      "progress_key": "landmark_tree_v1_p0a_progress",
      "increment": 1
    },
    "reward_mapping": {
      "reward_type": "blessing_stamp",
      "reward_ref": "blessing_stamp_landmark_tree_v1_p0a"
    },
    "rights_center_route": "/pages/rights-center/index"
  },
  "ar_runtime_flow": {
    "version": "AR_FACTORY_RUNTIME_SCHEMA_V1.1",
    "stages": [
      {
        "stage": "navigation",
        "interaction_state": "NAVIGATING",
        "consumes": [
          "navigation_binding"
        ]
      },
      {
        "stage": "arrival",
        "interaction_state": "ARRIVED",
        "consumes": [
          "navigation_binding.arrival_radius_m",
          "ar_guidance.standing_guide"
        ]
      },
      {
        "stage": "scanning",
        "interaction_state": "SCANNING",
        "consumes": [
          "anchor",
          "ar_guidance.alignment_overlay",
          "ar_guidance.scan_guide"
        ]
      },
      {
        "stage": "anchor_lock",
        "interaction_state": "ANCHOR_LOCKED",
        "consumes": [
          "anchor.anchor_payload"
        ]
      },
      {
        "stage": "interaction",
        "interaction_state": "INTERACTING",
        "consumes": [
          "ar_effect",
          "ar_effect.preview_assets"
        ]
      },
      {
        "stage": "reveal",
        "interaction_state": "REVEALING",
        "consumes": [
          "ar_entity.reveal_type",
          "reveal_assets"
        ]
      },
      {
        "stage": "completion",
        "interaction_state": "COMPLETED",
        "consumes": [
          "completion_event",
          "activity_binding"
        ]
      }
    ]
  },
  "interaction_script": "dragon_imprint_lite",
  "reveal_assets": [
    {
      "asset_type": "dragon_imprint_overlay",
      "asset_uri": "/xr_demo/miniprogram/assets/ar_factory/landmark_tree_v1_p0a/effect_preview/dragon_imprint_overlay.webp"
    },
    {
      "asset_type": "dragon_energy_flow",
      "asset_uri": "/xr_demo/miniprogram/assets/ar_factory/landmark_tree_v1_p0a/effect_preview/dragon_energy_flow.webp"
    },
    {
      "asset_type": "dragon_head_reveal",
      "asset_uri": "/xr_demo/miniprogram/assets/ar_factory/landmark_tree_v1_p0a/effect_preview/dragon_head_reveal.webp"
    },
    {
      "asset_type": "azure_dragon_seal",
      "asset_uri": "/xr_demo/miniprogram/assets/ar_factory/landmark_tree_v1_p0a/effect_preview/azure_dragon_seal.webp"
    },
    {
      "asset_type": "position_guide",
      "asset_uri": "data/ar_factory/poc/landmark_tree_v1_p0a/position_guide.png"
    },
    {
      "asset_type": "alignment_overlay",
      "asset_uri": "data/ar_factory/poc/landmark_tree_v1_p0a/alignment_overlay.png"
    }
  ],
  "completion_event": "event.landmark_tree_v1_p0a.completed",
  "runtime_compat": "miniapp_ar_p0a",
  "published_at": null,
  "source_factory_package_id": "AR_EFFECT_DRAGON_IMPRINT_LITE",
  "diagnostic": {
    "publish_state": "draft_p0",
    "real_image_anchor": true,
    "anchor_score": 0.6148,
    "effect_package_id": "loveqigu.ar.effect.package.v1",
    "notes": "P0-A runtime package generated from real image POC evidence and visual factory L2 automation."
  }
};
