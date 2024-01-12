import * as streamUrlGenerator from "youtube-stream-url";
import got from "got";

// function for filtering video quality from video quality lists
function filterVideoUrlByQuality(formats) {
  return formats.filter((format) => {
    // grab any videos with a minimum quality of 480p and have audio
    const video_qaulity = parseInt(format.height);
    return video_qaulity >= 480 && format.audioQuality;
  });
}
function getVideoStreamUrl(req, res) {
  // get youtube video id
  const video_id = req.params.video_id;
  const youtubeVideoLink = "https://m.youtube.com/watch?v=" + video_id;
  // grab availabe video streaming urls for our youtube video
  streamUrlGenerator
    .getInfo({ url: youtubeVideoLink })
    .then((info) => {
      // filtering our list of available streaming formats
      // and grabing the one that is at least 480p and has audio
      const filteredVideoStream = filterVideoUrlByQuality(info.formats);
      if (filteredVideoStream) {
        return filteredVideoStream;
      } else {
        //when no video matches the description, then just return the first one
        return [info.formats[0]];
      }
    })
    .then((data) => {
      // grabbing video the url from our filtered video format
      // and sending it as a response
      const { url } = data[0];
      res.status(200).json({ url });
    });
}

function downloadVideo(req, res) {
  const video_id = req.params.video_id;
  const youtubeLink = "https://www.youtube.com/watch?v=" + video_id;
  streamUrlGenerator.getInfo({ url: youtubeLink }).then((info) => {
    const video_title = info.videoDetails.title;
    const filtered = filterVideoUrlByQuality(info.formats);
    let video;
    if (filtered) {
      //choosing to send the first video in filtered list
      video = filtered[0];
    } else {
      // if no video meets the requirements, then just send the first one in formats
      video = info.formats[0];
    }
    const videoSize = video.contentLength;
    console.log(video.mimeType);
    const contentType = video.mimeType.split(";")[0];
    const fileExtention = contentType.split("/")[1];
    res.setHeader("content-type", contentType);
    res.setHeader(
      "content-disposition",
      `attachment; filename=${video_title}.${fileExtention}`
    );
    if (videoSize) res.setHeader("content-length", videoSize);
    // create a readable stream of the video with the help of the 'got' libray
    const readableStream = got.stream(video.url);
    readableStream.pipe(res);
  });
}

export { downloadVideo, getVideoStreamUrl };
