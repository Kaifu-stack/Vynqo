import { useState } from "react";
import api from "../api/axios";

export default function UploadVideo() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const [videoFile, setVideoFile] = useState(null);
    const [thumbnail, setThumbnail] = useState(null);

    const [videoPreview, setVideoPreview] = useState(null);
    const [thumbPreview, setThumbPreview] = useState(null);

    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(false);

    //  FILE SIZE LIMITS
    const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB
    const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

    // 🎥 Video handler
    const handleVideoChange = (file) => {
        if (!file) return;

        if (file.size > MAX_VIDEO_SIZE) {
            alert("Video must be under 50MB");
            return;
        }

        setVideoFile(file);
        setVideoPreview(URL.createObjectURL(file));
    };

    //  Thumbnail handler
    const handleThumbnailChange = (file) => {
        if (!file) return;

        if (file.size > MAX_IMAGE_SIZE) {
            alert("Thumbnail must be under 5MB");
            return;
        }

        setThumbnail(file);
        setThumbPreview(URL.createObjectURL(file));
    };

    //  Upload
    const handleUpload = async (e) => {
        e.preventDefault();

        if (!videoFile || !thumbnail) {
            alert("Select video & thumbnail");
            return;
        }

        try {
            setLoading(true);
            setProgress(0);

            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            formData.append("videoFile", videoFile);
            formData.append("thumbnail", thumbnail);

            await api.post("/videos/publish-video", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                onUploadProgress: (e) => {
                    const percent = Math.round(
                        (e.loaded * 100) / e.total
                    );
                    setProgress(percent);
                },
            });

            alert("Upload successful!");

            // reset
            setTitle("");
            setDescription("");
            setVideoFile(null);
            setThumbnail(null);
            setVideoPreview(null);
            setThumbPreview(null);
            setProgress(0);

        } catch (err) {
            console.error(err);
            alert("Upload failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-[#0a0a0f] text-white">

            <form
                onSubmit={handleUpload}
                className="bg-black/40 backdrop-blur-md p-6 rounded-xl w-full max-w-lg shadow-lg border border-white/10 space-y-4"
            >
                <h1 className="text-xl font-bold text-center text-orange-400">
                    Upload Video
                </h1>

                {/* Title */}
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 rounded bg-black/40 border border-orange-500/20 focus:ring-2 focus:ring-orange-500 outline-none"
                />

                {/* Description */}
                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2 rounded bg-black/40 border border-orange-500/20 focus:ring-2 focus:ring-orange-500 outline-none"
                />

                {/* Video Upload */}
                <div>
                    <label className="text-sm text-orange-300">Video File</label>
                    <input
                        type="file"
                        accept="video/*"
                        onChange={(e) =>
                            handleVideoChange(e.target.files[0])
                        }
                        className="w-full mt-1 text-sm"
                    />
                </div>

                {/*  Video Preview */}
                {videoPreview && (
                    <video
                        src={videoPreview}
                        controls
                        className="w-full rounded mt-2 border border-orange-500/20"
                    />
                )}

                {/* Thumbnail Upload */}
                <div>
                    <label className="text-sm text-orange-300">Thumbnail</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                            handleThumbnailChange(e.target.files[0])
                        }
                        className="w-full mt-1 text-sm"
                    />
                </div>

                {/*  Thumbnail Preview */}
                {thumbPreview && (
                    <img
                        src={thumbPreview}
                        className="w-full h-40 object-cover rounded border border-orange-500/20"
                        alt="thumbnail preview"
                    />
                )}

                {/*  Progress Bar */}
                {loading && (
                    <>
                        <div className="w-full bg-gray-800 rounded h-3 overflow-hidden">
                            <div
                                className="bg-linear-to-r from-orange-500 to-red-500 h-full transition-all"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <p className="text-sm text-center text-orange-300">
                            {progress}% uploaded
                        </p>
                    </>
                )}

                {/* Upload Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-linear-to-r from-orange-500 to-red-500 py-2 rounded hover:scale-105 transition"
                >
                    {loading ? "Uploading..." : "Upload"}
                </button>
            </form>
        </div>
    );
}