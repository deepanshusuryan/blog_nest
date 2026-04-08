"use client";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../AuthContext";
import "../../styles/admin-sidebar.css";

const navItems = [
    { label: "Dashboard", path: "/admin", section: "General" },
    { label: "Users", path: "/admin/users", section: "General" },
    { label: "Blogs", path: "/admin/blogs", section: "Content" },
    { label: "Categories", path: "/admin/categories", section: "Content" },
    { label: "Tags", path: "/admin/tags", section: "Content" },
    { label: "Comments", path: "/admin/comments", section: "Engagement" },
    { label: "Reports", path: "/admin/reports", section: "Engagement", badge: 3 },
    { label: "Settings", path: "/admin/settings", section: "System" },
];

const sections = ["General", "Content", "Engagement", "System"];

const AdminSidebar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { user, logout } = useAuth();

    return (
        <aside className="admin-sidebar">
            <div className="sidebar-logo">
                <div className="sidebar-logo-title">Blog Nest</div>
                <div className="sidebar-logo-sub">Admin Panel</div>
            </div>

            <nav className="sidebar-nav">
                {sections.map(section => (
                    <div key={section}>
                        <div className="sidebar-section-label">{section}</div>
                        {navItems.filter(i => i.section === section).map(item => (
                            <div
                                key={item.path}
                                onClick={() => router.push(item.path)}
                                className={`sidebar-nav-item ${pathname === item.path ? "active" : ""}`}
                            >
                                {item.label}
                                {item.badge && (
                                    <span className="sidebar-badge">{item.badge}</span>
                                )}
                            </div>
                        ))}
                    </div>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="sidebar-user">
                    <div className="sidebar-avatar">
                        {user?.name?.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                        <div className="sidebar-user-name">{user?.name}</div>
                        <div className="sidebar-user-role">{user?.role}</div>
                    </div>
                </div>
                <button onClick={logout} className="sidebar-logout-btn">
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;