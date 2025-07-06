import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const existingLike = await Like.findOne({
        video: videoId,
        likedBy: req.user._id
    });

    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id);
        return res
        .status(200)
        .json(
            new ApiResponse(200, null, "Video like removed successfully")
        );
    } else {
        await Like.create({
            video: videoId,
            likedBy: req.user._id
        });
        return res
        .status(200)
        .json(
            new ApiResponse(200, null, "Video like added successfully")
        );
    }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }

    const existingLike = await Like.findOne({
        comment: commentId,
        likedBy: req.user._id
    });

    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id);
        return res
        .status(200)
        .json(
            new ApiResponse(200, null, "Comment like removed successfully")
        );
    } else {
        await Like.create({
            comment: commentId,
            likedBy: req.user._id
        });
        return res
        .status(200)
        .json(
            new ApiResponse(200, null, "Comment like added successfully")
        );
    }
});


const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID");
    }

    const existingLike = await Like.findOne({
        tweet: tweetId,
        likedBy: req.user._id
    });

    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id);
        return res
        .status(200)
        .json(
            new ApiResponse(200, null, "Tweet like removed successfully")
        );
    } else {
        await Like.create({
            tweet: tweetId,
            likedBy: req.user._id
        });
        return res
        .status(200)
        .json(
            new ApiResponse(200, null, "Tweet like added successfully")
        );
    }
});


const getLikedVideos = asyncHandler(async (req, res) => {
    const likedVideos = await Like.aggregate([
        {
            $match : {
                $and : [
                    {likedBy : new mongoose.Types.ObjectId(req.user._id)},
                    {video : {$exists : true}}
                ]
            }
        },
        {
            $lookup : {
                from : "videos",
                localField : "video",
                foreignField : "_id",
                as : "video",
                pipeline : [
                    {
                        $lookup : {
                            from : "users",
                            localField : "owner",
                            foreignField : "_id",
                            as : "ownerDetails",
                            pipeline : [
                                {
                                    $project : {
                                        username : 1,
                                        fullname : 1,
                                        avatar : 1
                                    }
                                }
                            ]
                        },
                    },
                    {
                        $addFields : {
                            owner : {
                                $first : "$ownerDetails"
                            }
                        }
                    }
                ]
            }
        }
    ])
    if(!likedVideos && likedVideos?.length < 1){
        throw new ApiError(404 , "No liked videos found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200 , {likedVideos} , "Success")
    )
});

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
};