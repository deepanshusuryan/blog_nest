import Image from "next/image";
import Link from "next/link";

export default function Home() {
    return (
        <div className="hero-container">
            <div className="overlay">
                <nav className="navbar">
                    <div className="logo">BlogNest</div>

                    <div className="nav-links">
                        <a href="#">Home</a>
                        <a href="#">Categories</a>
                        <a href="#">About</a>
                        <Link href={"/login"}><button className="btn btn-light">Login</button></Link>
                        <button className="btn btn-dark">Start Writing</button>
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="hero">
                    <div className="hero-content">
                        <h1>Share Your Stories With The World</h1>
                        <p>
                            Discover inspiring articles, write your own blogs, and connect
                            with readers globally. Start your blogging journey today.
                        </p>

                        <div className="search-box">
                            <input type="text" placeholder="Search articles..." />
                            <button>→</button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}