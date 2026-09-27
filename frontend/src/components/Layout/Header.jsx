import { useState, useEffect, useRef } from "react";
import { ShoppingCart, Menu, User, LogOut, ChevronDown } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom"; // Thêm useLocation

export default function Header({ onToggleMobileMenu }) {
  const [cartCount, setCartCount] = useState(0);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation(); // Dùng để ép update khi chuyển trang

  // ==========================
  // HÀM TÍNH SỐ LƯỢNG GIỎ HÀNG (CỘNG DỒN TẤT CẢ SẢN PHẨM)
  // ==========================
  const updateCartCount = () => {
    try {
      const cart = JSON.parse(localStorage.getItem("cartItems")) || [];
      const total = cart.reduce(
        (sum, item) => sum + (Number(item.quantity) || 0),
        0,
      );
      setCartCount(total);
    } catch (error) {
      console.error("Lỗi đọc giỏ hàng trên Header:", error);
      setCartCount(0);
    }
  };

  // ==========================
  // LẮNG NGHE SỰ KIỆN
  // ==========================
  useEffect(() => {
    // 1. Chạy ngay khi component mount
    updateCartCount();

    // 2. Ép chạy lại mỗi khi đường dẫn URL thay đổi (VD: từ Home -> Cart)
    updateCartCount();

    // 3. Lắng nghe event tuỳ chỉnh từ ProductCard (bấm add to cart)
    window.addEventListener("cartUpdated", updateCartCount);

    // 4. Lắng nghe thay đổi Storage từ tab khác
    window.addEventListener("storage", updateCartCount);

    // 5. Polling 500ms một lần (Bảo đảm tuyệt đối không bao giờ trượt số)
    const interval = setInterval(updateCartCount, 500);

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
      window.removeEventListener("storage", updateCartCount);
      clearInterval(interval);
    };
  }, [location.pathname]); // Hook sẽ kích hoạt lại khi chuyển trang

  // ==========================
  // ĐÓNG MENU PROFILE KHI CLICK RA NGOÀI
  // ==========================
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
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center sticky top-0 z-40 h-[72px]">
      {/* ================= LEFT ================= */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>

        <h1
          onClick={() => navigate("/products")}
          className="text-2xl font-bold text-[#008B8B] cursor-pointer hidden md:block hover:opacity-80 transition-opacity"
        >
          BeautyPals
        </h1>
      </div>

      {/* ================= RIGHT ================= */}
      <div className="flex items-center gap-4">
        {/* === GIỎ HÀNG (ĐÃ FIX UI CHẤM ĐỎ) === */}
        <div
          onClick={() => navigate("/cart")}
          className="relative cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center"
          title="Xem giỏ hàng"
        >
          {/* Đảm bảo icon có z-index thấp hơn chấm đỏ */}
          <ShoppingCart size={26} className="text-gray-700 relative z-10" />

          {/* CHẤM ĐỎ - Chỉnh lại padding, font-size và z-index để luôn nổi */}
          {cartCount > 0 && (
            <span className="absolute top-0 right-0 z-50 transform translate-x-1/4 -translate-y-1/4 bg-red-500 text-white text-[12px] font-bold min-w-[20px] h-[20px] px-1.5 rounded-full flex items-center justify-center border-2 border-white shadow-md animate-bounce">
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          )}
        </div>

        <div className="hidden sm:block w-px h-8 bg-gray-200" />

        {/* === PROFILE === */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-1 hover:opacity-80 transition-opacity"
          >
            <img
              src="https://ui-avatars.com/api/?name=Admin&background=008B8B&color=fff"
              alt="Avatar"
              className="w-9 h-9 rounded-full"
            />
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-gray-900">
                Quản Trị Viên BeautyPals
              </p>
              <p className="text-xs text-gray-500">admin@beautypals.com</p>
            </div>
            <ChevronDown size={16} className="text-gray-500" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-lg border py-2 z-50">
              <button
                onClick={() => navigate("/profile")}
                className="w-full px-4 py-2 flex gap-3 hover:bg-gray-50 text-gray-700 items-center transition-colors"
              >
                <User size={18} />
                Thông tin cá nhân
              </button>

              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 flex gap-3 text-red-600 hover:bg-red-50 items-center transition-colors"
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
