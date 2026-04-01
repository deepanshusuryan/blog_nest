"use client"
import { useRouter } from "next/navigation"
import { useAuth } from "../AuthContext";
import { toast } from "react-toastify";

const Header = () => {
    const router = useRouter();
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        try {
            const res = await logout();
            if (res?.success) {
                toast.success(res.message);
                router.push("/login");
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div style={{ display: "flex" }}>
            Header
            {user ? (
                <button onClick={handleLogout}>Logout</button>
            ) : (
                <button onClick={() => router.push("/login")}>Login</button>
            )}
        </div>
    )
}

export default Header;