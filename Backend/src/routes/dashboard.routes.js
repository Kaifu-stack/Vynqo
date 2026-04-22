import { Router } from 'express';
import {
    getChannelStats,
    getChannelVideos,
} from "../controllers/dashboard.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

// Channel dashboard (logged-in user)
router.get("/me/stats", getChannelStats);
router.get("/me/videos", getChannelVideos);

export default router;