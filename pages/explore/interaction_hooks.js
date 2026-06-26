/**
 * EXPLORE_INTERACTION_HOOKS — V0.5.1 + V0.6 economy UI hooks
 */

import {
  advanceDialogue,
  getDialogueLine,
  buildRareHint
} from '../../system/npc/world_npc_system.js';
import {
  upgradeArtifact,
  canUpgrade,
  getUpgradeValueDelta,
  market_price_simulation
} from '../../system/economy/artifact_market_engine.js';
import { isRareOrAbove } from '../../system/economy/artifact_value_system.js';
import { processInteractiveAction } from '../../system/world_generator.js';
import {
  setGeneratedWorldEvent,
  recordNpcInteraction,
  recordArtifact,
  recordArtifactHistory,
  recordUserWorldDelta
} from '../../system/world_memory.js';

function createRareBadge(artifact) {
  if (!artifact || !isRareOrAbove(artifact.rarity)) return null;
  const badge = document.createElement('span');
  badge.className = 'interaction-hook__badge interaction-hook__badge--rare';
  badge.textContent = '稀有提示';
  return badge;
}

function createValueRow(artifact, market) {
  const row = document.createElement('div');
  row.className = 'interaction-hook__value-row';

  const value = document.createElement('span');
  value.className = 'interaction-hook__value';
  value.textContent = '价值 ' + (artifact.value || '—');

  const price = document.createElement('span');
  price.className = 'interaction-hook__market';
  if (market) {
    const trend = market.trend === 'up' ? '↑' : market.trend === 'down' ? '↓' : '→';
    price.textContent = '市价 ' + market.market_price + ' ' + trend;
  }

  row.appendChild(value);
  if (market) row.appendChild(price);
  return row;
}

function createUpgradeHint(artifact, worldEvent, npc) {
  if (!canUpgrade(artifact)) return null;
  const delta = getUpgradeValueDelta(artifact, worldEvent, npc && npc.value_modifier);
  const hint = document.createElement('p');
  hint.className = 'interaction-hook__upgrade-hint';
  hint.textContent = delta > 0
    ? '可升阶 · 预计 +' + delta + ' 价值'
    : '可升阶 · 提升信物品阶';
  return hint;
}

/**
 * @param {{ container: HTMLElement, worldEvent: object, onUpdate?: Function }} options
 */
export function initNpcDialogueHook(options) {
  const container = options.container;
  const worldEvent = options.worldEvent;
  if (!container || !worldEvent || !worldEvent.interactive) return null;

  const npc = worldEvent.interactive.npc;
  if (!npc) return null;

  container.hidden = false;
  container.innerHTML = '';

  const label = document.createElement('span');
  label.className = 'interaction-hook__label';
  label.textContent = 'NPC';

  const name = document.createElement('strong');
  name.className = 'interaction-hook__name';
  name.textContent = npc.name;

  const rareHint = buildRareHint(worldEvent);
  const rareLine = document.createElement('p');
  rareLine.className = 'interaction-hook__rare-hint';
  if (rareHint) {
    rareLine.textContent = rareHint;
  } else {
    rareLine.hidden = true;
  }

  const line = document.createElement('p');
  line.className = 'interaction-hook__line';
  line.textContent = getDialogueLine(npc, npc.current_state || 'greet');

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'interaction-hook__btn';
  btn.textContent = '继续对话';
  btn.setAttribute('aria-label', '继续与 ' + npc.name + ' 对话');

  function render(nextEvent) {
    const activeNpc = nextEvent.interactive.npc;
    line.textContent = getDialogueLine(activeNpc, activeNpc.current_state || 'greet');
    const hint = buildRareHint(nextEvent);
    if (hint) {
      rareLine.textContent = hint;
      rareLine.hidden = false;
    }
    if (options.onUpdate) options.onUpdate(nextEvent);
  }

  btn.addEventListener('click', function () {
    const advanced = advanceDialogue(worldEvent.interactive.npc);
    const to = advanced.current_state;

    const result = processInteractiveAction({
      type: 'npc_dialogue_advance',
      to: to
    }, Object.assign({}, worldEvent, {
      interactive: Object.assign({}, worldEvent.interactive, { npc: advanced })
    }));

    setGeneratedWorldEvent(result.worldEvent);
    recordNpcInteraction({
      npc_id: advanced.id,
      npc_name: advanced.name,
      dialogue_state: to,
      action: 'dialogue_advance'
    });
    recordUserWorldDelta(result.world_delta);
    render(result.worldEvent);
    Object.assign(worldEvent, result.worldEvent);
  });

  container.appendChild(label);
  container.appendChild(name);
  if (rareHint) container.appendChild(rareLine);
  container.appendChild(line);
  container.appendChild(btn);

  return { container: container, npc: npc };
}

/**
 * @param {{ container: HTMLElement, worldEvent: object, onAcquire?: Function }} options
 */
