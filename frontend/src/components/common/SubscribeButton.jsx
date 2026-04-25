import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
export default function SubscribeButton({ channelId, initialSubscribed = false }) {
    const navigate = useNavigate();

    const [subscribed, setSubscribed] = useState(initialSubscribed);
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem("token");

    const normalizedId =
        typeof channelId === "object" ? channelId?._id : channelId;

    const toggleSubscribe = async (e) => {
        e.stopPropagation();

        if (!token) {
            navigate("/login");
            return;
        }

        if (!normalizedId || loading) return;

        try {
            setLoading(true);

            const res = await api.post(
                `/subscriptions/toggle/${normalizedId}`
            );

            // ✅ ALWAYS TRUST BACKEND
            setSubscribed(res.data.data.subscribed);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    return (
        <button
            onClick={toggleSubscribe}
            disabled={loading}
            className={`
        px-4 py-2 rounded-full text-sm font-medium 
        transition-all duration-150 
        cursor-pointer active:scale-95
        ${loading ? "opacity-50 cursor-not-allowed" : ""}
        ${subscribed
                    ? "bg-white/5 border border-white/10 text-white/60 hover:text-red-400 hover:border-red-500/40"
                    : "bg-orange-500 text-white hover:bg-orange-400 shadow-md hover:shadow-orange-500/20"
                }
    `}
        >
            {loading ? "..." : subscribed ? "Subscribed" : "Subscribe"}
        </button>
    );
}