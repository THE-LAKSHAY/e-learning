import React, { useRef, useEffect, useState } from "react";
import "./BlogPosts.css";

const posts = [
  {
    id:     1,
    title:  "How AI is Transforming Online Learning in 2025",
    author: "Karan Mehta",
    date:   "April 20, 2025",
    tag:    "Education",
    read:   "5 min read",
    excerpt: "Discover how artificial intelligence is personalising education, automating grading, and reshaping how students learn globally.",
    accent: "#3b82f6",
    image:  "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800",
    link:   "https://www.coursera.org/articles/ai-in-education",
  },
  {
    id:     2,
    title:  "Top Programming Skills Every Student Should Learn Today",
    author: "Meera Joshi",
    date:   "May 8, 2025",
    tag:    "Career",
    read:   "7 min read",
    excerpt: "From Python to SQL — here are the most in-demand programming skills that will give you a massive edge in any tech career.",
    accent: "#10b981",
    image:  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800",
    link:   "https://www.freecodecamp.org/news/learn-programming/",
  },
  {
    id:     3,
    title:  "The Future of E-Learning Platforms and Digital Education",
    author: "Arjun Sethi",
    date:   "June 14, 2025",
    tag:    "Technology",
    read:   "6 min read",
    excerpt: "E-learning is no longer just video lectures. Explore the immersive, interactive future that's already here and growing fast.",
    accent: "#a78bfa",
    image:  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800",
    link:   "https://www.edx.org/resources/what-is-elearning",
  },
];

const Card = ({ post, index }) => {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const ob = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); ob.disconnect(); } },
      { threshold: 0.12 }
    );
    if (ref.current) ob.observe(ref.current);
    return () => ob.disconnect();
  }, []);

  return (
    <article
      ref={ref}
      className={`bp-card ${vis ? "bp-card-vis" : ""}`}
      style={{ "--a": post.accent, "--i": `${index * 0.12}s` }}
    >
      {/* image */}
      <a
        href={post.link}
        target="_blank"
        rel="noopener noreferrer"
        className="bp-img-link"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="bp-img-wrap">
          <img src={post.image} alt={post.title} loading="lazy" className="bp-img" />
          <div className="bp-img-overlay" />
          <span className="bp-tag" style={{ color: post.accent, background: `${post.accent}18`, borderColor: `${post.accent}44` }}>
            {post.tag}
          </span>
          <div className="bp-read-time">{post.read}</div>
        </div>
      </a>

      {/* body */}
      <div className="bp-body">
        <div className="bp-meta">
          <div className="bp-author-chip">
            <div className="bp-author-dot" style={{ background: post.accent }} />
            {post.author}
          </div>
          <span className="bp-dot-sep">·</span>
          <span className="bp-date">{post.date}</span>
        </div>

        <a href={post.link} target="_blank" rel="noopener noreferrer" className="bp-title-link">
          <h3 className="bp-title">{post.title}</h3>
        </a>

        <p className="bp-excerpt">{post.excerpt}</p>

        <a
          href={post.link}
          target="_blank"
          rel="noopener noreferrer"
          className="bp-cta"
          style={{ "--a": post.accent }}
        >
          Read Article
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </a>
      </div>

      {/* hover bottom bar */}
      <div className="bp-card-bar" style={{ background: post.accent }} />
    </article>
  );
};

export default function BlogPosts() {
  const secRef = useRef(null);
  const [headerVis, setHeaderVis] = useState(false);

  useEffect(() => {
    const ob = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setHeaderVis(true); ob.disconnect(); } },
      { threshold: 0.08 }
    );
    if (secRef.current) ob.observe(secRef.current);
    return () => ob.disconnect();
  }, []);

  return (
    <section className="bp-root" id="blog" ref={secRef}>

      <div className="bp-mesh" />

      {/* header */}
      <div className={`bp-header ${headerVis ? "bp-header-vis" : ""}`}>
        <div className="bp-eyebrow">
          <span className="bp-eyebrow-dot" />
          From the Blog
        </div>
        <h2 className="bp-title-main">
          Learn more,<br />
          <span className="bp-title-grad">grow faster</span>
        </h2>
        <p className="bp-subtitle">
          Insights, guides and industry tips to keep your skills sharp and your career moving.
        </p>
      </div>

      {/* cards */}
      <div className="bp-grid">
        {posts.map((post, i) => (
          <Card key={post.id} post={post} index={i} />
        ))}
      </div>

      {/* footer link */}
    </section>
  );
}