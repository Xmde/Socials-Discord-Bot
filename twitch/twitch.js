const { getStreams } = require('./apiHandle');
const sendNotif = require('./sendnotif');
const chalk = require('chalk');

const db = require('../startup/db');
const deletemsg = require('./deletemsg');

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
    let msgs = [...db.getData('/twitch/streamNotifs')];
    if (streams.length !== 0) {
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
        msgs = msgs.reduce((acc, val) => {
          if (val.streamId !== stream.id) acc.push(val);
          return acc;
        }, []);
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
    }
    for (let msg of msgs) {
      console.log(
        chalk.magenta(
          `[Twitch] Stream Ended: streamId(${msg.streamId}), msgId(${msg.message.id})`
        )
      );
      deletemsg(msg.message);
    }
  }, 60000);
  console.log(chalk.gray(`[Info] Twitch Service Initialized`));
};
