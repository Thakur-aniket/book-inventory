import React, {useState, useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loading from "../Loader/Loader";
import coverImg from "../../images/cover_not_found.jpg";
import "./BookDetails.css";
import {FaArrowLeft} from "react-icons/fa";

const URL = "https://openlibrary.org/works/";

const BookDetails = () => {
  const {id} = useParams();
  const [loading, setLoading] = useState(false);
  const [book, setBook] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const { addToCart } = useAuth();

  useEffect(() => {
    setLoading(true);
    async function getBookDetails(){
      try{
        const response = await fetch(`${URL}${id}.json`);
        const data = await response.json();
        console.log(data);

        if(data){
          const {description, title, covers, subject_places, subject_times, subjects} = data;
          const newBook = {
            id: id,
            description: description ? description.value : "No description found",
            title: title,
            cover_img: covers ? `https://covers.openlibrary.org/b/id/${covers[0]}-L.jpg` : coverImg,
            subject_places: subject_places ? subject_places.join(", ") : "No subject places found",
            subject_times : subject_times ? subject_times.join(", ") : "No subject times found",
            subjects: subjects ? subjects.join(", ") : "No subjects found",
            price: Math.floor(Math.random() * 50) + 20 // Dummy price
          };
          setBook(newBook);
        } else {
          setBook(null);
        }
        setLoading(false);
      } catch(error){
        console.log(error);
        setLoading(false);
      }
    }
    getBookDetails();
  }, [id]);

  const handleAddToCart = () => {
    addToCart({ ...book, quantity });
    navigate('/cart');
  };

  const handleBuyNow = () => {
    addToCart({ ...book, quantity: 1 });
    navigate('/cart');
  };

  if(loading) return <Loading />;

  return (
    <section className='book-details'>
      <div className='container'>
        <button type='button' className='flex flex-c back-btn' onClick={() => navigate("/book")}>
          <FaArrowLeft size = {22} />
          <span className='fs-18 fw-6'>Go Back</span>
        </button>

        <div className='book-details-content grid'>
          <div className='book-details-img'>
            <img src = {book?.cover_img} alt = "cover img" />
          </div>
          <div className='book-details-info'>
            <div className='book-details-item title'>
              <span className='fw-6 fs-24'>{book?.title}</span>
            </div>
            <div className='book-details-item description'>
              <span>{book?.description}</span>
            </div>
            <div className='book-details-item'>
              <span className='fw-6'>Subject Places: </span>
              <span className='text-italic'>{book?.subject_places}</span>
            </div>
            <div className='book-details-item'>
              <span className='fw-6'>Subject Times: </span>
              <span className='text-italic'>{book?.subject_times}</span>
            </div>
            <div className='book-details-item'>
              <span className='fw-6'>Subjects: </span>
              <span>{book?.subjects}</span>
            </div>
            <div className='book-details-item price'>
              <span className='fw-6 fs-20'>Price: </span>
              <span className='fs-20'>${book?.price}</span>
            </div>
            <div className='book-details-item quantity'>
              <span className='fw-6'>Quantity: </span>
              <div className='quantity-controls'>
                <button onClick={() => setQuantity(prev => Math.max(1, prev - 1))}>-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(prev => prev + 1)}>+</button>
              </div>
            </div>
            <div className='book-actions'>
              <button onClick={handleAddToCart} className='btn-add-cart'>
                Add to Cart
              </button>
              <button onClick={handleBuyNow} className='btn-buy-now'>
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BookDetails