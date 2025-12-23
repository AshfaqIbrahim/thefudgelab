import React, { useState } from "react";
import { useCart } from "../Context/CartContext";
import { useAuth } from "../Context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, getCartTotal, clearCart } =
    useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      toast.error("Please login to proceed to checkout");
      navigate("/login");
      return;
    }
    if (cart.items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    navigate("/payment");
  };

  const handleContinueShopping = () => {
    navigate("/products");
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8] py-8">
      {/* Header with Back Button */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#543310] playfair-heading">
              Shopping Cart
            </h1>
            <p className="text-[#74512D] mt-2 poppins-body">
              {cart.items.length} items in cart
            </p>
          </div>
          <Link
            to="/products"
            className="text-[#543310] hover:text-[#74512D] transition-colors duration-200 flex items-center gap-2"
          >
            <i className="fa-solid fa-arrow-left"></i>
            Continue Shopping
          </Link>
        </div>

        {cart.items.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl shadow-sm">
            <div className="text-6xl mb-6">🛒</div>
            <h2 className="text-2xl font-bold text-[#543310] mb-4 playfair-heading">
              Your cart is empty
            </h2>
            <p className="text-[#74512D] mb-8 max-w-md mx-auto">
              Looks like you haven't added any delicious brownies to your cart
              yet.
            </p>
            <button
              onClick={handleContinueShopping}
              className="bg-[#543310] hover:bg-[#74512D] text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg"
            >
              Browse Our Brownies
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-[#543310] mb-6 playfair-heading">
                  Cart Items
                </h2>
                <div className="space-y-4">
                  {cart.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-4 border border-[#F8F4E1] rounded-xl hover:border-[#AF8F6F] transition-colors"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-semibold text-[#543310] playfair-heading">
                              {item.name}
                            </h3>
                            <p className="text-[#74512D] text-sm poppins-body mt-1">
                              {item.description?.substring(0, 60)}...
                            </p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700 transition-colors h-fit"
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </div>

                        <div className="flex justify-between items-center mt-4">
                          <span className="text-lg font-bold text-[#543310]">
                            {item.price}
                          </span>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="w-10 h-10 bg-[#F8F4E1] hover:bg-[#AF8F6F] text-[#543310] rounded-lg flex items-center justify-center transition-all duration-300"
                            >
                              -
                            </button>
                            <span className="font-semibold text-[#543310] w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="w-10 h-10 bg-[#F8F4E1] hover:bg-[#AF8F6F] text-[#543310] rounded-lg flex items-center justify-center transition-all duration-300"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Clear Cart Button */}
                <div className="mt-6 pt-6 border-t border-[#F8F4E1]">
                  <button
                    onClick={clearCart}
                    className="text-[#543310] hover:text-red-600 transition-colors flex items-center gap-2 poppins-body"
                  >
                    <i className="fa-solid fa-trash"></i>
                    Clear Entire Cart
                  </button>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl shadow-sm p-6 sticky top-6">
                <h2 className="text-xl font-bold text-[#543310] mb-6 playfair-heading">
                  Order Summary
                </h2>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-[#74512D]">Subtotal</span>
                    <span className="font-semibold text-[#543310]">
                      ₹{getCartTotal().toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#74512D]">Shipping</span>
                    <span className="font-semibold text-[#543310]">FREE</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#74512D]">Tax</span>
                    <span className="font-semibold text-[#543310]">
                      ₹{(getCartTotal() * 0.05).toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t border-[#AF8F6F] pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-[#543310]">
                        Total
                      </span>
                      <span className="text-2xl font-bold text-[#543310]">
                        ₹{(getCartTotal() * 1.05).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Login reminder if not logged in */}
                {!user && (
                  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <i className="fa-solid fa-info-circle text-yellow-600 mt-1"></i>
                      <div>
                        <p className="text-yellow-800 font-medium">
                          Login Required
                        </p>
                        <p className="text-yellow-700 text-sm mt-1">
                          Please login to proceed with checkout
                        </p>
                        <Link
                          to="/login"
                          className="inline-block mt-2 text-yellow-800 font-medium hover:text-yellow-900"
                        >
                          Go to Login →
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-8 space-y-3">
                  <button
                    onClick={handleCheckout}
                    className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 ${
                      user
                        ? "bg-[#543310] hover:bg-[#74512D] text-white hover:shadow-lg"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {user ? "Proceed to Checkout" : "Login to Checkout"}
                  </button>

                  <Link
                    to="/products"
                    className="block w-full bg-transparent border border-[#543310] text-[#543310] hover:bg-[#543310] hover:text-white py-4 rounded-xl font-semibold transition-all duration-300 text-center"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
