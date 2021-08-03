const db = require('./db');

module.exports = function () {
  db.push('/youtube/channels[]', { obj: 'test' }, true);
  db.delete('/youtube/channels[-1]');

  db.push('/twitch/channels[]', { obj: 'test' }, true);
  db.delete('/twitch/channels[-1]');

  db.push('/twitch/discordChannels[]', { obj: 'test' }, true);
  db.delete('/twitch/discordChannels[-1]');

  db.push('/discord/notificationRoles[]', { obj: 'test' }, true);
  db.delete('/discord/notificationRoles[-1]');
};
