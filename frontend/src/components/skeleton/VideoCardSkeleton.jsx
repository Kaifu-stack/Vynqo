export default function VideoCardSkeleton() {
    return (
        <div className="bg-[#111117] border border-white/5 rounded-2xl overflow-hidden animate-pulse">

            {/* Thumbnail */}
            <div className="w-full h-44 bg-white/10" />

            {/* Content */}
            <div className="p-3 flex gap-3">

                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-white/10" />

                <div className="flex-1 space-y-2">

                    {/* Title */}
                    <div className="h-3 bg-white/10 rounded w-3/4" />
                    <div className="h-3 bg-white/10 rounded w-1/2" />

                    {/* Username */}
                    <div className="h-2 bg-white/10 rounded w-1/3" />

                    {/* Views */}
                    <div className="h-2 bg-white/10 rounded w-1/4" />

                    {/* Buttons */}
                    <div className="flex gap-2 mt-2">
                        <div className="h-6 w-12 bg-white/10 rounded" />
                        <div className="h-6 w-16 bg-white/10 rounded" />
                    </div>
                </div>
            </div>
        </div>
    );
}