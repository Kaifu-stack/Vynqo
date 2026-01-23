// @ts-nocheck
import { asynchandler } from "../utils/asynchandler.js";

const registerUser = asynchandler(async (req, res) => {
    res.status(200).json({
        success: true,
        message: "User registered successfully"
    });
})

export { registerUser };