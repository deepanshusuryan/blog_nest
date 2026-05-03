"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/common/AuthContext";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import "../../../styles/login-form.css";

const LoginForm = () => {
    const [formData, setFormData] = useState({ identifier: "", password: "" });
    const { emailLogin } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const [errors, setErrors] = useState({ identifier: "", password: "" });

    const handleShowPassword = () => {
        setShowPassword(true);
        setTimeout(() => setShowPassword(false), 4000);
    };

    const validateField = (name, value) => {
        switch (name) {
            case "identifier":
                if (!value.trim()) return "Email or username is required";
                if (value.includes("@") && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
                    return "Enter a valid email address";
                if (!value.includes("@") && value.trim().length < 3)
                    return "Username must be at least 3 characters";
                return "";

            case "password":
                if (!value) return "Password is required";
                if (value.length < 8) return "Min 8 characters required";
                if (!/[a-z]/.test(value)) return "Include lowercase";
                if (!/[A-Z]/.test(value)) return "Include uppercase";
                if (!/\d/.test(value)) return "Include number";
                if (!/[@$!%*?&]/.test(value)) return "Include special char";
                return "";

            default:
                return "";
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        const errorMsg = validateField(name, value);
        setErrors((prev) => ({ ...prev, [name]: errorMsg }));
    };

    const loginValidation = () => {
        let newErrors = {};
        let isValid = true;

        Object.keys(formData).forEach((key) => {
            const error = validateField(key, formData[key]);
            if (error) isValid = false;
            newErrors[key] = error;
        });

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!loginValidation()) return;

        try {
            const data = await emailLogin(formData.identifier, formData.password);
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
        <div className="login-page">
            <div className="login-left">
                <a className="auth-logo" href="/">
                    <div className="auth-logo-icon">B</div>
                    <span className="auth-logo-text">Blog<span>Nest</span></span>
                </a>

                <div className="login-hero">
                    <div className="login-hero-eyebrow">For writers, by writers</div>
                    <h2>
                        Welcome<br />
                        <em>back.</em>
                    </h2>
                    <p>
                        Your stories, your readers, your nest — pick up exactly where you left off.
                    </p>
                </div>
                <div></div>
                {/* <div className="login-quotes">
                    <div className="quote-card">
                        <p>"BlogNest helped me grow from 0 to 12,000 readers in three months."</p>
                        <div className="quote-author">
                            <div className="quote-avatar" style={{ background: "var(--color-amber)" }}>A</div>
                            <span className="quote-name">Ananya Mehta · Tech Writer</span>
                        </div>
                    </div>
                    <div className="quote-card">
                        <p>"The cleanest writing experience I've found. Nothing gets in the way of the words."</p>
                        <div className="quote-author">
                            <div className="quote-avatar" style={{ background: "var(--color-ink-light)" }}>R</div>
                            <span className="quote-name">Rahul Sharma · Culture & Design</span>
                        </div>
                    </div>
                </div> */}
            </div>

            <div className="login-right">
                <div className="login-form-wrapper">

                    <div className="login-heading">
                        <h1>Sign in to your nest</h1>
                        <p>Good to have you back. Let's get writing.</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="auth-field">
                            <label htmlFor="login-identifier">Email or Username</label>
                            <div className="auth-input-wrap">
                                <input
                                    type="text"
                                    id="login-identifier"
                                    placeholder="you@example.com or username"
                                    name="identifier"
                                    value={formData.identifier}
                                    onChange={handleChange}
                                    autoComplete="username"
                                />
                            </div>
                            {errors.identifier && (
                                <small className="auth-field-error">{errors.identifier}</small>
                            )}
                        </div>

                        <div className="auth-field">
                            <label htmlFor="login-password">Password</label>
                            <div className="auth-input-wrap">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="login-password"
                                    placeholder="Min. 8 characters"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="with-icon"
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    className="auth-eye-btn"
                                    onClick={handleShowPassword}
                                    aria-label="Toggle password visibility"
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            {errors.password && (
                                <small className="auth-field-error">{errors.password}</small>
                            )}
                        </div>

                        <button type="submit" className="auth-submit-btn">
                            Sign in →
                        </button>
                    </form>

                    <div className="auth-divider">or</div>

                    <button className="auth-google-btn">
                        <FcGoogle style={{ fontSize: "18px" }} />
                        Continue with Google
                    </button>

                    <div className="auth-footer-text">
                        Don't have an account?{" "}
                        <span onClick={() => router.push("/signup")}>Sign up</span>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default LoginForm;