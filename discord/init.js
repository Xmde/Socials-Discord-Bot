const client = require('./client');
const config = require('config');

module.exports = function () {
  client.login(config.get('BotToken'));

  client.on('ready', async () => {
    await client.user.setActivity('Made By Xmde');
  });
  require('./commands')();
};
