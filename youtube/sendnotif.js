const { getPfp, getVideoInfo } = require('./apihandle');
const Discord = require('discord.js');
const client = require('../discord/client');
const db = require('../startup/db');

module.exports = async function (videoId, discordChannelId) {
  const data = await getVideoInfo(videoId);
  const pfp = await getPfp(data.channelId);

  const notif = new Discord.MessageEmbed()
    .setColor('#FF0000')
    .setTitle(data.title)
    .setURL(`https://www.youtube.com/watch?v=${videoId}`)
    .setAuthor(
      `${data.channelTitle}`,
      pfp,
      `https://www.youtube.com/channel/${data.channelId}`
    )
    //.setDescription(video.snippet.description)
    .setImage(data.thumbnails.medium.url)
    .setTimestamp()
    .setFooter('Provided by Socials (Developed by Xmde)');

  const channel = client.channels.cache.get(discordChannelId);
  const notificationRoles = db.getData('/discord/notificationRoles');
  if (notificationRoles.some((val) => val.channel === channel.id)) {
    channel.send(
      `${notificationRoles.find((val) => val.channel === channel.id).role}`,
      notif
    );
  } else {
    channel.send(notif);
  }
};
