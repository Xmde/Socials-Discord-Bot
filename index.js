require('./startup/logging')();

require('./discord/init')();
require('./youtube/youtube').init();
require('./twitch/twitch').init();
