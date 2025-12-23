import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { api } from "../Api/Axios";
import { useCart } from "../Context/CartContext";

const SearchPage = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noResults, setNoResults] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get search query from URL
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("q") || "";

  useEffect(() => {
    if (searchQuery.trim()) {
      performSearch(searchQuery);
    } else {
      navigate("/products");
    }
  }, [searchQuery, navigate]);

  const performSearch = async (query) => {
    setLoading(true);
    setNoResults(false);
    
    try {
      // Using JSON Server's built-in search
      const response = await api.get(`/products?q=${encodeURIComponent(query)}`);
      
      // If no results from JSON Server search, try client-side filtering
      if (response.data.length === 0) {
        // Get all products and filter client-side
        const allProductsResponse = await api.get("/products");
        const filtered = allProductsResponse.data.filter(product => 
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.description.toLowerCase().includes(query.toLowerCase()) ||
          (product.category && product.category.toLowerCase().includes(query.toLowerCase())) ||
          (product.tag && product.tag.toLowerCase().includes(query.toLowerCase())) ||
          (product.ingredients && product.ingredients.some(ingredient => 
            ingredient.toLowerCase().includes(query.toLowerCase())
          ))
        );
        setSearchResults(filtered);
        setNoResults(filtered.length === 0);
      } else {
        setSearchResults(response.data);
        setNoResults(false);
      }
    } catch (error) {
      console.error("Search error:", error);
      // Fallback to client-side search if API fails
      try {
        const allProducts = await api.get("/products");
        const filtered = allProducts.data.filter(product => 
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.description.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(filtered);
        setNoResults(filtered.length === 0);
      } catch (fallbackError) {
        console.error("Fallback search error:", fallbackError);
        setSearchResults([]);
        setNoResults(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const openProductDetails = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
    document.body.style.overflow = "hidden";
  };

  const closeProductDetails = () => {
    setSelectedProduct(null);
    document.body.style.overflow = "unset";
  };

  const handleQuantityChange = (change) => {
    setQuantity((prev) => Math.max(1, prev + change));
  };

  const handleAddToCart = () => {
    if (selectedProduct) {
      addToCart(selectedProduct, quantity);
      closeProductDetails();
      alert(`${quantity} ${selectedProduct.name} added to cart!`);
    }
  };

  const highlightText = (text, query) => {
    if (!query || !text) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 text-[#543310] font-semibold">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#543310] mb-2 playfair-heading">
                Search Results
              </h1>
              <p className="text-[#74512D]">
                {searchQuery && (
                  <>
                    Showing results for: <span className="font-semibold">"{searchQuery}"</span>
                  </>
                )}
              </p>
            </div>
            <Link
              to="/products"
              className="text-[#543310] hover:text-[#74512D] transition-colors duration-200"
            >
              <i className="fa-solid fa-arrow-left mr-2"></i>
              Back to all products
            </Link>
          </div>
        </div>

        {/* Results Count */}
        {!loading && !noResults && (
          <div className="mb-6">
            <p className="text-[#543310] font-medium">
              Found {searchResults.length} product{searchResults.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#AF8F6F] mx-auto"></div>
            <p className="mt-4 text-[#543310]">Searching for delicious brownies...</p>
          </div>
        )}

        {/* No Results */}
        {!loading && noResults && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4 text-[#AF8F6F]">
              <i className="fa-solid fa-magnifying-glass"></i>
            </div>
            <h3 className="text-2xl font-bold text-[#543310] mb-2">
              No results found
            </h3>
            <p className="text-[#74512D] mb-6">
              We couldn't find any products matching "{searchQuery}"
            </p>
            <div className="space-y-4 max-w-md mx-auto">
              <p className="text-[#543310] font-medium">Suggestions:</p>
              <ul className="text-[#74512D] space-y-2 text-left">
                <li className="flex items-center">
                  <i className="fa-solid fa-check text-[#AF8F6F] mr-2"></i>
                  Check your spelling
                </li>
                <li className="flex items-center">
                  <i className="fa-solid fa-check text-[#AF8F6F] mr-2"></i>
                  Try different keywords
                </li>
                <li className="flex items-center">
                  <i className="fa-solid fa-check text-[#AF8F6F] mr-2"></i>
                  Browse all products instead
                </li>
              </ul>
              <Link
                to="/products"
                className="inline-block mt-6 bg-[#543310] hover:bg-[#74512D] text-white px-6 py-3 rounded-xl transition-all duration-300 font-semibold"
              >
                View All Products
              </Link>
            </div>
          </div>
        )}

        {/* Results Grid */}
        {!loading && !noResults && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-[#AF8F6F]/20 cursor-pointer"
                onClick={() => openProductDetails(product)}
              >
                {/* Product Image */}
                <div className="h-56 bg-gray-100 relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    onError={(e) => {
                      e.target.src = "/images/placeholder-brownie.jpg";
                    }}
                  />
                  {product.tag && (
                    <div className="absolute top-3 left-3 bg-[#543310]/90 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {product.tag}
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-[#543310] mb-2 line-clamp-1">
                    {highlightText(product.name, searchQuery)}
                  </h3>
                  <p className="text-sm text-[#74512D] mb-3 line-clamp-2">
                    {highlightText(product.description, searchQuery)}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-[#543310]">
                      {product.price}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openProductDetails(product);
                      }}
                      className="bg-[#543310] hover:bg-[#74512D] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Popular Searches */}
        {!loading && searchResults.length > 0 && (
          <div className="mt-12 pt-8 border-t border-[#F8F4E1]">
            <h3 className="text-lg font-semibold text-[#543310] mb-4">
              Popular Searches
            </h3>
            <div className="flex flex-wrap gap-2">
              {["Nutella", "Brownie", "Cheesecake", "Best Seller", "New", "Kunafa"].map((term) => (
                <button
                  key={term}
                  onClick={() => navigate(`/search?q=${term}`)}
                  className="px-4 py-2 bg-[#F8F4E1] hover:bg-[#AF8F6F] text-[#543310] hover:text-white rounded-full text-sm font-medium transition-colors duration-200"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Product Details Modal (Same as AllProducts) */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div
            className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Product Image */}
              <div className="relative">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-96 lg:h-full object-cover rounded-t-3xl lg:rounded-l-3xl lg:rounded-tr-none"
                />
                <div className="absolute top-4 left-4 bg-[#543310]/90 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {selectedProduct.tag}
                </div>
                <button
                  onClick={closeProductDetails}
                  className="absolute top-4 right-4 bg-white/90 hover:bg-white text-[#543310] w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  ✕
                </button>
              </div>

              {/* Product Details */}
              <div className="p-8">
                <h2 className="text-3xl font-bold text-[#543310] mb-4 playfair-heading">
                  {selectedProduct.name}
                </h2>
                <p className="text-2xl font-bold text-[#74512D] mb-6">
                  {selectedProduct.price}
                </p>

                <div className="space-y-6">
                  {/* Description */}
                  <div>
                    <h3 className="text-lg font-semibold text-[#543310] mb-2">
                      Description
                    </h3>
                    <p className="text-[#74512D] leading-relaxed">
                      {selectedProduct.description}
                    </p>
                  </div>

                  {/* Ingredients */}
                  {selectedProduct.ingredients && (
                    <div>
                      <h3 className="text-lg font-semibold text-[#543310] mb-2">
                        Ingredients
                      </h3>
                      <ul className="text-[#74512D] list-disc list-inside space-y-1">
                        {selectedProduct.ingredients.map((ingredient, index) => (
                          <li key={index}>{ingredient}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Product Info */}
                  <div className="grid grid-cols-2 gap-4">
                    {selectedProduct.weight && (
                      <div>
                        <h4 className="text-sm font-semibold text-[#543310]">
                          Weight
                        </h4>
                        <p className="text-[#74512D]">{selectedProduct.weight}</p>
                      </div>
                    )}
                    {selectedProduct.servings && (
                      <div>
                        <h4 className="text-sm font-semibold text-[#543310]">
                          Servings
                        </h4>
                        <p className="text-[#74512D]">{selectedProduct.servings}</p>
                      </div>
                    )}
                  </div>

                  {/* Allergens */}
                  {selectedProduct.allergens && (
                    <div>
                      <h4 className="text-sm font-semibold text-[#543310]">
                        Allergens
                      </h4>
                      <p className="text-[#74512D] text-sm">
                        {selectedProduct.allergens}
                      </p>
                    </div>
                  )}

                  {/* Quantity Selector */}
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-semibold text-[#543310]">
                      Quantity:
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleQuantityChange(-1)}
                        className="w-10 h-10 bg-[#F8F4E1] hover:bg-[#AF8F6F] text-[#543310] rounded-lg flex items-center justify-center transition-all duration-300"
                      >
                        -
                      </button>
                      <span className="text-xl font-bold text-[#543310] w-8 text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(1)}
                        className="w-10 h-10 bg-[#F8F4E1] hover:bg-[#AF8F6F] text-[#543310] rounded-lg flex items-center justify-center transition-all duration-300"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 bg-[#543310] hover:bg-[#74512D] text-white py-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg"
                    >
                      Add to Cart - {selectedProduct.price} × {quantity}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;