"use client"
import { useRouter } from "next/navigation"

const Header=()=>{
    const router=useRouter();
    return(
        <div style={{display: "flex"}}>
            Header
            <button onClick={()=>router.push("/login")}>
                Login
            </button>
            <div>Logout</div>
        </div>
    )
}

export default Header;