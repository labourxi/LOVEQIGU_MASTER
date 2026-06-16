/**
 * Factory for chapter runtime bridges — consumes statically required L2 payloads.
 * WeChat Mini Program: NO dynamic require(). Bridge files must require() data modules directly.
 */

function createChapterBridge(config) {
  const story = config.story;
  const relics = config.relics;
  const rights = config.rights;
  const arEvents = config.arEvents;
  const dc = config.digitalCollectible;

  function getStoryChapter() {
    const chapter = story.chapters.find((item) => item.id === config.chapterId)
      || story.chapters[0];
    return {
      id: chapter.id,
      chapter_code: chapter.chapter_code,
      title: chapter.title,
      display_title: chapter.display_title,
      status: chapter.status,
      summary: chapter.summary,
      progress: { ...chapter.progress },
      imprint_album: chapter.imprint_album ? { ...chapter.imprint_album } : null,
      nodes: chapter.nodes.map((node) => ({ ...node }))
    };
  }

  function getRelics() {
    return relics.relics.map((relic) => ({
      ...relic,
      status: relic.status === 'unrecorded' ? 'placeholder' : relic.status,
      display_copy: relic.description || relic.awareness_line || ''
    }));
  }

  function getRights() {
    return rights.rights.map((right) => ({
      id: right.id,
      name: right.name,
      chapter_id: right.chapter_id,
      type: right.type,
      status: right.status,
      redemption: right.redemption ? { ...right.redemption } : null
    }));
  }

  function getArEvents() {
    return arEvents.events.map((event) => ({
      id: event.id,
      code: event.code,
      name: event.name,
      copy: event.copy,
      chapter_id: event.chapter_id,
      node_id: event.node_id,
      camera_enabled: event.camera_enabled,
      fake_ar_enabled: event.fake_ar_enabled,
      relic_refs: [...(event.relic_refs || [])],
      rights_refs: [...(event.rights_refs || [])],
      digital_collectible_refs: [...(event.digital_collectible_refs || [])]
    }));
  }

  function getDigitalCollectible() {
    return {
      token_id: dc.token_id,
      collectible_id: dc.token_id,
      name: dc.name,
      title: dc.title || dc.name,
      asset_type: 'DIGITAL_COLLECTIBLE',
      asset_role: 'marketing_asset',
      subtype: 'share_poster',
      chapter_id: config.chapterId,
      story_state_effect: 'none',
      relic_progression_effect: 'none',
      affects_completion_logic: false,
      role: 'User-generated share poster',
      display_context: 'chapter_completion_share',
      copy: dc.copy,
      next_path: '/pages/next-activity/index',
      source_ref: dc.source_ref,
      ar_event_ref: dc.ar_event_ref,
      rights_ref: dc.rights_ref
    };
  }

  function getAssetBoundary() {
    return {
      relic: relics.asset_boundary.relic,
      digital_collectible: relics.asset_boundary.digital_collectible,
      rule: relics.asset_boundary.rule
    };
  }

  function validateCrossRefs() {
    const errors = [];
    const chapter = getStoryChapter();
    const nodes = Object.fromEntries(chapter.nodes.map((n) => [n.id, n]));
    const relicIds = new Set(getRelics().map((r) => r.id));
    const rightIds = new Set(getRights().map((r) => r.id));
    const arIds = new Set(getArEvents().map((e) => e.id));

    chapter.nodes.forEach((node) => {
      (node.relic_refs || []).forEach((rid) => {
        if (!relicIds.has(rid)) errors.push(`node ${node.id} missing relic ${rid}`);
      });
      (node.ar_event_refs || []).forEach((aid) => {
        if (!arIds.has(aid)) errors.push(`node ${node.id} missing ar ${aid}`);
      });
    });

    getArEvents().forEach((event) => {
      (event.relic_refs || []).forEach((rid) => {
        if (!relicIds.has(rid)) errors.push(`ar ${event.id} missing relic ${rid}`);
      });
      (event.rights_refs || []).forEach((wid) => {
        if (!rightIds.has(wid)) errors.push(`ar ${event.id} missing right ${wid}`);
      });
      (event.digital_collectible_refs || []).forEach((tokenId) => {
        if (tokenId !== dc.token_id) errors.push(`ar ${event.id} unregistered dc ${tokenId}`);
      });
      if (!nodes[event.node_id]) errors.push(`ar ${event.id} orphan node`);
    });

    const completion = getArEvents().find((e) => e.id === dc.ar_event_ref);
    if (!completion || !completion.digital_collectible_refs.includes(dc.token_id)) {
      errors.push(`completion AR missing ${dc.token_id} ref`);
    }

    return { ok: errors.length === 0, errors, chapter_code: config.chapterCode };
  }

  return {
    CHAPTER_ID: config.chapterId,
    CHAPTER_CODE: config.chapterCode,
    getStoryChapter,
    getRelics,
    getRights,
    getArEvents,
    getDigitalCollectible,
    getAssetBoundary,
    validateCrossRefs
  };
}

module.exports = {
  createChapterBridge
};
