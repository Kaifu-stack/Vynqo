// @ts-nocheck
import { asynchandler } from "../utils/asynchandler.js";
import { apiError } from "../utils/apiError.js"
import { User } from "../models/user.model.js"
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const acessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { acessToken, refreshToken }
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

    if (!username || !email) {
        throw new apiError(400, "username or password is required ")

    }
    const user = User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
        throw new apiError(404, "user does not exist")
    }

    const ispasswordvalid = await user.isPasswordCorrect
        (password)

    if (!ispasswordvalid) {
        throw new apiError(401, "Invalid user Credentials")
    }

    const { acessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).
        select("-password ,-refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200).cookie("acessToken", acessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new apiResponse(
                200, {
                user: loggedInUser, acessToken, refreshToken

            },
                "User logged in suceesfully"
            )

        )

})

const logoutuser = asynchandler(async (req, res) => {

})
export {
    registerUser,
    loginuser,
    logoutuser
};