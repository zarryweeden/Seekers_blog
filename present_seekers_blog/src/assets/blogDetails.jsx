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
{/* Dim background when menu is open */}
{menuOpen && <div className="menu-dim" onClick={() => setMenuOpen(false)}></div>}

<div className="nav-bar">
  <div className="nav-brand">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="150"
      height="50"
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
          fontSize: "0.75rem",
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
          fontSize: "1.6875rem",
          fontWeight: '650',
          fill: "#e67e22",
          letterSpacing: '0.09375rem'
        }}
      >
        Seekers
      </text>
      <text
        x="29"
        y="46"
        style={{
          fontFamily: "'Fraunces', serif",
          fontSize: "0.75rem",
          fontWeight: '850',
          fill: "#2c3e50"
        }}
      >
        ministry
      </text>
    </svg>
  </div>

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
    {/* Social Share Section - Individual colored icons */}
    <div className="social-share-section">
        <div className="share-label">Share this article</div>
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

    {/* Engagement Actions - Simple and clean */}
    <div className="engagement-section">
        <div className="engagement-buttons">
            <button 
                className={`engagement-btn like-btn ${isLiked ? 'liked' : ''}`}
                onClick={handleLike}
                aria-label={isLiked ? 'Unlike post' : 'Like post'}
            >
                {isLiked ? <FaHeart /> : <FaRegHeart />}
                <span className="btn-text">{isLiked ? 'Liked' : 'Like'}</span>
                <span className="count">{likes}</span>
            </button>
            
            {/* Remove the comment button since comments are always visible now */}
        </div>
    </div>

    {/* Navigation Buttons - Aligned to right */}
    <div className="navigation-buttons">
        <Link to="/blogs" className="nav-btn explore-btn">
            <span>Explore More</span>
            <FaArrowRight />
        </Link>
        <button 
            onClick={() => navigate(-1)} 
            className="nav-btn back-btn"
        >
            <FaArrowLeft />
            <span>Back to Articles</span>
        </button>
    </div>

    {/* Comments Section - ALWAYS VISIBLE and full width */}
    <div className="comments-section">
        <div className="comments-header">
            <h3>Comments ({comments.length})</h3>
            <p>Join the conversation</p>
        </div>
        
        {/* Add Comment Form */}
        <div className="add-comment-form">
            <textarea
                ref={commentInputRef}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Share your thoughts on this article..."
                className="comment-input"
                rows="4"
                maxLength="500"
            />
            <div className="comment-form-actions">
                <div className="char-count">
                    {newComment.length}/500
                </div>
                <button 
                    onClick={handleAddComment}
                    disabled={!newComment.trim() || commentLoading || newComment.length > 500}
                    className="submit-comment-btn"
                >
                    {commentLoading ? 'Posting...' : 'Post Comment'}
                </button>
            </div>
        </div>

        {/* Comments List */}
        <div className="comments-list">
            {comments.length === 0 ? (
                <div className="no-comments">
                    <FaRegComment className="no-comments-icon" />
                    <h4>No comments yet</h4>
                    <p>Be the first to share your thoughts!</p>
                </div>
            ) : (
                comments.map((comment) => (
                    <div key={comment.id} className="comment-item">
                        <div className="comment-author">
                            <div className="author-avatar">
                                {comment.user_profile_image ? (
                                    <img 
                                        src={comment.user_profile_image} 
                                        alt={`${comment.user_first_name} ${comment.user_last_name}`}
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            const initials = document.querySelector(`.author-initials[data-comment-id="${comment.id}"]`);
                                            if (initials) initials.style.display = 'flex';
                                        }}
                                    />
                                ) : null}
                                <div 
                                    className="author-initials" 
                                    data-comment-id={comment.id}
                                    style={{ display: comment.user_profile_image ? 'none' : 'flex' }}
                                >
                                    <FaUser />
                                </div>
                            </div>
                            <div className="author-details">
                                <span className="author-name">
                                    {comment.user_first_name && comment.user_last_name 
                                        ? `${comment.user_first_name} ${comment.user_last_name}`
                                        : 'Anonymous Reader'
                                    }
                                </span>
                                <span className="comment-date">
                                    {formatDateTime(comment.created_at)}
                                </span>
                            </div>
                        </div>
                        <div className="comment-content">
                            {comment.content}
                        </div>
                    </div>
                ))
            )}
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
      
      <div className="footer-social-icons">
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
    position: relative;
    }

    .nav-brand {
    flex-shrink: 0;
    }

    .desktop-nav {
    display: flex;
    gap: 2rem;
    align-items: center;
    }

    .nav-item {
    color: #2c3e50;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s ease;
    padding: 0.5rem 0;
    }

    .nav-item:hover {
    color: #e67e22;
    }

    .nav-item.active {
    color: #e67e22;
    font-weight: 600;
    }

    /* Mobile Menu Styles */
    .menu-dim {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 998;
    }

    .menu-toggle {
    display: none;
    flex-direction: column;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    gap: 0.25rem;
    z-index: 1000;
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
    z-index: 999;
    }

    .nav-links.show {
    display: flex;
    }

    .nav-links .nav-item {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #f8f9fa;
    }

    .nav-links .nav-item:last-child {
    border-bottom: none;
    }

    @media (max-width: 768px) {
    .menu-toggle {
        display: flex;
    }
    
    .desktop-nav {
        display: none;
    }
    
    .nav-bar {
        padding: 1rem;
    }
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

    /* Article Footer */
    .article-footer {
        margin-top: 3rem;
        padding-top: 2rem;
        border-top: 1px solid #e9ecef;
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    /* Social Share Section */
    .social-share-section {
        text-align: center;
        padding: 1.5rem;
        background: #f8f9fa;
        border-radius: 12px;
        border: 1px solid #e9ecef;
    }

    .share-label {
        font-weight: 600;
        color: #2c3e50;
        font-size: 1.1rem;
        margin-bottom: 1rem;
        display: block;
    }

    .social-share-buttons {
        display: flex;
        justify-content: center;
        gap: 1rem;
        flex-wrap: wrap;
    }

    .social-share-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 50px;
        height: 50px;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 1.2rem;
        color: white;
        position: relative;
    }

    .social-share-btn.facebook { background: #1877f2; }
    .social-share-btn.twitter { background: #1da1f2; }
    .social-share-btn.whatsapp { background: #25d366; }
    .social-share-btn.copy { background: #6c757d; }

    .social-share-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }

    .copy-tooltip {
        position: absolute;
        top: -40px;
        left: 50%;
        transform: translateX(-50%);
        background: #2c3e50;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        font-size: 0.8rem;
        white-space: nowrap;
    }

    .copy-tooltip::after {
        content: '';
        position: absolute;
        bottom: -5px;
        left: 50%;
        transform: translateX(-50%);
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-top: 5px solid #2c3e50;
    }

    /* Engagement Section */
    .engagement-section {
        display: flex;
        justify-content: center;
    }

    .engagement-buttons {
        display: flex;
        gap: 1rem;
    }

    .engagement-btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1.5rem;
        border: 2px solid #e67e22;
        background: white;
        color: #e67e22;
        border-radius: 25px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: 600;
        font-size: 1rem;
    }

    .engagement-btn:hover {
        background: #e67e22;
        color: white;
        transform: translateY(-2px);
    }

    .engagement-btn.liked {
        background: #e67e22;
        color: white;
    }

    .btn-text {
        font-weight: 600;
    }

    .count {
        background: rgba(230, 126, 34, 0.1);
        color: #e67e22;
        padding: 0.25rem 0.5rem;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 600;
        min-width: 24px;
        text-align: center;
    }

    .engagement-btn.liked .count {
        background: rgba(255, 255, 255, 0.2);
        color: white;
    }

    /* Navigation Buttons */
    .navigation-buttons {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        flex-wrap: wrap;
    }

    .nav-btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1.5rem;
        border: 2px solid #e67e22;
        background: white;
        color: #e67e22;
        text-decoration: none;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: 600;
    }

    .nav-btn:hover {
        background: #e67e22;
        color: white;
        transform: translateY(-2px);
    }

    .nav-btn.explore-btn {
        background: #e67e22;
        color: white;
    }

    .nav-btn.explore-btn:hover {
        background: #d35400;
    }

    /* Comments Section - Below all footer elements */
    .comments-section {
        margin-top: 2rem;
        padding: 2rem;
        background: #f8f9fa;
        border-radius: 12px;
        border: 1px solid #e9ecef;
        width: 100%; 
        box-sizing: border-box;
    }

    .comments-header {
        text-align: center;
        margin-bottom: 2rem;
    }

    .comments-header h3 {
        margin: 0 0 0.5rem 0;
        color: #2c3e50;
        font-size: 1.5rem;
    }

    .comments-header p {
        color: #7f8c8d;
        margin: 0;
        font-size: 1rem;
    }

    /* Add Comment Form */
    .add-comment-form {
        margin-bottom: 2rem;
        padding-bottom: 2rem;
        border-bottom: 1px solid #e9ecef;
    }

    .comment-input {
        width: 100%;
        padding: 1rem;
        border: 2px solid #e9ecef;
        border-radius: 8px;
        resize: vertical;
        font-family: inherit;
        font-size: 1rem;
        transition: border-color 0.3s ease;
        background: white;
        margin-bottom: 1rem;
    }

    .comment-input:focus {
        outline: none;
        border-color: #e67e22;
    }

    .comment-form-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .char-count {
        color: #7f8c8d;
        font-size: 0.85rem;
    }

    .submit-comment-btn {
        padding: 0.75rem 1.5rem;
        background: #e67e22;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s ease;
    }

    .submit-comment-btn:hover:not(:disabled) {
        background: #d35400;
        transform: translateY(-1px);
    }

    .submit-comment-btn:disabled {
        background: #bdc3c7;
        cursor: not-allowed;
        transform: none;
    }

    /* Comments List */
    .comments-list {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .no-comments {
        text-align: center;
        padding: 3rem 2rem;
        color: #7f8c8d;
    }

    .no-comments-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
        opacity: 0.5;
    }

    .no-comments h4 {
        margin: 0 0 0.5rem 0;
        color: #2c3e50;
        font-size: 1.2rem;
    }

    .no-comments p {
        margin: 0;
        font-size: 1rem;
    }

    .comment-item {
        padding: 1.5rem;
        background: white;
        border-radius: 8px;
        border: 1px solid #e9ecef;
    }

    .comment-author {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 1rem;
    }

    .author-avatar {
        position: relative;
        width: 40px;
        height: 40px;
    }

    .author-avatar img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
    }

    .author-initials {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: #e67e22;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.8rem;
    }

    .author-details {
        display: flex;
        flex-direction: column;
    }

    .author-name {
        font-weight: 600;
        color: #2c3e50;
        font-size: 0.95rem;
    }

    .comment-date {
        color: #7f8c8d;
        font-size: 0.8rem;
    }

    .comment-content {
        color: #2c3e50;
        line-height: 1.6;
        white-space: pre-wrap;
        font-size: 0.95rem;
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
        justify-content: space-between;
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

    /* Footer Social Icons */
    .footer-social-icons {
        display: flex;
        gap: 1rem;
    }

    .footer-social-icons a {
        color: #bdc3c7;
        font-size: 1.5rem;
        transition: color 0.3s ease;
    }

    .footer-social-icons a:hover {
        color: #e67e22;
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

        .social-share-buttons {
            gap: 0.5rem;
        }
        
        .social-share-btn {
            width: 45px;
            height: 45px;
            font-size: 1.1rem;
        }
        
        .engagement-buttons {
            flex-direction: column;
            width: 100%;
            max-width: 200px;
            justify-content: center;
            flex-wrap: wrap;
        }
        
        .engagement-btn {
            flex: 1;
            min-width: 140px;
            justify-content: center;
        }
        
        .navigation-buttons {
            justify-content: center;
        }
        
        .nav-btn {
            flex: 1;
            justify-content: center;
            min-width: 140px;
        }
        
        .comments-section {
            padding: 1.5rem;
            margin: 1rem 0;
        }
        
        .comment-form-actions {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
        }
        
        .submit-comment-btn {
            width: 100%;
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
            margin-top: 2rem;
            padding-top: 1.5rem;
            gap: 1.5rem;
        }
        
        .social-share-section, .engagement-section {
            padding: 1rem;
        }
        
        .engagement-btn {
            padding: 0.75rem 1rem;
            font-size: 0.9rem;
        }
        
        .navigation-buttons {
            flex-direction: column;
        }
        
        .nav-btn {
            width: 100%;
        }
        
        .comments-section {
            padding: 1rem;
        }
        
        .comments-header h3 {
            font-size: 1.3rem;
        }

        .action-btn, .nav-btn {
            padding: 0.75rem 1rem;
            font-size: 0.9rem;
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