import { FaHandHoldingHeart,FaInstagram,FaWhatsapp,FaFacebook,FaArrowRight,FaTiktok } from "react-icons/fa";
import { Link,useLocation } from "react-router-dom";
import { useState } from "react";

export default function Landing(){
  const location = useLocation()
    const isActive = (path)=>location.pathname ===path;
    const [menuOpen, setMenuOpen] = useState(false);
    return(
    <div style={{minHeight:'80vh'}}>
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

<div className="hero-section">
  <div className="hero-section-text">
    <div className="devotional-date">
      <h3>Daily Devotional</h3>
      <p className="date">
        {new Date().toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
      </p>
    </div>

    <div className="hero-section-text-header">
      <h1>
        But God demonstrates his own love for us in this: While we were still sinners, 
        <span> Christ died for us.</span>
      </h1>
      <h6>Romans 5:8</h6>
    </div>
    
    <p>
      "The cross is a revelation to our dull senses of the pain that, from its very inception, 
      sin has brought to the heart of God. Every departure from the right, every deed of cruelty, 
      every failure of humanity to reach His ideal, brings grief to Him."
    </p>

    <button className="read-more-btn">Read Full Devotion</button>
  </div>
  
  <div className="hero-image-container">
    <img 
      src="/images/Genesis 13.jpeg" 
      alt="Daily Devotional" 
      className="hero-image"
    />
  </div>
</div>

<div className="pop-blogs-section">
  <div className="pop-blogs-section-header">
    Featured Blog Posts
  </div>
  <div className="pop-blogs-cards">
    <div className="pop-blogs-card1">
      <div className="pop-blogs-card-image-container">
      <img className="pop-blogs-card1-img" src="/images/image-seekers-blog1.jpg" alt="" />
      <h3 className="pop-blogs-category-overlay">Christian Living</h3>
      </div>
      <div className="pop-blogs-card1-text">
        <h1>When the Path Divides: Discerning God's Will at Life's Crossroads.</h1>
        <p>Like standing at a cliff overlooking multiple paths, 
          we often face decisions that shape our spiritual journey.
           Discover how Scripture illuminates the way forward when every choice seems equally uncertain.</p>
           <h4>By Mark Otieno , 2025</h4>
            <button className="read-more-btn">Read Full Article →</button>
           
           
      </div>
      
    </div>
    <div className="pop-blogs-card1">
      <div className="pop-blogs-card-image-container">
      <img className="pop-blogs-card1-img" src="/images/image-seekers-blog2.jpg" alt="" />
      <h3 className="pop-blogs-category-overlay">Modern Christianity</h3>
      </div>
      <div className="pop-blogs-card1-text">
        <h1>Swipe Right on Salvation: Finding Authentic Faith in a Digital World.</h1>
        <p>In an age of endless scrolling and virtual connections, does the cross still hold power 
          on a 6-inch screen? Exploring how to cultivate genuine spirituality when our attention is 
          the world's most valued commodity.</p>
           <h4>By Ronn Odoyo , 2025</h4>
            <button className="read-more-btn">Read Full Article →</button>
           
      </div>
    </div>
        <div className="pop-blogs-card1">
            <div className="pop-blogs-card-image-container">
        <img className="pop-blogs-card1-img" src="/images/image-seekers-blog6.jpg" alt="" />
        <h3 className="pop-blogs-category-overlay">Family Life</h3>
        </div>
      <div className="pop-blogs-card1-text">
        <h1>More Than Matching Hoodies: Building Christ-Centered Relationships as Adventists.</h1>
        <p>When 'Jesus loves you' isn't just a fashion statement—practical guidance for Adventist 
          couples seeking relationships that honor God, respect boundaries, and build toward covenant marriage.</p>
        <h4>By Sandra Jepchumba , 2025</h4>
         <button className="read-more-btn">Read Full Article →</button>
      
      </div>
    </div>
  </div>

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
