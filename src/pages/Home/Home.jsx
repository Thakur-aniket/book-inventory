import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="home">
      {isHomePage && (
        <div className="hero">
          <div className="hero-content">
            <h1>Welcome to BookLib</h1>
            <p>Discover your next favorite book</p>
            <a href="/book" className="cta-button">Browse Books</a>
          </div>
        </div>
      )}
      <Outlet />
    </div>
  );
};

export default Home;
