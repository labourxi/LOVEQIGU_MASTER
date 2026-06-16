const culturalCopy = require('../../data/cultural/cultural-copy');

function joinLines(lines) {
  return (lines || []).join('\n');
}

function getMansionCopy(mansionId) {
  const entry = culturalCopy.mansions[mansionId];
  if (!entry) {
    return null;
  }
  return {
    title: entry.title,
    text: joinLines(entry.lines)
  };
}

function getMeridianCopy(meridianId) {
  const entry = culturalCopy.meridians[meridianId];
  if (!entry) {
    return null;
  }
  return {
    title: entry.title,
    text: joinLines(entry.lines)
  };
}

function getSymbolCopy(symbolId) {
  const entry = culturalCopy.symbols[symbolId];
  if (!entry) {
    return null;
  }
  return {
    title: entry.title,
    text: joinLines(entry.lines)
  };
}

module.exports = {
  getMansionCopy,
  getMeridianCopy,
  getSymbolCopy
};
