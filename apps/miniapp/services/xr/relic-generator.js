function generateRelic(starId, position) {
  return {
    id: starId,
    type: 'spatial_relic',
    position: position || null,
    worldAnchor: true,
    status: 'manifested'
  };
}

module.exports = {
  generateRelic
};
