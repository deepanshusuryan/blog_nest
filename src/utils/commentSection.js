"use client";
import { useState, useEffect, useCallback } from "react";
import axiosInstance from "@/services/axiosInstance";
import { useAuth } from "@/common/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const LIMIT = 10;

const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return "just now";
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24);
    return `${d}d ago`;
};

const CommentItem = ({ comment, blogId, onDelete }) => {
    const { user } = useAuth();
    const [liked,        setLiked]        = useState(comment.isLiked);
    const [likesCount,   setLikesCount]   = useState(comment.likesCount);
    const [showReplies,  setShowReplies]  = useState(false);
    const [replies,      setReplies]      = useState([]);
    const [replyInput,   setReplyInput]   = useState("");
    const [repliesSkip,  setRepliesSkip]  = useState(0);
    const [hasMoreReplies, setHasMoreReplies] = useState(false);
    const [showReplyBox, setShowReplyBox] = useState(false);
    const [submitting,   setSubmitting]   = useState(false);

    const fetchReplies = async (skip = 0, append = false) => {
        try {
            const res = await axiosInstance.get(`/comment/${comment._id}/replies`, {
                params: { limit: 5, skip }
            });
            if (res.data.success) {
                setReplies(prev => append ? [...prev, ...res.data.data] : res.data.data);
                setHasMoreReplies(res.data.hasMore);
                setRepliesSkip(skip + res.data.data.length);
            }
        } catch {
            toast.error("Failed to load replies");
        }
    };

    const handleToggleReplies = () => {
        if (!showReplies && replies.length === 0) {
            fetchReplies(0);
        }
        setShowReplies(!showReplies);
    };

    const handleLike = async () => {
        if (!user) return;
        const wasLiked = liked;
        setLiked(!liked);
        setLikesCount(prev => wasLiked ? prev - 1 : prev + 1);
        try {
            await axiosInstance.post(`/comment/${comment._id}/like`);
        } catch {
            setLiked(wasLiked);
            setLikesCount(prev => wasLiked ? prev + 1 : prev - 1);
        }
    };

    const handleReply = async () => {
        if (!replyInput.trim()) return;
        setSubmitting(true);
        try {
            const res = await axiosInstance.post(`/comment/${blogId}`, {
                content: replyInput.trim(),
                parentId: comment._id,
            });
            if (res.data.success) {
                setReplies(prev => [...prev, res.data.data]);
                setReplyInput("");
                setShowReplyBox(false);
                setShowReplies(true);
            }
        } catch {
            toast.error("Failed to add reply");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        try {
            const res = await axiosInstance.delete(`/comment/${comment._id}`);
            if (res.data.success) {
                toast.success("Comment deleted");
                onDelete(comment._id);
            }
        } catch {
            toast.error("Failed to delete comment");
        }
    };

    const initials = comment.userName?.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "?";

    return (
        <div className="comment-item">
            <div className="comment-avatar">{initials}</div>
            <div className="comment-body">
                <div className="comment-meta">
                    <span className="comment-author">{comment.userName}</span>
                    <span className="comment-time">{timeAgo(comment.createdAt)}</span>
                    {comment.isOwner && (
                        <button className="comment-delete-btn" onClick={handleDelete}>Delete</button>
                    )}
                </div>
                <p className="comment-content">{comment.content}</p>

                <div className="comment-actions">
                    {/* Like */}
                    <button
                        className={`comment-action-btn ${liked ? "comment-action-btn--liked" : ""}`}
                        onClick={handleLike}
                    >
                        <svg viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" width="13" height="13">
                            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                        </svg>
                        {likesCount > 0 && likesCount}
                    </button>

                    {user && (
                        <button className="comment-action-btn" onClick={() => setShowReplyBox(!showReplyBox)}>
                            Reply
                        </button>
                    )}

                    {comment.repliesCount > 0 && (
                        <button className="comment-action-btn" onClick={handleToggleReplies}>
                            {showReplies ? "Hide" : `${comment.repliesCount} ${comment.repliesCount === 1 ? "reply" : "replies"}`}
                        </button>
                    )}
                </div>

                {showReplyBox && (
                    <div className="comment-reply-box">
                        <input
                            className="comment-input"
                            placeholder="Write a reply..."
                            value={replyInput}
                            onChange={e => setReplyInput(e.target.value)}
                            maxLength={500}
                        />
                        <button
                            className="comment-submit-btn"
                            onClick={handleReply}
                            disabled={submitting || !replyInput.trim()}
                        >
                            {submitting ? "..." : "Reply"}
                        </button>
                    </div>
                )}

                {showReplies && replies.length > 0 && (
                    <div className="comment-replies">
                        {replies.map(reply => (
                            <CommentItem
                                key={reply._id}
                                comment={reply}
                                blogId={blogId}
                                onDelete={(id) => setReplies(prev => prev.filter(r => r._id !== id))}
                            />
                        ))}
                        {hasMoreReplies && (
                            <button
                                className="comment-action-btn"
                                onClick={() => fetchReplies(repliesSkip, true)}
                            >
                                Load more replies
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const CommentSection = ({ blogId }) => {
    const { user }  = useAuth();
    const router    = useRouter();
    const [comments,    setComments]    = useState([]);
    const [loading,     setLoading]     = useState(true);
    const [hasMore,     setHasMore]     = useState(false);
    const [skip,        setSkip]        = useState(0);
    const [total,       setTotal]       = useState(0);
    const [input,       setInput]       = useState("");
    const [submitting,  setSubmitting]  = useState(false);

    const fetchComments = useCallback(async (skipVal = 0, append = false) => {
        try {
            !append && setLoading(true);
            const res = await axiosInstance.get(`/comment/${blogId}`, {
                params: { limit: LIMIT, skip: skipVal }
            });
            if (res.data.success) {
                setComments(prev => append ? [...prev, ...res.data.data] : res.data.data);
                setHasMore(res.data.hasMore);
                setTotal(res.data.total);
                setSkip(skipVal + res.data.data.length);
            }
        } catch {
            toast.error("Failed to load comments");
        } finally {
            setLoading(false);
        }
    }, [blogId]);

    useEffect(() => {
        if (blogId) fetchComments(0);
    }, [blogId]);

    const handleSubmit = async () => {
        if (!user) {
            toast.error("Please login to comment");
            router.push("/login");
            return;
        }
        if (!input.trim()) return;

        setSubmitting(true);
        try {
            const res = await axiosInstance.post(`/comment/${blogId}`, {
                content: input.trim()
            });
            if (res.data.success) {
                setComments(prev => [res.data.data, ...prev]);
                setTotal(prev => prev + 1);
                setInput("");
                toast.success("Comment added");
            }
        } catch {
            toast.error("Failed to add comment");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="comment-section">
            <h3 className="comment-section-title">
                Comments {total > 0 && <span className="comment-count">{total}</span>}
            </h3>

            <div className="comment-input-wrap">
                <textarea
                    className="comment-textarea"
                    placeholder={user ? "Write a comment..." : "Login to comment"}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    maxLength={500}
                    rows={2}
                    disabled={!user}
                />
                <div className="comment-input-footer">
                    <span className="comment-char-count">{input.length}/500</span>
                    <button
                        className="comment-submit-btn"
                        onClick={handleSubmit}
                        disabled={submitting || !input.trim() || !user}
                    >
                        {submitting ? "Posting..." : "Post"}
                    </button>
                </div>
            </div>

            {loading && <p className="comment-loading">Loading comments...</p>}

            {!loading && comments.length === 0 && (
                <p className="comment-empty">No comments yet. Be the first!</p>
            )}

            {comments.map(comment => (
                <CommentItem
                    key={comment._id}
                    comment={comment}
                    blogId={blogId}
                    onDelete={(id) => {
                        setComments(prev => prev.filter(c => c._id !== id));
                        setTotal(prev => prev - 1);
                    }}
                />
            ))}

            {hasMore && (
                <button
                    className="load-more-btn"
                    onClick={() => fetchComments(skip, true)}
                >
                    Load more comments
                </button>
            )}
        </div>
    );
};

export default CommentSection;