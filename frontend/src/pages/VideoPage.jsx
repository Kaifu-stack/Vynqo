import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import SubscribeButton from "../components/common/SubscribeButton";
import CommentSection from "../components/comment/CommentSection";

export default function VideoPage() {
    const { videoId } = useParams();
    const navigate = useNavigate();

    const [video, setVideo] = useState(null);
    const [likes, setLikes] = useState(0);
    const [liked, setLiked] = useState(false);
    const [viewAdded, setViewAdded] = useState(false);

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const res = await api.get(`/videos/video/${videoId}`);
                const data = res.data.data;

                setVideo(data);
                setLikes(data.totalLikes || 0);
                setLiked(data.isLiked || false);
            } catch (err) {
                console.error(err);
            }
        };

        fetchVideo();
    }, [videoId]);

    /*  Like */
    const handleLike = async () => {
        const token = localStorage.getItem("token");

        // Redirect if not logged in
        if (!token) {
            navigate("/login");
            return;
        }

        try {
            const res = await api.post(`/likes/toggle/v/${video._id}`);

            setLikes(res.data.data.likesCount);
            setLiked(res.data.data.liked);
        } catch (err) {
            console.error("LIKE ERROR:", err.response?.data || err);
        }
    };

    if (!video) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
                    <p className="text-white/40 text-sm">Loading video…</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">

            {/*  Video Player */}
            <div className="rounded-2xl overflow-hidden border border-orange-800/20 shadow-xl shadow-black/40 mb-5">
                <video
                    src={video.videoFile?.url}
                    controls
                    className="w-full aspect-video bg-black"
                    onPlay={async () => {
                        if (viewAdded) return;

                        try {
                            await api.post(`/videos/video/${video._id}/view`);
                            setViewAdded(true);
                        } catch (err) {
                            console.error(err);
                        }
                    }}
                />
            </div>

            {/*  Title */}
            <h1 className="text-xl font-bold text-white tracking-tight mb-2">
                {video.title}
            </h1>

            {/*  Meta */}
            <div className="flex items-center justify-between flex-wrap gap-3 mb-4">

                <div className="flex items-center gap-4">
                    <span className="text-white/40 text-sm flex items-center gap-1.5">
                        👁 {video.views} views
                    </span>

                    <span className="text-white/40 text-sm flex items-center gap-1.5">
                        ❤️ {likes} likes
                    </span>
                </div>

                {/*  Like Button */}
                <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition border ${liked
                        ? "bg-rose-500/20 border-rose-500/30 text-rose-300"
                        : "bg-white/5 border-white/10 text-orange-300/50 hover:bg-orange-900/30 hover:text-orange-300"
                        }`}
                >
                    ❤️ {liked ? "Liked" : "Like"}
                </button>
            </div>

            {/* Divider */}
            <div className="h-px bg-orange-800/15 mb-4" />

            {/*  Channel */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <img
                        src={video.owner?.avatar || "https://via.placeholder.com/40"}
                        className="w-10 h-10 rounded-full object-cover"
                        alt="avatar"
                    />

                    <div>
                        <p className="text-white/80 text-sm font-medium">
                            {video.owner?.username || "Creator"}
                        </p>
                        <p className="text-orange-300/30 text-xs">
                            @{video.owner?.username || "channel"}
                        </p>
                    </div>
                </div>

                <SubscribeButton channelId={video.owner} />
            </div>

            {/*  Description */}
            {video.description && (
                <div className="bg-orange-950/20 border border-orange-800/15 rounded-xl px-4 py-3 mb-5">
                    <p className="text-orange-300/50 text-sm leading-relaxed">
                        {video.description}
                    </p>
                </div>
            )}

            {/*  Comments */}
            <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-4 rounded-full bg-linear-to-b from-orange-400 to-rose-500" />
                <h3 className="text-white/70 font-semibold text-sm">
                    Comments
                </h3>
            </div>

            <CommentSection videoId={video._id} />
        </div>
    );
}