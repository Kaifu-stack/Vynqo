import { Router } from "express";
import { createReply, getReplies } from "../controllers/reply.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/:tweetId", verifyJWT, createReply);
router.get("/:tweetId", getReplies);

export default router;