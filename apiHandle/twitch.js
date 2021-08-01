// const NotifApiHandle = require('./notif');
// const TwitchApi = require('node-twitch').default;
// const config = require('config');
// const { notifEmitter } = require('../events/emitters');
// const winston = require('winston');

// module.exports = class TwitchApiHandle {
//   #twitch;
//   constructor(id, channelId) {
//     super(id, channelId);

//     this.#twitch = new TwitchApi({
//       client_id: config.get('TwitchClientId'),
//       client_secret: config.get('TwitchClientSecret'),
//     });

//     winston.info(`New TwitchApiHandle Registered: ID(${id})`);
//   }
//   addChecker(interval) {
//     winston.info(
//       `Regestering new TwitchChecker: ID(${this.#id}), Interval(${interval})`
//     );
//     setInterval(async () => {
//       let stream = await this.#twitch.getStreams({ channel: this.#id });
//       stream = stream.data[0];
//       if (!stream) return;
//       if (stream.id !== this.#lastNotif) {
//         winston.info(`New Stream Found: Stream${stream}`);
//         notifEmitter.emit('twitch', {
//           video: stream,
//           discordChannel: this.#channelId,
//         });
//         this.#lastNotif = stream.id;
//       }
//     }, interval);
//   }
//   get pfp() {
//     const profile = await this.#twitch.getUsers(this.#id);
//     winston.info(
//       `Found Profile Picture: Url(${profile.data[0].profile_image_url})`
//     );
//     return profile.data[0].profile_image_url;
//   }
// };
