import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import "./Sidebar.css";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const displayName = user?.fullName || user?.username || "nguyễn thanh";
  const initialChar = displayName.charAt(0).toUpperCase();

  return (
    <aside
      className={`${
        isCollapsed ? "w-20" : "w-64"
      } min-h-screen bg-white border-r border-gray-100 flex flex-col flex-shrink-0 transition-all duration-300`}
    >
      {/* Header Sidebar: Logo & Toggle */}
      <div
        className={`h-20 flex items-center ${
          isCollapsed ? "justify-center" : "justify-between px-6"
        }`}
      >
        {!isCollapsed && (
          <h1 className="text-2xl font-bold text-[#008B8B] whitespace-nowrap">
            BeautyPals
          </h1>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-gray-400 hover:text-[#008B8B] hover:bg-gray-50 p-2 rounded-lg transition-colors"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Menu Điều hướng */}
      <nav className="flex-1 px-4 py-4 space-y-2">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-3 py-3 rounded-lg transition-colors text-sm font-medium ${
              isCollapsed ? "justify-center px-0" : "px-4"
            } ${
              isActive
                ? "text-[#008B8B] bg-[#caf8e4]"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`
          }
          title={isCollapsed ? "Dashboard" : ""}
        >
          <LayoutDashboard size={20} className="flex-shrink-0" />
          {!isCollapsed && <span>Dashboard</span>}
        </NavLink>

        <NavLink
          to="/products"
          className={({ isActive }) =>
            `flex items-center gap-3 py-3 rounded-lg transition-colors text-sm font-medium ${
              isCollapsed ? "justify-center px-0" : "px-4"
            } ${
              isActive
                ? "text-[#008B8B] bg-[#caf8e4]"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`
          }
          title={isCollapsed ? "Products" : ""}
        >
          <Package size={20} className="flex-shrink-0" />
          {!isCollapsed && <span>Products</span>}
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center gap-3 py-3 rounded-lg transition-colors text-sm font-medium ${
              isCollapsed ? "justify-center px-0" : "px-4"
            } ${
              isActive
                ? "text-[#008B8B] bg-[#caf8e4]"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`
          }
          title={isCollapsed ? "Profile" : ""}
        >
          <User size={20} className="flex-shrink-0" />
          {!isCollapsed && <span>Profile</span>}
        </NavLink>
      </nav>

      {/* Footer Sidebar: User Profile */}
      <div className={`sidebar-footer border-t border-gray-100 p-4 ${isCollapsed ? "flex justify-center" : ""}`}>
        <div
          onClick={() => navigate("/profile")}
          className="user-profile flex items-center gap-3 cursor-pointer p-2 rounded-xl hover:bg-emerald-50 transition-colors"
          title={displayName}
        >
          <div className="w-9 h-9 rounded-full bg-[#caf8e4] text-[#008B8B] font-bold flex items-center justify-center overflow-hidden border border-teal-100 flex-shrink-0 shadow-sm">
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
          {!isCollapsed && (
            <span className="user-name font-medium text-sm text-gray-800 truncate">
              {displayName}
            </span>
          )}
        </div>
      </div>
    </aside>
  );
}
