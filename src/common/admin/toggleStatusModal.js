"use client";

import { useState } from "react";
import axiosInstance from "@/services/axiosInstance";
import "@/styles/admin/toggle-modal.css";

const ToggleStatusModal = ({ isActive, name, label = "item", apiUrl, onSuccess, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const action = isActive ? "Deactivate" : "Activate";

    const handleConfirm = async () => {
        try {
            setLoading(true);
            setError("");
            const res = await axiosInstance.put(apiUrl);
            if (res.data.success) {
                onSuccess?.();
                onClose();
            }
        } catch (err) {
            setError(err?.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="tgl-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="tgl-modal">

                <div className={`tgl-icon-wrap ${isActive ? "tgl-icon-danger" : "tgl-icon-success"}`}>
                    {isActive ? (
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <circle cx="12" cy="12" r="10" /><line x1="8" y1="12" x2="16" y2="12" />
                        </svg>
                    ) : (
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="10" />
                        </svg>
                    )}
                </div>

                <h2 className="tgl-title">{action} {label}?</h2>
                <p className="tgl-desc">
                    {isActive
                        ? `This will deactivate the ${name} ${label.toLowerCase()}. It won't be visible to users until re-activated.`
                        : `This will activate the ${name} ${label.toLowerCase()} and make it visible to users.`
                    }
                </p>

                {error && (
                    <div className="tgl-error">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        {error}
                    </div>
                )}

                <div className="tgl-actions">
                    <button className="tgl-btn tgl-btn-ghost" onClick={onClose} disabled={loading}>
                        Cancel
                    </button>
                    <button
                        className={`tgl-btn ${isActive ? "tgl-btn-danger" : "tgl-btn-success"}`}
                        onClick={handleConfirm}
                        disabled={loading}
                    >
                        {loading ? <><span className="tgl-spinner" />{action}ing...</> : action}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ToggleStatusModal;