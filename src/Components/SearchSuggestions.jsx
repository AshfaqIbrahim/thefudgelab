import React, { useState, useEffect } from "react";
import { api } from "../Api/Axios";
import { Link } from "react-router-dom";

const SearchSuggestions = ({ query, onSelect }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.length >= 2) {
      fetchSuggestions(query);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const fetchSuggestions = async (query) => {
    setLoading(true);
    try {
      const response = await api.get(`/products?q=${query}`);
      setSuggestions(response.data.slice(0, 5)); // Limit to 5 suggestions
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  if (!query || query.length < 2 || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-[#AF8F6F] z-50 max-h-80 overflow-y-auto">
      {loading ? (
        <div className="p-4 text-center text-[#543310]">
          <i className="fa-solid fa-spinner fa-spin mr-2"></i>
          Searching...
        </div>
      ) : (
        <>
          <div className="p-2">
            <p className="text-xs text-[#AF8F6F] font-semibold px-2 py-1">
              PRODUCTS ({suggestions.length})
            </p>
            {suggestions.map((product) => (
              <Link
                key={product.id}
                to={`/search?q=${encodeURIComponent(product.name)}`}
                onClick={() => onSelect(product.name)}
                className="flex items-center p-2 hover:bg-[#F8F4E1] rounded transition-colors cursor-pointer"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-10 h-10 rounded object-cover mr-3"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#543310]">
                    {product.name}
                  </p>
                  <p className="text-xs text-[#74512D] truncate">
                    {product.description.substring(0, 50)}...
                  </p>
                </div>
                <span className="text-sm font-bold text-[#543310]">
                  {product.price}
                </span>
              </Link>
            ))}
          </div>
          <div className="border-t border-[#F8F4E1] p-2">
            <Link
              to={`/search?q=${encodeURIComponent(query)}`}
              onClick={() => onSelect(query)}
              className="flex items-center justify-center text-[#543310] hover:text-[#74512D] font-medium p-2"
            >
              <i className="fa-solid fa-magnifying-glass mr-2"></i>
              View all results for "{query}"
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default SearchSuggestions;