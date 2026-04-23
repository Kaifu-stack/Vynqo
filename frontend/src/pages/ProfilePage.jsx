import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import VideoCard from "../components/video/VideoCard";

export default function ProfilePage() {
    const { username } = useParams();

    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get(`/users/channel/${username}`);
                setProfile(res.data.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchProfile();
    }, [username]);

    if (!profile) return <p className="text-white">Loading...</p>;

    return (
        <div className="max-w-5xl mx-auto">

            {/* Cover */}
            <div className="h-40 bg-[#111117] rounded-xl overflow-hidden mb-4">
                {profile.coverImage?.url && (
                    <img src={profile.coverImage.url} className="w-full h-full object-cover" />
                )}
            </div>

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <img
                        src={profile.avatar?.url}
                        className="w-16 h-16 rounded-full"
                    />

                    <div>
                        <h1 className="text-xl text-white font-bold">
                            {profile.fullname}
                        </h1>
                        <p className="text-white/40 text-sm">
                            @{profile.username}
                        </p>

                        <p className="text-white/30 text-xs mt-1">
                            {profile.subscribersCount} subscribers
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}