"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axiosInstance from "@/services/axiosInstance";

const ViewCategory = () => {
    const router = useRouter();
    const { id } = useParams();
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchCategory = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get(`/category/${id}`);
            if (res.data.success) {
                setCategory(res.data.category);
            }
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to load category.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchCategory();
    }, [id]);

    return (
        <div className="cat-wrapper">
            {/* Header */}
            <div className="cat-header">
                <div>
                    <h1 className="cat-title">View Category</h1>
                    <p className="cat-subtitle">Category details</p>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                    <button
                        className="cat-btn cat-btn-ghost cat-btn-sm"
                        onClick={() => router.push("/admin/category")}
                    >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
                        </svg>
                        Back
                    </button>
                    {category && (
                        <button
                            className="cat-btn cat-btn-primary cat-btn-sm"
                            onClick={() => router.push(`/admin/category/${id}/edit`)}
                        >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                            Edit
                        </button>
                    )}
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="cat-alert cat-alert-error">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {error}
                </div>
            )}

            {/* Loading */}
            {loading && (
                <div className="cat-form-card">
                    <div className="cat-view-skeleton-row" />
                    <div className="cat-view-skeleton-row" style={{ width: "60%", marginTop: "14px" }} />
                    <div className="cat-view-skeleton-row" style={{ height: "72px", marginTop: "14px" }} />
                </div>
            )}

            {/* Detail Card */}
            {!loading && category && (
                <div className="cat-form-card">

                    {/* Status pill at top */}
                    <div className="cat-view-toprow">
                        <span className={`cat-badge ${category.isActive ? "cat-badge-active" : "cat-badge-inactive"}`}>
                            {category.isActive ? "Active" : "Inactive"}
                        </span>
                        <span className="cat-view-id">ID: {category._id}</span>
                    </div>

                    <div className="cat-view-divider" />

                    {/* Name */}
                    <div className="cat-view-field">
                        <span className="cat-view-field-label">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                            </svg>
                            Name
                        </span>
                        <span className="cat-view-field-value">{category.name}</span>
                    </div>

                    {/* Description */}
                    <div className="cat-view-field">
                        <span className="cat-view-field-label">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <line x1="17" y1="10" x2="3" y2="10" /><line x1="21" y1="6" x2="3" y2="6" /><line x1="21" y1="14" x2="3" y2="14" /><line x1="17" y1="18" x2="3" y2="18" />
                            </svg>
                            Description
                        </span>
                        <span className="cat-view-field-value">
                            {category.description?.trim() ? category.description : (
                                <span className="cat-view-empty">No description provided</span>
                            )}
                        </span>
                    </div>

                    {/* Created At */}
                    {category.createdAt && (
                        <div className="cat-view-field">
                            <span className="cat-view-field-label">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                                </svg>
                                Created
                            </span>
                            <span className="cat-view-field-value">
                                {new Date(category.createdAt).toLocaleDateString("en-IN", {
                                    day: "numeric", month: "long", year: "numeric",
                                })}
                            </span>
                        </div>
                    )}

                </div>
            )}
        </div>
    );
};

export default ViewCategory;