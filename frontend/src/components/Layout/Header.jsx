import { Bell, User, Search } from "lucide-react";

export default function Header() {
  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 flex-shrink-0">
      <div className="text-xl font-semibold text-gray-800">
        {/* Có thể đặt logic đổi tiêu đề trang ở đây sau này */}
      </div>

      <div className="flex items-center gap-6">
        {/* Nút tìm kiếm nhanh */}
        <button className="text-gray-400 hover:text-[#008B8B] transition-colors">
          <Search size={20} />
        </button>
        {/* Chuông thông báo */}
        <button className="relative text-gray-400 hover:text-[#008B8B] transition-colors">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        {/* User Profile */}
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-[#caf8e4] flex items-center justify-center text-[#008B8B] font-bold">
            D
          </div>
          <span className="text-sm font-medium text-gray-700 hidden sm:block">
            Tiến Đạt
          </span>
        </div>
      </div>
    </header>
  );
}
