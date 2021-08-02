/*
Handler for the youtube api
*/

const { google } = require('googleapis');
const config = require('config');

const youtube = google.youtube({
  version: 'v3',
  auth: config.get('YTAPIKey'),
});

exports.getVideoInfo = async function (videoId) {
  const res = await youtube.videos.list({
    part: 'snippet',
    id: videoId,
  });
  return res.data.items[0].snippet;
};

exports.getPfp = async function (channelId) {
  const res = await youtube.channels.list({
    part: 'snippet',
    id: channelId,
  });
  return res.data.items[0].snippet.thumbnails.medium.url;
};
