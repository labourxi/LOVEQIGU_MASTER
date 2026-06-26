/**
 * EVENT_NORMALIZER — V0.7 final
 */
export default function normalizeEvent(event) {
  return {
    type: String(event.type || '').trim(),
    payload: event.payload || {},
    timestamp: Date.now()
  };
}
