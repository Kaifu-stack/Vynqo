import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../api/axios";

export default function VideoCard({ video, isOwner = false, onDelete }) {
    const navigate = useNavigate();
    const [deleting, setDeleting] = useState(false);

    // 🗑 Delete
    const handleDelete = async (e) => {
        e.stopPropagation();

        const confirmDelete = window.confirm("Delete this video?");
        if (!confirmDelete) return;

        try {
            setDeleting(true);

            await api.delete(`/videos/video/${video._id}`);

            onDelete && onDelete(video._id);
        } catch (err) {
            console.error(err);
            alert("Delete failed");
        } finally {
            setDeleting(false);
        }
    };

    // ✏️ Edit
    const handleEdit = (e) => {
        e.stopPropagation();
        navigate(`/edit-video/${video._id}`);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ duration: 0.35 }}
            onClick={() => navigate(`/video/${video._id}`)}
            className="bg-[#111117] border border-white/5 rounded-2xl overflow-hidden cursor-pointer hover:border-orange-500/30 hover:shadow-lg hover:shadow-orange-500/10 transition-all group"
        >

            {/* Thumbnail */}
            <div className="relative overflow-hidden">
                <img
                    src={video.thumbnail?.url || "https://via.placeholder.com/300"}
                    alt={video.title}
                    className="w-full h-44 object-cover group-hover:scale-[1.05] transition-transform duration-300"
                />

                <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition" />

                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-sm">
                    {video.duration
                        ? `${Math.floor(video.duration / 60)}:${String(
                            Math.floor(video.duration % 60)
                        ).padStart(2, "0")}`
                        : "--"}
                </div>
            </div>

            {/* Content */}
            <div className="p-3 flex gap-3">
                <img
                    src={video.owner?.avatar?.url || "https://via.placeholder.com/40"}
                    className="w-9 h-9 rounded-full object-cover border border-white/10"
                    alt="avatar"
                />

                <div className="flex-1 min-w-0">
                    <h2 className="text-sm font-semibold text-white/90 line-clamp-2 mb-1">
                        {video.title}
                    </h2>

                    <p className="text-xs text-white/40">
                        {video.owner?.username || "Unknown"}
                    </p>

                    <p className="text-xs text-white/30">
                        {video.views} views
                    </p>

                    {/* OWNER ACTIONS */}
                    {isOwner && (
                        <div className="flex gap-2 mt-2">
                            <button
                                onClick={handleEdit}
                                className="text-xs px-3 py-1 bg-white/10 rounded hover:bg-white/20"
                            >
                                Edit
                            </button>

                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="text-xs px-3 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30"
                            >
                                {deleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}