"use client";

import AdminSidebar from "@/common/admin/sideNav";
import "../../../styles/admin-categories.css"


export default function AdminLayout({ children }) {
    return (
        <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "var(--color-background-tertiary)" }}>
            <AdminSidebar />
            <main style={{ flex: 1, overflowY: "auto" }}>
                {children}
            </main>
        </div>
    );
}