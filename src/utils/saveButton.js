"use client";
import { useState } from "react";
import axiosInstance from "@/services/axiosInstance";
import { useAuth } from "@/common/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const SaveButton = ({ blogId, initialSaved = false }) => {
    const { user }  = useAuth();
    const router    = useRouter();
    const [saved,   setSaved]   = useState(initialSaved);
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!user) {
            toast.error("Please login to save blogs");
            router.push("/login");
            return;
        }

        const wasSaved = saved;
        setSaved(!saved);

        setLoading(true);
        try {
            const response = await axiosInstance.post(`/blog/save/${blogId}`);
            if (!response.data?.success) {
                setSaved(wasSaved);
            } else {
                toast.success(response.data.message);
            }
        } catch (error) {
            setSaved(wasSaved);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleSave}
            disabled={loading}
            className={`save-btn ${saved ? "save-btn--saved" : ""}`}
            aria-label={saved ? "Unsave blog" : "Save blog"}
        >
            <svg
                viewBox="0 0 24 24"
                fill={saved ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                width="16"
                height="16"
            >
                <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
            </svg>
        </button>
    );
};

export default SaveButton;