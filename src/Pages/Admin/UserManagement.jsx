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
} from "lucide-react";
import {
  getUsers,
  deleteUser,
  getUserDetails,
} from "../../services/adminService";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
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

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (user) => {
    setSelectedUser(user);
    try {
      const details = await getUserDetails(user.id);
      setUserDetails(details);
    } catch (error) {
      console.error("Error fetching user details:", error);
      setUserDetails(user);
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
        fetchUsers(); // Refresh list

        // Close details modal if open for deleted user
        if (selectedUser && selectedUser.id === id) {
          setSelectedUser(null);
          setUserDetails(null);
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user. Please try again.");
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

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
              </div>
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
            Manage user accounts and permissions
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border border-[#F8F4E1] p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-[#74512D]">Total Users</p>
                <p className="text-xl font-bold text-[#543310]">
                  {users.length}
                </p>
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
                  {users.filter((u) => u.orders && u.orders.length > 0).length}
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
                  {users.reduce(
                    (total, user) => total + (user.orders?.length || 0),
                    0
                  )}
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
            onClick={fetchUsers}
            className="flex items-center space-x-2 px-4 py-2 bg-[#F8F4E1] hover:bg-[#AF8F6F] text-[#543310] rounded-lg transition-colors ml-4"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg border border-[#F8F4E1] overflow-hidden">
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
                    Total Spent
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-[#543310]">
                    Status
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
                      <div className="font-medium text-[#543310]">
                        ₹
                        {user.orders
                          ?.reduce(
                            (total, order) => total + (order.total || 0),
                            0
                          )
                          .toLocaleString() || "0"}
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
                          ? "Active"
                          : "New"}
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