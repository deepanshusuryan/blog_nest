const BlogCard = ({ blog, onAuthorClick, onBlogClick, style }) => {
    const authorName = blog.userName || "Anonymous";

    const getInitials = (name = "") =>
        name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "?";

    const timeAgo = (dateStr) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const m = Math.floor(diff / 60000);
        if (m < 1) return "just now";
        if (m < 60) return `${m}m ago`;
        const h = Math.floor(m / 60);
        if (h < 24) return `${h}h ago`;
        const d = Math.floor(h / 24);
        if (d < 7) return `${d}d ago`;
        return new Date(dateStr).toLocaleDateString("en-IN", {
            day: "numeric", month: "short", year: "numeric",
        });
    };

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
                        <circle cx="12" cy="5" r="1" fill="currentColor" />
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
                <p
                    className="blog-excerpt blog-body"
                    dangerouslySetInnerHTML={{ __html: blog.description }}
                />

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

                {/* <div className="blog-actions-right">
                    <button className="blog-action-btn" aria-label="Share">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                        </svg>
                    </button>
                </div> */}
            </div>
        </article>
    );
};

export default BlogCard;