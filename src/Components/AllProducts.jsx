import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../Context/CartContext";
import axios from "axios";
import { faLeaf } from "@fortawesome/free-solid-svg-icons";
import { api } from "../Api/Axios";
import Menu from "./Menu";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { addToCart, getCartItemsCount } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/products")
      .then((res) => {
        setProducts(res.data);
        setFilteredProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log("Error fetching products", err);
        setLoading(false);
      });
  }, []);

  // Filter products based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product) => {
        const query = searchQuery.toLowerCase();
        return (
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          (product.tag && product.tag.toLowerCase().includes(query)) ||
          (product.category &&
            product.category.toLowerCase().includes(query)) ||
          (product.ingredients &&
            product.ingredients.some((ingredient) =>
              ingredient.toLowerCase().includes(query)
            ))
        );
      });
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFDF8] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#AF8F6F] mx-auto"></div>
          <p className="mt-4 text-[#543310]">Loading delicious brownies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF8] py-8 relative">
      {/* Menu Icon - Top Right */}
      <button
        onClick={() => setIsMenuOpen(true)}
        className="absolute top-6 right-6 text-[#543310] hover:text-[#74512D] transition-colors duration-200 z-10"
      >
        <i className="fa-solid fa-bars text-2xl"></i>
      </button>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Search */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-[#543310] mb-4 playfair-heading">
              Premium Brownie Collection
            </h1>
            <p className="text-lg text-[#74512D] max-w-2xl mx-auto">
              Indulge in our artisanal brownies, each with a unique personality
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Search brownies, flavors, ingredients..."
                  className="w-full px-6 py-3 pl-12 pr-12 rounded-full border border-[#AF8F6F] focus:outline-none focus:ring-2 focus:ring-[#543310] focus:border-transparent text-[#543310] placeholder-[#AF8F6F] bg-[#F8F4E1] shadow-sm transition-all duration-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#AF8F6F] hover:text-[#543310] transition-colors"
                >
                  <i className="fa-solid fa-magnifying-glass"></i>
                </button>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#AF8F6F] hover:text-[#543310] transition-colors"
                  >
                    <i className="fa-solid fa-times"></i>
                  </button>
                )}
              </form>

              {/* Search Results Count */}
              {searchQuery && (
                <div className="mt-3 text-center">
                  <p className="text-[#543310]">
                    Found {filteredProducts.length} product
                    {filteredProducts.length !== 1 ? "s" : ""}
                    {searchQuery && ` for "${searchQuery}"`}
                  </p>
                  <button
                    onClick={clearSearch}
                    className="text-sm text-[#AF8F6F] hover:text-[#543310] mt-1 transition-colors"
                  >
                    Clear search
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <p className="text-[#543310]">
              {searchQuery
                ? `Search results: ${filteredProducts.length} product${
                    filteredProducts.length !== 1 ? "s" : ""
                  }`
                : `Showing all ${products.length} products`}
            </p>
            {!searchQuery && (
              <Link
                to="/home"
                className="text-[#543310] hover:text-[#74512D] transition-colors duration-200 flex items-center gap-2"
              >
                <i className="fa-solid fa-arrow-left"></i>
                Back to Home
              </Link>
            )}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4 text-[#AF8F6F]">
                <i className="fa-solid fa-magnifying-glass"></i>
              </div>
              <h3 className="text-2xl font-bold text-[#543310] mb-2">
                No products found
              </h3>
              <p className="text-[#74512D] mb-6">
                We couldn't find any products matching "{searchQuery}"
              </p>
              <button
                onClick={clearSearch}
                className="bg-[#543310] hover:bg-[#74512D] text-white px-6 py-3 rounded-xl transition-all duration-300 font-semibold"
              >
                View All Products
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-3xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-[#AF8F6F]/20 cursor-pointer"
                  onClick={() => openProductDetails(product)}
                >
                  {/* Product Image */}
                  <div className="h-64 bg-gray-200 relative overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                      onError={(e) => {
                        e.target.src = "/images/placeholder-brownie.jpg";
                      }}
                    />
                    <div className="absolute top-4 left-4 bg-[#543310]/90 text-white px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm">
                      {product.tag}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[#543310] mb-2 playfair-heading">
                      {product.name}
                    </h3>
                    <p className="text-sm text-[#74512D] mb-3 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex justify-between items-center mb-4">
                      <span className="text-2xl font-bold text-[#543310]">
                        {product.price}
                      </span>
                      <div className="text-xs text-[#AF8F6F] font-medium">
                        <div>{product.weight}</div>
                        <div>{product.servings}</div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openProductDetails(product);
                      }}
                      className="w-full bg-[#543310] hover:bg-[#74512D] text-white py-3 rounded-xl transition-all duration-300 font-semibold hover:shadow-lg"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Product Details Modal */}
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

                  {/* Product Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-semibold text-[#543310]">
                        Weight
                      </h4>
                      <p className="text-[#74512D]">{selectedProduct.weight}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[#543310]">
                        Servings
                      </h4>
                      <p className="text-[#74512D]">
                        {selectedProduct.servings}
                      </p>
                    </div>
                  </div>

                  {/* Allergens */}
                  <div>
                    <h4 className="text-sm font-semibold text-[#543310]">
                      Allergens
                    </h4>
                    <p className="text-[#74512D] text-sm">
                      {selectedProduct.allergens}
                    </p>
                  </div>

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

      {/* Menu Component */}
      <Menu isOpen={isMenuOpen} onClose={closeMenu} />
    </div>
  );
};

export default AllProducts;
