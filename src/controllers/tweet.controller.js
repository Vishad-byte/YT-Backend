import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    const { content } = req.body;
    if(!content || content.trim() === "") {
        throw new ApiError(400, "Content is required");
    }
    const tweet = await Tweet.create({
        content: content.trim(),
        owner: req.user._id
    });
    if(!tweet) {
        throw new ApiError(500, "Failed to create tweet");
    }
    return res
    .status(201)
    .json(
        new ApiResponse(201, tweet, "Tweet created successfully")
    );
})

const getUserTweets = asyncHandler(async (req, res) => {

    const{userId} = req.params;
    if(!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID");
    }

    const allTweets = await Tweet.aggregate([
        {
            $match:
            {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField:"_id",
                as:"owner"

            }
        },
        {
            $unwind: "$owner"
        },
        {
            $lookup: {
                from: "likes",
                localField:"_id",
                foreignField:"tweet",
                as: "likes"
            }
        },
        {
            $addFields: {
                likeCount: {
                    $size: "$likes"
                }
            }
        },
        {
            $project: {
                content: 1,
                createdAt: 1,
                updatedAt: 1,
                "owner.username": 1,
                "owner.fullName": 1,
                "owner._id": 1,
                likeCount: 1,
            }
        },
        {
            $limit: 10
        } 

    ])

    if(!allTweets || allTweets.length === 0) {
        throw new ApiError(404, "No tweets found for this user");
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200, allTweets, "User tweets fetched successfully")
    )
})

const updateTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const { content } = req.body;

    if(!tweetId || !isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID");
    }

    if(!content || content.trim() === "") {
        throw new ApiError(400, "Content is required");
    }

    const updatedTweet = await Tweet.findByIdAndUpdate(
    tweetId,
        {
            $set: {
                content: content.trim()
            }
        }, 
        { new: true }
    );

    if(!updatedTweet) {
        throw new ApiError(500, "Tweet failed to update");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, updatedTweet, "Tweet updated successfully")
    ) 
})

const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    if(!tweetId || !isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID");
    }

    const deletedTweet = await Tweet.findByIdAndDelete(tweetId);
    if(!deletedTweet) {
        throw new ApiError(500, "Tweet failed to delete");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, deletedTweet, "Tweet deleted successfully")
    )
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}