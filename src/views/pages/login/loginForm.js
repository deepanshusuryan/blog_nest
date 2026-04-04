"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/common/AuthContext";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import "../../../styles/login-form.css";

const LoginForm = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const { emailLogin } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const [errors, setErrors] = useState({ email: "", password: "" });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleShowPassword = () => {
        setShowPassword(true);
        setTimeout(() => setShowPassword(false), 2000);
    };

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

            {/* ── LEFT PANEL ── */}
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

                <div className="login-quotes">
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
                </div>
            </div>

            {/* ── RIGHT PANEL ── */}
            <div className="login-right">
                <div className="login-form-wrapper">

                    <div className="login-heading">
                        <h1>Sign in to your nest</h1>
                        <p>Good to have you back. Let's get writing.</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="auth-field">
                            <label htmlFor="login-email">Email address</label>
                            <div className="auth-input-wrap">
                                <input
                                    type="text"
                                    id="login-email"
                                    placeholder="you@example.com"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    autoComplete="email"
                                />
                            </div>
                            {errors.email && <small className="auth-field-error">{errors.email}</small>}
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
                            {errors.password && <small className="auth-field-error">{errors.password}</small>}
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