const TwitchApi = require('node-twitch').default;
const config = require('config');

const twitch = new TwitchApi({
  client_id: config.get('TwitchClientId'),
  client_secret: config.get('TwitchClientSecret'),
});

exports.getStreams = async function (usernames) {
  let streams = await twitch.getStreams({
    channels: [...usernames],
    first: 100,
  });
  return streams.data;
};

exports.getPfp = async function (user_id) {
  const profile = await twitch.getUsers(user_id);
  return profile.data[0].profile_image_url;
};
