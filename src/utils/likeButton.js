"use client";
import { useState } from "react";
import axiosInstance from "@/services/axiosInstance";
import { useAuth } from "@/common/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const LikeButton = ({ blogId, initialLiked = false, initialCount = 0 }) => {
    const { user } = useAuth();
    const router = useRouter();

    const [liked,      setLiked]      = useState(initialLiked);
    const [likesCount, setLikesCount] = useState(initialCount);
    const [loading,    setLoading]    = useState(false);

    const handleLike = async () => {
        if (!user) {
            toast.error("Please login to like blogs");
            router.push("/login");
            return;
        }

        setLoading(true);

        const wasLiked = liked;
        setLiked(!liked);
        setLikesCount(prev => wasLiked ? prev - 1 : prev + 1);

        try {
            const response = await axiosInstance.post(`/blog/${blogId}/like`);
            if (!response.data?.success) {
                setLiked(wasLiked);
                setLikesCount(prev => wasLiked ? prev + 1 : prev - 1);
            }
        } catch (error) {
            setLiked(wasLiked);
            setLikesCount(prev => wasLiked ? prev + 1 : prev - 1);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleLike}
            disabled={loading}
            className={`like-btn ${liked ? "like-btn--liked" : ""}`}
        >
            <svg
                viewBox="0 0 24 24"
                fill={liked ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                width="18"
                height="18"
            >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {likesCount}
        </button>
    );
};

export default LikeButton;