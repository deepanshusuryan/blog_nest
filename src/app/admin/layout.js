import { AdminRoute } from "@/common/ProtectedRoutes";

export default function AdminLayout({ children }) {
    return (
        <AdminRoute>
            {children}
        </AdminRoute>
    );
}