const { google } = require('googleapis');
const config = require('config');
const { videoEmitter } = require('../events/emitters');
const fileparser = require('../util/fileparser');
const winston = require('winston');

const youtube = google.youtube({
  version: 'v3',
  auth: config.get('YTAPIKey'),
});

function addYTChecker(id) {
  let lastYTVideoId;
  setInterval(async () => {
    const res = await youtube.channels.list({
      part: 'contentDetails',
      id,
    });

    const uploadPlaylistId =
      res.data.items[0].contentDetails.relatedPlaylists.uploads;

    const uploads = await youtube.playlistItems.list({
      part: 'snippet,contentDetails,status',
      playlistId: uploadPlaylistId,
    });

    const lastVideo = uploads.data.items[0];

    if (!lastVideo) return;

    if (lastVideo.id !== lastYTVideoId) {
      winston.info('New Youtube Video Found:', lastVideo);
      videoEmitter.emit('youtube', lastVideo);
      lastYTVideoId = lastVideo.id;
    }
  }, 10000);
}

module.exports.ytChecker = async function () {
  const channels = await fileparser(config.get('YTChannels'));
  for (let ch of channels) {
    winston.info('Adding Youtube Channel: ' + ch);
    addYTChecker(ch);
  }
};

module.exports.getPFP = async function (channelId) {
  const channel = await youtube.channels.list({
    part: 'snippet,contentDetails',
    id: channelId,
  });
  return channel;
};
