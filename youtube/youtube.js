/*
Inits the Youtube post notification module
*/

const { pubSubSubscriber } = require('./pubSubSubscriber');
const sendNotif = require('./sendnotif');
const convert = require('xml-js');
const chalk = require('chalk');
let channels = [];
exports.channels = channels;

let lastId;

exports.getYoutubeInfo = function (discordChannelId) {
  return channels.filter((elm) => elm.discordChannelId === discordChannelId);
};

exports.init = function () {
  pubSubSubscriber.listen(1337);

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
    channels.forEach((val) => {
      if (val.channelId === id['yt:channelId']._text) {
        sendNotif(id['yt:videoId']._text, val.discordChannelId);
      }
    });
  });

  setInterval(() => {
    for (let i = 0; i < channels.length; i++) {
      let channel = channels.pop();
      register(channel.channelId, channel.discordChannelId);
    }
  }, 1000 * 60 * 60 * 24 * 2);
};
