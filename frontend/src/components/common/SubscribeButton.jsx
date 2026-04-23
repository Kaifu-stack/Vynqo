import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function SubscribeButton({ channelId }) {
    const navigate = useNavigate();

    const [subscribed, setSubscribed] = useState(false);
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem("token");

    const normalizedId =
        typeof channelId === "object" ? channelId?._id : channelId;

    useEffect(() => {
        if (!normalizedId) return;
        setSubscribed(false); // reset when channel changes
    }, [normalizedId]);

    const toggleSubscribe = async (e) => {
        e.stopPropagation();

        //  NOT LOGGED IN → REDIRECT
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

            // safer update
            setSubscribed((prev) =>
                res.data.data?.subscribed ?? !prev
            );
        } catch (err) {
            console.error("SUBSCRIBE ERROR:", err.response?.data || err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={toggleSubscribe}
            disabled={loading}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${subscribed
                ? "bg-white/5 border-white/10 text-white/60 hover:text-red-400 hover:border-red-500/30"
                : "bg-orange-500 text-white hover:bg-orange-400 shadow-sm"
                }`}
        >
            {loading ? "..." : subscribed ? "Subscribed" : "Subscribe"}
        </button>
    );
}