import { useEffect, useState } from "react";
import api from "../api/axios";
import CreateTweet from "../components/tweet/CreateTweet";
import TweetCard from "../components/tweet/TweetCard";
import { socket } from "../socket";

export default function Tweets() {
    const [tweets, setTweets] = useState([]);

    //  Fetch tweets
    const fetchTweets = async () => {
        try {
            const res = await api.get(`/tweets`);

            //  clean data
            const safeTweets = (res.data.data || []).filter(
                t => t && t._id && t.owner
            );

            setTweets(safeTweets);

        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchTweets();
    }, []);

    //  REAL-TIME
    useEffect(() => {

        //  NEW TWEET
        const handleNewTweet = (tweet) => {
            if (!tweet || !tweet._id || !tweet.owner) return;

            setTweets(prev => {
                const exists = prev.some(t => t._id === tweet._id);
                if (exists) return prev;

                return [tweet, ...prev];
            });
        };

        //  LIKE UPDATE
        const handleLike = ({ tweetId, likesCount }) => {
            if (!tweetId) return;

            setTweets(prev =>
                prev.map(t =>
                    t._id === tweetId
                        ? { ...t, likesCount }
                        : t
                )
            );
        };

        //  REGISTER
        socket.on("new-tweet", handleNewTweet);
        socket.on("tweet-liked", handleLike);

        //  CLEANUP (VERY IMPORTANT)
        return () => {
            socket.off("new-tweet", handleNewTweet);
            socket.off("tweet-liked", handleLike);
        };

    }, []);

    return (
        <div className="max-w-xl mx-auto mt-6">

            {/*  CREATE */}
            <CreateTweet
                onTweetCreated={(newTweet) => {
                    if (!newTweet || !newTweet._id || !newTweet.owner) return;

                    setTweets(prev => {
                        const exists = prev.some(t => t._id === newTweet._id);
                        if (exists) return prev;

                        return [newTweet, ...prev];
                    });
                }}
            />

            {/* LIST */}
            {tweets
                .filter(tweet => tweet && tweet._id && tweet.owner)
                .map((tweet) => (
                    <TweetCard
                        key={tweet._id}
                        tweet={tweet}
                        onDelete={(id) =>
                            setTweets(prev =>
                                prev.filter(t => t._id !== id)
                            )
                        }
                        onUpdate={(updated) =>
                            setTweets(prev =>
                                prev.map(t =>
                                    t._id === updated._id ? updated : t
                                )
                            )
                        }
                    />
                ))}

            {/* EMPTY */}
            {tweets.length === 0 && (
                <p className="text-center text-white/40 mt-10 text-sm">
                    No tweets yet 👀
                </p>
            )}
        </div>
    );
}