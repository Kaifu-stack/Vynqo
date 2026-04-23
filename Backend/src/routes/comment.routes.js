import { Router } from "express";
import {
    addComment,
    deleteComment,
    getVideoComments,
    updateComment,
} from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

//  Video comments
router.get("/video/:videoId", getVideoComments);
router.post("/video/:videoId", addComment);

//  Single comment actions
router.delete("/:commentId", deleteComment);
router.patch("/:commentId", updateComment);

export default router;