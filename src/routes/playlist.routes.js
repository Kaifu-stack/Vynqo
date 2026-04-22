import { Router } from 'express';
import {
    addVideoToPlaylist,
    createPlaylist,
    deletePlaylist,
    getPlaylistById,
    getUserPlaylists,
    removeVideoFromPlaylist,
    updatePlaylist,
} from "../controllers/playlist.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

// Create playlist
router.post("/", createPlaylist);

// Get logged-in user's playlists 
router.get("/me", getUserPlaylists);

// Get playlists of a specific user
router.get("/user/:userId", getUserPlaylists);

// Playlist CRUD
router
    .route("/:playlistId")
    .get(getPlaylistById)
    .patch(updatePlaylist)
    .delete(deletePlaylist);

// Add video to playlist
router.post("/:playlistId/videos/:videoId", addVideoToPlaylist);

// Remove video from playlist
router.delete("/:playlistId/videos/:videoId", removeVideoFromPlaylist);

export default router;