"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/services/axiosInstance";
import ToggleStatusModal from "@/common/admin/toggleStatusModal";

const LIMIT = 10;

const GetCategory = () => {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toggleModal, setToggleModal] = useState(null);

  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [isActive, setIsActive] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page,
        limit: LIMIT,
        search,
        sortBy,
        order,
        ...(isActive !== "" && { isActive }),
      });
      const res = await axiosInstance.get(`/category/getcategories?${params}`);
      if (res.data.success) {
        setCategories(res.data.categories);
        setTotal(res.data.total);
        setTotalPages(res.data.totalPages);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [page, search, isActive, sortBy, order]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setPage(1);
  };

  const toggleOrder = () => {
    setOrder((prev) => (prev === "desc" ? "asc" : "desc"));
    setPage(1);
  };

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
    .reduce((acc, p, idx, arr) => {
      if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
      acc.push(p);
      return acc;
    }, []);

  return (
    <div className="cat-wrapper">

      <div className="cat-header">
        <div>
          <h1 className="cat-title">Categories</h1>
          <p className="cat-subtitle">
            {loading ? "Loading..." : `${total} total`}
          </p>
        </div>
        <button
          className="cat-btn cat-btn-primary"
          onClick={() => router.push("/admin/category/create")}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Category
        </button>
      </div>

      <div className="cat-controls">
        <div className="cat-search-wrap">
          <svg className="cat-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            className="cat-search"
            type="text"
            placeholder="Search categories..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          {searchInput && (
            <button className="cat-search-clear" onClick={() => { setSearchInput(""); setSearch(""); setPage(1); }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        <div className="cat-controls-right">
          <select className="cat-select" value={isActive} onChange={handleFilterChange(setIsActive)}>
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>

          <select className="cat-select" value={sortBy} onChange={handleFilterChange(setSortBy)}>
            <option value="createdAt">Date Created</option>
            <option value="name">Name</option>
          </select>

          <button className="cat-sort-btn" onClick={toggleOrder}>
            {order === "desc" ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" />
              </svg>
            )}
            {order === "desc" ? "Desc" : "Asc"}
          </button>
        </div>
      </div>

      {loading && (
        <div className="cat-loading">
          {[...Array(4)].map((_, i) => <div key={i} className="cat-skeleton" />)}
        </div>
      )}

      {!loading && categories.length === 0 && (
        <div className="cat-empty">
          <div className="cat-empty-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <p className="cat-empty-text">No categories found</p>
          <p className="cat-empty-sub">
            {search ? `No results for "${search}"` : "Create your first category to get started"}
          </p>
        </div>
      )}

      {!loading && categories.length > 0 && (
        <div className="cat-card">
          <div className="cat-table-head">
            <span>Name</span>
            <span>Description</span>
            <span>Status</span>
            <span>Actions</span>
          </div>
          <ul className="cat-list">
            {categories.map((cat, i) => (
              <li key={cat._id} className="cat-row" style={{ animationDelay: `${i * 40}ms` }}>
                <div className="cat-row-name">
                  <div className="cat-row-dot" style={!cat.isActive ? { background: "#555e72", boxShadow: "none" } : {}} />
                  <span>{cat.name}</span>
                </div>

                <div className="cat-row-desc">
                  {cat.description?.trim() || <span className="cat-row-desc-empty">—</span>}
                </div>

                <div>
                  <span className={`cat-badge ${cat.isActive ? "cat-badge-active" : "cat-badge-inactive"}`}>
                    {cat.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="cat-actions">
                  <button className="cat-btn cat-btn-ghost cat-btn-sm" onClick={() => router.push(`/admin/category/${cat._id}`)}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                    </svg>
                    View
                  </button>
                  <button className="cat-btn cat-btn-ghost cat-btn-sm" onClick={() => router.push(`/admin/category/${cat._id}/edit`)}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    className={`cat-btn cat-btn-sm ${cat.isActive ? "cat-btn-danger" : "cat-btn-success"}`}
                    onClick={() => setToggleModal({ id: cat._id, isActive: cat.isActive, name: cat.name })}
                  >
                    {cat.isActive ? (
                      <>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <circle cx="12" cy="12" r="10" /><line x1="8" y1="12" x2="16" y2="12" />
                        </svg>
                        Deactivate
                      </>
                    ) : (
                      <>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
                        </svg>
                        Activate
                      </>
                    )}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!loading && totalPages > 1 && (
        <div className="cat-pagination">
          <span className="cat-pagination-info">
            Page <strong>{page}</strong> of <strong>{totalPages}</strong>
          </span>

          <div className="cat-pagination-btns">
            <button
              className="cat-page-btn"
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 1}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
              </svg>
              Previous
            </button>

            <div className="cat-page-numbers">
              {pageNumbers.map((p, i) =>
                p === "..." ? (
                  <span key={`e-${i}`} className="cat-page-ellipsis">…</span>
                ) : (
                  <button
                    key={p}
                    className={`cat-page-num ${page === p ? "cat-page-num--active" : ""}`}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </button>
                )
              )}
            </div>

            <button
              className="cat-page-btn"
              onClick={() => setPage((p) => p + 1)}
              disabled={page === totalPages}
            >
              Next
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </div>
      )}
      {toggleModal && (
        <ToggleStatusModal
          isActive={toggleModal.isActive}
          name={toggleModal.name}
          label="Category"
          apiUrl={`/category/toggle-status/${toggleModal.id}`}
          onSuccess={fetchCategories}
          onClose={() => setToggleModal(null)}
        />
      )}
    </div>
  );
};

export default GetCategory;