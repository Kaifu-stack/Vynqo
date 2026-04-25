import api from "../../api/axios";
import { useState } from "react";

export default function CreateTweet({ onTweetCreated }) {
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);

    let user = null;

    try {
        const stored = localStorage.getItem("user");
        if (stored && stored !== "undefined") {
            user = JSON.parse(stored);
        }
    } catch {
        user = null;
    }

    const handleSubmit = async () => {
        if (!content.trim()) {
            alert("Tweet cannot be empty");
            return;
        }

        try {
            setLoading(true);

            const res = await api.post("/tweets", { content });

            onTweetCreated(res.data.data);
            setContent("");

        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to post tweet");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#111117] p-4 rounded-2xl border border-white/10 mb-5">

            <div className="flex gap-3">
                <img
                    src={user?.avatar?.url || "https://via.placeholder.com/40"}
                    alt="avatar"
                    className="w-10 h-10 rounded-full"
                />

                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What's happening?"
                    className="flex-1 bg-transparent text-white outline-none resize-none text-sm"
                />
            </div>

            <div className="flex justify-end mt-3">
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-5 py-1.5 bg-orange-500 rounded-full text-white text-sm hover:bg-orange-600 transition disabled:opacity-50"
                >
                    {loading ? "Posting..." : "Tweet"}
                </button>
            </div>
        </div>
    );
}