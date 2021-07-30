const TwitchApi = require('node-twitch').default;
const config = require('config');
const fileparser = require('../util/fileparser');
const { videoEmitter } = require('../events/emitters');
const winston = require('winston');

const twitch = new TwitchApi({
  client_id: config.get('TwitchClientId'),
  client_secret: config.get('TwitchClientSecret'),
});

function addTwitchChecker(channelName) {
  let liveId;
  setInterval(async () => {
    let stream = await twitch.getStreams({ channel: channelName });
    stream = stream.data[0];
    if (!stream) return;
    if (stream.id !== liveId) {
      winston.info('New Stream Found', stream);
      videoEmitter.emit('twitch', stream);
      liveId = stream.id;
    }
  }, 10000);
}

module.exports.twitchChecker = async function () {
  const channels = await fileparser(config.get('TwitchChannels'));
  for (let ch of channels) {
    winston.info('Adding Twitch Channel: ' + ch);
    addTwitchChecker(ch);
  }
};

module.exports.getPFP = async function (channelId) {
  const profile = await twitch.getUsers(channelId);
  return profile.data[0].profile_image_url;
};
