"use client";

import axiosInstance from "@/services/axiosInstance";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const Blog = ({ id }) => {
    const router = useRouter();

    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchBlog = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axiosInstance.get(`/blog/getBlog/${id}`);

            if (response?.data?.success && response?.data?.data) {
                setBlog(response.data.data);
            } else {
                setError("Blog not found");
            }
        } catch (error) {
            console.log(error);
            setError("Something went wrong while loading the blog");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchBlog();
        }
    }, [id]);

    const createdDate = useMemo(() => {
        if (!blog?.createdAt) return "";
        return new Date(blog.createdAt).toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    }, [blog?.createdAt]);

    const updatedDate = useMemo(() => {
        if (!blog?.updatedAt) return "";
        return new Date(blog.updatedAt).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    }, [blog?.updatedAt]);

    if (loading) {
        return (
            <div className="blog-page">
                <div className="blog-topbar">
                    <div className="blog-topbar-left">
                        <button className="blog-back-btn" type="button">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M15 18l-6-6 6-6" />
                            </svg>
                            Back
                        </button>
                        <div className="blog-topbar-divider" />
                        <div className="blog-topbar-logo">
                            My<span>Blog</span>
                        </div>
                    </div>
                </div>

                <div className="blog-loading">
                    <div>
                        <div className="blog-skel-block" style={{ width: "120px", height: "24px" }} />
                        <div className="blog-skel-block" style={{ width: "80%", height: "56px", marginBottom: "20px" }} />
                        <div className="blog-skel-block" style={{ width: "100%", height: "74px", marginBottom: "32px" }} />
                        <div className="blog-skel-block" style={{ width: "48px", height: "3px", marginBottom: "32px" }} />
                        <div className="blog-skel-block" style={{ width: "100%", height: "18px" }} />
                        <div className="blog-skel-block" style={{ width: "100%", height: "18px" }} />
                        <div className="blog-skel-block" style={{ width: "92%", height: "18px" }} />
                        <div className="blog-skel-block" style={{ width: "96%", height: "18px" }} />
                        <div className="blog-skel-block" style={{ width: "88%", height: "18px" }} />
                    </div>

                    <div>
                        <div className="blog-skel-block" style={{ width: "100%", height: "180px" }} />
                        <div className="blog-skel-block" style={{ width: "100%", height: "160px" }} />
                        <div className="blog-skel-block" style={{ width: "100%", height: "110px" }} />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !blog) {
        return (
            <div className="blog-page">
                <div className="blog-error">
                    <div className="blog-error-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                    </div>
                    <h2>Unable to load blog</h2>
                    <p>{error || "No blog data found."}</p>
                    <button className="blog-error-btn" onClick={fetchBlog} type="button">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="blog-page">

            <div className="blog-layout">
                <article className="blog-article">
                    {blog?.blogCategory?.length > 0 && (
                        <div className="blog-cats">
                            {blog?.blogCategory?.map((category, index) => (
                                <span className="blog-cat-pill" key={index}>
                                    {category?.name}
                                </span>
                            ))}
                        </div>
                    )}

                    <h1 className="blog-title">{blog.title}</h1>

                    <div className="blog-meta">
                        <div className="blog-meta-avatar">{blog?.userId?.name?.trim().charAt(0).toUpperCase()}</div>

                        <div className="blog-meta-info">
                            <div className="blog-meta-author">{blog?.userId?.name}</div>

                            <div className="blog-meta-sub">
                                <span>{createdDate}</span>
                                <span className="blog-meta-dot" />
                                {/* <span>{readTime} min read</span> */}
                                {blog.updatedAt && (
                                    <>
                                        <span className="blog-meta-dot" />
                                        <span>Updated {updatedDate}</span>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="blog-meta-badge">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="2" y1="12" x2="22" y2="12" />
                                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                            </svg>
                            {blog.blogType}
                        </div>
                    </div>

                    <div
                        id="blog-content"
                        className="blog-body"
                        dangerouslySetInnerHTML={{ __html: blog.description }}
                    />

                    <div className="blog-actions">
                        <button className="blog-action-btn" type="button">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M7 10v12" />
                                <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-1.2 4A2 2 0 0 1 18.63 18H7a2 2 0 0 1-2-2v-6a2 2 0 0 1 .59-1.41l5.66-5.66A2 2 0 0 1 14.66 4a2 2 0 0 1 .34 1.88z" />
                            </svg>
                            Like
                        </button>

                    </div>
                </article>

                {/* <aside className="blog-sidebar">
                    <div className="blog-sidebar-card">
                        <div className="blog-sidebar-label">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                            Author
                        </div>

                        <div className="blog-sidebar-author">
                            <div className="blog-sidebar-avatar">{authorInitial}</div>
                            <div className="blog-sidebar-author-name">{authorName}</div>
                            <div className="blog-sidebar-author-bio">
                                {blog.blogType === "public" ? "Public post" : "Private post"} •{" "}
                                {blog.isActive ? "Currently active" : "Currently inactive"}
                            </div>
                            <button className="blog-sidebar-follow-btn" type="button">
                                Follow
                            </button>
                        </div>
                    </div>

                    <div className="blog-sidebar-card">

                        <div className="blog-sidebar-stats">
                            <div className="blog-sidebar-stat">
                                <div className="blog-sidebar-stat-val">{blog.blogCategory?.length || 0}</div>
                                <div className="blog-sidebar-stat-label">Categories</div>
                            </div>

                            <div className="blog-sidebar-stat">
                                <div className="blog-sidebar-stat-val">{readTime}</div>
                                <div className="blog-sidebar-stat-label">Min Read</div>
                            </div>

                            <div className="blog-sidebar-stat">
                                <div className="blog-sidebar-stat-val">
                                    {blog.isActive ? "On" : "Off"}
                                </div>
                                <div className="blog-sidebar-stat-label">Status</div>
                            </div>
                        </div>
                    </div>
                </aside> */}
            </div>
        </div>
    );
};

export default Blog;
