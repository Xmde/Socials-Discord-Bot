const db = require('../startup/db');

module.exports = async function (msg) {
  let data = db.getData('/twitch/streamNotifs');
  let index = data.findIndex((val) => val.message.id === msg.id);
  db.delete(`/twitch/streamNotifs[${index}]`);
  msg.delete();
};
