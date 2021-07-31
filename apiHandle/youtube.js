// const { google } = require('googleapis');
// const config = require('config');
// const { notifEmitter } = require('../events/emitters');
// const fileparser = require('../util/fileparser');
// const winston = require('winston');

// const youtube = google.youtube({
//   version: 'v3',
//   auth: config.get('YTAPIKey'),
// });

// function addYTChecker(id) {
//   let lastYTVideoId;
//   setInterval(async () => {
//     const res = await youtube.channels.list({
//       part: 'contentDetails',
//       id,
//     });
//     const uploadPlaylistId =
//       res.data.items[0].contentDetails.relatedPlaylists.uploads;

//     const uploads = await youtube.playlistItems.list({
//       part: 'snippet,contentDetails,status',
//       playlistId: uploadPlaylistId,
//     });

//     const lastVideo = uploads.data.items[0];

//     if (!lastVideo) return;

//     if (lastVideo.id !== lastYTVideoId) {
//       winston.info('New Youtube Video Found:', lastVideo);
//       notifEmitter.emit('youtube', lastVideo);
//       lastYTVideoId = lastVideo.id;
//     }
//   }, 10000);
// }

// module.exports.ytChecker = async function () {
//   const channels = await fileparser(config.get('YTChannels'));
//   for (let ch of channels) {
//     winston.info('Adding Youtube Channel: ' + ch);
//     addYTChecker(ch);
//   }
// };

// module.exports.getPFP = async function (channelId) {
//   const channel = await youtube.channels.list({
//     part: 'snippet,contentDetails',
//     id: channelId,
//   });
//   return channel;
// };
const { google } = require('googleapis');
const config = require('config');
const NotifApiHandle = require('./notif');
const { notifEmitter } = require('../events/emitters');
const winston = require('winston');

module.exports = class YoutubeApiHandle extends NotifApiHandle {
  #youtube;
  constructor(id, channelId) {
    super(id, channelId);
    this.#youtube = google.youtube({
      version: 'v3',
      auth: config.get('YTAPIKey'),
    });
    winston.info(`New YoutubeApiHandle Registered: ID(${id})`);
  }
  addChecker(interval) {
    winston.info(
      `Regestering new YoutubeChecker: ID(${this.#id}), Interval(${interval})`
    );
    setInterval(async () => {
      const res = await youtube.channels.list({
        part: 'contentDetails',
        id: this.#id,
      });
      const uploadPlaylistId =
        res.data.items[0].contentDetails.relatedPlaylists.uploads;

      const uploads = await youtube.playlistItems.list({
        part: 'snippet,contentDetails,status',
        playlistId: uploadPlaylistId,
      });

      const lastVideo = uploads.data.items[0];

      if (!lastVideo) return;

      if (lastVideo.id !== this.#lastNotif) {
        winston.info('New Youtube Video Found:', lastVideo);
        notifEmitter.emit('youtube', {
          video: lastVideo,
          discordChannel: this.#channelId,
        });
        this.#lastNotif = lastVideo.id;
      }
    }, interval);
  }
  get pfp() {
    const channel = await youtube.channels.list({
      part: 'snippet,contentDetails',
      id: this.#id,
    });
    winston.info(
      `Found Profile Picture: Url(${channel.data.items[0].snippet.thumbnails.medium.url})`
    );
    return channel.data.items[0].snippet.thumbnails.medium.url;
  }
  get lastVideo() {
    const res = await youtube.channels.list({
      part: 'contentDetails',
      id: this.#id,
    });
    const uploadPlaylistId =
      res.data.items[0].contentDetails.relatedPlaylists.uploads;
    const uploads = await youtube.playlistItems.list({
      part: 'snippet,contentDetails,status',
      playlistId: uploadPlaylistId,
    });

    return uploads.data.items[0];
  }
};
