import express from 'express'
import cors from 'cors'

import videoRouter from './routes/video.js'
const app = express()

app.use(cors({
    origin:'*'
}))

app.use(videoRouter)


app.listen(3003,()=>{
    console.log('listening')
})