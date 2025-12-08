import React, { useState, useEffect } from "react";
import AdminLayout from "../../Components/Admin/AdminLayout";
import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  TrendingUp,
  TrendingDown,
  Clock,
  PlusCircle,
  Eye,
  Settings,
  Calendar,
  MapPin,
} from "lucide-react";
import { getDashboardStats } from "../../services/adminService";
import { useNavigate } from "react-router-dom";

const AdminHome = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    activeUsers: 0,
    totalProducts: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await getDashboardStats();

      setStats({
        totalRevenue: data.totalRevenue,
        totalOrders: data.totalOrders,
        activeUsers: data.activeUsers,
        totalProducts: data.totalProducts,
      });

      setRecentOrders(data.recentOrders || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const statsData = [
    {
      title: "Total Revenue",
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      change: "+12.5%",
      icon: <DollarSign className="w-5 h-5" />,
      color: "text-emerald-600 bg-emerald-50",
      borderColor: "border-emerald-200",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      change: "+8.2%",
      icon: <ShoppingBag className="w-5 h-5" />,
      color: "text-blue-600 bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      title: "Active Users",
      value: stats.activeUsers,
      change: "+3.1%",
      icon: <Users className="w-5 h-5" />,
      color: "text-violet-600 bg-violet-50",
      borderColor: "border-violet-200",
    },
    {
      title: "Products",
      value: stats.totalProducts,
      change: "+7",
      icon: <Package className="w-5 h-5" />,
      color: "text-amber-600 bg-amber-50",
      borderColor: "border-amber-200",
    },
  ];

  const quickActions = [
    {
      title: "Add Product",
      icon: <PlusCircle className="w-5 h-5" />,
      bgColor: "bg-[#543310] hover:bg-[#74512D]",
      onClick: () => navigate("/admin/products"),
    },
    {
      title: "View Orders",
      icon: <Eye className="w-5 h-5" />,
      bgColor: "bg-[#74512D] hover:bg-[#5d4123]",
      onClick: () => navigate("/admin/orders"),
    },
    {
      title: "Manage Users",
      icon: <Users className="w-5 h-5" />,
      bgColor: "bg-[#74512D] hover:bg-[#5d4123]",
      onClick: () => navigate("/admin/users"),
    },
    {
      title: "Settings",
      icon: <Settings className="w-5 h-5" />,
      bgColor: "bg-[#543310] hover:bg-[#74512D]",
      onClick: () => alert("Settings page coming soon"),
    },
  ];

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "text-emerald-600 bg-emerald-50";
      case "delivered":
        return "text-green-600 bg-green-50";
      case "preparing":
        return "text-blue-600 bg-blue-50";
      case "pending":
        return "text-yellow-600 bg-yellow-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-[#543310]">
            Dashboard Overview
          </h1>
          <p className="text-[#74512D] mt-1">
            Welcome back, here's your store performance summary
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsData.map((stat, index) => (
            <div
              key={index}
              className={`bg-white rounded-lg border ${stat.borderColor} p-4 hover:shadow-md transition-shadow`}
            >
              <div className="flex justify-between items-start mb-3">
                <div
                  className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}
                >
                  {stat.icon}
                </div>
                <div
                  className={`flex items-center text-sm font-medium px-2 py-1 rounded ${
                    stat.change.includes("+")
                      ? "text-emerald-700 bg-emerald-50"
                      : "text-rose-700 bg-rose-50"
                  }`}
                >
                  {stat.change.includes("+") ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  {stat.change}
                </div>
              </div>
              <h3 className="text-[#74512D] text-sm font-medium mb-1">
                {stat.title}
              </h3>
              <p className="text-2xl font-bold text-[#543310]">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-lg border border-[#F8F4E1] p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[#543310]">
                Recent Orders
              </h2>
              <Clock className="w-4 h-4 text-[#AF8F6F]" />
            </div>
            <div className="space-y-3">
              {recentOrders.length > 0 ? (
                recentOrders.map((order, index) => (
                  <div
                    key={index}
                    className="flex items-start justify-between p-3 hover:bg-[#F8F4E1]/50 rounded-lg transition-colors"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-50 rounded flex items-center justify-center mt-1">
                        <ShoppingBag className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-[#543310]">
                          Order #{order.id?.slice(-6) || "N/A"}
                        </p>
                        <div className="flex items-center space-x-2 text-sm text-[#74512D]">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(order.date)}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-[#74512D] mt-1">
                          <MapPin className="w-3 h-3" />
                          <span>{order.shippingAddress?.city || "N/A"}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#543310]">
                        ₹{order.total?.toLocaleString() || "0"}
                      </p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status || "pending"}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <ShoppingBag className="w-8 h-8 text-[#AF8F6F] mx-auto mb-2" />
                  <p className="text-[#74512D]">No recent orders</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg border border-[#F8F4E1] p-5">
            <h2 className="text-lg font-semibold text-[#543310] mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className={`${action.bgColor} text-white p-4 rounded-lg transition-all duration-200 hover:shadow-md flex flex-col items-center justify-center space-y-2`}
                >
                  {action.icon}
                  <span className="text-sm font-medium">{action.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminHome;
