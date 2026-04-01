import { usePathname } from "next/navigation";
import { Footer } from "../footer"
import Header from "../header"

const authRoutes = ["/login", "/signup"];

export const Layout=({children})=>{
    const pathname = usePathname();
    const isAuthPage = authRoutes.includes(pathname);
    return(
        <div>
            {!isAuthPage && <Header />}
            {children}
            {!isAuthPage && <Footer />}
        </div>
    )
}