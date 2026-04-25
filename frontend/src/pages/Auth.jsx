import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { motion } from "framer-motion";

/* ✅ FIXED Field Component with Eye Toggle */
const Field = ({ label, name, type = "text", value, onChange, error }) => {
    const [show, setShow] = useState(false);
    const isPassword = type === "password";

    return (
        <div className="mb-4 relative">
            <label className="text-[11px] text-white/40 mb-1 block uppercase tracking-wide">
                {label}
            </label>

            <input
                name={name}
                type={isPassword && show ? "text" : type}
                value={value}
                onChange={onChange}
                className={`w-full px-4 py-2.5 rounded-xl bg-[#0f1115] border text-sm text-white pr-10 outline-none transition
                ${error ? "border-red-500" : "border-white/10 focus:border-orange-500/60"}`}
            />

            {/* 👁️ Eye Toggle */}
            {isPassword && (
                <button
                    type="button"
                    onClick={() => setShow(prev => !prev)}
                    className="absolute right-3 top-9 text-white/40 hover:text-white"
                >
                    {show ? "🙈" : "👁️"}
                </button>
            )}

            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
        </div>
    );
};

export default function Auth() {
    const navigate = useNavigate();

    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        fullName: "",
        username: "",
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({});
    const [toast, setToast] = useState(null);

    /* Handle Input */
    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    /* Validation */
    const validate = () => {
        let newErrors = {};

        if (!form.email.includes("@")) newErrors.email = "Invalid email";
        if (form.password.length < 6)
            newErrors.password = "Min 6 characters required";

        if (!isLogin) {
            if (!form.username) newErrors.username = "Username required";
            if (!form.fullName) newErrors.fullName = "Full name required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /* Toast */
    const showToast = (text, ok = true) => {
        setToast({ text, ok });
        setTimeout(() => setToast(null), 2500);
    };

    /* Submit */
    const handleSubmit = async () => {
        if (!validate()) return;

        try {
            setLoading(true);

            if (isLogin) {
                const res = await api.post("/users/login", {
                    email: form.email,
                    password: form.password,
                });

                localStorage.setItem("token", res.data.data.accessToken);
                localStorage.setItem("user", JSON.stringify(res.data.data.user));

                showToast("Login successful 🚀");
                setTimeout(() => navigate("/"), 1000);
            } else {
                await api.post("/users/register", form);

                showToast("Account created 🎉");
                setIsLogin(true);
            }
        } catch (err) {
            showToast(
                err.response?.data?.message || "Something went wrong",
                false
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f1115] flex items-center justify-center p-6 relative overflow-hidden">

            {/* Toast */}
            {toast && (
                <div className={`fixed top-6 right-6 px-4 py-2 rounded-xl text-sm shadow-lg
                ${toast.ok ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                    {toast.text}
                </div>
            )}

            {/* Glow */}
            <div className="absolute w-96 h-96 bg-orange-500 blur-[140px] opacity-[0.03] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

            <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-5xl backdrop-blur-xl bg-white/3 border border-white/10 rounded-3xl shadow-2xl flex overflow-hidden"
            >

                {/* LEFT */}
                <div className="hidden lg:flex flex-col justify-between flex-1 p-12 border-r border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center text-white font-bold">
                            V
                        </div>
                        <span className="text-white text-xl font-semibold">Vynqo</span>
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

                    <p className="text-white/25 text-xs">Join creators worldwide</p>
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
                            className={`flex-1 py-2 rounded-lg text-sm ${isLogin ? "bg-white/10 text-white" : "text-white/40"}`}
                        >
                            Sign in
                        </button>

                        <button
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-2 rounded-lg text-sm ${!isLogin ? "bg-white/10 text-white" : "text-white/40"}`}
                        >
                            Create account
                        </button>
                    </div>

                    {/* Fields */}
                    {!isLogin && (
                        <>
                            <Field label="Full name" name="fullName" value={form.fullName} onChange={handleChange} error={errors.fullName} />
                            <Field label="Username" name="username" value={form.username} onChange={handleChange} error={errors.username} />
                        </>
                    )}

                    <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} />
                    <Field label="Password" name="password" type="password" value={form.password} onChange={handleChange} error={errors.password} />

                    {/* Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="mt-2 py-3 rounded-xl bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white transition"
                    >
                        {loading ? "Processing..." : isLogin ? "Sign in" : "Create account"}
                    </button>

                    {/* Footer */}
                    <p className="text-center text-xs text-white/30 mt-6">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
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