import { Router } from "express";
import {
    addComment,
    deleteComment,
    getVideoComments,
    updateComment,
} from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.get("/video/:videoId", getVideoComments);


//  Video comments
router.use(verifyJWT);
router.post("/video/:videoId", addComment);
router.delete("/:commentId", deleteComment);
router.patch("/:commentId", updateComment);

export default router;