import React from 'react';
import { useLocation } from 'react-router-dom';
import "./Banner.css";

const Banner = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  if (!isHomePage) return null;

  return (
    <section className='banner'>
      <div className='container'>
        <div className='banner-content'>
          <h1 className='banner-title'>
            Welcome to BookHub
          </h1>
          <p className='banner-text'>
            Discover your next favorite book from our extensive collection
          </p>
        </div>
      </div>
    </section>
  );
};

export default Banner; 