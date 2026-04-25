import { Router } from "express";
import {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet,
    getAllTweets
} from "../controllers/tweet.controller.js";

import { toggleTweetLike } from "../controllers/like.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

//  GET ALL TWEETS
router.get("/", verifyJWT, getAllTweets);

//  LIKE
router.post("/like/:tweetId", verifyJWT, toggleTweetLike);

// CREATE
router.post("/", verifyJWT, createTweet);

// USER TWEETS
router.get("/user/:userId", getUserTweets);

// UPDATE
router.patch("/:tweetId", verifyJWT, updateTweet);

// DELETE
router.delete("/:tweetId", verifyJWT, deleteTweet);

export default router;