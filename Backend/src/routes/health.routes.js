import { Router } from "express";

const router = Router();

router.get("/healthcheck", (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Server awake"
    });
});

export default router;