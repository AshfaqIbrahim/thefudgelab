import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../Context/CartContext";
import Cart from "./Cart";
import Menu from "./Menu";
import { useAuth } from "../Context/AuthContext";

const Navbar = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { clearCart, getCartItemsCount } = useCart();
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logoutUser();
    setIsDropdownOpen(false);
    navigate("/login")
    clearCart();
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.user-dropdown')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <>
      <nav className="bg-[#FFFDF8] shadow-md border-b border-[#AF8F6F] font-poppins">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="shrink-0">
              <Link
                to="/home"
                className="text-2xl font-extrabold text-[#543310] hover:text-[#74512D] transition-colors duration-200 playfair-heading"
              >
                thefudgelab
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex space-x-8 items-center">
              {/* User Dropdown */}
              {user ? (
                <div className="relative user-dropdown">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="text-[#543310] hover:text-[#AF8F6F] transition-colors duration-200 font-bold text-lg"
                  >
                    <i className="fa-regular fa-user"></i>
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-[#AF8F6F] z-50 py-2">
                      <div className="px-4 py-2 border-b border-[#F8F4E1]">
                        <p className="font-semibold text-[#543310] text-sm">
                          {user.fname}
                        </p>
                        <p className="text-[#74512D] text-xs truncate">
                          {user.email}
                        </p>
                      </div>
                      
                      {/* Profile Link */}
                      <Link
                        to="/profile"
                        onClick={() => setIsDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-[#543310] hover:bg-[#F8F4E1] transition-colors poppins-body"
                      >
                        <i className="fa-solid fa-user mr-2"></i>My Profile
                      </Link>
                      
                      {/* My Orders Link */}
                      <Link
                        to="/my-orders"
                        onClick={() => setIsDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-[#543310] hover:bg-[#F8F4E1] transition-colors poppins-body"
                      >
                        <i className="fa-solid fa-receipt mr-2"></i>My Orders
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-[#543310] hover:bg-[#F8F4E1] transition-colors poppins-body"
                      >
                        <i className="fa-solid fa-arrow-right-from-bracket mr-2"></i>Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="text-[#543310] hover:text-[#AF8F6F] transition-colors duration-200 font-bold text-lg"
                >
                  <i className="fa-regular fa-user"></i>
                </Link>
              )}


              {/* Cart Icon */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="text-[#543310] hover:text-[#AF8F6F] transition-colors duration-200 font-bold text-lg relative"
              >
                <i className="fa-solid fa-basket-shopping"></i>
                {getCartItemsCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getCartItemsCount()}
                  </span>
                )}
              </button>

              {/* Menu Button - Desktop */}
              <button
                onClick={() => setIsMenuOpen(true)}
                className="text-[#543310] hover:text-[#AF8F6F] transition-colors duration-200 font-bold text-lg"
              >
                <i className="fa-solid fa-bars"></i>
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-4">
              {/* User Icon - Mobile */}
              {user ? (
                <div className="relative user-dropdown">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="text-[#543310] hover:text-[#AF8F6F] transition-colors duration-200 font-bold text-lg"
                  >
                    <i className="fa-regular fa-user"></i>
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-[#AF8F6F] z-50 py-2">
                      <div className="px-4 py-2 border-b border-[#F8F4E1]">
                        <p className="font-semibold text-[#543310] text-sm">
                          {user.fname}
                        </p>
                        <p className="text-[#74512D] text-xs truncate">
                          {user.email}
                        </p>
                      </div>
                      
                      {/* Profile Link */}
                      <Link
                        to="/profile"
                        onClick={() => setIsDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-[#543310] hover:bg-[#F8F4E1] transition-colors poppins-body"
                      >
                        <i className="fa-solid fa-user mr-2"></i>My Profile
                      </Link>
                      
                      {/* My Orders Link */}
                      <Link
                        to="/my-orders"
                        onClick={() => setIsDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-[#543310] hover:bg-[#F8F4E1] transition-colors poppins-body"
                      >
                        <i className="fa-solid fa-receipt mr-2"></i>My Orders
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-[#543310] hover:bg-[#F8F4E1] transition-colors poppins-body"
                      >
                        <i className="fa-solid fa-arrow-right-from-bracket mr-2"></i>Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="text-[#543310] hover:text-[#AF8F6F] transition-colors duration-200 font-bold text-lg"
                >
                  <i className="fa-regular fa-user"></i>
                </Link>
              )}

              {/* Cart Icon - Mobile */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="text-[#543310] hover:text-[#AF8F6F] transition-colors duration-200 font-bold text-lg relative"
              >
                <i className="fa-solid fa-basket-shopping"></i>
                {getCartItemsCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getCartItemsCount()}
                  </span>
                )}
              </button>

              <button
                onClick={() => setIsMenuOpen(true)}
                className="text-[#543310] hover:text-[#AF8F6F]"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Cart Component */}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Menu Component */}
      <Menu isOpen={isMenuOpen} onClose={closeMenu} />
    </>
  );
};

export default Navbar;