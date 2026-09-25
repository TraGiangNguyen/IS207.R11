import { useState, useEffect, useRef } from "react";
import { ShoppingCart, Menu, User, LogOut, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Header({ onToggleMobileMenu }) {
  const [cartCount, setCartCount] = useState(0);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // ==========================
  // 1. LOGIC GIỎ HÀNG
  // ==========================
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

  // ==========================
  // 2. LOGIC PROFILE & ĐĂNG XUẤT
  // ==========================
  // Xử lý tự động đóng dropdown khi click ra ngoài
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
    // Thực tế: Xóa token/user info khỏi localStorage hoặc Context
    // localStorage.removeItem("token");
    // localStorage.removeItem("user");

    setIsProfileOpen(false);
    // Chuyển hướng người dùng về trang đăng nhập
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center sticky top-0 z-40 h-[72px]">
      {/* ---------------- CỤM BÊN TRÁI ---------------- */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#008B8B]"
          aria-label="Mở menu"
        >
          <Menu size={24} />
        </button>

        <h1
          className="text-2xl font-bold text-[#008B8B] cursor-pointer hidden md:block"
          onClick={() => navigate("/products")}
        >
          Sellzy
        </h1>
      </div>

      {/* ---------------- CỤM BÊN PHẢI ---------------- */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Nút Giỏ Hàng */}
        <div
          className="relative cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-colors mr-2"
          onClick={() => navigate("/cart")}
        >
          <ShoppingCart size={24} className="text-gray-700" />
          {cartCount > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-[11px] font-bold w-5 h-5 flex items-center justify-center rounded-full transform translate-x-1 -translate-y-1 shadow-sm">
              {cartCount}
            </span>
          )}
        </div>

        {/* Đường gạch dọc phân cách */}
        <div className="hidden sm:block w-px h-8 bg-gray-200"></div>

        {/* Nút Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-1 pl-2 rounded-full hover:bg-gray-50 transition-colors focus:outline-none"
          >
            {/* Ảnh Avatar giả lập từ ui-avatars */}
            <img
              src="https://ui-avatars.com/api/?name=Admin&background=008B8B&color=fff"
              alt="Avatar"
              className="w-9 h-9 rounded-full object-cover border border-gray-100"
            />
            <div className="hidden md:block text-left mr-1">
              <p className="text-sm font-semibold text-gray-700 leading-none">
                Quản trị viên
              </p>
              <p className="text-[11px] text-gray-500 mt-1 leading-none">
                admin@sellzy.com
              </p>
            </div>
            <ChevronDown
              size={16}
              className={`text-gray-500 hidden md:block transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`}
            />
          </button>

          {/* Nội dung Dropdown */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 origin-top-right">
              <div className="px-4 py-3 border-b border-gray-100 md:hidden">
                <p className="text-sm font-bold text-gray-800">Quản trị viên</p>
                <p className="text-xs text-gray-500">admin@sellzy.com</p>
              </div>

              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  navigate("/profile");
                }}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#008B8B] flex items-center gap-3 transition-colors"
              >
                <User size={18} />
                Thông tin cá nhân
              </button>

              <div className="h-px bg-gray-100 my-1"></div>

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
              >
                <LogOut size={18} />
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
