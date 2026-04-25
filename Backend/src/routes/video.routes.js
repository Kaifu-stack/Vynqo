import { Router } from "express";
import {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
    getMyVideos
} from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();
import multer from "multer";
import { upload } from "../middlewares/multer.middleware.js";
router.get("/", getAllVideos);

router.route("/publish-video").post(
    verifyJWT,
    upload.fields([
        { name: "videoFile", maxCount: 1 },
        { name: "thumbnail", maxCount: 1 }
    ]),
    publishAVideo
);

router.get("/video/:videoId", verifyJWT, getVideoById);
router.route("/video/:videoId").patch(verifyJWT, upload.single("thumbnail"), updateVideo);
router.route("/video/:videoId").delete(verifyJWT, deleteVideo);
router.route("/video/toggle-publish/:videoId").patch(verifyJWT, togglePublishStatus);
router.get("/my-videos", verifyJWT, getMyVideos);
export default router;