import { Bell, Search, LogOut, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Header({ onToggleMobileMenu }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const displayName = user?.fullName || user?.username || "User";
  const initialChar = displayName.charAt(0).toUpperCase();

  return (
    <header className="h-16 sm:h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-8 flex-shrink-0 z-30">
      {/* Left: Mobile hamburger menu & mobile logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 rounded-xl text-gray-500 hover:text-[#008B8B] hover:bg-gray-100 transition-colors"
          title="Open Menu"
          aria-label="Toggle navigation menu"
        >
          <Menu size={22} />
        </button>

        <span className="md:hidden text-lg font-bold text-[#008B8B]">
          BeautyPals
        </span>
      </div>

      {/* Right: Actions & User Info */}
      <div className="flex items-center gap-2 sm:gap-5">
        {/* Quick Search */}
        <button
          className="text-gray-400 hover:text-[#008B8B] transition-colors p-2 rounded-lg hover:bg-gray-50"
          title="Search"
        >
          <Search size={19} />
        </button>

        {/* Notifications */}
        <button
          className="relative text-gray-400 hover:text-[#008B8B] transition-colors p-2 rounded-lg hover:bg-gray-50"
          title="Notifications"
        >
          <Bell size={19} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {/* User Profile button */}
        <div
          onClick={() => navigate("/profile")}
          className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition-opacity p-1 rounded-xl hover:bg-gray-50"
          title="View profile"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#caf8e4] text-[#008B8B] font-bold flex items-center justify-center overflow-hidden border border-teal-100 shadow-sm flex-shrink-0 text-sm">
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
          <span className="text-sm font-semibold text-gray-700 hidden sm:block truncate max-w-[120px]">
            {displayName}
          </span>
        </div>

        {/* Logout button */}
        <button
          onClick={logout}
          className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50"
          title="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
