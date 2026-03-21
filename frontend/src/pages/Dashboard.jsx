import React, { useState, useEffect } from 'react';
import { FiPackage, FiClock, FiTruck, FiCheck, FiUser } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import './Dashboard.css';

const statusIcons = {
  pending: <FiClock />,
  confirmed: <FiCheck />,
  shipped: <FiTruck />,
  delivered: <FiPackage />,
  cancelled: <FiPackage />,
};

const statusColors = {
  pending: '#fdcb6e',
  confirmed: '#6c5ce7',
  shipped: '#00cec9',
  delivered: '#00b894',
  cancelled: '#e17055',
};

const Dashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/api/orders');
        setOrders(res.data.orders);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchOrders();
  }, []);

  return (
    <div className="dashboard-page container">
      <div className="dash-header">
        <div className="dash-user">
          <div className="dash-avatar"><FiUser /></div>
          <div>
            <h1>Welcome, {user?.name}</h1>
            <p>{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="dash-stats">
        <div className="stat-card">
          <span className="stat-value">{orders.length}</span>
          <span className="stat-label">Total Orders</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{orders.filter(o => o.status === 'delivered').length}</span>
          <span className="stat-label">Delivered</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{orders.filter(o => o.status === 'pending').length}</span>
          <span className="stat-label">Pending</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">
            ₹{orders.reduce((sum, o) => sum + parseFloat(o.total), 0).toLocaleString()}
          </span>
          <span className="stat-label">Total Spent</span>
        </div>
      </div>

      <h2 className="dash-section-title">Order History</h2>

      {loading ? (
        <div className="loading-state"><div className="spinner" /></div>
      ) : orders.length === 0 ? (
        <div className="empty-orders">
          <FiPackage className="empty-icon" />
          <h3>No orders yet</h3>
          <p>Start shopping to see your orders here.</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div>
                  <span className="order-id">Order #{order.id}</span>
                  <span className="order-date">{new Date(order.created_at).toLocaleDateString()}</span>
                </div>
                <span className="order-status" style={{ color: statusColors[order.status], borderColor: statusColors[order.status] }}>
                  {statusIcons[order.status]} {order.status}
                </span>
              </div>
              {order.items && (
                <div className="order-items">
                  {order.items.map(item => (
                    <div key={item.id} className="order-item">
                      <img src={item.image_url || 'https://via.placeholder.com/40'} alt={item.name} />
                      <span className="oi-name">{item.name}</span>
                      <span className="oi-qty">×{item.quantity}</span>
                      <span className="oi-price">₹{item.price?.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="order-footer">
                <span>Shipped to {order.city}</span>
                <span className="order-total">₹{parseFloat(order.total).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
