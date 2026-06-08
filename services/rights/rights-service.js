const data = require('../../data/rights/rights.json');

function loadData() {
  return data;
}

function getAllRights() {
  return loadData().rights;
}

function getRightById(id) {
  return getAllRights().find((right) => right.id === id) || null;
}

function getRightsByType(type) {
  return getAllRights().filter((right) => right.type === type);
}

module.exports = {
  getAllRights,
  getRightById,
  getRightsByType,
};
