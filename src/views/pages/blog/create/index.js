"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axiosInstance from "@/services/axiosInstance";

const CreateBlog = () => {
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [blogType, setBlogType] = useState("public");
    const [selectedCategories, setSelectedCategories] = useState([]);

    const [categories, setCategories] = useState([]);
    const [catLoading, setCatLoading] = useState(true);
    const [catSearch, setCatSearch] = useState("");

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const titleRef = useRef(null);

    const autoResizeTitle = () => {
        const el = titleRef.current;
        if (el) {
            el.style.height = "auto";
            el.style.height = el.scrollHeight + "px";
        }
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setCatLoading(true);
                const res = await axiosInstance.get("/category/getcategories", {
                    params: { limit: 100, isActive: true }
                });
                if (res.data.success) {
                    setCategories(res.data.categories || []);
                }
            } catch (err) {
                console.log("Failed to fetch categories", err);
            } finally {
                setCatLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const wordCount = description.trim()
        ? description.trim().split(/\s+/).length
        : 0;

    const toggleCategory = (cat) => {
        setSelectedCategories((prev) => {
            const exists = prev.find((c) => c._id === cat._id);
            return exists
                ? prev.filter((c) => c._id !== cat._id)
                : [...prev, cat];
        });
    };

    const filteredCategories = categories.filter((c) =>
        c.name.toLowerCase().includes(catSearch.toLowerCase())
    );

    const validate = () => {
        if (!title.trim()) return "Please add a title for your blog.";
        if (!description.trim()) return "Please write some content.";
        if (description.trim().split(/\s+/).length < 10)
            return "Content is too short. Write at least 10 words.";
        return "";
    };

    const handleSubmit = async () => {
        const err = validate();
        if (err) { setError(err); return; }
        setError("");
        setSubmitting(true);

        try {
            const res = await axiosInstance.post("/blog/create", {
                title: title.trim(),
                description: description.trim(),
                blogType,
                blogCategory: selectedCategories.map((c) => c._id),
            });

            if (res.data.success) {
                toast.success(res.data.message || "Blog published!");
                router.push("/nest");
            } else {
                toast.error(res.data.message || "Something went wrong");
            }
        } catch (err) {
            const msg = err.response?.data?.message;
            toast.error(msg || "Failed to publish. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const descRef = useRef(null);

    const insertFormat = useCallback((prefix, suffix = "") => {
        const el = descRef.current;
        if (!el) return;
        const start = el.selectionStart;
        const end = el.selectionEnd;
        const selected = description.slice(start, end);
        const newVal =
            description.slice(0, start) +
            prefix + selected + suffix +
            description.slice(end);
        setDescription(newVal);
        setTimeout(() => {
            el.focus();
            el.selectionStart = start + prefix.length;
            el.selectionEnd = end + prefix.length;
        }, 0);
    }, [description]);

    return (
        <div className="cb-page">

            <div className="cb-topbar">
                <div className="cb-topbar-left">
                    <button className="cb-back-btn" onClick={() => router.back()}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Back
                    </button>
                    <div className="cb-topbar-divider" />
                    <span className="cb-topbar-label">Blog<span>Nest</span></span>
                </div>

                <div className="cb-topbar-right">
                    <span className="cb-word-count">{wordCount} {wordCount === 1 ? "word" : "words"}</span>
                    <button className="cb-save-btn" onClick={() => toast.info("Draft saved!")}>
                        Save draft
                    </button>
                    <button
                        className="cb-publish-btn"
                        onClick={handleSubmit}
                        disabled={submitting}
                    >
                        {submitting ? "Publishing…" : "Publish →"}
                    </button>
                </div>
            </div>

            {error && <div className="cb-error-bar">⚠ {error}</div>}

            <div className="cb-main">

                <div className="cb-editor">

                    <div className="cb-title-wrap">
                        <textarea
                            ref={titleRef}
                            className="cb-title-input"
                            placeholder="Your story title…"
                            value={title}
                            rows={1}
                            onChange={(e) => {
                                setTitle(e.target.value);
                                autoResizeTitle();
                            }}
                            maxLength={200}
                        />
                    </div>
                    <div className="cb-title-underline" />

                    <div className="cb-toolbar">
                        <button className="cb-tool-btn" title="Bold" onClick={() => insertFormat("**", "**")}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 4h8a4 4 0 010 8H6zM6 12h9a4 4 0 010 8H6z" />
                            </svg>
                        </button>
                        <button className="cb-tool-btn" title="Italic" onClick={() => insertFormat("_", "_")}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="19" y1="4" x2="10" y2="4" /><line x1="14" y1="20" x2="5" y2="20" /><line x1="15" y1="4" x2="9" y2="20" />
                            </svg>
                        </button>
                        <button className="cb-tool-btn" title="Quote" onClick={() => insertFormat("\n> ", "")}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
                                <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
                            </svg>
                        </button>
                        <button className="cb-tool-btn" title="Heading" onClick={() => insertFormat("\n## ", "")}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 12h16M4 6h7M4 18h7M17 6v12" />
                            </svg>
                        </button>

                        <div className="cb-tool-sep" />

                        <button className="cb-tool-btn" title="Bullet list" onClick={() => insertFormat("\n- ", "")}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="9" y1="6" x2="20" y2="6" /><line x1="9" y1="12" x2="20" y2="12" /><line x1="9" y1="18" x2="20" y2="18" />
                                <circle cx="4" cy="6" r="1" fill="currentColor" /><circle cx="4" cy="12" r="1" fill="currentColor" /><circle cx="4" cy="18" r="1" fill="currentColor" />
                            </svg>
                        </button>
                        <button className="cb-tool-btn" title="Code" onClick={() => insertFormat("`", "`")}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
                            </svg>
                        </button>
                        <button className="cb-tool-btn" title="Link" onClick={() => insertFormat("[", "](url)")}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                                <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                            </svg>
                        </button>
                    </div>

                    <textarea
                        ref={descRef}
                        className="cb-body-input"
                        placeholder="Start writing your story… use the toolbar above to format your text."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div className="cb-sidebar">

                    <div className="cb-sidebar-section">
                        <span className="cb-sidebar-label">Visibility</span>
                        <div className="cb-visibility-toggle">
                            <button
                                className={`cb-vis-option${blogType === "public" ? " active" : ""}`}
                                onClick={() => setBlogType("public")}
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="2" y1="12" x2="22" y2="12" />
                                    <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                                </svg>
                                Public
                            </button>
                            <button
                                className={`cb-vis-option${blogType === "private" ? " active" : ""}`}
                                onClick={() => setBlogType("private")}
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                    <path d="M7 11V7a5 5 0 0110 0v4" />
                                </svg>
                                Private
                            </button>
                        </div>
                    </div>

                    <div className="cb-sidebar-divider" />

                    <div className="cb-sidebar-section">
                        <span className="cb-sidebar-label">Categories</span>

                        {selectedCategories.length > 0 && (
                            <div className="cb-selected-tags">
                                {selectedCategories.map((cat) => (
                                    <span key={cat._id} className="cb-tag">
                                        {cat.name}
                                        <button
                                            className="cb-tag-remove"
                                            onClick={() => toggleCategory(cat)}
                                            aria-label={`Remove ${cat.name}`}
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="cb-cat-search">
                            <span className="cb-cat-search-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                                </svg>
                            </span>
                            <input
                                type="text"
                                placeholder="Search categories…"
                                value={catSearch}
                                onChange={(e) => setCatSearch(e.target.value)}
                            />
                        </div>

                        <div className="cb-cat-list">
                            {catLoading ? (
                                <div className="cb-cat-loading">Loading…</div>
                            ) : filteredCategories.length === 0 ? (
                                <div className="cb-cat-empty">No categories found</div>
                            ) : (
                                filteredCategories.map((cat) => {
                                    const isSelected = selectedCategories.some((c) => c._id === cat._id);
                                    return (
                                        <button
                                            key={cat._id}
                                            className={`cb-cat-item${isSelected ? " selected" : ""}`}
                                            onClick={() => toggleCategory(cat)}
                                        >
                                            <span className="cb-cat-checkbox">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                            </span>
                                            <span className="cb-cat-name">{cat.name}</span>
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    <div className="cb-sidebar-divider" />

                    <div className="cb-tips">
                        <div className="cb-tips-title">Writing tips</div>
                        <ul>
                            <li>Start with a strong hook in your first sentence.</li>
                            <li>Use headings to break up long sections.</li>
                            <li>Keep paragraphs short — 3 to 4 sentences max.</li>
                            <li>Add a clear takeaway at the end.</li>
                        </ul>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CreateBlog;