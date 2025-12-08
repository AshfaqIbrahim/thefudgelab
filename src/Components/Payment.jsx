import React, { useState } from 'react';
import { useCart } from "../Context/CartContext";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { api } from '../Api/Axios';

const Payment = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.fname ? `${user.fname} ${user.lname || ''}` : '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    phone: user?.profile?.phone || ''
  });

  // Calculate totals with COD fee
  const subTotal = getCartTotal();
  const tax = subTotal * 0.05;
  const codFee = paymentMethod === 'cod' ? 20 : 0;
  const total = subTotal + tax + codFee;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setShippingAddress({
      fullName: address.fullName,
      address: address.address,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      country: address.country || 'India',
      phone: address.phone
    });
  };

  const handlePayment = async () => {
    // Validate shipping address
    if (!shippingAddress.fullName || !shippingAddress.address || 
        !shippingAddress.city || !shippingAddress.state || 
        !shippingAddress.pincode || !shippingAddress.phone) {
      toast.error('Please fill all shipping address fields');
      return;
    }

    if (shippingAddress.phone.length !== 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    setIsProcessing(true);

    try {
      // Create order object with COD fee
      const order = {
        id: `ORD${Date.now()}`,
        userId: user.id,
        date: new Date().toISOString(),
        items: cart.items,
        subtotal: subTotal,
        tax: tax,
        codFee: codFee, // Add COD fee
        total: total, // Use total with COD fee
        status: 'confirmed',
        shippingAddress: shippingAddress,
        paymentMethod: paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'completed',
        updatedAt: new Date().toISOString()
      };

      // Get current user data from database
      const userResponse = await api.get(`/users/${user.id}`);
      const currentUser = userResponse.data;
      
      // Create updated user with new order
      const updatedUser = {
        ...currentUser,
        orders: [...(currentUser.orders || []), order]
      };
      
      // Update user in database
      await api.put(`/users/${user.id}`, updatedUser);
      
      // Also save to localStorage for backup
      const existingOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
      const updatedOrders = [order, ...existingOrders];
      localStorage.setItem('userOrders', JSON.stringify(updatedOrders));

      // Clear cart
      clearCart();
      
      // Show success message
      toast.success('Order placed successfully!');
      
      // Redirect to orders page after delay
      setTimeout(() => {
        navigate('/my-orders');
      }, 2000);

    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F8F4E1] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#543310] mb-4">Please Login</h2>
          <p className="text-[#74512D] mb-6">You need to be logged in to proceed with payment.</p>
          <button 
            onClick={() => navigate('/login')}
            className="bg-[#543310] text-white px-6 py-3 rounded-lg hover:bg-[#74512D] transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8F4E1] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#543310] mb-4">Your cart is empty</h2>
          <p className="text-[#74512D] mb-6">Add some delicious brownies to your cart first!</p>
          <button 
            onClick={() => navigate('/products')}
            className="bg-[#543310] text-white px-6 py-3 rounded-lg hover:bg-[#74512D] transition-colors"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F4E1] py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#543310] mb-2 playfair-heading">Checkout</h1>
          <p className="text-[#74512D] poppins-body">Complete your order</p>
        </div>

        {/* Shipping Address Section - TOP */}
        <div className="bg-white rounded-2xl shadow-lg border border-[#AF8F6F]/20 p-6 mb-8">
          <h2 className="text-xl font-bold text-[#543310] mb-4 playfair-heading">
            Shipping Address
          </h2>
          
          {/* Saved Addresses Selection */}
          {user.profile?.addresses && user.profile.addresses.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-[#543310] mb-3 playfair-heading">Choose from saved addresses</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {user.profile.addresses.map((address) => (
                  <div
                    key={address.id}
                    onClick={() => handleAddressSelect(address)}
                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                      selectedAddress?.id === address.id
                        ? 'border-[#543310] bg-[#F8F4E1]'
                        : 'border-[#AF8F6F]/50 hover:border-[#74512D]'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="font-semibold text-[#543310] poppins-body">{address.fullName}</span>
                        <span className="text-xs bg-[#AF8F6F] text-white px-2 py-1 rounded ml-2 capitalize poppins-body">
                          {address.addressType}
                        </span>
                        {address.isDefault && (
                          <span className="text-xs bg-[#543310] text-white px-2 py-1 rounded ml-1 poppins-body">
                            Default
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-[#74512D] text-sm poppins-body">
                      {address.address}, {address.city}, {address.state} - {address.pincode}
                    </p>
                    <p className="text-[#74512D] text-sm poppins-body">📞 {address.phone}</p>
                  </div>
                ))}
              </div>
              <div className="text-center mt-3">
                <button
                  onClick={() => {
                    setSelectedAddress(null);
                    setShippingAddress({
                      fullName: user?.fname ? `${user.fname} ${user.lname || ''}` : '',
                      address: '',
                      city: '',
                      state: '',
                      pincode: '',
                      country: 'India',
                      phone: user.profile?.phone || ''
                    });
                  }}
                  className="text-[#543310] hover:text-[#74512D] text-sm poppins-body underline"
                >
                  Use new address
                </button>
              </div>
            </div>
          )}

          {/* Address Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#543310] mb-2 poppins-body">
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                value={shippingAddress.fullName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white border border-[#AF8F6F]/50 rounded-xl text-[#543310] placeholder-[#AF8F6F] focus:outline-none focus:ring-2 focus:ring-[#AF8F6F]/30 focus:border-[#74512D] transition-all poppins-body"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#543310] mb-2 poppins-body">
                Address *
              </label>
              <input
                type="text"
                name="address"
                value={shippingAddress.address}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white border border-[#AF8F6F]/50 rounded-xl text-[#543310] placeholder-[#AF8F6F] focus:outline-none focus:ring-2 focus:ring-[#AF8F6F]/30 focus:border-[#74512D] transition-all poppins-body"
                placeholder="Street address"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#543310] mb-2 poppins-body">
                City *
              </label>
              <input
                type="text"
                name="city"
                value={shippingAddress.city}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white border border-[#AF8F6F]/50 rounded-xl text-[#543310] placeholder-[#AF8F6F] focus:outline-none focus:ring-2 focus:ring-[#AF8F6F]/30 focus:border-[#74512D] transition-all poppins-body"
                placeholder="City"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#543310] mb-2 poppins-body">
                State *
              </label>
              <input
                type="text"
                name="state"
                value={shippingAddress.state}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white border border-[#AF8F6F]/50 rounded-xl text-[#543310] placeholder-[#AF8F6F] focus:outline-none focus:ring-2 focus:ring-[#AF8F6F]/30 focus:border-[#74512D] transition-all poppins-body"
                placeholder="State"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#543310] mb-2 poppins-body">
                PIN Code *
              </label>
              <input
                type="text"
                name="pincode"
                value={shippingAddress.pincode}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white border border-[#AF8F6F]/50 rounded-xl text-[#543310] placeholder-[#AF8F6F] focus:outline-none focus:ring-2 focus:ring-[#AF8F6F]/30 focus:border-[#74512D] transition-all poppins-body"
                placeholder="PIN Code"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#543310] mb-2 poppins-body">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={shippingAddress.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white border border-[#AF8F6F]/50 rounded-xl text-[#543310] placeholder-[#AF8F6F] focus:outline-none focus:ring-2 focus:ring-[#AF8F6F]/30 focus:border-[#74512D] transition-all poppins-body"
                placeholder="10-digit phone number"
                maxLength="10"
                required
              />
            </div>
          </div>
        </div>

        {/* Bottom Section: Order Summary (Left) and Payment Methods (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Order Summary */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg border border-[#AF8F6F]/20 p-6 sticky top-6">
              <h2 className="text-xl font-bold text-[#543310] mb-4 playfair-heading">Order Summary</h2>
              
              {/* Order Items */}
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-2 border-b border-[#AF8F6F]/20">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div>
                        <span className="font-medium text-[#543310] text-sm poppins-body">{item.name}</span>
                        <p className="text-[#74512D] text-xs poppins-body">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-semibold text-[#543310] poppins-body">
                      ₹{(parseInt(item.price.replace('₹', '')) * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown - UPDATED WITH COD FEE */}
              <div className="space-y-2 border-t border-[#AF8F6F]/20 pt-4">
                <div className="flex justify-between text-[#74512D] poppins-body">
                  <span>Subtotal</span>
                  <span>₹{subTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#74512D] poppins-body">
                  <span>Shipping</span>
                  <span className="text-green-600">FREE</span>
                </div>
                <div className="flex justify-between text-[#74512D] poppins-body">
                  <span>Tax (5%)</span>
                  <span>₹{tax.toLocaleString()}</span>
                </div>
                
                {/* COD Fee - Conditionally shown */}
                {paymentMethod === 'cod' && (
                  <div className="flex justify-between text-[#74512D] poppins-body">
                    <span>COD Processing Fee</span>
                    <span>₹{codFee.toLocaleString()}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-lg font-bold text-[#543310] border-t border-[#AF8F6F]/20 pt-2 playfair-heading">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
                
                {/* COD Note */}
                {paymentMethod === 'cod' && (
                  <p className="text-xs text-[#AF8F6F] mt-2 poppins-body">
                    <i className="fa-solid fa-info-circle mr-1"></i>
                    ₹20 COD processing fee added
                  </p>
                )}
              </div>

              {/* Pay Button - Updated to show correct total */}
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className={`w-full mt-6 py-4 rounded-xl font-semibold transition-all duration-300 poppins-body ${
                  isProcessing
                    ? 'bg-[#AF8F6F] cursor-not-allowed'
                    : 'bg-[#543310] hover:bg-[#74512D] transform hover:scale-[1.02]'
                } text-white`}
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center">
                    <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                    Processing...
                  </span>
                ) : (
                  `Pay ₹${total.toLocaleString()}`
                )}
              </button>

              {/* Security Note */}
              <p className="text-center text-xs text-[#AF8F6F] mt-4 poppins-body">
                <i className="fa-solid fa-lock mr-1"></i>
                Your payment is secure and encrypted
              </p>
            </div>
          </div>

          {/* Right Column - Payment Method Section */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg border border-[#AF8F6F]/20 p-6">
              <h2 className="text-xl font-bold text-[#543310] mb-4 playfair-heading">
                Payment Method
              </h2>
              
              <div className="space-y-4">
                {/* Credit/Debit Card */}
                <div 
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                    paymentMethod === 'card' 
                      ? 'border-[#543310] bg-[#F8F4E1]' 
                      : 'border-[#AF8F6F]/50 hover:border-[#74512D]'
                  }`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === 'card' ? 'border-[#543310] bg-[#543310]' : 'border-[#AF8F6F]'
                      }`}>
                        {paymentMethod === 'card' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                      </div>
                      <span className="font-semibold text-[#543310] poppins-body">Credit/Debit Card</span>
                    </div>
                    <div className="flex space-x-2">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">Visa</span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">MasterCard</span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">Rupay</span>
                    </div>
                  </div>
                  
                  {paymentMethod === 'card' && (
                    <div className="mt-4 space-y-4">
                      <input
                        type="text"
                        placeholder="Card Number"
                        className="w-full px-4 py-3 bg-white border border-[#AF8F6F]/50 rounded-xl text-[#543310] placeholder-[#AF8F6F] focus:outline-none focus:ring-2 focus:ring-[#AF8F6F]/30 focus:border-[#74512D] transition-all poppins-body"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="px-4 py-3 bg-white border border-[#AF8F6F]/50 rounded-xl text-[#543310] placeholder-[#AF8F6F] focus:outline-none focus:ring-2 focus:ring-[#AF8F6F]/30 focus:border-[#74512D] transition-all poppins-body"
                        />
                        <input
                          type="text"
                          placeholder="CVV"
                          className="px-4 py-3 bg-white border border-[#AF8F6F]/50 rounded-xl text-[#543310] placeholder-[#AF8F6F] focus:outline-none focus:ring-2 focus:ring-[#AF8F6F]/30 focus:border-[#74512D] transition-all poppins-body"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Cardholder Name"
                        className="w-full px-4 py-3 bg-white border border-[#AF8F6F]/50 rounded-xl text-[#543310] placeholder-[#AF8F6F] focus:outline-none focus:ring-2 focus:ring-[#AF8F6F]/30 focus:border-[#74512D] transition-all poppins-body"
                      />
                    </div>
                  )}
                </div>

                {/* UPI */}
                <div 
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                    paymentMethod === 'upi' 
                      ? 'border-[#543310] bg-[#F8F4E1]' 
                      : 'border-[#AF8F6F]/50 hover:border-[#74512D]'
                  }`}
                  onClick={() => setPaymentMethod('upi')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === 'upi' ? 'border-[#543310] bg-[#543310]' : 'border-[#AF8F6F]'
                      }`}>
                        {paymentMethod === 'upi' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                      </div>
                      <span className="font-semibold text-[#543310] poppins-body">UPI</span>
                    </div>
                    <div className="flex space-x-2">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">GPay</span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">PhonePe</span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">Paytm</span>
                    </div>
                  </div>
                  
                  {paymentMethod === 'upi' && (
                    <div className="mt-4">
                      <input
                        type="text"
                        placeholder="UPI ID (e.g., yourname@okicici)"
                        className="w-full px-4 py-3 bg-white border border-[#AF8F6F]/50 rounded-xl text-[#543310] placeholder-[#AF8F6F] focus:outline-none focus:ring-2 focus:ring-[#AF8F6F]/30 focus:border-[#74512D] transition-all poppins-body"
                      />
                    </div>
                  )}
                </div>

                {/* Cash on Delivery - Updated with fee info */}
                <div 
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                    paymentMethod === 'cod' 
                      ? 'border-[#543310] bg-[#F8F4E1]' 
                      : 'border-[#AF8F6F]/50 hover:border-[#74512D]'
                  }`}
                  onClick={() => setPaymentMethod('cod')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === 'cod' ? 'border-[#543310] bg-[#543310]' : 'border-[#AF8F6F]'
                      }`}>
                        {paymentMethod === 'cod' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                      </div>
                      <div>
                        <span className="font-semibold text-[#543310] poppins-body">Cash on Delivery</span>
                        <p className="text-sm text-[#74512D] poppins-body">+ ₹20 processing fee</p>
                      </div>
                    </div>
                    
                  </div>
                  
                  {paymentMethod === 'cod' && (
                    <div className="mt-4">
                      <p className="text-sm text-[#74512D] poppins-body">
                        Pay with cash when your order is delivered. An additional ₹20 processing fee will be added to your total.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;