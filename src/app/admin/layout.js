import AdminSidebar from "@/common/admin/sideNav";
import { AdminRoute } from "@/common/ProtectedRoutes";
import "@/styles/admin-layout.css";
import "@/styles/admin/admin-category.css";

export default function AdminLayout({ children }) {
    return (
        <AdminRoute>
            <div className="admin-root">
                <div className="admin-layout">
                    <AdminSidebar />
                    <div className="admin-content">
                        <div className="admin-page">{children}</div>
                    </div>
                </div>
            </div>
        </AdminRoute>
    );
}