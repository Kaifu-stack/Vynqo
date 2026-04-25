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
    const [subscribed, setSubscribed] = useState(false);
    const [viewAdded, setViewAdded] = useState(false);

    //  FETCH VIDEO
    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const res = await api.get(`/videos/video/${videoId}`);
                const data = res.data.data;

                setVideo(data);
                setLikes(data.totalLikes || 0);
                setLiked(data.isLiked || false);
                setSubscribed(data.isSubscribed || false);

            } catch (err) {
                console.error(err);
            }
        };

        fetchVideo();
    }, [videoId]);

    //  LIKE
    const handleLike = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        try {
            const res = await api.post(`/likes/toggle/v/${video._id}`);

            setLikes(res.data.data.likesCount);
            setLiked(res.data.data.liked);

        } catch (err) {
            console.error(err);
        }
    };

    //  LOADING
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

            {/* 🎥 VIDEO (FIXED) */}
            <div className="rounded-2xl border border-orange-800/20 shadow-xl mb-5">
                <video
                    src={video?.videoFile?.url}
                    controls
                    className="w-full aspect-video bg-black relative z-10"
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

            {/*  TITLE */}
            <h1 className="text-xl font-bold text-white mb-2">
                {video?.title}
            </h1>

            {/*  META */}
            <div className="flex justify-between mb-4">

                <div className="flex gap-4 text-white/40 text-sm">
                    <span>👁 {video?.views || 0}</span>
                    <span>❤️ {likes}</span>
                </div>

                {/* ❤️ LIKE BUTTON */}
                <button
                    onClick={handleLike}
                    className={`px-4 py-2 rounded-xl text-sm transition ${liked
                        ? "bg-rose-500/20 text-rose-300"
                        : "bg-white/5 text-white/50 hover:bg-orange-900/30"
                        }`}
                >
                    ❤️ {liked ? "Liked" : "Like"}
                </button>
            </div>

            {/*  CHANNEL */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex gap-3 items-center">
                    <img
                        src={
                            video?.owner?.avatar?.url ||
                            video?.owner?.avatar ||
                            "https://via.placeholder.com/40"
                        }
                        className="w-10 h-10 rounded-full object-cover"
                        alt="avatar"
                    />
                    <p className="text-white">
                        {video?.owner?.username || "Unknown"}
                    </p>
                </div>

                <SubscribeButton
                    channelId={video?.owner?._id}
                    initialSubscribed={subscribed}
                />
            </div>

            {/*  DESCRIPTION */}
            {video?.description && (
                <p className="text-white/50 mb-4">
                    {video.description}
                </p>
            )}

            {/*  COMMENTS */}
            <CommentSection videoId={video._id} />
        </div>
    );
}