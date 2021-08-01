const {
  getUploadPlaylistId,
  getLastUploadVideoIdFromId,
} = require('../apiHandle/youtube');

module.exports = class YoutubeVideoChannel {
  #id;
  #uploadPlaylistId;
  #lastVideoId;
  #discordChannel;
  constructor(id, discordChannel) {
    this.#id = id;
    this.#discordChannel = discordChannel;
  }
  async init() {
    this.#uploadPlaylistId = await getUploadPlaylistId(this.#id);
    this.#lastVideoId = await getLastUploadVideoIdFromId(
      this.#uploadPlaylistId
    );
  }
  get uploadPlaylistId() {
    return this.#uploadPlaylistId;
  }
  get lastVideoId() {
    return this.#lastVideoId;
  }
  set lastVideoId(value) {
    this.#lastVideoId = value;
  }
  get id() {
    return this.#id;
  }
  get discordChannel() {
    return this.#discordChannel;
  }
};
