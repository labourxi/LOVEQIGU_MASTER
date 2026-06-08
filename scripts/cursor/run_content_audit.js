const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const CONTENT_ENGINE_ROOT = path.join(ROOT, 'CONTENT_ENGINE');
const DOCS_ROOT = path.join(ROOT, 'docs');
const REPORT_MD = path.join(DOCS_ROOT, 'CONTENT_ENGINE_CURSOR_AUDIT_REPORT.md');
const REPORT_JSON = path.join(DOCS_ROOT, 'CONTENT_ENGINE_CURSOR_AUDIT_REPORT.json');

const GOVERNED_FIELDS = ['rarity', 'reward', 'wish_value', 'tier', 'level', 'grade', 'rank'];
const LIBRARIES = [
  'ATOM_LIBRARY',
  'TOKEN_LIBRARY',
  'COLLECTIBLE_LIBRARY',
  'AR_EVENT_LIBRARY',
];

const LEGACY_TERMS = [
  { term: '\u6253\u5361\u5730\u56fe', replacement: '\u63a2\u7d22\u5730\u56fe' },
  { term: '\u79ef\u5206\u5546\u57ce', replacement: '\u6743\u76ca\u4e2d\u5fc3' },
  { term: '\u613f\u529b', replacement: '\u5fc3\u613f\u503c' },
  { term: '\u5f52\u771f', replacement: '\u5408\u771f' },
  { term: '\u56de\u5e94', replacement: '\u56de\u54cd' },
  { term: '\u795d\u7531', replacement: '\u795d\u7981' },
];

function toPosix(filePath) {
  return filePath.split(path.sep).join('/');
}

function relativeFromRoot(filePath) {
  return toPosix(path.relative(ROOT, filePath));
}

