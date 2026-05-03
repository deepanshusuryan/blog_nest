"use client";
import { useAuth } from "@/common/AuthContext";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axiosInstance from "@/services/axiosInstance";
import { useDebounce } from "@/utils/useDebounce";

const EditProfile = ({ id }) => {
    const { user: authUser, saveSession } = useAuth();
    const router = useRouter();

    const [form, setForm] = useState({
        name:     "",
        username: "",
        email:    "",
        contact:  "",
    });
    const [errors,   setErrors]   = useState({});
    const [loading,  setLoading]  = useState(false);
    const [fetching, setFetching] = useState(true);

    const [usernameStatus,   setUsernameStatus]   = useState("");
    const [checkingUsername, setCheckingUsername] = useState(false);
    const [suggestions,      setSuggestions]      = useState([]);
    const originalUsername = useRef("");
    const debouncedUsername = useDebounce(form.username, 500);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axiosInstance.get(`/user/getuser/${id}`);
                if (response.data?.success) {
                    const u = response.data.user;
                    originalUsername.current = u.username || "";
                    setForm({
                        name:     u.name     || "",
                        username: u.username || "",
                        email:    u.email    || "",
                        contact:  u.contact  || "",
                    });
                }
            } catch {
                toast.error("Failed to load profile");
            } finally {
                setFetching(false);
            }
        };
        if (id) fetchUser();
    }, [id]);

    useEffect(() => {
        if (!debouncedUsername) { setUsernameStatus(""); return; }

        if (debouncedUsername === originalUsername.current) {
            setUsernameStatus("available");
            setSuggestions([]);
            return;
        }

        const error = validateField("username", debouncedUsername);
        if (error) { setUsernameStatus(""); setSuggestions([]); return; }

        const check = async () => {
            setCheckingUsername(true);
            try {
                const res = await axiosInstance.get(`/user/check-username?username=${debouncedUsername}`);
                if (res.data.available) {
                    setUsernameStatus("available");
                    setSuggestions([]);
                    setErrors(prev => ({ ...prev, username: "" }));
                } else {
                    setUsernameStatus("taken");
                    setSuggestions(res.data.suggestions || []);
                }
            } catch {
                setUsernameStatus("");
            } finally {
                setCheckingUsername(false);
            }
        };
        check();
    }, [debouncedUsername]);

    const validateField = (name, value) => {
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
                if (value && !/^\d{10}$/.test(value))
                    return "Enter a valid 10-digit number";
                return "";
            default:
                return "";
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "contact") {
            if (!/^\d*$/.test(value)) return;
            if (value.length > 10) return;
        }

        setForm(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    };

    const validate = () => {
        const newErrors = {};
        let isValid = true;
        Object.keys(form).forEach(key => {
            const err = validateField(key, form[key]);
            if (err) isValid = false;
            newErrors[key] = err;
        });
        if (usernameStatus === "taken") {
            newErrors.username = "Username is already taken";
            isValid = false;
        }
        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            const response = await axiosInstance.put(`/user/updateuser/${id}`, {
                name:     form.name,
                username: form.username,
                email:    form.email,
                contact:  form.contact,
            });

            if (response.data?.success) {
                toast.success("Profile updated successfully");
                router.push(`/nest/profile/${id}`);
            } else {
                toast.error(response.data?.message || "Update failed");
            }
        } catch (error) {
            const status = error.response?.status;
            if (status >= 400 && status < 500) {
                toast.error(error.response?.data?.message || "Update failed");
            } else {
                toast.error("Something went wrong, please try again later");
            }
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div>Loading...</div>;

    return (
        <div className="edit-profile-root">
            <div className="edit-profile-card">
                <div className="edit-profile-header">
                    <h2>Edit Profile</h2>
                    <p>Update your personal information</p>
                </div>

                <form onSubmit={handleSubmit} className="edit-profile-form">

                    <div className="edit-field-group">
                        <label className="edit-field-label">Full name</label>
                        <input className={`edit-field-input${errors.name ? " edit-field-error" : ""}`}
                            type="text" name="name" value={form.name}
                            onChange={handleChange} placeholder="Enter your name" />
                        {errors.name && <small className="edit-error-msg">{errors.name}</small>}
                    </div>

                    <div className="edit-field-group">
                        <label className="edit-field-label">Username</label>
                        <input className={`edit-field-input${errors.username ? " edit-field-error" : ""}`}
                            type="text" name="username" value={form.username}
                            onChange={handleChange} placeholder="Enter username" />
                        {errors.username && <small className="edit-error-msg">{errors.username}</small>}

                        {!errors.username && checkingUsername && (
                            <span className="username-checking">Checking...</span>
                        )}
                        {!errors.username && !checkingUsername && usernameStatus === "available" && (
                            <span className="username-available">✓ Username available</span>
                        )}
                        {!errors.username && !checkingUsername && usernameStatus === "taken" && (
                            <>
                                <span className="username-taken">Username already taken</span>
                                {suggestions.length > 0 && (
                                    <div className="username-suggestions">
                                        {suggestions.map(s => (
                                            <span
                                                key={s}
                                                className="username-suggestion-pill"
                                                onClick={() => {
                                                    setForm(prev => ({ ...prev, username: s }));
                                                    setErrors(prev => ({ ...prev, username: "" }));
                                                }}
                                            >{s}</span>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    <div className="edit-field-group">
                        <label className="edit-field-label">Email</label>
                        <input className={`edit-field-input${errors.email ? " edit-field-error" : ""}`}
                            type="email" name="email" value={form.email}
                            onChange={handleChange} placeholder="Enter email" />
                        {errors.email && <small className="edit-error-msg">{errors.email}</small>}
                    </div>

                    <div className="edit-field-group">
                        <label className="edit-field-label">Contact</label>
                        <input className={`edit-field-input${errors.contact ? " edit-field-error" : ""}`}
                            type="text" name="contact" value={form.contact}
                            onChange={handleChange} placeholder="Enter 10 digit number" />
                        {errors.contact && <small className="edit-error-msg">{errors.contact}</small>}
                    </div>

                    <div className="edit-profile-actions">
                        <button type="button" className="edit-btn-cancel"
                            onClick={() => router.push(`/nest/profile/${id}`)}
                            disabled={loading}>
                            Cancel
                        </button>
                        <button type="submit" className="edit-btn-done"
                            disabled={loading || usernameStatus === "taken" || checkingUsername}>
                            {loading ? "Saving..." : "Done"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default EditProfile;