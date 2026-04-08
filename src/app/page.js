import Link from "next/link";
import "../styles/home.css";

// Mock featured posts — replace with real data fetching
const featuredPosts = [
  {
    id: 1,
    tag: "Design",
    title: "The Art of Negative Space in Modern Typography",
    excerpt: "How the world's best designers use what isn't there to create what is unforgettable.",
    author: "Mira Okafor",
    date: "Mar 28",
    readTime: "5 min read",
    accent: "#C8871A",
  },
  {
    id: 2,
    tag: "Engineering",
    title: "Building at the Edge: Lessons from Distributed Systems",
    excerpt: "What three years of production incidents taught me about resilience, humility, and coffee.",
    author: "Arjun Mehta",
    date: "Apr 1",
    readTime: "8 min read",
    accent: "#2E7D5B",
  },
  {
    id: 3,
    tag: "Culture",
    title: "On Slowness: A Defence of the Long Read",
    excerpt: "In an era of threads and clips, why the essay is having its quiet, essential renaissance.",
    author: "Saoirse Flynn",
    date: "Apr 3",
    readTime: "6 min read",
    accent: "#7B5EA7",
  },
];

const topics = [
  "Technology", "Design", "Culture", "Science",
  "Philosophy", "Writing", "Business", "Health",
];

export default function Page() {
  return (
    <main className="home">

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-bg-text" aria-hidden="true">STORIES</div>

        <div className="hero-content">
          <div className="hero-badge">✦ A home for ideas</div>
          <h1 className="hero-heading">
            Where words find<br />
            <em>their wings.</em>
          </h1>
          <p className="hero-sub">
            BlogNest is where curious minds write, discover, and connect.<br />
            Real stories from real people — beautifully told.
          </p>
          <div className="hero-actions">
            <Link href="/signup" className="hero-btn hero-btn--primary">Start writing</Link>
            <Link href="/explore" className="hero-btn hero-btn--ghost">
              Browse stories
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
          {/* <p className="hero-note">Free forever · No credit card · No spam</p> */}
        </div>

        <div className="hero-scroll-line" aria-hidden="true" />
      </section>

      {/* ── Stats Bar ── */}
      <section className="stats-bar">
        <div className="stats-inner">
          <div className="stat">
            <span className="stat-number">24K+</span>
            <span className="stat-label">Writers</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <span className="stat-number">180K</span>
            <span className="stat-label">Stories published</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <span className="stat-number">4.2M</span>
            <span className="stat-label">Monthly readers</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <span className="stat-number">120+</span>
            <span className="stat-label">Topics covered</span>
          </div>
        </div>
      </section>

      {/* ── Featured Stories ── */}
      <section className="featured">
        <div className="section-header">
          <span className="section-tag">Featured</span>
          <h2 className="section-title">Stories worth your time</h2>
        </div>

        <div className="featured-grid">
          {/* Hero card — large */}
          <article className="post-card post-card--hero">
            <div className="post-card-tag" style={{ color: featuredPosts[0].accent }}>
              {featuredPosts[0].tag}
            </div>
            <h3 className="post-card-title">{featuredPosts[0].title}</h3>
            <p className="post-card-excerpt">{featuredPosts[0].excerpt}</p>
            <div className="post-card-meta">
              <div className="post-card-avatar">{featuredPosts[0].author[0]}</div>
              <span className="post-card-author">{featuredPosts[0].author}</span>
              <span className="post-card-dot">·</span>
              <span className="post-card-date">{featuredPosts[0].date}</span>
              <span className="post-card-dot">·</span>
              <span className="post-card-read">{featuredPosts[0].readTime}</span>
            </div>
            <Link href={`/post/${featuredPosts[0].id}`} className="post-card-link">Read story →</Link>
          </article>

          {/* Side cards */}
          <div className="featured-side">
            {featuredPosts.slice(1).map((post) => (
              <article key={post.id} className="post-card post-card--side">
                <div className="post-card-tag" style={{ color: post.accent }}>{post.tag}</div>
                <h3 className="post-card-title post-card-title--sm">{post.title}</h3>
                <div className="post-card-meta">
                  <div className="post-card-avatar post-card-avatar--sm">{post.author[0]}</div>
                  <span className="post-card-author">{post.author}</span>
                  <span className="post-card-dot">·</span>
                  <span className="post-card-read">{post.readTime}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Topics ── */}
      <section className="topics">
        <div className="section-header">
          <span className="section-tag">Discover</span>
          <h2 className="section-title">Find your corner</h2>
        </div>
        <div className="topics-grid">
          {topics.map((topic) => (
            <Link key={topic} href={`/topics/${topic.toLowerCase()}`} className="topic-pill">
              {topic}
            </Link>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="home-cta">
        <div className="home-cta-inner">
          <p className="home-cta-eyebrow">Ready?</p>
          <h2 className="home-cta-heading">Your first story<br /><em>starts here.</em></h2>
          <Link href="/signup" className="hero-btn hero-btn--primary">Create your nest →</Link>
        </div>
      </section>

    </main>
  );
}