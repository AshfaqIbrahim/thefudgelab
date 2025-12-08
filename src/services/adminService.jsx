import { api } from "../Api/Axios";

// Dashboard Statistics
export const getDashboardStats = async () => {
  try {
    const [usersResponse, productsResponse] = await Promise.all([
      api.get("/users"),
      api.get("/products"),
    ]);

    const users = usersResponse.data;
    const products = productsResponse.data;

    // Calculate total revenue and collect all orders
    let totalRevenue = 0;
    let allOrders = [];
    let activeUsersCount = 0;

    users.forEach((user) => {
      if (user.orders && user.orders.length > 0) {
        allOrders = [...allOrders, ...user.orders];
        user.orders.forEach((order) => {
          if (order.status === "confirmed" || order.status === "delivered") {
            totalRevenue += order.total || 0;
          }
        });

        // Count users with orders as active
        if (user.role !== "admin") {
          activeUsersCount++;
        }
      }
    });

    const totalOrders = allOrders.length;
    const totalProducts = products.length;

    // Get recent orders (last 5)
    const recentOrders = allOrders
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    return {
      totalRevenue,
      totalOrders,
      activeUsers: activeUsersCount,
      totalProducts,
      recentOrders,
      allOrders,
      allUsers: users,
      allProducts: products,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw error;
  }
};

// Products Management
export const getProducts = async () => {
  const response = await api.get("/products");
  return response.data;
};

export const addProduct = async (productData) => {
  // Remove any existing ₹ symbol to avoid duplication
  const cleanPrice = productData.price
    ? productData.price.toString().replace("₹", "").trim()
    : "";

  const formattedProduct = {
    ...productData,
    price: cleanPrice ? `₹${cleanPrice}` : "₹0",
    tag: productData.tag || "New",
    category: productData.category || "Brownies",
    ingredients: Array.isArray(productData.ingredients)
      ? productData.ingredients
      : ["Premium ingredients"],
    weight: productData.weight || "300g",
    servings: productData.servings || "2-4 people",
    allergens: productData.allergens || "Contains dairy, gluten, and nuts",
    description: productData.description || "Delicious premium product",
    image: productData.image || "/images/placeholder.jpg",
  };

  console.log("Sending to API:", formattedProduct);
  const response = await api.post("/products", formattedProduct);
  console.log("API Response:", response.data);
  return response.data;
};

export const updateProduct = async (id, productData) => {
  // Remove existing ₹ symbol to avoid duplication
  const cleanPrice = productData.price
    ? productData.price.toString().replace("₹", "").trim()
    : "";
  const updatedData = {
    ...productData,
    price: cleanPrice ? `₹${cleanPrice}` : "₹0",
  };

  console.log("Updating product:", id, updatedData);
  const response = await api.put(`/products/${id}`, updatedData);
  console.log("Update response:", response.data);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

// Orders Management
export const getOrders = async () => {
  try {
    const usersResponse = await api.get("/users");
    let allOrders = [];

    usersResponse.data.forEach((user) => {
      if (user.orders && user.orders.length > 0) {
        user.orders.forEach((order) => {
          allOrders.push({
            ...order,
            userId: user.id,
            userName: user.fname || user.email,
            userEmail: user.email,
          });
        });
      }
    });

    return allOrders;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};

export const updateOrderStatus = async (userId, orderId, status) => {
  try {
    // Get user
    const userResponse = await api.get(`/users/${userId}`);
    const user = userResponse.data;

    if (!user.orders || user.orders.length === 0) {
      throw new Error("No orders found for this user");
    }

    // Update order status in user's orders
    const updatedOrders = user.orders.map((order) => {
      if (order.id === orderId) {
        return {
          ...order,
          status: status,
          updatedAt: new Date().toISOString(),
        };
      }
      return order;
    });

    // Update user with new orders
    const response = await api.patch(`/users/${userId}`, {
      orders: updatedOrders,
    });

    return response.data;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

// Users Management
export const getUsers = async () => {
  const response = await api.get("/users");
  // Filter out admin users
  return response.data.filter((user) => user.role !== "admin");
};

export const updateUser = async (id, userData) => {
  const response = await api.patch(`/users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

// Get user details with orders
export const getUserDetails = async (userId) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};
