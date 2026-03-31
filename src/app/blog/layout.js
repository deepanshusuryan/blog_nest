import { PrivateRoute } from "@/common/ProtectedRoutes";
import { SideNav } from "../../common/sideNav"
export default function BlogLayout({ children }) {
    return (
        <PrivateRoute>
            <div style={{ display: "flex" }}>
                <SideNav />
                <div style={{ flex: 1 }}>
                    {children}
                </div>
            </div>
        </PrivateRoute>
    );
}