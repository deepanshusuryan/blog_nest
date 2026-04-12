import { PrivateRoute } from "@/common/ProtectedRoutes";
import "../../styles/profile.css"
import "../../styles/blog.css"
import "../../styles/explore.css"

export default function BlogLayout({ children }) {
    return (
        <PrivateRoute>
            {children}
        </PrivateRoute>
    );
}