import { usePathname } from "next/navigation";
import { Footer } from "../footer";
import Header from "../header";
import { ThemeProvider } from "../ThemeContext";

const authRoutes = ["/login", "/signup"];

export const Layout = ({ children }) => {
    const pathname = usePathname();
    const isAuthPage = authRoutes.includes(pathname);
    const isAdminPage = pathname.startsWith("/admin");

    const content = (
        <>
            {!isAuthPage && !isAdminPage && <Header />}
            {children}
            {!isAuthPage && !isAdminPage && <Footer />}
        </>
    );

    return (
        <div>
            {isAdminPage ? (
                content
            ) : (
                <ThemeProvider>
                    {content}
                </ThemeProvider>
            )}
        </div>
    );
};