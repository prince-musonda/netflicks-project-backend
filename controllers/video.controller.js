import * as streamUrlGenerator from 'youtube-stream-url'
import got from 'got'


function filterFormats(formats){
    return formats.filter(format =>{
        // grab any videos with a minimum quality of 480p and have audio
        const video_qaulity = parseInt(format.height)
        return video_qaulity >= 480 && format.audioQuality
    })
}
function getVideoStreamUrl(req,res,next){
    const video_id = req.params.video_id
    console.log(video_id)
    const youtubeLink = 'https://m.youtube.com/watch?v='+video_id
    streamUrlGenerator.getInfo({url:youtubeLink}).then(info=>{
        const filtered = filterFormats(info.formats)
        if(filtered){
            return filtered
        }else{
            //when no video matches the description, then just return the first one
            return [info.formats[0]]
        }
        
    }).then(data=>{
        const {url} = data[0]
        console.log(data[0])
        res.json({url})
    })
}


function downloadVideo(req,res,next){
    const video_id = req.params.video_id
    const youtubeLink = 'https://www.youtube.com/watch?v='+video_id
    streamUrlGenerator.getInfo({url:youtubeLink}).then((info)=>{
        const video_title = info.videoDetails.title
        const filtered = filterFormats(info.formats)
        if(filtered){
            //choosing to send the first video in filtered list
            const video = filtered[0]
            const videoSize = video.contentLength
            console.log(video.mimeType)
            const contentType = video.mimeType.split(';')[0]
            const fileExtention = contentType.split('/')[1]
            res.setHeader('content-type',contentType)
            res.setHeader('content-disposition',`attachment; filename=${video_title}.${fileExtention}`)
            if(videoSize) res.setHeader('content-length',videoSize)
            // create a readable stream of the video with the help of the 'got' libray
            const readableStream = got.stream(video.url)
            readableStream.pipe(res)
        }else{
            // if no video meets the requirements, then just send the first one in formats
            const video = info.formats[0]
            const videoSize = video.contentLength
            console.log(video.mimeType)
            const contentType = video.mimeType.split(';')[0] // ie ['video/mp4'; 'codecs=\avc1.42001E, mp4a.40.2']
            const fileExtention = contentType.split('/')[1]
            res.setHeader('content-type',contentType)
            res.setHeader('content-disposition',`attachment; filename=${video_title}.${fileExtention}`)
            if(videoSize) res.setHeader('content-length',videoSize)
            // create a readable stream of the video with the help of the 'got' libray
            const {url} = video
            const readableStream = got.stream(url)
            readableStream.pipe(res)
           
        }

    })
}



export  {
    downloadVideo,
    getVideoStreamUrl
}