"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/common/AuthContext";
import axiosInstance from "@/services/axiosInstance";
import { SkeletonBlog } from "@/common/skeletonCard";
import StatusTogglePopup from "@/common/StatusTogglePopup";
import { toast } from "react-toastify";
import ConfirmPopup from "@/common/DeletePopup";

const getInitials = (name = "") =>
    name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "?";

const Blog = () => {
    const { id } = useParams();
    const router = useRouter();
    const { user } = useAuth();

    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openDeletePopup, setOpenDeletePopup] = useState(false);
    const [error, setError] = useState("");

    const fetchBlog = useCallback(async () => {
        try {
            setLoading(true);
            setError("");
            const res = await axiosInstance.get(`/blog/getblog/${id}`);
            if (res.data.success) {
                const b = res.data.data;
                setBlog(b);
            } else {
                setError(res.data.message || "Blog not found.");
            }
        } catch (err) {
            const status = err.response?.status;
            if (status === 404) setError("This blog doesn't exist.");
            else setError("Failed to load blog. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => { fetchBlog(); }, [fetchBlog]);
    const blogOwnerId =
        typeof blog?.userId === "object"
            ? blog?.userId?._id
            : blog?.userId;

    const isOwner = !!user && !!blogOwnerId && (
        String(user._id) === String(blogOwnerId)
    );

    const handleDelete = async () => {
        try {
            const res = await axiosInstance.put(`/blog/delete/${id}`);

            if (res.data.success) {
                toast.success(res.data.message || "Blog deleted successfully");

                router.push(`/nest/profile/${user._id}/userblogs`);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Delete failed");
        }
    };

    const isEditable = new Date(blog?.createdAt).getTime() + 24 * 60 * 60 * 1000 - Date.now();

    const authorName = typeof blog?.userId === "object"
        ? blog?.userId?.name
        : "Writer";

    return (
        <div className="blog-page">

            <div className="blog-topbar">
                <div className="blog-topbar-left">
                    <button className="blog-back-btn" onClick={() => router.back()}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Back
                    </button>
                    <div className="blog-topbar-divider" />
                    <a className="blog-topbar-logo" href="/">Blog<span>Nest</span></a>
                </div>
            </div>

            {loading && <SkeletonBlog />}

            {!loading && error && (
                <div className="blog-error">
                    <div className="blog-error-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                    </div>
                    <h2>Oops.</h2>
                    <p>{error}</p>
                    <button className="blog-error-btn" onClick={() => router.back()}>Go back</button>
                </div>
            )}

            {!loading && !error && blog && (
                <div className="blog-layout">

                    <article className="blog-article">

                        {blog.blogCategory?.length > 0 && (
                            <div className="blog-cats">
                                {blog.blogCategory.map((cat) => (
                                    <span key={cat._id} className="blog-cat-pill">{cat.name}</span>
                                ))}
                            </div>
                        )}

                        <h1 className="blog-title">{blog.title}</h1>

                        <div className="blog-meta">
                            <div
                                className="blog-meta-avatar"
                                onClick={() => blogOwnerId && router.push(`/profile/${blogOwnerId}`)}
                                title={`View ${authorName}'s profile`}
                            >
                                {getInitials(authorName)}
                            </div>
                            <div className="blog-meta-info">
                                <div
                                    className="blog-meta-author"
                                    onClick={() => blogOwnerId && router.push(`/profile/${blogOwnerId}`)}
                                >
                                    {authorName}
                                </div>
                            </div>
                            {!loading && !error && isOwner ? (
                                <div className="blog-topbar-right">
                                    <StatusTogglePopup
                                        currentStatus={blog?.blogType}
                                        apiUrl={`/blog/toggle-blogtype/${id}`}
                                        statusField="blogType"
                                        method="patch"
                                        onSuccess={(newStatus) => {
                                            setBlog((prev) => ({
                                                ...prev,
                                                blogType: newStatus,
                                            }));
                                        }}
                                    />
                                </div>
                            ) : null}
                        </div>

                        <div className="blog-rule" />

                        <div
                            className="blog-body"
                            dangerouslySetInnerHTML={{ __html: blog.description }}
                        />

                        <div className="blog-actions">
                            <button className="blog-action-btn" aria-label="Like">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                </svg>
                                Like
                            </button>
                            {/* <button className="blog-action-btn" aria-label="Comment">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                                    </svg>
                                    Comment
                                </button> */}
                            <button className="blog-action-btn icon-only" aria-label="Save">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                                </svg>
                            </button>
                            <div className="blog-action-spacer" />
                            {/* <button className="blog-action-btn icon-only" aria-label="Share">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                                    </svg>
                                </button> */}
                        </div>
                    </article>

                    <aside className="blog-sidebar">

                        <div className="blog-sidebar-card">
                            <div className="blog-sidebar-label">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                                </svg>
                                About the writer
                            </div>
                            <div className="blog-sidebar-author">
                                <div
                                    className="blog-sidebar-avatar"
                                    onClick={() => blogOwnerId && router.push(`/nest/profile/${blogOwnerId}`)}
                                >
                                    {getInitials(authorName)}
                                </div>
                                <span
                                    className="blog-sidebar-author-name"
                                    onClick={() => blogOwnerId && router.push(`/profile/${blogOwnerId}`)}
                                >
                                    {authorName}
                                </span>
                                <p className="blog-sidebar-author-bio">
                                    {typeof blog.userId === "object" && blog.userId?.bio
                                        ? blog.userId.bio
                                        : "Crafting stories, one word at a time."}
                                </p>
                            </div>
                        </div>

                        {/* Stats card */}
                        <div className="blog-sidebar-card">
                            <div className="blog-sidebar-label">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                                </svg>
                                Stats
                            </div>
                            <div className="blog-sidebar-stats">
                                <div className="blog-sidebar-stat">
                                    <span className="blog-sidebar-stat-val">
                                        {blog.description.replace(/<[^>]+>/g, " ").trim().split(/\s+/).filter(Boolean).length}
                                    </span>
                                    <span className="blog-sidebar-stat-label">Words</span>
                                </div>
                                <div className="blog-sidebar-stat">
                                    <span className="blog-sidebar-stat-val">
                                        {new Date(blog.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                                    </span>
                                    <span className="blog-sidebar-stat-label">Published</span>
                                </div>
                            </div>
                        </div>
                        {!loading && !error && isOwner ?
                            <div className="blog-sidebar-card">
                                <div className="blog-sidebar-actions">
                                    {isEditable && (
                                        <button
                                            className="blog-sidebar-action-btn blog-sidebar-action-btn--edit"
                                            onClick={() => router.push(`/nest/blog/${id}/edit`)}
                                        >
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                            </svg>
                                            Edit
                                        </button>
                                    )}

                                    <button
                                        className="blog-sidebar-action-btn blog-sidebar-action-btn--delete"
                                        onClick={() => setOpenDeletePopup(true)}
                                    >
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="3 6 5 6 21 6" />
                                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                            <path d="M10 11v6" />
                                            <path d="M14 11v6" />
                                            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                                        </svg>
                                        Delete
                                    </button>
                                    <ConfirmPopup
                                        open={openDeletePopup}
                                        onClose={() => !loading && setOpen(false)}
                                        onConfirm={handleDelete}
                                        loading={loading}
                                        title="Delete blog"
                                        message={`Are you sure you want to delete "${blog.title}"? This action cannot be undone.`}
                                        confirmText="Yes, delete it"
                                        cancelText="Cancel"
                                        variant="danger"
                                    />
                                </div>
                            </div> : null}
                    </aside>
                </div>
            )}
        </div>
    );
};

export default Blog;