import mongoose, { isValidObjectId } from "mongoose"
import { Like } from "../models/like.model.js"
import { apiError } from "../utils/apiError.js"
import { apiResponse } from "../utils/apiResponse.js"
import { asynchandler } from "../utils/asynchandler.js"

const toggleVideoLike = asynchandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new apiError(400, "Invalid Video ID");
    }

    const existingLike = await Like.findOne({
        video: videoId,
        likedBy: req.user._id
    });

    let liked;

    if (existingLike) {
        await existingLike.deleteOne();
        liked = false;
    } else {
        await Like.create({
            video: videoId,
            likedBy: req.user._id
        });
        liked = true;
    }

    // RETURN COUNT (CRITICAL FIX)
    const likesCount = await Like.countDocuments({ video: videoId });

    return res.status(200).json(
        new apiResponse(200, { liked, likesCount }, "Toggled")
    );
});

const toggleCommentLike = asynchandler(async (req, res) => {

    const { commentId } = req.params;

    if (!isValidObjectId(commentId)) {
        throw new apiError(400, "Invalid Comment ID");
    }

    const existingLike = await Like.findOne({
        comment: commentId,
        likedBy: req.user._id
    });

    if (existingLike) {

        await existingLike.deleteOne();

        return res.status(200).json(
            new apiResponse(200, {}, "Comment unliked")
        );
    }

    const like = await Like.create({
        comment: commentId,
        likedBy: req.user._id
    });

    return res.status(200).json(
        new apiResponse(200, like, "Comment liked successfully")
    );

});

const toggleTweetLike = asynchandler(async (req, res) => {

    const { tweetId } = req.params;

    const existingLike = await Like.findOne({
        tweet: tweetId,
        likedBy: req.user._id
    });

    let liked;

    if (existingLike) {
        await existingLike.deleteOne();
        liked = false;
    } else {
        await Like.create({
            tweet: tweetId,
            likedBy: req.user._id
        });
        liked = true;
    }

    const likesCount = await Like.countDocuments({ tweet: tweetId });

    //  REAL-TIME EMIT
    global.io.emit("tweet-liked", {
        tweetId,
        likesCount
    });

    return res.json({
        liked,
        likesCount
    });
});
const getLikedVideos = asynchandler(async (req, res) => {

    const likes = await Like.find({
        likedBy: req.user._id,
        video: { $ne: null }
    }).populate("video");

    return res.status(200).json(
        new apiResponse(200, likes, "Liked videos fetched successfully")
    );

});

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}