import { apiError } from "../utils/apiError";
import jwt from "jsonwebtoken"
import { asynchandler } from "../utils/asynchandler";
import { User } from "../models/user.model"

export const verifyJWT = asynchandler(async (req, _, next) => {
    try {
        const token = req.cookie?.acessToken || req.header
            ("Authorization")?.replace("Bearer ", "")

        if (!token) {
            throw new apiError(401, "Unauthorized request ")
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken)?._id.select("-password - refreshToken")

        if (!user) {
            throw new apiError(401, "Invalid Acess Token")
        }

        req.user = user;
        next();
    } catch (error) {
        throw new apiError(401, error?.message || "Invalid access token")
    }
})