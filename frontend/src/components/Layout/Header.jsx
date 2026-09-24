import { Bell, Search, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const displayName = user?.fullName || user?.username || "User";
  const initialChar = displayName.charAt(0).toUpperCase();

  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 flex-shrink-0">
      <div className="text-xl font-semibold text-gray-800">
        {/* Header title placeholder */}
      </div>

      <div className="flex items-center gap-6">
        {/* Quick Search */}
        <button className="text-gray-400 hover:text-[#008B8B] transition-colors" title="Search">
          <Search size={20} />
        </button>
        {/* Notifications */}
        <button className="relative text-gray-400 hover:text-[#008B8B] transition-colors" title="Notifications">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {/* User Profile button */}
        <div
          onClick={() => navigate("/profile")}
          className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity p-1.5 rounded-xl hover:bg-gray-50"
          title="View profile"
        >
          <div className="w-10 h-10 rounded-full bg-[#caf8e4] text-[#008B8B] font-bold flex items-center justify-center overflow-hidden border border-teal-100 shadow-sm">
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
          <span className="text-sm font-semibold text-gray-700 hidden sm:block">
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
