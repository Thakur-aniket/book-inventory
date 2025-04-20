import React from 'react';
import "./About.css";
import aboutImg from "../../images/about-img.jpg";

const About = () => {
  return (
    <section className='about'>
      <div className='container'>
        <div className='section-title'>
          <h2>About</h2>
        </div>

        <div className='about-content grid'>
          <div className='about-img'>
            <img src = {aboutImg} alt = "" />
          </div>
          <div className='about-text'>
  <h2 className='about-title fs-26 ls-1'>About BookHub</h2>
  <p className='fs-17'>
    BookHub is your go-to platform for discovering, exploring, and searching a vast collection of books from various genres and authors. Whether you're a casual reader or a book enthusiast, BookHub helps you find your next great read with ease and efficiency.
  </p>
  <p className='fs-17'>
    Powered by modern web technologies, BookHub offers a seamless and responsive experience. Users can search for books, view details, and navigate through an intuitive interface built with React. Our mission is to make book discovery simple, fast, and enjoyable for everyone.
  </p>
</div>

        </div>
      </div>
    </section>
  )
}

export default About
