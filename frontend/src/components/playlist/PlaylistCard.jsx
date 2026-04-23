export default function PlaylistCard({ playlist }) {
    return (
        <div className="bg-[#111117] border border-white/5 rounded-2xl p-4 hover:border-orange-500/30 hover:shadow-md hover:shadow-orange-500/10 transition-all duration-300 cursor-pointer group">

            {/* Thumbnail */}
            <div className="w-full h-28 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-3 relative overflow-hidden">

                <svg
                    width="26"
                    height="26"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="text-white/30"
                >
                    <rect x="2" y="7" width="20" height="15" rx="2" />
                    <polyline points="17 2 12 7 7 2" />
                </svg>

                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded">
                    {playlist.videos?.length || 0} videos
                </div>
            </div>

            <h2 className="text-sm font-semibold text-white/90 mb-1 group-hover:text-white transition">
                {playlist.name}
            </h2>

            {playlist.description && (
                <p className="text-xs text-white/40 line-clamp-2">
                    {playlist.description}
                </p>
            )}
        </div>
    );
}