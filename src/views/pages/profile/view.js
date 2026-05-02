"use client";

import { useAuth } from "@/common/AuthContext";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axiosInstance from "@/services/axiosInstance";

const FieldRow = ({ label, value, icon, editing, name }) => (
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
                name={name}
            />
        ) : (
            <span className="profile-field-value">
                {value || <em className="profile-field-empty">Not set</em>}
            </span>
        )}
    </div>
);

const StatCell = ({ value, label }) => (
    <div className="profile-stat">
        <span className="profile-stat-value">{value}</span>
        <span className="profile-stat-label">{label}</span>
    </div>
);

const IconUser = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

const IconMail = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
    </svg>
);

const IconPhone = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.55 1.25h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.79a16 16 0 0 0 6 6l.86-.86a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16z" />
    </svg>
);

const IconActivity = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
);

const IconEdit = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);

const IconLogout = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
);

const IconCalendar = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);

const Profile = ({ id }) => {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [getUser, setUser] = useState(null);
    const [activeNav, setActiveNav] = useState("profile");

    const fetchUser = async () => {
        try {
            const response = await axiosInstance.get(`/user/getuser/${id}`);
            if (response.data.success) {
                setUser(response.data.user);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchUser();
    }, [id]);

    // supports either user._id or user.id
    const isOwnProfile = useMemo(() => {
        const loggedInUserId = user?._id || user?.id;
        const profileUserId = getUser?._id;
        return loggedInUserId && profileUserId && String(loggedInUserId) === String(profileUserId);
    }, [user, getUser]);

    const navItems = useMemo(() => {
        if (isOwnProfile) {
            return [
                {
                    label: "My Space",
                    items: [
                        {
                            key: "profile",
                            text: "Profile",
                            icon: (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            ),
                        },
                        {
                            key: "my-blogs",
                            text: "My Blogs",
                            icon: (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                    <line x1="16" y1="13" x2="8" y2="13" />
                                    <line x1="16" y1="17" x2="8" y2="17" />
                                </svg>
                            ),
                            href: (profileUser) => `/nest/profile/${profileUser?._id}/userblogs`,
                        },
                        {
                            key: "write",
                            text: "Write a Blog",
                            icon: (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 20h9" />
                                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                                </svg>
                            ),
                            href: "/nest/blog/write",
                        },
                        {
                            key: "saved",
                            text: "Saved",
                            icon: (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                                </svg>
                            ),
                            href: "/nest/saved",
                        },
                    ],
                },
            ];
        }

        return [
            {
                label: `${getUser?.name || "User"}'s Space`,
                items: [
                    {
                        key: "user-blogs",
                        text: `${getUser?.name || "User"} Blogs`,
                        icon: (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                                <line x1="16" y1="13" x2="8" y2="13" />
                                <line x1="16" y1="17" x2="8" y2="17" />
                            </svg>
                        ),
                        href: (profileUser) => `/nest/profile/${profileUser?._id}/userblogs`,
                    },
                ],
            },
        ];
    }, [isOwnProfile, getUser]);

    const initials = getUser?.name
        ? getUser.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
        : "?";

    const handleLogout = async () => {
        try {
            const res = await logout();
            if (res?.success) {
                toast.success(res.message);
                router.push("/");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleNavClick = (item) => {
        setActiveNav(item.key);

        if (item.href) {
            const path =
                typeof item.href === "function"
                    ? item.href(getUser)
                    : item.href;

            router.push(path);
        }
    };

    return (
        <div className="profile-root">
            <aside className="profile-sidebar">
                <div className="sidebar-user">
                    <div className="sidebar-avatar">
                        {initials}
                        <span className="sidebar-status-dot" />
                    </div>
                    <span className="sidebar-user-name">{getUser?.name || "Anonymous"}</span>
                    <span className="sidebar-user-role">Writer</span>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map((group) => (
                        <div key={group.label}>
                            <p className="sidebar-nav-label">{group.label}</p>
                            {group.items.map((item) => (
                                <button
                                    key={item.key}
                                    className={`sidebar-nav-item${activeNav === item.key ? " active" : ""}`}
                                    onClick={() => handleNavClick(item)}
                                >
                                    {item.icon}
                                    {item.text}
                                </button>
                            ))}
                        </div>
                    ))}
                </nav>

                {isOwnProfile && (
                    <div className="sidebar-footer">
                        <button className="sidebar-nav-item danger" onClick={handleLogout}>
                            <IconLogout />
                            Logout
                        </button>
                    </div>
                )}
            </aside>

            <main className="profile-main">
                <div className="profile-page-heading">
                    <h1>
                        {isOwnProfile ? (
                            <>
                                Your <em style={{ fontStyle: "italic", color: "var(--color-amber)" }}>Nest</em>
                            </>
                        ) : (
                            <>
                                {getUser?.name}'s{" "}
                                <em style={{ fontStyle: "italic", color: "var(--color-amber)" }}>Nest</em>
                            </>
                        )}
                    </h1>
                    <p>
                        {isOwnProfile
                            ? "Manage your profile and account details."
                            : `Viewing ${getUser?.name || "this user"}'s profile.`}
                    </p>
                </div>

                <div className="profile-hero-card">
                    <div className="profile-avatar-wrap">
                        <div className="profile-avatar">
                            <span className="profile-avatar-initials">{initials}</span>
                        </div>
                        <span className="profile-status-dot" title="Active" />
                    </div>

                    <div className="profile-hero-info">
                        <p className="profile-eyebrow">{isOwnProfile ? "Your Nest" : `${getUser?.name}'s Nest`}</p>
                        <h2 className="profile-name">{getUser?.name || "Anonymous Writer"}</h2>
                        <p className="profile-tagline">
                            {getUser?.bio || "Crafting stories, one word at a time."}
                        </p>
                    </div>

                    {isOwnProfile && (
                        <button className="profile-edit-btn">
                            <IconEdit /> Edit Profile
                        </button>
                    )}
                </div>

                <div className="profile-grid">
                    <div className="profile-card profile-details-card">
                        <h3 className="profile-section-title">
                            <IconUser /> Details
                        </h3>
                        <div className="profile-fields">
                            <FieldRow label="Full name" name="name" value={getUser?.name} icon={<IconUser />} />
                            <FieldRow label="Username" name="username" value={getUser?.username} icon={<IconUser />} />

                            {isOwnProfile && (
                                <>
                                    <FieldRow label="Email" name="email" value={getUser?.email} icon={<IconMail />} />
                                    <FieldRow label="Contact" name="contact" value={getUser?.contact} icon={<IconPhone />} />
                                </>
                            )}
                        </div>
                    </div>

                    <div className="profile-card profile-stats-card">
                        <h3 className="profile-section-title">
                            <IconActivity /> Activity
                        </h3>
                        <div className="profile-stats-grid">
                            <StatCell value={getUser?.postsCount ?? "—"} label="Stories" />
                            <StatCell value={getUser?.followersCount ?? "—"} label="Followers" />
                            <StatCell value={getUser?.followingCount ?? "—"} label="Following" />
                            <StatCell value={getUser?.likesCount ?? "—"} label="Likes" />
                        </div>
                    </div>
                </div>

                {getUser?.createdAt && (
                    <p className="profile-joined">
                        <IconCalendar />
                        Member since{" "}
                        {new Date(getUser.createdAt).toLocaleDateString("en-US", {
                            month: "long",
                            year: "numeric",
                        })}
                    </p>
                )}
            </main>
        </div>
    );
};

export default Profile;
