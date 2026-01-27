import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { apiError, ApiError } from "../utils/apiError.js"
import { apiResponse, ApiResponse } from "../utils/apiResponse.js"
import { asyncHandler } from "../utils/asynchandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import fs from "fs";

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;

    if (!title?.trim() || !description?.trim()) {
        throw new apiError(400, "Title and description are required");
    }

    // Check files
    if (!req.files?.video || !req.files?.thumbnail) {
        throw new apiError(400, "Video file and thumbnail are required");
    }

    const videoLocalPath = req.files.video[0].path;
    const thumbnailLocalPath = req.files.thumbnail[0].path;

    // Upload to cloudinary
    const uploadedVideo = await uploadOnCloudinary(videoLocalPath);
    const uploadedThumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    fs.unlinkSync(videoLocalPath);
    fs.unlinkSync(thumbnailLocalPath);

    if (!uploadedVideo || !uploadedThumbnail) {
        throw new apiError(500, "Cloudinary upload failed");
    }

    // Create video document
    const video = await Video.create({
        title,
        description,
        videoFile: {
            url: uploadedVideo.url,
            public_id: uploadedVideo.public_id
        },
        thumbnail: {
            url: uploadedThumbnail.url,
            public_id: uploadedThumbnail.public_id
        },
        duration: uploadedVideo.duration,
        owner: req.user._id
    });

    return res.status(201).json(
        new apiResponse(201, video, "Video published successfully")
    );
});

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
        const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
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
    const { videoId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new apiError(400, "Invalid video ID");
    }
    const video = await Video.findById(videoId);

    if (!video) {
        throw new apiError(404, "Video not found");
    }

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new apiError(403, "You are not allowed to delete this video");
    }

    try {
        if (video.videoFile?.public_id) {
            await deleteFromCloudinary(video.videoFile.public_id);
        }
        if (video.thumbnail?.public_id) {
            await deleteFromCloudinary(video.thumbnail.public_id);
        }
    } catch (error) {
        throw new apiError(500, "Error deleting video from Cloudinary");
    }

    // Delete the DB
    await video.deleteOne();

    return res.status(200).json(
        new apiResponse(200, null, "Video deleted successfully")
    );
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