import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../Context/CartContext";
import Cart from "./Cart";
import Menu from "./Menu";
import { useAuth } from "../Context/AuthContext";
import { api } from "../Api/Axios";

const Navbar = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const { clearCart, getCartItemsCount } = useCart();
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const searchContainerRef = useRef(null);
  const debounceTimeoutRef = useRef(null);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logoutUser();
    setIsDropdownOpen(false);
    navigate("/login");
    clearCart();
  };

  // Fetch search suggestions with debouncing
  const fetchSearchSuggestions = async (query) => {
    if (query.trim().length < 2) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoadingSuggestions(true);
    try {
      // Try JSON Server's built-in search first
      const response = await api.get(`/products?q=${encodeURIComponent(query)}`);
      
      let suggestions = response.data;
      
      // If no results from built-in search, try client-side filtering
      if (suggestions.length === 0) {
        const allProductsResponse = await api.get("/products");
        const allProducts = allProductsResponse.data;
        
        suggestions = allProducts.filter(product => {
          const searchLower = query.toLowerCase();
          return (
            product.name.toLowerCase().includes(searchLower) ||
            product.description.toLowerCase().includes(searchLower) ||
            (product.tag && product.tag.toLowerCase().includes(searchLower)) ||
            (product.category && product.category.toLowerCase().includes(searchLower)) ||
            (product.ingredients && product.ingredients.some(ingredient => 
              ingredient.toLowerCase().includes(searchLower)
            ))
          );
        });
      }
      
      // Limit to 5 suggestions and prioritize exact matches
      const sortedSuggestions = suggestions
        .sort((a, b) => {
          const aNameMatch = a.name.toLowerCase().includes(query.toLowerCase());
          const bNameMatch = b.name.toLowerCase().includes(query.toLowerCase());
          if (aNameMatch && !bNameMatch) return -1;
          if (!aNameMatch && bNameMatch) return 1;
          return 0;
        })
        .slice(0, 5);
      
      setSearchSuggestions(sortedSuggestions);
      setShowSuggestions(sortedSuggestions.length > 0);
    } catch (error) {
      console.error("Error fetching search suggestions:", error);
      setSearchSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  // Debounced search input handler
  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Clear previous timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    // Set new timeout for debouncing
    debounceTimeoutRef.current = setTimeout(() => {
      fetchSearchSuggestions(value);
    }, 300);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setShowSearch(false);
      setShowSuggestions(false);
      setSearchSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    navigate(`/search?q=${encodeURIComponent(suggestion.name)}`);
    setSearchQuery("");
    setShowSearch(false);
    setShowSuggestions(false);
    setSearchSuggestions([]);
  };

  const handleViewAllResults = () => {
    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery("");
    setShowSearch(false);
    setShowSuggestions(false);
    setSearchSuggestions([]);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchSuggestions([]);
    setShowSuggestions(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close user dropdown
      if (isDropdownOpen && !event.target.closest('.user-dropdown')) {
        setIsDropdownOpen(false);
      }
      
      // Close search suggestions
      if (showSuggestions && searchContainerRef.current && 
          !searchContainerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [isDropdownOpen, showSuggestions]);

  // Highlight matching text in suggestions
  const highlightText = (text, query) => {
    if (!query || !text) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-100 text-[#543310] font-semibold px-0.5">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <>
      <nav className="bg-[#FFFDF8] shadow-md border-b border-[#AF8F6F] font-poppins sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="shrink-0">
              <Link
                to="/home"
                className="text-2xl font-bold text-[#543310] hover:text-[#74512D] transition-colors duration-200 "
              >
                thefudgelab
              </Link>
            </div>

            {/* Search Bar - Desktop (Visible by default) */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8" ref={searchContainerRef}>
              <div className="relative w-full">
                <form onSubmit={handleSearch} className="w-full">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search brownies, flavors, ingredients..."
                      className="w-full px-4 py-2 pl-10 pr-10 rounded-full border border-[#AF8F6F] focus:outline-none focus:ring-2 focus:ring-[#543310] focus:border-transparent text-[#543310] placeholder-[#AF8F6F] bg-[#F8F4E1] transition-all duration-200"
                      value={searchQuery}
                      onChange={handleSearchInputChange}
                      onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
                    />
                    <button
                      type="submit"
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#AF8F6F] hover:text-[#543310] transition-colors"
                    >
                      <i className="fa-solid fa-magnifying-glass"></i>
                    </button>
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={clearSearch}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#AF8F6F] hover:text-[#543310] transition-colors"
                      >
                        <i className="fa-solid fa-times"></i>
                      </button>
                    )}
                  </div>
                </form>

                {/* Search Suggestions Dropdown */}
                {showSuggestions && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-[#AF8F6F] z-50 max-h-96 overflow-y-auto">
                    {isLoadingSuggestions ? (
                      <div className="p-4 text-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#AF8F6F] mx-auto"></div>
                        <p className="text-sm text-[#543310] mt-2">Searching...</p>
                      </div>
                    ) : (
                      <>
                        <div className="p-2">
                          <p className="text-xs font-semibold text-[#AF8F6F] uppercase tracking-wider px-3 py-2">
                            Suggestions ({searchSuggestions.length})
                          </p>
                          {searchSuggestions.map((product) => (
                            <div
                              key={product.id}
                              onClick={() => handleSuggestionClick(product)}
                              className="flex items-center p-3 hover:bg-[#F8F4E1] rounded-lg transition-colors cursor-pointer group"
                            >
                              <div className="w-12 h-12 rounded-lg overflow-hidden mr-3 flex-shrink-0">
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                                  onError={(e) => {
                                    e.target.src = "/images/placeholder-brownie.jpg";
                                  }}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-[#543310] truncate">
                                  {highlightText(product.name, searchQuery)}
                                </p>
                                <p className="text-xs text-[#74512D] truncate">
                                  {highlightText(product.description.substring(0, 60), searchQuery)}
                                  {product.description.length > 60 ? "..." : ""}
                                </p>
                                <div className="flex items-center mt-1">
                                  {product.tag && (
                                    <span className="text-xs bg-[#543310]/10 text-[#543310] px-2 py-0.5 rounded-full mr-2">
                                      {product.tag}
                                    </span>
                                  )}
                                  <span className="text-xs font-semibold text-[#543310]">
                                    {product.price}
                                  </span>
                                </div>
                              </div>
                              <i className="fa-solid fa-chevron-right text-[#AF8F6F] group-hover:text-[#543310] ml-2"></i>
                            </div>
                          ))}
                        </div>
                        <div className="border-t border-[#F8F4E1] p-2">
                          <button
                            onClick={handleViewAllResults}
                            className="w-full flex items-center justify-center text-[#543310] hover:text-[#74512D] font-medium p-3 hover:bg-[#F8F4E1] rounded-lg transition-colors"
                          >
                            <i className="fa-solid fa-magnifying-glass mr-2"></i>
                            View all results for "{searchQuery}"
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex space-x-6 items-center">
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
                        <i className="fa-solid fa-arrow-right-from-bracket mr-2"></i>
                        Logout
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
              {/* Search Toggle Button - Mobile */}
              <button
                className="text-[#543310] hover:text-[#AF8F6F] transition-colors duration-200"
                onClick={() => setShowSearch(!showSearch)}
              >
                <i className="fa-solid fa-magnifying-glass text-lg"></i>
              </button>

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
                        <i className="fa-solid fa-arrow-right-from-bracket mr-2"></i>
                        Logout
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

          {/* Mobile Search Bar (Appears below navbar when toggled) */}
          {showSearch && (
            <div className="md:hidden py-3 border-t border-[#F8F4E1]" ref={searchContainerRef}>
              <div className="relative">
                <form onSubmit={handleSearch} className="w-full">
                  <input
                    type="text"
                    placeholder="Search brownies, flavors..."
                    className="w-full px-4 py-2 pl-10 pr-10 rounded-full border border-[#AF8F6F] focus:outline-none focus:ring-2 focus:ring-[#543310] focus:border-transparent text-[#543310] placeholder-[#AF8F6F] bg-[#F8F4E1]"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    autoFocus
                    onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
                  />
                  <button
                    type="submit"
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#AF8F6F] hover:text-[#543310] transition-colors"
                  >
                    <i className="fa-solid fa-magnifying-glass"></i>
                  </button>
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#AF8F6F] hover:text-[#543310] transition-colors"
                    >
                      <i className="fa-solid fa-times"></i>
                    </button>
                  )}
                </form>

                {/* Mobile Search Suggestions */}
                {showSuggestions && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-[#AF8F6F] z-50 max-h-64 overflow-y-auto">
                    {isLoadingSuggestions ? (
                      <div className="p-3 text-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#AF8F6F] mx-auto"></div>
                        <p className="text-xs text-[#543310] mt-1">Searching...</p>
                      </div>
                    ) : (
                      <>
                        <div className="p-1">
                          {searchSuggestions.map((product) => (
                            <div
                              key={product.id}
                              onClick={() => handleSuggestionClick(product)}
                              className="flex items-center p-2 hover:bg-[#F8F4E1] rounded transition-colors cursor-pointer"
                            >
                              <div className="w-10 h-10 rounded overflow-hidden mr-2 flex-shrink-0">
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-[#543310] truncate">
                                  {product.name}
                                </p>
                                <p className="text-xs text-[#74512D] truncate">
                                  {product.price}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="border-t border-[#F8F4E1] p-2">
                          <button
                            onClick={handleViewAllResults}
                            className="w-full text-center text-sm text-[#543310] hover:text-[#74512D] font-medium p-2"
                          >
                            View all results
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
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