export const SkeletonCard = () => (
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

export const SkeletonBlog = () => (
    <div className="blog-loading">
        <div className="blog-loading-main">
            <div className="blog-skel-block" style={{ height: 14, width: "30%", marginBottom: 20 }} />
            <div className="blog-skel-block" style={{ height: 52, width: "90%", marginBottom: 10 }} />
            <div className="blog-skel-block" style={{ height: 52, width: "70%", marginBottom: 28 }} />
            <div className="blog-skel-block" style={{ height: 1, width: "100%", marginBottom: 20 }} />
            <div className="blog-skel-block" style={{ height: 18, width: "100%", marginBottom: 10 }} />
            <div className="blog-skel-block" style={{ height: 18, width: "96%", marginBottom: 10 }} />
            <div className="blog-skel-block" style={{ height: 18, width: "88%", marginBottom: 10 }} />
            <div className="blog-skel-block" style={{ height: 18, width: "93%", marginBottom: 10 }} />
            <div className="blog-skel-block" style={{ height: 18, width: "78%", marginBottom: 32 }} />
            <div className="blog-skel-block" style={{ height: 18, width: "100%", marginBottom: 10 }} />
            <div className="blog-skel-block" style={{ height: 18, width: "85%", marginBottom: 10 }} />
        </div>
        <div className="blog-loading-side">
            <div className="blog-skel-block" style={{ height: 160, borderRadius: 14 }} />
        </div>
    </div>
);
