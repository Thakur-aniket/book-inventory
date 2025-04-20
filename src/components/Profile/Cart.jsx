// src/components/Profile/Cart.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import coverNotFound from '../../images/cover_not_found.jpg'; // same fallback you used in BookDetails
import './Cart.css';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, user } = useAuth();
  const navigate = useNavigate();
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [deliveryDetails, setDeliveryDetails] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });

  const calculateTotal = () =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleDeliveryDetailsChange = e => {
    const { name, value } = e.target;
    setDeliveryDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckout = () => {
    setOrderSuccess(true);
    setTimeout(() => navigate('/profile'), 2000);
  };

  if (orderSuccess) {
    return (
      <div className="cart-container">
        <div className="success-message">
          <h2>Order Placed Successfully!</h2>
          <p>Thank you for your purchase. Redirecting to profile...</p>
        </div>
      </div>
    );
  }

  if (!cart.length) {
    return (
      <div className="cart-container">
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <p>Add some books to your cart to see them here!</p>
          <button onClick={() => navigate('/book')}>Browse Books</button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      <div className="cart-items">
        {cart.map(item => (
          <div key={item.id} className="cart-item">
            <div className="cart-item-image">
              <img
                src={
                  item.cover_img
                    ? item.cover_img
                    : item.cover_i
                    ? `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg`
                    : coverNotFound
                }
                alt={item.title}
                onError={e => {
                  e.target.onerror = null;
                  e.target.src = coverNotFound;
                }}
                style={{ width: '120px', height: '180px', objectFit: 'cover', border: '1px solid #ccc' }}
              />
            </div>

            <div className="cart-item-details">
              <h3>{item.title}</h3>
              {/* If you want author, ensure you passed it in BookDetails */}
              {item.author && <p>Author: {item.author}</p>}
              <p>Price: ${item.price}</p>
              <div className="quantity-controls">
                <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              </div>
            </div>

            <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h3>Order Summary</h3>
        <p>Total Items: {cart.reduce((sum, i) => sum + i.quantity, 0)}</p>
        <p>Total Price: ${calculateTotal().toFixed(2)}</p>
        <button onClick={() => setShowCheckout(true)}>Proceed to Checkout</button>
      </div>

      {showCheckout && (
        <div className="checkout-form">
          <h3>Delivery Details</h3>
          <form
            onSubmit={e => {
              e.preventDefault();
              handleCheckout();
            }}
          >
            {['name', 'email', 'phone', 'address'].map(field => (
              <div className="form-group" key={field}>
                <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                {field === 'address' ? (
                  <textarea name={field} value={deliveryDetails[field]} onChange={handleDeliveryDetailsChange} required />
                ) : (
                  <input
                    type={field === 'email' ? 'email' : 'text'}
                    name={field}
                    value={deliveryDetails[field]}
                    onChange={handleDeliveryDetailsChange}
                    required
                  />
                )}
              </div>
            ))}
            <div className="checkout-actions">
              <button type="submit">Place Order</button>
              <button type="button" onClick={() => setShowCheckout(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Cart;


