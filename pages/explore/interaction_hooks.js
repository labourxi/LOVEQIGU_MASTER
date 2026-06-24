/**
 * EXPLORE_INTERACTION_HOOKS — V0.5.1 UI hooks (interface only, minimal chrome)
 * NPC dialogue hook · artifact acquire hook
 */

import { advanceDialogue, getDialogueLine } from '../../system/npc/world_npc_system.js';
import { upgradeArtifact } from '../../system/economy/artifact_economy.js';
import { processInteractiveAction } from '../../system/world_generator.js';
import {
  setGeneratedWorldEvent,
  recordNpcInteraction,
  recordArtifact,
  recordArtifactHistory,
  recordUserWorldDelta
} from '../../system/world_memory.js';

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
  const spawnRate = worldEvent.interactive && worldEvent.interactive.feedback
    ? worldEvent.interactive.feedback.artifact_spawn_rate
    : 0.3;

  container.hidden = false;
  container.innerHTML = '';

  const label = document.createElement('span');
  label.className = 'interaction-hook__label';
  label.textContent = '信物';

  const title = document.createElement('strong');
  title.className = 'interaction-hook__name';
  title.textContent = artifact.name;

  const meta = document.createElement('p');
  meta.className = 'interaction-hook__meta';
  meta.textContent = [
    artifact.rarity_label || artifact.rarity || '寻常',
    artifact.origin_location,
    '显现率 ' + Math.round(spawnRate * 100) + '%'
  ].filter(Boolean).join(' · ');

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'interaction-hook__btn interaction-hook__btn--artifact';
  btn.textContent = '收为信物';
  btn.disabled = spawnRate < 0.2;

  const toast = document.createElement('p');
  toast.className = 'interaction-hook__toast';
  toast.hidden = true;

  btn.addEventListener('click', function () {
    const upgraded = upgradeArtifact(artifact);
    const result = processInteractiveAction({
      type: 'artifact_acquire',
      artifact: upgraded
    }, worldEvent);

    recordArtifact(upgraded);
    recordArtifactHistory({ action: 'acquire', artifact: upgraded });
    recordUserWorldDelta(result.world_delta);
    setGeneratedWorldEvent(result.worldEvent);
    Object.assign(worldEvent, result.worldEvent);

    toast.textContent = '已获得：' + upgraded.name + '（' + (upgraded.rarity_label || upgraded.rarity) + '）';
    toast.hidden = false;
    btn.disabled = true;

    if (options.onAcquire) options.onAcquire(upgraded, result.world_delta);
  });

  container.appendChild(label);
  container.appendChild(title);
  container.appendChild(meta);
  container.appendChild(btn);
  container.appendChild(toast);

  return { container: container, artifact: artifact };
}

/**
 * Wire both hooks for explore page.
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
