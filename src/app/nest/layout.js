import { PrivateRoute } from "@/common/ProtectedRoutes";
import "../../styles/profile.css"

export default function BlogLayout({ children }) {
    return (
        <PrivateRoute>
            {children}
        </PrivateRoute>
    );
}