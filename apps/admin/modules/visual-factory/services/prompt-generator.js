(function (root, factory) {
  var api = factory(root);
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  root.VisualFactoryServices = root.VisualFactoryServices || {};
  root.VisualFactoryServices.promptGenerator = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  function makeId(prefix) {
    return [prefix || "prompt", Date.now().toString(36), Math.random().toString(36).slice(2, 8)].join("_");
  }

  function generatePrompt(requirement, options) {
    var req = requirement || {};
    var targetModel = (options && options.targetModel) || "Gemini / 豆包";
    var objective = "生成古树显龙Overlay";
    var styleNotes = ["东方", "神秘", "古老", "留白"].join(" / ");
    var promptText = [
      "执行对象:",
      targetModel,
      "",
      "目标:",
      objective,
      "",
      "风格:",
      "东方",
      "神秘",
      "古老",
      "留白",
      "",
      "需求单摘要:",
      "effect_type: " + (req.effect_type || "dragon_imprint_lite"),
      "landmark_type: " + (req.landmark_type || "ancient_tree"),
      "shareability_target: " + (req.shareability_target || "S"),
      "assets: " + ((req.assets || []).join(", ") || "dragon_imprint_overlay"),
      "",
      "完整Prompt:",
      "请基于古树探索点生成一张显龙风格的视觉草图。",
      "要求：",
      "- 保留树干纹理、主枝分叉、树冠轮廓",
      "- 弱化红灯笼、广告牌、临时装饰",
      "- 画面强调东方、神秘、古老、留白",
      "- 输出适配后续 AR Factory 的 Overlay 资产"
    ].join("\n");
    return {
      id: makeId("prompt"),
      title: "dragon_imprint.prompt.md",
      target_model: targetModel,
      objective: objective,
      style_notes: styleNotes,
      prompt_text: promptText,
      markdown: "# dragon_imprint.prompt.md\n\n" + promptText + "\n"
    };
  }

  function toMarkdown(prompt) {
    var data = prompt || {};
    return data.markdown || ("# " + (data.title || "prompt.md") + "\n\n" + (data.prompt_text || "") + "\n");
  }

  return {
    generatePrompt: generatePrompt,
    toMarkdown: toMarkdown
  };
});
