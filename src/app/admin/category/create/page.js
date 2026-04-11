"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/services/axiosInstance";

const AddCategory = () => {
    const router = useRouter();
    const [form, setForm] = useState({ name: "", description: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

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
            const res = await axiosInstance.post("/category/create", form);
            if (res.data.success) {
                setSuccess("Category created successfully!");
                setForm({ name: "", description: "" });
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
            {/* Page Header */}
            <div className="cat-header">
                <div>
                    <h1 className="cat-title">New Category</h1>
                    <p className="cat-subtitle">Fill in the details below</p>
                </div>
                <button
                    className="cat-btn cat-btn-ghost cat-btn-sm"
                    onClick={() => router.push("/admin/category")}
                >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
                    </svg>
                    Back
                </button>
            </div>

            {/* Form Card */}
            <div className="cat-form-card">
                <form onSubmit={handleSubmit} className="cat-form">

                    {/* Error / Success */}
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
                            onClick={() => router.push("/admin/category")}
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
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                                    </svg>
                                    Create Category
                                </>
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default AddCategory;