// app/blog/layout.js
import { SideNav } from "../../common/sideNav"
export default function BlogLayout({ children }) {
    return (
        <div style={{ display: "flex" }}>
            <SideNav />
            <div style={{ flex: 1 }}>
                {children}
            </div>
        </div>
    );
}