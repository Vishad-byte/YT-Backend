import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { log } from "console"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query = "", sortBy = "createdAt", sortType = -1, userId = "" } = req.query
    page = Number(page)
    limit = Number(limit)

    const allVideos = await Video.aggregate([
        {
            $match: {
                $or: [
                    {title: {$regex: query, $options: "i"}},
                    {description: {$regex: query, $options: "i"}},
                ]
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "ownerDetails",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            fullname: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                owner: {
                    $first: "$ownerDetails"
                }
            }
        },
        {
            $sort: {
                [sortBy]: sortType
            }
        },
        {
            $skip: (page - 1) * limit
        },
        {
            $limit: limit
        }
    ])

    return res
    .status(200)
    .json(
        new ApiResponse(200, allVideos, "Videos Fetched Successfully")
    )
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    if(!title || !description) {
        throw new ApiError(400, "Title and Description are required")
    }

    const videoLocalPath = req.files?.video[0]?.path
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path
    
    if(!videoLocalPath || !thumbnailLocalPath) {
        throw new ApiError(400, "Video and Thumbnail are required")
    }
    
    const video = await uploadOnCloudinary(videoLocalPath)
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    if(!video || !thumbnail) {
        throw new ApiError(500, "Failed to upload video or thumbnail")
    }

    console.log(video);

    const newVideoData = await Video.create({
        videoFile: video.url,
        thumbnailFile: thumbnail.url,
        title: title,
        description: description,
        duration: video.duration,
        owner: req.user._id
    })
    
    if(!newVideoData) {
        throw new ApiError(400, "Failed to create video")
    }

    return res
    .status(201)
    .json(
        new ApiResponse(201, {video: newVideoData}, "Video Published Successfully")
    )
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if(!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    const getVideo = await Video.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "ownerDetails",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            fullname: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "likesDetails",
            }
        },
        {
            $lookup: {
                form: "comments",
                localField: "_id",
                foreignField: "video",
                as: "commentsDetails",
            }
        },
        {
            $addFields: {
                owner: {
                    $first: "$ownerDetails"
                },
                likesCount: {
                    $size: "$likesDetails"
                },
                commentsCount: {
                    $size: "$commentsDetails"
                },
                comments: "$commentsDetails",
                views: {                        
                    $sum: ["$views", 1]     // Increment views by 1
                }
            }
        },
    ])

    if(!getVideo || getVideo.length === 0) {
        throw new ApiError(404, "Video not found")
    }

    await Video.findByIdAndUpdate(videoId, {
        $set: {
            views: getVideo[0].views
        }},
        {
            new: true
        }
    )
    
    return res
    .status(200)
    .json(
        new ApiResponse(200, {video: getVideo[0]}, "Video Fetched Successfully")
    )
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { title, description } = req.body
    //TODO: update video details like title, description

    if(!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    if(!title || !description) {
        throw new ApiError(400, "Title or Description is required")
    }

    const updatedVideo = await Video.findByIdAndUpdate(videoId, {
        $set: {
            title: title,
            description: description
        }
    },
    {
        new: true
    }) 
    return res
    .status(200)
    .json(
        new ApiResponse(200, {video: updatedVideo}, "Video Updated Successfully")
    )
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
    if(!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    const deletedVideo = await Video.findByIdAndDelete(videoId)
    if(!deletedVideo) {
        throw new ApiError(500, "Video failed to delete")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, deletedVideo, "Video Deleted Successfully")
    )
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    // Find the video owned by the current user
    const video = await Video.findOne({
        _id: videoId,
        owner: req.user._id
    });

    if (!video) {
        throw new ApiError(404, "Video not found or not owned by user");
    }

    // Toggle the isPublished field
    video.isPublished = !video.isPublished;
    await video.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            { isPublished: video.isPublished },
            `Video ${video.isPublished ? "published" : "unpublished"} successfully`
        )
    );
});

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}