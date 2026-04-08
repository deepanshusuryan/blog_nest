"use client"
import { useRouter } from "next/navigation"
import { useAuth } from "../AuthContext";
import { toast } from "react-toastify";
import Link from "next/link";
import { useState, useEffect } from "react";
import "../../styles/header.css";
import { ThemeSwitcher } from "../ThemeSwitcher";

const Header = () => {
    const router = useRouter();
    const { user, logout } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = async () => {
        try {
            const res = await logout();
            if (res?.success) {
                toast.success(res.message);
                router.push("/");
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <header className={`header${scrolled ? " header--scrolled" : ""}`}>
            <div className="header-inner">

                {/* Logo */}
                <Link href="/" className="header-logo">
                    <svg className="header-logo-icon" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="36" height="36" rx="8" fill="#1A1410" />
                        <path d="M18 26C18 26 8 21 8 14C8 10.134 12.134 7 16 7H20C23.866 7 28 10.134 28 14C28 21 18 26 18 26Z" fill="none" stroke="#C8871A" strokeWidth="1.5" />
                        <path d="M18 22C18 22 11 18.5 11 14C11 11.239 13.5 9.5 16 9.5H20C22.5 9.5 25 11.239 25 14C25 18.5 18 22 18 22Z" fill="none" stroke="#C8871A" strokeWidth="1.2" strokeOpacity="0.6" />
                        <path d="M18 14 L16 19 L18 17.5 L20 19 Z" fill="#C8871A" />
                        <line x1="18" y1="14" x2="18" y2="10" stroke="#C8871A" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <span className="header-logo-text">Blog<span className="header-logo-accent">Nest</span></span>
                </Link>

                {/* Center Nav */}
                <nav className="header-nav">
                    <Link href="/explore" className="header-nav-link">Explore</Link>
                    <Link href="/topics" className="header-nav-link">Topics</Link>
                    <Link href="/writers" className="header-nav-link">Writers</Link>
                </nav>

                {/* Right Actions */}
                <div className="header-actions">
                    <ThemeSwitcher/>
                    {user ? (
                        <>
                            <Link href="/write" className="header-btn header-btn--write">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                                Write
                            </Link>

                            <div className="header-avatar-wrap">
                                <button
                                    className="header-avatar"
                                    onClick={() => setMenuOpen(!menuOpen)}
                                    aria-label="User menu"
                                >
                                    {user?.name?.[0]?.toUpperCase() ?? "U"}
                                </button>

                                {menuOpen && (
                                    <div className="header-dropdown">
                                        <div className="header-dropdown-user">
                                            <span className="header-dropdown-name">{user?.name}</span>
                                            <span className="header-dropdown-email">{user?.email}</span>
                                        </div>
                                        <div className="header-dropdown-divider" />
                                        <Link
                                            href={`/nest/profile/${user?._id}`}
                                            className="header-dropdown-item"
                                            onClick={() => setMenuOpen(false)}
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                            Profile
                                        </Link>
                                        {user?.role === "super_admin" && (
                                            <Link
                                                href="/admin"
                                                className="header-dropdown-item"
                                                onClick={() => setMenuOpen(false)}
                                            >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                                                Admin Panel
                                            </Link>
                                        )}
                                        <div className="header-dropdown-divider" />
                                        <button
                                            className="header-dropdown-item header-dropdown-item--danger"
                                            onClick={() => { handleLogout(); setMenuOpen(false); }}
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <button className="header-btn header-btn--ghost" onClick={() => router.push("/login")}>
                                Sign in
                            </button>
                            <button className="header-btn header-btn--primary" onClick={() => router.push("/signup")}>
                                Get started
                            </button>
                        </>
                    )}
                </div>

                {/* Mobile hamburger */}
                <button
                    className={`header-hamburger${menuOpen ? " header-hamburger--open" : ""}`}
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    <span /><span /><span />
                </button>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="header-mobile-menu">
                    <Link href="/explore" className="header-mobile-link" onClick={() => setMenuOpen(false)}>Explore</Link>
                    <Link href="/topics" className="header-mobile-link" onClick={() => setMenuOpen(false)}>Topics</Link>
                    <Link href="/writers" className="header-mobile-link" onClick={() => setMenuOpen(false)}>Writers</Link>
                    <div className="header-mobile-divider" />
                    {user ? (
                        <>
                            <Link href={`/nest/profile/${user?._id}`} className="header-mobile-link" onClick={() => setMenuOpen(false)}>Profile</Link>
                            {user?.role === "super_admin" && (
                                <Link href="/admin" className="header-mobile-link" onClick={() => setMenuOpen(false)}>Admin Panel</Link>
                            )}
                            <button className="header-mobile-link header-mobile-link--danger" onClick={() => { handleLogout(); setMenuOpen(false); }}>Logout</button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="header-mobile-link" onClick={() => setMenuOpen(false)}>Sign in</Link>
                            <Link href="/signup" className="header-mobile-btn" onClick={() => setMenuOpen(false)}>Get started</Link>
                        </>
                    )}
                </div>
            )}
        </header>
    )
}

export default Header;