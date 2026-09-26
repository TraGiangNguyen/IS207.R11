import { useState, useEffect, useRef } from "react";
import {
  ShoppingCart,
  Menu,
  User,
  LogOut,
  ChevronDown,
  Bell,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Header({ onToggleMobileMenu }) {
  const [cartCount, setCartCount] = useState(0);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(totalItems);
  };

  useEffect(() => {
    updateCartCount();
    window.addEventListener("cartUpdated", updateCartCount);
    return () => window.removeEventListener("cartUpdated", updateCartCount);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsProfileOpen(false);
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 py-3 px-6 flex justify-between items-center sticky top-0 z-40 h-[72px]">
      {/* ================= CỤM TRÁI: CHỈ CÒN NÚT MENU MOBILE ================= */}
      <div className="flex items-center gap-4">
        {/* Nút Hamburger (Chỉ hiện trên Mobile) */}
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none"
        >
          <Menu size={24} />
        </button>

        {/* ĐÃ XÓA CHỮ "Sellzy" Ở ĐÂY */}
      </div>

      {/* ================= CỤM PHẢI: ACTIONS & PROFILE ================= */}
      <div className="flex items-center gap-2 sm:gap-4">
        <div
          className="relative p-2 text-gray-600 hover:bg-gray-50 rounded-full cursor-pointer transition-colors"
          onClick={() => navigate("/cart")}
          title="Giỏ hàng"
        >
          <ShoppingCart size={24} />
          {cartCount > 0 && (
            <span className="absolute top-0 right-0 bg-[#ef4444] text-white text-[11px] font-bold w-[22px] h-[22px] flex items-center justify-center rounded-full transform translate-x-1 -translate-y-1 border-2 border-white shadow-sm">
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          )}
        </div>

        <div
          className="relative p-2 text-gray-600 hover:bg-gray-50 rounded-full cursor-pointer transition-colors hidden sm:block"
          title="Thông báo"
        >
          <Bell size={24} />
          <span className="absolute top-1.5 right-1.5 bg-[#008B8B] w-2.5 h-2.5 rounded-full border-2 border-white"></span>
        </div>

        <div className="hidden sm:block w-px h-8 bg-gray-200 mx-2"></div>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 p-1.5 pr-2 rounded-full hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all focus:outline-none"
          >
            <img
              src={
                user?.avatarUrl ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || "User")}&background=008B8B&color=fff&rounded=true&bold=true`
              }
              alt="Avatar"
              className="w-9 h-9 rounded-full object-cover shadow-sm border border-teal-100"
            />
            <div className="hidden md:flex flex-col items-start">
              <span className="text-sm font-bold text-gray-800 leading-none mb-1">
                {user?.fullName || (user?.role === "customer" ? "Khách hàng" : "Quản trị viên")}
              </span>
              <span className="text-[11px] text-gray-500 leading-none">
                {user?.role === "customer" ? "Tài khoản Khách hàng" : user?.email || "admin@beautypals.com"}
              </span>
            </div>
            <ChevronDown
              size={16}
              className={`text-gray-400 hidden md:block transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 origin-top-right animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-3 border-b border-gray-50 md:hidden">
                <p className="text-sm font-bold text-gray-800">
                  {user?.fullName || (user?.role === "customer" ? "Khách hàng" : "Quản trị viên")}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{user?.email || "customer@beautypals.com"}</p>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    navigate("/profile");
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-[#f4f9f9] hover:text-[#008B8B] flex items-center gap-3 transition-colors"
                >
                  <User size={18} />
                  Hồ sơ cá nhân
                </button>
              </div>

              <div className="h-px bg-gray-100 my-1"></div>

              <div className="py-1">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                >
                  <LogOut size={18} />
                  Đăng xuất
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
