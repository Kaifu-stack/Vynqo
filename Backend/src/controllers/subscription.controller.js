import mongoose, { isValidObjectId } from "mongoose"
import { User } from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import { apiError } from "../utils/apiError.js"
import { apiResponse } from "../utils/apiResponse.js"
import { asynchandler } from "../utils/asynchandler.js"


const toggleSubscription = asynchandler(async (req, res) => {
    const { channelId } = req.params;
    const userId = req.user?._id;

    if (!isValidObjectId(channelId)) {
        throw new apiError(400, "Invalid channelId");
    }

    if (!userId) {
        throw new apiError(401, "Unauthorized");
    }

    if (channelId === userId.toString()) {
        throw new apiError(400, "You cannot subscribe to yourself");
    }

    const existingSub = await Subscription.findOne({
        subscriber: userId,
        channel: channelId
    });

    //  UNSUBSCRIBE
    if (existingSub) {
        await existingSub.deleteOne();

        const count = await Subscription.countDocuments({ channel: channelId });

        return res.status(200).json(
            new apiResponse(200, {
                subscribed: false,
                subscribersCount: count
            }, "Unsubscribed successfully")
        );
    }

    // SUBSCRIBE
    await Subscription.create({
        subscriber: userId,
        channel: channelId
    });

    const count = await Subscription.countDocuments({ channel: channelId });

    return res.status(200).json(
        new apiResponse(200, {
            subscribed: true,
            subscribersCount: count
        }, "Subscribed successfully")
    );
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asynchandler(async (req, res) => {
    const { channelId } = req.params;

    if (!isValidObjectId(channelId)) {
        throw new apiError(400, "Invalid channelId");
    }

    const subscribers = await Subscription.aggregate([
        {
            $match: {
                channel: new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "subscriber",
                foreignField: "_id",
                as: "subscriberDetails"
            }
        },
        {
            $unwind: "$subscriberDetails"
        },
        {
            $project: {
                _id: 0,
                subscriber: {
                    _id: "$subscriberDetails._id",
                    username: "$subscriberDetails.username",
                    avatar: "$subscriberDetails.avatar"
                }
            }
        }
    ]);

    return res.status(200).json(
        new apiResponse(200, subscribers, "Subscribers fetched successfully")
    );
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asynchandler(async (req, res) => {
    const { subscriberId } = req.params;

    if (!isValidObjectId(subscriberId)) {
        throw new apiError(400, "Invalid subscriberId");
    }

    const channels = await Subscription.aggregate([
        {
            $match: {
                subscriber: new mongoose.Types.ObjectId(subscriberId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "channel",
                foreignField: "_id",
                as: "channelDetails"
            }
        },
        {
            $unwind: "$channelDetails"
        },
        {
            $project: {
                _id: 0,
                channel: {
                    _id: "$channelDetails._id",
                    username: "$channelDetails.username",
                    avatar: "$channelDetails.avatar"
                }
            }
        }
    ]);

    return res.status(200).json(
        new apiResponse(200, channels, "Subscribed channels fetched successfully")
    );
});
export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}