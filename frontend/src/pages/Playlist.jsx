import { useEffect, useState } from "react";
import api from "../api/axios";
import PlaylistCard from "../components/playlist/PlaylistCard";

export default function Playlists() {
    const [playlists, setPlaylists] = useState([]);

    useEffect(() => {
        api.get("/playlists/me").then((res) => {
            setPlaylists(res.data.data);
        });
    }, []);

    return (
        <div className="grid grid-cols-3 gap-4">
            {playlists.map((p) => (
                <PlaylistCard key={p._id} playlist={p} />
            ))}
        </div>
    );
}