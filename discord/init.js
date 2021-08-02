const client = require('./client');
const config = require('config');
const chalk = require('chalk');

module.exports = function () {
  client.login(config.get('BotToken'));

  client.on('ready', async () => {
    console.log(chalk.gray('[Info] Discord Bot Running'));
    await client.user.setActivity('Made By Xmde');
  });
  require('./commands')();
};
