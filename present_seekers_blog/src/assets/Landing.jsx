import { FaHandHoldingHeart,FaInstagram,FaWhatsapp,FaFacebook,FaArrowRight,FaTiktok } from "react-icons/fa";
import { Link,useLocation } from "react-router-dom";
import { useState , useEffect } from "react";
import { blogAPI } from "../services/api";

export default function Landing(){
  const location = useLocation()
    const isActive = (path)=>location.pathname ===path;
    const [menuOpen, setMenuOpen] = useState(false);
    const [featuredPosts, setFeaturedPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const MAX_FEATURED_POSTS = 3;
        useEffect(() => {
        fetchFeaturedPosts();
    }, []);
  

    const handleButtonClick = ()=>{
      window.location.href="https://whiteestate.org/devotional/mlt/"
    };

    const fetchFeaturedPosts = async () => {
        try {
            setLoading(true);
              const response = await blogAPI.getFeaturedPosts(); 
              setFeaturedPosts(response.data);
            
            setFeaturedPosts(featured);
        } catch (error) {
            console.error('Error fetching featured posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long'
        });
    };



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

    <button className="read-more-btn" onClick={handleButtonClick}>Read Full Devotion</button>
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

                {loading ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Loading featured content...</p>
                    </div>
                ) : featuredPosts.length > 0 ? (
                    <div className="pop-blogs-cards">
                        {featuredPosts.map(post => (
                            <div key={post.id} className="pop-blogs-card1">
                                <div className="pop-blogs-card-image-container">
                                    <img
                                        className="pop-blogs-card1-img"
                                        src={post.featured_image || '/images/article-placeholder.jpg'}
                                        alt={post.title}
                                        onError={(e) => {
                                            e.target.src = '/images/article-placeholder.jpg';
                                        }}
                                    />
                                    <h3 className="pop-blogs-category-overlay">
                                        {post.category_name || 'Uncategorized'}
                                    </h3>
                                </div>
                                <div className="pop-blogs-card1-text">
                                    <h1>{post.title}</h1>
                                    <p>{post.excerpt || 'Read this inspiring article...'}</p>
                                    <h4>By {post.author_name}, {formatDate(post.created_at)}</h4>
                                    <Link to={`/blog/${post.id}`} className="read-more-btn">
                                        Read Full Article →
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-posts-message">
                        <p>No featured posts available. Check back soon for inspiring content!</p>
                    </div>
                )}
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
