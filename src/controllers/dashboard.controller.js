import mongoose from "mongoose"
import { Video } from "../models/video.model.js"
import { Subscription } from "../models/subscription.model.js"
import { Like } from "../models/like.model.js"
import { apiError } from "../utils/apiError.js"
import { apiResponse } from "../utils/apiResponse.js"
import { asynchandler } from "../utils/asynchandler.js"

const getChannelStats = asynchandler(async (req, res) => {
    const channelId = req.user?._id;

    if (!channelId) {
        throw new apiError(401, "Unauthorized request");
    }

    const stats = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(channelId),
                isPublished: true
            }
        },
        {
            $lookup: {
                from: "likes",
                let: { videoId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$video", "$$videoId"] },
                                    { $ne: ["$video", null] } // IMPORTANT
                                ]
                            }
                        }
                    }
                ],
                as: "likes"
            }
        },
        {
            $addFields: {
                totalLikes: { $size: "$likes" }
            }
        },
        {
            $group: {
                _id: null,
                totalVideos: { $sum: 1 },
                totalViews: { $sum: "$views" },
                totalLikes: { $sum: "$totalLikes" }
            }
        }
    ]);

    const totalSubscribers = await Subscription.countDocuments({
        channel: channelId
    });

    const result = stats[0] || {
        totalVideos: 0,
        totalViews: 0,
        totalLikes: 0
    };

    return res.status(200).json(
        new apiResponse(
            200,
            {
                ...result,
                totalSubscribers
            },
            "Channel stats fetched successfully"
        )
    );
});

const getChannelVideos = asynchandler(async (req, res) => {
    const channelId = req.user?._id;

    if (!channelId) {
        throw new apiError(401, "Unauthorized request");
    }

    const { page = 1, limit = 10 } = req.query;

    const aggregate = Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(channelId),
                isPublished: true
            }
        },
        {
            $lookup: {
                from: "likes",
                let: { videoId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$video", "$$videoId"] },
                                    { $ne: ["$video", null] }
                                ]
                            }
                        }
                    }
                ],
                as: "likes"
            }
        },
        {
            $addFields: {
                totalLikes: { $size: "$likes" }
            }
        },
        {
            $project: {
                likes: 0
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        }
    ]);

    const options = {
        page: parseInt(page),
        limit: parseInt(limit)
    };

    const videos = await Video.aggregatePaginate(aggregate, options);

    return res.status(200).json(
        new apiResponse(
            200,
            videos,
            "Channel videos fetched successfully"
        )
    );
});

export {
    getChannelStats,
    getChannelVideos
}