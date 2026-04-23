import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { motion } from "framer-motion";

export default function Auth() {
    const navigate = useNavigate();

    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState(null);
    const [form, setForm] = useState({
        fullName: "",
        username: "",
        email: "",
        password: ""
    });

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async () => {
        try {
            setLoading(true);
            setMsg(null);

            if (isLogin) {
                const res = await api.post("/users/login", {
                    email: form.email,
                    password: form.password,
                });

                localStorage.setItem("token", res.data.data.accessToken);
                localStorage.setItem("user", JSON.stringify(res.data.data.user));

                setMsg({ text: "Signed in! Redirecting…", ok: true });
                setTimeout(() => navigate("/"), 1000);
            } else {
                await api.post("/users/register", {
                    username: form.username,
                    email: form.email,
                    password: form.password,
                    fullName: form.fullName,
                });

                setMsg({ text: "Account created! Please sign in.", ok: true });
                setTimeout(() => setIsLogin(true), 1200);
            }
        } catch (err) {
            setMsg({
                text: err.response?.data?.message || "Something went wrong",
                ok: false,
            });
        } finally {
            setLoading(false);
        }
    };

    const Field = ({ label, name, type = "text", placeholder }) => (
        <div className="mb-3">
            <label className="text-[11px] text-white/40 mb-1 block uppercase tracking-wide">
                {label}
            </label>
            <input
                name={name}
                type={type}
                placeholder={placeholder}
                value={form[name]}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-[#0f1115] border border-white/10 text-sm text-white placeholder-white/30 outline-none focus:border-orange-500/60 transition"
            />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0f1115] flex items-center justify-center p-6 relative overflow-hidden">

            {/* Glow */}
            <div className="absolute w-96 h-96 bg-orange-500 blur-[140px] opacity-[0.03] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

            {/* Animated Card */}
            <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-5xl backdrop-blur-xl bg-white/3 border border-white/10 rounded-3xl shadow-2xl flex overflow-hidden"
            >

                {/* LEFT */}
                <div className="hidden lg:flex flex-col justify-between flex-1 p-12 border-r border-white/10">

                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center text-white font-bold">
                            V
                        </div>
                        <span className="text-white text-xl font-semibold">
                            Vynqo
                        </span>
                    </div>

                    <div>
                        <h1 className="text-5xl font-bold text-white mb-4">
                            Watch,<br />share,<br />
                            <span className="text-orange-400">go viral.</span>
                        </h1>

                        <p className="text-white/40 text-sm max-w-md">
                            Post videos, build your audience, and grow faster.
                        </p>
                    </div>

                    <p className="text-white/25 text-xs">
                        Join creators worldwide
                    </p>
                </div>

                {/* RIGHT */}
                <div className="w-full lg:w-105 p-10 flex flex-col justify-center">

                    <h2 className="text-white text-2xl font-bold mb-1">
                        {isLogin ? "Welcome back" : "Create account"}
                    </h2>

                    <p className="text-white/40 text-sm mb-6">
                        {isLogin ? "Sign in to your account" : "Start your journey"}
                    </p>

                    {/* Tabs */}
                    <div className="flex bg-white/5 rounded-xl p-1 mb-6">
                        <button
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-2 rounded-lg text-sm ${isLogin ? "bg-white/10 text-white" : "text-white/40"
                                }`}
                        >
                            Sign in
                        </button>

                        <button
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-2 rounded-lg text-sm ${!isLogin ? "bg-white/10 text-white" : "text-white/40"
                                }`}
                        >
                            Create account
                        </button>
                    </div>

                    {/* Alert */}
                    {msg && (
                        <div className={`text-xs px-3 py-2 rounded mb-4 ${msg.ok
                            ? "bg-green-500/10 text-green-400"
                            : "bg-red-500/10 text-red-400"
                            }`}>
                            {msg.text}
                        </div>
                    )}

                    {/* Fields */}
                    {!isLogin && (
                        <>
                            <Field label="Full name" name="fullName" />
                            <Field label="Username" name="username" />
                        </>
                    )}

                    <Field label="Email" name="email" type="email" />
                    <Field label="Password" name="password" type="password" />

                    {/* Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="mt-3 py-3 rounded-xl bg-orange-500 hover:bg-orange-400 text-white transition"
                    >
                        {loading
                            ? "Please wait…"
                            : isLogin
                                ? "Sign in"
                                : "Create account"}
                    </button>

                    {/* Footer */}
                    <p className="text-center text-xs text-white/30 mt-6">
                        {isLogin
                            ? "Don't have an account?"
                            : "Already have an account?"}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-orange-400 ml-1"
                        >
                            {isLogin ? "Sign up" : "Sign in"}
                        </button>
                    </p>
                </div>

            </motion.div>
        </div>
    );
}