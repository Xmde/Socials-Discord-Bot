const { channels, discordChannels } = require('./twitch');
const chalk = require('chalk');

exports.twitchRegister = function (username, discordChannelId) {
  console.log(
    chalk.magenta(
      `[Twitch] Registering Channel: Username(${username}), DiscordChannelID(${discordChannelId})`
    )
  );
  if (!channels.some((val) => val.username === username)) {
    lastStream = '';
    channels.push({ username, lastStream });
  }
  discordChannels.push({ username, discordChannelId });
};

exports.twitchUnregister = function (username, discordChannelId) {
  console.log(
    chalk.magenta(
      `[Twitch] Unregistering Channel: Username(${username}), DiscordChannelID(${discordChannelId})`
    )
  );
  const index = discordChannels.findIndex((val) => {
    val.username === username && val.discordChannelId === discordChannelId;
  });
  if (index === -1) {
    console.log(
      chalk.magenta(
        `[Twitch] ERR No Channel Found: Username(${username}), DiscordChannelID(${discordChannelId})`
      )
    );
    return -1;
  }
  discordChannels.splice(index, 1);
  if (!discordChannels.some((val) => val.username === username))
    channels.splice(
      channels.findIndex((val) => val.username === username),
      1
    );
};
