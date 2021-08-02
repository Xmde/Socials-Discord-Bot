require('./startup/logging')();

require('./startup/dbinit')();

require('./discord/init')();
require('./youtube/youtube').init();
require('./twitch/twitch').init();
