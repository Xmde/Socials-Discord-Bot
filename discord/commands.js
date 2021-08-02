const client = require('./client');
const { ytRegister, ytUnregister } = require('../youtube/register');
const { twitchRegister, twitchUnregister } = require('../twitch/register');
const config = require('config');
const { notificationRoles } = require('./data');
const chalk = require('chalk');
const { getTwitchInfo } = require('../twitch/twitch');
const { getYoutubeInfo } = require('../youtube/youtube');

const prefix = config.get('DiscordPrefix');

module.exports = function () {
  client.on('message', async (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    setTimeout(() => {
      message.delete();
    }, 1000);

    if (command === 'youtube') {
      if (args.length === 2 && args[0].toLowerCase() === 'add') {
        message
          .reply('Added Youtube Channel Notifications!')
          .then((msg) => setTimeout(() => msg.delete(), 5000));
        ytRegister(args[1], message.channel.id);
      }
      if (args.length === 2 && args[0].toLowerCase() === 'del') {
        message
          .reply('Removed Youtube Channel Notifications!')
          .then((msg) => setTimeout(() => msg.delete(), 5000));
        if (ytUnregister(args[1], message.channel.id) === -1) {
          message
            .reply('ERROR! No Youtube Channel Found!')
            .then((msg) => setTimeout(() => msg.delete(), 5000));
        }
      }
    } else if (command === 'twitch') {
      if (args.length === 2 && args[0].toLowerCase() === 'add') {
        message
          .reply('Added Twitch Channel Notifications!')
          .then((msg) => setTimeout(() => msg.delete(), 5000));
        twitchRegister(args[1], message.channel.id);
      }
      if (args.length === 2 && args[0].toLowerCase() === 'del') {
        message
          .reply('Removed Twitch Channel Notifications!')
          .then((msg) => setTimeout(() => msg.delete(), 5000));
        if (twitchUnregister(args[1], message.channel.id) === -1) {
          message
            .reply('ERROR! No Twitch Channel Found!')
            .then((msg) => setTimeout(() => msg.delete(), 5000));
        }
      }
    } else if (command === 'role') {
      if (args.length === 2 && args[0].toLowerCase() === 'add') {
        if (
          notificationRoles.some((val) => val.channel === message.channel.id)
        ) {
          message
            .reply('ERROR! Role already set!')
            .then((msg) => setTimeout(() => msg.delete(), 5000));
          return;
        }
        console.log(
          chalk.white(
            `[Info] Notification Role Set: Role(${args[1]}), Channel(${message.channel.id})`
          )
        );
        message
          .reply('Role set!')
          .then((msg) => setTimeout(() => msg.delete(), 5000));
        notificationRoles.push({ role: args[1], channel: message.channel.id });
      }
      if (args.length === 1 && args[0].toLowerCase() === 'del') {
        if (
          !notificationRoles.some((val) => val.channel === message.channel.id)
        ) {
          message
            .reply('ERROR! No Role set!')
            .then((msg) => setTimeout(() => msg.delete(), 5000));
          return;
        }
        notificationRoles.splice(
          notificationRoles.findIndex(
            (val) => val.channel === message.channel.id
          ),
          1
        );
        message
          .reply('Notification Role Removed!')
          .then((msg) => setTimeout(() => msg.delete(), 5000));
        console.log(
          chalk.white(
            `[Info] Notification Role Removed: Channel(${message.channel.id})`
          )
        );
      }
    } else if (args.length === 1 && command === 'list') {
      if (args[0].toLowerCase() === 'twitch') {
        const info = getTwitchInfo(message.channel.id).reduce((acc, elm) => {
          acc.push(elm.username);
          return acc;
        }, []);
        console.log(info);
        message
          .reply(info.join(' : '))
          .then((msg) => setTimeout(() => msg.delete(), 10000));
      } else if (args[0].toLowerCase() === 'youtube') {
        const info = getYoutubeInfo(message.channel.id).reduce((acc, elm) => {
          acc.push(elm.clannelId);
          return acc;
        }, []);
        console.log(info);
        message
          .reply(info.join(' : '))
          .then((msg) => setTimeout(() => msg.delete(), 10000));
      }
    }
  });
};
