const store = require('./user-progress-store');
const event = require('./user-progress-event');
const canonical = require('./user-progress-canonical');
const rights = require('./user-progress-rights');

module.exports = {
  ...store,
  ...event,
  ...canonical,
  ...rights
};
