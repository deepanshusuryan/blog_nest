"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axiosInstance from "@/services/axiosInstance";

const EditCategory = () => {
    const router = useRouter();
    const { id } = useParams();
    const [form, setForm] = useState({ name: "", description: "" });
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Pre-fill form with existing data
    const fetchCategory = async () => {
        try {
            setFetching(true);
            const res = await axiosInstance.get(`/category/${id}`);
            if (res.data.success) {
                const { name, description } = res.data.category;
                setForm({ name: name || "", description: description || "" });
            }
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to load category.");
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        if (id) fetchCategory();
    }, [id]);

    const handleChange = (e) => {
        setError("");
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name.trim()) {
            setError("Category name is required.");
            return;
        }
        try {
            setLoading(true);
            setError("");
            const res = await axiosInstance.put(`/category/${id}`, {
                id,
                name: form.name,
                description: form.description,
            });
            if (res.data.success) {
                setSuccess("Category updated successfully!");
                setTimeout(() => router.push("/admin/category"), 1200);
            }
        } catch (err) {
            setError(err?.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="cat-wrapper">
            {/* Header */}
            <div className="cat-header">
                <div>
                    <h1 className="cat-title">Edit Category</h1>
                    <p className="cat-subtitle">Update the details below</p>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                    <button
                        className="cat-btn cat-btn-ghost cat-btn-sm"
                        onClick={() => router.push(`/admin/category/${id}`)}
                    >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
                        </svg>
                        Back
                    </button>
                </div>
            </div>

            {/* Fetch error */}
            {error && !fetching && (
                <div className="cat-alert cat-alert-error" style={{ marginBottom: "16px" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {error}
                </div>
            )}

            {/* Skeleton while fetching */}
            {fetching && (
                <div className="cat-form-card">
                    <div className="cat-view-skeleton-row" />
                    <div className="cat-view-skeleton-row" style={{ width: "70%", marginTop: "14px" }} />
                    <div className="cat-view-skeleton-row" style={{ height: "80px", marginTop: "14px" }} />
                </div>
            )}

            {/* Form */}
            {!fetching && (
                <div className="cat-form-card">
                    <form onSubmit={handleSubmit} className="cat-form">

                        {/* Inline form error/success */}
                        {error && (
                            <div className="cat-alert cat-alert-error">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="cat-alert cat-alert-success">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                    <circle cx="12" cy="12" r="10" /><polyline points="9 12 11 14 15 10" />
                                </svg>
                                {success}
                            </div>
                        )}

                        {/* Name */}
                        <div className="cat-field">
                            <label className="cat-label" htmlFor="name">
                                Category Name <span className="cat-required">*</span>
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                className="cat-input"
                                placeholder="e.g. Technology"
                                value={form.name}
                                onChange={handleChange}
                                autoComplete="off"
                                disabled={loading}
                            />
                        </div>

                        {/* Description */}
                        <div className="cat-field">
                            <label className="cat-label" htmlFor="description">
                                Description <span className="cat-optional">(optional)</span>
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                className="cat-textarea"
                                placeholder="Brief description of this category..."
                                value={form.description}
                                onChange={handleChange}
                                rows={4}
                                disabled={loading}
                            />
                        </div>

                        {/* Actions */}
                        <div className="cat-form-actions">
                            <button
                                type="button"
                                className="cat-btn cat-btn-ghost"
                                onClick={() => router.push(`/admin/category/${id}`)}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="cat-btn cat-btn-primary"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="cat-spinner" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                                            <polyline points="17 21 17 13 7 13 7 21" />
                                            <polyline points="7 3 7 8 15 8" />
                                        </svg>
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>

                    </form>
                </div>
            )}
        </div>
    );
};

export default EditCategory;