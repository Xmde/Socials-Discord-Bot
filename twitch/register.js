const db = require('../startup/db');
const chalk = require('chalk');

exports.twitchRegister = function (username, discordChannelId) {
  const channels = db.getData('/twitch/channels');
  console.log(
    chalk.magenta(
      `[Twitch] Registering Channel: Username(${username}), DiscordChannelID(${discordChannelId})`
    )
  );
  if (!channels.some((val) => val.username === username)) {
    lastStream = '';
    db.push('/twitch/channels[]', { username, lastStream }, true);
  }
  db.push('/twitch/discordChannels[]', { username, discordChannelId }, true);
};

exports.twitchUnregister = function (username, discordChannelId) {
  let discordChannels = db.getData('/twitch/discordChannels');
  console.log(
    chalk.magenta(
      `[Twitch] Unregistering Channel: Username(${username}), DiscordChannelID(${discordChannelId})`
    )
  );
  let index = discordChannels.findIndex(
    (val) =>
      val.username == username && val.discordChannelId == discordChannelId
  );
  if (index === -1) {
    console.log(
      chalk.magenta(
        `[Twitch] ERR No Channel Found: Username(${username}), DiscordChannelID(${discordChannelId})`
      )
    );
    return -1;
  }
  db.delete(`/twitch/discordChannels[${index}]`);
  discordChannels = db.getData('/twitch/discordChannels');
  if (!discordChannels.some((val) => val.username === username)) {
    let channels = db.getData('/twitch/channels');
    index = channels.findIndex((val) => val.username === username);
    db.delete(`/twitch/channels[${index}]`);
  }
};