export function initArtifactAcquireHook(options) {
  const container = options.container;
  const worldEvent = options.worldEvent;
  if (!container || !worldEvent || !worldEvent.artifact) return null;

  const artifact = worldEvent.artifact;
  const npc = worldEvent.interactive && worldEvent.interactive.npc;
  const spawnRate = worldEvent.interactive && worldEvent.interactive.feedback
    ? worldEvent.interactive.feedback.artifact_spawn_rate
    : 0.3;
  const market = artifact.market
    || market_price_simulation(artifact, worldEvent.interactive && worldEvent.interactive.economy);

  container.hidden = false;
  container.innerHTML = '';

  const label = document.createElement('span');
  label.className = 'interaction-hook__label';
  label.textContent = '信物';

  const titleRow = document.createElement('div');
  titleRow.className = 'interaction-hook__title-row';

  const title = document.createElement('strong');
  title.className = 'interaction-hook__name';
  title.textContent = artifact.name;

  const badge = createRareBadge(artifact);
  titleRow.appendChild(title);
  if (badge) titleRow.appendChild(badge);

  const meta = document.createElement('p');
  meta.className = 'interaction-hook__meta';
  meta.textContent = [
    artifact.rarity_label || artifact.rarity || '普通',
    artifact.origin_location,
    '显现率 ' + Math.round(spawnRate * 100) + '%'
  ].filter(Boolean).join(' · ');

  const valueRow = createValueRow(artifact, market);
  const upgradeHint = createUpgradeHint(artifact, worldEvent, npc);

  const btnRow = document.createElement('div');
  btnRow.className = 'interaction-hook__btn-row';

  const btnAcquire = document.createElement('button');
  btnAcquire.type = 'button';
  btnAcquire.className = 'interaction-hook__btn interaction-hook__btn--artifact';
  btnAcquire.textContent = '收为信物';
  btnAcquire.disabled = spawnRate < 0.2;

  const btnUpgrade = document.createElement('button');
  btnUpgrade.type = 'button';
  btnUpgrade.className = 'interaction-hook__btn interaction-hook__btn--upgrade';
  btnUpgrade.textContent = '升阶';
  btnUpgrade.hidden = !canUpgrade(artifact);

  const toast = document.createElement('p');
  toast.className = 'interaction-hook__toast';
  toast.hidden = true;

  btnUpgrade.addEventListener('click', function () {
    const upgraded = upgradeArtifact(artifact, worldEvent, npc && npc.value_modifier);
    const valueDelta = (upgraded.value || 0) - (artifact.value || 0);

    const result = processInteractiveAction({
      type: 'artifact_upgrade',
      artifact: upgraded,
      value_delta: valueDelta
    }, Object.assign({}, worldEvent, { artifact: upgraded }));

    setGeneratedWorldEvent(result.worldEvent);
    recordArtifactHistory({ action: 'upgrade', artifact: upgraded });
    recordUserWorldDelta(result.world_delta);
    Object.assign(worldEvent, result.worldEvent);
    Object.assign(artifact, upgraded);

    const newMarket = upgraded.market || market_price_simulation(upgraded, worldEvent.interactive.economy);
    const newValueRow = createValueRow(upgraded, newMarket);
    valueRow.replaceWith(newValueRow);
    if (upgradeHint) {
      upgradeHint.textContent = canUpgrade(upgraded)
        ? '可继续升阶 · 预计 +' + getUpgradeValueDelta(upgraded, worldEvent, npc && npc.value_modifier) + ' 价值'
        : '已达升阶上限';
    }
    btnUpgrade.hidden = !canUpgrade(upgraded);
    toast.textContent = '升阶完成：' + upgraded.name + '（价值 ' + upgraded.value + '）';
    toast.hidden = false;
  });

  btnAcquire.addEventListener('click', function () {
    const result = processInteractiveAction({
      type: 'artifact_acquire',
      artifact: artifact
    }, worldEvent);

    recordArtifact(artifact);
    recordArtifactHistory({ action: 'acquire', artifact: artifact });
    recordUserWorldDelta(result.world_delta);
    setGeneratedWorldEvent(result.worldEvent);
    Object.assign(worldEvent, result.worldEvent);

    toast.textContent = '已获得：' + artifact.name + '（' + (artifact.rarity_label || artifact.rarity) + ' · 价值 ' + artifact.value + '）';
    toast.hidden = false;
    btnAcquire.disabled = true;

    if (options.onAcquire) options.onAcquire(artifact, result.world_delta);
  });

  btnRow.appendChild(btnAcquire);
  btnRow.appendChild(btnUpgrade);

  container.appendChild(label);
  container.appendChild(titleRow);
  container.appendChild(meta);
  container.appendChild(valueRow);
  if (upgradeHint) container.appendChild(upgradeHint);
  container.appendChild(btnRow);
  container.appendChild(toast);

  return { container: container, artifact: artifact };
}

/**
 * Wire hooks for explore page.
 */
export function initExploreInteractionHooks(worldEvent) {
  const npcHook = document.getElementById('npc-dialogue-hook');
  const artifactHook = document.getElementById('artifact-acquire-hook');

  const hooks = {};

  if (npcHook && worldEvent) {
    hooks.npc = initNpcDialogueHook({
      container: npcHook,
      worldEvent: worldEvent,
      onUpdate: function (updated) {
        document.dispatchEvent(new CustomEvent('worldinteraction', {
          detail: { type: 'npc', worldEvent: updated }
        }));
      }
    });
  }

  if (artifactHook && worldEvent) {
    hooks.artifact = initArtifactAcquireHook({
      container: artifactHook,
      worldEvent: worldEvent,
      onAcquire: function (artifact, delta) {
        document.dispatchEvent(new CustomEvent('worldinteraction', {
          detail: { type: 'artifact', artifact: artifact, world_delta: delta }
        }));
      }
    });
  }

  return hooks;
}
