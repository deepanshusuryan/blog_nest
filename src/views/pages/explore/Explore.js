"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/services/axiosInstance";
import BlogCard from "@/common/blogCard";
import { SkeletonCard } from "@/common/skeletonCard";

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