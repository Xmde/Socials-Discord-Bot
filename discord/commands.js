const client = require('./client');
const { ytRegister, ytUnregister } = require('../youtube/register');
const { twitchRegister, twitchUnregister } = require('../twitch/register');
const config = require('config');
const chalk = require('chalk');
const { getTwitchInfo } = require('../twitch/twitch');
const { getYoutubeInfo } = require('../youtube/youtube');
const db = require('../startup/db');

const prefix = config.get('DiscordPrefix');

module.exports = function () {
  client.on('message', async (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    setTimeout(() => {
      message.delete();
    }, 250);

    if (!message.member.hasPermission('ADMINISTRATOR')) {
      message
        .reply('You do not have permission to perform this command!')
        .then((msg) => setTimeout(() => msg.delete(), 5000));
      return;
    }

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
        const notificationRoles = db.getData('/discord/notificationRoles');
        if (
          notificationRoles.some((val) => val.channel === message.channel.id)
        ) {
          message
            .reply('ERROR! Role already set!')
            .then((msg) => setTimeout(() => msg.delete(), 5000));
          return;
        }
        console.log(
          chalk.gray(
            `[Info] Notification Role Set: Role(${args[1]}), Channel(${message.channel.id})`
          )
        );
        message
          .reply('Role set!')
          .then((msg) => setTimeout(() => msg.delete(), 5000));
        db.push(
          '/discord/notificationRoles[]',
          {
            role: args[1],
            channel: message.channel.id,
          },
          true
        );
      }
      if (args.length === 1 && args[0].toLowerCase() === 'del') {
        const notificationRoles = db.getData('/discord/notificationRoles');
        if (
          !notificationRoles.some((val) => val.channel === message.channel.id)
        ) {
          message
            .reply('ERROR! No Role set!')
            .then((msg) => setTimeout(() => msg.delete(), 5000));
          return;
        }
        db.delete(
          `/discord/notificationRoles[${notificationRoles.findIndex(
            (val) => val.channel === message.channel.id
          )}]`
        );
        message
          .reply('Notification Role Removed!')
          .then((msg) => setTimeout(() => msg.delete(), 5000));
        console.log(
          chalk.gray(
            `[Info] Notification Role Removed: Channel(${message.channel.id})`
          )
        );
      }
    } else if (args.length === 1 && command === 'list') {
      if (args[0].toLowerCase() === 'twitch') {
        console.log(
          chalk.gray(
            `[Info] Checking Watched Twitch Channels: DiscordChannelID(${message.channel.id})`
          )
        );
        const info = getTwitchInfo(message.channel.id).reduce((acc, elm) => {
          acc.push(elm.username);
          return acc;
        }, []);
        if (info.length === 0)
          return message
            .reply('No Twitch Channels being watched')
            .then((msg) => setTimeout(() => msg.delete(), 5000));
        message
          .reply(info.join(' : '))
          .then((msg) => setTimeout(() => msg.delete(), 10000));
      } else if (args[0].toLowerCase() === 'youtube') {
        console.log(
          chalk.gray(
            `[Info] Checking Watched Youtube Channels: DiscordChannelID(${message.channel.id})`
          )
        );
        const info = getYoutubeInfo(message.channel.id).reduce((acc, elm) => {
          acc.push(elm.channelId);
          return acc;
        }, []);
        if (info.length === 0)
          return message
            .reply('No Youtube Channels being watched')
            .then((msg) => setTimeout(() => msg.delete(), 5000));
        message
          .reply(info.join(' : '))
          .then((msg) => setTimeout(() => msg.delete(), 10000));
      }
    }
  });
};
