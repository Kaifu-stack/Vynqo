import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { apiError, ApiError } from "../utils/apiError.js"
import { apiResponse, ApiResponse } from "../utils/apiResponse.js"
import { asyncHandler } from "../utils/asynchandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body
    // TODO: get video, upload to cloudinary, create video
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!videoId) {
        throw new apiError(400, "video Id is required")
    }
    const video = await Video.findById(videoId);

    if (!video) {
        throw new apiError(404, "video not found")
    }
    return res.status(200).json(
        new apiResponse(200, video, "Video fetched successfully")
    );
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { title, description } = req.body
    const thumbnailLocalPath = req.file?.path;

    if (!videoId) {
        throw new apiError(400, "Video Id is requied")
    }
    const video = await Video.findById(videoId);

    if (!video) {
        throw new apiError(404, "Video not found")
    }
    if (video.owner.toString() !== req.user._id.toString()) {
        throw new apiError(403, "You are not allowed to update this video");
    }
    if (thumbnailLocalPath) {
        const thumbnail = await uploadToCloudinary(thumbnailLocalPath);
    }

    if (!thumbnail?.url || !thumbnail?.public_id) {
        throw new apiError(400, "Error while uploading thumbnail");
    }
    if (video.thumbnail?.public_id) {
        await deleteFromCloudinary(video.thumbnail.public_id);
    }
    video.thumbnail = {
        url: thumbnail.url,
        public_id: thumbnail.public_id
    };
    // Update text fields
    if (title) video.title = title;
    if (description) video.description = description;

    await video.save();

    return res.status(200).json(
        new apiResponse(200, video, "Video updated successfully")
    );
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}