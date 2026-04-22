// @ts-nocheck
import { asynchandler } from "../utils/asynchandler.js";
import { apiError } from "../utils/apiError.js"
import { User } from "../models/user.model.js"
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new apiError(500, "something went wrong while genrating acess and refresh tokens")
    }
}
const registerUser = asynchandler(async (req, res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exist : username,email
    // check for images, cheack for avatar
    // upload time to cloudinary, avatar
    // create user object-- create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return response

    const { fullname, email, username, password } = req.body
    // console.log("email: ", email);

    if (
        [fullname, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new apiError(400, "All field are required ")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (existedUser) {
        throw new apiError(409, "username already exists !")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path
    //const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path

    }

    if (!avatarLocalPath) {
        throw new apiError(400, "Avatar File is Required")
    }

    const avatar = await uploadToCloudinary(avatarLocalPath)
    const coverImage = await uploadToCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new apiError(400, "Avatar Upload Failed")
    }

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if (!createdUser) {
        throw new apiError(500, "Something went Wrong while Registering User")
    }

    return res.status(201).json(
        new apiResponse(200, createdUser, "User Registered Suceesfully ")
    )
})
const loginuser = asynchandler(async (req, res) => {
    // req body -> data 
    // username or email
    // find the user
    // password check
    // acess and refreshtoken
    // send cookies
    // response sucessful login


    const { email, username, password } = req.body

    if (!username && !email) {
        throw new apiError(400, "username or email is required ")

    }
    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
        throw new apiError(404, "user does not exist")
    }

    const ispasswordvalid = await user.isPasswordCorrect(password)

    if (!ispasswordvalid) {
        throw new apiError(401, "Invalid user Credentials")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).
        select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200).cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new apiResponse(
                200, {
                user: loggedInUser, accessToken, refreshToken

            },
                "User logged in suceesfully"
            )

        )

})

const logoutuser = asynchandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id, {
        $set: {
            refreshToken: undefined
        }
    },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new apiResponse(200, {}, " User Logged Out"))
})

const refreshAccessToken = asynchandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new apiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id)

        if (!user) {
            throw new apiError(401, "unauthorized request")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new apiError(401, "Refresh Token is expired")
        }

        const options = {
            httpOnly: true,
            secure: true
        }
        const { accessToken, newrefreshToken } = await generateAccessAndRefreshTokens(user._id)

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newrefreshToken, options)
            .json(
                new apiResponse(
                    200,
                    { accessToken, refreshToken: newrefreshToken },
                    "Access Token Refreshed Successfully "
                )
            )
    } catch (error) {
        throw new apiError(401, error?.message || "Invalid refresh Token ")
    }
})

const changeCurrentPassword = asynchandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body

    const user = await User.findById(req.user?._id)
    if (!user) {
        throw new apiError(401, "Unauthorized user");
    }
    const ispasswordcorrect = await user.isPasswordCorrect(oldPassword)

    if (!ispasswordcorrect) {
        throw new apiError(400, "Invalid old password")
    }

    user.password = newPassword
    await user.save({ validateBeforeSave: true })

    return res.status(200)
        .json(
            new apiResponse(200, {}, " Password Changed Successfully")
        )
})

const getCurrentUser = asynchandler(async (req, res) => {
    return res.status(200)
        .json(new apiResponse(200, req.user, "Current use fetched Successfully "))
})
const updateAccountDetails = asynchandler(async (req, res) => {
    const { fullname, email } = req.body

    if (!fullname || !email) {
        throw new apiError(400, "All fields are required ")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullname,
                email
            }
        },
        { new: true }

    ).select("-password")

    return res
        .status(200)
        .json(200, user, "Account details updated successfully")
})

const updateuserAvatar = asynchandler(async (req, res) => {
    const avatarLocalPath = req.file?.path

    if (!avatarLocalPath) {
        throw new apiError(400, "Avatar File is Missing")
    }

    // get current user
    const currentUser = await User.findById(req.user?._id);
    if (!currentUser) {
        throw new apiError(401, "Unauthorized user");
    }
    const oldAvatarPublicId = currentUser.avatar?.public_id;
    console.log("Avatar local path:", avatarLocalPath);

    const avatar = await uploadToCloudinary(avatarLocalPath)

    if (!avatar?.url || !avatar?.public_id) {
        throw new apiError(400, "Error while uploading on avatar")
    }

    //  Delete old avatar (if exists)
    if (oldAvatarPublicId) {
        await deleteFromCloudinary(oldAvatarPublicId);
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: {
                    url: avatar.url,
                    public_id: avatar.public_id
                }

            }
        },
        { new: true }
    ).select("-password")

    return res
        .status(200)
        .json(
            new apiResponse(200, user, "Avatar Updated Successfully")
        )
})


const updateuserCoverImage = asynchandler(async (req, res) => {
    const coverImageLocalPath = req.file?.path

    if (!coverImageLocalPath) {
        throw new apiError(400, "CoverImage is Missing")
    }

    const coverImage = await uploadToCloudinary(coverImageLocalPath)

    if (!coverImage.url || !coverImage?.public_id) {
        throw new apiError(400, "Error while uploading coverImage")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                coverImage: {
                    url: coverImage.url,
                    public_id: coverImage.public_id
                }
            }
        },
        { new: true }
    ).select("-password")

    return res
        .status(200)
        .json(
            new apiResponse(200, user, "Cover Image Updated Successfully")
        )
})

const getUserChannelProfile = asynchandler(async (req, res) => {
    const { username } = req.params
    console.log("USERNAME PARAM:", req.params.username);

    if (!username?.trim()) {
        throw new apiError(400, "username is missing")
    }

    const channel = await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscribersCount: {
                    $size: "$subscribers"
                },
                channelsSubscribedToCount: {
                    $size: "$subscribedTo"
                },
                isSubscribed: {
                    $cond: {
                        if: {
                            $in: [req.user?._id
                                , "$subscribers.subscriber"]
                        },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                fullname: 1,
                username: 1,
                subscribersCount: 1,
                channelsSubscribedToCount: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1,
                email: 1
            }
        }
    ])
    if (!channel?.length) {
        throw new apiError(404, "channel does not exists")
    }

    return res.status(200)
        .json(new apiResponse(200, channel[0], "user channel fetched successfully"))
})

const getWatchHistory = asynchandler(async (req, res) => {
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "videos", // mongo db converts to lowercase pluralform
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullname: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                },
                                {
                                    $addFields: {
                                        owner: {
                                            $first: "$owner"
                                        }
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        }
    ])
    return res
        .status(200)
        .json(
            new apiResponse(200, user[0].watchHistory, "watch History Fetched Successfully")
        )
})
export {
    registerUser,
    loginuser,
    logoutuser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateuserAvatar,
    updateuserCoverImage,
    getUserChannelProfile,
    getWatchHistory
};