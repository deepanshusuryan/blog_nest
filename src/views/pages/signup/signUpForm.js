"use client";
import axiosInstance from "@/services/axiosInstance";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import "../../../styles/signup-form.css";
import { useDebounce } from "@/utils/useDebounce";

const SignUpForm = () => {
    const router = useRouter();

    const [form, setForm] = useState({
        name: "",
        email: "",
        username: "",
        contact: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({
        name: "",
        username:"",
        email: "",
        contact: "",
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [usernameStatus, setUsernameStatus] = useState("");
    const [checkingUsername, setCheckingUsername] = useState(false);
    const debouncedUsername = useDebounce(form.username, 500);
    const [suggestions, setSuggestions] = useState([]);

    const handleShowPassword = () => {
        setShowPassword(true);
        setTimeout(() => setShowPassword(false), 2000);
    };

    const handleShowConfirmPassword = () => {
        setShowConfirmPassword(true);
        setTimeout(() => setShowConfirmPassword(false), 2000);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "contact") {
            if (!/^\d*$/.test(value)) return;
            if (value.length > 10) return;
        }

        const updatedForm = { ...form, [name]: value };
        setForm(updatedForm);

        // 🔥 single validation call
        const errorMsg = validateField(name, value, updatedForm);

        setErrors((prev) => ({
            ...prev,
            [name]: errorMsg
        }));
    };


    useEffect(() => {
        if (!debouncedUsername) {
            setUsernameStatus("");
            return;
        }

        const error = validateField("username", debouncedUsername, form);
        if (error) {
            setUsernameStatus("");
            setSuggestions([]);
            return;
        }

        const checkUsername = async () => {
            try {
                setCheckingUsername(true);

                const res = await axiosInstance.get(
                    `/user/check-username?username=${debouncedUsername}`
                );

                if (res.data.available) {
                    setUsernameStatus("available");
                    setSuggestions([]);
                    setErrors((prev) => ({ ...prev, username: "" }));
                } else {
                    setUsernameStatus("taken");
                    setSuggestions(res.data.suggestions || []);
                }
            } catch (err) {
                setUsernameStatus("");
            } finally {
                setCheckingUsername(false);
            }
        };

        checkUsername();
    }, [debouncedUsername]);

    const validateField = (name, value, form) => {
        switch (name) {
            case "name":
                if (!value.trim()) return "Name is required";
                return "";

            case "username":
                if (!value.trim()) return "Username is required";
                if (!/^[a-z0-9_]{3,20}$/.test(value))
                    return "Username must be 3–20 chars, lowercase, no spaces";
                return "";

            case "email":
                if (!value.trim()) return "Email is required";
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
                    return "Enter a valid email";
                return "";

            case "contact":
                if (!value.trim()) return "Contact number is required";
                if (!/^\d{10}$/.test(value))
                    return "Enter a valid 10-digit number";
                return "";

            case "password":
                if (!value) return "Password is required";
                if (value.length < 8) return "Min 8 characters required";
                if (!/[a-z]/.test(value)) return "Include lowercase";
                if (!/[A-Z]/.test(value)) return "Include uppercase";
                if (!/\d/.test(value)) return "Include number";
                if (!/[@$!%*?&]/.test(value)) return "Include special char";
                return "";

            case "confirmPassword":
                if (!value) return "Please confirm password";
                if (value !== form.password) return "Passwords do not match";
                return "";

            default:
                return "";
        }
    };

    const signUpValidation = () => {
        let newErrors = {};
        let isValid = true;

        Object.keys(form).forEach((key) => {
            const error = validateField(key, form[key], form);
            if (error) isValid = false;
            newErrors[key] = error;
        });

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!signUpValidation()) return;

        try {
            const response = await axiosInstance.post("/user/create", {
                name: form.name,
                username: form.username,
                email: form.email,
                contact: form.contact,
                password: form.password,
            });

            if (response.data.success) {
                toast.success(response.data.message || "Registration successful");
                router.push("/login");
            } else {
                toast.error(response.data.message || "User creation failed");
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
    };

    return (
        <div className="signup-page">

            {/* ── LEFT PANEL ── */}
            <div className="signup-left">
                <a className="auth-logo" href="/">
                    <div className="auth-logo-icon">B</div>
                    <span className="auth-logo-text">Blog<span>Nest</span></span>
                </a>

                <div className="signup-hero">
                    <div className="signup-hero-eyebrow">Start for free today</div>
                    <h2>
                        Your first story<br />
                        <em>starts here.</em>
                    </h2>
                    <p>
                        Join thousands of writers who craft, share, and grow their audience on BlogNest.
                    </p>
                </div>

                <div className="signup-steps">
                    <div className="signup-step">
                        <div className="signup-step-num">1</div>
                        <div className="signup-step-body">
                            <strong>Create your account</strong>
                            <p>Sign up in under a minute — no credit card needed.</p>
                        </div>
                    </div>
                    <div className="signup-step">
                        <div className="signup-step-num">2</div>
                        <div className="signup-step-body">
                            <strong>Set up your nest</strong>
                            <p>Personalise your profile and choose your topics.</p>
                        </div>
                    </div>
                    <div className="signup-step">
                        <div className="signup-step-num">3</div>
                        <div className="signup-step-body">
                            <strong>Publish your first story</strong>
                            <p>Write in our distraction-free editor and share instantly.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── RIGHT PANEL ── */}
            <div className="signup-right">
                <div className="signup-form-wrapper">

                    <div className="signup-heading">
                        <h1>Create your account</h1>
                        <p>It's free forever. No credit card required.</p>
                    </div>

                    <form onSubmit={handleSubmit}>

                        {/* Name + Contact — two column */}
                        <div className="auth-field-row">
                            <div className="auth-field">
                                <label htmlFor="su-name">Full name</label>
                                <div className="auth-input-wrap">
                                    <input
                                        type="text"
                                        id="su-name"
                                        placeholder="Jane Doe"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        autoComplete="name"
                                    />
                                </div>
                                {errors.name && <small className="auth-field-error">{errors.name}</small>}
                            </div>

                            <div className="auth-field">
                                <label htmlFor="su-contact">Phone number</label>
                                <div className="auth-input-wrap">
                                    <input
                                        type="text"
                                        id="su-contact"
                                        placeholder="10-digit number"
                                        name="contact"
                                        value={form.contact}
                                        onChange={handleChange}
                                        autoComplete="tel"
                                    />
                                </div>
                                {errors.contact && <small className="auth-field-error">{errors.contact}</small>}
                            </div>
                        </div>

                        <div className="auth-field">
                            <label htmlFor="su-username">Username</label>
                            <div className="auth-input-wrap">
                                <input
                                    type="text"
                                    id="su-username"
                                    placeholder="user-name"
                                    name="username"
                                    value={form.username}
                                    onChange={handleChange}
                                    autoComplete="username"
                                />
                            </div>
                            {errors.username && <small className="auth-field-error">{errors.username}</small>}
                            {checkingUsername && (
                                <small className="auth-field-info">Checking...</small>
                            )}

                            {!errors.username && usernameStatus === "available" && (
                                <small style={{ color: "green" }}>✅ Username available</small>
                            )}

                            {!errors.username && usernameStatus === "taken" && (
                                <small style={{ color: "red" }}>❌ Username already taken</small>
                            )}
                            {!errors.username && suggestions.length > 0 && (
                                <div className="username-suggestions">
                                    <small>Try:</small>
                                    <div>
                                        {suggestions.map((sug, i) => (
                                            <span
                                                key={i}
                                                onClick={() =>
                                                    setForm({ ...form, username: sug })
                                                }
                                                style={{
                                                    cursor: "pointer",
                                                    marginRight: "8px",
                                                    color: "#2563eb"
                                                }}
                                            >
                                                {sug}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Email */}
                        <div className="auth-field">
                            <label htmlFor="su-email">Email address</label>
                            <div className="auth-input-wrap">
                                <input
                                    type="text"
                                    id="su-email"
                                    placeholder="you@example.com"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    autoComplete="email"
                                />
                            </div>
                            {errors.email && <small className="auth-field-error">{errors.email}</small>}
                        </div>

                        {/* Password */}
                        <div className="auth-field">
                            <label htmlFor="su-password">Password</label>
                            <div className="auth-input-wrap">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="su-password"
                                    placeholder="Min. 8 characters"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    className="with-icon"
                                    autoComplete="new-password"
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

                        {/* Confirm Password */}
                        <div className="auth-field">
                            <label htmlFor="su-confirm">Confirm password</label>
                            <div className="auth-input-wrap">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="su-confirm"
                                    placeholder="Confirm your password"
                                    name="confirmPassword"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    className="with-icon"
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    className="auth-eye-btn"
                                    onClick={handleShowConfirmPassword}
                                    aria-label="Toggle confirm password visibility"
                                >
                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            {errors.confirmPassword && <small className="auth-field-error">{errors.confirmPassword}</small>}
                        </div>

                        <button type="submit" className="auth-submit-btn">
                            Create account →
                        </button>
                    </form>

                    <div className="auth-divider">or</div>

                    <button className="auth-google-btn">
                        <FcGoogle style={{ fontSize: "18px" }} />
                        Continue with Google
                    </button>

                    <div className="auth-footer-text">
                        Already have an account?{" "}
                        <span onClick={() => router.push("/login")}>Sign in</span>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default SignUpForm;