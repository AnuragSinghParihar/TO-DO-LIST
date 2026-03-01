import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiTruck, FiShield, FiRefreshCw, FiHeadphones } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import api from '../api/client';
import './HomePage.css';

const categories = [
  { name: 'Electronics', slug: 'electronics', icon: '💻', color: '#6c5ce7' },
  { name: 'Clothing', slug: 'clothing', icon: '👕', color: '#00cec9' },
  { name: 'Home & Kitchen', slug: 'home-kitchen', icon: '🏠', color: '#fd79a8' },
  { name: 'Books', slug: 'books', icon: '📚', color: '#fdcb6e' },
  { name: 'Sports', slug: 'sports', icon: '⚽', color: '#00b894' },
];

const features = [
  { icon: <FiTruck />, title: 'Free Shipping', desc: 'On orders above ₹500' },
  { icon: <FiShield />, title: 'Secure Payment', desc: '100% protected' },
  { icon: <FiRefreshCw />, title: 'Easy Returns', desc: '30-day return policy' },
  { icon: <FiHeadphones />, title: '24/7 Support', desc: 'Always here to help' },
];

const HomePage = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/api/products/featured');
        setFeatured(res.data.products);
      } catch (err) {
        console.error('Failed to fetch featured products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content container">
          <div className="hero-text">
            <span className="hero-badge">🔥 New Arrivals</span>
            <h1>Discover Premium Products at <span className="gradient-text">Unbeatable Prices</span></h1>
            <p>Shop the latest trends in electronics, fashion, home essentials, and more. Free shipping on orders above ₹500.</p>
            <div className="hero-actions">
              <Link to="/products" className="btn btn-primary">
                Shop Now <FiArrowRight />
              </Link>
              <Link to="/products?category=electronics" className="btn btn-outline">
                Explore Electronics
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-shapes">
              <div className="shape shape-1"></div>
              <div className="shape shape-2"></div>
              <div className="shape shape-3"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-bar">
        <div className="container features-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-item">
              <div className="feature-icon">{f.icon}</div>
              <div>
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="section container">
        <h2 className="section-title">Shop by Category</h2>
        <div className="categories-grid">
          {categories.map((cat) => (
            <Link key={cat.slug} to={`/products?category=${cat.slug}`} className="category-card" style={{ '--accent': cat.color }}>
              <span className="category-icon">{cat.icon}</span>
              <span className="category-name">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="section container">
        <div className="section-header">
          <h2 className="section-title">Featured Products</h2>
          <Link to="/products" className="view-all">View All <FiArrowRight /></Link>
        </div>
        {loading ? (
          <div className="loading-grid">
            {[...Array(4)].map((_, i) => <div key={i} className="skeleton-card" />)}
          </div>
        ) : (
          <div className="products-grid">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={() => {}} />
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container cta-content">
          <h2>Ready to Start Shopping?</h2>
          <p>Join thousands of happy customers and find exactly what you need.</p>
          <Link to="/register" className="btn btn-primary btn-lg">Create Account <FiArrowRight /></Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
