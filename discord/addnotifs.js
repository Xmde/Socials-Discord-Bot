const { client, prefix } = require('./client');
const TwitchApiHandle = require('../apiHandle/twitch');
const YoutubeApiHandle = require('../apiHandle/youtube');
const winston = require('winston');
const { youtubeChannels, twitchChannels } = require('..');
const YoutubeVideoChannel = require('../videoChannels/youtube');

client.on('message', async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'youtube') {
    let channel = new YoutubeVideoChannel(args[0], message.channel.id);
    await channel.init();
    youtubeChannels.push(channel);
  } else if (command === 'twitch') {
    //twitchChannels.push(new YoutubeVideoChannel(args[0]));
  }
});
