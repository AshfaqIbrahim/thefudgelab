import React, { useState, useEffect } from "react";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Shield,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const AdminLayout = ({ children }) => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F4E1] p-4">
        <div className="text-center p-6 bg-white rounded-xl shadow-lg border border-[#F8F4E1] w-full max-w-sm">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-linear-to-br from-[#F8F4E1] to-[#AF8F6F] flex items-center justify-center">
            <Shield className="w-8 h-8 text-[#543310]" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-[#543310] mb-2">
            Access Denied
          </h2>
          <p className="text-[#74512D] opacity-80 text-sm">
            Administrator privileges required
          </p>
        </div>
      </div>
    );
  }

  const menuItems = [
    {
      path: "/admin",
      label: "Dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      path: "/admin/products",
      label: "Products",
      icon: <Package className="w-5 h-5" />,
    },
    {
      path: "/admin/orders",
      label: "Orders",
      icon: <ShoppingBag className="w-5 h-5" />,
    },
    {
      path: "/admin/users",
      label: "Users",
      icon: <Users className="w-5 h-5" />,
    },
  ];

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileSidebarOpen(!isMobileSidebarOpen);
    } else {
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setIsMobileSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#F8F4E1]">
      {/* Mobile Sidebar Overlay */}
      {isMobile && isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:relative z-50 h-full 
          bg-linear-to-b from-[#543310] to-[#74512D]
          text-white 
          transition-all duration-300
          border-r border-[#74512D]/30
          shadow-lg
          ${isMobile ? (
            isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
          ) : (
            isSidebarOpen ? "w-64" : "w-20"
          )}
          ${isMobile ? "w-64" : ""}
        `}
      >
        {/* Mobile Close Button */}
        {isMobile && (
          <button
            onClick={() => setIsMobileSidebarOpen(false)}
            className="absolute top-4 right-4 text-[#F8F4E1] hover:text-white lg:hidden"
          >
            <X className="w-6 h-6" />
          </button>
        )}

        {/* Sidebar Toggle - Only show on desktop */}
        {!isMobile && (
          <button
            onClick={toggleSidebar}
            className="
              absolute -right-4 top-6 
              w-8 h-12 
              bg-linear-to-r from-[#543310] to-[#74512D]
              rounded-lg 
              flex items-center justify-center 
              border border-[#74512D]
              hover:from-[#74512D] hover:to-[#543310] 
              transition-all duration-400
              shadow-lg hover:shadow-xl
              z-50
              group
            "
          >
            <div className="group-hover:scale-110 transition-transform duration-300">
              {isSidebarOpen ? (
                <ChevronLeft className="w-5 h-5 text-[#AF8F6F] group-hover:text-white" />
              ) : (
                <ChevronRight className="w-5 h-5 text-[#AF8F6F] group-hover:text-white" />
              )}
            </div>
          </button>
        )}

        {/* Sidebar Content */}
        <div className="p-4 h-full flex flex-col">
          {/* Logo/Brand */}
          <div
            className={`flex items-center ${
              isSidebarOpen || isMobile ? "space-x-3" : "justify-center"
            } mb-8`}
          >
            <div className="w-10 h-10 bg-linear-to-br from-[#AF8F6F] to-[#74512D] rounded-lg flex items-center justify-center shadow">
              <Shield className="w-5 h-5 text-white" />
            </div>
            {(isSidebarOpen || isMobile) && (
              <div className="overflow-hidden">
                <h2 className="text-lg font-bold text-[#F8F4E1]">
                  Admin Panel
                </h2>
                <p className="text-[#AF8F6F] text-xs opacity-80">
                  Management System
                </p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="space-y-1 flex-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`
                    w-full text-left p-3 rounded-lg
                    transition-all duration-200
                    flex items-center
                    ${(isSidebarOpen || isMobile) ? "space-x-3" : "justify-center"}
                    ${
                      isActive
                        ? "bg-[#AF8F6F] shadow-lg border border-[#F8F4E1]/20"
                        : "hover:bg-[#74512D]/50 hover:border hover:border-[#AF8F6F]/20"
                    }
                    border border-transparent
                    group
                  `}
                >
                  <div
                    className={`${
                      isActive ? "text-white" : "text-[#F8F4E1]"
                    } group-hover:text-white transform group-hover:scale-110 transition-transform`}
                  >
                    {item.icon}
                  </div>
                  {(isSidebarOpen || isMobile) && (
                    <span className="font-medium text-[#F8F4E1] text-sm group-hover:text-white">
                      {item.label}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Info (Bottom) */}
          {(isSidebarOpen || isMobile) && (
            <div className="mt-auto">
              <div className="p-3 bg-[#543310]/50 rounded-lg border border-[#74512D]/30 backdrop-blur-sm">
                <p className="text-[#F8F4E1] font-medium text-sm truncate">
                  {user.fname || user.email}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-[#AF8F6F] text-xs">Administrator</p>
                  <button
                    onClick={handleLogout}
                    className="text-xs text-[#AF8F6F] hover:text-white transition-colors flex items-center space-x-1"
                  >
                    <LogOut className="w-3 h-3" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-sm border-b border-[#AF8F6F]/20 shadow-sm">
          <div className="flex justify-between items-center px-4 md:px-6 py-4">
            <div className="flex items-center space-x-3">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="lg:hidden text-[#543310] hover:text-[#74512D]"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-lg md:text-xl font-bold text-[#543310]">
                  Dashboard Overview
                </h1>
                <p className="text-[#74512D] opacity-80 text-xs md:text-sm hidden sm:block">
                  Welcome back, here's your store performance summary
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 md:space-x-4">
              {/* User Info - Hide on small screens */}
              <div className="text-right hidden sm:block">
                <p className="font-semibold text-[#543310] text-sm">
                  {user.fname || user.email}
                </p>
                <p className="text-[#74512D] text-xs">Administrator</p>
              </div>

              {/* User Avatar */}
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-linear-to-br from-[#AF8F6F] to-[#74512D] flex items-center justify-center shadow">
                <span className="text-white font-medium text-sm md:text-base">
                  {user.fname ? user.fname.charAt(0).toUpperCase() : "A"}
                </span>
              </div>

              {/* Logout Button - Text hidden on small screens */}
              <button
                onClick={handleLogout}
                className="
                  px-2 md:px-4 py-1.5 md:py-2 
                  bg-linear-to-r from-[#543310] to-[#74512D]
                  text-white
                  rounded-lg
                  hover:from-[#74512D] hover:to-[#543310]
                  transition-all duration-200
                  shadow hover:shadow-md
                  border border-[#74512D]/30
                  font-medium text-sm
                  flex items-center space-x-1 md:space-x-2
                "
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div
            className="
            bg-white 
            rounded-xl 
            border border-[#F8F4E1]
            shadow-sm
            min-h-full
            p-4 md:p-6
          "
          >
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="px-4 md:px-6 py-3 border-t border-[#AF8F6F]/20 bg-white/50">
          <div className="flex flex-col md:flex-row justify-between items-center text-[#74512D] text-xs gap-2">
            <p>© {new Date().getFullYear()} Admin Management System</p>
            <p className="flex items-center space-x-1">
              <Shield className="w-3 h-3" />
              <span>Secure Admin Panel</span>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;