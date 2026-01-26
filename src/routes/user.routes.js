import { Router } from "express";
import {
    loginuser,
    logoutuser,
    registerUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateuserAvatar,
    updateuserCoverImage,
    getUserChannelProfile,
    getWatchHistory
}
    from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import multer from "multer";

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
)
router.route("/login").post(loginuser)

//secured routes

router.route("/logout").post(verifyJWT, logoutuser)

router.route("/refresh-token").post(refreshAccessToken)

router.route("/change-password").post(verifyJWT, changeCurrentPassword)

router.route("/current-user").get(verifyJWT, getCurrentUser)

router.route("/update-account").patch(verifyJWT, updateAccountDetails)

router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateuserAvatar)

router.route("/cover-Image").patch(verifyJWT, upload.single("coverImage"), updateuserCoverImage)

router.route("/channel/:username").get(verifyJWT, getUserChannelProfile)

router.route("/watchHistory").get(verifyJWT, getWatchHistory)
export default router;