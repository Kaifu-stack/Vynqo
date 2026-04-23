import { useEffect, useState } from "react";
import api from "../api/axios";

export default function EditProfile() {
    const [user, setUser] = useState(null);

    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");

    const [avatar, setAvatar] = useState(null);
    const [cover, setCover] = useState(null);

    const [avatarPreview, setAvatarPreview] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    //  Fetch user
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get("/users/current-user");

                setUser(res.data.data);
                setFullname(res.data.data.fullname);
                setEmail(res.data.data.email);

                setAvatarPreview(res.data.data.avatar?.url);
                setCoverPreview(res.data.data.coverImage?.url);

            } catch (err) {
                console.error(err);
            }
        };

        fetchUser();
    }, []);

    //  Avatar change
    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setAvatar(file);
        setAvatarPreview(URL.createObjectURL(file));
    };

    //  Cover change
    const handleCoverChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setCover(file);
        setCoverPreview(URL.createObjectURL(file));
    };

    //  Upload Avatar
    const uploadAvatar = async () => {
        if (!avatar) return;

        try {
            setUploading(true);

            const formData = new FormData();
            formData.append("avatar", avatar);

            const res = await api.patch("/users/avatar", formData);

            localStorage.setItem("user", JSON.stringify(res.data.data));
            setUser(res.data.data);

        } catch (err) {
            console.error(err);
            alert("Avatar upload failed");
        } finally {
            setUploading(false);
        }
    };

    // Upload Cover
    const uploadCover = async () => {
        if (!cover) return;

        try {
            setUploading(true);

            const formData = new FormData();
            formData.append("coverImage", cover);

            const res = await api.patch("/users/cover-Image", formData);

            localStorage.setItem("user", JSON.stringify(res.data.data));
            setUser(res.data.data);

        } catch (err) {
            console.error(err);
            alert("Cover upload failed");
        } finally {
            setUploading(false);
        }
    };

    // Update text fields
    const handleUpdate = async () => {
        try {
            setLoading(true);

            const res = await api.patch("/users/update-account", {
                fullname,
                email
            });

            localStorage.setItem("user", JSON.stringify(res.data.data));
            setUser(res.data.data);

            alert("Profile updated");

        } catch (err) {
            console.error(err);
            alert("Update failed");
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return <p className="text-white/40 text-center mt-10">Loading...</p>;
    }

    return (
        <div className="max-w-3xl mx-auto mt-8 space-y-6">

            {/* COVER */}
            <div className="relative">
                <img
                    src={coverPreview || "https://via.placeholder.com/1200x300"}
                    className="w-full h-40 object-cover rounded-xl border border-white/10"
                />

                <label className="absolute bottom-3 right-3 bg-black/70 px-3 py-1 text-xs rounded cursor-pointer">
                    Change Cover
                    <input type="file" hidden onChange={handleCoverChange} />
                </label>
            </div>

            {/* AVATAR */}
            <div className="flex items-center gap-4">

                <div className="relative">
                    <img
                        src={avatarPreview || "https://via.placeholder.com/100"}
                        className="w-20 h-20 rounded-full border-2 border-orange-500"
                    />

                    <label className="absolute bottom-0 right-0 bg-orange-500 w-6 h-6 rounded-full flex items-center justify-center text-xs cursor-pointer">
                        ✎
                        <input type="file" hidden onChange={handleAvatarChange} />
                    </label>
                </div>

                <div>
                    <h2 className="text-white font-semibold">{user.fullname}</h2>
                    <p className="text-white/40 text-sm">@{user.username}</p>
                </div>
            </div>

            {/* MEDIA ACTIONS */}
            <div className="flex gap-3">
                <button
                    onClick={uploadAvatar}
                    className="bg-orange-500 px-4 py-2 rounded text-white"
                >
                    {uploading ? "Uploading..." : "Save Avatar"}
                </button>

                <button
                    onClick={uploadCover}
                    className="bg-white/10 px-4 py-2 rounded text-white"
                >
                    Save Cover
                </button>
            </div>

            {/* PROFILE FORM */}
            <div className="bg-[#111117] p-6 rounded-2xl border border-white/10">

                <input
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    className="w-full mb-4 p-3 bg-[#0f1115] border border-white/10 rounded-lg text-white"
                />

                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full mb-4 p-3 bg-[#0f1115] border border-white/10 rounded-lg text-white"
                />

                <button
                    onClick={handleUpdate}
                    disabled={loading}
                    className="w-full bg-orange-500 py-3 rounded-lg text-white"
                >
                    {loading ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </div>
    );
}