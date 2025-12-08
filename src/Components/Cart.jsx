import React from "react";
import { useCart } from "../Context/CartContext";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";

const Cart = ({ isOpen, onClose }) => {
  const { cart, updateQuantity, removeFromCart, getCartTotal, clearCart } =
    useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // const handleCheckout = () => {
  //   if (!user) {
  //     alert('Please login to proceed to checkout');
  //     return;
  //   }
  //   onClose();
  //   navigate('/payment');a
  // };

  const handleCheckout = () => {
    if (!user) {
      toast.error("Please login to proceed to checkout");
      return;
    }
    if (cart.items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    onClose();
    navigate("/payment");
  };

  const handleContinueShopping = () => {
    onClose();
    if (!user) {
      navigate("/login");
    }
  };

  const handleOverlayClick = (e) => {
    if(e.target === e.currentTarget){
      onClose();
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end"
    onClick={handleOverlayClick}
    >
      <div className="bg-white w-full max-w-md h-full overflow-y-auto">
        {/* Header */}
        <div className="bg-[#543310] text-white p-6 sticky top-0">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold playfair-heading">Your Cart</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl transition-colors"
            >
              ✕
            </button>
          </div>
          <p className="text-[#AF8F6F] mt-2 poppins-body">
            {cart.items.length} items in cart
            {!user && " (Login required)"}
          </p>
        </div>

        {/* Cart Items */}
        <div className="p-6">
          {cart.items.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🛒</div>
              <p className="text-[#74512D] text-lg poppins-body">
                {user
                  ? "Your cart is empty"
                  : "Please login to add items to cart"}
              </p>
              <button
                onClick={handleContinueShopping}
                className="mt-4 bg-[#74512D] hover:bg-[#543310] text-white px-6 py-2 rounded-lg transition-colors poppins-body"
              >
                {user ? "Continue Shopping" : "Go to Login"}
              </button>
            </div>
          ) : (
            <>
              {/* Cart Items List */}
              <div className="space-y-4 mb-8">
                {cart.items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#F8F4E1] rounded-xl p-4 flex gap-4"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#543310] playfair-heading">
                        {item.name}
                      </h3>
                      <p className="text-[#74512D] font-bold poppins-body">
                        {item.price}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 mt-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-[#543310] hover:bg-gray-100 transition-colors"
                        >
                          -
                        </button>
                        <span className="font-semibold poppins-body">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-[#543310] hover:bg-gray-100 transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 transition-colors h-fit"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>

              {/* Cart Summary */}
              <div className="border-t border-[#AF8F6F] pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold text-[#543310] playfair-heading">
                    Total:
                  </span>
                  <span className="text-2xl font-bold text-[#543310] playfair-heading">
                    ₹{getCartTotal().toLocaleString()}
                  </span>
                </div>

                {/* Login reminder if not logged in */}
                {!user && (
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-yellow-800 text-sm poppins-body">
                      Please login to proceed with checkout
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleCheckout}
                    disabled={!user}
                    className={`w-full py-3 rounded-xl font-semibold transition-colors poppins-body ${
                      user
                        ? "bg-[#543310] hover:bg-[#74512D] text-white"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {user ? "Proceed to Checkout" : "Login Required"}
                  </button>
                  <button
                    onClick={clearCart}
                    className="w-full bg-transparent border border-[#543310] text-[#543310] hover:bg-[#543310] hover:text-white py-3 rounded-xl font-semibold transition-colors poppins-body"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
