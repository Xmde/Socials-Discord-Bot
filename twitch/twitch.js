const { getStreams } = require('./apiHandle');
const sendNotif = require('./sendnotif');
const chalk = require('chalk');

let discordChannels = [];
let channels = [];

exports.discordChannels = discordChannels;
exports.channels = channels;

exports.getTwitchInfo = function (discordChannelId) {
  return discordChannels.filter(
    (elm) => elm.discordChannelId === discordChannelId
  );
};

exports.init = function () {
  setInterval(async () => {
    console.log(chalk.magenta('[Twitch] Checking for new streams'));
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
      let channel = channels.find((val) => val.username === stream.user_name);
      if (channel.lastStream !== stream.id) {
        console.log(
          chalk.magenta(
            `[Twitch] Found new stream: ID(${stream.id}), Username(${stream.user_name})`
          )
        );
        for (let discordc of discordChannels) {
          if (discordc.username === stream.user_name) {
            sendNotif(stream, discordc.discordChannelId);
          }
        }
      }
    }
  }, 60000);
  console.log(chalk.gray(`[Info] Twitch Service Initialized`));
};
