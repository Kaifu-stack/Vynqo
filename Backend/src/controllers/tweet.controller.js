import mongoose, { isValidObjectId } from "mongoose"
import { Tweet } from "../models/tweet.model.js"
import { User } from "../models/user.model.js"
import { apiError } from "../utils/apiError.js"
import { apiResponse } from "../utils/apiResponse.js"
import { asynchandler } from "../utils/asynchandler.js"
import { Like } from "../models/like.model.js";

const createTweet = asynchandler(async (req, res) => {

    const { content } = req.body;

    if (!content || content.trim() === "") {
        throw new apiError(400, "Tweet content is required");
    }

    const tweet = await Tweet.create({
        content,
        owner: req.user._id
    });

    //  populate owner 
    const populatedTweet = await tweet.populate("owner", "username avatar");

    //  REAL-TIME EMIT
    global.io.emit("new-tweet", populatedTweet);

    return res.status(201).json(
        new apiResponse(201, populatedTweet, "Tweet created successfully")
    );
});
const getUserTweets = asynchandler(async (req, res) => {

    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
        throw new apiError(400, "Invalid user ID");
    }

    const tweets = await Tweet.find({ owner: userId })
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new apiResponse(200, tweets, "Tweets fetched successfully")
    );
});

const getAllTweets = asynchandler(async (req, res) => {

    const tweets = await Tweet.find()
        .populate("owner", "username avatar")
        .sort({ createdAt: -1 });

    const tweetsWithLikes = await Promise.all(
        tweets.map(async (tweet) => {

            const likesCount = await Like.countDocuments({
                tweet: tweet._id
            });

            let isLiked = false;

            if (req.user?._id) {
                const like = await Like.findOne({
                    tweet: tweet._id,
                    likedBy: req.user._id
                });

                isLiked = !!like;
            }

            return {
                ...tweet._doc,
                likesCount,
                isLiked
            };
        })
    );

    return res.status(200).json(
        new apiResponse(200, tweetsWithLikes, "All tweets fetched successfully")
    );
});
const updateTweet = asynchandler(async (req, res) => {

    const { tweetId } = req.params;
    const { content } = req.body;

    if (!isValidObjectId(tweetId)) {
        throw new apiError(400, "Invalid Tweet ID");
    }

    if (!content || content.trim() === "") {
        throw new apiError(400, "Tweet content cannot be empty");
    }

    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
        throw new apiError(404, "Tweet not found");
    }

    if (tweet.owner.toString() !== req.user._id.toString()) {
        throw new apiError(403, "You are not authorized to update this tweet");
    }

    tweet.content = content;

    await tweet.save();

    return res.status(200).json(
        new apiResponse(200, tweet, "Tweet updated successfully")
    );
});

const deleteTweet = asynchandler(async (req, res) => {

    const { tweetId } = req.params;

    if (!isValidObjectId(tweetId)) {
        throw new apiError(400, "Invalid Tweet ID");
    }

    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
        throw new apiError(404, "Tweet not found");
    }

    if (tweet.owner.toString() !== req.user._id.toString()) {
        throw new apiError(403, "You are not authorized to delete this tweet");
    }

    await tweet.deleteOne();

    return res.status(200).json(
        new apiResponse(200, {}, "Tweet deleted successfully")
    );
});

export {
    createTweet,
    getUserTweets,
    getAllTweets,
    updateTweet,
    deleteTweet
}