/*
Inits the Youtube post notification module
*/

const { pubSubSubscriber } = require('./pubSubSubscriber');
const sendNotif = require('./sendnotif');
const convert = require('xml-js');
const chalk = require('chalk');
const config = require('config');
const db = require('../startup/db');
const { ytRegister } = require('./register');

let lastId;

exports.getYoutubeInfo = function (discordChannelId) {
  const channels = db.getData('/youtube/channels');
  return channels.filter((elm) => elm.discordChannelId === discordChannelId);
};

exports.init = function () {
  pubSubSubscriber.listen(
    config
      .get('CallBackUrl')
      .substring(config.get('CallBackUrl').indexOf(':', 7) + 1)
  );

  pubSubSubscriber.on('feed', (data) => {
    const id = convert.xml2js(data.feed.toString(), { compact: true }).feed
      .entry;
    if (!id) return;
    if (id['yt:videoId']._text === lastId) return;
    console.log(
      chalk.redBright(
        `[Youtube] New Video: Channel(${id['yt:channelId']._text}), Video(${id['yt:videoId']._text})`
      )
    );
    lastId = id['yt:videoId']._text;
    const channels = db.getData('/youtube/channels');
    channels.forEach((val) => {
      if (val.channelId === id['yt:channelId']._text) {
        sendNotif(id['yt:videoId']._text, val.discordChannelId);
      }
    });
  });

  setInterval(() => {
    const channels = db.getData('/youtube/channels');
    for (let i = 0; i < channels.length; i++) {
      let channel = db.getData('/youtube/channels[-1]');
      db.delete('/youtube/channels[-1]');
      ytRegister(channel.channelId, channel.discordChannelId);
    }
  }, 1000 * 60 * 60 * 24 * 2);
  console.log(chalk.gray(`[Info] Youtube Service Initialized`));
};