function listYamlFiles(dir) {
  if (!fs.existsSync(dir)) {
    return [];
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...listYamlFiles(fullPath));
    } else if (/\.ya?ml$/i.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

function countEntries(text, keys) {
  return keys.reduce((count, key) => {
    const matches = text.match(new RegExp(`^\\s*-\\s*${key}:`, 'gm'));
    return count + (matches ? matches.length : 0);
  }, 0);
}

function splitRecords(lines, startKey) {
  const records = [];
  let current = null;

  lines.forEach((line, index) => {
    if (new RegExp(`^\\s*-\\s*${startKey}:`).test(line)) {
      if (current) {
        records.push(current);
      }
      current = { startLine: index + 1, lines: [line] };
    } else if (current) {
      current.lines.push(line);
    }
  });

  if (current) {
    records.push(current);
  }

  return records;
}

function hasField(record, field) {
  return record.lines.some((line) => new RegExp(`^\\s*${field}:`).test(line));
}

function addIssue(issues, severity, file, line, code, message) {
  issues.push({
    severity,
    file: file ? relativeFromRoot(file) : null,
    line,
    code,
    message,
  });
}

function scanGovernedFields(file, lines, issues, stats) {
  for (const [index, line] of lines.entries()) {
    for (const field of GOVERNED_FIELDS) {
      const pattern = new RegExp(`\\b${field}\\b`);
      if (pattern.test(line)) {
        stats.governedFields[field] += 1;
        addIssue(
          issues,
          'WARN',
          file,
          index + 1,
          'GOVERNED_FIELD',
          `Governed field '${field}' is present under report-only mode.`,
        );
      }
    }
  }
}

function scanLegacyTerms(file, lines, issues, stats) {
  for (const [index, line] of lines.entries()) {
    for (const item of LEGACY_TERMS) {
      if (line.includes(item.term)) {
        stats.legacyTerms += 1;
        addIssue(
          issues,
          'FAIL',
          file,
          index + 1,
          'LEGACY_TERM',
          `Legacy term must be replaced with approved terminology.`,
        );
      }
    }
  }
}

function scanYamlFormat(file, lines, issues) {
  lines.forEach((line, index) => {
    if (line.includes('\t')) {
      addIssue(issues, 'FAIL', file, index + 1, 'YAML_TAB', 'YAML file contains a tab character.');
    }
  });
}

function scanCompleteness(file, text, lines, issues, stats) {
  const rel = relativeFromRoot(file);
  const isAtom = rel.includes('CONTENT_ENGINE/ATOM_LIBRARY/');
  const isToken = rel.includes('CONTENT_ENGINE/TOKEN_LIBRARY/');
  const isCollectible = rel.includes('CONTENT_ENGINE/COLLECTIBLE_LIBRARY/');
  const isArEvent = rel.includes('CONTENT_ENGINE/AR_EVENT_LIBRARY/');

  if (isAtom) {
    const v2Records = splitRecords(lines, 'id');
    const v1Records = splitRecords(lines, 'atom_id');
    stats.counts.atom += v2Records.length + v1Records.length;

    for (const record of v2Records) {
      for (const field of ['category', 'emotion', 'symbol', 'ritual']) {
        if (!hasField(record, field)) {
          addIssue(issues, 'FAIL', file, record.startLine, 'ATOM_FIELD_MISSING', `Atom is missing '${field}'.`);
        }
      }
    }

    for (const record of v1Records) {
      for (const field of ['type', 'name', 'layer']) {
        if (!hasField(record, field)) {
          addIssue(issues, 'FAIL', file, record.startLine, 'ATOM_V1_FIELD_MISSING', `Atom is missing '${field}'.`);
        }
      }
    }
  }

  if (isToken) {
    if (/asset_type:\s*DIGITAL_COLLECTIBLE/.test(text)) {
      stats.counts.collectible += countEntries(text, ['token_id', 'collectible_id']);
    } else {
      stats.counts.token += countEntries(text, ['relic_id', 'token_id']);
    }

    if (/asset_type:\s*RELIC/.test(text) && !/asset_boundary:/.test(text)) {
      addIssue(issues, 'FAIL', file, 1, 'RELIC_BOUNDARY_MISSING', 'Relic token file is missing asset_boundary.');
    }

    if (/asset_type:\s*RELIC/.test(text)) {
      const relicRecords = splitRecords(lines, 'token_id');
      for (const record of relicRecords) {
        if (!hasField(record, 'story_use')) {
          addIssue(issues, 'FAIL', file, record.startLine, 'RELIC_STORY_USE_MISSING', 'Relic token is missing story_use.');
        }
      }
    }
  }

  if (isCollectible) {
    if (/asset_type:\s*RELIC/.test(text)) {
      stats.counts.token += countEntries(text, ['relic_id', 'token_id']);
    } else {
      stats.counts.collectible += countEntries(text, ['collectible_id', 'token_id']);
    }

    if (/asset_type:\s*DIGITAL_COLLECTIBLE/.test(text) && !/marketing and communication asset only/i.test(text)) {
      addIssue(
        issues,
        'FAIL',
        file,
        1,
        'DIGITAL_COLLECTIBLE_BOUNDARY_MISSING',
        'Digital Collectible file must state communication/marketing boundary.',
      );
    }
  }

  if (isArEvent) {
    const records = splitRecords(lines, 'event_id');
    stats.counts.arEvent += records.length;

    for (const record of records) {
      if (!hasField(record, 'interaction')) {
        addIssue(issues, 'FAIL', file, record.startLine, 'AR_EVENT_FIELD_MISSING', "AR Event is missing 'interaction'.");
      }

      const hasTrigger = hasField(record, 'trigger');
      const hasV1TriggerContext =
        hasField(record, 'code') && hasField(record, 'chapter_id') && hasField(record, 'node_id');

      if (!hasTrigger && !hasV1TriggerContext) {
        addIssue(
          issues,
          'FAIL',
          file,
          record.startLine,
          'AR_EVENT_TRIGGER_MISSING',
          'AR Event is missing trigger or V1 trigger context.',
        );
      }

      if (!hasField(record, 'next_event') && !hasField(record, 'output_refs')) {
        addIssue(
          issues,
          'WARN',
          file,
          record.startLine,
          'AR_EVENT_LINKAGE_MISSING',
          'AR Event has no next_event or output_refs linkage.',
        );
      }
    }
  }
}

function scanDuplicateIds(file, lines, issues, idRegistry) {
  lines.forEach((line, index) => {
    const match = line.match(/^\s*-?\s*(atom_id|id|relic_id|token_id|collectible_id|event_id):\s*([A-Za-z0-9_.-]+)/);
    if (!match) {
      return;
    }

    const value = match[2];
    if (idRegistry.has(value)) {
      const first = idRegistry.get(value);
      addIssue(
        issues,
        'FAIL',
        file,
        index + 1,
        'DUPLICATE_ID',
        `Duplicate id '${value}' first seen at ${first.file}:${first.line}.`,
      );
      return;
    }

    idRegistry.set(value, { file: relativeFromRoot(file), line: index + 1 });
  });
}

function renderIssues(issues, severity) {
  const filtered = issues.filter((issue) => issue.severity === severity);
  if (!filtered.length) {
    return '- None.';
  }

  return filtered
    .slice(0, 80)
    .map((issue) => `- ${issue.file || 'repository'}:${issue.line || 0} ${issue.code} - ${issue.message}`)
    .join('\n');
}

function renderMarkdown(result) {
  return `# LOVEQIGU Content Engine Cursor Audit

Generated: ${result.generatedAt}
Scope: \`CONTENT_ENGINE/**/*.yaml\`
Status: ${result.status}

## Summary

| Metric | Count |
|---|---:|
| YAML files scanned | ${result.scannedFiles} |
| Atom records | ${result.counts.atom} |
| Token / Relic records | ${result.counts.token} |
| Collectible / Digital Collectible records | ${result.counts.collectible} |
| AR Event records | ${result.counts.arEvent} |
| FAIL issues | ${result.failCount} |
| WARN issues | ${result.warnCount} |

## Trigger Nodes

| Trigger | Cursor audit requirement |
|---|---|
| Initial landing | Run after V1/V2 content generation completes. |
| Batch generation | Run after V3 or later expansion content completes. |
| Workflow execution | Run after Ductor or OMX completes. |
| Scheduled maintenance | Run weekly before content release or automation continuation. |

## Governed Field Scan

| Field | Occurrences |
|---|---:|
| \`rarity\` | ${result.governedFields.rarity} |
| \`reward\` | ${result.governedFields.reward} |
| \`wish_value\` | ${result.governedFields.wish_value} |
| \`tier\` | ${result.governedFields.tier} |
| \`level\` | ${result.governedFields.level} |
| \`grade\` | ${result.governedFields.grade} |
| \`rank\` | ${result.governedFields.rank} |

Governed fields remain WARN under the current report-only governance mode. High-risk changes require manual review and must not be auto-fixed.

## FAIL

${renderIssues(result.issues, 'FAIL')}

## WARN

${renderIssues(result.issues, 'WARN')}

## Workflow Gate

- New or updated Content Engine YAML must pass Cursor audit before downstream automation continues.
- Existing governed fields are warning-only until governance mode changes from report-only.
- Relic remains story progression and Canon-driven.
- Digital Collectible remains marketing and communication only.
- Relic and Digital Collectible must not be mixed.

LOVEQIGU_CONTENT_ENGINE_CURSOR_AUDIT_COMPLETE = YES
`;
}

function run() {
  const generatedAt = new Date().toISOString();
  const issues = [];
  const idRegistry = new Map();
  const stats = {
    counts: {
      atom: 0,
      token: 0,
      collectible: 0,
      arEvent: 0,
    },
    governedFields: Object.fromEntries(GOVERNED_FIELDS.map((field) => [field, 0])),
    legacyTerms: 0,
  };

  for (const library of LIBRARIES) {
    const dir = path.join(CONTENT_ENGINE_ROOT, library);
    if (!fs.existsSync(dir)) {
      addIssue(issues, 'FAIL', dir, 0, 'LIBRARY_MISSING', `${library} does not exist.`);
      continue;
    }

    const files = listYamlFiles(dir);
    if (!files.length) {
      addIssue(issues, 'FAIL', dir, 0, 'LIBRARY_EMPTY', `${library} has no YAML files.`);
    }
  }

  const files = listYamlFiles(CONTENT_ENGINE_ROOT);
  for (const file of files) {
    const text = fs.readFileSync(file, 'utf8');
    const lines = text.split(/\r?\n/);

    scanYamlFormat(file, lines, issues);
    scanLegacyTerms(file, lines, issues, stats);
    scanGovernedFields(file, lines, issues, stats);
    scanCompleteness(file, text, lines, issues, stats);
    scanDuplicateIds(file, lines, issues, idRegistry);
  }

  const failCount = issues.filter((issue) => issue.severity === 'FAIL').length;
  const warnCount = issues.filter((issue) => issue.severity === 'WARN').length;
  const status = failCount > 0 ? 'FAIL' : warnCount > 0 ? 'WARN' : 'PASS';

  const result = {
    generatedAt,
    status,
    scannedFiles: files.length,
    counts: stats.counts,
    governedFields: stats.governedFields,
    legacyTerms: stats.legacyTerms,
    failCount,
    warnCount,
    issues,
    marker: 'LOVEQIGU_CONTENT_ENGINE_CURSOR_AUDIT_COMPLETE = YES',
  };

  fs.mkdirSync(DOCS_ROOT, { recursive: true });
  fs.writeFileSync(REPORT_JSON, `${JSON.stringify(result, null, 2)}\n`, 'utf8');
  fs.writeFileSync(REPORT_MD, renderMarkdown(result), 'utf8');

  console.log(`Cursor Content Engine audit status: ${status}`);
  console.log(`YAML files scanned: ${files.length}`);
  console.log(`FAIL issues: ${failCount}`);
  console.log(`WARN issues: ${warnCount}`);
  console.log(`Markdown report: ${REPORT_MD}`);
  console.log(`JSON report: ${REPORT_JSON}`);
  console.log('LOVEQIGU_CONTENT_ENGINE_CURSOR_AUDIT_COMPLETE = YES');

  return result;
}

if (require.main === module) {
  const result = run();
  process.exit(result.status === 'FAIL' ? 1 : 0);
}

module.exports = { run };
