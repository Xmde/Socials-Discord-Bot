// require('./init/logging')();
// const client = require('./discord/client');
// client.on('ready', () => {
//   require('./events/youtube')();
//   require('./events/twitch')();
//   require('./apiHandle/youtube').ytChecker();
//   require('./apiHandle/twitch').twitchChecker();
// });

exports.youtubeChannels = youtubeChannels = [];
exports.twitchChannels = twitchChannels = [];

require('./init/logging');

require('./discord/client');
require('./discord/addnotifs');
require('./events/youtube')();
