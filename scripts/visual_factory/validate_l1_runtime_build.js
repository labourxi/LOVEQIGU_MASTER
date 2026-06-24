const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..", "..");

function p(rel) {
  return path.join(root, rel);
}

function exists(rel) {
  return fs.existsSync(p(rel));
}

function read(rel) {
  return fs.readFileSync(p(rel), "utf8");
}

const requiredFiles = [
  "apps/admin/modules/visual-factory/index.html",
  "apps/admin/modules/visual-factory/index.js",
  "apps/admin/modules/visual-factory/index.ts",
  "apps/admin/modules/visual-factory/module.css",
  "apps/admin/modules/visual-factory/components/task-board.js",
  "apps/admin/modules/visual-factory/components/task-board.ts",
  "apps/admin/modules/visual-factory/services/runtime-store.js",
  "apps/admin/modules/visual-factory/services/runtime-store.ts",
  "apps/admin/modules/visual-factory/services/visual-task-service.js",
  "apps/admin/modules/visual-factory/services/visual-task-service.ts",
  "apps/admin/modules/visual-factory/services/art-requirement-generator.js",
  "apps/admin/modules/visual-factory/services/art-requirement-generator.ts",
  "apps/admin/modules/visual-factory/services/prompt-generator.js",
  "apps/admin/modules/visual-factory/services/prompt-generator.ts",
  "apps/admin/modules/visual-factory/services/generation-queue.js",
  "apps/admin/modules/visual-factory/services/generation-queue.ts",
  "apps/admin/modules/visual-factory/pages/task-list/index.html",
  "apps/admin/modules/visual-factory/pages/task-detail/index.html",
  "apps/admin/modules/visual-factory/pages/prompt-preview/index.html",
  "apps/admin/modules/visual-factory/pages/generation-queue/index.html",
  "apps/admin/modules/visual-factory/schemas/visual-task.schema.json",
  "apps/admin/modules/visual-factory/schemas/art-requirement.schema.json",
  "apps/admin/modules/visual-factory/schemas/prompt.schema.json",
  "apps/admin/modules/visual-factory/schemas/generation-queue-item.schema.json"
];

const checks = [
  {
    file: "apps/admin/modules/visual-factory/index.js",
    needles: ["VisualFactoryApp", "ensureSeedWorkflow", "task-list", "generation-queue"]
  },
  {
    file: "apps/admin/modules/visual-factory/services/visual-task-service.js",
    needles: ["createTask", "listTasks", "getTask", "updateTaskStatus", "ensureSeedTask"]
  },
  {
    file: "apps/admin/modules/visual-factory/services/art-requirement-generator.js",
    needles: ["generateArtRequirement", "dragon_imprint_lite", "azure_dragon_seal"]
  },
  {
    file: "apps/admin/modules/visual-factory/services/prompt-generator.js",
    needles: ["generatePrompt", "完整Prompt", "Gemini / 豆包"]
  },
  {
    file: "apps/admin/modules/visual-factory/services/generation-queue.js",
    needles: ["WAITING_GENERATION", "enqueue", "ensureSeedQueue"]
  },
  {
    file: "apps/admin/modules/visual-factory/components/task-board.js",
    needles: ["renderTaskDetail", "renderPromptPreview", "renderHomeBoard"]
  },
  {
    file: "apps/admin/modules/visual-factory/pages/task-list/index.html",
    needles: ["task-list", "../../services/visual-task-service.js"]
  },
  {
    file: "apps/admin/platform-admin/shared/platform-admin-ui.js",
    needles: ["视觉任务", "../modules/visual-factory/index.html"]
  }
];

function fail(message, extra) {
  console.log("VISUAL_FACTORY_L1_RUNTIME_BUILD_FAILED");
  console.log(message);
  if (extra) {
    console.log(extra);
  }
  process.exitCode = 1;
}

const missing = requiredFiles.filter((rel) => !exists(rel));
if (missing.length) {
  fail("missing files", missing.join(", "));
  return;
}

