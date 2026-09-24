import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function Sidebar() {
  // Quản lý trạng thái đóng/mở của Sidebar
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      // Đổi chiều rộng dựa trên trạng thái và thêm hiệu ứng transition mượt mà
      className={`${isCollapsed ? "w-20" : "w-64"} min-h-screen bg-white border-r border-gray-100 flex flex-col flex-shrink-0 transition-all duration-300`}
    >
      {/* Header Sidebar: Logo & Nút thu gọn */}
      <div
        className={`h-20 flex items-center ${isCollapsed ? "justify-center" : "justify-between px-6"}`}
      >
        {/* Chỉ hiện chữ BeautyPals khi Sidebar mở */}
        {!isCollapsed && (
          <h1 className="text-2xl font-bold text-[#008B8B] whitespace-nowrap">
            BeautyPals
          </h1>
        )}

        {/* Nút Toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-gray-400 hover:text-[#008B8B] hover:bg-gray-50 p-2 rounded-lg transition-colors"
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
          {/* Chỉ hiện chữ khi Sidebar mở */}
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
    </aside>
  );
}
