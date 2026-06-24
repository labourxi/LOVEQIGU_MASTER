(function (root, factory) {
  var api = factory(root);
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  root.VisualFactoryServices = root.VisualFactoryServices || {};
  root.VisualFactoryServices.artRequirementGenerator = api;
})(typeof window !== "undefined" ? window : globalThis, function (root) {
  function makeId(prefix) {
    return [prefix || "artreq", Date.now().toString(36), Math.random().toString(36).slice(2, 8)].join("_");
  }

  function normalizeExplorationPoint(input) {
    if (typeof input === "string") return input;
    if (!input) return "Ancient Tree";
    return input.explorationPoint || input.exploration_point || input.name || input.title || "Ancient Tree";
  }

  function generateArtRequirement(input) {
    var explorationPoint = normalizeExplorationPoint(input);
    return {
      id: makeId("artreq"),
      exploration_point: explorationPoint,
      effect_type: "dragon_imprint_lite",
      landmark_type: "ancient_tree",
      shareability_target: "S",
      style: "oriental_mystic",
      assets: [
        "dragon_imprint_overlay",
        "dragon_energy_flow",
        "dragon_head_reveal",
        "azure_dragon_seal"
      ]
    };
  }

  function buildArFactoryBundle(requirement) {
    var req = requirement || generateArtRequirement("Ancient Tree");
    return {
      bundle_id: makeId("bundle"),
      effect_type: req.effect_type,
      landmark_type: req.landmark_type,
      assets: (req.assets || []).slice(),
      target_pipeline: "AR_FACTORY",
      generated_at: new Date().toISOString()
    };
  }

  function toJson(requirement) {
    return JSON.stringify(requirement || generateArtRequirement("Ancient Tree"), null, 2);
  }

  return {
    generateArtRequirement: generateArtRequirement,
    buildArFactoryBundle: buildArFactoryBundle,
    toJson: toJson
  };
});
