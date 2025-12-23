import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../Context/CartContext";

const Menu = ({ isOpen, onClose }) => {
  const { getCartItemsCount } = useCart();
  const cartItemsCount = getCartItemsCount();

  const menuItems = [
    { path: "/home", label: "Home", icon: "fa-solid fa-house" },
    { path: "/products", label: "Our Products", icon: "fa-solid fa-box" },
    { path: "/my-orders", label: "My Orders", icon: "fa-solid fa-receipt" },
    {
      path: "/cart",
      label: "My Cart",
      icon: "fa-solid fa-shopping-cart",
      badge: cartItemsCount > 0,
    },
    { path: "#contact", label: "Contact Us", icon: "fa-solid fa-envelope" },
  ];

  const handleMenuClick = (path) => {
    if (path === "#contact") {
      const footer = document.getElementById("footer");
      if (footer) {
        footer.scrollIntoView({ behavior: "smooth" });
      }
      onClose();
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${
        isOpen ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          isOpen ? "opacity-50" : "opacity-0"
        }`}
        onClick={onClose}
      ></div>

      {/* Sliding Menu Panel */}
      <div
        className={`absolute top-0 right-0 h-full w-80 bg-[#FFFDF8] shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Menu Header */}
        <div className="flex justify-between items-center p-6 border-b border-[#AF8F6F]">
          <h2 className="text-xl font-bold text-[#543310]">Menu</h2>
          <button
            onClick={onClose}
            className="text-[#543310] hover:text-[#AF8F6F] transition-colors duration-200 text-2xl"
          >
            <i className="fa-solid fa-times"></i>
          </button>
        </div>

        {/* Menu Items */}
        <div className="p-6">
          <nav className="space-y-4">
            {menuItems.map((item) =>
              item.path.startsWith("#") ? (
                // For anchor links (Contact Us)
                <div
                  key={item.path}
                  onClick={() => handleMenuClick(item.path)}
                  className="flex items-center justify-between p-3 text-[#543310] hover:bg-[#AF8F6F] hover:text-white rounded-lg transition-all duration-200 group cursor-pointer"
                >
                  <div className="flex items-center space-x-4">
                    <i
                      className={`${item.icon} w-6 text-center group-hover:text-white`}
                    ></i>
                    <span className="font-medium text-lg">{item.label}</span>
                  </div>
                </div>
              ) : (
                // For regular page links
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className="flex items-center justify-between p-3 text-[#543310] hover:bg-[#AF8F6F] hover:text-white rounded-lg transition-all duration-200 group"
                >
                  <div className="flex items-center space-x-4">
                    <i
                      className={`${item.icon} w-6 text-center group-hover:text-white`}
                    ></i>
                    <span className="font-medium text-lg">{item.label}</span>
                  </div>
                  {item.badge && cartItemsCount > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                </Link>
              )
            )}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Menu;
