import { Link, useLocation } from "react-router-dom"
import { FaInstagram, FaWhatsapp, FaFacebook, FaArrowRight, FaTiktok } from "react-icons/fa";
import { useState, useEffect } from "react";
import { blogAPI } from "../services/api";

export default function Blogs(){
    const location = useLocation()
    const isActive = (path) => location.pathname === path;
    const [menuOpen, setMenuOpen] = useState(false);
    
    // State for dynamic data
    const [categories, setCategories] = useState([]);
    const [blogPosts, setBlogPosts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null); // Start with no category selected
    const [loading, setLoading] = useState(true);

    // Fetch data on component mount
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [categoriesResponse, postsResponse] = await Promise.all([
                blogAPI.getCategories(),
                blogAPI.getPosts()
            ]);
            
            setCategories(categoriesResponse.data);
            setBlogPosts(postsResponse.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Get article count for a category
    const getArticleCount = (categoryName) => {
        return blogPosts.filter(post => post.category_name === categoryName).length;
    };
    // Get articles for selected category
    const getArticlesForCategory = () => {
        if (!selectedCategory) return [];
        return blogPosts.filter(post => post.category_name === selectedCategory);
    };

    const handleCategoryClick = (categoryName) => {
        setSelectedCategory(categoryName);
    };
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };
    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading inspiring content...</p>
            </div>
        );
    }
    
    return(
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

            {/* STEP 1: Top Category Navigation */}
            <div className="categories" style={{marginTop:'6.9rem'}}>
                <ul className="categories-navigation">
                    <li 
                        className={`categories-navigation-li ${!selectedCategory ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(null)}
                    >
                        All Categories
                    </li>
                    {categories.map(category => (
                        <li 
                            key={category.id}
                            className={`categories-navigation-li ${selectedCategory === category.name ? 'active' : ''}`}
                            onClick={() => handleCategoryClick(category.name)}
                        >
                            {category.name}
                        </li>
                    ))}
                </ul>
            </div>

            {/* STEP 1: Beautiful Category Cards Grid - ADDED WRAPPER DIV */}
            <div className="category-cards">
                {categories.map(category => {
                    const articleCount = getArticleCount(category.name);
                    
                    return (
                        <div key={category.id} className="card1">
                            <div className="card-image-container">
                                <img 
                                    src={category.image || '/images/placeholder.jpg'} 
                                    alt={`${category.name} category`}
                                    onError={(e) => {
                                        e.target.src = '/images/placeholder.jpg';
                                    }}
                                />
                                <div className="category-overlay">{category.name}</div>
                            </div>
                            <div className="card-content">
                                <h1>{category.name}</h1>
                                <p>{category.description || `Explore inspiring content about ${category.name}`}</p>
                                
                                <div className="card-footer">
                                    <h3>{articleCount} {articleCount === 1 ? 'article' : 'articles'}</h3>
                                  <Link 
                                      to={`/category/${category.name}`}
                                      className="browse-btn"
                                  >
                                      Browse Stories →
                                  </Link>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>



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