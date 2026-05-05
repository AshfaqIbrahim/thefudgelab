import React, { useEffect, useRef, useState } from "react";
import { api } from "../Api/Axios";

const OurSteps = () => {
  const [activeStep, setActiveStep] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [trackingStatus, setTrackingStatus] = useState(null);
  const [trackingError, setTrackingError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const sectionRef = useRef(null);
  const [completedSteps, setCompletedSteps] = useState([
    false,
    false,
    false,
    false,
  ]);

  const steps = [
    {
      title: "Fresh Ingredients",
      desc: "We source the finest cocoa and ingredients",
      funFact: "We use 70% dark Belgian chocolate",
      icon: "🌱",
      time: "24-48 hrs",
      stage: "ingredients",
    },
    {
      title: "Handcrafted",
      desc: "Each batch is carefully made with love",
      funFact: "Mixed by hand for 20 minutes straight",
      icon: "👩‍🍳",
      time: "2-3 hours",
      stage: "preparing",
    },
    {
      title: "Quality Check",
      desc: "Rigorous quality control for perfect texture",
      funFact: "Only 95% pass our quality test",
      icon: "✨",
      time: "1 hour",
      stage: "quality",
    },
    {
      title: "Fast Delivery",
      desc: "Fresh from oven to your doorstep",
      funFact: "Delivered within 24-48 hours",
      icon: "🚚",
      time: "Same day dispatch",
      stage: "delivery",
    },
  ];

  // Function to get stage based on order status
  const getStageFromStatus = (status) => {
    switch (status) {
      case "confirmed":
        return "ingredients";
      case "preparing":
        return "preparing";
      case "shipped":
        return "quality";
      case "delivered":
        return "delivery";
      case "cancelled":
        return "cancelled";
      default:
        return "ingredients";
    }
  };

  // Function to get progress percentage based on status
  const getProgressFromStatus = (status) => {
    switch (status) {
      case "confirmed":
        return 25;
      case "preparing":
        return 50;
      case "shipped":
        return 75;
      case "delivered":
        return 100;
      case "cancelled":
        return 0;
      default:
        return 10;
    }
  };

  // Function to fetch order status from your backend
  const getOrderStatus = async (orderId) => {
    try {
      console.log("Searching for Order ID:", orderId);

      // Fetch all users from your backend
      const response = await api.get("/users");
      const users = response.data;

      console.log("Total users fetched:", users.length);

      // Search for the order in any user's orders
      let foundOrder = null;
      let foundUser = null;

      for (const user of users) {
        if (
          user.orders &&
          Array.isArray(user.orders) &&
          user.orders.length > 0
        ) {
          // Try to find order by exact match or partial match
          const order = user.orders.find((o) => {
            // Check exact match
            if (o.id === orderId) return true;
            // Check if orderId ends with the last 8 characters of stored ID
            if (orderId.length <= 8 && o.id.endsWith(orderId)) return true;
            // Check if stored ID ends with the last 8 characters of orderId
            if (orderId.length > 8 && orderId.endsWith(o.id.slice(-8)))
              return true;
            return false;
          });

          if (order) {
            foundOrder = order;
            foundUser = user;
            console.log("Order found!", order);
            break;
          }
        }
      }

      if (foundOrder) {
        console.log("Order status:", foundOrder.status);

        // If order is cancelled, show special message
        if (foundOrder.status === "cancelled") {
          return {
            status: "cancelled",
            isCancelled: true,
            items: foundOrder.items.map((item) => item.name),
            orderDate: foundOrder.date,
            total: foundOrder.total || foundOrder.subtotal || 0,
            shippingAddress: foundOrder.shippingAddress,
            paymentMethod: foundOrder.paymentMethod,
          };
        }

        // Get current stage and progress based on order status
        const currentStage = getStageFromStatus(foundOrder.status);
        const progress = getProgressFromStatus(foundOrder.status);

        return {
          status: foundOrder.status,
          currentStage: currentStage,
          progress: progress,
          items: foundOrder.items.map((item) => item.name),
          orderDate: foundOrder.date,
          total: foundOrder.total || foundOrder.subtotal || 0,
          shippingAddress: foundOrder.shippingAddress,
          paymentMethod: foundOrder.paymentMethod,
          isCancelled: false,
        };
      }

      console.log("Order not found for ID:", orderId);
      return null;
    } catch (error) {
      console.error("Error fetching order:", error);
      throw error;
    }
  };

  // Handle track order form submission
  const handleTrackOrder = async (e) => {
    e.preventDefault();

    const trimmedOrderId = orderId.trim();

    if (!trimmedOrderId) {
      setTrackingError("Please enter your Order ID");
      return;
    }

    setIsLoading(true);
    setTrackingError("");
    setTrackingStatus(null);

    try {
      console.log("Tracking order:", trimmedOrderId);
      const orderStatus = await getOrderStatus(trimmedOrderId);

      if (orderStatus) {
        console.log("Order status received:", orderStatus);
        setTrackingStatus(orderStatus);
      } else {
        setTrackingError(
          `Order "${trimmedOrderId}" not found. Please check your Order ID and try again.`,
        );
      }
    } catch (error) {
      console.error("Tracking error:", error);
      setTrackingError("Error fetching order. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Debug: Log available orders on component mount
  useEffect(() => {
    const debugOrders = async () => {
      try {
        const response = await api.get("/users");
        const users = response.data;
        console.log("=== DEBUG: Available Orders ===");
        users.forEach((user) => {
          if (user.orders && user.orders.length > 0) {
            console.log(`User: ${user.fname || user.email}`);
            user.orders.forEach((order) => {
              console.log(`  Order ID: ${order.id}, Status: ${order.status}`);
            });
          }
        });
      } catch (error) {
        console.error("Debug API Error:", error);
      }
    };
    debugOrders();
  }, []);

  // Check if element is in viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          steps.forEach((_, index) => {
            setTimeout(() => {
              setCompletedSteps((prev) => {
                const newCompleted = [...prev];
                newCompleted[index] = true;
                return newCompleted;
              });
            }, index * 800);
          });
        }
      },
      { threshold: 0.2 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Close modal on escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && showModal) {
        setShowModal(false);
        setTrackingStatus(null);
        setOrderId("");
        setTrackingError("");
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [showModal]);

  return (
    <>
      <section
        ref={sectionRef}
        className="bg-gradient-to-br from-[#543310] to-[#74512D] py-20 px-6 relative overflow-hidden"
      >
        {/* Animated background particles */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-[#F8F4E1] rounded-full animate-float"
              style={{
                width: Math.random() * 10 + 5,
                height: Math.random() * 10 + 5,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 3 + 2}s`,
              }}
            />
          ))}
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div
            className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <h2 className="text-4xl font-bold text-center text-[#F8F4E1] mb-4">
              Our Baking Process
              <span className="block text-sm font-normal text-[#AF8F6F] mt-2">
                From Our Kitchen to Your Heart ❤️
              </span>
            </h2>
            <p className="text-[#AF8F6F] text-center text-lg mb-12 max-w-2xl mx-auto">
              Discover the journey of how we create our premium brownies with
              passion and precision
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12 relative">
            {/* Connecting line - animated */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-[#F8F4E1]/20 -translate-y-1/2 z-0">
              <div
                className="h-full bg-gradient-to-r from-[#F8F4E1] to-[#AF8F6F] transition-all duration-1000"
                style={{ width: isVisible ? "100%" : "0%" }}
              />
            </div>

            {steps.map((step, index) => (
              <div
                key={index}
                className={`transform transition-all duration-500 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-12"
                } relative z-10 cursor-pointer`}
                style={{ transitionDelay: `${index * 150}ms` }}
                onClick={() =>
                  setActiveStep(activeStep === index ? null : index)
                }
              >
                {/* Glass Card Effect */}
                <div className="group relative">
                  {/* Glass background */}
                  <div className="absolute inset-0 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 transition-all duration-500 group-hover:bg-white/15 group-hover:border-white/30 group-hover:-translate-y-2"></div>

                  {/* Card content */}
                  <div className="relative p-8 text-center">
                    <div className="relative">
                      <div
                        className={`bg-[#F8F4E1]/20 backdrop-blur-sm border border-[#F8F4E1]/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-500 group-hover:bg-[#F8F4E1]/30 group-hover:scale-110 ${
                          completedSteps[index]
                            ? "ring-2 ring-[#F8F4E1] ring-offset-2 ring-offset-transparent"
                            : ""
                        }`}
                      >
                        <span className="text-2xl text-[#F8F4E1] font-bold">
                          {index + 1}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-[#F8F4E1] mb-2 group-hover:text-white transition-colors duration-300">
                      {step.icon} {step.title}
                    </h3>

                    <p className="text-[#AF8F6F] leading-relaxed group-hover:text-[#F8F4E1] transition-colors duration-300 mb-3">
                      {step.desc}
                    </p>

                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        activeStep === index
                          ? "max-h-32 opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="mt-4 pt-4 border-t border-white/20">
                        <p className="text-xs text-[#F8F4E1]">
                          💡 Fun Fact: {step.funFact}
                        </p>
                        <p className="text-xs text-[#AF8F6F] mt-1">
                          ⏱️ Estimated time: {step.time}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Track Your Order Button */}
          <div
            className={`text-center mt-12 transition-all duration-700 delay-700 ${isVisible ? "opacity-100" : "opacity-0"}`}
          >
            <button
              onClick={() => setShowModal(true)}
              className="bg-[#F8F4E1] text-[#543310] px-8 py-3 rounded-full font-semibold hover:bg-white transition-all duration-300 hover:scale-105 transform shadow-lg"
            >
              Track Your Order's Journey
            </button>
            <p className="text-[#AF8F6F] text-sm mt-3">
              Enter your Order ID to see where your brownie is in our process
            </p>
          </div>
        </div>

        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          .animate-float {
            animation: float infinite ease-in-out;
          }
        `}</style>
      </section>

      {/* Order Tracking Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowModal(false);
              setTrackingStatus(null);
              setOrderId("");
              setTrackingError("");
            }
          }}
        >
          <div className="bg-gradient-to-br from-[#F8F4E1] to-[#E8DCC8] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="bg-[#543310] text-white p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold">
                    Track Your Brownie's Journey
                  </h3>
                  <p className="text-[#AF8F6F] mt-1">
                    From our kitchen to your doorstep
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setTrackingStatus(null);
                    setOrderId("");
                    setTrackingError("");
                  }}
                  className="text-white hover:text-[#AF8F6F] transition-colors text-2xl"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {!trackingStatus ? (
                // Order ID Input Form
                <form onSubmit={handleTrackOrder}>
                  <div className="mb-6">
                    <label className="block text-[#543310] font-semibold mb-2">
                      Enter Your Order ID
                    </label>
                    <input
                      type="text"
                      value={orderId}
                      onChange={(e) => setOrderId(e.target.value)}
                      placeholder="e.g., ORD1764573114364"
                      className="w-full px-4 py-3 border border-[#AF8F6F] rounded-lg focus:outline-none focus:border-[#543310] bg-white"
                      required
                    />
                    <p className="text-sm text-[#74512D] mt-2">
                      📍 You can find your Order ID in your order confirmation
                      email or in "My Orders" section
                    </p>
                  </div>

                  {trackingError && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                      {trackingError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#543310] text-white py-3 rounded-lg font-semibold hover:bg-[#74512D] transition-colors disabled:opacity-50"
                  >
                    {isLoading ? "Tracking..." : "Track My Order"}
                  </button>
                </form>
              ) : trackingStatus.isCancelled ? (
                // Cancelled Order Display
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fa-solid fa-circle-xmark text-4xl text-red-600"></i>
                  </div>
                  <h3 className="text-xl font-bold text-[#543310] mb-2">
                    Order Cancelled
                  </h3>
                  <p className="text-[#74512D] mb-6">
                    This order has been cancelled. Please contact support if you
                    have any questions.
                  </p>
                  <div className="bg-white rounded-lg p-4 text-left">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[#543310] font-semibold">
                        Order ID:
                      </span>
                      <span className="text-[#74512D]">{orderId}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[#543310] font-semibold">
                        Order Date:
                      </span>
                      <span className="text-[#74512D]">
                        {new Date(
                          trackingStatus.orderDate,
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[#543310] font-semibold">
                        Items:
                      </span>
                      <span className="text-[#74512D]">
                        {trackingStatus.items.join(", ")}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#543310] font-semibold">
                        Total:
                      </span>
                      <span className="text-[#74512D]">
                        ₹{trackingStatus.total}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setTrackingStatus(null);
                      setOrderId("");
                    }}
                    className="w-full mt-4 bg-gray-500 text-white py-2 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                  >
                    Track Another Order
                  </button>
                </div>
              ) : (
                // Order Status Display
                <div>
                  {/* Order Info */}
                  <div className="bg-white rounded-lg p-4 mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[#543310] font-semibold">
                        Order ID:
                      </span>
                      <span className="text-[#74512D]">{orderId}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[#543310] font-semibold">
                        Order Date:
                      </span>
                      <span className="text-[#74512D]">
                        {new Date(
                          trackingStatus.orderDate,
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[#543310] font-semibold">
                        Items:
                      </span>
                      <span className="text-[#74512D]">
                        {trackingStatus.items.join(", ")}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#543310] font-semibold">
                        Total:
                      </span>
                      <span className="text-[#74512D]">
                        ₹{trackingStatus.total}
                      </span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="mb-6 flex justify-center">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        trackingStatus.status === "confirmed"
                          ? "bg-emerald-100 text-emerald-700"
                          : trackingStatus.status === "preparing"
                            ? "bg-blue-100 text-blue-700"
                            : trackingStatus.status === "shipped"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-green-100 text-green-700"
                      }`}
                    >
                      {trackingStatus.status === "confirmed"
                        ? "Order Confirmed ✅"
                        : trackingStatus.status === "preparing"
                          ? "Being Prepared 👩‍🍳"
                          : trackingStatus.status === "shipped"
                            ? "Out for Delivery 🚚"
                            : "Delivered 🎉"}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-[#543310] font-semibold">
                        Order Progress
                      </span>
                      <span className="text-[#74512D]">
                        {trackingStatus.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-[#AF8F6F]/30 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-[#543310] to-[#74512D] h-3 rounded-full transition-all duration-1000"
                        style={{ width: `${trackingStatus.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Preparation Stages */}
                  <div className="space-y-4">
                    <h4 className="text-[#543310] font-bold text-lg mb-4">
                      Preparation Journey
                    </h4>

                    {steps.map((step, idx) => {
                      const currentStageIndex = steps.findIndex(
                        (s) => s.stage === trackingStatus.currentStage,
                      );
                      const isCompleted = idx <= currentStageIndex;
                      const isCurrent =
                        step.stage === trackingStatus.currentStage;

                      return (
                        <div
                          key={idx}
                          className={`flex items-center gap-4 p-3 rounded-lg transition-all ${
                            isCompleted ? "bg-green-50" : "bg-white/50"
                          } ${isCurrent ? "ring-2 ring-[#543310] shadow-lg" : ""}`}
                        >
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                              isCompleted
                                ? "bg-green-500 text-white"
                                : "bg-gray-200 text-gray-500"
                            }`}
                          >
                            {isCompleted && idx !== currentStageIndex
                              ? "✓"
                              : step.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-center">
                              <h5
                                className={`font-semibold ${isCompleted ? "text-green-700" : "text-[#543310]"}`}
                              >
                                {step.title}
                              </h5>
                              {isCurrent && (
                                <span className="text-xs bg-[#543310] text-white px-2 py-1 rounded-full animate-pulse">
                                  In Progress
                                </span>
                              )}
                              {isCompleted && !isCurrent && (
                                <span className="text-xs text-green-600">
                                  Completed
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{step.desc}</p>
                            {isCurrent && (
                              <div className="mt-2 flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                <span className="text-xs text-[#74512D]">
                                  Estimated: {step.time}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Shipping Address (if available) */}
                  {trackingStatus.shippingAddress && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="text-[#543310] font-semibold text-sm mb-2">
                        Shipping Address
                      </h4>
                      <p className="text-[#74512D] text-sm">
                        {trackingStatus.shippingAddress.fullName}
                        <br />
                        {trackingStatus.shippingAddress.address}
                        <br />
                        {trackingStatus.shippingAddress.city},{" "}
                        {trackingStatus.shippingAddress.state} -{" "}
                        {trackingStatus.shippingAddress.pincode}
                      </p>
                    </div>
                  )}

                  {/* Close Button */}
                  <button
                    onClick={() => {
                      setTrackingStatus(null);
                      setOrderId("");
                    }}
                    className="w-full mt-4 bg-gray-500 text-white py-2 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                  >
                    Track Another Order
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .fixed {
          animation: fadeIn 0.3s ease-out;
        }
        .bg-gradient-to-br {
          animation: slideIn 0.3s ease-out;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-pulse {
          animation: pulse 1.5s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

export default OurSteps;