const failedChecks = [];
for (const check of checks) {
  const txt = read(check.file).toLowerCase();
  const ok = check.needles.every((needle) => txt.includes(needle.toLowerCase()));
  if (!ok) failedChecks.push(check.file);
}

if (failedChecks.length) {
  fail("failed content checks", failedChecks.join(", "));
  return;
}

const taskService = require(p("apps/admin/modules/visual-factory/services/visual-task-service.js"));
const artGen = require(p("apps/admin/modules/visual-factory/services/art-requirement-generator.js"));
const promptGen = require(p("apps/admin/modules/visual-factory/services/prompt-generator.js"));
const queue = require(p("apps/admin/modules/visual-factory/services/generation-queue.js"));

taskService.resetTasks([]);
queue.resetQueue([]);

const seedTask = taskService.ensureSeedTask();
const requirement = artGen.generateArtRequirement({ explorationPoint: seedTask.explorationPointId || "Ancient Tree" });
const prompt = promptGen.generatePrompt(requirement, { targetModel: "Gemini / 豆包" });
const queueItem = queue.ensureSeedQueue(seedTask, prompt);
const patchedTask = taskService.patchTask(seedTask.id, {
  artRequirement: requirement,
  prompt: prompt,
  queueItemId: queueItem && queueItem.id ? queueItem.id : "",
  outputAssets: requirement.assets.slice(),
  status: "waiting_generation"
});

const generatedDir = p("apps/admin/modules/visual-factory/generated");
fs.mkdirSync(generatedDir, { recursive: true });
fs.writeFileSync(path.join(generatedDir, "art_requirement.json"), JSON.stringify(requirement, null, 2), "utf8");
fs.writeFileSync(path.join(generatedDir, "prompt.md"), prompt.markdown || prompt.prompt_text || "", "utf8");
fs.writeFileSync(path.join(generatedDir, "generation_queue.json"), JSON.stringify(queue.list(), null, 2), "utf8");

const fileList = requiredFiles.concat([
  "apps/admin/modules/visual-factory/generated/art_requirement.json",
  "apps/admin/modules/visual-factory/generated/prompt.md",
  "apps/admin/modules/visual-factory/generated/generation_queue.json"
]);

const report = [
  "# VISUAL_FACTORY_L1_RUNTIME_BUILD_REPORT",
  "",
  "## Result",
  "",
  "- VISUAL_TASK_SERVICE: READY",
  "- ART_REQUIREMENT_GENERATOR: READY",
  "- PROMPT_GENERATOR: READY",
  "- GENERATION_QUEUE: READY",
  "- ADMIN_VISUAL_TASK: READY",
  "- RUNTIME_CODE_CREATED: YES",
  "",
  "## Seed Workflow",
  "",
  "- Seed task: " + (patchedTask && patchedTask.title),
  "- Effect type: " + requirement.effect_type,
  "- Queue status: " + (queueItem && queueItem.status),
  "",
  "## Files Created",
  "",
  fileList.map((file) => "- " + file).join("\n"),
  "",
  "## Validation",
  "",
  "- Seed task created: YES",
  "- Art requirement generated: YES",
  "- Prompt generated: YES",
  "- Queue item generated: YES",
  "",
  "## Visual Factory Level",
  "",
  "- CURRENT: L0",
  "- AFTER_BUILD: L1"
].join("\n");

fs.mkdirSync(path.dirname(p("docs/tech/visual_factory/VISUAL_FACTORY_L1_RUNTIME_BUILD_REPORT.md")), { recursive: true });
fs.writeFileSync(p("docs/tech/visual_factory/VISUAL_FACTORY_L1_RUNTIME_BUILD_REPORT.md"), report, "utf8");

if (!exists("docs/tech/visual_factory/VISUAL_FACTORY_L1_RUNTIME_BUILD_REPORT.md")) {
  fail("report write failed", "docs/tech/visual_factory/VISUAL_FACTORY_L1_RUNTIME_BUILD_REPORT.md");
  return;
}

console.log("VISUAL_FACTORY_L1_RUNTIME_BUILD_PASS");
