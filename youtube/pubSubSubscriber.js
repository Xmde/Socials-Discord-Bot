const config = require('config');
const pubSubHubbub = require('pubsubhubbub');
const pubSubSubscriber = pubSubHubbub.createServer({
  callbackUrl: config.get('CallBackUrl'),
});

module.exports.pubSubSubscriber = pubSubSubscriber;
