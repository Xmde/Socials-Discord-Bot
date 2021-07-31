const winston = require('winston');
module.exports = class NotifApiHandle {
  #id;
  #lastNotif;
  #channelId;

  constructor(id, channelId) {
    this.#id = id;
    this.#channelId = channelId;
  }
  addChecker() {}
  set lastnotif(notifId) {
    winston.info(`Updating lastnotif: notifID(${notifId})`);
    this.#lastNotif = notifId;
  }
  get pfp() {}
};
