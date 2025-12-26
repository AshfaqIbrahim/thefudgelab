import React, { useState, useEffect } from "react";
import AdminLayout from "../../Components/Admin/AdminLayout";
import {
  Users,
  User,
  Shield,
  Mail,
  Calendar,
  Phone,
  MapPin,
  Eye,
  Trash2,
  Search,
  RefreshCw,
  X,
  ChevronDown,
  ChevronUp,
  Lock,
  Unlock,
} from "lucide-react";
import {
  getUsers,
  deleteUser,
  getUserDetails,
} from "../../services/adminService";
import {
  blockUser,
  unblockUser,
  getBlockedUsers,
  checkUserBlocked,
} from "../../services/blockService";
import { useAuth } from "../../Context/AuthContext";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [blockedUsersList, setBlockedUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedUser, setExpandedUser] = useState(null);
  const [blockLoading, setBlockLoading] = useState({});
  const { user: currentAdmin } = useAuth();

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const filtered = users.filter(
        (user) =>
          user.fname?.toLowerCase().includes(term) ||
          user.lname?.toLowerCase().includes(term) ||
          user.email?.toLowerCase().includes(term) ||
          user.id?.toLowerCase().includes(term)
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  const fetchAllData = async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel
      const [usersData, blockedData] = await Promise.all([
        getUsers(),
        getBlockedUsers(),
      ]);

      // Mark blocked users
      const usersWithBlockStatus = usersData.map((user) => {
        const isBlocked = blockedData.some(
          (blocked) =>
            blocked.userId === user.id || blocked.email === user.email
        );

        // Find block info if user is blocked
        const blockInfo = blockedData.find(
          (blocked) =>
            blocked.userId === user.id || blocked.email === user.email
        );

        return {
          ...user,
          status: isBlocked ? "blocked" : "active",
          blockedInfo: blockInfo,
        };
      });

      setUsers(usersWithBlockStatus);
      setFilteredUsers(usersWithBlockStatus);
      setBlockedUsersList(blockedData);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to load users. Please try refreshing the page.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (user) => {
    setSelectedUser(user);
    try {
      const details = await getUserDetails(user.id);

      // Check if user is blocked
      const blockInfo = await checkUserBlocked(user.id);

      setUserDetails({
        ...details,
        status: blockInfo ? "blocked" : "active",
        blockedInfo: blockInfo,
      });
    } catch (error) {
      console.error("Error fetching user details:", error);
      setUserDetails({
        ...user,
        status: user.status || "active",
      });
    }
  };

  const handleDeleteUser = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      try {
        await deleteUser(id);
        fetchAllData(); // Refresh list

        // Close details modal if open for deleted user
        if (selectedUser && selectedUser.id === id) {
          setSelectedUser(null);
          setUserDetails(null);
        }

        alert("User deleted successfully!");
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user. Please try again.");
      }
    }
  };

  const handleBlockUser = async (userToBlock) => {
    if (!currentAdmin) {
      alert("Admin not authenticated. Please login again.");
      return;
    }

    const reason = prompt(
      "Enter reason for blocking this user:",
      "Violation of terms"
    );
    if (reason === null) return; // User cancelled

    if (!reason.trim()) {
      alert("Reason is required to block a user.");
      return;
    }

    if (
      window.confirm(
        `Are you sure you want to block ${userToBlock.fname} ${userToBlock.lname}? They will not be able to login or make purchases.\n\nReason: ${reason}`
      )
    ) {
      try {
        setBlockLoading((prev) => ({ ...prev, [userToBlock.id]: true }));

        // Check if user is already blocked
        const isAlreadyBlocked = await checkUserBlocked(userToBlock.id);
        if (isAlreadyBlocked) {
          alert("User is already blocked!");
          return;
        }

        // Block the user using blockService
        await blockUser(
          userToBlock.id,
          userToBlock.email,
          currentAdmin.id,
          reason
        );

        // Refresh data to get updated status
        await fetchAllData();

        // Update selected user if open
        if (selectedUser && selectedUser.id === userToBlock.id) {
          const blockInfo = await checkUserBlocked(userToBlock.id);
          setSelectedUser((prev) => ({
            ...prev,
            status: "blocked",
            blockedInfo: blockInfo,
          }));
        }

        alert(`✅ User ${userToBlock.email} has been blocked successfully.`);
      } catch (error) {
        console.error("Error blocking user:", error);
        alert(`❌ Failed to block user: ${error.message || "Unknown error"}`);
      } finally {
        setBlockLoading((prev) => ({ ...prev, [userToBlock.id]: false }));
      }
    }
  };

  const handleUnblockUser = async (userToUnblock) => {
    if (!currentAdmin) {
      alert("Admin not authenticated. Please login again.");
      return;
    }

    if (
      window.confirm(
        `Are you sure you want to unblock ${userToUnblock.fname} ${userToUnblock.lname}? They will regain access to their account.`
      )
    ) {
      try {
        setBlockLoading((prev) => ({ ...prev, [userToUnblock.id]: true }));

        // Find the block record for this user
        const blockRecord = blockedUsersList.find(
          (blocked) =>
            blocked.userId === userToUnblock.id ||
            blocked.email === userToUnblock.email
        );

        if (!blockRecord) {
          alert("User is not blocked!");
          return;
        }

        // Unblock the user using blockService
        await unblockUser(blockRecord.id);

        // Refresh data to get updated status
        await fetchAllData();

        // Update selected user if open
        if (selectedUser && selectedUser.id === userToUnblock.id) {
          setSelectedUser((prev) => ({
            ...prev,
            status: "active",
            blockedInfo: null,
          }));
        }

        alert(
          `✅ User ${userToUnblock.email} has been unblocked successfully.`
        );
      } catch (error) {
        console.error("Error unblocking user:", error);
        alert(`❌ Failed to unblock user: ${error.message || "Unknown error"}`);
      } finally {
        setBlockLoading((prev) => ({ ...prev, [userToUnblock.id]: false }));
      }
    }
  };

  const toggleUserExpand = (userId) => {
    setExpandedUser(expandedUser === userId ? null : userId);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Stats calculation
  const totalUsers = users.length;
  const activeUsers = users.filter(
    (u) => u.status === "active" && (u.orders?.length || 0) > 0
  ).length;
  const blockedUsers = users.filter((u) => u.status === "blocked").length;
  const totalOrders = users.reduce(
    (total, user) => total + (user.orders?.length || 0),
    0
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#AF8F6F]"></div>
        </div>
      </AdminLayout>
    );
  }

  const UserDetailsModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-bold text-[#543310]">User Details</h3>
              <p className="text-[#74512D]">{selectedUser.email}</p>
            </div>
            <button
              onClick={() => {
                setSelectedUser(null);
                setUserDetails(null);
              }}
              className="text-[#74512D] hover:text-[#543310]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            {/* User Info */}
            <div>
              <h4 className="text-lg font-semibold text-[#543310] mb-3">
                User Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-[#F8F4E1]/30 rounded-lg">
                  <p className="text-sm text-[#74512D]">Full Name</p>
                  <p className="font-medium text-[#543310] text-lg">
                    {selectedUser.fname} {selectedUser.lname}
                  </p>
                </div>
                <div className="p-4 bg-[#F8F4E1]/30 rounded-lg">
                  <p className="text-sm text-[#74512D]">Email</p>
                  <p className="font-medium text-[#543310] text-lg">
                    {selectedUser.email}
                  </p>
                </div>
                <div className="p-4 bg-[#F8F4E1]/30 rounded-lg">
                  <p className="text-sm text-[#74512D]">User ID</p>
                  <p className="font-medium text-[#543310]">
                    {selectedUser.id}
                  </p>
                </div>
                <div className="p-4 bg-[#F8F4E1]/30 rounded-lg">
                  <p className="text-sm text-[#74512D]">Account Status</p>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedUser.status === "blocked"
                        ? "bg-red-50 text-red-700 border border-red-200"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    }`}
                  >
                    {selectedUser.status?.toUpperCase() || "ACTIVE"}
                  </span>
                </div>
                <div className="p-4 bg-[#F8F4E1]/30 rounded-lg">
                  <p className="text-sm text-[#74512D]">Account Type</p>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedUser.role === "admin"
                        ? "bg-violet-50 text-violet-700 border border-violet-200"
                        : "bg-blue-50 text-blue-700 border border-blue-200"
                    }`}
                  >
                    {selectedUser.role?.toUpperCase() || "USER"}
                  </span>
                </div>
                <div className="p-4 bg-[#F8F4E1]/30 rounded-lg">
                  <p className="text-sm text-[#74512D]">Member Since</p>
                  <p className="font-medium text-[#543310]">
                    {formatDate(selectedUser.createdAt || selectedUser.joined)}
                  </p>
                </div>
              </div>

              {/* Block Info */}
              {selectedUser.status === "blocked" &&
                selectedUser.blockedInfo && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h5 className="font-semibold text-red-800 mb-2">
                      Block Details
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <p className="text-sm text-red-700">Reason</p>
                        <p className="font-medium text-red-900">
                          {selectedUser.blockedInfo.reason}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-red-700">Blocked On</p>
                        <p className="font-medium text-red-900">
                          {formatDate(selectedUser.blockedInfo.blockedAt)}
                        </p>
                      </div>
                      {selectedUser.blockedInfo.blockedBy && (
                        <div className="col-span-2">
                          <p className="text-sm text-red-700">
                            Blocked By Admin ID
                          </p>
                          <p className="font-medium text-red-900">
                            {selectedUser.blockedInfo.blockedBy}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              {selectedUser.status === "blocked" ? (
                <button
                  onClick={() => handleUnblockUser(selectedUser)}
                  disabled={blockLoading[selectedUser.id]}
                  className="flex items-center space-x-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {blockLoading[selectedUser.id] ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Unlock className="w-4 h-4" />
                  )}
                  <span>Unblock User</span>
                </button>
              ) : (
                <button
                  onClick={() => handleBlockUser(selectedUser)}
                  disabled={blockLoading[selectedUser.id]}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {blockLoading[selectedUser.id] ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Lock className="w-4 h-4" />
                  )}
                  <span>Block User</span>
                </button>
              )}

              <button
                onClick={() => handleDeleteUser(selectedUser.id)}
                className="flex items-center space-x-2 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete User</span>
              </button>
            </div>

            {/* Stats */}
            {userDetails && (
              <div>
                <h4 className="text-lg font-semibold text-[#543310] mb-3">
                  User Stats
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-emerald-600" />
                      <div>
                        <p className="text-sm text-emerald-700">Total Orders</p>
                        <p className="text-2xl font-bold text-emerald-900">
                          {userDetails.orders?.length || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-3">
                      <Shield className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-blue-700">Total Spent</p>
                        <p className="text-2xl font-bold text-blue-900">
                          ₹
                          {userDetails.orders
                            ?.reduce(
                              (total, order) => total + (order.total || 0),
                              0
                            )
                            .toLocaleString() || "0"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-amber-600" />
                      <div>
                        <p className="text-sm text-amber-700">Member Since</p>
                        <p className="text-xl font-bold text-amber-900">
                          {formatDate(
                            userDetails.createdAt || userDetails.joined
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Addresses */}
            {userDetails?.profile?.addresses &&
              userDetails.profile.addresses.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-[#543310] mb-3">
                    Saved Addresses
                  </h4>
                  <div className="space-y-3">
                    {userDetails.profile.addresses.map((address, index) => (
                      <div
                        key={index}
                        className="p-4 bg-[#F8F4E1]/50 rounded-lg border border-[#AF8F6F]/30"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-[#543310]">
                              {address.fullName}
                            </span>
                            <span className="text-xs bg-[#AF8F6F] text-white px-2 py-1 rounded capitalize">
                              {address.addressType}
                            </span>
                            {address.isDefault && (
                              <span className="text-xs bg-[#543310] text-white px-2 py-1 rounded">
                                Default
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-start space-x-2 text-sm text-[#74512D] mt-2">
                          <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                          <span>
                            {address.address}, {address.city}, {address.state} -{" "}
                            {address.pincode}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-[#74512D] mt-1">
                          <Phone className="w-4 h-4" />
                          <span>{address.phone}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Orders History */}
            {userDetails?.orders && userDetails.orders.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-[#543310] mb-3">
                  Recent Orders
                </h4>
                <div className="space-y-3">
                  {userDetails.orders.slice(0, 5).map((order) => (
                    <div
                      key={order.id}
                      className="flex justify-between items-center p-3 bg-[#F8F4E1]/30 rounded-lg hover:bg-[#F8F4E1]/50 transition-colors"
                    >
                      <div>
                        <p className="font-medium text-[#543310]">
                          Order #{order.id?.slice(-6)}
                        </p>
                        <p className="text-sm text-[#74512D]">
                          {formatDate(order.date)}
                        </p>
                        <span
                          className={`text-xs px-2 py-1 rounded-full mt-1 inline-block ${
                            order.status === "confirmed"
                              ? "bg-green-100 text-green-700"
                              : order.status === "delivered"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-[#543310]">
                          ₹{order.total?.toLocaleString()}
                        </p>
                        <p className="text-sm text-[#74512D]">
                          {order.items?.length || 0} items
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {userDetails.orders.length > 5 && (
                  <p className="text-center text-sm text-[#74512D] mt-3">
                    + {userDetails.orders.length - 5} more orders
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-[#543310]">User Management</h1>
          <p className="text-[#74512D] mt-1">
            Manage user accounts, block/unblock users
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-[#F8F4E1] p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-[#74512D]">Total Users</p>
                <p className="text-xl font-bold text-[#543310]">{totalUsers}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-[#F8F4E1] p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-[#74512D]">Active Users</p>
                <p className="text-xl font-bold text-[#543310]">
                  {activeUsers}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-[#F8F4E1] p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-violet-50 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-violet-600" />
              </div>
              <div>
                <p className="text-sm text-[#74512D]">Total Orders</p>
                <p className="text-xl font-bold text-[#543310]">
                  {totalOrders}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-[#F8F4E1] p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                <Lock className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-[#74512D]">Blocked Users</p>
                <p className="text-xl font-bold text-[#543310]">
                  {blockedUsers}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#74512D]" />
            <input
              type="text"
              placeholder="Search users by name, email, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#AF8F6F]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AF8F6F]/30"
            />
          </div>
          <button
            onClick={fetchAllData}
            className="flex items-center space-x-2 px-4 py-2 bg-[#F8F4E1] hover:bg-[#AF8F6F] text-[#543310] rounded-lg transition-colors ml-4"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block bg-white rounded-lg border border-[#F8F4E1] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F8F4E1]">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-[#543310]">
                    User
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-[#543310]">
                    Email
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-[#543310]">
                    Orders
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-[#543310]">
                    Status
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-[#543310]">
                    Account Status
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-[#543310]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F8F4E1]">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-[#F8F4E1]/30">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-[#AF8F6F]/10 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-[#AF8F6F]" />
                        </div>
                        <div>
                          <span className="font-medium text-[#543310]">
                            {user.fname} {user.lname}
                          </span>
                          <p className="text-xs text-[#74512D]">
                            ID: {user.id.slice(0, 8)}...
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-[#74512D]" />
                        <span className="text-[#74512D]">{user.email}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <span className="font-medium text-[#543310]">
                          {user.orders?.length || 0}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.orders && user.orders.length > 0
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-gray-50 text-gray-700 border border-gray-200"
                        }`}
                      >
                        {user.orders && user.orders.length > 0
                          ? "Active Buyer"
                          : "New User"}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.status === "blocked"
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}
                      >
                        {user.status === "blocked" ? "BLOCKED" : "ACTIVE"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewDetails(user)}
                          className="p-2 hover:bg-[#F8F4E1] rounded transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4 text-[#74512D]" />
                        </button>
                        {user.status === "blocked" ? (
                          <button
                            onClick={() => handleUnblockUser(user)}
                            disabled={blockLoading[user.id]}
                            className="p-2 hover:bg-emerald-50 rounded transition-colors disabled:opacity-50"
                            title="Unblock User"
                          >
                            {blockLoading[user.id] ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-600"></div>
                            ) : (
                              <Unlock className="w-4 h-4 text-emerald-600" />
                            )}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleBlockUser(user)}
                            disabled={blockLoading[user.id]}
                            className="p-2 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                            title="Block User"
                          >
                            {blockLoading[user.id] ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                            ) : (
                              <Lock className="w-4 h-4 text-red-600" />
                            )}
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 hover:bg-[#F8F4E1] rounded transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4 text-rose-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-lg border border-[#F8F4E1] overflow-hidden"
            >
              <div className="p-4">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 bg-[#AF8F6F]/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6 text-[#AF8F6F]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#543310]">
                        {user.fname} {user.lname}
                      </h3>
                      <p className="text-[#74512D] text-sm truncate">
                        {user.email}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.orders && user.orders.length > 0
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-gray-50 text-gray-700 border border-gray-200"
                          }`}
                        >
                          {user.orders && user.orders.length > 0
                            ? "Active Buyer"
                            : "New User"}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.status === "blocked"
                              ? "bg-red-50 text-red-700 border border-red-200"
                              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          }`}
                        >
                          {user.status === "blocked" ? "BLOCKED" : "ACTIVE"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleUserExpand(user.id)}
                    className="p-1 hover:bg-[#F8F4E1] rounded ml-2"
                  >
                    {expandedUser === user.id ? (
                      <ChevronUp className="w-5 h-5 text-[#74512D]" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-[#74512D]" />
                    )}
                  </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="p-2 bg-[#F8F4E1]/30 rounded">
                    <p className="text-xs text-[#74512D]">Orders</p>
                    <p className="font-bold text-[#543310]">
                      {user.orders?.length || 0}
                    </p>
                  </div>
                  <div className="p-2 bg-[#F8F4E1]/30 rounded">
                    <p className="text-xs text-[#74512D]">Total Spent</p>
                    <p className="font-bold text-[#543310]">
                      ₹
                      {user.orders
                        ?.reduce(
                          (total, order) => total + (order.total || 0),
                          0
                        )
                        .toLocaleString() || "0"}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#F8F4E1]">
                  <button
                    onClick={() => handleViewDetails(user)}
                    className="px-3 py-2 bg-[#F8F4E1] hover:bg-[#AF8F6F] text-[#543310] rounded-lg transition-colors flex items-center justify-center space-x-1"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="text-sm">View</span>
                  </button>
                  {user.status === "blocked" ? (
                    <button
                      onClick={() => handleUnblockUser(user)}
                      disabled={blockLoading[user.id]}
                      className="px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center space-x-1"
                    >
                      {blockLoading[user.id] ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Unlock className="w-4 h-4" />
                      )}
                      <span className="text-sm">Unblock</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBlockUser(user)}
                      disabled={blockLoading[user.id]}
                      className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center space-x-1"
                    >
                      {blockLoading[user.id] ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Lock className="w-4 h-4" />
                      )}
                      <span className="text-sm">Block</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="px-3 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg transition-colors flex items-center justify-center space-x-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="text-sm">Delete</span>
                  </button>
                </div>

                {/* Expanded Details */}
                {expandedUser === user.id && (
                  <div className="mt-4 pt-4 border-t border-[#F8F4E1] space-y-3">
                    <div>
                      <p className="text-sm font-medium text-[#74512D] mb-1">
                        User ID
                      </p>
                      <p className="text-sm text-[#543310] font-mono">
                        {user.id.slice(0, 16)}...
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#74512D] mb-1">
                        Member Since
                      </p>
                      <p className="text-sm text-[#543310]">
                        {formatDate(user.createdAt || user.joined)}
                      </p>
                    </div>
                    {user.status === "blocked" && user.blockedInfo && (
                      <div className="p-3 bg-red-50 rounded border border-red-200">
                        <p className="text-sm font-medium text-red-800 mb-1">
                          Blocked
                        </p>
                        <p className="text-xs text-red-700">
                          {user.blockedInfo.reason}
                        </p>
                        <p className="text-xs text-red-600 mt-1">
                          {formatDate(user.blockedInfo.blockedAt)}
                        </p>
                      </div>
                    )}
                    {user.orders && user.orders.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-[#74512D] mb-1">
                          Recent Orders
                        </p>
                        <div className="space-y-2">
                          {user.orders.slice(0, 2).map((order, index) => (
                            <div
                              key={index}
                              className="p-2 bg-[#F8F4E1]/30 rounded text-sm"
                            >
                              <p className="font-medium text-[#543310]">
                                Order #{order.id?.slice(-6)}
                              </p>
                              <p className="text-xs text-[#74512D]">
                                {formatDate(order.date)} - ₹
                                {order.total?.toLocaleString()}
                              </p>
                            </div>
                          ))}
                          {user.orders.length > 2 && (
                            <p className="text-xs text-[#74512D] text-center">
                              + {user.orders.length - 2} more orders
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-[#F8F4E1]">
            <Users className="w-12 h-12 text-[#AF8F6F] mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-[#543310] mb-2">
              No Users Found
            </h4>
            <p className="text-[#74512D]">
              {searchTerm
                ? "No users match your search criteria"
                : "No registered users in the system"}
            </p>
          </div>
        )}

        {/* User Details Modal */}
        {selectedUser && <UserDetailsModal />}
      </div>
    </AdminLayout>
  );
};

export default UserManagement;
