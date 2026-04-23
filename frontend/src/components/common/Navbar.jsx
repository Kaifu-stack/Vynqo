import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();

    const token = localStorage.getItem("token");

    //  Safe user parsing (prevents crash)
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);

    const dropdownRef = useRef();

    // 🔥 Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        navigate(`/?search=${query}`);
        setQuery("");
    };

    const navLink = (path) =>
        `px-3 py-1.5 rounded-lg text-sm transition ${location.pathname === path
            ? "text-white bg-white/10"
            : "text-white/50 hover:text-white hover:bg-white/5"
        }`;

    return (
        <motion.nav
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between px-6 py-3 bg-[#0a0a0f]/90 border-b border-white/5 backdrop-blur-md sticky top-0 z-50"
        >
            {/* Logo */}
            <div
                onClick={() => navigate("/")}
                className="flex items-center gap-2 cursor-pointer"
            >
                <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white font-bold">
                    V
                </div>
                <span className="text-white font-semibold text-lg">
                    Vynqo
                </span>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex w-full max-w-xl mx-6">
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search videos..."
                    className="flex-1 px-4 py-2 bg-[#111117] border border-white/10 text-white rounded-l-full outline-none focus:border-orange-500/50"
                />
                <button className="bg-orange-500 px-4 rounded-r-full hover:bg-orange-600">
                    🔍
                </button>
            </form>

            {/* Right */}
            <div className="flex items-center gap-3">

                {/* Always visible */}
                <Link to="/" className={navLink("/")}>
                    Home
                </Link>

                {/* Protected */}
                {token && (
                    <>
                        <Link to="/dashboard" className={navLink("/dashboard")}>
                            Dashboard
                        </Link>

                        <Link to="/playlists" className={navLink("/playlists")}>
                            Playlists
                        </Link>

                        <Link
                            to="/upload"
                            className="bg-orange-500 px-3 py-1.5 rounded text-white hover:bg-orange-600 transition"
                        >
                            Upload
                        </Link>
                    </>
                )}

                {/* Auth */}
                {!token ? (
                    <button
                        onClick={() => navigate("/login")}
                        className="bg-orange-500 px-4 py-1.5 rounded text-white hover:bg-orange-600 transition"
                    >
                        Sign in
                    </button>
                ) : (
                    <div className="relative" ref={dropdownRef}>
                        {/* Avatar */}
                        <img
                            src={
                                user?.avatar?.url ||
                                "https://via.placeholder.com/40"
                            }
                            onClick={() => setOpen(!open)}
                            className="w-8 h-8 rounded-full cursor-pointer border border-white/10 hover:scale-105 transition"
                        />

                        {/* Dropdown */}
                        {open && (
                            <div className="absolute right-0 mt-2 w-44 bg-[#111117] border border-white/10 rounded-xl shadow-lg overflow-hidden animate-fadeIn">

                                <button
                                    onClick={() => {
                                        if (!user?.username) {
                                            console.error("Username missing");
                                            return;
                                        }
                                        navigate(`/profile/${user.username}`);
                                        setOpen(false);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-white/70 hover:bg-white/5"
                                >
                                    Profile
                                </button>

                                <button
                                    onClick={() => {
                                        navigate("/profile/edit");
                                        setOpen(false);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-white/70 hover:bg-white/5"
                                >
                                    Edit Profile
                                </button>

                                <button
                                    onClick={() => {
                                        localStorage.removeItem("token");
                                        localStorage.removeItem("user");
                                        navigate("/login");
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/5"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </motion.nav>
    );
}