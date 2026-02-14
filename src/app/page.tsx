import { ABOUT, CAREER, BLOG } from "@/lib/data";
import { getNowPlaying } from "@/lib/spotify";
import Typewriter from "@/components/Typewriter";

export const revalidate = 30;

export default async function Home() {
    const listening = await getNowPlaying();

    return (
        <div className="page">

            {/* ─── Header ─── */}
            <header className="header fade-in">
                <h1 className="header-name">Benjamin Charest</h1>
                <p className="header-subtitle"><Typewriter /></p>
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
                                <span className="career-separator">·</span>
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

            {/* ─── Listening ─── */}
            {listening && (
                <section className="listening fade-in">
                    <div className="section-label">Listening</div>
                    <div className="blog-list">
                        <a
                            href={listening.url}
                            className="blog-item"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <span className="blog-date">{listening.artist}</span>
                            <span className="blog-title">{listening.track}</span>
                            {listening.isLive ? (
                                <span className="listening-live">
                                    <span className="listening-live-dot" />
                                    <span className="listening-live-text">Live</span>
                                </span>
                            ) : (
                                <span className="listening-live">
                                    <span className="listening-ago-dot" />
                                    <span className="listening-live-text">
                                        {listening.playedAt ?? "recently"}
                                    </span>
                                </span>
                            )}
                        </a>
                    </div>
                </section>
            )}

            {/* ─── Footer ─── */}
            <footer className="footer fade-in">
                <span>© 2026</span>
                <div className="footer-links">
                    <a href="https://github.com/8enji">GitHub</a>
                    <a href="https://www.linkedin.com/in/ben-charest/">LinkedIn</a>
                    <a href="mailto:b.charest04@gmail.com">Email</a>
                </div>
            </footer>

        </div>
    );
}
