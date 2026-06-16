/**
 * Root Node runtime loader for CH03 L2 data.
 */
const path = require('path');
const fs = require('fs');

const ROOT = path.resolve(__dirname, '../..');

function readJson(relPath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relPath), 'utf8'));
}

const story = readJson('data/story/ch03_chapters.json');
const relics = readJson('data/relics/ch03_relics.json');
const rights = readJson('data/rights/ch03_rights.json');
const ar = readJson('data/ar/ch03_ar-events.json');
const dcRegistryPath = path.join(ROOT, 'docs/content/DIGITAL_COLLECTIBLE_REGISTRY_CH03.md');
const dcRegistryText = fs.readFileSync(dcRegistryPath, 'utf8');

const DC_ID = 'dc_ch03_completion_poster';

function getChapter() {
  return story.chapters[0];
}

function getRelics() {
  return relics.relics;
}

function getRights() {
  return rights.rights;
}

function getArEvents() {
  return ar.events;
}

function getDigitalCollectible() {
  if (!dcRegistryText.includes(DC_ID)) {
    return null;
  }
  return {
    token_id: DC_ID,
    name: '再度重逢分享海报',
    asset_type: 'DIGITAL_COLLECTIBLE',
    story_state_effect: 'none',
    source_ref: 'docs/content/DIGITAL_COLLECTIBLE_REGISTRY_CH03.md'
  };
}

function validateCrossRefs() {
  const ch = getChapter();
  const nodes = Object.fromEntries(ch.nodes.map((n) => [n.id, n]));
  const relicIds = new Set(getRelics().map((r) => r.id));
  const rightIds = new Set(getRights().map((r) => r.id));
  const arIds = new Set(getArEvents().map((e) => e.id));
  const errors = [];

  ch.nodes.forEach((node) => {
    (node.relic_refs || []).forEach((rid) => {
      if (!relicIds.has(rid)) errors.push(`node ${node.id} -> ${rid}`);
    });
    (node.ar_event_refs || []).forEach((aid) => {
      if (!arIds.has(aid)) errors.push(`node ${node.id} -> ${aid}`);
    });
  });

  getArEvents().forEach((event) => {
    (event.relic_refs || []).forEach((rid) => {
      if (!relicIds.has(rid)) errors.push(`ar ${event.id} -> ${rid}`);
    });
    (event.rights_refs || []).forEach((wid) => {
      if (!rightIds.has(wid)) errors.push(`ar ${event.id} -> ${wid}`);
    });
    if (!nodes[event.node_id]) errors.push(`ar ${event.id} orphan node`);
  });

  if (!getDigitalCollectible()) errors.push('DC registry missing token');
  const completion = getArEvents().find((e) => e.id === 'ar_ch03_completion_v1');
  if (!completion || !(completion.digital_collectible_refs || []).includes(DC_ID)) {
    errors.push('completion AR -> DC broken');
  }

  return { ok: errors.length === 0, errors, counts: { nodes: ch.nodes.length, relics: relicIds.size, rights: rightIds.size, ar: arIds.size } };
}

module.exports = {
  getChapter,
  getRelics,
  getRights,
  getArEvents,
  getDigitalCollectible,
  validateCrossRefs,
  DC_ID
};
