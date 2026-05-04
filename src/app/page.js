import Link from "next/link";
import "../styles/home.css";

const topics = [
  "Technology", "Entertainment", "Movies", "Food",
  "Travel", "Career", "Ai Tools", "Finance",
];

export default function Page() {
  return (
    <main className="home">
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
          </div>
        </div>

        <div className="hero-scroll-line" aria-hidden="true" />
      </section>
      <section className="topics">
        <div className="section-header">
          <span className="section-tag">Discover</span>
          <h2 className="section-title">Find your corner</h2>
        </div>
        <div className="topics-grid">
          {topics.map((topic) => (
            <Link key={topic} href={``} className="topic-pill">
              {topic}
            </Link>
          ))}
        </div>
      </section>

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