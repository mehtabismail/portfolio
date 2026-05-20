export function LandingNavbar() {
  return (
    <nav>
      <div className="nav-logo">
        Dev<span>Folio</span>
      </div>
      <div className="nav-links">
        <a href="#how">How it works</a>
        <a href="#explorer">Explore</a>
        <a href="#blog">Blog</a>
        <a href="#roadmap">Roadmap</a>
      </div>
      <a href="#cta" className="nav-cta">
        Create yours — free
      </a>
    </nav>
  );
}

export function LandingHero() {
  return (
    <section id="hero">
      <div className="hero-glow" />
      <div className="hero-glow2" />
      <div className="hero-badge">
        <span className="hero-badge-dot" /> Now with blogging + project showcase
      </div>
      <h1 className="hero-title">
        Your developer presence,
        <br />
        <span className="line2">fully alive.</span>
      </h1>
      <p className="hero-sub">
        Sign in with Google, and in minutes you have a beautiful portfolio, a blog, and a dashboard — all at your own URL. No code needed.
      </p>
      <div className="hero-ctas">
        <a href="#cta" className="btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
          Create your portfolio — free
        </a>
        <a href="#explorer" className="btn-secondary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          Browse portfolios
        </a>
      </div>

      <div className="hero-cards">
        <div className="port-card" style={{ animation: "fadeUp 0.7s 0.6s ease both" }}>
          <div className="port-avatar" style={{ background: "linear-gradient(135deg, #7c6dfa, #9d8ffa)" }}>
            AM
          </div>
          <div className="port-name">Ahmed Malik</div>
          <div className="port-role">Full Stack Developer · Lahore</div>
          <div className="port-tags">
            <span className="port-tag">React</span>
            <span className="port-tag">Node.js</span>
            <span className="port-tag">Firebase</span>
          </div>
          <div className="port-stats">
            <div className="port-stat">
              <strong>12</strong>Projects
            </div>
            <div className="port-stat">
              <strong>8</strong>Blogs
            </div>
            <div className="port-stat">
              <strong>1.2k</strong>Views
            </div>
          </div>
        </div>
        <div className="port-card" style={{ animation: "fadeUp 0.7s 0.75s ease both", marginTop: "-24px" }}>
          <div className="port-avatar" style={{ background: "linear-gradient(135deg, #3ecf8e, #2ab87a)" }}>
            SR
          </div>
          <div className="port-name">Sara Rehman</div>
          <div className="port-role">UI/UX Designer · Karachi</div>
          <div className="port-tags">
            <span className="port-tag">Figma</span>
            <span className="port-tag">Webflow</span>
            <span className="port-tag">Design</span>
          </div>
          <div className="port-stats">
            <div className="port-stat">
              <strong>9</strong>Projects
            </div>
            <div className="port-stat">
              <strong>5</strong>Blogs
            </div>
            <div className="port-stat">
              <strong>890</strong>Views
            </div>
          </div>
        </div>
        <div className="port-card" style={{ animation: "fadeUp 0.7s 0.9s ease both" }}>
          <div className="port-avatar" style={{ background: "linear-gradient(135deg, #e8645a, #f0877e)" }}>
            ZK
          </div>
          <div className="port-name">Zaid Khan</div>
          <div className="port-role">Backend Engineer · Islamabad</div>
          <div className="port-tags">
            <span className="port-tag">Python</span>
            <span className="port-tag">Django</span>
            <span className="port-tag">AWS</span>
          </div>
          <div className="port-stats">
            <div className="port-stat">
              <strong>18</strong>Projects
            </div>
            <div className="port-stat">
              <strong>11</strong>Blogs
            </div>
            <div className="port-stat">
              <strong>2.4k</strong>Views
            </div>
          </div>
        </div>
        <div className="port-card" style={{ animation: "fadeUp 0.7s 1.05s ease both", marginTop: "-24px" }}>
          <div className="port-avatar" style={{ background: "linear-gradient(135deg, #f0a328, #fabd5a)" }}>
            NF
          </div>
          <div className="port-name">Nadia Farooq</div>
          <div className="port-role">Frontend Dev · Remote</div>
          <div className="port-tags">
            <span className="port-tag">Vue.js</span>
            <span className="port-tag">Tailwind</span>
            <span className="port-tag">TypeScript</span>
          </div>
          <div className="port-stats">
            <div className="port-stat">
              <strong>7</strong>Projects
            </div>
            <div className="port-stat">
              <strong>14</strong>Blogs
            </div>
            <div className="port-stat">
              <strong>3.1k</strong>Views
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function LandingSocialProof() {
  return (
    <div id="proof">
      <div className="proof-stat">
        <div className="proof-num counter-num" data-target="847">
          0
        </div>
        <div className="proof-label">Portfolios created</div>
      </div>
      <div className="proof-stat">
        <div className="proof-num counter-num" data-target="2340">
          0
        </div>
        <div className="proof-label">Blogs published</div>
      </div>
      <div className="proof-stat">
        <div className="proof-num counter-num" data-target="9600">
          0
        </div>
        <div className="proof-label">Projects showcased</div>
      </div>
      <div className="proof-stat">
        <div className="proof-num counter-num" data-target="48000">
          0
        </div>
        <div className="proof-label">Total views</div>
      </div>
    </div>
  );
}

export function LandingHowItWorks() {
  return (
    <section id="how">
      <div style={{ textAlign: "center", maxWidth: "640px", margin: "0 auto" }}>
        <div className="section-label reveal">How it works</div>
        <h2 className="section-title reveal reveal-delay1">Three steps. Then you're live.</h2>
        <p className="section-sub reveal reveal-delay2" style={{ margin: "0 auto" }}>
          No setup overhead, no design decisions, no hosting stress. Just your work — online and beautiful.
        </p>
      </div>
      <div className="steps reveal">
        <div className="step">
          <div className="step-num">01</div>
          <div className="step-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7c6dfa" strokeWidth="2">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          </div>
          <div className="step-title">Sign in with Google</div>
          <div className="step-desc">One click. Your name, photo, and email auto-populate. Your portfolio skeleton is instantly created.</div>
          <div className="step-connector">→</div>
        </div>
        <div className="step">
          <div className="step-num">02</div>
          <div className="step-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3ecf8e" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <path d="M8 12h8M8 8h8M8 16h5" />
            </svg>
          </div>
          <div className="step-title">Add your work</div>
          <div className="step-desc">Use your dashboard to add projects, work experience, and publish your first blog post. All with a clean editor.</div>
          <div className="step-connector">→</div>
        </div>
        <div className="step">
          <div className="step-num">03</div>
          <div className="step-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#e8645a" strokeWidth="2">
              <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
            </svg>
          </div>
          <div className="step-title">Share your URL</div>
          <div className="step-desc">
            Your portfolio lives at{" "}
            <code style={{ fontSize: "12px", color: "var(--accent)", background: "rgba(124,109,250,0.1)", padding: "2px 6px", borderRadius: "4px" }}>
              /u/yourname
            </code>
            . Share it anywhere — LinkedIn, job apps, Twitter.
          </div>
        </div>
      </div>
    </section>
  );
}

export function LandingFeatures() {
  return (
    <section id="features">
      <div style={{ textAlign: "center", maxWidth: "640px", margin: "0 auto" }}>
        <div className="section-label reveal">Features</div>
        <h2 className="section-title reveal reveal-delay1">Everything in one platform</h2>
        <p className="section-sub reveal reveal-delay2" style={{ margin: "0 auto" }}>
          Dashboard, portfolio, blog, projects — managed from a single place, shown at a single URL.
        </p>
      </div>

      <div className="bento reveal">
        <div className="bento-card wide">
          <div className="bento-label">Dashboard</div>
          <div className="bento-title">Manage everything from one place</div>
          <div className="bento-desc">Edit your projects, update work history, manage blog posts — all without touching code.</div>
          <div className="bento-visual">
            <div className="mock-browser">
              <div className="mock-bar">
                <div className="mock-dot" style={{ background: "#e8645a" }} />
                <div className="mock-dot" style={{ background: "#f0a328" }} />
                <div className="mock-dot" style={{ background: "#3ecf8e" }} />
                <div className="mock-url" />
                <span style={{ fontSize: "10px", color: "var(--text3)" }}>devfolio.app/dashboard</span>
              </div>
              <div className="mock-content">
                <div className="dash-row">
                  <div className="dash-block" />
                  <div className="dash-block sm" />
                  <div className="dash-block accent" />
                </div>
                <div className="dash-row">
                  <div className="dash-block" style={{ height: "20px", flex: 0.4, background: "rgba(255,255,255,0.06)" }} />
                  <div className="dash-block" style={{ height: "20px", flex: 1, background: "rgba(255,255,255,0.04)" }} />
                </div>
                <div className="dash-chart">
                  <div className="dash-bar" style={{ height: "40%" }} />
                  <div className="dash-bar" style={{ height: "65%" }} />
                  <div className="dash-bar" style={{ height: "45%" }} />
                  <div className="dash-bar" style={{ height: "80%" }} />
                  <div className="dash-bar" style={{ height: "55%", background: "rgba(62,207,142,0.4)" }} />
                  <div className="dash-bar" style={{ height: "90%", background: "rgba(62,207,142,0.4)" }} />
                  <div className="dash-bar" style={{ height: "70%" }} />
                  <div className="dash-bar" style={{ height: "100%", background: "rgba(124,109,250,0.6)" }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bento-card">
          <div className="bento-label">Blogging</div>
          <div className="bento-title">Write and publish your thoughts</div>
          <div className="bento-desc">Built-in blog, like Medium but on your portfolio.</div>
          <div className="bento-visual">
            <div className="blog-post">
              <div className="blog-post-title">How I built my first SaaS in 30 days</div>
              <div className="blog-post-meta">5 min read · React · Firebase</div>
              <div className="blog-post-line" />
              <div className="blog-post-line short" />
            </div>
            <div className="blog-post" style={{ opacity: 0.6 }}>
              <div className="blog-post-title">Understanding Async/Await deeply</div>
              <div className="blog-post-meta">8 min read · JavaScript</div>
              <div className="blog-post-line" />
              <div className="blog-post-line short" />
            </div>
          </div>
        </div>

        <div className="bento-card">
          <div className="bento-label">Projects</div>
          <div className="bento-title">Showcase your best work</div>
          <div className="bento-desc">Add projects with images, tech stack, and live links.</div>
          <div className="bento-visual">
            <div className="proj-card-mini">
              <div className="proj-icon" style={{ background: "linear-gradient(135deg,#7c6dfa,#9d8ffa)" }} />
              <div className="proj-info">
                <div className="proj-name">E-commerce Platform</div>
                <div className="proj-tech">React · Node · Stripe</div>
              </div>
              <div className="proj-stars">★ 4.9</div>
            </div>
            <div className="proj-card-mini">
              <div className="proj-icon" style={{ background: "linear-gradient(135deg,#3ecf8e,#2ab87a)" }} />
              <div className="proj-info">
                <div className="proj-name">AI Resume Builder</div>
                <div className="proj-tech">Python · GPT-4 · FastAPI</div>
              </div>
              <div className="proj-stars">★ 4.7</div>
            </div>
            <div className="proj-card-mini" style={{ opacity: 0.5 }}>
              <div className="proj-icon" style={{ background: "linear-gradient(135deg,#e8645a,#f0877e)" }} />
              <div className="proj-info">
                <div className="proj-name">Dev Portfolio Builder</div>
                <div className="proj-tech">Next.js · Firebase</div>
              </div>
              <div className="proj-stars">★ 5.0</div>
            </div>
          </div>
        </div>

        <div
          className="bento-card"
          style={{ background: "linear-gradient(135deg, rgba(124,109,250,0.1), rgba(62,207,142,0.06))", borderColor: "rgba(124,109,250,0.2)" }}
        >
          <div className="bento-label">Your URL</div>
          <div className="bento-title">Your own corner of the internet</div>
          <div className="bento-desc">Every user gets a unique, shareable URL at /u/yourname</div>
          <div className="bento-visual">
            <div
              style={{
                background: "var(--bg)",
                borderRadius: "10px",
                padding: "14px 16px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                border: "1px solid var(--border)",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent3)" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
              </svg>
              <span style={{ fontSize: "13px", color: "var(--text2)" }}>
                devfolio.app/u/<span style={{ color: "var(--accent3)", fontWeight: 600 }}>yourname</span>
              </span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text3)" strokeWidth="2" style={{ marginLeft: "auto" }}>
                <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
              </svg>
            </div>
            <div style={{ marginTop: "12px", fontSize: "12px", color: "var(--text3)" }}>Share on LinkedIn, Twitter, email — anywhere.</div>
          </div>
        </div>

        <div className="bento-card">
          <div className="bento-label">Powered by</div>
          <div className="bento-title">Firebase + Cloudinary backend</div>
          <div className="bento-desc">Real-time updates. Fast image delivery. Always online.</div>
          <div className="bento-visual" style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
            <div
              style={{
                flex: 1,
                background: "rgba(255,167,38,0.1)",
                border: "1px solid rgba(255,167,38,0.2)",
                borderRadius: "10px",
                padding: "12px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#ffa726", marginBottom: "4px" }}>Firebase</div>
              <div style={{ fontSize: "10px", color: "var(--text3)" }}>Real-time DB</div>
            </div>
            <div
              style={{
                flex: 1,
                background: "rgba(62,207,142,0.1)",
                border: "1px solid rgba(62,207,142,0.2)",
                borderRadius: "10px",
                padding: "12px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#3ecf8e", marginBottom: "4px" }}>Cloudinary</div>
              <div style={{ fontSize: "10px", color: "var(--text3)" }}>Media CDN</div>
            </div>
            <div
              style={{
                flex: 1,
                background: "rgba(124,109,250,0.1)",
                border: "1px solid rgba(124,109,250,0.2)",
                borderRadius: "10px",
                padding: "12px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#7c6dfa", marginBottom: "4px" }}>Vercel</div>
              <div style={{ fontSize: "10px", color: "var(--text3)" }}>Global CDN</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function LandingExplorer() {
  return (
    <section id="explorer">
      <div style={{ textAlign: "center", maxWidth: "640px", margin: "0 auto" }}>
        <div className="section-label reveal">Live portfolios</div>
        <h2 className="section-title reveal reveal-delay1">See what others built</h2>
        <p className="section-sub reveal reveal-delay2" style={{ margin: "0 auto" }}>
          Real developers. Real portfolios. Created on this platform and live right now.
        </p>
      </div>

      <div className="explorer-grid reveal">
        <div className="explore-card">
          <div className="explore-header" style={{ background: "linear-gradient(135deg, #1a1628, #2d2060)" }}>
            <div className="explore-avatar" style={{ background: "linear-gradient(135deg, #7c6dfa, #9d8ffa)" }}>
              AM
            </div>
          </div>
          <div className="explore-body">
            <div className="explore-name">Ahmed Malik</div>
            <div className="explore-role">Full Stack Developer</div>
            <div className="explore-bio">Building scalable web apps. Open to remote opportunities.</div>
            <div className="explore-tags">
              <span className="explore-tag">React</span>
              <span className="explore-tag">Node.js</span>
              <span className="explore-tag">Firebase</span>
              <span className="explore-tag">TypeScript</span>
            </div>
            <div className="explore-footer">
              <div className="explore-stat">
                <strong>12</strong> projects · <strong>8</strong> blogs
              </div>
              <div className="explore-link">View portfolio →</div>
            </div>
          </div>
        </div>

        <div className="explore-card">
          <div className="explore-header" style={{ background: "linear-gradient(135deg, #0e2820, #124e38)" }}>
            <div className="explore-avatar" style={{ background: "linear-gradient(135deg, #3ecf8e, #2ab87a)" }}>
              SR
            </div>
          </div>
          <div className="explore-body">
            <div className="explore-name">Sara Rehman</div>
            <div className="explore-role">UI/UX Designer</div>
            <div className="explore-bio">Creating user-centered digital experiences that convert.</div>
            <div className="explore-tags">
              <span className="explore-tag">Figma</span>
              <span className="explore-tag">Prototyping</span>
              <span className="explore-tag">Webflow</span>
            </div>
            <div className="explore-footer">
              <div className="explore-stat">
                <strong>9</strong> projects · <strong>5</strong> blogs
              </div>
              <div className="explore-link">View portfolio →</div>
            </div>
          </div>
        </div>

        <div className="explore-card">
          <div className="explore-header" style={{ background: "linear-gradient(135deg, #281410, #4e2018)" }}>
            <div className="explore-avatar" style={{ background: "linear-gradient(135deg, #e8645a, #f0877e)" }}>
              ZK
            </div>
          </div>
          <div className="explore-body">
            <div className="explore-name">Zaid Khan</div>
            <div className="explore-role">Backend Engineer</div>
            <div className="explore-bio">Python specialist. I build APIs that don't break at 2am.</div>
            <div className="explore-tags">
              <span className="explore-tag">Python</span>
              <span className="explore-tag">Django</span>
              <span className="explore-tag">AWS</span>
              <span className="explore-tag">Docker</span>
            </div>
            <div className="explore-footer">
              <div className="explore-stat">
                <strong>18</strong> projects · <strong>11</strong> blogs
              </div>
              <div className="explore-link">View portfolio →</div>
            </div>
          </div>
        </div>

        <div className="explore-card">
          <div className="explore-header" style={{ background: "linear-gradient(135deg, #271e06, #4d3a0c)" }}>
            <div className="explore-avatar" style={{ background: "linear-gradient(135deg, #f0a328, #fabd5a)" }}>
              NF
            </div>
          </div>
          <div className="explore-body">
            <div className="explore-name">Nadia Farooq</div>
            <div className="explore-role">Frontend Developer</div>
            <div className="explore-bio">Vue.js & animation enthusiast. I make UIs that feel alive.</div>
            <div className="explore-tags">
              <span className="explore-tag">Vue.js</span>
              <span className="explore-tag">GSAP</span>
              <span className="explore-tag">Tailwind</span>
            </div>
            <div className="explore-footer">
              <div className="explore-stat">
                <strong>7</strong> projects · <strong>14</strong> blogs
              </div>
              <div className="explore-link">View portfolio →</div>
            </div>
          </div>
        </div>

        <div className="explore-card">
          <div className="explore-header" style={{ background: "linear-gradient(135deg, #0e1a28, #12304e)" }}>
            <div className="explore-avatar" style={{ background: "linear-gradient(135deg, #378add, #6aaff0)" }}>
              OA
            </div>
          </div>
          <div className="explore-body">
            <div className="explore-name">Omar Aslam</div>
            <div className="explore-role">DevOps Engineer</div>
            <div className="explore-bio">Kubernetes, CI/CD, and infra automation. Cloud native mindset.</div>
            <div className="explore-tags">
              <span className="explore-tag">Kubernetes</span>
              <span className="explore-tag">Terraform</span>
              <span className="explore-tag">GCP</span>
            </div>
            <div className="explore-footer">
              <div className="explore-stat">
                <strong>15</strong> projects · <strong>6</strong> blogs
              </div>
              <div className="explore-link">View portfolio →</div>
            </div>
          </div>
        </div>

        <div className="explore-card" style={{ borderColor: "rgba(124,109,250,0.3)", background: "rgba(124,109,250,0.04)" }}>
          <div
            className="explore-header"
            style={{ background: "linear-gradient(135deg, #16121f, #2a2040)", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "28px", marginBottom: "4px" }}>+</div>
              <div style={{ fontSize: "12px", color: "var(--accent)" }}>Your portfolio here</div>
            </div>
          </div>
          <div className="explore-body">
            <div className="explore-name" style={{ color: "var(--accent)" }}>
              You, next
            </div>
            <div className="explore-role">Your Role · Your City</div>
            <div className="explore-bio">Create your portfolio in minutes and join these developers.</div>
            <div className="explore-tags">
              <span className="explore-tag" style={{ border: "1px dashed var(--border2)" }}>
                Your stack
              </span>
            </div>
            <div className="explore-footer">
              <a href="#cta" className="btn-primary" style={{ fontSize: "12px", padding: "8px 16px" }}>
                Create yours — free
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function LandingBlogSection() {
  return (
    <section id="blog">
      <div className="blog-layout">
        <div>
          <div className="section-label reveal">Blogging</div>
          <h2 className="section-title reveal reveal-delay1">Write. Publish. Be heard.</h2>
          <p className="section-sub reveal reveal-delay2">
            Your portfolio shouldn't just show what you built — it should share how you think. Our built-in blog puts your writing right next to your
            work.
          </p>
          <div className="blog-features reveal reveal-delay2">
            <div className="blog-feat">
              <div className="blog-feat-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3ecf8e" strokeWidth="2">
                  <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              </div>
              <div className="blog-feat-text">
                <h4>Rich text editor</h4>
                <p>Write with formatting, code blocks, and images. No markdown knowledge needed.</p>
              </div>
            </div>
            <div className="blog-feat">
              <div className="blog-feat-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3ecf8e" strokeWidth="2">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                </svg>
              </div>
              <div className="blog-feat-text">
                <h4>Public on your portfolio</h4>
                <p>Blogs appear on your /u/yourname page — same URL, no separate domain.</p>
              </div>
            </div>
            <div className="blog-feat">
              <div className="blog-feat-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3ecf8e" strokeWidth="2">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </div>
              <div className="blog-feat-text">
                <h4>Lazy-loaded for performance</h4>
                <p>Blog section loads only when visited. Portfolio stays lightning fast.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="reveal reveal-delay1">
          <div className="blog-mockup">
            <div className="blog-mock-bar">
              <div className="mock-dot" style={{ background: "#e8645a" }} />
              <div className="mock-dot" style={{ background: "#f0a328" }} />
              <div className="mock-dot" style={{ background: "#3ecf8e" }} />
              <span style={{ fontSize: "10px", color: "var(--text3)", marginLeft: "8px" }}>devfolio.app/u/zaidk/blog/async-await</span>
            </div>
            <div className="blog-mock-body">
              <div className="blog-mock-tag">JavaScript</div>
              <div className="blog-mock-title">Understanding Async/Await at a deep level</div>
              <div className="blog-mock-author">
                <div className="blog-mock-av">ZK</div>
                <div className="blog-mock-meta">Zaid Khan · 8 min read · May 2025</div>
              </div>
              <div className="blog-mock-line" />
              <div className="blog-mock-line" />
              <div className="blog-mock-line short" />
              <div className="blog-mock-code">
                async function fetchUser(id) {"{"}
                <br />
                &nbsp;&nbsp;const user = await db.get(id);
                <br />
                &nbsp;&nbsp;return user;
                <br />
                {"}"}
              </div>
              <div className="blog-mock-line" />
              <div className="blog-mock-line short" />
              <div style={{ display: "flex", gap: "8px", marginTop: "14px" }}>
                <span style={{ fontSize: "11px", padding: "3px 10px", background: "rgba(124,109,250,0.1)", color: "var(--accent)", borderRadius: "20px" }}>
                  JavaScript
                </span>
                <span style={{ fontSize: "11px", padding: "3px 10px", background: "rgba(62,207,142,0.1)", color: "#3ecf8e", borderRadius: "20px" }}>
                  Async
                </span>
                <span style={{ fontSize: "11px", padding: "3px 10px", background: "rgba(255,255,255,0.06)", color: "var(--text2)", borderRadius: "20px" }}>
                  Web Dev
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function LandingRoadmap() {
  return (
    <section id="roadmap">
      <div style={{ textAlign: "center", maxWidth: "640px", margin: "0 auto" }}>
        <div className="section-label reveal">Roadmap</div>
        <h2 className="section-title reveal reveal-delay1">We're just getting started</h2>
        <p className="section-sub reveal reveal-delay2" style={{ margin: "0 auto" }}>
          The platform is growing. Here's what's live, what's coming, and what's on the horizon.
        </p>
      </div>
      <div className="roadmap-grid reveal">
        <div className="road-col">
          <div className="road-col-title" style={{ color: "var(--accent3)" }}>
            ✓ Live now
          </div>
          <div className="road-item"><div className="road-badge road-live">Live</div><div className="road-item-title">Google OAuth sign-in</div><div className="road-item-desc">One-click account creation</div></div>
          <div className="road-item"><div className="road-badge road-live">Live</div><div className="road-item-title">Portfolio dashboard</div><div className="road-item-desc">Manage all your content</div></div>
          <div className="road-item"><div className="road-badge road-live">Live</div><div className="road-item-title">Blog publishing</div><div className="road-item-desc">Write and publish articles</div></div>
          <div className="road-item"><div className="road-badge road-live">Live</div><div className="road-item-title">Projects showcase</div><div className="road-item-desc">Add projects with tech stack</div></div>
          <div className="road-item"><div className="road-badge road-live">Live</div><div className="road-item-title">Multi-tenant URLs</div><div className="road-item-desc">/u/yourname for everyone</div></div>
        </div>
        <div className="road-col">
          <div className="road-col-title" style={{ color: "#9d8ffa" }}>
            ⏳ Coming soon
          </div>
          <div className="road-item"><div className="road-badge road-soon">Soon</div><div className="road-item-title">Custom domains</div><div className="road-item-desc">Connect yourname.dev</div></div>
          <div className="road-item"><div className="road-badge road-soon">Soon</div><div className="road-item-title">Portfolio analytics</div><div className="road-item-desc">See who's viewing your work</div></div>
          <div className="road-item"><div className="road-badge road-soon">Soon</div><div className="road-item-title">Theme customization</div><div className="road-item-desc">Pick colors, fonts, layouts</div></div>
          <div className="road-item"><div className="road-badge road-soon">Soon</div><div className="road-item-title">Resume/CV export</div><div className="road-item-desc">Download as styled PDF</div></div>
        </div>
        <div className="road-col">
          <div className="road-col-title" style={{ color: "var(--accent2)" }}>
            🔭 On the horizon
          </div>
          <div className="road-item"><div className="road-badge road-future">Planned</div><div className="road-item-title">GitHub code reviews</div><div className="road-item-desc">AI-powered repo analysis</div></div>
          <div className="road-item"><div className="road-badge road-future">Planned</div><div className="road-item-title">Developer roadmaps</div><div className="road-item-desc">Visualize your learning path</div></div>
          <div className="road-item"><div className="road-badge road-future">Planned</div><div className="road-item-title">Collaboration spaces</div><div className="road-item-desc">Team portfolios for agencies</div></div>
          <div className="road-item"><div className="road-badge road-future">Planned</div><div className="road-item-title">Job board integration</div><div className="road-item-desc">Apply directly from portfolio</div></div>
        </div>
      </div>
    </section>
  );
}

export function LandingComparison() {
  return (
    <section id="compare">
      <div style={{ textAlign: "center", maxWidth: "640px", margin: "0 auto" }}>
        <div className="section-label reveal">Why DevFolio</div>
        <h2 className="section-title reveal reveal-delay1">Why not just use GitHub?</h2>
        <p className="section-sub reveal reveal-delay2" style={{ margin: "0 auto" }}>
          Because code repos aren't portfolios. Here's what you actually get on each platform.
        </p>
      </div>
      <div className="compare-table-wrap reveal">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Feature</th><th>GitHub</th><th>LinkedIn</th><th>Notion</th><th>Read.cv</th><th className="highlight col-highlight">DevFolio ✦</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="feature-name">Beautiful portfolio page</td><td><span className="cross">—</span></td><td><span className="partial">Partial</span></td><td><span className="partial">Partial</span></td><td><span className="check">✓</span></td><td className="col-highlight"><span className="check">✓</span></td></tr>
            <tr><td className="feature-name">Built-in blogging</td><td><span className="cross">—</span></td><td><span className="cross">—</span></td><td><span className="check">✓</span></td><td><span className="cross">—</span></td><td className="col-highlight"><span className="check">✓</span></td></tr>
            <tr><td className="feature-name">Project showcase</td><td><span className="check">✓</span></td><td><span className="partial">Partial</span></td><td><span className="partial">Partial</span></td><td><span className="check">✓</span></td><td className="col-highlight"><span className="check">✓</span></td></tr>
            <tr><td className="feature-name">Content dashboard</td><td><span className="cross">—</span></td><td><span className="cross">—</span></td><td><span className="check">✓</span></td><td><span className="cross">—</span></td><td className="col-highlight"><span className="check">✓</span></td></tr>
            <tr><td className="feature-name">Google sign-in onboarding</td><td><span className="cross">—</span></td><td><span className="cross">—</span></td><td><span className="cross">—</span></td><td><span className="cross">—</span></td><td className="col-highlight"><span className="check">✓</span></td></tr>
            <tr><td className="feature-name">Shareable /u/yourname URL</td><td><span className="cross">—</span></td><td><span className="cross">—</span></td><td><span className="cross">—</span></td><td><span className="check">✓</span></td><td className="col-highlight"><span className="check">✓</span></td></tr>
            <tr><td className="feature-name">Designed for developers</td><td><span className="check">✓</span></td><td><span className="cross">—</span></td><td><span className="cross">—</span></td><td><span className="check">✓</span></td><td className="col-highlight"><span className="check">✓</span></td></tr>
            <tr><td className="feature-name">Free to use</td><td><span className="check">✓</span></td><td><span className="check">✓</span></td><td><span className="partial">Limited</span></td><td><span className="check">✓</span></td><td className="col-highlight"><span className="check">✓</span></td></tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function LandingFinalCta() {
  return (
    <section id="cta">
      <div className="cta-glow" />
      <div className="section-label reveal" style={{ justifyContent: "center", display: "flex" }}>Ready?</div>
      <h2 className="cta-title reveal reveal-delay1">
        Your work deserves
        <br />
        <span style={{ color: "var(--accent)" }}>its own space.</span>
      </h2>
      <p className="cta-sub reveal reveal-delay2">Join hundreds of developers who launched their presence in minutes.</p>
      <div className="reveal reveal-delay2">
        <a href="#" className="btn-primary" style={{ fontSize: "17px", padding: "16px 36px", margin: "0 auto", display: "inline-flex" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
          Create your portfolio — free
        </a>
      </div>
      <div className="cta-trust reveal reveal-delay3">
        <span>Free forever</span>
        <span>No credit card</span>
        <span>Ready in 2 minutes</span>
        <span>Your own URL</span>
      </div>
    </section>
  );
}

export function LandingFooter() {
  return (
    <footer>
      <div className="footer-logo">
        Dev<span>Folio</span>
      </div>
      <div className="footer-links">
        <a href="#how">How it works</a>
        <a href="#explorer">Browse</a>
        <a href="#blog">Blog</a>
        <a href="#roadmap">Roadmap</a>
        <a href="#">GitHub</a>
        <a href="#">Built by you →</a>
      </div>
      <div className="footer-credit">© 2025 DevFolio · Free for everyone</div>
    </footer>
  );
}
