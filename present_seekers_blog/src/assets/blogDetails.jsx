import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { blogAPI } from "../services/api";
import { FaArrowLeft, FaShare, FaFacebook, FaTwitter, FaLink, FaCalendar, FaEye, FaInstagram, FaWhatsapp, FaArrowRight, FaTiktok, FaUser, FaBookReader } from "react-icons/fa";

export default function BlogDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        fetchPost();
    }, [id]);

    const fetchPost = async () => {
        try {
            const response = await blogAPI.getPost(id);
            setPost(response.data);
            await blogAPI.incrementViews(id);
        } catch (error) {
            console.error('Error fetching post:', error);
        } finally {
            setLoading(false);
        }
    };

    const shareArticle = (platform) => {
        const url = window.location.href;
        const title = post?.title;
        
        const shareUrls = {
            'facebook': `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            'twitter': `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
            'whatsapp': `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`,
            'linkedin': `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
        };
        
        if (shareUrls[platform]) {
            window.open(shareUrls[platform], '_blank');
        } else if (platform === 'copy') {
            navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatReadingTime = (content) => {
        const wordsPerMinute = 200;
        const words = content.split(/\s+/).length;
        const minutes = Math.ceil(words / wordsPerMinute);
        return `${minutes} min read`;
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading inspiring content...</p>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="error-container">
                <h2>Article not found</h2>
                <p>This blog post doesn't exist or has been removed.</p>
                <Link to="/blogs" className="modern-btn">
                    <FaArrowLeft /> Back to Blogs
                </Link>
            </div>
        );
    }

    return (
        <div className="blog-detail-page">
            {/* Navigation */}
            <div className="nav-bar">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 150 50"
                    preserveAspectRatio="xMidYMid meet"
                >
                    <defs>
                        <style type="text/css">{`
                            @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');
                            @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@400;600&display=swap');
                        `}</style>
                    </defs>
                    <text x="39" y="19" style={{ fontFamily: "'Great Vibes', cursive", fontSize: "0.75rem", fontWeight: '850', fill: "#2c3e50" }}>
                        The
                    </text>
                    <text x="10" y="36" style={{ fontFamily: "'Great Vibes', cursive", fontSize: "1.6875rem", fontWeight: '650', fill: "#e67e22", letterSpacing: '0.09375rem' }}>
                        Seekers
                    </text>
                    <text x="29" y="46" style={{ fontFamily: "'Fraunces', serif", fontSize: "0.75rem", fontWeight: '850', fill: "#2c3e50" }}>
                        ministry
                    </text>
                </svg>

                <nav className="desktop-nav">
                    <Link to="/home" className="nav-item">Home</Link>
                    <Link to="/blogs" className="nav-item">Blogs</Link>
                    <Link to="/about" className="nav-item">About Us</Link>
                </nav>
            </div>

            {/* Blog Content */}
            <article className="blog-detail-container">
                {/* Breadcrumb Navigation */}
                <nav className="blog-breadcrumb">
                    <button onClick={() => navigate('/blogs')} className="breadcrumb-link">
                        Blogs
                    </button>
                    <span className="breadcrumb-separator">/</span>
                    <span className="breadcrumb-current">{post.category_name}</span>
                </nav>

                <header className="blog-header">
                    <div className="blog-meta-header">
                        <div className="category-badge">{post.category_name}</div>
                        <div className="meta-stats">
                            <span className="meta-stat">
                                <FaEye /> {post.views} views
                            </span>
                            <span className="meta-stat">
                                <FaBookReader /> {formatReadingTime(post.content)}
                            </span>
                            <span className="meta-stat">
                                <FaCalendar /> {formatDate(post.created_at)}
                            </span>
                        </div>
                    </div>
                    
                    <h1 className="blog-title">{post.title}</h1>
                    
                    {post.excerpt && (
                        <div className="blog-excerpt">
                            {post.excerpt}
                        </div>
                    )}

                    {/* Minimalist Author Profile with Profile Image */}
                    <div className="author-profile-minimalist">
                        <div className="author-avatar-minimalist">
                            {post.author_profile_image ? (
                                <img 
                                    src={post.author_profile_image} 
                                    alt={post.author_name}
                                    className="author-profile-img"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        const initials = e.target.nextSibling;
                                        initials.style.display = 'flex';
                                    }}
                                />
                            ) : null}
                            <div className="author-initials-minimalist">
                                {post.author_name?.split(' ').map(name => name[0]).join('').toUpperCase() || <FaUser />}
                            </div>
                        </div>
                        <div className="author-info-minimalist">
                            <div className="author-name-minimalist">{post.author_name}</div>
                            <div className="author-meta-minimalist">
                                <span>{formatDate(post.created_at)}</span>
                                
                            </div>
                        </div>
                    </div>
                </header>

                {/* Featured Image - Only show if it exists and is different from profile image */}
                {post.featured_image && post.featured_image !== post.author_profile_image && (
                    <div className="featured-image-container">
                        <img 
                            src={post.featured_image} 
                            alt={post.title}
                            className="featured-image-content"
                            onError={(e) => {
                                e.target.style.display = 'none';
                            }}
                        />
                    </div>
                )}

                        {/* Blog Content */}
                        <div className="blog-content">
                        <div className="content-wrapper">
                            {(post.formatted_content || [])
                            .map((paragraph, index) => (
                                <div key={index} className="content-block">
                                <p className="content-paragraph">{paragraph}</p>

                                {/* Divider after first paragraph */}
                                {index === 0 && (
                                    <div className="content-divider"></div>
                                )}
                                </div>
                            ))}
                        </div>
                        </div>

                {/* Enhanced Article Footer */}
                <footer className="article-footer">
                    <div className="footer-actions">
                        <div className="action-group">
                            <div className="action-label">Found this helpful?</div>
                            <div className="action-buttons">
                                <button className="action-btn like-btn">
                                    👍 Like
                                </button>
                                <button className="action-btn share-btn">
                                    💬 Comment
                                </button>
                            </div>
                        </div>
                        
                        <div className="share-group">
                            <div className="share-label">Share this wisdom</div>
                            <div className="social-share-buttons">
                                <button 
                                    className="social-share-btn facebook" 
                                    onClick={() => shareArticle('facebook')}
                                    aria-label="Share on Facebook"
                                >
                                    <FaFacebook />
                                </button>
                                <button 
                                    className="social-share-btn twitter" 
                                    onClick={() => shareArticle('twitter')}
                                    aria-label="Share on Twitter"
                                >
                                    <FaTwitter />
                                </button>
                                <button 
                                    className="social-share-btn whatsapp" 
                                    onClick={() => shareArticle('whatsapp')}
                                    aria-label="Share on WhatsApp"
                                >
                                    <FaWhatsapp />
                                </button>
                                <button 
                                    className="social-share-btn copy" 
                                    onClick={() => shareArticle('copy')}
                                    aria-label="Copy link"
                                >
                                    <FaLink />
                                    {copied && <span className="copy-tooltip">Link copied!</span>}
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div className="navigation-actions">
                        <button onClick={() => navigate(-1)} className="nav-action-btn back-action">
                            <FaArrowLeft /> Back to Articles
                        </button>
                        <Link to="/blogs" className="nav-action-btn explore-action">
                            Explore More Content <FaArrowRight />
                        </Link>
                    </div>
                </footer>
            </article>

            {/* Footer */}
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