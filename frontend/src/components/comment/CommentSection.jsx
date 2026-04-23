import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function CommentSection({ videoId }) {
    const navigate = useNavigate();

    const [comments, setComments] = useState([]);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem("token");

    const fetchComments = async () => {
        try {
            const res = await api.get(`/comments/video/${videoId}`);
            setComments(res.data.data.comments || []);
        } catch (err) {
            console.error("FETCH COMMENTS ERROR:", err);
            setComments([]);
        }
    };

    useEffect(() => {
        if (videoId) fetchComments();
    }, [videoId]);

    /*  Add Comment */
    const handleAddComment = async () => {
        if (!text.trim()) return;

        //  Redirect if not logged in
        if (!token) {
            navigate("/login");
            return;
        }

        try {
            setLoading(true);

            const res = await api.post(`/comments/video/${videoId}`, {
                content: text.trim(),
            });

            setComments((prev) => [
                res.data.data,
                ...(Array.isArray(prev) ? prev : []),
            ]);

            setText("");
        } catch (err) {
            console.error("ADD COMMENT ERROR:", err.response?.data || err);
        } finally {
            setLoading(false);
        }
    };

    /* 🗑 Delete Comment */
    const handleDelete = async (commentId) => {
        //  Redirect if not logged in
        if (!token) {
            navigate("/login");
            return;
        }

        try {
            await api.delete(`/comments/${commentId}`);

            setComments((prev) =>
                (Array.isArray(prev) ? prev : []).filter(
                    (c) => c._id !== commentId
                )
            );
        } catch (err) {
            console.error("DELETE COMMENT ERROR:", err.response?.data || err);
        }
    };

    return (
        <div className="mt-4">

            {/* Input */}
            <div className="flex gap-3 mb-6">
                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) =>
                        e.key === "Enter" && handleAddComment()
                    }
                    placeholder="Add a comment..."
                    className="flex-1 px-4 py-2.5 bg-[#111117] border border-white/10 rounded-xl text-sm text-white placeholder-white/30 outline-none focus:border-orange-500/50 transition"
                />

                <button
                    onClick={handleAddComment}
                    disabled={loading || !text.trim()}
                    className="px-4 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-medium hover:bg-orange-400 disabled:opacity-40 transition"
                >
                    {loading ? "..." : "Post"}
                </button>
            </div>

            {/* Comments */}
            <div className="space-y-3">

                {!comments.length && (
                    <p className="text-white/30 text-sm text-center py-6">
                        No comments yet
                    </p>
                )}

                {Array.isArray(comments) &&
                    comments.map((c) => (
                        <div
                            key={c._id}
                            className="flex gap-3 p-3 rounded-xl bg-[#111117] border border-white/5 hover:border-white/10 transition group"
                        >
                            {/* Avatar */}
                            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-semibold shrink-0">
                                {(c.owner?.username?.[0] || "U").toUpperCase()}
                            </div>

                            {/* Content */}
                            <div className="flex-1">

                                {/* Header */}
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-white/50 font-medium">
                                        {c.owner?.username || "User"}
                                    </span>

                                    <button
                                        onClick={() => handleDelete(c._id)}
                                        className="text-xs text-white/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition"
                                    >
                                        Delete
                                    </button>
                                </div>

                                {/* Comment */}
                                <p className="text-sm text-white/80 mt-1 leading-relaxed">
                                    {c.content}
                                </p>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}