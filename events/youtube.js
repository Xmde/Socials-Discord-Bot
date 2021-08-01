const { sendYoutubeNotif } = require('../discord/sendnotif');
const { getLastUploadVideo } = require('../apiHandle/youtube');
const { youtubeChannels } = require('..');

module.exports = function () {
  setInterval(async () => {
    const videos = await getLastUploadVideo(youtubeChannels);
    console.log(youtubeChannels);
    console.log(videos);
    for (let video of videos) {
      let channel = youtubeChannels.find(
        (ele) => ele.id === video.snippet.channelId
      );
      if (video.id === channel.lastVideoId) continue;
      sendYoutubeNotif(video, channel.discordChannel);
    }
  }, 60000);
};
