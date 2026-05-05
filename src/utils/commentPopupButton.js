"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import CommentSection from "./commentSection";

const CommentPopupButton = ({ blogId, commentsCount }) => {
    const [open, setOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!open) return;
        const handleKeyDown = (e) => {
            if (e.key === "Escape") setOpen(false);
        };
        document.addEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [open]);

    const modal = open ? (
        <div className="status-modal-overlay" onClick={() => setOpen(false)} style={{ zIndex: 999999 }}>
            <div
                className="status-modal"
                onClick={(e) => e.stopPropagation()}
                style={{ maxWidth: '600px', maxHeight: '85vh', overflowY: 'auto', padding: '24px', alignItems: 'stretch', textAlign: 'left' }}
            >
                <div style={{ display: 'flex', justifyContent: 'flex-end', position: 'relative', zIndex: 10 }}>
                    <button 
                        onClick={(e) => { e.stopPropagation(); setOpen(false); }}
                        type="button"
                        style={{ background: 'none', border: 'none', color: 'var(--color-muted)', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        aria-label="Close"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div style={{ marginTop: '-20px' }}>
                    <CommentSection blogId={blogId} />
                </div>
            </div>
        </div>
    ) : null;

    return (
        <>
            <button
                className="like-btn"
                onClick={() => setOpen(true)}
                title="Comments"
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <span style={{ marginLeft: '4px' }}>Comment</span>
            </button>
            {mounted && createPortal(modal, document.body)}
        </>
    );
};

export default CommentPopupButton;
