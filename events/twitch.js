const { videoEmitter } = require('./emitters');
const config = require('config');
const fileparser = require('../util/fileparser');
const { sendTwitchNotif } = require('../discord/sendnotif');

module.exports = function () {
  videoEmitter.on('twitch', async video => {
    await sendTwitchNotif(video);
  });
}