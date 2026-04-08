"use client";
import { useEffect, useState } from "react";
import axiosInstance from "@/services/axiosInstance";
import { toast } from "react-toastify";

const getCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newName, setNewName] = useState("");
    const [adding, setAdding] = useState(false);
    const [editId, setEditId] = useState(null);
    const [editName, setEditName] = useState("");

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get("/category/getcategories");
            if (res.data.success) {
                setCategories(res.data.categories);
            }
        } catch {
            toast.error("Failed to fetch categories");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleAdd = async () => {
        if (!newName.trim()) return toast.error("Category name is required");
        try {
            setAdding(true);
            const res = await axiosInstance.post("/category/create", { name: newName.trim() });
            if (res.data.success) {
                toast.success(res.data.message);
                setNewName("");
                fetchCategories();
            } else {
                toast.error(res.data.message);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong");
        } finally {
            setAdding(false);
        }
    };

    const handleUpdate = async (id) => {
        if (!editName.trim()) return toast.error("Name cannot be empty");
        try {
            const res = await axiosInstance.put("/category/update", { id, name: editName.trim() });
            if (res.data.success) {
                toast.success(res.data.message);
                setEditId(null);
                fetchCategories();
            } else {
                toast.error(res.data.message);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong");
        }
    };

    const handleToggle = async (id) => {
        try {
            const res = await axiosInstance.patch(`/category/toggle/${id}`);
            if (res.data.success) {
                toast.success(res.data.message);
                fetchCategories();
            }
        } catch {
            toast.error("Failed to update status");
        }
    };

    return (
        <div className="categories-page">

            <div className="categories-header">
                <div>
                    <div className="categories-title">Categories</div>
                    <div className="categories-subtitle">
                        {categories.length} {categories.length === 1 ? "category" : "categories"} total
                    </div>
                </div>
            </div>

            {/* Add new category */}
            <div className="categories-add-form">
                <input
                    type="text"
                    placeholder="New category name..."
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                />
                <button className="btn-primary" onClick={handleAdd} disabled={adding}>
                    {adding ? "Adding..." : "+ Add Category"}
                </button>
            </div>

            {/* Table */}
            {loading ? (
                <div className="categories-loading">Loading categories...</div>
            ) : (
                <div className="categories-table-wrap">
                    <table className="categories-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.length === 0 ? (
                                <tr>
                                    <td colSpan={4}>
                                        <div className="categories-empty">No categories yet. Add one above.</div>
                                    </td>
                                </tr>
                            ) : (
                                categories.map((cat, i) => (
                                    <tr key={cat._id}>
                                        <td style={{ color: "var(--color-text-tertiary)", width: 40 }}>
                                            {i + 1}
                                        </td>
                                        <td>
                                            {editId === cat._id ? (
                                                <input
                                                    className="inline-edit-input"
                                                    value={editName}
                                                    onChange={(e) => setEditName(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") handleUpdate(cat._id);
                                                        if (e.key === "Escape") setEditId(null);
                                                    }}
                                                    autoFocus
                                                />
                                            ) : (
                                                cat.name
                                            )}
                                        </td>
                                        <td>
                                            <span className={`status-badge ${cat.isActive ? "active" : "inactive"}`}>
                                                <span className="status-dot" />
                                                {cat.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="table-actions">
                                                {editId === cat._id ? (
                                                    <>
                                                        <button className="action-btn" onClick={() => handleUpdate(cat._id)}>Save</button>
                                                        <button className="action-btn" onClick={() => setEditId(null)}>Cancel</button>
                                                    </>
                                                ) : (
                                                    <button
                                                        className="action-btn"
                                                        onClick={() => { setEditId(cat._id); setEditName(cat.name); }}
                                                    >
                                                        Edit
                                                    </button>
                                                )}
                                                <button
                                                    className={`action-btn ${cat.isActive ? "danger" : ""}`}
                                                    onClick={() => handleToggle(cat._id)}
                                                >
                                                    {cat.isActive ? "Disable" : "Enable"}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default getCategories;