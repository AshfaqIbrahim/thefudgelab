import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { toast } from "react-toastify";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const lastToastIdRef = useRef(null);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  // Function to show toast (prevents duplicates)
  const showToast = (message, type = "success", icon = "🛒") => {
    // Dismiss any existing toast to prevent duplicates
    if (lastToastIdRef.current) {
      toast.dismiss(lastToastIdRef.current);
    }

    const toastOptions = {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
      newestOnTop: true,
      icon: icon,
      className: "custom-toast",
      bodyClassName: "custom-toast-body",
    };

    let toastId;
    switch (type) {
      case "success":
        toastId = toast.success(message, toastOptions);
        break;
      case "info":
        toastId = toast.info(message, toastOptions);
        break;
      case "error":
        toastId = toast.error(message, toastOptions);
        break;
      case "warning":
        toastId = toast.warning(message, toastOptions);
        break;
      default:
        toastId = toast.success(message, toastOptions);
    }

    lastToastIdRef.current = toastId;
    return toastId;
  };

  const addToCart = (product, quantity = 1) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);

      let updatedItems;
      let message = "";
      let icon = "🛒";

      if (existingItem) {
        updatedItems = prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        message = `Added ${quantity} more ${product.name}${
          quantity > 1 ? "'s" : ""
        } to cart! (Now ${existingItem.quantity + quantity})`;
        icon = "➕";
      } else {
        updatedItems = [...prevItems, { ...product, quantity }];
        message = `${product.name} added to cart!`;
        icon = "🛒";
      }

      // Show toast with deduplication
      showToast(message, "success", icon);

      return updatedItems;
    });
  };

  const removeFromCart = (productId, productName = "") => {
    setItems((prevItems) => {
      const updatedItems = prevItems.filter((item) => item.id !== productId);

      if (productName && productName !== "") {
        showToast(`${productName} removed from cart`, "info", "🗑️");
      }

      return updatedItems;
    });
  };

  const updateQuantity = (productId, quantity, productName = "") => {
    if (quantity <= 0) {
      removeFromCart(productId, productName);
      return;
    }

    setItems((prevItems) => {
      const updatedItems = prevItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      );

      if (productName && productName !== "") {
        showToast(
          `Updated ${productName} quantity to ${quantity}`,
          "info",
          "✏️"
        );
      }

      return updatedItems;
    });
  };

  const clearCart = () => {
    setItems([]);
    showToast("Cart cleared successfully!", "info", "🧹");
  };

  const getCartTotal = () => {
    return items.reduce((total, item) => {
      const price = parseInt(item.price.replace("₹", ""));
      return total + price * item.quantity;
    }, 0);
  };

  const getCartItemsCount = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const values = {
    cart: { items },
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
  };

  return <CartContext.Provider value={values}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export default CartContext;
