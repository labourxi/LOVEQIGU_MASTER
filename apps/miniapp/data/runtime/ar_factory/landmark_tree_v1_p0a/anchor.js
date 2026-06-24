module.exports = {
  "anchor_method": "opencv_orb_akaze_real_image",
  "reference_image": "tree_trunk.jpg",
  "roi": {
    "x": 267,
    "y": 534,
    "w": 1066,
    "h": 1777
  },
  "feature_points": 93235,
  "orb_keypoints": 2000,
  "akaze_keypoints": 15514,
  "distribution_score": 0.7529,
  "stability_score": 0.0042,
  "overall_score": 0.6148,
  "matched_views": [
    {
      "view": "tree_full.jpg",
      "orb_match_ratio": 0.002,
      "akaze_match_ratio": 0.0059,
      "feature_count": 10160
    },
    {
      "view": "tree_near.jpg",
      "orb_match_ratio": 0.0035,
      "akaze_match_ratio": 0.005,
      "feature_count": 10770
    },
    {
      "view": "tree_far.jpg",
      "orb_match_ratio": 0.004,
      "akaze_match_ratio": 0.0059,
      "feature_count": 7570
    },
    {
      "view": "tree_left45.jpg",
      "orb_match_ratio": 0.0035,
      "akaze_match_ratio": 0.0043,
      "feature_count": 11669
    },
    {
      "view": "tree_right45.jpg",
      "orb_match_ratio": 0.006,
      "akaze_match_ratio": 0.0033,
      "feature_count": 13069
    },
    {
      "view": "position_a.jpg",
      "orb_match_ratio": 0.004,
      "akaze_match_ratio": 0.0035,
      "feature_count": 10585
    },
    {
      "view": "position_b.jpg",
      "orb_match_ratio": 0.005,
      "akaze_match_ratio": 0.0035,
      "feature_count": 11898
    }
  ],
  "anchor_regions": [
    "tree_trunk_texture",
    "tree_bark_cracks",
    "main_branch_split",
    "canopy_contour"
  ],
  "ignored_elements": [
    "red_lanterns",
    "signboards",
    "building_text",
    "passersby",
    "temporary_decorations"
  ],
  "created_at": "2026-06-17T13:23:33+08:00"
};
