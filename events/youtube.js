const { videoEmitter } = require('./emitters');
const config = require('config');
const fileparser = require('../util/fileparser');
const { sendYoutubeNotif } = require('../discord/sendnotif');

module.exports = function () {
  videoEmitter.on('youtube', async video => {
    await sendYoutubeNotif(video);
  });
}