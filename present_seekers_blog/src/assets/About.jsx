import { FaHeart, FaHandsHelping, FaUsers, FaBible, FaPray,FaHandHoldingHeart,FaInstagram,FaWhatsapp,FaFacebook,FaArrowRight,FaTiktok } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import aboutus from "/images/aboutus.jpg";
import React, { useState, useEffect } from "react";

export default function About() {
    const location = useLocation()
    const [menuOpen, setMenuOpen] = useState(false);
    const isActive = (path)=>location.pathname ===path;
      const images = [
    "/images/imageseeker.jpg",    
    "/images/IMG-20251016-WA0024.jpg",
    "/images/imageseekers2.jpg",
    "/images/seekers-about-image1.jpg",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // every 3 seconds
    return () => clearInterval(interval);
  }, [images.length]);
    return (
      <div>
      {/* Dim background when menu is open */}
      {menuOpen && <div className="menu-dim" onClick={() => setMenuOpen(false)}></div>}

<div className="nav-bar" style={{ display: 'flex', flexDirection: 'row', textAlign: 'center' }}>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20%"
    height="100%"
    viewBox="0 0 150 50"
    preserveAspectRatio="xMidYMid meet"
  >
    <defs>
      <style type="text/css">{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@400;600&display=swap');
      `}</style>
    </defs>
    <text
      x="39"
      y="19"
      style={{
        fontFamily: "'Great Vibes', cursive",
        fontSize: "0.75rem", /* 12px → rem */
        fontWeight: '850',
        fill: "#2c3e50"
      }}
    >
      The
    </text>
    <text
      x="10"
      y="36"
      style={{
        fontFamily: "'Great Vibes', cursive",
        fontSize: "1.6875rem", /* 27px → rem */
        fontWeight: '650',
        fill: "#e67e22",
        letterSpacing: '0.09375rem' /* 1.5px → rem */
      }}
    >
      Seekers
    </text>
    <text
      x="29"
      y="46"
      style={{
        fontFamily: "'Fraunces', serif",
        fontSize: "0.75rem", /* 12px → rem */
        fontWeight: '850',
        fill: "#2c3e50"
      }}
    >
      ministry
    </text>
  </svg>

  {/* Hamburger icon */}
  <button
    className={`menu-toggle ${menuOpen ? "open" : ""}`}
    onClick={() => setMenuOpen(!menuOpen)}
    aria-label="Toggle navigation menu"
  >
    <span className="menu-bar"></span>
    <span className="menu-bar"></span>
    <span className="menu-bar"></span>
  </button>

  {/* Desktop navigation */}
  <nav className="desktop-nav">
    <Link to="/home" className={`nav-item ${isActive('/home') ? 'active' : ''}`}>Home</Link>
    <Link to="/blogs" className={`nav-item ${isActive('/blogs') ? 'active' : ''}`}>Blogs</Link>
    <Link to="/about" className={`nav-item ${isActive('/about') ? 'active' : ''}`}>About Us</Link>
  </nav>

  {/* Mobile slide menu */}
  <div className={`nav-links ${menuOpen ? "show" : ""}`}>
    <Link to="/home" className={`nav-item ${isActive('/home') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Home</Link>
    <Link to="/blogs" className={`nav-item ${isActive('/blogs') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Blogs</Link>
    <Link to="/about" className={`nav-item ${isActive('/about') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>About Us</Link>
  </div>
</div>
        <div className="about-page">
            {/* Hero Section */}
<div 
        className="about-hero"
        style={{
          backgroundImage: `linear-gradient(rgba(17, 24, 39, 0.6), rgba(17, 24, 39, 0.6)), url(${aboutus})`,marginTop:'3rem'
        }}
      >
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>About Seekers Ministry</h1>
            
          </div>
        </div>
      </div>
            {/* Our Story */}
<section className="section-story">
    <div className="container">
        <div className="story-grid">
            <div className="story-content">
                <div className="section-label">Our Journey</div>
                <h2>How The Seekers Ministry Began</h2>
                <div className="story-text">
        <p>
            It all started with a simple circle of friends united by a love for music and a hunger for 
            deeper spiritual connection. What began as heartfelt singing and Bible study among friends 
            soon revealed a greater purpose—to create a haven for other seekers longing for authentic faith.
        </p>
        <p>
            Today, that original circle has expanded into a thriving ministry that bridges digital spaces 
            and physical communities. Through online Bible studies that reach across distances and 
            worship gatherings that touch local schools and churches, we're building a family where 
            every seeker finds their place in God's story.
        </p>

                </div>
                <div className="story-stats">
                    <div className="stat">
                        <div className="stat-number">2018</div>
                        <div className="stat-label">Founded</div>
                    </div>
                    <div className="stat">
                        <div className="stat-number">50+</div>
                        <div className="stat-label">Members</div>
                    </div>
                    <div className="stat">
                        <div className="stat-number">100+</div>
                        <div className="stat-label">Lives Changed</div>
                    </div>
                </div>
            </div>
            
            <div className="story-visual">
                <div className="image-container">
                    {images.map((src, index) => (
                    <img
                        key={index}
                        src={src}
                        alt="Seekers Ministry community"
                        className={`story-image ${index === currentIndex ? "active" : ""}`}
                    />
                    ))}
                    <div className="image-accent"></div>
                </div>
                </div>
        </div>
    </div>
</section>

            {/* Our Mission & Vision */}
<section className="section-mission">
    <div className="container">
        <div className="section-header">
            <h2>Our Purpose</h2>
            <p className="section-subtitle">The foundation that guides everything we do</p>
        </div>
        
        <div className="mission-cards">
            <div className="mission-card">
                <FaHeart className="mission-icon" />
                <h3>Our Mission</h3>
                <p>To lead seekers to Christ and equip believers for meaningful service through biblical truth and authentic community.</p>
            </div>
            
            <div className="mission-card">
                <FaUsers className="mission-icon" />
                <h3>Our Vision</h3>
                <p>A thriving community where every person experiences transformation through God's grace and discovers their purpose in Christ.</p>
            </div>
            
            <div className="mission-card">
                <FaHandsHelping className="mission-icon" />
                <h3>Our Values</h3>
                <p>Biblical truth, authentic relationships, compassionate service, spiritual growth, and hopeful living.</p>
            </div>
        </div>
    </div>
</section>

            {/* What We Believe */}
<section className="section-beliefs">
    <div className="container">
        <div className="section-header">
            <div className="section-label">Core Beliefs</div>
            <h2>Our Foundation</h2>
            <p>The essential truths that guide our faith journey</p>
        </div>
        
        <div className="beliefs-grid">
            <div className="belief-card">
                <div className="card-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                    </svg>
                </div>
                <h3>The Bible</h3>
                <p>God's inspired Word and the ultimate authority for faith and life.</p>
                <div className="scripture">2 Timothy 3:16-17</div>
            </div>
            
            <div className="belief-card">
                <div className="card-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                        <path d="M12 2.69v18.62"/>
                    </svg>
                </div>
                <h3>Salvation</h3>
                <p>Through Jesus Christ alone, received by grace through faith.</p>
                <div className="scripture">Ephesians 2:8-9</div>
            </div>
            
            <div className="belief-card">
                <div className="card-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="4" width="18" height="16" rx="2"/>
                        <path d="M16 2v4M8 2v4M3 10h18"/>
                    </svg>
                </div>
                <h3>The Sabbath</h3>
                <p>A sacred gift of rest and communion from Friday to Saturday sunset.</p>
                <div className="scripture">Exodus 20:8-11</div>
            </div>
            
            <div className="belief-card">
                <div className="card-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9z"/>
                        <path d="M22 10l-4-4M22 10h-6"/>
                    </svg>
                </div>
                <h3>Second Coming</h3>
                <p>Jesus is returning soon to restore all things and take us home.</p>
                <div className="scripture">John 14:1-3</div>
            </div>

            <div className="belief-card">
            <div className="card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                    <path d="M7 16l5 5 5-5"/>
                </svg>
            </div>
            <h3>Health & Wholeness</h3>
            <p>Our bodies are temples of the Holy Spirit, called to honor God through healthy living and temperance.</p>
            <div className="scripture">1 Corinthians 6:19-20</div>
        </div>

        <div className="belief-card">
            <div className="card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                    <path d="M12 2.69v18.62"/>
                    <path d="M8 12h8"/>
                </svg>
            </div>
            <h3>State of the Dead</h3>
            <p>The dead rest in unconscious sleep until Christ's return, when they will be resurrected to eternal life.</p>
            <div className="scripture">Ecclesiastes 9:5-6</div>
        </div>
        </div>
    </div>
</section>




            {/* Get Involved */}
            <section className="section-involved">
                <div className="container">
                    <h2>Get Connected</h2>
                    <div className="involved-options">
                        <div className="involved-card">
                            <h4>Join Our Bible Study.</h4>
                            <p>Grow deeper in faith through our weekly virtual studies where questions are welcome and community is built.</p>
                            <button className="cta-button">Google Meet Link</button>
                        </div>
                        <div className="involved-card">
                            <h4>Write for Our Blog</h4>
                            <p>Join our team of contributors sharing spiritual insights. We welcome writers who can articulate faith with clarity and heart.</p>
                            <button className="cta-button">Become a Contributor</button>
                        </div>
                        <div className="involved-card">
                            <h4>Minister with us This Sabbath</h4>
                            <p>Join our worship teams and outreach programs. We minister in churches, schools, and community events.</p>
                            <button className="cta-button">View Ministry Schedule</button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
<div className="footer-section">
  <div className="footer-blocks">
    {/* Brand & Social Section */}
    <div className="footer-brand-social">
      <div className="brand-content">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 150 50"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <style type="text/css">{`
              @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');
              @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@400;600&display=swap');`}</style>
          </defs>
          <text x="39" y="23" style={{ fontFamily: "'Great Vibes', cursive", fontSize: "0.75rem", fontWeight:'850', fill: "#fff" }}>
            The
          </text>
          <text x="10" y="40" style={{ fontFamily: "'Great Vibes', cursive", fontSize: "1.6875rem", fontWeight:'650', fill: "#e67e22", letterSpacing:'0.09375rem' }}>
            Seekers 
          </text>
          <text x="29" y="50" style={{ fontFamily: "'Fraunces', serif", fontSize: "0.75rem", fontWeight:'850', fill: "#fff" }}>
            ministry
          </text>
        </svg>
        <p className="footer-tagline">
          Growing together in faith, hope, and love.
        </p>
      </div>
      
      <div className="social-icons">
        <a href="#" aria-label="Instagram"><FaInstagram /></a>
        <a href="#" aria-label="WhatsApp"><FaWhatsapp /></a>
        <a href="#" aria-label="Facebook"><FaFacebook /></a>
        <a href="#" aria-label="TikTok"><FaTiktok /></a>
      </div>
    </div>

    {/* Newsletter Section */}
    <div className="footer-newsletter">
      <div className="newsletter-header">
        <h3>Join Our Journey</h3>
        <p>Get spiritual insights delivered weekly</p>
      </div>
      
      <div className="newsletter-form">
        <input 
          type="email" 
          placeholder="Your email address" 
          className="newsletter-input"
        />
        <button className="subscribe-btn">
          <FaArrowRight />
        </button>
      </div>
    </div>
  </div>

  {/* Footer Bottom */}
  <div className="footer-bottom">
    <div className="footer-divider"></div>
    <div className="footer-copyright">
      <span>© 2025 The Seekers Ministry. All rights reserved.</span>
      <div className="footer-links">
        <a href="/privacy">Privacy</a>
        <a href="/terms">Terms</a>
        <a href="/contact">Contact</a>
      </div>
    </div>
  </div>
</div>
          
        </div>
    );
}