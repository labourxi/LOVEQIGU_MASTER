const data = require('../../data/ar/ar-events.json');

function loadData() {
  return data;
}

function getAllArEvents() {
  return loadData().events;
}

function getArEventById(id) {
  return getAllArEvents().find((event) => event.id === id) || null;
}

function getArEventByCode(code) {
  return getAllArEvents().find((event) => event.code === code) || null;
}

module.exports = {
  getAllArEvents,
  getArEventById,
  getArEventByCode,
};
