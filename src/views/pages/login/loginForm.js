"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/common/AuthContext";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

const LoginForm = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const { emailLogin } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleShowPassword = () => {
        setShowPassword(true);
        setTimeout(() => setShowPassword(false), 2000);
    };

    const [errors, setErrors] = useState({
        email: "",
        password: "",
    });

    const loginValidation = () => {
        let newErrors = {};
        let isValid = true;

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Enter a valid email";
            isValid = false;
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
            isValid = false;
        } else if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
            isValid = false;
        } else if (!/[a-z]/.test(formData.password)) {
            newErrors.password = "Password must include at least one lowercase letter";
        } else if (!/[A-Z]/.test(formData.password)) {
            newErrors.password = "Password must include at least one uppercase letter";
        } else if (!/\d/.test(formData.password)) {
            newErrors.password = "Password must include at least one number";
        } else if (!/[@$!%*?&]/.test(formData.password)) {
            newErrors.password = "Password must include at least one special character";
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!loginValidation()) return;

        try {
            const data = await emailLogin(formData.email, formData.password);
            console.log("data", data);
            if (data?.success) {
                toast.success(data.message);
                router.push("/nest");
            } else {
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
                    {errors.email && <small style={{ color: "red" }}>{errors.email}</small>}
                </div>
                <div>
                    <label>Password</label>
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <span
                        onClick={handleShowPassword}
                        style={{ cursor: "pointer" }}
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                    {errors.password && <small style={{ color: "red" }}>{errors.password}</small>}
                </div>
                <button type="submit">Login</button>
            </form>
            {/* <div style={{cursor: "pointer"}}>
                <FcGoogle />Continue with google
            </div> */}
            <div>
                <small>Don't have an account <span onClick={() => router.push("/signup")} style={{ cursor: "pointer" }}>Sign up</span></small>
            </div>
        </div>
    );
};

export default LoginForm;