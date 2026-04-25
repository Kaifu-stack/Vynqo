import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

export default function PlaylistPage() {
    const { playlistId } = useParams();

    const [playlist, setPlaylist] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchPlaylist = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/playlists/${playlistId}`);
            setPlaylist(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlaylist();
    }, [playlistId]);

    const removeVideo = async (videoId) => {
        try {
            await api.delete(
                `/playlists/${playlistId}/videos/${videoId}`
            );

            setPlaylist((prev) => ({
                ...prev,
                videos: prev.videos.filter(v => v._id !== videoId)
            }));

        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return <p className="text-white/40 text-center mt-10">Loading...</p>;
    }

    if (!playlist) {
        return <p className="text-white/40 text-center mt-10">Not found</p>;
    }

    return (
        <div className="max-w-6xl mx-auto">

            <div className="mb-6">
                <h1 className="text-white text-xl font-semibold">
                    {playlist.name}
                </h1>

                <p className="text-white/40 text-sm">
                    {playlist.description}
                </p>

                <p className="text-white/30 text-xs mt-1">
                    {playlist.videos?.length || 0} videos
                </p>
            </div>

            {/* VIDEOS */}
            {playlist.videos.length === 0 ? (
                <p className="text-white/40">
                    No videos in this playlist
                </p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                    {playlist.videos.map((video) => (
                        <div
                            key={video._id}
                            className="bg-[#111117] p-3 rounded-xl border border-white/5"
                        >
                            {/* Thumbnail */}
                            <img
                                src={video.thumbnail?.url}
                                className="w-full h-40 object-cover rounded-lg mb-2"
                            />

                            {/* Title */}
                            <h2 className="text-white text-sm font-medium line-clamp-2">
                                {video.title}
                            </h2>

                            {/* Owner */}
                            <div className="flex items-center gap-2 mt-2">
                                <img
                                    src={video.owner?.avatar?.url}
                                    className="w-6 h-6 rounded-full"
                                />
                                <p className="text-xs text-white/60">
                                    {video.owner?.username}
                                </p>
                            </div>

                            <button
                                onClick={() => removeVideo(video._id)}
                                className="mt-3 w-full text-xs py-1.5 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30"
                            >
                                Remove
                            </button>
                        </div>
                    ))}

                </div>
            )}
        </div>
    );
}