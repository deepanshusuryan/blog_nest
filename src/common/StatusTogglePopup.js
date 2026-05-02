"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import axiosInstance from "@/services/axiosInstance";

const StatusTogglePopup = ({
  currentStatus = "private",
  apiUrl,
  statusField = "blogType",
  method = "put",
  onSuccess,
  className = "",
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !loading) {
        setOpen(false);
        setSelectedStatus("");
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, loading]);

  const openConfirm = (newStatus) => {
    if (disabled || loading) return;
    if (newStatus === currentStatus) return;

    setSelectedStatus(newStatus);
    setOpen(true);
  };

  const closeConfirm = () => {
    if (loading) return;
    setOpen(false);
    setSelectedStatus("");
  };

  const handleConfirm = async () => {
    if (!selectedStatus) return;

    try {
      setLoading(true);

      const payload = {
        [statusField]: selectedStatus,
      };

      let res;
      switch (method.toLowerCase()) {
        case "put":
          res = await axiosInstance.put(apiUrl, payload);
          break;
        case "post":
          res = await axiosInstance.post(apiUrl, payload);
          break;
        default:
          res = await axiosInstance.put(apiUrl, payload);
      }

      if (res?.data?.success) {
        toast.success(`Blog is now ${selectedStatus}.`);
        onSuccess?.(selectedStatus, res.data);
        closeConfirm();
      } else {
        toast.error(res?.data?.message || "Failed to update status.");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  const modal = open ? (
    <div className="status-modal-overlay" onClick={closeConfirm}>
      <div
        className="status-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="status-modal-title"
      >
        <div className="status-modal-icon">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          </svg>
        </div>

        <h3 id="status-modal-title" className="status-modal-title">
          Change status
        </h3>

        <p className="status-modal-text">
          Are you sure you want to change status to{" "}
          <strong>{selectedStatus}</strong>?
        </p>

        <div className="status-modal-status-row">
          <span className="status-modal-badge current">
            Current: {currentStatus}
          </span>
          <span className="status-modal-arrow">→</span>
          <span className="status-modal-badge next">
            New: {selectedStatus}
          </span>
        </div>

        <div className="status-modal-actions">
          <button
            type="button"
            className="status-modal-btn status-modal-btn-cancel"
            onClick={closeConfirm}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="button"
            className="status-modal-btn status-modal-btn-confirm"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? "Updating..." : "Yes, change it"}
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <div className={`blog-type-toggle ${className}`}>
        <button
          type="button"
          className={`blog-type-btn${currentStatus === "public" ? " active" : ""}`}
          onClick={() => openConfirm("public")}
          title="Make public"
          disabled={disabled || loading}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
          Public
        </button>

        <button
          type="button"
          className={`blog-type-btn${currentStatus === "private" ? " active" : ""}`}
          onClick={() => openConfirm("private")}
          title="Make private"
          disabled={disabled || loading}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          Private
        </button>
      </div>

      {mounted ? createPortal(modal, document.body) : null}
    </>
  );
};

export default StatusTogglePopup;
