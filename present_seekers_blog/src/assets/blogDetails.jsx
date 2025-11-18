import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { blogAPI } from "../services/api";
import { FaArrowLeft, FaShare, FaFacebook, FaTwitter, FaLink, FaCalendar, FaEye, FaInstagram, FaWhatsapp, FaArrowRight, FaTiktok, FaUser, FaBookReader, FaHeart, FaRegHeart, FaRegComment } from "react-icons/fa";

export default function BlogDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const [likes, setLikes] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [comments, setComments] = useState([]);
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [commentLoading, setCommentLoading] = useState(false);
    const commentInputRef = useRef(null);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        fetchPost();
    }, [id]);

    const fetchPost = async () => {
        try {
            const response = await blogAPI.getPost(id);
            setPost(response.data);
            setLikes(response.data.likes_count || 0);
            setIsLiked(response.data.user_has_liked || false);
            setComments(response.data.comments || []);
            await blogAPI.incrementViews(id);
        } catch (error) {
            console.error('Error fetching post:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async () => {
        try {
            const response = await blogAPI.toggleLike(id);
            setLikes(response.data.likes_count);
            setIsLiked(response.data.liked);
        } catch (error) {
            console.error('Error toggling like:', error);
            if (error.response?.status === 401) {
                alert('Please log in to like posts');
            }
        }
    };
    const isActive = (path) => {
        return window.location.pathname === path;
    };

    const handleCommentClick = () => {
        setShowComments(!showComments);
        if (!showComments) {
            setTimeout(() => {
                commentInputRef.current?.focus();
            }, 100);
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        
        setCommentLoading(true);
        try {
            const response = await blogAPI.addComment(id, newComment);
            setComments([response.data, ...comments]);
            setNewComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
            if (error.response?.status === 401) {
                alert('Please log in to comment');
            }
        } finally {
            setCommentLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleAddComment();
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

    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
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

<footer className="article-footer">
    {/* Social Share Section */}
    <div className="social-share-section">
        <div className="share-header">
            <FaShare className="share-icon" />
            <h3 className="share-title">Share this wisdom</h3>
        </div>
        <div className="social-share-buttons">
            <button 
                className="social-share-btn facebook" 
                onClick={() => shareArticle('facebook')}
                aria-label="Share on Facebook"
            >
                <FaFacebook />
                <span className="platform-name">Facebook</span>
            </button>
            <button 
                className="social-share-btn twitter" 
                onClick={() => shareArticle('twitter')}
                aria-label="Share on Twitter"
            >
                <FaTwitter />
                <span className="platform-name">Twitter</span>
            </button>
            <button 
                className="social-share-btn whatsapp" 
                onClick={() => shareArticle('whatsapp')}
                aria-label="Share on WhatsApp"
            >
                <FaWhatsapp />
                <span className="platform-name">WhatsApp</span>
            </button>
            <button 
                className="social-share-btn copy" 
                onClick={() => shareArticle('copy')}
                aria-label="Copy link"
            >
                <FaLink />
                <span className="platform-name">{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
        </div>
    </div>

    {/* Engagement Section */}
    <div className="engagement-section">
        <div className="engagement-header">
            <div className="engagement-title">
                <span className="engagement-icon">💭</span>
                <h3>Enjoyed this read?</h3>
            </div>
            <div className="engagement-stats">
                <div className="stat-item">
                    <FaEye className="stat-icon" />
                    <span className="stat-count">{post.views}</span>
                    <span className="stat-label">Views</span>
                </div>
                <div className="stat-item">
                    <FaHeart className="stat-icon" />
                    <span className="stat-count">{likes}</span>
                    <span className="stat-label">Likes</span>
                </div>
                <div className="stat-item">
                    <FaRegComment className="stat-icon" />
                    <span className="stat-count">{comments.length}</span>
                    <span className="stat-label">Comments</span>
                </div>
            </div>
        </div>
        
        <div className="engagement-actions">
            <button 
                className={`engage-btn like-btn ${isLiked ? 'liked' : ''}`}
                onClick={handleLike}
            >
                <span className="btn-icon">
                    {isLiked ? <FaHeart /> : <FaRegHeart />}
                </span>
                <span className="btn-text">
                    {isLiked ? 'Liked' : 'Like this post'}
                </span>
            </button>
            <button 
                className={`engage-btn comment-btn ${showComments ? 'active' : ''}`}
                onClick={handleCommentClick}
            >
                <span className="btn-icon">
                    <FaRegComment />
                </span>
                <span className="btn-text">
                    {showComments ? 'Hide Comments' : 'Join Discussion'}
                </span>
            </button>
        </div>
    </div>

    {/* Comments Section */}
    {showComments && (
        <div className="comments-section">
            <div className="comments-header">
                <div className="comments-title-section">
                    <h3>Community Conversation</h3>
                    <div className="comments-badge">{comments.length}</div>
                </div>
                <p className="comments-subtitle">Share your thoughts and insights</p>
            </div>
            
            {/* Add Comment Form */}
            <div className="add-comment-form">
                <div className="comment-input-wrapper">
                    <textarea
                        ref={commentInputRef}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="What resonated with you? Share your perspective..."
                        className="comment-input"
                        rows="4"
                    />
                    <div className="input-footer">
                        <div className="char-counter">
                            {newComment.length}/500 characters
                        </div>
                    </div>
                </div>
                <div className="form-actions">
                    <button 
                        onClick={() => setShowComments(false)}
                        className="action-btn cancel-btn"
                    >
                        Close
                    </button>
                    <button 
                        onClick={handleAddComment}
                        disabled={!newComment.trim() || commentLoading || newComment.length > 500}
                        className="action-btn submit-btn"
                    >
                        {commentLoading ? (
                            <>
                                <div className="loading-spinner-small"></div>
                                Posting...
                            </>
                        ) : (
                            'Share Thought'
                        )}
                    </button>
                </div>
            </div>

            {/* Comments List */}
            <div className="comments-list">
                {comments.length === 0 ? (
                    <div className="empty-comments">
                        <div className="empty-icon">
                            <FaRegComment />
                        </div>
                        <h4>No comments yet</h4>
                        <p>Be the first to share your wisdom and inspire others!</p>
                    </div>
                ) : (
                    <div className="comments-grid">
                        {comments.map((comment) => (
                            <div key={comment.id} className="comment-card">
                                <div className="comment-header">
                                    <div className="comment-author">
                                        <div className="author-avatar">
                                            <FaUser />
                                        </div>
                                        <div className="author-details">
                                            <span className="author-name">
                                                {comment.user_first_name && comment.user_last_name 
                                                    ? `${comment.user_first_name} ${comment.user_last_name}`
                                                    : 'Thoughtful Reader'
                                                }
                                            </span>
                                            <span className="comment-time">
                                                {formatDateTime(comment.created_at)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="comment-body">
                                    {comment.content}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )}

    {/* Navigation Section */}
    <div className="navigation-section">
        <div className="social-connect">
            <span className="connect-label">Connect with us:</span>
            <div className="social-links">
                <a href="#" aria-label="Instagram" className="social-link">
                    <FaInstagram />
                </a>
                <a href="#" aria-label="WhatsApp" className="social-link">
                    <FaWhatsapp />
                </a>
                <a href="#" aria-label="Facebook" className="social-link">
                    <FaFacebook />
                </a>
                <a href="#" aria-label="TikTok" className="social-link">
                    <FaTiktok />
                </a>
            </div>
        </div>
        
        <div className="page-navigation">
            <button onClick={() => navigate(-1)} className="nav-btn prev-btn">
                <FaArrowLeft />
                <span>Previous</span>
            </button>
            <Link to="/blogs" className="nav-btn next-btn">
                <span>More Articles</span>
                <FaArrowRight />
            </Link>
        </div>
    </div>
</footer>
            </article>

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

<style jsx>{`
    .blog-detail-page {
        min-height: 100vh;
        background: #ffffff;
    }

    .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 50vh;
        padding: 2rem;
    }

    .loading-spinner {
        width: 50px;
        height: 50px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #e67e22;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 1rem;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    .error-container {
        text-align: center;
        padding: 4rem 2rem;
        max-width: 500px;
        margin: 0 auto;
    }

    .error-container h2 {
        color: #2c3e50;
        margin-bottom: 1rem;
    }

    .error-container p {
        color: #7f8c8d;
        margin-bottom: 2rem;
    }

    .modern-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1.5rem;
        background: #e67e22;
        color: white;
        text-decoration: none;
        border-radius: 25px;
        font-weight: 600;
        transition: all 0.3s ease;
    }

    .modern-btn:hover {
        background: #d35400;
        transform: translateY(-2px);
    }

    /* Navigation */
    .nav-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 2rem;
        background: white;
        border-bottom: 1px solid #e9ecef;
    }

    .desktop-nav {
        display: flex;
        gap: 2rem;
    }

    .nav-item {
        color: #2c3e50;
        text-decoration: none;
        font-weight: 500;
        transition: color 0.3s ease;
    }

    .nav-item:hover {
        color: #e67e22;
    }

    /* Blog Content */
    .blog-detail-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem 1rem;
    }

    .blog-breadcrumb {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 2rem;
        font-size: 0.9rem;
        color: #7f8c8d;
    }

    .breadcrumb-link {
        background: none;
        border: none;
        color: #e67e22;
        cursor: pointer;
        text-decoration: underline;
    }

    .breadcrumb-separator {
        color: #bdc3c7;
    }

    .breadcrumb-current {
        color: #2c3e50;
        font-weight: 500;
    }

    .blog-header {
        margin-bottom: 2rem;
    }

    .blog-meta-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        flex-wrap: wrap;
        gap: 1rem;
    }

    .category-badge {
        background: #e67e22;
        color: white;
        padding: 0.25rem 0.75rem;
        border-radius: 15px;
        font-size: 0.8rem;
        font-weight: 600;
    }

    .meta-stats {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
    }

    .meta-stat {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        color: #7f8c8d;
        font-size: 0.85rem;
    }

    .blog-title {
        font-size: 2.5rem;
        color: #2c3e50;
        margin-bottom: 1rem;
        line-height: 1.2;
    }

    .blog-excerpt {
        font-size: 1.2rem;
        color: #7f8c8d;
        line-height: 1.6;
        margin-bottom: 2rem;
        font-style: italic;
    }

    /* Author Profile */
    .author-profile-minimalist {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-top: 2rem;
    }

    .author-avatar-minimalist {
        position: relative;
        width: 50px;
        height: 50px;
    }

    .author-profile-img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
    }

    .author-initials-minimalist {
        display: none;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #e67e22;
        color: white;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: 0.9rem;
    }

    .author-info-minimalist {
        display: flex;
        flex-direction: column;
    }

    .author-name-minimalist {
        font-weight: 600;
        color: #2c3e50;
    }

    .author-meta-minimalist {
        color: #7f8c8d;
        font-size: 0.85rem;
    }

    /* Featured Image */
    .featured-image-container {
        margin: 2rem 0;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .featured-image-content {
        width: 100%;
        height: auto;
        display: block;
    }

    /* Blog Content */
    .blog-content {
        margin: 3rem 0;
    }

    .content-wrapper {
        line-height: 1.8;
        color: #2c3e50;
    }

    .content-block {
        margin-bottom: 2rem;
    }

    .content-paragraph {
        margin-bottom: 1.5rem;
        font-size: 1.1rem;
    }

    .content-divider {
        height: 2px;
        background: linear-gradient(90deg, transparent, #e67e22, transparent);
        margin: 2rem 0;
    }

    /* ENHANCED ARTICLE FOOTER DESIGN */
    .article-footer {
        margin-top: 4rem;
        padding-top: 3rem;
        border-top: 2px solid #f8f9fa;
    }

    /* Social Share Section */
    .social-share-section {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 2.5rem 2rem;
        border-radius: 20px;
        margin-bottom: 2rem;
        text-align: center;
        box-shadow: 0 10px 30px rgba(102, 126, 234, 0.15);
    }

    .share-header {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        margin-bottom: 2rem;
    }

    .share-icon {
        font-size: 1.5rem;
        opacity: 0.9;
    }

    .share-title {
        margin: 0;
        font-size: 1.4rem;
        font-weight: 600;
        color: white;
    }

    .social-share-buttons {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        gap: 1rem;
        max-width: 600px;
        margin: 0 auto;
    }

    .social-share-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.75rem;
        padding: 1rem 1.5rem;
        background: rgba(255, 255, 255, 0.1);
        color: white;
        border: 2px solid rgba(255, 255, 255, 0.2);
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: 500;
        backdrop-filter: blur(10px);
    }

    .social-share-btn:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: translateY(-3px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }

    .social-share-btn.facebook:hover { background: #1877f2; border-color: #1877f2; }
    .social-share-btn.twitter:hover { background: #1da1f2; border-color: #1da1f2; }
    .social-share-btn.whatsapp:hover { background: #25d366; border-color: #25d366; }
    .social-share-btn.copy:hover { background: #e67e22; border-color: #e67e22; }

    .platform-name {
        font-size: 0.9rem;
        font-weight: 500;
    }

    /* Engagement Section */
    .engagement-section {
        background: white;
        padding: 2.5rem;
        border-radius: 20px;
        border: 2px solid #f8f9fa;
        margin-bottom: 2rem;
        box-shadow: 0 5px 25px rgba(0, 0, 0, 0.08);
    }

    .engagement-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        flex-wrap: wrap;
        gap: 2rem;
    }

    .engagement-title {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .engagement-icon {
        font-size: 2rem;
    }

    .engagement-title h3 {
        margin: 0;
        color: #2c3e50;
        font-size: 1.5rem;
        font-weight: 700;
    }

    .engagement-stats {
        display: flex;
        gap: 2rem;
        flex-wrap: wrap;
    }

    .stat-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        padding: 1rem 1.5rem;
        background: #f8f9fa;
        border-radius: 12px;
        min-width: 80px;
    }

    .stat-icon {
        color: #e67e22;
        font-size: 1.2rem;
    }

    .stat-count {
        font-size: 1.4rem;
        font-weight: 700;
        color: #2c3e50;
    }

    .stat-label {
        font-size: 0.8rem;
        color: #7f8c8d;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .engagement-actions {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
    }

    .engage-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        padding: 1.25rem 2rem;
        border: 2px solid #e67e22;
        background: white;
        color: #e67e22;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: 600;
        font-size: 1.1rem;
    }

    .engage-btn:hover {
        background: #e67e22;
        color: white;
        transform: translateY(-3px);
        box-shadow: 0 8px 25px rgba(230, 126, 34, 0.3);
    }

    .engage-btn.liked {
        background: #e67e22;
        color: white;
        box-shadow: 0 4px 15px rgba(230, 126, 34, 0.4);
    }

    .engage-btn.active {
        background: #e67e22;
        color: white;
    }

    .btn-icon {
        font-size: 1.2rem;
    }

    .btn-text {
        font-size: 1rem;
    }

    /* Comments Section */
    .comments-section {
        margin-top: 2rem;
        padding: 2.5rem;
        background: white;
        border-radius: 20px;
        border: 2px solid #f8f9fa;
        box-shadow: 0 5px 25px rgba(0, 0, 0, 0.08);
    }

    .comments-header {
        text-align: center;
        margin-bottom: 2.5rem;
    }

    .comments-title-section {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        margin-bottom: 0.5rem;
    }

    .comments-title-section h3 {
        margin: 0;
        color: #2c3e50;
        font-size: 1.6rem;
        font-weight: 700;
    }

    .comments-badge {
        background: #e67e22;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.9rem;
        font-weight: 700;
    }

    .comments-subtitle {
        color: #7f8c8d;
        margin: 0;
        font-size: 1.1rem;
    }

    /* Add Comment Form */
    .add-comment-form {
        margin-bottom: 2.5rem;
        background: #f8f9fa;
        padding: 2rem;
        border-radius: 16px;
    }

    .comment-input-wrapper {
        margin-bottom: 1.5rem;
    }

    .comment-input {
        width: 100%;
        padding: 1.25rem;
        border: 2px solid #e9ecef;
        background: white;
        border-radius: 12px;
        resize: vertical;
        font-family: inherit;
        font-size: 1rem;
        line-height: 1.6;
        transition: all 0.3s ease;
        min-height: 140px;
    }

    .comment-input:focus {
        outline: none;
        border-color: #e67e22;
        box-shadow: 0 0 0 3px rgba(230, 126, 34, 0.1);
    }

    .input-footer {
        display: flex;
        justify-content: flex-end;
        margin-top: 0.5rem;
    }

    .char-counter {
        color: #7f8c8d;
        font-size: 0.85rem;
        font-weight: 500;
    }

    .form-actions {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
    }

    .action-btn {
        padding: 1rem 2rem;
        border: 2px solid;
        border-radius: 10px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s ease;
        font-size: 1rem;
    }

    .cancel-btn {
        background: white;
        color: #7f8c8d;
        border-color: #bdc3c7;
    }

    .cancel-btn:hover {
        background: #bdc3c7;
        color: white;
    }

    .submit-btn {
        background: #e67e22;
        color: white;
        border-color: #e67e22;
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .submit-btn:hover:not(:disabled) {
        background: #d35400;
        border-color: #d35400;
        transform: translateY(-2px);
    }

    .submit-btn:disabled {
        background: #bdc3c7;
        border-color: #bdc3c7;
        cursor: not-allowed;
        transform: none;
    }

    .loading-spinner-small {
        width: 16px;
        height: 16px;
        border: 2px solid transparent;
        border-top: 2px solid currentColor;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    /* Comments List */
    .comments-list {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .empty-comments {
        text-align: center;
        padding: 3rem 2rem;
        color: #7f8c8d;
    }

    .empty-icon {
        font-size: 4rem;
        margin-bottom: 1.5rem;
        opacity: 0.3;
    }

    .empty-comments h4 {
        margin: 0 0 1rem 0;
        color: #2c3e50;
        font-size: 1.4rem;
    }

    .empty-comments p {
        margin: 0;
        font-size: 1.1rem;
        line-height: 1.6;
    }

    .comments-grid {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .comment-card {
        background: white;
        padding: 2rem;
        border-radius: 16px;
        border: 1px solid #e9ecef;
        transition: all 0.3s ease;
    }

    .comment-card:hover {
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
        transform: translateY(-2px);
    }

    .comment-header {
        margin-bottom: 1.25rem;
    }

    .comment-author {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .author-avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, #e67e22, #e74c3c);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.1rem;
        font-weight: 600;
    }

    .author-details {
        display: flex;
        flex-direction: column;
    }

    .author-name {
        font-weight: 700;
        color: #2c3e50;
        font-size: 1.1rem;
    }

    .comment-time {
        color: #7f8c8d;
        font-size: 0.85rem;
        margin-top: 0.25rem;
    }

    .comment-body {
        color: #2c3e50;
        line-height: 1.7;
        font-size: 1.05rem;
        white-space: pre-wrap;
    }

    /* Navigation Section */
    .navigation-section {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 3rem;
        padding-top: 2.5rem;
        border-top: 2px solid #f8f9fa;
        flex-wrap: wrap;
        gap: 2rem;
    }

    .social-connect {
        display: flex;
        align-items: center;
        gap: 1.5rem;
    }

    .connect-label {
        color: #7f8c8d;
        font-weight: 600;
        font-size: 1rem;
    }

    .social-links {
        display: flex;
        gap: 1rem;
    }

    .social-link {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 45px;
        height: 45px;
        background: #f8f9fa;
        color: #7f8c8d;
        border-radius: 50%;
        transition: all 0.3s ease;
        font-size: 1.2rem;
    }

    .social-link:hover {
        background: #e67e22;
        color: white;
        transform: translateY(-2px);
    }

    .page-navigation {
        display: flex;
        gap: 1rem;
    }

    .nav-btn {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 1rem 1.75rem;
        border: 2px solid #e67e22;
        background: white;
        color: #e67e22;
        text-decoration: none;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: 600;
        font-size: 1rem;
    }

    .nav-btn:hover {
        background: #e67e22;
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(230, 126, 34, 0.3);
    }

    .prev-btn {
        background: white;
        color: #e67e22;
    }

    .next-btn {
        background: #e67e22;
        color: white;
    }

    .next-btn:hover {
        background: #d35400;
    }

    /* Footer */
    .footer-section {
        background: #2c3e50;
        color: white;
        padding: 3rem 1rem 1rem;
        margin-top: 4rem;
    }

    .footer-blocks {
        max-width: 1200px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 3rem;
        margin-bottom: 2rem;
    }

    .footer-brand-social {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .brand-content {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .footer-tagline {
        color: #bdc3c7;
        font-style: italic;
        margin: 0;
    }

    .footer-newsletter {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .newsletter-header h3 {
        margin: 0 0 0.5rem 0;
        color: white;
    }

    .newsletter-header p {
        color: #bdc3c7;
        margin: 0;
    }

    .newsletter-form {
        display: flex;
        gap: 0.5rem;
    }

    .newsletter-input {
        flex: 1;
        padding: 0.75rem;
        border: 1px solid #34495e;
        background: #34495e;
        color: white;
        border-radius: 4px;
    }

    .newsletter-input::placeholder {
        color: #95a5a6;
    }

    .subscribe-btn {
        padding: 0.75rem 1rem;
        background: #e67e22;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background 0.3s ease;
    }

    .subscribe-btn:hover {
        background: #d35400;
    }

    .footer-bottom {
        max-width: 1200px;
        margin: 0 auto;
        padding-top: 2rem;
    }

    .footer-divider {
        height: 1px;
        background: #34495e;
        margin-bottom: 1rem;
    }

    .footer-copyright {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 1rem;
        color: #bdc3c7;
        font-size: 0.9rem;
    }

    .footer-links {
        display: flex;
        gap: 1.5rem;
    }

    .footer-links a {
        color: #bdc3c7;
        text-decoration: none;
        transition: color 0.3s ease;
    }

    .footer-links a:hover {
        color: #e67e22;
    }

    /* Mobile Responsive */
    @media (max-width: 768px) {
        .nav-bar {
            padding: 1rem;
            flex-direction: column;
            gap: 1rem;
        }

        .blog-detail-container {
            padding: 1rem;
        }

        .blog-title {
            font-size: 2rem;
        }

        .blog-meta-header {
            flex-direction: column;
            align-items: flex-start;
        }

        .meta-stats {
            justify-content: flex-start;
            width: 100%;
            gap: 0.5rem;
            font-size: 0.8rem;
            flex-wrap: wrap;
            margin-top: 0.5rem;
            padding-top: 0.5rem;
            border-top: 1px solid #e9ecef;
        }

        .social-share-section {
            padding: 2rem 1.5rem;
        }

        .social-share-buttons {
            grid-template-columns: 1fr;
            gap: 0.75rem;
        }

        .engagement-header {
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 1.5rem;
        }

        .engagement-stats {
            justify-content: center;
        }

        .engagement-actions {
            grid-template-columns: 1fr;
        }

        .comments-section {
            padding: 2rem 1.5rem;
            margin: 1rem -1rem;
            border-radius: 0;
        }

        .form-actions {
            flex-direction: column;
        }

        .navigation-section {
            flex-direction: column;
            text-align: center;
            gap: 1.5rem;
        }

        .social-connect {
            flex-direction: column;
            gap: 1rem;
        }

        .page-navigation {
            flex-direction: column;
            width: 100%;
        }

        .nav-btn {
            justify-content: center;
        }

        .footer-blocks {
            grid-template-columns: 1fr;
            gap: 2rem;
        }

        .footer-copyright {
            flex-direction: column;
            text-align: center;
        }

        .footer-links {
            justify-content: center;
        }
    }

    @media (max-width: 480px) {
        .blog-title {
            font-size: 1.75rem;
        }

        .article-footer {
            margin-top: 3rem;
            padding-top: 2rem;
        }

        .social-share-section, .engagement-section {
            padding: 1.5rem;
        }

        .comments-section {
            padding: 1.5rem;
        }

        .engagement-stats {
            gap: 1rem;
        }

        .stat-item {
            padding: 0.75rem 1rem;
            min-width: 70px;
        }

        .engage-btn, .nav-btn {
            padding: 1rem 1.5rem;
            font-size: 0.95rem;
        }

        .newsletter-form {
            flex-direction: column;
        }

        .subscribe-btn {
            width: 100%;
        }
    }

    /* Hamburger Menu Styles */
    .menu-toggle {
        display: none;
        flex-direction: column;
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.5rem;
        gap: 0.25rem;
    }

    .menu-bar {
        width: 25px;
        height: 3px;
        background: #2c3e50;
        transition: all 0.3s ease;
    }

    .menu-toggle.open .menu-bar:nth-child(1) {
        transform: rotate(45deg) translate(6px, 6px);
    }

    .menu-toggle.open .menu-bar:nth-child(2) {
        opacity: 0;
    }

    .menu-toggle.open .menu-bar:nth-child(3) {
        transform: rotate(-45deg) translate(6px, -6px);
    }

    .nav-links {
        display: none;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border-top: 1px solid #e9ecef;
        padding: 1rem;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }

    .nav-links.show {
        display: flex;
    }

    @media (max-width: 768px) {
        .menu-toggle {
            display: flex;
        }
        
        .desktop-nav {
            display: none;
        }
    }
`}</style>
        </div>
    );
}