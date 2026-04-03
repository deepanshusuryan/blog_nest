import { PrivateRoute } from "@/common/ProtectedRoutes";
export default function BlogLayout({ children }) {
    return (
        <PrivateRoute>
            {children}
        </PrivateRoute>
    );
}