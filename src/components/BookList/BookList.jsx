import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './BookList.css';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();
  const lastBookRef = useRef();
  const searchTimeout = useRef(null);

  const fetchBooks = async (query = '', pageNum = 1) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://openlibrary.org/search.json?q=${query}&page=${pageNum}&limit=30`
      );
      const data = await response.json();
      
      if (pageNum === 1) {
        setBooks(data.docs || []);
      } else {
        setBooks(prev => [...prev, ...(data.docs || [])]);
      }
      
      setHasMore(data.docs && data.docs.length === 30);
      setError(null);
    } catch (err) {
      setError('Failed to fetch books. Please try again later.');
      console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load with popular books
  useEffect(() => {
    fetchBooks('subject:fiction', 1);
  }, []);

  // Infinite scroll
  useEffect(() => {
    observer.current = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage(prev => prev + 1);
          fetchBooks(searchQuery || 'subject:fiction', page + 1);
        }
      },
      { threshold: 0.5 }
    );

    if (lastBookRef.current) {
      observer.current.observe(lastBookRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [hasMore, loading, page, searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setBooks([]);
    fetchBooks(searchQuery, 1);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    
    searchTimeout.current = setTimeout(() => {
      if (value.trim()) {
        setPage(1);
        setBooks([]);
        fetchBooks(value, 1);
      } else {
        setPage(1);
        setBooks([]);
        fetchBooks('subject:fiction', 1);
      }
    }, 500);
  };

  const getBookImage = (book) => {
    if (book.cover_i) {
      return `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
    }
    return '/placeholder.jpg';
  };

  return (
    <div className="book-list">
      <div className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search books by title, author, or subject..."
            className="search-input"
          />
          <button type="submit" className="search-btn">
            <i className="fas fa-search"></i>
          </button>
        </form>
      </div>

      {error ? (
        <div className="error">{error}</div>
      ) : (
        <>
          {books.length === 0 && !loading ? (
            <div className="error">No books found. Try a different search.</div>
          ) : (
            <div className="books-grid">
              {books.map((book, index) => (
                <Link
                  to={`/book/${book.key.split('/')[2]}`}
                  key={book.key}
                  className="book-card"
                  ref={index === books.length - 1 ? lastBookRef : null}
                >
                  <div className="book-image">
                    <img
                      src={getBookImage(book)}
                      alt={book.title}
                      onError={(e) => {
                        e.target.src = '/placeholder.jpg';
                      }}
                    />
                  </div>
                  <div className="book-info">
                    <h3 className="book-title">{book.title}</h3>
                    <p className="book-author">
                      {book.author_name ? book.author_name[0] : 'Unknown Author'}
                    </p>
                    <div className="book-meta">
                      <span>
                        <i className="fas fa-calendar"></i>
                        {book.first_publish_year || 'N/A'}
                      </span>
                      <span>
                        <i className="fas fa-star"></i>
                        {book.ratings_average ? book.ratings_average.toFixed(1) : 'N/A'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          {loading && <div className="loading">Loading books...</div>}
        </>
      )}
    </div>
  );
};

export default BookList;