import React from 'react';
import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiInstagram, FiMail } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h3>🛍️ SHOPMART</h3>
            <p>Your premium online shopping destination. Quality products, fast delivery, and exceptional service.</p>
            <div className="social-links">
              <a href="#" aria-label="GitHub"><FiGithub /></a>
              <a href="#" aria-label="Twitter"><FiTwitter /></a>
              <a href="#" aria-label="Instagram"><FiInstagram /></a>
              <a href="#" aria-label="Email"><FiMail /></a>
            </div>
          </div>

          <div className="footer-links">
            <h4>Quick Links</h4>
            <Link to="/products">All Products</Link>
            <Link to="/products?category=electronics">Electronics</Link>
            <Link to="/products?category=clothing">Clothing</Link>
            <Link to="/products?category=books">Books</Link>
          </div>

          <div className="footer-links">
            <h4>Support</h4>
            <Link to="#">FAQ</Link>
            <Link to="#">Shipping Info</Link>
            <Link to="#">Returns</Link>
            <Link to="#">Contact Us</Link>
          </div>

          <div className="footer-links">
            <h4>Account</h4>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            <Link to="/dashboard">My Orders</Link>
            <Link to="/cart">Cart</Link>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 SHOPMART. All rights reserved.</p>
          <p>Built with ❤️ by AnuragSinghParihar</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
