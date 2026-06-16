const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');

const CHAPTERS = [
  {
    code: 'CH01',
    id: 'ch01_cloud_awakening',
    story: 'data/story/chapters.json',
    relics: 'data/relics/relics.json',
    rights: 'data/rights/rights.json',
    ar: 'data/ar/ar-events.json',
    dcRegistry: 'docs/content/DIGITAL_COLLECTIBLE_REGISTRY_CH01.md',
    dcToken: 'dc_ch01_completion_poster',
    completionAr: 'ar_ch01_completion_v1',
    shareRight: 'right_ch01_share_poster'
  },
  {
    code: 'CH02',
    id: 'ch02_mountain_gate_echo',
    story: 'data/story/ch02_chapters.json',
    relics: 'data/relics/ch02_relics.json',
    rights: 'data/rights/ch02_rights.json',
    ar: 'data/ar/ch02_ar-events.json',
    dcRegistry: 'docs/content/DIGITAL_COLLECTIBLE_REGISTRY_CH02.md',
    dcToken: 'dc_ch02_completion_poster',
    completionAr: 'ar_ch02_completion_v1',
    shareRight: 'right_ch02_share_poster'
  },
  {
    code: 'CH03',
    id: 'ch03_field_reunion',
    story: 'data/story/ch03_chapters.json',
    relics: 'data/relics/ch03_relics.json',
    rights: 'data/rights/ch03_rights.json',
    ar: 'data/ar/ch03_ar-events.json',
    dcRegistry: 'docs/content/DIGITAL_COLLECTIBLE_REGISTRY_CH03.md',
    dcToken: 'dc_ch03_completion_poster',
    completionAr: 'ar_ch03_completion_v1',
    shareRight: 'right_ch03_share_poster'
  }
];

const FORBIDDEN_TERMS = ['打卡地图', '积分商城', '愿力', '归真', '回应', '祝由'];
const FORBIDDEN_RELIC_SEMANTICS = ['rarity', 'level', 'grade', 'rank', 'equipment', 'loot', 'trophy'];

function readJson(rel) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf8'));
}

function fileExists(rel) {
  return fs.existsSync(path.join(ROOT, rel));
}

function scanText(rel, text) {
  const hits = [];
  FORBIDDEN_TERMS.forEach((term) => {
    if (text.includes(term)) hits.push(term);
  });
  return hits;
}

const findings = [];
const chapterResults = [];

