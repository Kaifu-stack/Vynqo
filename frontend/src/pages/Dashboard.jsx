import { useEffect, useState } from "react";
import api from "../api/axios";
import VideoCard from "../components/video/VideoCard";
import DashboardSkeleton from "../components/skeleton/DashboardSkeleton";
import StatCard from "../components/StatCard";

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [videos, setVideos] = useState([]);
    const [stats, setStats] = useState({
        totalVideos: 0,
        totalViews: 0,
        totalLikes: 0,
    });
    const [loading, setLoading] = useState(true);

    //  Fetch dashboard data
    const fetchDashboard = async () => {
        try {
            setLoading(true);

            const [userRes, videoRes] = await Promise.all([
                api.get("/users/current-user"),
                api.get("/videos/my-videos"),
            ]);

            const vids = videoRes.data.data || [];

            setUser(userRes.data.data);
            setVideos(vids);

            updateStats(vids);

        } catch (err) {
            console.error("Dashboard Error:", err.response?.data || err);
        } finally {
            setLoading(false);
        }
    };

    //  Stats calculator
    const updateStats = (vids) => {
        const totalViews = vids.reduce((sum, v) => sum + (v.views || 0), 0);
        const totalLikes = vids.reduce((sum, v) => sum + (v.totalLikes || 0), 0);

        setStats({
            totalVideos: vids.length,
            totalViews,
            totalLikes,
        });
    };

    //  Delete handler (UI sync)
    const handleDelete = (id) => {
        const updated = videos.filter((v) => v._id !== id);
        setVideos(updated);
        updateStats(updated);
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    if (loading) return <DashboardSkeleton />;

    return (
        <div className="max-w-7xl mx-auto space-y-8">

            {/* USER HEADER */}
            <div className="flex items-center gap-4">
                <img
                    src={user?.avatar?.url || "https://via.placeholder.com/100"}
                    className="w-14 h-14 rounded-full border border-white/10"
                />
                <div>
                    <h1 className="text-white text-lg font-semibold">
                        {user?.fullname}
                    </h1>
                    <p className="text-white/40 text-sm">
                        @{user?.username}
                    </p>
                </div>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard title="Videos" value={stats.totalVideos} />
                <StatCard title="Views" value={stats.totalViews} />
                <StatCard title="Likes" value={stats.totalLikes} />
            </div>

            {/* VIDEOS */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-white font-semibold">
                        Your Videos
                    </h2>

                    <button
                        onClick={fetchDashboard}
                        className="text-xs text-white/40 hover:text-white"
                    >
                        Refresh
                    </button>
                </div>

                {videos.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-white/40">
                        <p>No videos uploaded yet</p>
                        <button
                            onClick={() => window.location.href = "/upload"}
                            className="mt-2 text-orange-400 hover:underline text-sm"
                        >
                            Upload your first video
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {videos.map((v) => (
                            <VideoCard
                                key={v._id}
                                video={v}
                                isOwner={true}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}