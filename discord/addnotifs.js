const { client, prefix } = require('./client');
const TwitchApiHandle = require('../apiHandle/twitch');
const YoutubeApiHandle = require('../apiHandle/youtube');
const winston = require('winston');

client.on('message', (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'youtube') {
    winston.info(`New youtube command: ARGS(${args})`);
    try {
      let youtube = new YoutubeApiHandle(args[0], message.channel.id);
      youtube.lastnotif = youtube.lastVideo;
      youtube.addChecker(60000);
    } catch (ex) {
      winston.warn(`ERROR WRONG ID OR NO VIDEOS ON CHANNEL: ARGS(${args})`);
      message.channel.send('ERROR WRONG ID OR NO VIDEOS ON CHANNEL');
    }
  } else if (command === 'twitch') {
    winston.info(`New twitch command: ARGS(${args})`);
    let twitch = new TwitchApiHandle(args[0], message.channel.id);
    twitch.addChecker(60000);
  }
});
