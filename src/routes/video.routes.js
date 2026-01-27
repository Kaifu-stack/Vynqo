import { Router } from "express";
import {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
} from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();
import multer from "multer";
import { upload } from "../middlewares/multer.middleware.js";
router.route("/getAll-videos").get(getAllVideos);

router.route("/publish-video").post(
    verifyJWT,
    upload.fields([
        { name: "video", maxCount: 1 },
        { name: "thumbnail", maxCount: 1 }
    ]),
    publishAVideo
);

router.route("/video/:videoId").get(getVideoById);
router.route("/video/:videoId").patch(verifyJWT, updateVideo);
router.route("/video/:videoId").delete(verifyJWT, deleteVideo);
router.route("/video/toggle-publish/:videoId").patch(verifyJWT, togglePublishStatus);
export default router;