"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";
import axiosInstance from "@/services/axiosInstance";
import { useDebounce } from "@/utils/useDebounce";
import BlogEditor, { useBlogEditor } from "@/utils/blogEditor";
import { useAuth } from "@/common/AuthContext";

const BlogEdit = () => {
    const router = useRouter();
    const params = useParams();
    const { user } = useAuth();

    const blogId = params?.id;

    const [title, setTitle] = useState("");
    const titleRef = useRef(null);
    const [wordCount, setWordCount] = useState(0);
    const [blogType, setBlogType] = useState("public");

    const { editor, getHTML, getText } = useBlogEditor({
        onWordCountChange: setWordCount,
    });

    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [catSearch, setCatSearch] = useState("");
    const [catLoading, setCatLoading] = useState(false);
    const debouncedSearch = useDebounce(catSearch, 500);

    const [loadingBlog, setLoadingBlog] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const autoResizeTitle = () => {
        const el = titleRef.current;
        if (el) {
            el.style.height = "auto";
            el.style.height = el.scrollHeight + "px";
        }
    };

    useEffect(() => {
        const fetchCategories = async () => {
            setCatLoading(true);
            try {
                const res = await axiosInstance.get("/category/getcategories", {
                    params: { limit: 7, search: debouncedSearch, isActive: true },
                });

                if (res.data.success) {
                    setCategories(res.data.categories || []);
                }
            } catch {
            } finally {
                setCatLoading(false);
            }
        };

        fetchCategories();
    }, [debouncedSearch]);

    useEffect(() => {
        const fetchBlog = async () => {
            if (!blogId) return;

            setLoadingBlog(true);
            try {
                const res = await axiosInstance.get(`/blog/getblog/${blogId}`);

                if (res.data.success) {
                    const blog = res.data.data;

                    setTitle(blog?.title || "");
                    setBlogType(blog?.blogType || "public");

                    const normalizedCategories = (blog?.blogCategory || []).map((cat) =>
                        typeof cat === "object"
                            ? { _id: cat._id, name: cat.name }
                            : { _id: cat, name: "" }
                    );

                    setSelectedCategories(normalizedCategories);

                    if (editor && blog?.description) {
                        editor.commands.setContent(blog.description);
                    }
                } else {
                    toast.error(res.data.message || "Failed to load blog");
                    router.back();
                }
            } catch (err) {
                toast.error(err.response?.data?.message || "Failed to load blog");
                router.back();
            } finally {
                setLoadingBlog(false);
            }
        };

        fetchBlog();
    }, [blogId, editor, router]);

    useEffect(() => {
        autoResizeTitle();
    }, [title]);

    const toggleCategory = (cat) => {
        setSelectedCategories((prev) => {
            const exists = prev.find((c) => c._id === cat._id);
            return exists
                ? prev.filter((c) => c._id !== cat._id)
                : [...prev, cat];
        });
    };

    const handleUpdate = async () => {
        const description = getHTML();
        const rawText = getText().trim();

        if (!title.trim()) {
            setError("Please add a title for your blog.");
            return;
        }

        if (!rawText) {
            setError("Please write some content.");
            return;
        }

        if (rawText.split(/\s+/).length < 5) {
            setError("Content is too short. Write at least 5 words.");
            return;
        }

        setError("");
        setSubmitting(true);

        try {
            const res = await axiosInstance.put(`/blog/update/${blogId}`, {
                title: title.trim(),
                description,
                blogType,
                blogCategory: selectedCategories.map((c) => c._id),
            });

            if (res.data.success) {
                toast.success(res.data.message || "Blog updated successfully!");
                router.push(`/nest/profile/${user._id}/userblogs`);
            } else {
                toast.error(res.data.message || "Something went wrong");
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update blog. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loadingBlog) {
        return (
            <div className="cb-page">
                <div className="cb-topbar">
                    <div className="cb-topbar-left">
                        <button className="cb-back-btn" onClick={() => router.back()}>
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                            Back
                        </button>
                        <div className="cb-topbar-divider" />
                        <span className="cb-topbar-label">
                            Blog<span>Nest</span>
                        </span>
                    </div>
                </div>

                <div className="cb-main">
                    <div className="cb-cat-status">Loading blog…</div>
                </div>
            </div>
        );
    }

    return (
        <div className="cb-page">
            <div className="cb-topbar">
                <div className="cb-topbar-left">
                    <button className="cb-back-btn" onClick={() => router.back()}>
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Back
                    </button>
                    <div className="cb-topbar-divider" />
                    <span className="cb-topbar-label">
                        Blog<span>Nest</span>
                    </span>
                </div>

                <div className="cb-topbar-right">
                    <span className="cb-word-count">
                        {wordCount} {wordCount === 1 ? "word" : "words"}
                    </span>
                    <button
                        className="cb-publish-btn"
                        onClick={handleUpdate}
                        disabled={submitting}
                    >
                        {submitting ? "Updating..." : "Update →"}
                    </button>
                </div>
            </div>

            {error && <div className="cb-error-bar">⚠ {error}</div>}

            <div className="cb-main">
                <div className="cb-visibility-row">
                    <span className="cb-vis-label">Visibility</span>

                    <button
                        className={`cb-vis-btn${blogType === "public" ? " active" : ""}`}
                        onClick={() => setBlogType("public")}
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="12" cy="12" r="10" />
                            <line x1="2" y1="12" x2="22" y2="12" />
                            <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                        </svg>
                        Public
                    </button>

                    <button
                        className={`cb-vis-btn${blogType === "private" ? " active" : ""}`}
                        onClick={() => setBlogType("private")}
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0110 0v4" />
                        </svg>
                        Private
                    </button>
                </div>

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

                <BlogEditor editor={editor} />

                <div className="cb-section-divider" />

                <div className="cb-cat-section">
                    <div className="cb-cat-heading">Categories</div>

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

                    <div className="cb-cat-search-wrap">
                        <span className="cb-cat-search-icon">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                        </span>

                        <input
                            type="text"
                            placeholder="Search categories…"
                            value={catSearch}
                            onChange={(e) => setCatSearch(e.target.value)}
                        />
                    </div>

                    <div className="cb-cat-grid">
                        {catLoading ? (
                            <span className="cb-cat-status">Loading…</span>
                        ) : categories.length === 0 ? (
                            <span className="cb-cat-status">No categories found</span>
                        ) : (
                            categories.map((cat) => {
                                const isSelected = selectedCategories.some(
                                    (c) => c._id === cat._id
                                );

                                return (
                                    <button
                                        key={cat._id}
                                        className={`cb-cat-chip${isSelected ? " selected" : ""}`}
                                        onClick={() => toggleCategory(cat)}
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                        {cat.name}
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>

                <div className="cb-tips">
                    <div className="cb-tips-title">Editing tips</div>
                    <ul>
                        <li>Refine your headline to make it more compelling.</li>
                        <li>Improve readability with headings and short paragraphs.</li>
                        <li>Remove repetitive sentences and tighten your message.</li>
                        <li>End with a clear conclusion or takeaway.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default BlogEdit;
