const config = require('config');
const { channels } = require('./youtube');
const { pubSubSubscriber } = require('./pubSubSubscriber');
const chalk = require('chalk');

const hub = 'https://pubsubhubbub.appspot.com/';

exports.ytRegister = function (channelId, discordChannelId) {
  console.log(
    chalk.redBright(
      `[Youtube] Registering Channel: ID(${channelId}), DiscordChannelID(${discordChannelId})`
    )
  );
  channels.push({ channelId, discordChannelId });
  const topic =
    'https://www.youtube.com/xml/feeds/videos.xml?channel_id=' + channelId;
  pubSubSubscriber.subscribe(topic, hub, config.get('CallBackUrl'), (err) => {
    if (err) console.log(chalk.bgRed.bold(`[ERROR] ${err}`));
  });
};

exports.ytUnregister = function (channelId, discordChannelId) {
  console.log(
    chalk.redBright(
      `[Youtube] Unregistering Channel: ID(${channelId}), DiscordChannelID(${discordChannelId})`
    )
  );
  const index = channels.findIndex(
    (val) =>
      channelId === val.channelId && discordChannelId === val.discordChannelId
  );
  if (index === -1) {
    console.log(
      chalk.redBright(
        `[Youtube] ERR No Channel Found: ID(${channelId}), DiscordChannelID(${discordChannelId})`
      )
    );
    return -1;
  }
  channels.splice(index, 1);
  if (!channels.some((val) => val.channelId === channelId)) {
    const topic =
      'https://www.youtube.com/xml/feeds/videos.xml?channel_id=' + channelId;
    pubSubSubscriber.unsubscribe(
      topic,
      hub,
      config.get('CallBackUrl'),
      (err) => {
        if (err) console.log(chalk.bgRed.bold(`[ERROR] ${err}`));
      }
    );
  }
};
