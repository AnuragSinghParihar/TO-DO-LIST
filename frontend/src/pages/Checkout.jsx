import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiCheck, FiPackage, FiMapPin, FiCreditCard } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import api from '../api/client';
import './Checkout.css';

const steps = [
  { id: 1, title: 'Review Cart', icon: <FiPackage /> },
  { id: 2, title: 'Shipping', icon: <FiMapPin /> },
  { id: 3, title: 'Confirm', icon: <FiCreditCard /> },
];

const Checkout = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [orderResult, setOrderResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { cart, dispatch, cartTotal } = useCart();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, getValues } = useForm();

  const shipping = cartTotal > 500 ? 0 : 49;
  const total = cartTotal + shipping;

  const onSubmitAddress = (data) => { setCurrentStep(3); };

  const placeOrder = async () => {
    setLoading(true);
    setError('');
    try {
      const formData = getValues();
      const res = await api.post('/api/orders', {
        address: formData.address,
        city: formData.city,
        postal_code: formData.postal_code,
        phone: formData.phone,
      });
      setOrderResult(res.data.order);
      dispatch({ type: 'CLEAR' });
      setCurrentStep(4);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page container">
      <h1>Checkout</h1>

      {/* Steps indicator */}
      <div className="steps-bar">
        {steps.map((step) => (
          <div key={step.id} className={`step ${currentStep >= step.id ? 'active' : ''} ${currentStep > step.id ? 'completed' : ''}`}>
            <div className="step-icon">{currentStep > step.id ? <FiCheck /> : step.icon}</div>
            <span>{step.title}</span>
          </div>
        ))}
      </div>

      {error && <div className="auth-error">{error}</div>}

      {/* Step 1: Cart Review */}
      {currentStep === 1 && (
        <div className="checkout-step">
          <h2>Review Your Items</h2>
          <div className="checkout-items">
            {cart.map(item => (
              <div key={item.id} className="checkout-item">
                <img src={item.image_url || 'https://via.placeholder.com/60'} alt={item.name} />
                <div className="ci-info">
                  <h4>{item.name}</h4>
                  <span>Qty: {item.qty} × ₹{item.price?.toLocaleString()}</span>
                </div>
                <span className="ci-subtotal">₹{(item.price * item.qty).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="checkout-totals">
            <div><span>Subtotal</span><span>₹{cartTotal.toLocaleString()}</span></div>
            <div><span>Shipping</span><span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
            <div className="total-row"><span>Total</span><span>₹{total.toLocaleString()}</span></div>
          </div>
          <button className="btn btn-primary btn-block" onClick={() => setCurrentStep(2)}>Continue to Shipping</button>
        </div>
      )}

      {/* Step 2: Address */}
      {currentStep === 2 && (
        <div className="checkout-step">
          <h2>Shipping Address</h2>
          <form onSubmit={handleSubmit(onSubmitAddress)} className="address-form">
            <div className="form-group">
              <label>Street Address</label>
              <input {...register('address', { required: 'Address required', minLength: { value: 5, message: 'Too short' } })} placeholder="123 Main Street" />
              {errors.address && <span className="field-error">{errors.address.message}</span>}
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input {...register('city', { required: 'City required' })} placeholder="Mumbai" />
                {errors.city && <span className="field-error">{errors.city.message}</span>}
              </div>
              <div className="form-group">
                <label>Postal Code</label>
                <input {...register('postal_code', { required: 'Required' })} placeholder="400001" />
                {errors.postal_code && <span className="field-error">{errors.postal_code.message}</span>}
              </div>
            </div>
            <div className="form-group">
              <label>Phone (optional)</label>
              <input {...register('phone')} placeholder="+91 98765 43210" />
            </div>
            <div className="form-actions">
              <button type="button" className="btn btn-outline" onClick={() => setCurrentStep(1)}>Back</button>
              <button type="submit" className="btn btn-primary">Review Order</button>
            </div>
          </form>
        </div>
      )}

      {/* Step 3: Confirm */}
      {currentStep === 3 && (
        <div className="checkout-step">
          <h2>Confirm Order</h2>
          <div className="confirm-summary">
            <div className="confirm-section">
              <h4>Shipping to:</h4>
              <p>{getValues('address')}, {getValues('city')} - {getValues('postal_code')}</p>
            </div>
            <div className="confirm-section">
              <h4>Order Total: <span className="confirm-total">₹{total.toLocaleString()}</span></h4>
              <p>{cart.length} items • {shipping === 0 ? 'Free shipping' : `₹${shipping} shipping`}</p>
            </div>
          </div>
          <div className="form-actions">
            <button className="btn btn-outline" onClick={() => setCurrentStep(2)}>Back</button>
            <button className="btn btn-primary" onClick={placeOrder} disabled={loading}>
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Success */}
      {currentStep === 4 && orderResult && (
        <div className="checkout-step success-step">
          <div className="success-icon">✓</div>
          <h2>Order Placed Successfully!</h2>
          <p>Order #{orderResult.id} has been confirmed.</p>
          <p className="success-total">Total: ₹{orderResult.total?.toLocaleString()}</p>
          <div className="form-actions">
            <button className="btn btn-outline" onClick={() => navigate('/dashboard')}>View Orders</button>
            <button className="btn btn-primary" onClick={() => navigate('/products')}>Continue Shopping</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
