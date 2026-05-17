// src/pages/WakeupScreen.jsx

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function WakeupScreen() {
    const navigate = useNavigate();

    const [status, setStatus] = useState("Waking up servers...");
    const [dots, setDots] = useState("");

    // Animated dots
    useEffect(() => {
        const dotInterval = setInterval(() => {
            setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
        }, 500);

        return () => clearInterval(dotInterval);
    }, []);

    // Warmup backend
    useEffect(() => {
        const warmup = async () => {
            try {
                setStatus("Connecting to Vynqo servers");

                // 🔥 ping backend
                await api.get("/healthcheck");

                setStatus("Launching experience");

                setTimeout(() => {
                    navigate("/");
                }, 1200);

            } catch (err) {
                console.error(err);

                setStatus("Still waking servers");

                // retry
                setTimeout(warmup, 4000);
            }
        };

        warmup();
    }, [navigate]);

    return (
        <div className="min-h-screen bg-[#09090d] text-white overflow-hidden relative flex items-center justify-center px-6">

            {/* Background Glow */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-orange-500/10 blur-[140px] rounded-full" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-rose-500/10 blur-[140px] rounded-full" />

            <div className="relative z-10 text-center max-w-2xl">

                {/* Logo */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7 }}
                    className="flex items-center justify-center gap-3 mb-8"
                >
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center shadow-2xl shadow-orange-500/30">
                        <span className="text-2xl font-bold">V</span>
                    </div>

                    <h1 className="text-5xl font-bold tracking-tight">
                        Vynqo
                    </h1>
                </motion.div>

                {/* Heading */}
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl md:text-4xl font-semibold mb-4"
                >
                    The next-generation video social platform
                </motion.h2>

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-white/50 text-lg leading-relaxed max-w-xl mx-auto"
                >
                    Upload videos, interact in real-time, and build your creator
                    presence — all in one seamless experience.
                </motion.p>

                {/* Loader */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-12 flex flex-col items-center"
                >
                    <div className="w-12 h-12 rounded-full border-2 border-orange-500 border-t-transparent animate-spin mb-4" />

                    <p className="text-white/60 text-sm tracking-wide">
                        {status}
                        {dots}
                    </p>

                    <p className="text-white/25 text-xs mt-3">
                        Free servers may take a few seconds to wake up.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}