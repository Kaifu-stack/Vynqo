import { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import VideoCard from "../components/video/VideoCard";
import VideoCardSkeleton from "../components/skeleton/VideoCardSkeleton";

export default function Home() {
    const [videos, setVideos] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const isFetching = useRef(false);

    const observer = useRef();

    //  GET SEARCH QUERY
    const [searchParams] = useSearchParams();
    const query = searchParams.get("query") || "";

    /*  RESET WHEN SEARCH CHANGES */
    useEffect(() => {
        setVideos([]);
        setPage(1);
        setHasMore(true);
    }, [query]);

    /*  FETCH VIDEOS */
    const fetchVideos = async (pageNum) => {
        if (isFetching.current) return;

        try {
            isFetching.current = true;
            setLoading(true);

            const res = await api.get(
                `/videos?page=${pageNum}&limit=8&query=${query}`
            );

            const newVideos = res.data.data.docs;

            setVideos((prev) => {
                const existingIds = new Set(prev.map((v) => v._id));
                const filtered = newVideos.filter(
                    (v) => !existingIds.has(v._id)
                );
                return [...prev, ...filtered];
            });

            if (pageNum >= res.data.data.totalPages) {
                setHasMore(false);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
            isFetching.current = false;
        }
    };

    /*  FETCH TRIGGER */
    useEffect(() => {
        fetchVideos(page);
    }, [page, query]);

    /* ♾️ INFINITE SCROLL */
    const lastVideoRef = useCallback(
        (node) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage((prev) => prev + 1);
                }
            });

            if (node) observer.current.observe(node);
        },
        [loading, hasMore]
    );

    return (
        <div className="max-w-7xl mx-auto animate-fadeIn">

            {/* HEADER */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-white/90 font-semibold text-base">
                    {query ? `Results for "${query}"` : "Recommended for you"}
                </h2>

                <span className="text-white/30 text-xs">
                    {videos.length} videos
                </span>
            </div>

            {/*  GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {videos.map((v, index) => {
                    if (videos.length === index + 1) {
                        return (
                            <div ref={lastVideoRef} key={v._id}>
                                <VideoCard video={v} />
                            </div>
                        );
                    }
                    return <VideoCard key={v._id} video={v} />;
                })}
            </div>

            {/*  LOADING */}
            {loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <VideoCardSkeleton key={i} />
                    ))}
                </div>
            )}

            {/*  NO RESULTS */}
            {!loading && videos.length === 0 && query && (
                <p className="text-center text-white/40 mt-10">
                    No results found for "{query}"
                </p>
            )}

            {/* 🎉 END */}
            {!hasMore && videos.length > 0 && (
                <p className="text-center text-white/30 text-sm mt-6">
                    You’ve reached the end 🎉
                </p>
            )}
        </div>
    );
}