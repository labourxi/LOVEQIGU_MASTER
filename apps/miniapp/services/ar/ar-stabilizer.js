let buffer = [];

const WINDOW_SIZE = 5;

function normalizeMarker(marker) {
  if (!marker || typeof marker !== 'object') {
    return null;
  }

  const id = marker.id || marker.markerId || marker.code;
  if (!id) {
    return null;
  }

  return {
    id,
    confidence: Number.isFinite(marker.confidence) ? marker.confidence : 0,
    raw: marker
  };
}

function merge(list) {
  return list.reduce((acc, item) => {
    if (!Array.isArray(item)) {
      return acc;
    }
    item.forEach((marker) => {
      const normalized = normalizeMarker(marker);
      if (normalized) {
        acc.push(normalized);
      }
    });
    return acc;
  }, []);
}

function filterNoise(markers) {
  const countMap = Object.create(null);
  const bestMap = Object.create(null);

  markers.forEach((marker) => {
    const entry = normalizeMarker(marker);
    if (!entry) {
      return;
    }
    countMap[entry.id] = (countMap[entry.id] || 0) + 1;
    if (!bestMap[entry.id] || bestMap[entry.id].confidence < entry.confidence) {
      bestMap[entry.id] = entry;
    }
  });

  return Object.keys(countMap)
    .filter((id) => countMap[id] >= 3)
    .map((id) => bestMap[id])
    .filter(Boolean);
}

function stabilize(markers) {
  buffer.push(Array.isArray(markers) ? markers : []);

  if (buffer.length > WINDOW_SIZE) {
    buffer.shift();
  }

  return filterNoise(merge(buffer));
}

function reset() {
  buffer = [];
}

module.exports = {
  stabilize,
  reset,
  WINDOW_SIZE
};
