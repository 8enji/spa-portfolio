import { ABOUT, CAREER, BLOG } from "@/lib/data";

export default function Home() {
    return (
        <div className="page">

            {/* ─── Header ─── */}
            <header className="header fade-in">
                <h1 className="header-name">Ben</h1>
                <p className="header-subtitle">Software Engineer</p>
            </header>

            {/* ─── About ─── */}
            <section className="about fade-in">
                <p className="about-text">
                    {ABOUT.bio}
                    <a href={ABOUT.bioLinks.github.url}>{ABOUT.bioLinks.github.text}</a>
                    {ABOUT.bioLinks.suffix}
                    <a href={ABOUT.bioLinks.email.url}>{ABOUT.bioLinks.email.text}</a>.
                </p>
            </section>

            {/* ─── Career ─── */}
            <section className="career fade-in">
                <div className="section-label">Experience</div>
                <div className="career-list">
                    {CAREER.map((item) => (
                        <div key={item.company} className="career-item">
                            <div className="career-left">
                                <span
                                    className="career-dot"
                                    style={{ backgroundColor: item.dotColor }}
                                />
                                <span className="career-company">{item.company}</span>
                            </div>
                            <div className="career-right">
                                <span className="career-role">{item.role}</span>
                                <span className="career-separator">,</span>
                                <span className="career-date">{item.period}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ─── Blog ─── */}
            <section className="blog fade-in">
                <div className="section-label">Writing</div>
                <div className="blog-list">
                    {BLOG.map((post) => (
                        <a key={post.title} href={post.url} className="blog-item">
                            <span className="blog-date">{post.date}</span>
                            <span className="blog-title">{post.title}</span>
                        </a>
                    ))}
                </div>
            </section>

            {/* ─── Footer ─── */}
            <footer className="footer fade-in">
                <span>© 2025</span>
                <div className="footer-links">
                    <a href="#">Twitter</a>
                    <a href="#">GitHub</a>
                    <a href="mailto:hello@example.com">Email</a>
                </div>
            </footer>

        </div>
    );
}
