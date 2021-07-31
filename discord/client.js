const Discord = require('discord.js');
const config = require('config');

const PREFIX = config.get('DiscordPrefix');

const client = new Discord.Client({ disableEveryone: false });
client.login(config.get('BotToken'));

client.on('ready', async () => {
  await client.user.setActivity('Made By Xmde');
});

module.exports.client = client;
module.exports.prefix = PREFIX;
