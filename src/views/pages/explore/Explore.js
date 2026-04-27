"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/services/axiosInstance";

const getInitials = (name = "") =>
    name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "?";

const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1)  return "just now";
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24);
    if (d < 7)  return `${d}d ago`;
    return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric",
    });
};

const truncate = (text = "", words = 60) => {
    const arr = text.trim().split(/\s+/);
    return arr.length > words ? arr.slice(0, words).join(" ") + "…" : text;
};

const SkeletonCard = () => (
    <div className="blog-skeleton">
        <div className="skeleton-header">
            <div className="skeleton-avatar" />
            <div className="skeleton-header-text">
                <div className="skeleton-line" style={{ height: 12, width: "40%" }} />
                <div className="skeleton-line" style={{ height: 10, width: "25%", marginBottom: 0 }} />
            </div>
        </div>
        <div className="skeleton-line" style={{ height: 10, width: "30%", marginBottom: 14 }} />
        <div className="skeleton-line" style={{ height: 22, width: "85%" }} />
        <div className="skeleton-line" style={{ height: 22, width: "70%", marginBottom: 16 }} />
        <div className="skeleton-line" style={{ height: 13, width: "100%" }} />
        <div className="skeleton-line" style={{ height: 13, width: "95%" }} />
        <div className="skeleton-line" style={{ height: 13, width: "80%", marginBottom: 0 }} />
    </div>
);

const BlogCard = ({ blog, onAuthorClick, onBlogClick, style }) => {
    const authorName = blog.userId?.name || "Anonymous";

    return (
        <article className="blog-card" style={style}>

            <div className="blog-card-header">
                <div
                    className="blog-author"
                    onClick={() => onAuthorClick(blog.userId?._id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && onAuthorClick(blog.userId?._id)}
                    aria-label={`View ${authorName}'s profile`}
                >
                    <div className="blog-author-avatar">{getInitials(authorName)}</div>
                    <div className="blog-author-info">
                        <span className="blog-author-name">{authorName}</span>
                        <span className="blog-author-time">{timeAgo(blog.createdAt)}</span>
                    </div>
                </div>
                <button className="blog-card-menu" aria-label="More options">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="5"  r="1" fill="currentColor" />
                        <circle cx="12" cy="12" r="1" fill="currentColor" />
                        <circle cx="12" cy="19" r="1" fill="currentColor" />
                    </svg>
                </button>
            </div>

            <div className="blog-card-body">
                {blog.categoryDetails?.length > 0 && (
                    <div className="blog-categories">
                        {blog.categoryDetails.map((cat) => (
                            <span key={cat._id} className="blog-category-tag">{cat.name}</span>
                        ))}
                    </div>
                )}

                <div
                    className="blog-title"
                    onClick={() => onBlogClick(blog._id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && onBlogClick(blog._id)}
                >
                    {blog.title}
                </div>

                <p className="blog-excerpt">{truncate(blog.description, 60)}</p>

                <button className="blog-read-more" onClick={() => onBlogClick(blog._id)}>
                    Read more
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            <div className="blog-card-footer">
                <div className="blog-actions-left">
                    <button className="blog-action-btn" aria-label="Like">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                        </svg>
                        Like
                    </button>
                    {/* <button className="blog-action-btn" aria-label="Comment">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                        </svg>
                        Comment
                    </button> */}
                    <button className="blog-action-btn" aria-label="Save">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                        </svg>
                    </button>
                </div>

                <div className="blog-actions-right">
                    <span className="blog-visibility-badge">
                        {blog.blogType === "private" ? (
                            <>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                                </svg>
                                Private
                            </>
                        ) : (
                            <>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
                                    <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                                </svg>
                                Public
                            </>
                        )}
                    </span>
                    {/* <button className="blog-action-btn" aria-label="Share">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                        </svg>
                    </button> */}
                </div>
            </div>
        </article>
    );
};

const LIMIT = 5;

const Explore = () => {
    const router = useRouter();

    const [blogs, setBlogs]             = useState([]);
    const [loading, setLoading]         = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError]             = useState("");
    const [hasMore, setHasMore]         = useState(false);
    const [skip, setSkip]               = useState(0);

    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch]           = useState("");

    const debounceRef = useRef(null);

    const fetchBlogs = useCallback(async ({ skipVal, searchVal, typeVal, append }) => {
        try {
            append ? setLoadingMore(true) : setLoading(true);
            setError("");

            const res = await axiosInstance.get("/blog/getblogs", {
                params: {
                    limit: LIMIT,
                    skip: skipVal,
                    search: searchVal,
                    type: typeVal,
                },
            });

            if (res.data.success) {
                const fetched = res.data.data || [];
                setBlogs((prev) => append ? [...prev, ...fetched] : fetched);
                setHasMore(res.data.hasMore);
                setSkip(skipVal + fetched.length);
            } else {
                setError("Failed to load blogs.");
            }
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, []);

    useEffect(() => {
        setBlogs([]);
        setSkip(0);
        fetchBlogs({ skipVal: 0, searchVal: search, typeVal: "public", append: false });
    }, [search, fetchBlogs]);

    const handleSearchInput = (e) => {
        const val = e.target.value;
        setSearchInput(val);
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => setSearch(val.trim()), 400);
    };

    const clearSearch = () => {
        setSearchInput("");
        setSearch("");
    };

    const handleLoadMore = () => {
        fetchBlogs({ skipVal: skip, searchVal: search, typeVal: type, append: true });
    };

    return (
        <div className="explore-page">
            <div className="explore-feed">

                <div className="explore-header">
                    <h1>What's being <em>written</em></h1>
                    <p>Stories, ideas, and perspectives from the nest.</p>
                </div>

                <div className="explore-controls">
                    <div className="explore-search-wrap">
                        <span className="explore-search-icon">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                        </span>
                        <input
                            className="explore-search"
                            type="text"
                            placeholder="Search stories or categories…"
                            value={searchInput}
                            onChange={handleSearchInput}
                        />
                        {searchInput && (
                            <button className="explore-search-clear" onClick={clearSearch} aria-label="Clear">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                {loading && <><SkeletonCard /><SkeletonCard /><SkeletonCard /></>}

                {!loading && error && (
                    <div className="explore-error"><p>{error}</p></div>
                )}

                {!loading && !error && blogs.length === 0 && (
                    <div className="explore-empty">
                        <div className="explore-empty-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                                <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
                            </svg>
                        </div>
                        <h3>{search ? "No results found" : "No stories yet"}</h3>
                        <p>
                            {search
                                ? `Nothing matched "${search}". Try a different keyword.`
                                : "Be the first to publish something worth reading."}
                        </p>
                    </div>
                )}

                {!loading && !error && blogs.map((blog, i) => (
                    <BlogCard
                        key={blog._id}
                        blog={blog}
                        onAuthorClick={(uid) => uid && router.push(`/profile/${uid}`)}
                        onBlogClick={(bid) => bid && router.push(`/nest/blog/${bid}`)}
                        style={{ animationDelay: `${i * 0.05}s` }}
                    />
                ))}

                {loadingMore && <><SkeletonCard /><SkeletonCard /></>}

                {!loading && !error && hasMore && blogs.length > 0 && (
                    <div className="explore-load-more">
                        <button className="load-more-btn" onClick={handleLoadMore} disabled={loadingMore}>
                            {loadingMore ? "Loading…" : "Load more stories"}
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Explore;