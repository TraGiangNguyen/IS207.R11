import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  User,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import "./Sidebar.css";

export default function Sidebar({ isMobileOpen = false, onCloseMobile }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const displayName = user?.fullName || user?.username || "nguyễn thanh";
  const initialChar = displayName.charAt(0).toUpperCase();

  const handleNavClick = () => {
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const handleProfileClick = () => {
    if (onCloseMobile) {
      onCloseMobile();
    }
    navigate("/profile");
  };

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-100 flex flex-col flex-shrink-0 transition-all duration-300
        md:relative md:translate-x-0 md:z-20
        ${isMobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full shadow-none"}
        ${isCollapsed ? "md:w-20" : "md:w-64"}
        w-64 min-h-screen
      `}
    >
      {/* Header Sidebar: Logo & Buttons */}
      <div
        className={`h-16 sm:h-20 flex items-center justify-between px-6 border-b md:border-b-0 border-gray-100 ${
          isCollapsed ? "md:justify-center md:px-0" : ""
        }`}
      >
        {/* Logo text: Always visible on mobile drawer, toggleable on desktop */}
        <h1
          className={`text-2xl font-bold text-[#008B8B] whitespace-nowrap ${
            isCollapsed ? "md:hidden" : "block"
          }`}
        >
          BeautyPals
        </h1>

        {/* Desktop Collapse Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex text-gray-400 hover:text-[#008B8B] hover:bg-gray-50 p-2 rounded-lg transition-colors"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label="Toggle sidebar width"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>

        {/* Mobile Close Button */}
        <button
          onClick={onCloseMobile}
          className="md:hidden text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-lg transition-colors"
          title="Close sidebar"
          aria-label="Close sidebar"
        >
          <X size={20} />
        </button>
      </div>

      {/* Menu Điều hướng */}
      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
        <NavLink
          to="/dashboard"
          onClick={handleNavClick}
          className={({ isActive }) =>
            `flex items-center gap-3 py-3 rounded-lg transition-colors text-sm font-medium ${
              isCollapsed ? "md:justify-center md:px-0 px-4" : "px-4"
            } ${
              isActive
                ? "text-[#008B8B] bg-[#caf8e4]"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`
          }
          title="Dashboard"
        >
          <LayoutDashboard size={20} className="flex-shrink-0" />
          <span className={isCollapsed ? "md:hidden" : ""}>Dashboard</span>
        </NavLink>

        <NavLink
          to="/products"
          onClick={handleNavClick}
          className={({ isActive }) =>
            `flex items-center gap-3 py-3 rounded-lg transition-colors text-sm font-medium ${
              isCollapsed ? "md:justify-center md:px-0 px-4" : "px-4"
            } ${
              isActive
                ? "text-[#008B8B] bg-[#caf8e4]"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`
          }
          title="Products"
        >
          <Package size={20} className="flex-shrink-0" />
          <span className={isCollapsed ? "md:hidden" : ""}>Products</span>
        </NavLink>

        <NavLink
          to="/profile"
          onClick={handleNavClick}
          className={({ isActive }) =>
            `flex items-center gap-3 py-3 rounded-lg transition-colors text-sm font-medium ${
              isCollapsed ? "md:justify-center md:px-0 px-4" : "px-4"
            } ${
              isActive
                ? "text-[#008B8B] bg-[#caf8e4]"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`
          }
          title="Profile"
        >
          <User size={20} className="flex-shrink-0" />
          <span className={isCollapsed ? "md:hidden" : ""}>Profile</span>
        </NavLink>
      </nav>

      {/* Footer Sidebar: User Profile */}
      <div
        className={`sidebar-footer border-t border-gray-100 p-4 ${
          isCollapsed ? "md:flex md:justify-center" : ""
        }`}
      >
        <div
          onClick={handleProfileClick}
          className="user-profile flex items-center gap-3 cursor-pointer p-2 rounded-xl hover:bg-emerald-50 transition-colors"
          title={displayName}
        >
          <div className="w-9 h-9 rounded-full bg-[#caf8e4] text-[#008B8B] font-bold flex items-center justify-center overflow-hidden border border-teal-100 flex-shrink-0 shadow-sm text-sm">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{initialChar}</span>
            )}
          </div>
          <span
            className={`user-name font-medium text-sm text-gray-800 truncate ${
              isCollapsed ? "md:hidden" : ""
            }`}
          >
            {displayName}
          </span>
        </div>
      </div>
    </aside>
  );
}
