import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function EditVideo() {
    const { videoId } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        const fetchVideo = async () => {
            const res = await api.get(`/videos/video/${videoId}`);

            setTitle(res.data.data.title);
            setDescription(res.data.data.description);
        };

        fetchVideo();
    }, [videoId]);

    const handleUpdate = async () => {
        try {
            await api.patch(`/videos/video/${videoId}`, {
                title,
                description
            });

            alert("Updated!");
            navigate("/dashboard");

        } catch (err) {
            console.error(err);
            alert("Update failed");
        }
    };

    return (
        <div className="max-w-lg mx-auto mt-10 bg-[#111117] p-6 rounded-xl border border-white/10">

            <h2 className="text-white mb-4">Edit Video</h2>

            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full mb-3 p-2 bg-black/30 text-white"
            />

            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full mb-3 p-2 bg-black/30 text-white"
            />

            <button
                onClick={handleUpdate}
                className="bg-orange-500 px-4 py-2 rounded text-white"
            >
                Save Changes
            </button>
        </div>
    );
}