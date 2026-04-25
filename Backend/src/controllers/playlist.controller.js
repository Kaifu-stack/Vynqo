import mongoose, { isValidObjectId } from "mongoose"
import { Playlist } from "../models/playlist.model.js"
import { apiError } from "../utils/apiError.js"
import { apiResponse } from "../utils/apiResponse.js"
import { asynchandler } from "../utils/asynchandler.js"


const createPlaylist = asynchandler(async (req, res) => {
    const { name, description } = req.body;

    if (!name || !description) {
        throw new apiError(400, "Name and description are required");
    }

    const playlist = await Playlist.create({
        name,
        description,
        owner: req.user._id,
        videos: []
    });

    return res.status(201).json(
        new apiResponse(201, playlist, "Playlist created successfully")
    );
});

const getUserPlaylists = asynchandler(async (req, res) => {
    let userId = req.params.userId;

    // If no userId → use logged-in user
    if (!userId) {
        userId = req.user._id;
    }

    if (!isValidObjectId(userId)) {
        throw new apiError(400, "Invalid userId");
    }

    const playlists = await Playlist.find({ owner: userId })
        .populate("videos", "title thumbnail duration views")
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new apiResponse(200, playlists, "User playlists fetched")
    );
});
const getPlaylistById = asynchandler(async (req, res) => {
    const { playlistId } = req.params;

    if (!isValidObjectId(playlistId)) {
        throw new apiError(400, "Invalid playlist ID");
    }

    const playlist = await Playlist.findById(playlistId)
        .populate({
            path: "videos",
            populate: {
                path: "owner",
                select: "username avatar"
            }
        });

    if (!playlist) {
        throw new apiError(404, "Playlist not found");
    }

    return res.status(200).json(
        new apiResponse(200, playlist, "Playlist fetched successfully")
    );
});
const addVideoToPlaylist = asynchandler(async (req, res) => {
    const { playlistId, videoId } = req.params;

    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new apiError(400, "Invalid IDs");
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new apiError(404, "Playlist not found");
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new apiError(403, "Unauthorized");
    }

    const alreadyExists = playlist.videos.some(
        (vid) => vid.toString() === videoId
    );

    if (alreadyExists) {
        return res.status(200).json(
            new apiResponse(200, playlist, "Video already in playlist")
        );
    }

    playlist.videos.push(videoId);
    await playlist.save();
    const updatedPlaylist = await Playlist.findById(playlist._id)
        .populate({
            path: "videos",
            populate: {
                path: "owner",
                select: "username avatar"
            }
        });

    return res.status(200).json(
        new apiResponse(200, updatedPlaylist, "Video added to playlist")
    );
});
const removeVideoFromPlaylist = asynchandler(async (req, res) => {
    const { playlistId, videoId } = req.params;

    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new apiError(400, "Invalid IDs");
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new apiError(404, "Playlist not found");
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new apiError(403, "Unauthorized");
    }

    playlist.videos = playlist.videos.filter(
        (vid) => vid.toString() !== videoId
    );

    await playlist.save();

    return res.status(200).json(
        new apiResponse(200, playlist, "Video removed from playlist")
    );
});

const deletePlaylist = asynchandler(async (req, res) => {
    const { playlistId } = req.params;

    if (!isValidObjectId(playlistId)) {
        throw new apiError(400, "Invalid playlistId");
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new apiError(404, "Playlist not found");
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new apiError(403, "Unauthorized");
    }

    await playlist.deleteOne();

    return res.status(200).json(
        new apiResponse(200, {}, "Playlist deleted successfully")
    );
});

const updatePlaylist = asynchandler(async (req, res) => {
    const { playlistId } = req.params;
    const { name, description } = req.body;

    if (!isValidObjectId(playlistId)) {
        throw new apiError(400, "Invalid playlistId");
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new apiError(404, "Playlist not found");
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new apiError(403, "Unauthorized");
    }

    if (name) playlist.name = name;
    if (description) playlist.description = description;

    await playlist.save();

    return res.status(200).json(
        new apiResponse(200, playlist, "Playlist updated successfully")
    );
});

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}