CHAPTERS.forEach((cfg) => {
  const result = {
    code: cfg.code,
    chapterId: cfg.id,
    files: {},
    counts: {},
    crossRefs: { ok: true, errors: [] },
    boundaries: { ok: true, errors: [] },
    continuity: {},
    dc: {},
    terminology: [],
    pass: true
  };

  ['story', 'relics', 'rights', 'ar'].forEach((key) => {
    result.files[key] = fileExists(cfg[key]) ? 'present' : 'missing';
    if (!fileExists(cfg[key])) {
      result.pass = false;
      findings.push({ severity: 'blocker', chapter: cfg.code, issue: `Missing ${cfg[key]}` });
    }
  });

  result.files.dcRegistry = fileExists(cfg.dcRegistry) ? 'present' : 'missing';
  if (!fileExists(cfg.dcRegistry)) {
    result.pass = false;
    findings.push({
      severity: 'blocker',
      chapter: cfg.code,
      issue: `Missing DC registry: ${cfg.dcRegistry}`
    });
  }

  if (result.files.story === 'missing') return chapterResults.push(result);

  const story = readJson(cfg.story);
  const relics = readJson(cfg.relics);
  const rights = readJson(cfg.rights);
  const ar = readJson(cfg.ar);

  const chapter = story.chapters.find((c) => c.id === cfg.id) || story.chapters[0];
  const nodes = chapter.nodes;
  const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const relicIds = new Set(relics.relics.map((r) => r.id));
  const rightIds = new Set(rights.rights.map((r) => r.id));
  const arIds = new Set(ar.events.map((e) => e.id));

  result.counts = {
    nodes: nodes.length,
    relics: relics.relics.length,
    rights: rights.rights.length,
    ar: ar.events.length
  };

  [5, 6, 5, 6].forEach((expected, i) => {
    const keys = ['nodes', 'relics', 'rights', 'ar'];
    if (result.counts[keys[i]] !== expected) {
      result.pass = false;
      findings.push({
        severity: 'blocker',
        chapter: cfg.code,
        issue: `${keys[i]} count ${result.counts[keys[i]]} != ${expected}`
      });
    }
  });

  // Cross-ref validation
  nodes.forEach((node) => {
    (node.relic_refs || []).forEach((rid) => {
      if (!relicIds.has(rid)) {
        result.crossRefs.ok = false;
        result.crossRefs.errors.push(`node ${node.id} -> missing relic ${rid}`);
      }
    });
    (node.ar_event_refs || []).forEach((aid) => {
      if (!arIds.has(aid)) {
        result.crossRefs.ok = false;
        result.crossRefs.errors.push(`node ${node.id} -> missing ar ${aid}`);
      }
    });
  });

  ar.events.forEach((event) => {
    if (!nodeMap[event.node_id]) {
      result.crossRefs.ok = false;
      result.crossRefs.errors.push(`ar ${event.id} orphan node ${event.node_id}`);
    }
    (event.relic_refs || []).forEach((rid) => {
      if (!relicIds.has(rid)) {
        result.crossRefs.ok = false;
        result.crossRefs.errors.push(`ar ${event.id} -> missing relic ${rid}`);
      }
    });
    (event.rights_refs || []).forEach((wid) => {
      if (!rightIds.has(wid)) {
        result.crossRefs.ok = false;
        result.crossRefs.errors.push(`ar ${event.id} -> missing right ${wid}`);
      }
    });
  });

  rights.rights.forEach((right) => {
    (right.relic_refs || []).forEach((rid) => {
      if (!relicIds.has(rid)) {
        result.crossRefs.ok = false;
        result.crossRefs.errors.push(`right ${right.id} -> missing relic ${rid}`);
      }
    });
  });

  const completionRelic = chapter.completion && chapter.completion.completion_mark_relic_ref;
  if (completionRelic && !relicIds.has(completionRelic)) {
    result.crossRefs.ok = false;
    result.crossRefs.errors.push(`completion_mark_relic_ref ${completionRelic} missing`);
  }

  const n5 = nodes.find((n) => n.node_type === 'chapter_completion');
  if (n5 && completionRelic && !(n5.relic_refs || []).includes(completionRelic)) {
    result.crossRefs.ok = false;
    result.crossRefs.errors.push('n5 missing completion_mark relic ref');
  }

  // Asset boundaries
  relics.relics.forEach((relic) => {
    if (relic.asset_class && relic.asset_class !== 'story_progression') {
      result.boundaries.ok = false;
      result.boundaries.errors.push(`relic ${relic.id} wrong asset_class`);
    }
    if ((relic.id || '').startsWith('dc_')) {
      result.boundaries.ok = false;
      result.boundaries.errors.push(`relic ${relic.id} looks like DC`);
    }
  });

  if (!relics.asset_boundary || !relics.asset_boundary.rule) {
    result.boundaries.ok = false;
    result.boundaries.errors.push('relic asset_boundary missing');
  }

  if (!rights.asset_boundary || !rights.asset_boundary.rule) {
    result.boundaries.ok = false;
    result.boundaries.errors.push('rights asset_boundary missing');
  }

  if (!ar.asset_boundary || !ar.asset_boundary.digital_collectible) {
    result.boundaries.ok = false;
    result.boundaries.errors.push('ar asset_boundary missing');
  }

  const completionAr = ar.events.find((e) => e.id === cfg.completionAr);
  if (!completionAr) {
    result.dc.ok = false;
    findings.push({ severity: 'blocker', chapter: cfg.code, issue: `Missing ${cfg.completionAr}` });
  } else {
    const dcRefs = completionAr.digital_collectible_refs || [];
    if (!dcRefs.includes(cfg.dcToken)) {
      result.dc.ok = false;
      findings.push({
        severity: 'blocker',
        chapter: cfg.code,
        issue: `Completion AR missing ${cfg.dcToken}`
      });
    }
    if (!(completionAr.rights_refs || []).includes(cfg.shareRight)) {
      result.dc.ok = false;
      findings.push({
        severity: 'warning',
        chapter: cfg.code,
        issue: `Completion AR missing share right ${cfg.shareRight}`
      });
    }
  }

  if (fileExists(cfg.dcRegistry)) {
    const dcText = fs.readFileSync(path.join(ROOT, cfg.dcRegistry), 'utf8');
    if (!dcText.includes(cfg.dcToken)) {
      result.dc.registryToken = false;
      findings.push({ severity: 'blocker', chapter: cfg.code, issue: 'DC registry missing token_id' });
    } else {
      result.dc.registryToken = true;
    }
    if (!dcText.includes('story_state_effect') && !dcText.includes('none')) {
      findings.push({ severity: 'warning', chapter: cfg.code, issue: 'DC registry may lack progression boundary' });
    }
  }

  // Terminology scan on JSON text
  [cfg.story, cfg.relics, cfg.rights, cfg.ar].forEach((rel) => {
    const text = fs.readFileSync(path.join(ROOT, rel), 'utf8');
    const hits = scanText(rel, text);
    if (hits.length) {
      result.terminology.push({ file: rel, hits });
      findings.push({ severity: 'blocker', chapter: cfg.code, issue: `Forbidden terms in ${rel}: ${hits.join(', ')}` });
    }
  });

  // Continuity
  result.continuity = {
    previous_chapter: chapter.previous_chapter || story.previous_chapter_ref || null,
    next_chapter: chapter.next_chapter || null,
    title: chapter.title
  };

  if (!result.crossRefs.ok) result.pass = false;
  if (!result.boundaries.ok) result.pass = false;
  if (result.dc.ok === false) result.pass = false;

  chapterResults.push(result);
});

