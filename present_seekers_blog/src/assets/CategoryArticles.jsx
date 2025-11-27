import { Link, useParams, useNavigate } from "react-router-dom";
import { FaInstagram, FaWhatsapp, FaFacebook, FaArrowRight, FaTiktok, FaArrowLeft, FaCalendar, FaEye, FaBookReader } from "react-icons/fa";
import { useState, useEffect } from "react";
import { blogAPI } from "../services/api";

export default function CategoryArticles() {
    const { categoryName } = useParams();
    const navigate = useNavigate();
    const [articles, setArticles] = useState([]);
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCategoryArticles();
    }, [categoryName]);

    const fetchCategoryArticles = async () => {
        try {
            setLoading(true);
            const [categoriesResponse, postsResponse] = await Promise.all([
                blogAPI.getCategories(),
                blogAPI.getPosts()
            ]);
            
            // Find the current category
            const currentCategory = categoriesResponse.data.find(cat => cat.name === categoryName);
            setCategory(currentCategory);
            
            // Filter articles for this category
            const categoryArticles = postsResponse.data.filter(post => post.category_name === categoryName);
            setArticles(categoryArticles);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // ADD THIS MISSING FUNCTION
    const formatReadingTime = (content) => {
        if (!content) return '1 min read';
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

    return (
        <div className="category-articles-page">
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

            {/* Category Hero Section */}
            <section className="category-hero-section" style={{marginTop:'0.5rem'}}>
                <div className="container">
                    <button 
                        className="back-button"
                        onClick={() => navigate('/blogs')}
                    >
                        <FaArrowLeft /> All Categories
                    </button>
                    
                    <div className="category-hero">
                        <div className="category-hero-image">
                            <img 
                                src={category?.image || '/images/placeholder.jpg'} 
                                alt={categoryName}
                                onError={(e) => {
                                    e.target.src = '/images/placeholder.jpg';
                                }}
                            />
                            <div className="image-overlay"></div>
                        </div>
                        <div className="category-hero-content">
                            <div className="category-badge">{categoryName}</div>
                            <h1 className="category-title">{categoryName}</h1>
                            <p className="category-description">
                                {category?.description || `Explore inspiring content about ${categoryName}`}
                            </p>
                            <div className="category-stats">
                                <div className="stat">
                                    <span className="stat-number">{articles.length}</span>
                                    <span className="stat-label">{articles.length === 1 ? 'Article' : 'Articles'}</span>
                                </div>
                                <div className="stat-divider"></div>
                                <div className="stat">
                                    <span className="stat-number">
                                        {articles.reduce((total, article) => total + article.views, 0).toLocaleString()}
                                    </span>
                                    <span className="stat-label">Total Views</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Articles Section */}
            <section className="articles-section">
                <div className="container">
                    <div className="section-header">
                        <h2>Latest Articles</h2>
                        <p>Discover inspiring stories and insights from our community</p>
                    </div>

                    {articles.length > 0 ? (
                        <div className="articles-grid">
                            {articles.map(article => (
                                <article key={article.id} className="article-card">
                                    <div className="article-image">
                                        <img 
                                            src={article.featured_image || '/images/article-placeholder.jpg'} 
                                            alt={article.title}
                                            onError={(e) => {
                                                e.target.src = '/images/article-placeholder.jpg';
                                            }}
                                        />
                                        <div className="article-overlay">
                                            <span className="read-time">
                                                <FaBookReader /> {formatReadingTime(article.content)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="article-content">
                                        <div className="article-meta">
                                            <span className="article-date">
                                                <FaCalendar /> {formatDate(article.created_at)}
                                            </span>
                                            <span className="article-views">
                                                <FaEye /> {article.views} views
                                            </span>
                                        </div>
                                        <h3 className="article-title">{article.title}</h3>
                                        <p className="article-excerpt">
                                            {article.excerpt || 'Discover the inspiring message in this article...'}
                                        </p>
                                        <div className="article-footer">
                                            <Link to={`/blog/${article.id}`} className="read-more-btn">
                                                Read Full Article <FaArrowRight />
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="no-articles-message">
                            <div className="empty-state">
                                <div className="empty-icon">📝</div>
                                <h3>No articles yet in this category</h3>
                                <p>We're working on creating inspiring content for you. Check back soon!</p>
                                <button 
                                    className="back-to-categories-btn"
                                    onClick={() => navigate('/blogs')}
                                >
                                    <FaArrowLeft /> Explore Other Categories
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </section>

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