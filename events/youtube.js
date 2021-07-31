const { notifEmitter } = require('./emitters');
const config = require('config');
const fileparser = require('../util/fileparser');
const { sendYoutubeNotif } = require('../discord/sendnotif');

module.exports = function () {
  notifEmitter.on('youtube', async (notif) => {
    await sendYoutubeNotif(notif.video, notif.discordChannel);
  });
};
