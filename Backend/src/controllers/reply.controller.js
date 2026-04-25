import { Reply } from "../models/reply.model.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";

// Add reply
export const createReply = async (req, res) => {
    const { tweetId } = req.params;
    const { content } = req.body;

    const reply = await Reply.create({
        content,
        tweet: tweetId,
        owner: req.user._id
    });

    const populated = await reply.populate("owner", "username avatar");

    //  REAL-TIME
    global.io.emit("new-reply", {
        tweetId,
        reply: populated
    });

    res.json(populated);
};

//  Get replies
export const getReplies = async (req, res) => {
    const { tweetId } = req.params;

    const replies = await Reply.find({ tweet: tweetId })
        .populate("owner", "username avatar")
        .sort({ createdAt: -1 });

    return res.json(
        new apiResponse(200, replies, "Replies fetched")
    );
};