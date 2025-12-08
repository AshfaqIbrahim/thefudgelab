import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from "../Context/AuthContext";
import { api } from '../Api/Axios';

const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(null);

  useEffect(() => {
    if (user) {
      fetchUserOrders();
      
      // Set up auto-refresh every 10 seconds
      const interval = setInterval(() => {
        fetchUserOrders();
      }, 10000);
      
      setRefreshInterval(interval);
      
      return () => {
        if (interval) clearInterval(interval);
      };
    }
  }, [user]);

  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      // Fetch user data from database
      const response = await api.get(`/users/${user.id}`);
      const userData = response.data;
      
      // Get orders from user data
      const userOrders = userData.orders || [];
      
      // Sort by date ,newest first
      const sortedOrders = userOrders.sort((a, b) => 
        new Date(b.date) - new Date(a.date)
      );
      
      setOrders(sortedOrders);
      
      // Also update localStorage for backup
      localStorage.setItem('userOrders', JSON.stringify(sortedOrders));
    } catch (error) {
      console.error('Error fetching user orders:', error);
      // Fallback to localStorage if API fails
      const userOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
      const userSpecificOrders = userOrders.filter(order => order.userId === user.id);
      setOrders(userSpecificOrders);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchUserOrders();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'preparing':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border border-purple-200';
      case 'delivered':
        return 'bg-gray-100 text-gray-800 border border-gray-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return 'fa-solid fa-check-circle';
      case 'preparing':
        return 'fa-solid fa-utensils';
      case 'shipped':
        return 'fa-solid fa-truck';
      case 'delivered':
        return 'fa-solid fa-box-open';
      case 'cancelled':
        return 'fa-solid fa-times-circle';
      default:
        return 'fa-solid fa-clock';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F4E1] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#AF8F6F] mx-auto"></div>
          <p className="mt-4 text-[#543310] poppins-body">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F8F4E1] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#543310] mb-4 playfair-heading">Please Login</h2>
          <p className="text-[#74512D] mb-6 poppins-body">You need to be logged in to view your orders.</p>
          <Link
            to="/login"
            className="bg-[#543310] text-white px-6 py-3 rounded-lg hover:bg-[#74512D] transition-colors poppins-body"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F4E1] py-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#543310] mb-2 playfair-heading">My Orders</h1>
            <p className="text-[#74512D] poppins-body">Your order history and tracking (Auto-refreshes every 10s)</p>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center space-x-2 px-4 py-2 bg-[#543310] hover:bg-[#74512D] text-white rounded-lg transition-colors poppins-body"
          >
            <i className="fa-solid fa-refresh"></i>
            <span>Refresh Now</span>
          </button>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-[#AF8F6F]/20 p-8 text-center">
            <i className="fa-solid fa-receipt text-6xl text-[#AF8F6F] mb-4"></i>
            <h3 className="text-xl font-semibold text-[#543310] mb-2 playfair-heading">No Orders Yet</h3>
            <p className="text-[#74512D] poppins-body mb-6">You haven't placed any orders yet.</p>
            <Link
              to="/products"
              className="inline-flex items-center px-6 py-3 bg-[#543310] hover:bg-[#74512D] text-white rounded-lg transition-all duration-300 poppins-body"
            >
              <i className="fa-solid fa-bag-shopping mr-2"></i>
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl shadow-lg border border-[#AF8F6F]/20 p-6 hover:shadow-xl transition-all duration-300">
                {/* Order Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-[#543310] playfair-heading">
                      Order #{order.id.slice(-8).toUpperCase()}
                    </h3>
                    <p className="text-[#74512D] poppins-body text-sm">
                      {formatDate(order.date)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(order.status)}`}>
                      <i className={`${getStatusIcon(order.status)} text-xs`}></i>
                      <span>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                    </span>
                    <span className="text-lg font-bold text-[#543310] mt-2 playfair-heading">
                      ₹{order.total.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="border-t border-[#AF8F6F]/20 pt-4">
                  <h4 className="text-sm font-semibold text-[#543310] mb-3 playfair-heading">Items</h4>
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div>
                          <span className="text-[#543310] font-medium poppins-body">{item.name}</span>
                          <p className="text-[#74512D] text-sm poppins-body">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-semibold text-[#543310] poppins-body">
                        ₹{(parseInt(item.price.replace('₹', '')) * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Shipping Address */}
                <div className="border-t border-[#AF8F6F]/20 pt-4 mt-4">
                  <h4 className="text-sm font-semibold text-[#543310] mb-2 playfair-heading">Shipping Address</h4>
                  <p className="text-[#74512D] text-sm poppins-body">
                    {order.shippingAddress.fullName}<br />
                    {order.shippingAddress.address}<br />
                    {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}<br />
                    {order.shippingAddress.country}<br />
                    📞 {order.shippingAddress.phone}
                  </p>
                </div>

                {/* Payment Method */}
                <div className="border-t border-[#AF8F6F]/20 pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-[#543310] playfair-heading">Payment Method</span>
                    <span className="text-[#74512D] text-sm poppins-body capitalize">
                      {order.paymentMethod === 'card' ? 'Credit/Debit Card' : 
                       order.paymentMethod === 'upi' ? 'UPI' : 
                       order.paymentMethod}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm font-semibold text-[#543310] playfair-heading">Payment Status</span>
                    <span className="text-green-600 text-sm poppins-body font-medium">
                      {order.paymentStatus === 'completed' ? 'Paid' : order.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Back to Home */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <Link
          to="/home"
          className="inline-flex items-center text-[#543310] hover:text-[#74512D] transition-colors duration-200 poppins-body"
        >
          <i className="fa-solid fa-arrow-left mr-2"></i>
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default MyOrders;