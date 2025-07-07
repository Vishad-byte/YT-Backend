import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {

    const { channelId } = req.params;
    if (!mongoose.isValidObjectId(channelId)) { 
        throw new ApiError(400, "Invalid channel ID");
    }

    const channelStats = await Video.aggregate([
        { $match: { owner: new mongoose.Types.ObjectId(channelId) } },
        {
            $lookup: {
                from: "subscriptions",
                localField: "owner",
                foreignField: "channel",
                as: "subscriptions"
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "likes"
            }
        },
        {
            $addFields: {
                likeCount: { $size: "$likes" }
            }
        },
        {
            $group: {
                _id: "$owner",
                totalVideos: { $sum: 1 },
                totalViews: { $sum: "$views" },
                totalLikes: { $sum: "$likeCount" },
                totalSubscribers: { $first: { $size: "$subscriptions" } }
            }
        }
    ]);
    if (channelStats.length === 0) {
        throw new ApiError(404, "Channel not found or no videos available");
    }

    return res.status(200).json(new ApiResponse(200, channelStats[0], "Channel stats fetched successfully"));

})

const getChannelVideos = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    if (!mongoose.isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }

    const allVideos = await Video.aggregate([
        { $match: { owner: new mongoose.Types.ObjectId(channelId) } },
        {
            $project: {
                _id: 1,
                title: 1,
                description: 1,
                thumbnail: 1,
                duration: 1,
                views: 1,
                isPublished: 1,
                createdAt: 1
            }
        }
    ]);
    if (allVideos.length === 0) {
        throw new ApiError(404, "No videos found for this channel");
    }
    return res.status(200).json(new ApiResponse(200, allVideos, "Channel videos fetched successfully"));
})

export {
    getChannelStats, 
    getChannelVideos
    }