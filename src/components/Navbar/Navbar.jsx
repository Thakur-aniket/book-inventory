import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Close menu when route changes
  useEffect(() => {
    closeMenu();
  }, [location]);

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          <i className="fas fa-book"></i>
          BookLib
        </Link>

        <button className="navbar-toggler" onClick={toggleMenu}>
          <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>

        <div className={`navbar-items ${isMenuOpen ? 'show' : ''}`}>
          <Link to="/" className="navbar-link" onClick={closeMenu}>
            <i className="fas fa-home"></i>
            Home
          </Link>
          <Link to="/book" className="navbar-link" onClick={closeMenu}>
            <i className="fas fa-book-open"></i>
            Books
          </Link>
          <Link to="/about" className="navbar-link" onClick={closeMenu}>
            <i className="fas fa-info-circle"></i>
            About
          </Link>

          {isAuthenticated ? (
            <div className="profile-menu">
              <div className="navbar-link">
                <i className="fas fa-user"></i>
                Profile
              </div>
              <div className="dropdown-menu">
                <Link to="/profile" className="dropdown-item">
                  <i className="fas fa-user-circle"></i>
                  My Profile
                </Link>
                <Link to="/cart" className="dropdown-item">
                  <i className="fas fa-shopping-cart"></i>
                  Cart
                </Link>
                <div className="dropdown-divider"></div>
                <button onClick={logout} className="dropdown-item">
                  <i className="fas fa-sign-out-alt"></i>
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="navbar-link" onClick={closeMenu}>
              <i className="fas fa-sign-in-alt"></i>
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;