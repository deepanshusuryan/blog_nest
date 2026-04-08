import "../../styles/footer.css";

export const Footer = () => {
  return (
    <footer className="footer-wrapper">
      <div className="footer-card">
        <div className="footer-top">

          {/* Brand */}
          <div className="footer-brand">
            <a href="/" className="footer-logo">
              <svg className="logo-icon" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="36" height="36" rx="8" fill="#1A1410" />
                <path d="M18 26C18 26 8 21 8 14C8 10.134 12.134 7 16 7H20C23.866 7 28 10.134 28 14C28 21 18 26 18 26Z" fill="none" stroke="#C8871A" strokeWidth="1.5" />
                <path d="M18 22C18 22 11 18.5 11 14C11 11.239 13.5 9.5 16 9.5H20C22.5 9.5 25 11.239 25 14C25 18.5 18 22 18 22Z" fill="none" stroke="#C8871A" strokeWidth="1.2" strokeOpacity="0.6" />
                <path d="M18 14 L16 19 L18 17.5 L20 19 Z" fill="#C8871A" />
                <line x1="18" y1="14" x2="18" y2="10" stroke="#C8871A" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span className="logo-text">Blog<span className="logo-accent">Nest</span></span>
            </a>
            <p className="brand-desc">
              BlogNest empowers writers to craft beautiful, meaningful stories — making your ideas easy to share, discover, and remember.
            </p>
            <div className="social-links">
              <a href="#" aria-label="X / Twitter">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.74-8.851L1.254 2.25H8.08l4.259 5.631L18.244 2.25zM17.083 19.77h1.833L7.084 4.126H5.117L17.083 19.77z" />
                </svg>
              </a>
              <a href="#" aria-label="Instagram">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a href="#" aria-label="LinkedIn">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              <a href="#" aria-label="RSS Feed">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 11a9 9 0 019 9" />
                  <path d="M4 4a16 16 0 0116 16" />
                  <circle cx="5" cy="19" r="1" />
                </svg>
              </a>
            </div>
          </div>

          {/* Nav Columns */}
          <nav className="footer-nav">
            <div className="nav-col">
              <h4>Product</h4>
              <ul>
                <li><a href="#">Features</a></li>
                <li><a href="#">Pricing</a></li>
                <li><a href="#">Templates</a></li>
                <li><a href="#">Changelog</a></li>
              </ul>
            </div>
            <div className="nav-col">
              <h4>Resources</h4>
              <ul>
                <li><a href="#">Documentation</a></li>
                <li><a href="#">Tutorials</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Support</a></li>
              </ul>
            </div>
            <div className="nav-col">
              <h4>Company</h4>
              <ul>
                <li><a href="#">About</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Contact</a></li>
                <li><a href="#">Partners</a></li>
              </ul>
            </div>
          </nav>

        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p>© 2025 BlogNest. All rights reserved.</p>
          <div className="footer-legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
};