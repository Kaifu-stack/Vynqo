import Navbar from "../components/common/Navbar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white relative">

            {/* Subtle ambient glow */}
            <div className="fixed top-0 left-0 w-125 h-125 bg-orange-500/10 blur-[120px] rounded-full" />
            <div className="fixed bottom-0 right-0 w-100 h-100 bg-rose-500/10 blur-[120px] rounded-full" />

            <Navbar />

            <main className="px-6 py-6 max-w-7xl mx-auto">
                <Outlet />
            </main>
        </div>
    );
}