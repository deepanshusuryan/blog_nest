"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/common/AuthContext";
import { toast } from "react-toastify";
import { FcGoogle } from "react-icons/fc";

const LoginForm = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const { emailLogin } = useAuth();
    const router = useRouter();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await emailLogin(formData.email, formData.password);
            console.log("data",data);
            if (data?.success) {
                toast.success(data.message);
                router.push("/blog");
            } else{
                toast.error(data.message);
            }
        } catch (error) {
            console.log("Error while login", error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email</label>
                    <input
                        type="text"
                        placeholder="Enter email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        placeholder="Enter password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Login</button>
            </form>
            <div style={{cursor: "pointer"}}>
                <FcGoogle />Continue with google
            </div>
            <div>
                <small>Don't have an account <span onClick={()=>router.push("/signup")} style={{cursor: "pointer"}}>Sign up</span></small>
            </div>
        </div>
    );
};

export default LoginForm;