// Inter-chapter continuity
const ch01 = chapterResults.find((c) => c.code === 'CH01');
const ch02 = chapterResults.find((c) => c.code === 'CH02');
const ch03 = chapterResults.find((c) => c.code === 'CH03');

const continuityIssues = [];
if (ch01 && ch01.continuity.next_chapter !== 'ch02_mountain_gate_echo') {
  continuityIssues.push('CH01 next_chapter not wired to CH02');
}
if (ch02 && ch02.continuity.previous_chapter !== 'ch01_cloud_awakening') {
  continuityIssues.push('CH02 previous_chapter not wired to CH01');
}
if (ch02 && ch02.continuity.next_chapter !== 'ch03_field_reunion') {
  continuityIssues.push('CH02 next_chapter not wired to CH03');
}
if (ch03 && ch03.continuity.previous_chapter !== 'ch02_mountain_gate_echo') {
  continuityIssues.push('CH03 previous_chapter not wired to CH02');
}
if (ch03 && ch03.continuity.next_chapter === 'TBD') {
  continuityIssues.push('CH03 next_chapter is TBD');
}

// Title drift: YAML/registry vs story
const yamlPath = path.join(ROOT, 'CONTENT_ENGINE/TOKEN_LIBRARY/digital_collectibles_v1.yaml');
if (fileExists(yamlPath)) {
  const yaml = fs.readFileSync(yamlPath, 'utf8');
  if (yaml.includes('云门初醒') && ch01 && ch01.continuity.title === '云间初醒') {
    continuityIssues.push('CH01 DC YAML name drift: 云门初醒 vs story 云间初醒');
  }
}

const blockers = findings.filter((f) => f.severity === 'blocker');
const warnings = findings.filter((f) => f.severity === 'warning');

const allChaptersPass = chapterResults.every((c) => c.pass && c.crossRefs.ok && c.boundaries.ok);
const dcRegistryComplete = CHAPTERS.every((cfg) => fileExists(cfg.dcRegistry));
const continuityPass = continuityIssues.filter((i) => i.includes('TBD') || i.includes('not wired')).length === 0
  || false;

// Verdict logic: NO if any blocker; TBD next_chapter and missing CH01 registry are blockers for full acceptance
const productAcceptance =
  blockers.length === 0 &&
  allChaptersPass &&
  chapterResults.every((c) => c.counts.nodes === 5);

console.log(JSON.stringify({
  chapterResults,
  continuityIssues,
  blockers,
  warnings,
  PRODUCT_ACCEPTANCE_CH01_03: productAcceptance ? 'YES' : 'NO'
}, null, 2));
