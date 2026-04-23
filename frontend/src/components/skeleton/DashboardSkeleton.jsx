export default function DashboardSkeleton() {
    return (
        <div className="animate-pulse space-y-6">

            <div className="flex gap-4 items-center">
                <div className="w-14 h-14 bg-white/10 rounded-full" />
                <div className="space-y-2">
                    <div className="w-32 h-4 bg-white/10 rounded" />
                    <div className="w-24 h-3 bg-white/10 rounded" />
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-20 bg-white/10 rounded-xl" />
                ))}
            </div>

            <div className="grid grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-40 bg-white/10 rounded-xl" />
                ))}
            </div>
        </div>
    );
}