const Discord = require('discord.js');
const { client } = require('./client');
const config = require('config');
const getYTPFP = require('../apiHandle/youtube').getPFP;
const getTwitchPFP = require('../apiHandle/twitch').getPFP;
const winston = require('winston');

module.exports.sendYoutubeNotif = async function (video, discordChannelId) {
  const user = await getYTPFP(video.snippet.channelId);

  const notif = new Discord.MessageEmbed()
    .setColor('#FF0000')
    .setTitle(video.snippet.title)
    .setURL(`https://www.youtube.com/watch?v=${video.contentDetails.videoId}`)
    .setAuthor(
      `${video.snippet.channelTitle}`,
      user.data.items[0].snippet.thumbnails.medium.url,
      `https://www.youtube.com/channel/${video.snippet.channelId}`
    )
    //.setDescription(video.snippet.description)
    .setImage(video.snippet.thumbnails.medium.url)
    .setTimestamp()
    .setFooter('Provided by Socials (Developed by Xmde)');

  const channel = client.channels.cache.get(discordChannelId);
  //channel.send('@everyone', notif);
  winston.info('Sending YT notification to discord');
  channel.send(`@Notifications`, notif);
};

module.exports.sendTwitchNotif = async function (stream, discordChannelId) {
  const pfp = await getTwitchPFP(stream.user_id);

  const notif = new Discord.MessageEmbed()
    .setColor('#6441a5')
    .setTitle(stream.title)
    .setURL(`https://www.twitch.tv/${stream.user_name}`)
    .setAuthor(
      stream.user_name,
      pfp,
      `https://www.twitch.tv/${stream.user_name}`
    )
    .setImage(stream.getThumbnailUrl())
    .setTimestamp()
    .setFooter('Provided by Socials (Developed by Xmde)');

  const channel = client.channels.cache.get(discordChannelId);

  winston.info('Sending Twitch notification to discord');
  channel.send(`@Notifications`, notif);
};
