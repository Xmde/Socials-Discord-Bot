const { getStreams } = require('./apiHandle');
const sendNotif = require('./sendnotif');
const chalk = require('chalk');

const db = require('../startup/db');

exports.getTwitchInfo = function (discordChannelId) {
  const discordChannels = db.getData('/twitch/discordChannels');
  return discordChannels.filter(
    (elm) => elm.discordChannelId === discordChannelId
  );
};

exports.init = function () {
  setInterval(async () => {
    console.log(chalk.magenta('[Twitch] Checking for new streams'));
    const channels = db.getData('/twitch/channels');
    const discordChannels = db.getData('/twitch/discordChannels');
    let ch = [...channels];
    let streams = [];
    while (ch.length) {
      let c = ch.splice(0, 75);
      c = c.reduce((acc, val) => {
        acc.push(val.username);
        return acc;
      }, []);
      streams.push(...(await getStreams(c)));
    }
    if (streams.length === 0) return;
    for (let stream of streams) {
      let index = channels.findIndex(
        (val) => val.username === stream.user_login
      );
      if (index === -1) {
        console.log(
          chalk.magenta('[Twitch] ') +
            chalk.red(
              `[ERROR] No Channel found with login name ${channels[index].username}!`
            )
        );
      }
      if (channels[index].lastStream !== stream.id) {
        db.push(`/twitch/channels[${index}]/lastStream`, stream.id, true);
        console.log(
          chalk.magenta(
            `[Twitch] Found new stream: ID(${stream.id}), Username(${stream.user_login})`
          )
        );
        for (let discordc of discordChannels) {
          if (discordc.username === stream.user_login) {
            sendNotif(stream, discordc.discordChannelId);
          }
        }
      }
    }
  }, 60000);
  console.log(chalk.gray(`[Info] Twitch Service Initialized`));
};
