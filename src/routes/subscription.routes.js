import { Router } from 'express';
import {
    getSubscribedChannels,
    getUserChannelSubscribers,
    toggleSubscription,
} from "../controllers/subscription.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router();

router.use(verifyJWT);

// Subscribe / Unsubscribe
router.post("/toggle/:channelId", toggleSubscription);

// Get subscribers of a channel
router.get("/channel/:channelId/subscribers", getUserChannelSubscribers);

// Get channels a user subscribed to
router.get("/user/:subscriberId/subscriptions", getSubscribedChannels);

export default router;