const Discord = require('discord.js');
const client = require('../discord/client');
const { getPfp } = require('./apiHandle');
const db = require('../startup/db');

module.exports = async function (stream, discordChannelId) {
  const pfp = await getPfp(stream.user_id);

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
