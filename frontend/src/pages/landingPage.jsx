import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../../components/ThemeToggle";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --green: #22c55e;
    --green-dark: #16a34a;
    --green-light: #dcfce7;
    --navy: #0f172a;
    --slate: #334155;
    --muted: #64748b;
    --border: #e2e8f0;
    --bg: #f8fafc;
    --white: #ffffff;
    --section-dark: #1e293b;

    /* Theme-aware tokens — these are what components actually use */
    --surface: #ffffff;
    --surface-alt: #f8fafc;
    --text-primary: #0f172a;
    --text-secondary: #334155;
    --text-muted: #64748b;
    --border-color: #e2e8f0;
    --nav-bg: #ffffff;
    --hero-img-bg: linear-gradient(135deg, #e2f5ea 0%, #d1fae5 50%, #a7f3d0 100%);
    --stat-card-bg: #ffffff;
    --logo-muted: #94a3b8;
    --footer-bg: #0f172a;
    --cta-section-bg: #1e293b;
    --cta-card-bg: #ffffff;
  }

  /* Dark mode overrides — toggled via .dark class on <html>, same
     mechanism as the rest of the app (ThemeContext/ThemeToggle) */
  .dark {
    --surface: #0f172a;
    --surface-alt: #1e293b;
    --text-primary: #f1f5f9;
    --text-secondary: #cbd5e1;
    --text-muted: #94a3b8;
    --border-color: #334155;
    --nav-bg: #0f172a;
    --hero-img-bg: linear-gradient(135deg, #064e3b 0%, #022c22 50%, #052e16 100%);
    --stat-card-bg: #1e293b;
    --logo-muted: #64748b;
    --footer-bg: #020617;
    --cta-section-bg: #020617;
    --cta-card-bg: #0f172a;
  }

  .fio-root {
    font-family: 'DM Sans', sans-serif;
    color: var(--text-primary);
    background: var(--surface);
    line-height: 1.6;
    transition: background 0.3s, color 0.3s;
  }

  /* NAV */
  .fio-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 48px;
    height: 64px;
    border-bottom: 1px solid var(--border-color);
    background: var(--nav-bg);
    position: sticky;
    top: 0;
    z-index: 100;
    transition: background 0.3s, border-color 0.3s;
  }
  .fio-logo {
    font-family: 'DM Sans', sans-serif;
    font-weight: 700;
    font-size: 18px;
    color: var(--text-primary);
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .fio-logo-icon {
    width: 28px; height: 28px;
    background: var(--green);
    border-radius: 6px;
    display: flex; align-items: center; justify-content: center;
  }
  .fio-logo-icon svg { width: 16px; height: 16px; fill: white; }
  .fio-nav-links {
    display: flex; align-items: center; gap: 32px;
    list-style: none;
  }
  .fio-nav-links a {
    text-decoration: none;
    color: var(--text-secondary);
    font-size: 14px;
    font-weight: 500;
    position: relative;
    padding-bottom: 4px;
    transition: color 0.2s;
  }
  .fio-nav-links a::after {
    content: '';
    position: absolute;
    left: 0; bottom: 0;
    width: 100%; height: 2px;
    background: var(--green);
    border-radius: 2px;
    transform: scaleX(0);
    transform-origin: left center;
    transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .fio-nav-links a:hover { color: var(--text-primary); }
  .fio-nav-links a:hover::after { transform: scaleX(1); }
  .fio-nav-actions { display: flex; align-items: center; gap: 12px; }
  .btn-ghost {
    background: none; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px; font-weight: 500;
    color: var(--text-secondary); padding: 8px 16px;
    border-radius: 8px; transition: background 0.2s;
  }
  .btn-ghost:hover { background: var(--surface-alt); }
  .btn-primary {
    background: var(--green); border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px; font-weight: 600;
    color: white; padding: 9px 20px;
    border-radius: 8px; transition: background 0.2s;
  }
  .btn-primary:hover { background: var(--green-dark); }

  /* HERO */
  .fio-hero {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    gap: 48px;
    padding: 72px 48px 80px;
    max-width: 1100px;
    margin: 0 auto;
  }
  .fio-hero-badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: var(--green-light);
    color: var(--green-dark);
    font-size: 12px; font-weight: 600;
    padding: 4px 12px; border-radius: 100px;
    margin-bottom: 20px;
    letter-spacing: 0.02em;
  }
  .dark .fio-hero-badge {
    background: rgba(34,197,94,0.15);
    color: #4ade80;
  }
  .fio-hero-badge::before {
    content: '';
    width: 6px; height: 6px;
    background: var(--green);
    border-radius: 50%;
  }
  .fio-hero h1 {
    font-family: 'Fraunces', serif;
    font-size: 52px;
    font-weight: 900;
    line-height: 1.1;
    margin-bottom: 20px;
    color: var(--text-primary);
  }
  .fio-hero h1 em {
    color: var(--green);
    font-style: italic;
  }
  .fio-hero p {
    font-size: 16px;
    color: var(--text-muted);
    margin-bottom: 32px;
    max-width: 420px;
    line-height: 1.7;
  }
  .fio-hero-ctas { display: flex; align-items: center; gap: 16px; }
  .btn-hero-primary {
    background: var(--green); color: white;
    border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px; font-weight: 600;
    padding: 13px 28px; border-radius: 10px;
    transition: background 0.2s, transform 0.15s;
  }
  .btn-hero-primary:hover { background: var(--green-dark); transform: translateY(-1px); }
  .btn-hero-secondary {
    background: none; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px; font-weight: 500;
    color: var(--text-secondary);
    display: flex; align-items: center; gap: 8px;
    transition: color 0.2s;
  }
  .btn-hero-secondary:hover { color: var(--text-primary); }
  .play-icon {
    width: 36px; height: 36px;
    border-radius: 50%;
    background: var(--surface);
    box-shadow: 0 2px 8px rgba(0,0,0,0.12);
    display: flex; align-items: center; justify-content: center;
  }
  .play-icon svg { width: 14px; height: 14px; fill: var(--green); margin-left: 2px; }

  /* Hero image side */
  .fio-hero-img {
    position: relative;
  }
  .fio-hero-img-wrapper {
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 24px 64px rgba(0,0,0,0.12);
    aspect-ratio: 4/3;
    background: var(--hero-img-bg);
    display: flex; align-items: center; justify-content: center;
    position: relative;
    transition: background 0.3s;
  }
  .mock-laptop {
    width: 80%;
  }
  .mock-laptop-screen {
    background: var(--navy);
    border-radius: 8px 8px 0 0;
    padding: 12px;
    position: relative;
  }
  .mock-screen-bar {
    height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; margin-bottom: 8px;
  }
  .mock-chart {
    height: 60px;
    display: flex; align-items: flex-end; gap: 4px;
  }
  .mock-bar {
    flex: 1; background: var(--green); border-radius: 2px 2px 0 0; opacity: 0.85;
  }
  .mock-laptop-base {
    height: 10px;
    background: #cbd5e1;
    border-radius: 0 0 4px 4px;
    margin: 0 -4px;
  }
  .hero-stat-card {
    position: absolute;
    background: var(--stat-card-bg);
    border-radius: 12px;
    padding: 10px 16px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.16);
    display: flex; align-items: center; gap: 10px;
    font-size: 13px; font-weight: 600;
    color: var(--text-primary);
    transition: background 0.3s, color 0.3s;
  }
  .hero-stat-card.top-right { top: 16px; right: -16px; }
  .hero-stat-card.bottom-left { bottom: 16px; left: -16px; }
  .stat-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--green); }
  .stat-label { color: var(--text-muted); font-weight: 400; font-size: 11px; }

  /* LOGOS */
  .fio-logos {
    padding: 32px 48px;
    border-top: 1px solid var(--border-color);
    border-bottom: 1px solid var(--border-color);
    transition: border-color 0.3s;
  }
  .fio-logos-inner {
    max-width: 1100px; margin: 0 auto;
    display: flex; align-items: center; justify-content: center; gap: 56px;
  }
  .fio-logos p {
    font-size: 11px; font-weight: 600; letter-spacing: 0.1em;
    text-transform: uppercase; color: var(--text-muted);
    white-space: nowrap;
  }
  .logo-items { display: flex; align-items: center; gap: 48px; }
  .logo-item {
    font-size: 15px; font-weight: 700; color: var(--logo-muted);
    letter-spacing: -0.02em;
  }

  /* FEATURES */
  .fio-features {
    padding: 88px 48px;
    max-width: 1100px; margin: 0 auto;
    text-align: center;
  }
  .fio-features h2 {
    font-family: 'Fraunces', serif;
    font-size: 40px; font-weight: 900;
    margin-bottom: 12px; color: var(--text-primary);
  }
  .fio-features > p {
    font-size: 16px; color: var(--text-muted); margin-bottom: 56px;
  }
  .features-grid {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px;
    text-align: left;
  }
  .feature-card {
    padding: 0;
  }
  .feature-icon {
    width: 44px; height: 44px;
    background: var(--green-light);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 20px;
    transition: background 0.3s;
  }
  .dark .feature-icon {
    background: rgba(34,197,94,0.15);
  }
  .feature-icon svg { width: 22px; height: 22px; stroke: var(--green-dark); fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
  .dark .feature-icon svg { stroke: #4ade80; }
  .feature-card h3 {
    font-size: 17px; font-weight: 700; margin-bottom: 10px; color: var(--text-primary);
  }
  .feature-card p {
    font-size: 14px; color: var(--text-muted); line-height: 1.65;
  }

  /* CTA */
  .fio-cta {
    background: var(--cta-section-bg);
    padding: 80px 48px;
    transition: background 0.3s;
  }
  .fio-cta-inner {
    max-width: 640px; margin: 0 auto;
    background: var(--cta-card-bg);
    border-radius: 20px;
    padding: 56px 48px;
    text-align: center;
    box-shadow: 0 4px 24px rgba(0,0,0,0.08);
    transition: background 0.3s;
  }
  .fio-cta h2 {
    font-family: 'Fraunces', serif;
    font-size: 40px; font-weight: 900; line-height: 1.15;
    margin-bottom: 16px; color: var(--text-primary);
  }
  .fio-cta p {
    font-size: 15px; color: var(--text-muted); margin-bottom: 32px; line-height: 1.65;
  }
  .btn-cta {
    background: var(--green); color: white;
    border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px; font-weight: 600;
    padding: 13px 32px; border-radius: 10px;
    transition: background 0.2s;
    display: inline-block; margin-bottom: 14px;
  }
  .btn-cta:hover { background: var(--green-dark); }
  .cta-sub { font-size: 12px; color: var(--text-muted); display: block; }

  /* FOOTER */
  .fio-footer {
    background: var(--footer-bg);
    color: white;
    padding: 56px 48px 28px;
    transition: background 0.3s;
  }
  .fio-footer-top {
    display: grid;
    grid-template-columns: 1.8fr 1fr 1fr 1fr;
    gap: 48px;
    max-width: 1100px; margin: 0 auto;
    padding-bottom: 48px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }
  .footer-brand .fio-logo { color: white; margin-bottom: 14px; }
  .footer-brand p { font-size: 13px; color: #94a3b8; line-height: 1.7; max-width: 240px; }
  .footer-socials { display: flex; gap: 10px; margin-top: 20px; }
  .social-btn {
    width: 32px; height: 32px;
    border-radius: 8px;
    background: rgba(255,255,255,0.08);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: background 0.2s; border: none;
  }
  .social-btn:hover { background: rgba(255,255,255,0.15); }
  .social-btn svg { width: 15px; height: 15px; fill: #94a3b8; }
  .footer-col h4 { font-size: 13px; font-weight: 600; margin-bottom: 16px; color: white; }
  .footer-col ul { list-style: none; display: flex; flex-direction: column; gap: 10px; }
  .footer-col ul li a { text-decoration: none; font-size: 13px; color: #94a3b8; transition: color 0.2s; }
  .footer-col ul li a:hover { color: white; }
  .fio-footer-bottom {
    max-width: 1100px; margin: 0 auto;
    padding-top: 24px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .footer-bottom-links { display: flex; gap: 24px; }
  .footer-bottom-links a { font-size: 12px; color: #94a3b8; text-decoration: none; }
  .footer-bottom-links a:hover { color: white; }
  .footer-copy { font-size: 12px; color: #64748b; }
`;

const ChartIcon = () => (
  <svg viewBox="0 0 24 24">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

const InvoiceIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const ReportIcon = () => (
  <svg viewBox="0 0 24 24">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <line x1="3" y1="9" x2="21" y2="9" />
    <line x1="3" y1="15" x2="21" y2="15" />
    <line x1="9" y1="3" x2="9" y2="21" />
  </svg>
);

export default function FreelancIO() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <style>{styles}</style>
      <div className="fio-root">
        {/* NAV */}
        <nav className="fio-nav">
          <div className="fio-logo">
            <div className="fio-logo-icon">
              <svg viewBox="0 0 16 16">
                <path d="M8 2L2 6v8h4v-4h4v4h4V6L8 2z" />
              </svg>
            </div>
            FreelancIO
          </div>
          <ul className="fio-nav-links">
            <li>
              <a href="#">Features</a>
            </li>
            <li>
              <a href="#">Pricing</a>
            </li>
            <li>
              <a href="#">About</a>
            </li>
          </ul>
          <div className="fio-nav-actions">
            {/* Dark mode toggle — sits right next to Login, as requested */}
            <ThemeToggle />
            <button className="btn-ghost" onClick={() => navigate("/login")}>
              Login
            </button>
            <button className="btn-primary" onClick={() => navigate("/signup")}>
              Sign Up Free
            </button>
          </div>
        </nav>

        {/* HERO */}
        <section>
          <div className="fio-hero">
            <div>
              <div className="fio-hero-badge">
                Trusted by 50,000+ Freelancers
              </div>
              <h1>
                Finance management for the <em>modern</em> pro.
              </h1>
              <p>
                FreelancIO gives your solo practice clarity, structure, and
                control. Manage invoices, track expenses, and grow your business
                with confidence.
              </p>
              <div className="fio-hero-ctas">
                {/* Linked to the signup flow */}
                <button
                  className="btn-hero-primary"
                  onClick={() => navigate("/signup")}
                >
                  Get Started for Free →
                </button>
                <button className="btn-hero-secondary">
                  <div className="play-icon">
                    <svg viewBox="0 0 12 14">
                      <path d="M1 1l10 6L1 13V1z" />
                    </svg>
                  </div>
                  Watch Demo
                </button>
              </div>
            </div>
            <div className="fio-hero-img">
              <div className="fio-hero-img-wrapper">
                {/* Mock laptop dashboard */}
                <div className="mock-laptop">
                  <div className="mock-laptop-screen">
                    <div className="mock-screen-bar" style={{ width: "60%" }} />
                    <div
                      className="mock-screen-bar"
                      style={{ width: "40%", marginBottom: "12px" }}
                    />
                    <div className="mock-chart">
                      {[40, 65, 35, 80, 55, 90, 70, 50, 85, 60, 75, 95].map(
                        (h, i) => (
                          <div
                            key={i}
                            className="mock-bar"
                            style={{ height: `${h}%`, opacity: 0.6 + i * 0.03 }}
                          />
                        ),
                      )}
                    </div>
                  </div>
                  <div className="mock-laptop-base" />
                </div>
                <div className="hero-stat-card top-right">
                  <div className="stat-dot" />
                  <div>
                    <div>$12,450</div>
                    <div className="stat-label">Revenue this month</div>
                  </div>
                </div>
                <div className="hero-stat-card bottom-left">
                  <div className="stat-dot" style={{ background: "#3b82f6" }} />
                  <div>
                    <div>24 Invoices</div>
                    <div className="stat-label">Sent this week</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* LOGO BAR */}
        <div className="fio-logos">
          <div className="fio-logos-inner">
            <p>Trusted by teams at</p>
            <div className="logo-items">
              {["Techflux", "CreativeGo", "Lumina", "Nexus", "Solopreneur"].map(
                (name) => (
                  <div key={name} className="logo-item">
                    {name}
                  </div>
                ),
              )}
            </div>
          </div>
        </div>

        {/* FEATURES */}
        <section className="fio-features">
          <h2>Everything you need to run your solo business</h2>
          <p>
            Powerful finance tools designed for speed, clarity, and precision.
          </p>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <ChartIcon />
              </div>
              <h3>Smart Invoicing</h3>
              <p>
                Create and send professional invoices in seconds. Set up
                recurring billing, automated reminders, and get paid faster with
                integrated payment links.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <InvoiceIcon />
              </div>
              <h3>Expense Tracking</h3>
              <p>
                Automatically categorize your business expenses and keep your
                books clean throughout the year. Export reports to your
                accountant with one click.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <ReportIcon />
              </div>
              <h3>Detailed Reports</h3>
              <p>
                Understand your business performance at a glance. Visual revenue
                trends, client profitability, and tax summaries available on
                your dashboard.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="fio-cta">
          <div className="fio-cta-inner">
            <h2>Ready to take control of your finances?</h2>
            <p>
              Join thousands of freelancers who use FreelancIO to simplify their
              finances and grow their business with confidence. Start for free,
              upgrade when you're ready.
            </p>
            {/* Linked to the signup flow */}
            <button className="btn-cta" onClick={() => navigate("/signup")}>
              Start Your Free Trial
            </button>
            <span className="cta-sub">No credit card required</span>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="fio-footer">
          <div className="fio-footer-top">
            <div className="footer-brand">
              <div className="fio-logo">
                <div className="fio-logo-icon">
                  <svg viewBox="0 0 16 16" style={{ fill: "white" }}>
                    <path d="M8 2L2 6v8h4v-4h4v4h4V6L8 2z" />
                  </svg>
                </div>
                FreelancIO
              </div>
              <p>
                The finance platform designed specifically for the needs of
                modern independents.
              </p>
              <div className="footer-socials">
                {["twitter", "github", "linkedin"].map((s) => (
                  <button key={s} className="social-btn">
                    <svg viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
            <div className="footer-col">
              <h4>Product</h4>
              <ul>
                {[
                  "Invoicing",
                  "Expense Tracking",
                  "Reporting",
                  "Integrations",
                ].map((l) => (
                  <li key={l}>
                    <a href="#">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="footer-col">
              <h4>Company</h4>
              <ul>
                {["About Us", "Careers", "Contacts", "Blog", "Custom"].map(
                  (l) => (
                    <li key={l}>
                      <a href="#">{l}</a>
                    </li>
                  ),
                )}
              </ul>
            </div>
            <div className="footer-col">
              <h4>Legal</h4>
              <ul>
                {[
                  "Privacy Policy",
                  "Terms of Service",
                  "Security",
                  "Cookie Policy",
                ].map((l) => (
                  <li key={l}>
                    <a href="#">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="fio-footer-bottom">
            <div className="footer-copy">
              © 2026 FreelancIO. All rights reserved.
            </div>
            <div className="footer-bottom-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms</a>
              <a href="#">Sitemap</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
