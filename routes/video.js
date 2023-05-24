import express from 'express'
import * as videoController from '../controllers/video.controller.js'

const videoRouter = express.Router()

videoRouter.get('/watch/:video_id',videoController.getVideoStreamUrl)
videoRouter.get('/download/:video_id',videoController.downloadVideo)

export default videoRouter