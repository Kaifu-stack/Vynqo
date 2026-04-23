export default function StatCard({ title, value }) {
    return (
        <div className="bg-[#111117] border border-white/5 rounded-xl p-4">
            <p className="text-white/40 text-sm">{title}</p>
            <h2 className="text-white text-xl font-semibold mt-1">
                {value}
            </h2>
        </div>
    );
}