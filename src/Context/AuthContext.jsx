import React, { createContext, useState, useEffect, useContext } from "react";
import { api } from "../Api/Axios";
import { toast } from "react-toastify";
import { checkUserBlockedByEmail } from "../services/blockService"; // Add this import

export const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Load saved user on page reload
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Register user
  const registerUser = async (userData) => {
    try {
      const userWithProfile = {
        ...userData,
        role: "user",
        cart: [],
        profile: {
          avatar: null,
          addresses: [],
          phone: "",
        },
      };
      const response = await api.post("/users", userWithProfile);
      toast.success("Account created successfully!");
      return response;
    } catch (error) {
      toast.error("Registration failed. Please try again.");
      throw error;
    }
  };

  // Login user - UPDATED WITH BLOCK CHECK
  const loginUser = async (email, password) => {
    try {
      console.log("🔐 Login attempt for:", email);

      // FIRST: Check if user is blocked BEFORE checking credentials
      const blockedInfo = await checkUserBlockedByEmail(email);
      if (blockedInfo) {
        console.log("🚫 Blocked user attempt:", email);
        throw new Error(
          `Account blocked. Reason: ${
            blockedInfo.reason || "Violation of terms"
          }. Please contact customer support at thefudgelab@gmail.com or call +91 866 037 4131.`
        );
      }

      // SECOND: Check credentials
      const response = await api.get(
        `/users?email=${email}&password=${password}`
      );
      console.log("🔑 Login response:", response.data);

      if (response.data.length > 0) {
        const loggedUser = response.data[0];

        // FINAL CHECK: Double-check if user is blocked by ID
        const finalBlockCheck = await checkUserBlockedByEmail(loggedUser.email);
        if (finalBlockCheck) {
          console.log("🚫 User blocked after login check:", loggedUser.email);
          throw new Error(
            `Account blocked. Reason: ${
              finalBlockCheck.reason || "Violation of terms"
            }. Please contact customer support at thefudgelab@gmail.com or call +91 866 037 4131.`
          );
        }

        // Ensure user has profile structure
        if (!loggedUser.profile) {
          loggedUser.profile = {
            avatar: null,
            addresses: [],
            phone: "",
          };
        }

        if (!loggedUser.role) {
          loggedUser.role = "user";
        }

        setUser(loggedUser);
        localStorage.setItem("user", JSON.stringify(loggedUser));
        toast.success(`Welcome back, ${loggedUser.fname || loggedUser.email}!`);
        return true;
      } else {
        toast.error("Invalid email or password");
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      // Show specific blocked message
      if (error.message.includes("Account blocked")) {
        toast.error(error.message);
      } else {
        toast.error("Login failed. Please try again.");
      }
      throw error;
    }
  };

  // Logout user
  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.info("Logged out successfully");
  };

  // Update user profile
  const updateUserProfile = async (profileData) => {
    try {
      // Ensure user exists
      if (!user) {
        throw new Error("No user logged in");
      }

      const updatedUser = {
        ...user,
        profile: {
          // Ensure profile structure exists
          avatar: null,
          addresses: [],
          phone: "",
          ...user.profile, // Spread existing profile if it exists
          ...profileData, // Apply updates
        },
      };

      const response = await api.put(`/users/${user.id}`, updatedUser);
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      toast.success("Profile updated successfully!");
      return response;
    } catch (error) {
      toast.error("Failed to update profile");
      throw error;
    }
  };

  // Add new address
  const addAddress = async (newAddress) => {
    try {
      // Safely access addresses with proper fallbacks
      const addresses = user?.profile?.addresses || [];

      const addressWithId = {
        ...newAddress,
        id: `addr_${Date.now()}`,
        isDefault: addresses.length === 0, // First address becomes default
      };

      const updatedAddresses = [...addresses, addressWithId];
      await updateUserProfile({ addresses: updatedAddresses });
      return addressWithId;
    } catch (error) {
      throw error;
    }
  };

  // Update address
  const updateAddress = async (addressId, updatedAddress) => {
    try {
      const addresses = (user?.profile?.addresses || []).map((addr) =>
        addr.id === addressId ? { ...addr, ...updatedAddress } : addr
      );
      await updateUserProfile({ addresses });
    } catch (error) {
      throw error;
    }
  };

  // Delete address
  const deleteAddress = async (addressId) => {
    try {
      const addresses = (user?.profile?.addresses || []).filter(
        (addr) => addr.id !== addressId
      );
      await updateUserProfile({ addresses });
    } catch (error) {
      throw error;
    }
  };

  // Set default address
  const setDefaultAddress = async (addressId) => {
    try {
      const addresses = (user?.profile?.addresses || []).map((addr) => ({
        ...addr,
        isDefault: addr.id === addressId,
      }));
      await updateUserProfile({ addresses });
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loginUser,
        registerUser,
        logoutUser,
        updateUserProfile,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
export default AuthProvider;
