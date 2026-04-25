import api from "../../api/axios";
import { useState, useEffect } from "react";
import { socket } from "../../socket";

export default function TweetCard({ tweet, onDelete, onUpdate }) {
    const [editing, setEditing] = useState(false);
    const [content, setContent] = useState(tweet.content);

    //  Likes
    const [liked, setLiked] = useState(tweet.isLiked || false);
    const [likes, setLikes] = useState(tweet.likesCount || 0);

    //  Replies
    const [replies, setReplies] = useState([]);
    const [replyText, setReplyText] = useState("");

    //  Current user
    let currentUser = null;
    try {
        const stored = localStorage.getItem("user");
        if (stored && stored !== "undefined") {
            currentUser = JSON.parse(stored);
        }
    } catch {
        currentUser = null;
    }


    useEffect(() => {
        const fetchReplies = async () => {
            try {
                const res = await api.get(`/replies/${tweet._id}`);

                setReplies(
                    (res.data.data || []).filter(r => r && r._id)
                );
            } catch (err) {
                console.error(err);
            }
        };

        fetchReplies();
    }, [tweet._id]);

    const handleLike = async () => {
        try {
            const res = await api.post(`/tweets/like/${tweet._id}`);

            setLiked(res.data.data.liked);
            setLikes(res.data.data.likesCount);

        } catch (err) {
            console.error(err);
        }
    };

    const handleReply = async () => {
        if (!replyText.trim()) return;

        try {
            const res = await api.post(`/replies/${tweet._id}`, {
                content: replyText
            });

            const newReply = res.data.data;

            setReplies(prev => {
                if (!newReply || !newReply._id) return prev;

                if (prev.find(r => r._id === newReply._id)) return prev;

                return [newReply, ...prev];
            });

            setReplyText("");

        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/tweets/${tweet._id}`);
            onDelete(tweet._id);
        } catch (err) {
            console.error(err);
            alert("Delete failed");
        }
    };

    const handleUpdate = async () => {
        try {
            const res = await api.patch(`/tweets/${tweet._id}`, { content });
            onUpdate(res.data.data);
            setEditing(false);
        } catch (err) {
            console.error(err);
            alert("Update failed");
        }
    };


    useEffect(() => {
        socket.on("tweet-liked", ({ tweetId, likesCount }) => {
            if (tweetId === tweet._id) {
                setLikes(likesCount);
            }
        });

        return () => socket.off("tweet-liked");
    }, [tweet._id]);

    useEffect(() => {
        socket.on("new-reply", ({ tweetId, reply }) => {
            if (tweetId !== tweet._id) return;
            if (!reply || !reply._id) return;

            if (reply.owner?._id === currentUser?._id) return;

            setReplies(prev => {
                if (prev.find(r => r._id === reply._id)) return prev;
                return [reply, ...prev];
            });
        });

        return () => socket.off("new-reply");
    }, [tweet._id]);

    return (
        <div className="bg-[#111117] p-4 rounded-2xl border border-white/10 mb-4 hover:border-orange-500/30 transition">

            <div className="flex gap-3">

                {/* Avatar */}
                <img
                    src={tweet?.owner?.avatar?.url || "https://via.placeholder.com/40"}
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover"
                />

                <div className="flex-1">

                    {/* Header */}
                    <div className="flex items-center gap-2">
                        <p className="text-white font-medium text-sm">
                            {tweet?.owner?.username || "Unknown"}
                        </p>
                        <span className="text-white/40 text-xs">
                            • {new Date(tweet.createdAt).toLocaleString()}
                        </span>
                    </div>

                    {/* Content */}
                    {editing ? (
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full bg-transparent text-white mt-2 outline-none"
                        />
                    ) : (
                        <p className="text-white/90 text-sm mt-1">
                            {tweet.content}
                        </p>
                    )}

                    {/* Actions */}
                    <div className="flex gap-4 mt-3 text-xs text-white/40">

                        <button
                            onClick={handleLike}
                            className={`transition ${liked ? "text-rose-400" : "hover:text-orange-400"
                                }`}
                        >
                            {liked ? "❤️" : "🤍"} {likes}
                        </button>

                        {tweet?.owner?._id === currentUser?._id && (
                            <>
                                {editing ? (
                                    <button onClick={handleUpdate} className="text-green-400">
                                        Save
                                    </button>
                                ) : (
                                    <button onClick={() => setEditing(true)}>
                                        Edit
                                    </button>
                                )}

                                <button onClick={handleDelete} className="text-red-400">
                                    Delete
                                </button>
                            </>
                        )}
                    </div>

                    {/*  REPLIES */}
                    <div className="mt-4">

                        {/* Input */}
                        <div className="flex gap-2">
                            <input
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Reply..."
                                className="flex-1 bg-[#1a1a22] text-white px-3 py-1 rounded-lg text-sm outline-none"
                            />
                            <button
                                onClick={handleReply}
                                className="text-xs bg-orange-500 px-3 py-1 rounded"
                            >
                                Reply
                            </button>
                        </div>

                        {/* Replies List */}
                        <div className="mt-3 space-y-2">
                            {replies
                                .filter((r, i, arr) =>
                                    r && r._id && arr.findIndex(x => x._id === r._id) === i
                                )
                                .map((r) => (
                                    <div key={r._id} className="flex gap-2 text-sm">
                                        <img
                                            src={r.owner?.avatar?.url}
                                            className="w-6 h-6 rounded-full"
                                        />
                                        <div>
                                            <p className="text-white text-xs font-medium">
                                                {r.owner?.username}
                                            </p>
                                            <p className="text-white/70 text-xs">
                                                {r.content}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
}