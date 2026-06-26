/**
 * EVENT_VALIDATOR — V0.7 final
 */
const ALLOWED_EVENTS = [
  'npc_dialogue_advance',
  'npc_dialogue_set',
  'artifact_acquire',
  'artifact_upgrade',
  'artifact_combine',
  'card_interact'
];

export function validateEvent(event) {
  return ALLOWED_EVENTS.includes(event.type);
}
