const path = require('path');
const {
  DOCS_ROOT,
  MINIAPP_ROOT,
  createResult,
  detail,
  fail,
  fileExists,
  listFiles,
  readText,
  relativeFromRoot,
  warn,
} = require('./omx-utils');

const CANON_DIR = path.join(DOCS_ROOT, 'canon');
const SCANNED_EXTENSIONS = ['.js', '.json', '.wxml'];
const HIGH_RISK_TERMS = [
  'NFT',
  'crypto',
  'blockchain',
  'metaverse',
  '积分',
  '成就',
  '任务中心',
  '打卡',
  '禁用词',
];

function run() {
  const result = createResult('check-canon');
  const canonFiles = listFiles(CANON_DIR, ['.md']);

  if (!fileExists(CANON_DIR) || canonFiles.length === 0) {
    fail(result, 'docs/canon/ is missing or contains no Markdown files.');
    return result;
  }

  detail(result, `Loaded ${canonFiles.length} Canon documents for validation context.`);

  const canonText = canonFiles.map(readText).join('\n');
  const availableRiskTerms = HIGH_RISK_TERMS.filter((term) => canonText.includes(term));
  if (availableRiskTerms.length === 0) {
    warn(result, 'No high-risk terms were discoverable in Canon docs; fallback risk list still applied.');
  }

  const files = listFiles(MINIAPP_ROOT, SCANNED_EXTENSIONS);
  detail(result, `Scanned ${files.length} Mini Program content files.`);

  for (const file of files) {
    const text = readText(file);
    for (const term of HIGH_RISK_TERMS) {
      if (text.includes(term)) {
        fail(result, `${relativeFromRoot(file)}: potential Canon-sensitive term "${term}" requires review.`);
      }
    }
  }

  return result;
}

if (require.main === module) {
  const result = run();
  console.log(JSON.stringify(result, null, 2));
  process.exit(result.passed ? 0 : 1);
}

module.exports = { run };
