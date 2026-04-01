"use client"
import axiosInstance from "@/services/axiosInstance";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";


const SignUpForm = () => {

    const router = useRouter();
    const [form, setForm] = useState({
        name: "",
        email: "",
        contact: "",
        password: "",
        confirmPassword: ""
    });

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        contact: "",
        password: "",
        confirmPassword: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const handleShowPassword = () => {
        setShowPassword(true);
        setTimeout(() => setShowPassword(false), 3000);
    };

    const handleShowConfirmPassword = () => {
        setShowConfirmPassword(true);
        setTimeout(() => setShowConfirmPassword(false), 3000);
    };

    const signUpValidation = () => {
        let newErrors = {};
        let isValid = true;

        if (!form.name.trim()) {
            newErrors.name = "Name is required";
            isValid = false;
        }

        if (!form.email.trim()) {
            newErrors.email = "Email is required";
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            newErrors.email = "Enter a valid email";
            isValid = false;
        }

        if (!form.contact.trim()) {
            newErrors.contact = "Contact number is required";
            isValid = false;
        } else if (!/^\d{10}$/.test(form.contact)) {
            newErrors.contact = "Enter a valid 10 digit contact number";
            isValid = false;
        }

        if (!form.password) {
            newErrors.password = "Password is required";
            isValid = false;
        } else if (form.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
            isValid = false;
        } else if (!/[a-z]/.test(form.password)) {
            newErrors.password = "Password must include at least one lowercase letter";
        } else if (!/[A-Z]/.test(form.password)) {
            newErrors.password = "Password must include at least one uppercase letter";
        } else if (!/\d/.test(form.password)) {
            newErrors.password = "Password must include at least one number";
        } else if (!/[@$!%*?&]/.test(form.password)) {
            newErrors.password = "Password must include at least one special character";
        }

        if (!form.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
            isValid = false;
        } else if (form.password !== form.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "contact") {
            if (!/^\d*$/.test(value)) return;
            if (value.length > 10) return;
        }

        setForm({ ...form, [name]: value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!signUpValidation()) return;
        try {
            const response = await axiosInstance.post("/user/create", {
                name: form.name,
                email: form.email,
                contact: form.contact,
                password: form.password
            })
            if (response.data.success) {
                toast.success(response.data.message || "Registration successfull");
                router.push("/login");
            } else {
                toast.error(response.data.message || "User creation failed")
            }
        } catch (error) {
            const status = error.response?.status;
            const message = error.response?.data?.message;

            if (status >= 400 && status < 500) {
                toast.error(message || "Something went wrong");
            } else {
                toast.error("Something went wrong, please try again later");
            }
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Enter name</label>
                    <input type="text" placeholder="Enter Name" name="name" value={form.name} onChange={handleChange} />
                    {errors.name && <small style={{ color: "red" }}>{errors.name}</small>}
                </div>
                <div>
                    <label>Enter email</label>
                    <input type="text" placeholder="Enter email" name="email" value={form.email} onChange={handleChange} />
                    {errors.email && <small style={{ color: "red" }}>{errors.email}</small>}
                </div>
                <div>
                    <label>Enter contact number</label>
                    <input type="text" placeholder="Enter contact number" name="contact" value={form.contact} onChange={handleChange} />
                    {errors.contact && <small style={{ color: "red" }}>{errors.contact}</small>}
                </div>
                <div>
                    <label>Enter password</label>
                    <input type={showPassword ? "text" : "password"} placeholder="Enter password" name="password" value={form.password} onChange={handleChange} />
                    <span
                        onClick={handleShowPassword}
                        style={{ cursor: "pointer" }}
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                    {errors.password && <small style={{ color: "red" }}>{errors.password}</small>}
                </div>
                <div>
                    <label>Enter confirm password</label>
                    <input type={showConfirmPassword ? "text" : "password"} placeholder="Enter confirm password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} />
                    <span
                        onClick={handleShowConfirmPassword}
                        style={{ cursor: "pointer" }}
                    >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                    {errors.confirmPassword && <small style={{ color: "red" }}>{errors.confirmPassword}</small>}
                </div>
                <div>
                    <button type="submit">Submit</button>
                </div>
            </form>
            <div style={{ cursor: "pointer" }}>
                <FcGoogle />Continue with google
            </div>
            <div>
                <small> Already have an account ? <span onClick={() => router.push("/login")} style={{ cursor: "pointer" }}>Login</span></small>
            </div>
        </div>
    )
}

export default SignUpForm;