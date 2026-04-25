import mongoose, { Schema } from "mongoose";

const replySchema = new Schema({
    content: {
        type: String,
        required: true
    },
    tweet: {
        type: Schema.Types.ObjectId,
        ref: "Tweet",
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

export const Reply = mongoose.model("Reply", replySchema);