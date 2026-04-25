import { useEffect, useState } from "react";
import api from "../api/axios";
import PlaylistCard from "../components/playlist/PlaylistCard";

export default function Playlists() {
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPlaylists = async () => {
        try {
            setLoading(true);
            const res = await api.get("/playlists/me");
            setPlaylists(res.data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlaylists();
    }, []);

    return (
        <div className="max-w-6xl mx-auto">

            <h1 className="text-white text-lg font-semibold mb-4">
                Your Playlists
            </h1>

            {loading && <p className="text-white/40">Loading...</p>}

            {!loading && playlists.length === 0 && (
                <p className="text-white/40">No playlists yet</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {playlists.map((p) => (
                    <PlaylistCard key={p._id} playlist={p} />
                ))}
            </div>
        </div>
    );
}