"use client"

import { useAuth } from "@/common/AuthContext";
import { useState } from "react";

const Profile = () => {
    const { user } = useAuth();
    const [editing, setEditing] = useState(false);

    const initials = user?.name
        ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
        : "?";

    return (
        <div className="profile-root">
            {/* Background grain texture */}
            <div className="profile-bg-grain" />

            <div className="profile-container">

                {/* ── Header Card ── */}
                <div className="profile-card profile-hero-card">
                    <div className="profile-hero-accent" />

                    <div className="profile-avatar-wrap">
                        <div className="profile-avatar">
                            <span className="profile-avatar-initials">{initials}</span>
                        </div>
                        <span className="profile-status-dot" title="Active" />
                    </div>

                    <div className="profile-hero-info">
                        <p className="profile-eyebrow">Your Nest</p>
                        <h1 className="profile-name">{user?.name || "Anonymous Writer"}</h1>
                        <p className="profile-tagline">{user?.bio || "Crafting stories, one word at a time."}</p>
                    </div>

                    <button
                        className="profile-edit-btn"
                        onClick={() => setEditing((v) => !v)}
                    >
                        {editing ? (
                            <>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                Done
                            </>
                        ) : (
                            <>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                Edit Profile
                            </>
                        )}
                    </button>
                </div>

                {/* ── Info Grid ── */}
                <div className="profile-grid">

                    {/* Contact Details */}
                    <div className="profile-card profile-details-card">
                        <h2 className="profile-section-title">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                            Details
                        </h2>

                        <div className="profile-fields">
                            <FieldRow
                                label="Full name"
                                value={user?.name}
                                icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>}
                                editing={editing}
                            />
                            <FieldRow
                                label="Username"
                                value={user?.username}
                                icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>}
                                editing={editing}
                            />
                            <FieldRow
                                label="Email"
                                value={user?.email}
                                icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>}
                                editing={editing}
                            />
                            <FieldRow
                                label="Contact"
                                value={user?.contact}
                                icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.55 1.25h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.79a16 16 0 0 0 6 6l.86-.86a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16z" /></svg>}
                                editing={editing}
                            />
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="profile-card profile-stats-card">
                        <h2 className="profile-section-title">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
                            Activity
                        </h2>
                        <div className="profile-stats-grid">
                            <StatCell value={user?.postsCount ?? "—"} label="Stories" />
                            <StatCell value={user?.followersCount ?? "—"} label="Followers" />
                            <StatCell value={user?.followingCount ?? "—"} label="Following" />
                            <StatCell value={user?.likesCount ?? "—"} label="Likes" />
                        </div>
                    </div>

                </div>

                {/* ── Joined Badge ── */}
                {user?.createdAt && (
                    <p className="profile-joined">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                        Member since {new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                    </p>
                )}

            </div>
        </div>
    );
};

/* ── Field Row ── */
const FieldRow = ({ label, value, icon, editing }) => (
    <div className="profile-field">
        <span className="profile-field-label">
            {icon}
            {label}
        </span>
        {editing ? (
            <input
                className="profile-field-input"
                defaultValue={value || ""}
                placeholder={`Enter ${label.toLowerCase()}`}
            />
        ) : (
            <span className="profile-field-value">{value || <em className="profile-field-empty">Not set</em>}</span>
        )}
    </div>
);

/* ── Stat Cell ── */
const StatCell = ({ value, label }) => (
    <div className="profile-stat">
        <span className="profile-stat-value">{value}</span>
        <span className="profile-stat-label">{label}</span>
    </div>
);

export default Profile;