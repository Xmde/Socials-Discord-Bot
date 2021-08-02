const config = require('config');
const db = require('../startup/db');
const { pubSubSubscriber } = require('./pubSubSubscriber');
const chalk = require('chalk');

const hub = 'https://pubsubhubbub.appspot.com/';

exports.ytRegister = function (channelId, discordChannelId) {
  console.log(
    chalk.redBright(
      `[Youtube] Registering Channel: ID(${channelId}), DiscordChannelID(${discordChannelId})`
    )
  );
  db.push('/youtube/channels[]', { channelId, discordChannelId }, true);
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
  let channels = db.getData('/youtube/channels');
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
  db.delete(`/youtube/channels[${index}]`);
  channels = db.getData('/youtube/channels');
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
