import { useState, useEffect, useRef } from "react";
import { ShoppingCart, Menu, User, LogOut, ChevronDown } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Header({ onToggleMobileMenu }) {
  const [cartCount, setCartCount] = useState(0);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Đọc dữ liệu từ LocalStorage
  const updateCartCount = () => {
    try {
      const cart = JSON.parse(localStorage.getItem("cartItems")) || [];
      const total = cart.reduce(
        (sum, item) => sum + (Number(item.quantity) || 0),
        0,
      );
      setCartCount(total);
    } catch (error) {
      console.error("Lỗi đọc giỏ hàng:", error);
    }
  };

  // Lắng nghe sự kiện
  useEffect(() => {
    updateCartCount();
    window.addEventListener("cartUpdated", updateCartCount);
    window.addEventListener("storage", updateCartCount);

    // Quét liên tục mỗi 0.5s để chống miss sự kiện
    const interval = setInterval(updateCartCount, 500);

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
      window.removeEventListener("storage", updateCartCount);
      clearInterval(interval);
    };
  }, [location.pathname]);

  // Đóng menu profile khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center sticky top-0 z-40 h-[72px]">
      {/* VÙNG TRÁI: Đã xóa chữ BeautyPals, chỉ giữ lại nút Menu cho Mobile */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* VÙNG PHẢI: Giỏ hàng và Profile */}
      <div className="flex items-center gap-6">
        {/* ICON GIỎ HÀNG */}
        <div
          onClick={() => navigate("/cart")}
          className="relative cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center mr-2"
        >
          <ShoppingCart size={26} className="text-gray-700 relative z-10" />

          {/* CHỈ HIỂN THỊ CHẤM ĐỎ KHI CÓ SẢN PHẨM (>0) */}
          {cartCount > 0 && (
            <span className="absolute top-0 right-0 z-50 transform translate-x-1/4 -translate-y-1/4 bg-red-500 text-white text-[12px] font-bold min-w-[20px] h-[20px] px-1.5 rounded-full flex items-center justify-center border-2 border-white shadow-md">
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          )}
        </div>

        <div className="hidden sm:block w-px h-8 bg-gray-200" />

        {/* PROFILE USER */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 p-1"
          >
            {/* Avatar chữ AD giống y hệt trong ảnh chụp của bạn */}
            <div className="w-9 h-9 rounded-full bg-[#008B8B] text-white flex items-center justify-center font-bold text-sm tracking-wide shadow-sm">
              AD
            </div>

            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-gray-900">
                Quản Trị Viên BeautyPals
              </p>
              <p className="text-xs text-gray-500">admin@beautypals.com</p>
            </div>

            <ChevronDown size={16} className="text-gray-500 ml-1" />
          </button>

          {/* DROPDOWN MENU */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-lg border py-2 z-50">
              <button
                onClick={() => navigate("/profile")}
                className="w-full px-4 py-2 flex gap-3 hover:bg-gray-50 text-gray-700"
              >
                <User size={18} /> Thông tin cá nhân
              </button>
              <div className="border-t border-gray-100 my-1"></div>
              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  navigate("/login");
                }}
                className="w-full px-4 py-2 flex gap-3 text-red-600 hover:bg-red-50"
              >
                <LogOut size={18} /> Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
