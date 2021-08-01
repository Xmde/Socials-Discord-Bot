// const { google } = require('googleapis');
// const config = require('config');
// const NotifApiHandle = require('./notif');
// const { notifEmitter } = require('../events/emitters');
// const winston = require('winston');

// module.exports = class YoutubeApiHandle {
//   #youtube;
//   #uploadPlaylistId;
//   constructor(id, channelId) {
//     super(id, channelId);
//     this.#youtube = google.youtube({
//       version: 'v3',
//       auth: config.get('YTAPIKey'),
//     });
//     const res = await youtube.channels.list({
//       part: 'contentDetails',
//       id: this.#id,
//     });
//     this.#uploadPlaylistId =
//       res.data.items[0].contentDetails.relatedPlaylists.uploads;
//     winston.info(
//       `New YoutubeApiHandle Registered: ID(${id}), PlaylistID(${
//         this.#uploadPlaylistId
//       })`
//     );
//   }
//   addChecker(interval) {
//     winston.info(
//       `Regestering new YoutubeChecker: ID(${this.#id}), Interval(${interval})`
//     );
//     setInterval(async () => {
//       const uploads = await youtube.playlistItems.list({
//         part: 'snippet,contentDetails,status',
//         playlistId: this.#uploadPlaylistId,
//       });

//       const lastVideo = uploads.data.items[0];

//       if (!lastVideo) return;

//       if (lastVideo.id !== this.#lastNotif) {
//         winston.info('New Youtube Video Found:', lastVideo);
//         notifEmitter.emit('youtube', {
//           video: lastVideo,
//           discordChannel: this.#channelId,
//         });
//         this.#lastNotif = lastVideo.id;
//       }
//     }, interval);
//   }
//   get pfp() {
//     const channel = await youtube.channels.list({
//       part: 'snippet,contentDetails',
//       id: this.#id,
//     });
//     winston.info(
//       `Found Profile Picture: Url(${channel.data.items[0].snippet.thumbnails.medium.url})`
//     );
//     return channel.data.items[0].snippet.thumbnails.medium.url;
//   }
//   get lastVideo() {
//     const res = await youtube.channels.list({
//       part: 'contentDetails',
//       id: this.#id,
//     });
//     const uploadPlaylistId =
//       res.data.items[0].contentDetails.relatedPlaylists.uploads;
//     const uploads = await youtube.playlistItems.list({
//       part: 'snippet,contentDetails,status',
//       playlistId: uploadPlaylistId,
//     });

//     return uploads.data.items[0];
//   }
// };

const { google } = require('googleapis');
const config = require('config');
const winston = require('winston');

const youtube = google.youtube({
  version: 'v3',
  auth: config.get('YTAPIKey'),
});

exports.getUploadPlaylistId = async function (id) {
  winston.info(`Getting Upload Playlist ID: ID(${id})`);
  const res = await youtube.channels.list({ part: 'contentDetails', id });
  return res.data.items[0].contentDetails.relatedPlaylists.uploads;
};

exports.getLastUploadVideo = async function (arrayChannels) {
  const ids = arrayChannels
    .reduce((acc, val) => {
      acc.push(val.uploadPlaylistId);
    }, [])
    .join(',');
  const res = await youtube.playlists.list({
    part: 'contentDetails',
    id: ids,
  });
  return res.data.items;
};

exports.getLastUploadVideoIdFromId = async function (uploadPlaylistId) {
  const res = await youtube.playlists.list({
    part: 'contentDetails',
    id: uploadPlaylistId,
  });
  return res.data.items[0].id;
};
