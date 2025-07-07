import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
//.use is used for configurations
app.use(cors({
    origin: process.env.CORS_ORIGIN,                      //allows certain domains to requests to backend 
    credentials: true                          
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

//router import
import userRouter from './routes/user.routes.js'
import tweetRouter from './routes/tweet.routes.js'
import commentRouter from './routes/comment.routes.js'
import likeRouter from './routes/like.routes.js'
import videoRouter from './routes/video.routes.js'

//router declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/tweet", tweetRouter)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/videos", videoRouter)

//          https://localhost:8000/api/v1/users/register   --> example


export default app;