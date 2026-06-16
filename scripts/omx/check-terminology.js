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

const TERMINOLOGY_DOC = path.join(DOCS_ROOT, 'language', 'LOVEQIGU_TERMINOLOGY_V1.md');
const SCANNED_EXTENSIONS = ['.js', '.json', '.wxml', '.wxss'];

function parseTerminologyPairs(markdown) {
  const pairs = [];
  const lines = markdown.split(/\r?\n/);

  for (const line of lines) {
    if (!line.startsWith('| T-')) {
      continue;
    }

    const cells = line.split('|').map((cell) => cell.trim());
    if (cells.length < 5) {
      continue;
    }

    const oldTerm = cells[2];
    const newTerm = cells[3];
    if (!oldTerm || !newTerm || oldTerm === newTerm) {
      continue;
    }

    if (newTerm.includes('保持') || newTerm.includes('保留') || newTerm.includes('拆分') || newTerm.includes('删除')) {
      continue;
    }

    if (oldTerm.length > 1) {
      pairs.push({ id: cells[1], oldTerm, newTerm });
    }
  }

  return pairs;
}

const CONFIRM_ALLOWED_PHRASES = [
  '确认章成',
  '确认探索',
  '确认留下',
  '确认完成',
  '前往合真之路确认章成',
  '前往任务中心确认章成'
];

function containsOutdatedTerm(text, pair) {
  if (pair.id === 'T-N5-009' && pair.oldTerm === '确认') {
    let masked = text;
    CONFIRM_ALLOWED_PHRASES.forEach((phrase) => {
      masked = masked.split(phrase).join('·'.repeat(phrase.length));
    });
    return masked.includes('确认');
  }
  return text.includes(pair.oldTerm);
}

function run() {
  const result = createResult('check-terminology');

  if (!fileExists(TERMINOLOGY_DOC)) {
    fail(result, 'docs/language/LOVEQIGU_TERMINOLOGY_V1.md is missing.');
    return result;
  }

  const terminologyMarkdown = readText(TERMINOLOGY_DOC);
  const pairs = parseTerminologyPairs(terminologyMarkdown);
  const files = listFiles(MINIAPP_ROOT, SCANNED_EXTENSIONS);

  detail(result, `Loaded ${pairs.length} terminology replacement pairs.`);
  detail(result, `Scanned ${files.length} Mini Program text/config files.`);

  if (pairs.length === 0) {
    warn(result, 'No actionable old/new terminology pairs were parsed from the terminology document.');
  }

  for (const file of files) {
    const text = readText(file);
    for (const pair of pairs) {
      if (containsOutdatedTerm(text, pair)) {
        fail(result, `${relativeFromRoot(file)}: found outdated term "${pair.oldTerm}" from ${pair.id}; expected "${pair.newTerm}".`);
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
