import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import Header from "./Header"; // Import Header vừa tạo

export default function MainLayout() {
  return (
    <div className="flex h-screen w-full bg-[#F4F6F6] overflow-hidden">
      {/* Cột trái: Thanh điều hướng (Giữ nguyên) */}
      <Sidebar />

      {/* Cột phải: Header + Nội dung chính */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header luôn cố định ở trên cùng */}
        <Header />

        {/* Vùng render component động (Dashboard hoặc Products) */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          {/* Nội dung trang sẽ được đẩy vào đây */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
